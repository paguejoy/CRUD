const express = require('express');
const router = express.Router();

const {
	addNewBook, 
	allBooks, 
	activeBooks,
	archive,
	unActiveBooks,
	unArchive,
	deleteBook
} = require('./../controllers/booksCon');

//create
router.post('/addBook', (req, res) => {
	try{
		addNewBook(req.body).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// get all books
router.get('/allBooks', (req, res) => {
	try{
		allBooks(req.body).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// get only active books
router.get('/availableBooks', (req, res) => {
	try{
		activeBooks().then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

//get all not active books - unActiveBooks
router.get('/unAvailableBooks', (req, res) => {
	try{
		unActiveBooks().then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// update books not available
router.patch('/archive/:bookId', (req, res) => {
	try{
		archive(req.params.bookId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// update books to available 
router.patch('/unArchive/:bookId', (req, res) => {
	try{
		unArchive(req.params.bookId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

//delete a book
router.delete('/deleteBook/:bookId', (req, res) => {
	try{
		deleteBook(req.params.bookId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

module.exports = router