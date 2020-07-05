import React, { useState, useEffect, createContext } from 'react';

export const AppContext = createContext();
export default function(props) {
	const [ rs, setRs ] = useState(0);
	const [ ws, setWs] = useState(null); 
	const [ wsId, setWsId ] = useState('');


	const request = async (jwt,type,data) => {
		let payload = {
			jwt,
			type,
			data
		}
		ws.send(JSON.stringify(payload));
	}
	
	const heartbeat = async (ws) => {
		setTimeout(
			function() {
				/*  0 	CONNECTING 	Socket has been created. The connection is not yet open.
					1 	OPEN 	The connection is open and ready to communicate.
					2 	CLOSING 	The connection is in the process of closing.
					3 	CLOSED 	The connection is closed or couldn't be opened.	
				*/					
				if(rs !== ws.readyState) {
					setRs(ws.readyState);
				}	
				heartbeat(ws)
			}
			.bind(this),
			1000
		);
	}
	
	const configureWebsocket = async() => {
		ws.onopen = function(open_event) {	
			ws.onmessage = function(event) {
				console.log(event);
				let tjo = JSON.parse(event.data);
				
			
				switch(tjo['type']) {
					case "client-websocket-id":
						setWsId(tjo['data']);	
						break;
					case "requested-google-oauth-url":
						window.location.href = tjo['data'];
						break;
					default:
						break;
				}
					
			}
			
			ws.onclose = function(close_event) {
				console.log('WS_CLOSE_EVENT: ',close_event);
			}
			
			ws.onerror = function(error_event) {
				console.log('WS_ERROR_EVENT: ',error_event);
			}				
		}
	}
	
	useEffect(() => {	
		if(ws === null) { setWs(new WebSocket('wss://void.pr0con.com:1300/ws')) }
		if(ws !== null && rs === 0) { configureWebsocket(); heartbeat(ws); } 
	},[ws,rs]);
	
	
	const handleGoogleLogin = () => {
		if(rs === 1) {
			request(null,'request-google-oauth-url',null)
		}
	}
	
	/* 
		Extract Google Code from URL 
	*/
	useEffect(() => {
		if(rs === 1) {
			const url = new URL(window.location.href);
			if(url.searchParams.get('code')) {
				let code = url.searchParams.get('code');
				request(null,'login-with-google-code',code);
			}
		}
	},[rs])
	
	return(
		<AppContext.Provider value={{
			rs,
			wsId,
			request,
			
			handleGoogleLogin
		}}>
			{ props.children }
		</AppContext.Provider>
	)	
}