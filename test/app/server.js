/* eslint-disable no-console */
'use strict';

const express = require('express');
const app = express();
const PORT = 5656;
const path = require('path');

app.get('/', function (req, res){
	app.use(express.static(path.resolve(__dirname, 'public')));
	res.sendFile(path.resolve(__dirname, './index.html'));
});

app.listen(PORT);

console.log('listening on %s', PORT);
