// For use in the browser, or in environments with access to Blobs
const blobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

module.exports = blobToBase64;
