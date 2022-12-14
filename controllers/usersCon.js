const User = require('./../models/User');
const {accessToken} = require('./../token/token');
const CryptoJS = require("crypto-js");
const cloudinary = require('./../utils/cloudinary');

// create
module.exports.addNewUser = async (params, filepath) => {
	const result = await cloudinary.uploader.upload(filepath)

	const newUser = new User({
		username: params.username,
		password: CryptoJS.AES.encrypt(params.password, process.env.JWT_SECRET).toString(),
		avatar: result.secure_url,
		cloudinary_id: result.public_id
	})

	return User.findOne({username: params.username}).then(users => {
		if(users === null || users.length <= 0){
			return newUser.save().then(result => result)
		} else {
			return 'User already exists'
		}
	})
}


//login user
module.exports.login = (params) => {
	const {username, password} = params

	return User.findOne({username: username}).then(user => {
		if(user === null){
			return `No ${username} exists`
		} else {
			// Decrypt the password before comparing pw from user pw input
			const decrypted  = CryptoJS.AES.decrypt(user.password, process.env.JWT_SECRET);
			const dpw = decrypted.toString(CryptoJS.enc.Utf8);

			if(dpw === password){
				//invoke createToken function to return token
				return {token: accessToken(user)}
			}else{
				return 'Password did not match'
			}
		}
	})
}

// get all Users
module.exports.allUsers = () => {
	return User.find().then(users => users)
}

// get only active Users
module.exports.activeUsers = () => {
	//first, find all Users
	return User.find().then(users => {
		const {isActive, isAdmin} = users

		//second, find Users using isActive filter
		return User.find({isActive: true, isAdmin: false}).then(result => {
			if(result === null || result.length <= 0){
				return 'No Users available'
			}else{
				return result
			}
		})
	})
}

//get all unactive Users
module.exports.unActiveUsers = () => {
	//first, find all Users
	return User.find().then(users => {
		const {isActive, isAdmin} = users

		//second, find Users using isActive filter
		return User.find({isActive: false, isAdmin: false}).then(result => {
			if(result === null || result.length <= 0){
				return 'No Users available'
			}else{
				return result
			}
		})
	})
}

// archive User
module.exports.archive = (userId) => {
	//find the User using id, then update isActive to false
	return User.findByIdAndUpdate(userId, {isActive: false}, {new: true}).then(user => user)
}

// unArchive User
module.exports.unArchive = (userId) => {
	//find the User using id, then update isActive to false
	return User.findByIdAndUpdate(userId, {isActive: true}, {new: true}).then(user => user)
}

//delete a User
module.exports.deleteUser = async (userId) => {
	//find the User using id and delete it from db
	return await User.findByIdAndDelete(userId).then(response => {

		//delete the cloudinary id using the user object found from mongoose method delete
		cloudinary.uploader.destroy(response.cloudinary_id)

		return response ? true : {message: 'Request unsuccessful. Please try again.'}
	})
}


// Admin User
module.exports.isAdmin = (userId) => {
	//find the User using id, then update isAdmin to false
	return User.findByIdAndUpdate(userId, {isAdmin: true}, {new: true}).then(user => user)
}

// Regular User
module.exports.isUser = (userId) => {
	//find the User using id, then update isAdmin to false
	return User.findByIdAndUpdate(userId, {isAdmin: false}, {new: true}).then(user => user)
}

//update user profile
module.exports.profile = async (userId, params, filepath) => {

	//find the user
	let findUser = await User.findById(userId);

	//destroy the image using cloudinary id from found user
	await cloudinary.uploader.destroy(findUser.cloudinary_id);

	// upload the new image
	let result = await cloudinary.uploader.upload(filepath)

	// attached the new cloudinary id and url to the update
	const updateProfile = {
		username: params.username,
		password: CryptoJS.AES.encrypt(params.password, process.env.JWT_SECRET).toString(),
		avatar: result.secure_url,
		cloudinary_id: result.public_id
	}

	// update the user
	return await User.findByIdAndUpdate(userId, updateProfile, {new: true}).then(user => user)
}
