const Telegraf = require(`telegraf`);
const Attheme = require(`attheme-js`);
const { testTheme } = require(`attheme-rules`);
const request = require(`request-promise`);

const { token, options } = require(`./config`);
const localization = require(`./localization`);
const atthemeEditor = require(`./attheme-editor-api`);

const bot = new Telegraf(token, options);

const MAX_LOG_LENGTH = 3000;

const processTestResults = (testResults) => {
  if (testResults.length === 0) {
    return localization.en.noBugs();
  }

  let log = ``;

  const sortedRules = testResults.sort((firstRule, secondRule) => {
    if (firstRule.type === `error` && secondRule.type === `warning`) {
      return -1;
    }

    if (secondRule.type === `error` && firstRule.type === `warning`) {
      return 1;
    }

    return 0;
  });

  for (let i = 0; i < sortedRules.length; i++) {
    const rule = sortedRules[i];

    log += localization.en.rules[rule.name](rule.variables);

    if (log.length > MAX_LOG_LENGTH) {
      log += localization.en.tooManyIssues();

      break;
    }
  }

  const message = localization.en.issuesLog(log);

  return message;
};

bot.context.downloadFile = async function (isFromReply) {
  const file = isFromReply ?
    await bot.telegram.getFile(this.message.reply_to_message.document.file_id)
    : await bot.telegram.getFile(this.message.document.file_id);

  const result = await request({
    encoding: null,
    uri: `http://api.telegram.org/file/bot${token}/${file.file_path}`,
  });

  return result;
};

bot.context.sendChatAction = function (action) {
  bot.telegram.sendChatAction(this.chat.id, action);
};

bot.context.startSendingChatAction = function (action = `typing`) {
  const interval = setInterval(() => this.sendChatAction(action), 4 * 1000);

  this.sendChatAction(action);

  const stop = () => clearInterval(interval);

  return { stop };
};

bot.context.MARKDOWN = {
  parse_mode: `Markdown`, // eslint-disable-line camelcase
};

bot.command(`start`, async (context) => {
  const { message: { text } } = context;

  if (text === `/start`) {
    context.reply(localization.en.start(), context.MARKDOWN);
  } else {
    const typing = context.startSendingChatAction();

    try {
      const themeId = text.slice(`/start `.length);
      const { content } = await atthemeEditor.download(themeId);
      const theme = new Attheme(content);
      const testResults = testTheme(theme);

      context.reply(
        processTestResults(testResults),
        context.MARKDOWN,
      );
    } catch (error) {
      console.log(error);
      context.reply(localization.en.themeAlreadyDownloaded(), context.MARKDOWN);
    } finally {
      typing.stop();
    }
  }
});

bot.command(`help`, (context) => {
  context.reply(localization.en.help(), {
    ...context.MARKDOWN,
    disable_web_page_preview: true, // eslint-disable-line camelcase
  });
});

bot.on(`document`, async (context) => {
  const { message: { document } } = context;

  if (`file_name` in document && document.file_name.endsWith(`.attheme`)) {
    const typing = context.startSendingChatAction();
    const themeBuffer = await context.downloadFile();
    const theme = new Attheme(themeBuffer.toString(`binary`));
    const testResults = testTheme(theme);

    context.reply(
      processTestResults(testResults),
      context.MARKDOWN,
    );

    typing.stop();
  } else {
    context.reply(localization.en.wrongFile(), context.MARKDOWN);
  }
});

bot.startPolling();
console.log(`@${options.username} is running…`);