const _encodeChar = function( char ) {
	return '\\u' + ( '0000' + char.charCodeAt(0).toString(16) ).slice( -4 );
};

export default {
	serialize( payload ) {
		const boundary = payload.boundary;

		let jsonPart = '--' + boundary + '\r\n';
		jsonPart += 'Content-Type: application/json\r\n';
		jsonPart += '\r\n';
		jsonPart += JSON.stringify( payload.topic ).replace( /[\u007F-\uFFFF]/g, _encodeChar ) + '\r\n';
		jsonPart += '--' + boundary + '\r\n';

		let filePart = 'Content-Disposition: form-data; name:\"\"; filename=\"' + payload.file.filename + '\"\r\n';
		filePart += 'Content-Type: ' + payload.file.contentType + '\r\n\r\n';
		const buf = payload.file.fileData;
		filePart += buf;
		filePart += '\r\n';
		filePart += '--' + boundary + '--';
		return jsonPart + filePart;
	},
};