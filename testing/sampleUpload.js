const uploadToContent = require('../UploadToContent.js');
const authenticateUser = require('./AuthenticateUser.js');
const fileToBase64 = require('../FileToBase64');
require('dotenv').config(); 

const HOST_URL = process.env.HOST_URL;
const MODULE_ID = process.env.MODULE_ID;
const ORG_UNIT_ID = process.env.ORG_UNIT_ID;

const sampleTestUpload = async (file) => {
  const authToken = (await authenticateUser()).token; 
  const fileParts = file.split('.');
  const fileData = await fileToBase64(`sample_files/${file}`);
  const fileName = fileParts[0];
  const fileExtension = fileParts[1];
  const res = await uploadToContent(HOST_URL, ORG_UNIT_ID, MODULE_ID, fileName, fileData, fileExtension, authToken);
  return res;
}

module.exports = sampleTestUpload;