const Secret = require("../models/secretsModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/app-error');


exports.setSecretID = (req, res, next) => {
    if(!req.body.user) req.body.user = req.user.id;
    next();
};

exports.getAllSecrets = catchAsync(async(req, res, next) => {

    if(req.params.id !== req.user.id) {
        return next(new AppError('No secrets found', 404));
    }

    const secrets = await Secret.find({user: req.body.user});

    res.json({
        status: "success",
        results: secrets.length,
        data: secrets
    });
});


exports.getSecret = catchAsync(async(req, res, next) => {
    let secret;
    secret = await Secret.findById(req.params.id);

    if(!secret) {
        return next(new AppError('No users found with that ID', 404));
    }

    res.json({
        status: "success",
        data: secret
    });
});

exports.createSecret = catchAsync(async(req, res) => {
    const secret = await Secret.create(req.body);

    res.json({
        status: "success",
        data: secret
    });
});

exports.updateSecret = catchAsync(async(req, res, next) => {
    const newSecret = await Secret.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if(!newSecret) {
        return next(new AppError('No documents found with that ID', 404));
    }

    res.json({
        status: "success",
        data: newSecret
    });
});

exports.deleteSecret = catchAsync(async(req, res, next) => {
    const secret = await Secret.findByIdAndDelete(req.params.id);
            
    if(!secret) {
        return next(new AppError('No documents found with that ID', 404));
    }
    
    res.json({
        status: "success",
        data: null
    });
});