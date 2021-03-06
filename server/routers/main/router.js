'use strict';

const express = require('express');
const cors = require('cors');

const GET = require('./methods/get');
const POST = require('./methods/post');
const PUT = require('./methods/put');
const DELETE = require('./methods/delete');

const chamber = require('../../chamber');
const templateEngine = require('../../templateEngine');



const router = express.Router();
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// router.use(cors());


/* --- GET Routes --- */



router.get('/', function(request, response) {
  GET.welcome_page(request, response);
});

router.get('/signup', function(request, response) {
  GET.signup_page(request, response);
});

router.get('/signin', function(request, response) {
  GET.signin_page(request, response);
});

router.get('/signout', function(request, response){
  GET.sign_out(request, response);
});

router.get('/account', chamber.GET_SessionRequired, function(request, response) {
  GET.account_page(request, response);
});



router.get('/test_route', function(request, response){
  GET.test_route(request, response);
});

router.get('/check_session', function(request, response){
  GET.check_session(request, response);
});



/* --- POST Routes --- */



router.post('/sign_up', function(request, response){
  POST.sign_up(request, response);
});



/* --- PUT Routes --- */



router.put('/sign_in', function(request, response){
  PUT.sign_in(request, response);
});

router.put('/sign_out', function(request, response){
  PUT.sign_out(request, response);
});

router.put('/update_icon', chamber.SessionRequired, function(request, response){
  PUT.update_icon(request, response);
});

router.put('/change_user_password', chamber.SessionRequired, function(request, response){
  PUT.change_user_password(request, response);
});



/* --- DELETE Routes --- */







/* --- exports --- */

module.exports = {
  router
}
