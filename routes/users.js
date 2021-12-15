const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/user');

router.get('/register', (req, res) =>{
    res.render('users/register')
})
router.post('/register', async(req, res, next) =>{
    try{
        const {email, username, password } = req.body
        const user = new User({ email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err =>{
            if(err) return next(err)
            //req.flash('success', 'Register success')
            res.redirect('/wishlists/dashboard')
        })
    }catch(e){
        req.flash('error', e.message)
        res.redirect('register')
    }
   
})

router.get('/login', (req, res) =>{
    res.render('users/login')
})

router.get('/test', (req, res)=>{
    res.render('wishlist/test')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), (req, res) =>{
    //req.flash('success', 'Welcome back')
    res.redirect('/wishlists/dashboard')
})
router.get('/logout', (req, res)=>{
    req.logout();
    //req.flash('success', 'Bye')
    res.redirect('/')
})
module.exports = router;