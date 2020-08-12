const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const secretRouter = require('./secretRoutes');

const Router = express.Router();

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);
Router.get('/logout', authController.logout);

// Router.post('/forgotPassword', authController.forgotPassword);
// Router.patch('/resetPassword/:token', authController.resetPassword);

Router.use("/:userId/secrets", secretRouter);

Router.post('/updatePassword', authController.protect, authController.updatePassword);

Router
    .route('/me')
    .get(authController.protect, userController.getMe, userController.getUser);

Router
    .route('/deleteMe')
    .get(authController.protect, userController.deleteMe);

Router
    .route('/updateMe')
    .post(authController.protect, userController.updateMe);

Router
    .route('/')
    .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)
    .post(authController.protect, authController.restrictTo('admin'), userController.createUser);

Router
    .route('/:id')
    .get(authController.protect, authController.restrictTo('admin', 'user'), userController.getUser)
    .patch(authController.protect, authController.restrictTo('admin'), userController.updateUser)
    .delete(authController.protect, authController.restrictTo('admin'), userController.deleteUser);


module.exports = Router;