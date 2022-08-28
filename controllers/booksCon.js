const Book = require('./../models/Book');
const cloudinary = require('./../utils/cloudinary');

// create
module.exports.addNewBook = async (params, filepath) => {

	const result = await cloudinary.uploader.upload(filepath)

	const newBook = new Book({
		name: params.name,
		author: params.author,
		genre: params.genre,
		isAvailable: params.isAvailable,
		avatar: result.secure_url,
		cloudinary_id: result.public_id
	})

	return Book.findOne({name: params.name}).then(books => {
		if(books === null){
			return newBook.save().then(result => result)
		} else {
			return 'book already exists'
		}
	})
}

// get all books
module.exports.allBooks = () => {
	return Book.find().then(books => books)
}

// get only active books
module.exports.activeBooks = () => {
	//first, find all books
	return Book.find().then(books => {

		//second, find books using isAvailable filter
		return Book.find({isAvailable: true}).then(books => {
			if(books === null || books.length <= 0){
				return 'No books available'
			}else{
				return books
			}
		})
	})
}

//get all unactive books
module.exports.unActiveBooks = () => {
	//first, find all books
	return Book.find().then(books => {

		//second, find books using isAvailable filter
		return Book.find({isAvailable: false}).then(books => {
			if(books === null || books.length <= 0){
				return 'No books available'
			}else{
				return books
			}
		})
	})
}

// archive book
module.exports.archive = (bookId) => {
	//find the book using id, then update isAvailable to false
	return Book.findByIdAndUpdate(bookId, {isAvailable: false}, {new: true}).then(book => book)
}

// unArchive book
module.exports.unArchive = (bookId) => {
	//find the book using id, then update isAvailable to false
	return Book.findByIdAndUpdate(bookId, {isAvailable: true}, {new: true}).then(book => book)
}

//delete a book
module.exports.deleteBook = async (bookId) => {

	//find the book using id and delete it from db
	return await Book.findByIdAndDelete(bookId).then(response => {

		//delete the cloudinary id using the user object found from mongoose method delete
		cloudinary.uploader.destroy(response.cloudinary_id)

		return response ? true : {message: 'Request unsuccessful. Please try again.'}
	})
}


//update book info
module.exports.updateBook = async (bookId, params, filepath) => {

	//find the book
	let findBook = await Book.findById(bookId);

	//destroy the image using cloudinary id from found user
	await cloudinary.uploader.destroy(findBook.cloudinary_id);

	// upload the new image
	let result = await cloudinary.uploader.upload(filepath)

	// attached the new cloudinary id and url to the update
	const updatedBook = {
		name: params.name,
		author: params.author,
		genre: params.genre,
		avatar: result.secure_url,
		cloudinary_id: result.public_id
	}

	// update the user
	return await Book.findByIdAndUpdate(bookId, updatedBook, {new: true}).then(book => console.log(book))
}


