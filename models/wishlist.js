const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//const User = require('./user')

const ImageSchema = new Schema({
    url: String, 
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200')
});

const WishlistSchema = new Schema({

    image: String,
    title: String,
    description: String,
    price: Number,
    images: ImageSchema,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    } 
})

module.exports = mongoose.model('Wishlist', WishlistSchema);