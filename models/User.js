const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, 'username is required'],
		unique: true
	},
	password: {
		type: String,
		required: [true, 'password is required']
	},
	isAdmin: {
		type: Boolean,
		default: false
	},
	isActive: {
		type: Boolean,
		default: true
	},
	avatar: {
		type: String
	},
	cloudinary_id: {
		type: String
	}
})

module.exports = mongoose.model('User', userSchema);