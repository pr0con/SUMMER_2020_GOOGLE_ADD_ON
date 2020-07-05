const os = require('os');
const fs = require('fs');

const { google } = require('googleapis');

function logData(message) {
	var d = new Date();
	var time = '[' + d.getHours() + ':' + d.getMinutes() + ':' +d.getSeconds() + '] ';
	
	console.log(time + message);
}

const system_configuration = {
	"oauth": {
		"google": {
			"app_id": "663786600395-kqaivhphkekefvi9ac0d9ahipsogk3fp.apps.googleusercontent.com",
			"app_secret": "irgoBPuM8a35KqGC_LYhRAot",
			"redirect_url": "https://void.pr0con.com"
		}
	},
	"letsencrypt": {
		"public_key_path": "/etc/letsencrypt/live/void.pr0con.com/fullchain.pem",
		"private_key_path": "/etc/letsencrypt/live/void.pr0con.com/privkey.pem"
	},	
}

const goauth = new google.auth.OAuth2(
	system_configuration['oauth']['google']['app_id'],
	system_configuration['oauth']['google']['app_secret'],
	system_configuration['oauth']['google']['redirect_url']
);


const Google = {
	authUrl: goauth.generateAuthUrl({
		access_type: 'online',
		scope: [
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile"
		]
	}),
	logIn: async (code) => {
		const { tokens } = await goauth.getToken(code)
		await goauth.setCredentials(tokens);
		
	    const { data } = await google.people({ version: "v1", auth: goauth }).people.get({
	      resourceName: "people/me",
	      personFields: "emailAddresses,names,photos"
	    });	
	    
	    return data;
	}
}


module.exports = {
	logData,
	system_configuration,
	
	Google,
	
	ArrayBufferToString: function(buffer, encoding) {
		if (encoding == null) encoding = 'utf8';
		return Buffer.from(buffer).toString(encoding);
	},		
}