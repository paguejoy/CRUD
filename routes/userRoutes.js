const express = require('express');
const router = express.Router();


const {
	addNewUser, 
	allUsers, 
	activeUsers,
	archive,
	unActiveUsers,
	unArchive,
	deleteUser,
	isAdmin,
	isUser,
	login,
	profile
} = require('./../controllers/usersCon');

const {verifyToken, decode} = require('./../token/token')

//create
router.post('/addUser', (req, res) => {
	try{
		addNewUser(req.body).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

router.post('/login', (req, res) => {
	try{
		login(req.body).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// get all users
router.get('/allUsers', verifyToken, (req, res) => {
	try{
		allUsers(req.body).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// get only active users
router.get('/activeUsers', (req, res) => {
	try{
		activeUsers().then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

//get all not active users - unActiveusers
router.get('/unActiveUsers', (req, res) => {
	try{
		unActiveUsers().then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// update users not available
router.patch('/archive/:userId', (req, res) => {
	try{
		archive(req.params.userId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// update users to available 
router.patch('/unArchive/:userId', (req, res) => {
	try{
		unArchive(req.params.userId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

//delete a user
router.delete('/deleteUser/:userId', (req, res) => {
	try{
		deleteUser(req.params.userId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// update status to Admin
router.patch('/isAdmin/:userId', (req, res) => {
	try{
		isAdmin(req.params.userId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// update status to become regular user
router.patch('/isUser/:userId', (req, res) => {
	try{
		isUser(req.params.userId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

//update user profile
router.put('/profile', verifyToken, (req, res) => {
	try{
		let id = decode(req.headers.authorization)._id
		profile(id, req.body).then(response => res.send(response))

	}catch(err){
		res.json(err)
	}
})


module.exports = router