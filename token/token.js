const jwt = require('jsonwebtoken');


module.exports.accessToken = (userData) => {
	const {username, isAdmin, _id} = userData
	const data = {
		username,
		isAdmin,
		_id
	}

	return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });
}

module.exports.verifyToken = (req, res, next) => {
	let token = req.headers.authorization;

	if(token === null || token === undefined){
		res.send('Token missing')
	}else{
		let bt = token.slice(7, token.length)
		return jwt.verify(bt, process.env.JWT_SECRET, (err, response) => {
			if(err){
				res.json(err)
			}else{
				next()
			}
		})
	}
}

module.exports.decode = (token) => {

	let bt = token.slice(7, token.length)
	return jwt.decode(bt, {complete: true}).payload
}
