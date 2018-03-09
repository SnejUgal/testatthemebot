/* eslint-disable max-len */

const en = {
  start: () => `Hi! I'm a bot that tests .attheme's for potentional issues. Just send me one!`,
  help: () => `*Hi!* I'm a bot that tests .attheme files for potentional issues. To try me, just send me one.

I distinguish two types of issues: *errors* and *warnings*. When I find an error, you should probably fix it, because it may lead to usability decrease.

When I report a warning, it's up to you whether you'll follow it: warnings are recommendations that may improve your theme. But because I'm silly I can't always give you right recommendations.

If you're a developer and you're curious how to test .attheme's by yourself, check out this [npm package](https://npmjs.com/package/attheme-rules) — I'm based on this.

If you like me, tell my hoster @snejugal about it. If not, tell him why you don't. This will make me better, making me better makes themes better, better themes make you happy (don't they?) 😊`,
  noBugs: () => `Your theme is okay! I couldn't find any issues with it (but I'm still learning to test themes, so one day I will find them).`,
  issuesLog: (log) => `I've found some issues with your theme. You can ignore warns but you must fix errors.\n\n${log}`,
  tooManyIssues: () => `…and some more issues I couldn't fit in one message. Fix these ones first!`,
  wrongFile: () => `Hmm, are you sure you sent me an .attheme file? I only can test .attheme files.`,
  themeAlreadyDownloaded: () => `Hmm, it looks like the theme is already downloaded or it has expired.`,

  rules: {
    "purple-variables": (variables) => `*Warning: Purple variables*
Porting a theme with @themesporterbot, it may leave some variables in purple if it doesn't know an equivalent variable in the desktop theme. Make sure that these variables must be \`#ff00ff\`, if not, fix them.
${variables.map((variable) => `• \`${variable}\``).join(`\n`)}\n\n`,
    "invisible-elements": (variables) => `*Error: Invisible elements*
You have some elements that are invisible in your theme but are really important. You must fix these as soon as possible.
${variables.map((variable) => `• \`${variable}\``).join(`\n`)}\n\n`,
  },
};

module.exports = {
  en,
};