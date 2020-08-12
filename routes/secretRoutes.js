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
    .delete(authController.protect, authController.restrictTo('admin'), secretController.deleteSecret)

module.exports = Route;