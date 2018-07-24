import marked from 'marked';
import bcrypt from 'bcrypt';
import express from 'express';

import PostModel from './models/post';
import * as auth from './middlewares/auth';

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET posts page. */
router.get('/posts', function(req, res, next) {
  res.render('posts', { title: '我的文章'} );
});

/* GET posts create page. */
router.get('/posts/create', auth.adminRequired, function(req, res, next) {
  res.render('create');
});

/* GET posts show page. */
router.get('/posts/show', function (req, res, next) {
  var id = req.query.id;
  
  PostModel.findOne({_id: id}, function (err, post) {
    post.mkContent = marked(post.content);
    res.render('show', {post});
  });
});

/* GET posts edit page. */
router.get('/posts/edit', function (req, res, next) {
    var id = req.query.id;
    res.render('edit', { id });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('signup');
});

/* GET signin page. */
router.get('/signin', function (req, res, next) {
  res.render('signin');
});

export default router;