const express = require('express');
const router = express.Router();
// const cloudinary = require('./../utils/cloudinary');
const upload = require('./../utils/multer');

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

const {verifyToken, verifyAdmin, decode} = require('./../token/token')

//create
router.post('/addUser', upload.single('image'), async (req, res) => {
	try{
		// const result = await cloudinary.uploader.upload(req.file.path)
		// res.json(result)

		await addNewUser(req.body, req.file.path).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})


//user login
router.post('/login', (req, res) => {
	try{
		login(req.body).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// get all users
router.get('/allUsers', verifyAdmin, (req, res) => {
	try{
		allUsers(req.body).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// get only active users
router.get('/activeUsers', verifyAdmin, (req, res) => {
	try{
		activeUsers().then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

//get all not active users - unActiveusers
router.get('/unActiveUsers', verifyAdmin, (req, res) => {
	try{
		unActiveUsers().then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// archive user account
router.patch('/archive/:userId', verifyAdmin, (req, res) => {
	try{
		archive(req.params.userId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

// unarchive user account 
router.patch('/unArchive/:userId', verifyAdmin, (req, res) => {
	try{
		unArchive(req.params.userId).then(response => res.send(response))
	}catch(err){
		res.json(err)
	}
})

//delete a user
router.delete('/deleteUser/:userId', verifyToken, (req, res) => {
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
router.put('/profile', upload.single('image'), async (req, res) => {
	try{
		let id = decode(req.headers.authorization)._id
		await profile(id, req.body, req.file.path).then(response => res.send(response))

	}catch(err){
		res.json(err)
	}
})


module.exports = router