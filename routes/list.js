const express = require('express')
const router = express.Router();
const List = require('../models/newwish')
const Wishlist = require('../models/newwish')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

// router.get('/new/wishlist', (req, res) =>{
//     res.render('wishlist/newwish')
// })

// router.get('/new/wishlist/list', async (req, res)=>{
//     const wishlists = await List.find({}).sort({ date: -1})
//     res.render('wishlist/congrats', {wishlists})
// })

// router.get('/:id/add', async (req, res) =>{
    
//     const list = await List.findOne({_id: req.params.id})
//     res.render('wishlist/page', {list})
// })
// //Submitting New Wishlist Form
// router.post('/new', async(req, res) =>{
//     try{
//     const wishlist = new List({})
//     wishlist.name = req.body.name
//     await wishlist.save();
//     req.flash('success', 'Successfully created a new wishlist')
//     res.redirect(`/${wishlist._id}/add`)
//     //res.redirect('/new/wishlist/list')
//     //res.redirect('/')
//     }catch(e){
//         req.flash('error', e.message)
//         res.redirect('register')
//     }
// })
//Submitting Wish Items Forms
// router.post('/:id/add', upload.array('image'),  (req, res) =>{
//     List.findOne({_id: req.params.id}).then(
//         (list) => {
//             const wishlist = new Wishlist();

//             wishlist.name  = req.body.name;
//             wishlist.wishID = list.id;
//             wishlist.save()
            
//         }
//     ).catch(
//         (err)=> console.log(err)
//     )
//     // List.findOne({_id: req.params.id})
//     // const wishlist = new Wishlist(req.body.wishlist)
//     // wishlist.images = req.files.map(f =>({ url: f.path, filename: f.filename}))
//     // wishlist.author = req.user._id;
//     // await wishlist.save();
//     // console.log(wishlist)
//     // req.flash('success', 'Successfully made a new wishlist')
//     // res.redirect(`/wishlists/${wishlist._id}`)
// })

module.exports = router;