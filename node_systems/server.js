const utils = require('./utilz.js'); 
const uWS = require('uWebSockets.js');

const { v1: uuidv1 } = require('uuid');

function payload(type, data) {
	let payload = {
		type,
		data
	}
	return payload
}

const app = uWS.SSLApp({
	cert_file_name: utils['system_configuration']['letsencrypt']['public_key_path'],
	key_file_name: utils['system_configuration']['letsencrypt']['private_key_path'],
}).ws('/ws', {
	compression: uWS.SHARED_COMPRESSOR,
	maxPayloadLength: 16 * 1024 * 1024,
	idleTimeout: 0,
	
	upgrade: (res, req, context) => {
		//console.log(req);
		utils.logData('An Http connection wants to become WebSocket, URL: ' + req.getUrl() + '!');
		
		/* Keep track of abortions */
		const upgradeAborted = { aborted: false };
		
		/* You MUST register an abort handler to know if the upgrade was aborted by peer */		
		res.onAborted(() => {
	    	/* We can simply signal that we were aborted */
			utils.logData('Foreign Abort Handler Executed...');
			upgradeAborted.aborted = true;
		});
		
		if (req.getHeader('origin') === "https://void.pr0con.com") {				
			res.upgrade({url: req.getUrl() },
	    		/* Spell these correctly */
		    	req.getHeader('sec-websocket-key'),
				req.getHeader('sec-websocket-protocol'),
				req.getHeader('sec-websocket-extensions'),
			context);			
		}else {
			utils.logData('Killed Foreign Request.');  res.close();
		}
	},
	open: async (ws) => {
		utils.logData('A WebSocket connected via address: ' + utils.ArrayBufferToString(ws.getRemoteAddressAsText()) + '!');
		ws.id = "ws-"+uuidv1();
		
		console.log(ws.id);
		ws.send(JSON.stringify(payload('client-websocket-id', ws.id)));
		
	},
	message: async (ws, message) => {
		let tjo = JSON.parse(utils.ArrayBufferToString(message));
		
		switch(tjo['type']) {
			case "request-google-oauth-url":
				let google_oauth_url = utils.Google.authUrl;
				ws.send(JSON.stringify(payload('requested-google-oauth-url', google_oauth_url)));
				break;
				
			case "login-with-google-code":
				let code = tjo['data'];
				let user = await utils.Google.logIn(code);
				console.log(user);
				
				
				break;
			default:
				break;
		}
		
	},
	drain: (ws) => {
		utils.logData('WebSocket Back Pressure: ' + ws.getBufferedAmount());
	},
	close: async (ws, code, message) => {
		utils.logData('WebSocket closed');
	}		
	
}).listen(1300, async (sock) => {
	(sock) ? utils.logData('Server Listening : 1300') : utils.logData("Something went horribly wrong.");
});