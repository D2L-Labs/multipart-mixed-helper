import Q from "q";
import MultipartSerializer from "./MultipartMixedHelper.js";

export default function sendMultipartMixedRequest(url, requestData, file, token) {
  if (!XMLHttpRequest.prototype.sendAsBinary) {
    XMLHttpRequest.prototype.sendAsBinary = function (sData) {
      const nBytes = sData.length,
        ui8Data = new Uint8Array(nBytes);
      for (let nIdx = 0; nIdx < nBytes; nIdx++) {
        ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
      }
      this.send(ui8Data);
    };
  }

  const boundary = new Date().getTime() + "SmartC";
  const payload = {
    boundary: boundary,
    requestData: requestData,
    file: file,
  };
  const deferred = Q.defer();
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "multipart/mixed; boundary=" + boundary);
  xhr.setRequestHeader("Authorization", "Bearer " + token);
  xhr.send(MultipartSerializer.serialize(payload));
  // xhr.sendAsBinary( MultipartSerializer.serialize( payload) );

  return deferred.promise;
}
