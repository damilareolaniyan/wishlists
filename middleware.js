const Wishlist = require('./models/wishlist')

module.exports.isLoggedIn = (req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', ' Kindly log in')
        return res.redirect('/login')
    }
    next()
}

//IS AUTHOR MIDDLEWARE
module.exports.isAuthor = async(req, res, next)=>{
    const { id } = req.params;
    const wishlist = await Wishlist.findById(id)
    if(!wishlist.author.equals(req.user._id)){
        req.flash('error', 'You did not have permission')
        return res.redirect(`/wishlists/${id}`)
    }
    next();
}