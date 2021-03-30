// For use in Node.js
const fs = require('fs').promises;

const fileToBase64 = async (file) => {
  var bitmap = await fs.readFile(file);
  return new Buffer(bitmap).toString("base64");
};

module.exports = fileToBase64;
