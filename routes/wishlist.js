const express = require('express')
const router = express.Router();
const List = require('../models/newwish')
const Wishlist = require('../models/wishlist')
const {isLoggedIn, isAuthor } = require('../middleware')
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

//Show Wishlist Form
router.get('/wishlists/new/item', isLoggedIn, (req, res) =>{
    res.render('wishlist/congrats')
})

//Dashboard Page
router.get('/wishlists/dashboard', isLoggedIn, async (req, res) =>{
    const wishlists = await List.find({}).sort({ date: -1})
    res.render('wishlist/dashboard', {wishlists})
})



//Submitting Creating New Wishlist
router.post('/wishlists/new', async (req, res)=>{
    const wishlist = new List(req.body.wishlist)
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
    console.log(wishlist)
res.render('wishlist/page', {wishlist})

})

//Edit Page
router.get('/wishlists/:id/edit', isLoggedIn, isAuthor, async(req, res) =>{
    const { id } = req.params;
    const wishlist = await Wishlist.findById(id)
    if(!wishlist){
        req.flash('error', 'Cannot find that wishlist')
        return res.redirect('/')
    }
    

    res.render('wishlist/edit', {wishlist})
})
//Update Post
router.put('wishlists/:id', isLoggedIn, isAuthor, upload.array('image'), async (req, res) =>{
    const { id } = req.params
    const wishlist = await Wishlist.findByIdAndUpdate(id, { ...req.body.wishlist})
    const imgs = req.files.map(f =>({ url: f.path, filename: f.filename}))
    wishlist.images.push(...imgs)
    await wishlist.save()
    if(req.body.deleteImages){
        for( let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename)
        }
        await wishlist.updateOne({ $pull: { images: {filename: { $in: req.body.deleteImages}}}})
    }
    req.flash('success', 'Successfully updated')
    //res.send('Updated Okay')
    res.redirect(`/wishlists/${wishlist._id}`)
})

router.delete('wishlists/:id', isLoggedIn, isAuthor, async (req, res) =>{
    const { id } = req.params
    await Wishlist.findByIdAndDelete(id)
    req.flash('success', 'Wishlist deleted')
    res.redirect('/')
    //res.send("It worked")
})

//Submitting Wish Items Forms
router.post('/wishlists/:id/items', upload.array('image'),  async(req, res) =>{
    const wishlist = await List.findById(req.params.id)
      const item = new Wishlist(req.body.wishlist)
      item.images = req.files.map(f =>({ url: f.path, filename: f.filename}))
      //item.author = req.user._id;
      wishlist.items.push(item)
      await item.save();
      console.log(item)
      await wishlist.save()
      
      req.flash('success', 'Successfully made a new wishlist')
      res.redirect(`/wishlists/${wishlist._id}`)
})

module.exports = router;