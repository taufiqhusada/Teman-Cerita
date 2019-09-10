const express = require('express');
const router = express.Router();
const Posting = require('../models/Posting');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');
var mongoose = require('mongoose');

// display post menu
router.get('/', (req,res) => res.render('displayPosts'));

// get all post in Posting collection from database
router.get('/getPosts', (req,res,next)=> {
    Posting.find((err,posts) => {
        if (err) return next(new Error(err));
        else res.json(posts);
    })
})

// get all post in Posting collection from specific user
router.get('/getUserPosts', (req,res,next)=> {
    Posting.find({userID:req.user._id},(err,posts) => {
        if (err) return next(new Error(err));
        else res.json(posts);
    })
})


// get post with specific post id
router.get('/getThisPost/:id', (req,res,next)=> {
    Posting.find({_id:req.params.id},(err,posts) => {
        if (err) return next(new Error(err));
        else res.json(posts);
    })
})

// render to create post menu
router.get('/createPost',  ensureAuthenticated, (req, res) => 
    res.render('createPost',
      {user: req.user})
    );

// submiting post
router.post('/createPost', (req,res)=>{
    const userID = req.user._id;  // get user id
    const userName = req.user.name;
    var datePosted = new Date()
    //console.log(userID);
    const { postTitle, postContent } = req.body;    // get title and content
    const newPost = new Posting({   // create new object
        userID,
        userName,
        title: postTitle,
        content: postContent,
        datePosted
    });
    newPost.save()        // saving new post 
        .then(posts => {
            req.flash(
                'success_msg',
            );
            res.redirect('/posting/createPost');
            })
        .catch(err => console.log(err));

    Posting.find().sort({datePosted: -1});
})

router.get('/delete/:id', (req, res, next)=> {
    var id = req.params.id;     // posting id
    Posting.findByIdAndRemove(id, (err, post)=> {   // remove post with that id
      console.log(id);
      if (err) {        
        return next(new Error('post was not found'))
      }
      else{
        req.flash('success_msg', 'that post successfully deleted');
        res.redirect('/posting/');
      }
    })
})

router.get('/update/:id', (req,res,next)=>{
    res.render('editPost', {
      id: req.params.id
    })
})


router.post('/update/:id', (req, res, next) => {
    var id = req.params.id
    const postTitle = req.body.postTitle;
    const postContent = req.body.postContent;
    console.log(postTitle, postContent);
    var item = {
        title : postTitle,
        content: postContent
    }
    Posting.findByIdAndUpdate(id, {$set: item}, (err,post)=>{
      console.log(id);
      console.log(item);
      //console.log(id, item);
      if (err) {        
        return next(new Error('post was not found'))
      }
      else{
        req.flash('success_msg', 'that post successfully updated');
        res.redirect('/posting/');
      }
    })
    Posting.find().sort({datePosted: -1});
})

module.exports = router;