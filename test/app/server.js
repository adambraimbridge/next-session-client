'use strict';

var express = require('express');
var app = express();
var PORT = 5656;
var path = require('path');

app.get('/', function(req, res){
	app.use(express.static(path.resolve(__dirname, 'public')));
	res.sendFile(path.resolve(__dirname, './index.html'));
});

app.listen(PORT);

console.log('listening on %s', PORT);
