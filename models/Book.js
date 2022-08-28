const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'book name is required']
	},
	author: {
		type: String,
		required: [true, 'author name is required']
	},
	genre: {
		type: Array,
		required: []
	},
	isAvailable: {
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

module.exports = mongoose.model('Book', bookSchema);