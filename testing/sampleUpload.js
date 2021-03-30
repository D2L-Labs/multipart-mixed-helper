const uploadToContent = require('../UploadToContent.js');
const fileToBase64 = require('../FileToBase64');
const request = require('superagent');
require('dotenv').config(); 

const USR_NAME = process.env.USR_NAME;
const USR_PWD = process.env.USR_PWD;
const HOST_URL = process.env.HOST_URL;

const MODULE_ID = process.env.MODULE_ID;
const ORG_UNIT_ID = process.env.ORG_UNIT_ID;



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
  const fileParts = file.split('.');
  const fileData = await fileToBase64(`sample_files/${file}`);
  const fileName = fileParts[0];
  const fileExtension = fileParts[1];
  const res = await uploadToContent(HOST_URL, ORG_UNIT_ID, MODULE_ID, fileName, fileData, fileExtension, authToken);
  return res;
}

module.exports = runTest;