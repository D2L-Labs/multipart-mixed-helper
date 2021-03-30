const uploadToContent = require('../UploadToContent.js');
const request = require('superagent');
const fs = require('fs').promises
require('dotenv').config(); 

const USR_NAME = process.env.USR_NAME;
const USR_PWD = process.env.USR_PWD;
const HOST_URL = process.env.HOST_URL;

const MODULE_ID = process.env.MODULE_ID;
const ORG_UNIT_ID = process.env.ORG_UNIT_ID;


const mimeTypes = {
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  csv: "text/csv",
  pdf: "application/pdf"
}

const base64Encode = async (file) => {
  // read binary data
  var bitmap = await fs.readFile(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

const authenticateAdmin = async () => {
  try {
    const agent = request.agent();
    await agent.post(`${HOST_URL}/d2l/lp/auth/login/login.d2l`)
      .type('form')
      .send({ loginPath: '/d2l/login' })
      .send({ userName: USR_NAME })
      .send({ password: USR_PWD });
    
    let resCsrf;
    try {
      resCsrf = await agent.get(`${HOST_URL}/d2l/lp/auth/xsrf-tokens`);
    } catch (e) {
      throw new Error('Incorrect username or password');
    }
    
    const csrf = resCsrf.body.referrerToken;
    const resToken = await agent.post(`${HOST_URL}/d2l/lp/auth/oauth2/token`)
      .type('form')
      .set({ 'X-Csrf-Token': csrf })
      .send({ scope: '*:*:*' });

    const authToken = resToken.body.access_token;
    const authExpiresAt = resToken.body.expires_at;

    const authReturn = {
      token: authToken,
      expiry: (authExpiresAt * 1000),
    };

    return authReturn;
  } catch (err) {
    const errMessage = `Failed to authenticate user ${USR_NAME} (${err.message})`;
    throw new Error(errMessage);
  }
}

const runTest = async (file) => {
  const authToken = (await authenticateAdmin()).token; 
  let fileParts = file.split('.');
  const fileData = await base64Encode(`sample_files/${file}`);
  let fileName = fileParts[0];
  let fileExtension = fileParts[1];
  let fileType = {
    ending: fileExtension,
    mimeType: mimeTypes[fileExtension],
  };
  const createSubPostRoute = `/d2l/api/le/1.50/${ORG_UNIT_ID}/content/modules/${MODULE_ID}/structure/?base64=1`;
  const fullRequestUrl = HOST_URL + createSubPostRoute;
  const res = await uploadToContent(fullRequestUrl, fileName, fileData, fileType, authToken);
  return res;
}

module.exports = runTest;