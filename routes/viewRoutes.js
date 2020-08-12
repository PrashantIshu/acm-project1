const express = require('express');
const app = require('../app');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const Router = express.Router();

Router.get('/',authController.isLoggedIn, viewController.landing);
Router.get('/login', viewController.login);
Router.get('/signup', viewController.signup);
Router.get('/my-secrets',authController.protect, authController.isLoggedIn, viewController.secrets);


module.exports = Router;