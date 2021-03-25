import MultipartSerializer from "./MultipartMixedHelper.js";

export default function sendMultipartMixedRequest(url, topic, file, token) {
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
    topic: topic,
    file: file,
	};
	
  const request = new XMLHttpRequest();

	return new Promise(function (resolve, reject) {
		request.onreadystatechange = function () {
      if (request.readyState !== 4) return;

			if (request.status >= 200 && request.status < 300) {
				resolve(request);
			} else {
				reject({
					status: request.status,
					statusText: request.statusText
				});
			}
		};
		
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "multipart/mixed; boundary=" + boundary);
    request.setRequestHeader("Authorization", "Bearer " + token);
    request.send(MultipartSerializer.serialize(payload));
	})
};

