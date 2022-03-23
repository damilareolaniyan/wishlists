const express = require('express')
const router = express.Router();
const List = require('../models/newwish')
const Wishlist = require('../models/wishlist')
const {isLoggedIn, isAuthor, isPublic } = require('../middleware')
const multer = require('multer')
const { cloudinary, storage } = require('../cloudinary')
const upload = multer({ storage })

//const upload = multer({ dest: 'uploads/'})

//All Main Page
router.get('/wishlists', async (req, res) =>{
    const wishlists = await Wishlist.find({}).sort({ date: -1})
     res.render('wishlist/index', {wishlists})
})

//About Page
router.get('/about', (req, res) =>{
    res.render('wishlist/about')
})

//Privacy Page
router.get('/privacy', (req, res) =>{
    res.render('wishlist/privacy')
})

//Terms Page
router.get('/terms', (req, res) =>{
    res.render('wishlist/terms')
})

//Show Wishlist Form
router.get('/wishlists/new/item', isLoggedIn, (req, res) =>{
    res.render('wishlist/congrats')
})

//Dashboard Page
router.get('/wishlists/dashboard', isLoggedIn, async (req, res) =>{
    let user = req.user.id;
    const wishlists = await List.find({authorID: user}).sort({ date: -1}).populate('author')

    //console.log(wishlists)

    res.render('wishlist/dashboard', {wishlists})
})



//Submitting Creating New Wishlist
router.post('/wishlists/new', isLoggedIn, async (req, res)=>{
    const wishlist = new List(req.body.wishlist)
    wishlist.authorID = req.user.id;
    //console.log(wishlist.authorID);
    await wishlist.save();
    res.redirect(`/wishlists/${wishlist._id}`)
})

/

//Show Individual Wishlists
router.get('/wishlists/:id', async(req, res) =>{
    const wishlist = await List.findById(req.params.id).populate('items')
    if(!wishlist){
        req.flash('error', 'Wishlist not found')
        return res.redirect('/')
    }
    //console.log(wishlist.images)
res.render('wishlist/page', {wishlist})

})
//Public Page 
router.get('/wishlists/:id/share', async(req, res) =>{
    
    //const { public } = req.query;
    const wishlist = await List.findById(req.params.id).populate('items')
    res.render('wishlist/public', {wishlist})
})

//Edit Page
router.get('/wishlists/edit/:id', isLoggedIn,  async(req, res) =>{
    const itemId = req.params.id;
    const wishlist = await Wishlist.findById(itemId)
    if(!wishlist){
        req.flash('error', 'Cannot find that wishlist')
        return res.redirect('/')
    }
    

    res.render('wishlist/edit', {wishlist})
})
//Update Post
router.post('/wishlists/edit/:id',  isLoggedIn, upload.array('image'),(req, res) =>{
    let wishlist = {};
    wishlist.title = req.body.title;
    wishlist.price = req.body.price;
    wishlist.description = req.body.description;
    wishlist.images = req.files.map(i =>({ url: i.path, filename: i.filename}));
    wishlist.author = req.user._id;

    let query = {_id: req.params.id}

    

    //console.log(query);
    //console.log(wishlist);

    Wishlist.updateOne(query, wishlist).then(
        () => {
            res.redirect('/wishlists/dashboard');
        }
    )
    
})
//Wishlist Delete
router.delete('/wishlists/:id', async (req, res)=>{
    const { id } = req.params
    await List.findByIdAndDelete(id)
    req.flash('success', 'Wishlist deleted')
    res.redirect(`/`)
})

//Wishlist Items Delete
router.delete('/wishlists/:id/items/:itemId', async (req, res) =>{
    const { id, itemId } = req.params
    await List.findByIdAndUpdate(id, { $pull: {items: itemId}})
    await Wishlist.findByIdAndDelete(itemId)
    req.flash('success', 'Wishlist deleted')
    res.redirect(`/wishlists/${id}`)
    //res.send("It workeds")
})

//Submitting Wish Items Forms
router.post('/wishlists/:id/items', upload.array('image'),  async(req, res) =>{
    const wishlist = await List.findById(req.params.id);
      const item = new Wishlist(req.body.wishlist);
      item.images = req.files.map(i =>({ url: i.path, filename: i.filename}))
      
      wishlist.items.push(item)
      await item.save();
      //console.log(item)
      await wishlist.save()
      
      req.flash('success', 'New item succesfully added')
      res.redirect(`/wishlists/${wishlist._id}`)
})

module.exports = router;
