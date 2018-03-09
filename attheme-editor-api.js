const request = require(`request-promise`);

const urls = {
  upload:
    () => `https://snejugal.ru/attheme-editor/load-theme/`,
  download:
    (id) => `https://snejugal.ru/attheme-editor/get-theme/?themeId=${id}`,
  openInEditor:
    (id) => `https://snejugal.ru/attheme-editor/?themeId=${id}`,
};

const upload = async (themeName, content) => {
  const themeId = await request({
    uri: urls.upload(),
    method: `post`,
    body: JSON.stringify({
      name: themeName,
      content: content.toString(`base64`),
    }),
  });

  return themeId;
};

const download = async (themeId) => {
  try {
    const themeData = await request(urls.download(themeId));
    const parsed = JSON.parse(themeData);

    parsed.content = Buffer.from(parsed.content, `base64`).toString(`binary`);

    return parsed;
  } catch (error) {
    console.log(error);

    throw new Error(`The theme is already downloaded`);
  }
};

const getOpenInEditorLink = (themeId) => urls.openInEditor(themeId);

module.exports = {
  upload,
  download,
  getOpenInEditorLink,
};