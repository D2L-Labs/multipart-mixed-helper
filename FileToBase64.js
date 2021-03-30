// For use in Node.js
const fs = require('fs').promises;

const fileToBase64 = async (file) => {
  const rawData = await fs.readFile(file);
  return new Buffer(rawData).toString("base64");
};

module.exports = fileToBase64;
