const express = require('express');
const secretController = require("../controllers/secretsController");
const authController = require("../controllers/authController");

const Route = express.Router({ mergeParams: true });

Route
    .route('/')
    .get(authController.protect, secretController.setSecretID, authController.restrictTo('user'), secretController.getAllSecrets)
    .post(
        authController.protect,
        authController.restrictTo('user'),
        secretController.setSecretID,
        secretController.createSecret
    );

Route
    .route('/:id')
    .get(authController.protect, authController.restrictTo('admin'), secretController.getSecret)
    .delete(authController.protect, authController.restrictTo('admin'), secretController.deleteSecret)
    .patch(authController.protect, authController.restrictTo('admin'), secretController.updateSecret);

module.exports = Route;