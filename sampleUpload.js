const sendMultipartMixedRequest = require('./ServiceHelper.js')
const request = require('superagent');
const fs = require('fs').promises
require('dotenv').config();

const ADMIN_USR = process.env.ADMIN_USR;
const ADMIN_PWD = process.env.ADMIN_PWD;
const HOST_URL = process.env.HOST_URL;

const MODULE_ID = process.env.MODULE_ID;
const ORG_UNIT_ID = process.env.ORG_UNIT_ID;
const D2L_ROUTE = process.env.D2L_ROUTE;

const mimeTypes = {
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  csv: "text/csv",
  pdf: "application/pdf"
}

async function authenticateAdmin() {
  try {
    const agent = request.agent();

    await agent.post(`${HOST_URL}/d2l/lp/auth/login/login.d2l`)
      .type('form')
      .send({ loginPath: '/d2l/login' })
      .send({ userName: ADMIN_USR })
      .send({ password: ADMIN_PWD });
    
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
    const errMessage = `Failed to authenticate user ${ADMIN_USR} (${err.message})`;
    throw new Error(errMessage);
  }
}

async function runTest(file) {
  const authToken = (await authenticateAdmin()).token; 
    let fileParts = file.split('.');
    let fileContent = await fs.readFile(file, 'utf-8');
    let fileName = fileParts[0];
    let fileExtension = fileParts[1];
    let fileType = {
      ending: fileExtension,
      mimeType: mimeTypes[fileExtension],
    };
   const res = await fileUpload(fileName, fileContent, fileType, authToken);
   return res;
}

const fileUpload = async (fileName, fileContent, fileType, authToken) => {
  try{
    const createSubPostRoute = `/d2l/api/le/1.50/${ORG_UNIT_ID}/content/modules/${MODULE_ID}/structure/?base64=1`;

    const requestData = {
      Title: fileName,
      ShortTitle: fileName,
      Type: 1,
      TopicType: 1,
      Url: `${fileName}.${fileType.ending}`,
      StartDate: null,
      EndDate: null,
      DueDate: null,
      IsHidden: false,
      IsLocked: false,
      OpenAsExternalResource: false,
      Description: null,
    };
  
    const file = {
      contentType: fileType.mimeType,
      filename: `${fileName}.${fileType.ending}`,
      fileData: fileContent,
    };
  
    const res = await sendMultipartMixedRequest(
      D2L_ROUTE + createSubPostRoute,
      requestData,
      file,
      authToken
    );
  
    return res;
  }
  catch(err) {
    console.log(err)
  }
  
};

module.exports = runTest;