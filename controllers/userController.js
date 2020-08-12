const User = require("../models/userModel");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/app-error');

const filter = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) {
            newObj[el] = obj[el];
        }
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async(req, res, next) => {
    const users = await User.find();

    res.json({
        status: "success",
        results: users.length,
        data: users
    });
});


exports.getUser = catchAsync(async(req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(new AppError('No  users found with that ID', 404));
    }
    const user = await User.findById(req.params.id);

    if(!user) {
        return next(new AppError('No users found with that ID', 404));
    }

    res.json({
        status: "success",
        data: user
    });
});

exports.createUser = catchAsync(async(req, res) => {
    const doc = await User.create(req.body);

    res.json({
        status: "success",
        data: doc
    });
});

exports.updateUser = catchAsync(async(req, res, next) => {
    const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

    if(!newUser) {
        return next(new AppError('No documents found with that ID', 404));
    }

    res.json({
        status: "success",
        data: newUser
    });
});

exports.deleteUser = catchAsync(async(req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id);
            
    if(!user) {
        return next(new AppError('No documents found with that ID', 404));
    }
    
    res.json({
        status: "success",
        data: null
    });
});

exports.getMe = catchAsync( async(req, res, next) => {
    req.params.id = req.user.id;

    next();
});

exports.deleteMe = catchAsync( async(req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.json({
        status: "success",
        data : null,
    });

    next();
});

exports.updateMe = catchAsync( async(req, res, next) => {
    // 1) Create error if user PATCHes password data
    if(req.body.password || req.body.confirmPassword) {
        return next(new AppError("This route is not for password updates. Please use /updatePassword", 400));
    }

    // 2) Update your document
    const filterBody = filter(req.body, 'name', 'email');

    const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {new: true, runValidators: true});

    res.json({
        status: "success",
        data: updateUser
    });

    next();
});