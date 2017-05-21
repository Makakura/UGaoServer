const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
Book =require('./models/book');
// Connect to Mongoose

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
	res.send('Please use /api/books or /api/genres');
});
app.get('/api/books', (req, res) => {
	Book.getBooks((err, books) => {
		if(err){
			throw err;
		}
		res.json(books);
	});
});

app.get('/api/messages/:_id', (req, res) => {
	Book.getBookById(req.params._id, (err, book) => {
		if(err){
			throw err;
		}
		res.json(book);
	});
});

app.post('/api/hetgao', (req, res) => {
	var jsonString = req.headers.authorization;
	console.log("Post Form ESP8266 Het Gao");	
	console.log("header: "+jsonString);
	res.json(req.headers.authorization);
});
app.post('/api/congao', (req, res) => {
	var jsonString = req.headers.authorization;
	console.log("Post Form ESP8266 Con Gao");	
	console.log("header: "+jsonString);
	res.json(req.headers.authorization);
});

app.put('/api/messages/:_id', (req, res) => {
	var id = req.params._id;
	var book = req.body;
	Book.updateBook(id, book, {}, (err, book) => {
		if(err){
			throw err;
		}
		res.json(book);
	});
});

app.delete('/api/messages/:_id', (req, res) => {
	var id = req.params._id;
	Book.removeBook(id, (err, book) => {
		if(err){
			throw err;
		}
		res.json(book);
	});
});

// Run localy
//app.listen(3000);
//console.log('Running on port 3000...');

// Run on server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
