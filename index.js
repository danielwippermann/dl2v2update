/*! dl2v2update | Copyright (c) 2014-2016, Daniel Wippermann | MIT license */
'use strict';



var fs = require('fs');
var http = require('http');
var os = require('os');
var path = require('path');


var express = require('express');



var config = {
	/*
	 * The webserver will start to listen on this TCP port for update queries.
	 */
	port: 3000,
};


var publicDirectory = path.join(__dirname, './public');


var app = express();


app.use(express.logger('default'));
app.use(express.static(publicDirectory));


var infoByToken = {
	'DL2v1': {
		description: 'RESOL DL2 Version 2.1.5 (201602081156)',
		firmwarePath: 'RESOL_DL2-2.1.5-201602081156-Firmware/RESOL/DL2',
		format: 'yml',
	},
	'DL2v2': {
		description: 'RESOL DL2 Version 2.1.5 (201602081156)',
		firmwarePath: 'RESOL_DL2-2.1.5-201602081156-Firmware/RESOL/DL2',
		format: 'json',
	},
	'DL3': {
		description: 'RESOL DL3 Version 2.1.5 (201602080850)',
		firmwarePath: 'RESOL_DL3-2.1.5-201602080850-Firmware/RESOL/DL3',
		format: 'json',
	},
	'KM1': {
		description: 'RESOL KM1 Version 2.1.5 (201602081152)',
		firmwarePath: 'RESOL_KM1-2.1.5-201602081152-Firmware/RESOL/KM1',
		format: 'json',
	},
};


app.get('/api/update/:token', function(req, res) {
	res.redirect('/');
});


app.get('/api/update/:token/query', function(req, res) {
	var token = req.params.token;
	if (!infoByToken.hasOwnProperty(token)) {
		res.status(404).end('Four-O-Four');
	} else {
		var info = infoByToken [token];
		var binaryUrl = 'http://' + req.headers.host + info.binaryUrlSuffix;

		var content;
		if (info.format === 'yml') {
			content = info.infoContent;
			content += ':uptodate_image_url: ' + binaryUrl + '\n';
			res.end(content);
		} else if (info.format === 'json') {
			var jsonContent = JSON.parse(info.infoContent);
			jsonContent.uptodate_image_url = binaryUrl;
			content = JSON.stringify(jsonContent);
			res.end(content);
		} else {
			res.status(500).end('Five-O-0');
		}
	}
});


app.get('/api/update/:token/installed', function(req, res) {
	res.end('+OK');
});


Object.keys(infoByToken).forEach(function(token) {
	var info = infoByToken [token];

	var binaryUrlSuffix = '/' + info.firmwarePath + '/firmware.bin';

	var firmwareDirectory = path.resolve(publicDirectory, info.firmwarePath);

	var stats;
	try {
		stats = fs.statSync(firmwareDirectory);
	} catch (ex) {
		return;
	}
	if (!stats || !stats.isDirectory()) {
		return;
	}

	var binaryFilename = path.resolve(firmwareDirectory, 'firmware.bin');
	try {
		stats = fs.statSync(binaryFilename);
	} catch (ex) {
		return;
	}
	if (!stats || !stats.isFile()) {
		return;
	}

	var infoFilename;
	if (info.format === 'yml') {
		infoFilename = path.resolve(publicDirectory, info.firmwarePath, 'firmware.yml');
	} else if (info.format === 'json') {
		infoFilename = path.resolve(publicDirectory, info.firmwarePath, 'firmware.json');
	} else {
		throw new Error('Token "' + token + '" uses unknown format "' + info.format + '"');
	}

	try {
		stats = fs.statSync(infoFilename);
	} catch (ex) {
		return;
	}
	if (!stats || !stats.isFile()) {
		return;
	}

	var content = fs.readFileSync(infoFilename).toString('utf-8');

	info.isValid = true;
	info.infoContent = content;
	info.binaryUrlSuffix = binaryUrlSuffix;
});


app.listen(config.port, function() {
	console.log('Server started, happy updating...');

	console.log('');
	console.log('URLs:');

	var ifaces = os.networkInterfaces();
	Object.keys(ifaces).sort().forEach(function(ifName) {
		ifaces [ifName].forEach(function(iface) {
			if ((iface.family === 'IPv4') && !iface.internal) {
				console.log('    - http://' + iface.address + ':' + config.port + '/api/update/<token>');
			}
		});
	});

	console.log('');
	console.log('Valid values for <token>:');
	Object.keys(infoByToken).sort().forEach(function(token) {
		var info = infoByToken [token];
		if (info.isValid) {
			console.log('    ' + token + '  =>  ' + info.description);
		}
	});
});
