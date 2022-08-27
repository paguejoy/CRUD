const Book = require('./../models/Book');

// create
module.exports.addNewBook = (params) => {
	const {name, author, genre, isAvailable} = params

	const newBook = new Book({
		name,
		author,
		genre,
		isAvailable
	})

	return Book.findOne({name: name}).then(books => {
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
module.exports.deleteBook = (bookId) => {
	//find the book using id and delete it from db
	return Book.findByIdAndDelete(bookId).then(response => {
		console.log(response)
		return response ? true : {message: 'Request unsuccessful. Please try again.'}
	})
}


