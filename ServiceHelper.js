import Q from 'q';
import Request from 'superagent';
import Auth from 'superagent-d2l-session-auth';
import AppContext from '../react/appContext.js';
import {ErrorActions} from 'react-outcomes-error-alert';
import MultipartSerializer from './MultipartMixedHelper.js';
import Jwt from 'frau-jwt';
import AppStatus from '../react/stores/AppStatus.js';
import Dispatcher from '../react/dispatcher.js';
import ActionNames from '../react/actions/ActionNames.js';

if ( !XMLHttpRequest.prototype.sendAsBinary ) {
	XMLHttpRequest.prototype.sendAsBinary = function( sData ) {
		const nBytes = sData.length, ui8Data = new Uint8Array( nBytes );
		for ( let nIdx = 0; nIdx < nBytes; nIdx++ ) {
			ui8Data[nIdx] = sData.charCodeAt( nIdx ) & 0xff;
		}
		this.send( ui8Data );
	};
}

// function _getHost( baseUrl ) {
// 	return /https?:\/\/([^\/]+).*/.exec(baseUrl)[1];
// }

// function _handleResponse( err, res, deferred, returnRawResponse ) {
// 	if ( err || !res ) {
// 		ErrorActions.showServerErrorAlert( err );
// 		const data = { Err: err, Res: res };
// 		deferred.reject( data );
// 	} else {
// 		if ( AppStatus.isHealthy() ) {
// 			ErrorActions.hideErrorAlertIfVisible();
// 		}

// 		const payload = returnRawResponse ? res.text : res.body;
// 		deferred.resolve( payload ? payload : {} );
// 	}
// }

// function _handleAjaxResponse( status, responseText, deferred ) {
// 	if (status === 200) {
// 		if ( AppStatus.isHealthy() ) {
// 			ErrorActions.hideErrorAlertIfVisible();
// 		}
// 		deferred.resolve(JSON.parse(responseText));
// 	} else {
// 		ErrorActions.showServerErrorAlert( responseText );
// 		deferred.reject(responseText);
// 	}
// }

// function _initCancellationToken( cancellationToken, request ) {
// 	if ( typeof cancellationToken !== 'object' ) {
// 		return;
// 	}

// 	cancellationToken.isCancelled = false;
// 	cancellationToken.cancel = function() {
// 		cancellationToken.isCancelled = true;
// 		request.abort();
// 	};
// }

export default {
	// sendGETRequest( url, cancellationToken, returnRawResponse, options = {} ) {
	// 	const deferred = Q.defer();

	// 	const request = Request
	// 		.get( url )
	// 		.use( Auth( { trustedHost: _getHost( AppContext.getValenceHost() ) } ) );

	// 	if ( options.query ) {
	// 		request.query( options.query );
	// 	}

	// 	request.end( ( err, res ) => {
	// 		_handleResponse( err, res, deferred, returnRawResponse );
	// 	});

	// 	_initCancellationToken( cancellationToken, request );

	// 	return deferred.promise;
	// },

	// sendPUTRequest( url, payload, cancellationToken ) {
	// 	const deferred = Q.defer();

	// 	const request = Request
	// 		.put( url )
	// 		.use( Auth( { trustedHost: _getHost( AppContext.getValenceHost() ) } ) )
	// 		.send( payload )
	// 		.end( ( err, res ) => {
	// 			_handleResponse( err, res, deferred );
	// 		});

	// 	_initCancellationToken( cancellationToken, request );

	// 	return deferred.promise;
	// },

	// sendPOSTRequest( url, payload, cancellationToken ) {
	// 	const deferred = Q.defer();

	// 	const request = Request
	// 		.post( url )
	// 		.use( Auth( { trustedHost: _getHost( AppContext.getValenceHost() ) } ) )
	// 		.send( payload )
	// 		.end( ( err, res ) => {
	// 			_handleResponse( err, res, deferred );
	// 		});

	// 	_initCancellationToken( cancellationToken, request );

	// 	return deferred.promise;
	// },

	// sendDELETERequest( url, cancellationToken, returnRawResponse ) {
	// 	const deferred = Q.defer();

	// 	const request = Request
	// 		.delete( url )
	// 		.use( Auth( { trustedHost: _getHost( AppContext.getValenceHost() ) } ) );

	// 	request.end( ( err, res ) => {
	// 		_handleResponse( err, res, deferred, returnRawResponse );
	// 	});

	// 	_initCancellationToken( cancellationToken, request );

	// 	return deferred.promise;
	// },

	// sendMultipartPUTRequest( url, fileData, cancellationToken ) {
	// 	const deferred = Q.defer();

	// 	const request = Request
	// 		.put( url )
	// 		.use( Auth( { trustedHost: _getHost( AppContext.getValenceHost() ) } ) )
	// 		.attach( 'file', fileData )
	// 		.end( ( err, res ) => {
	// 			_handleResponse( err, res, deferred );
	// 		});

	// 	_initCancellationToken( cancellationToken, request );

	// 	return deferred.promise;
	// },

	sendMultipartMixedRequest( url, topic, file ) {
		const boundary = new Date().getTime() + 'SmartC';
		const payload = {
			boundary: boundary,
			topic: topic,
			file: file,
		};
		const deferred = Q.defer();
		Jwt().then( function(token) {
			const xhr = new XMLHttpRequest();
			// xhr.onreadystatechange = function() {
			// 	if (this.readyState === 4 ) {
			// 		_handleAjaxResponse( this.status, this.responseText, deferred );
			// 	}
			// };
			// xhr.upload.addEventListener( 'progress', progressEvent => {
			// 	Dispatcher.dispatch({
			// 		actionType: ActionNames.FILE_UPLOAD_PROGRESS,
			// 		bytesUploaded: progressEvent.loaded,
			// 		bytesTotal: progressEvent.lengthComputable ? progressEvent.total : null,
			// 	}, /* prevent global refresh: */ true );
			// });
			xhr.open('POST', url, true);
			xhr.setRequestHeader('Content-Type', 'multipart/mixed; boundary=' + boundary);
			xhr.setRequestHeader('Authorization', 'Bearer ' + token);
			xhr.sendAsBinary( MultipartSerializer.serialize( payload) );
		});
		return deferred.promise;
	},
};