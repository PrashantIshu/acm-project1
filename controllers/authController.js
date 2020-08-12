const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/app-error');
const User = require("../models/userModel");

const { promisify } = require("util");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, res) => {
    const token = createToken(user._id);
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
    res.cookie('jwt', token, cookieOptions);
  
    //  Remove password from output
    user.password = undefined;
  
    res.json({
      status: 'success',
      token,
      data: {
        user
      }
    });
};

exports.signup = catchAsync( async(req, res, next) => {
    const newUser = await User.create({
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
        confirmPassword : req.body.confirmPassword,
        role : req.body.role,
        passwordChangedAt : req.body.passwordChangedAt
    });

    createSendToken(newUser, res);
});

exports.login = catchAsync( async(req, res, next) => {
    const { email, password } = req.body;
    
    // 1) Check if email and password exists
    if(!email || !password) {
        return next(new AppError('Please enter Email or Password', 400));
    }

    // 2) Check if user exists and password is correct
    const user = await User.findOne({ email });

    const correct = await user.correctPassword(password, user.password);

    if(!user || !correct) {
        return next(new AppError("Invalid email or password", 401));
    }

    // 3) If everything is OK, send token to the client
    createSendToken(user, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'LoggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.json({
        status: 'success'
    });
};

exports.protect = catchAsync( async(req, res, next) => {
    // 1) Getting token and checking if its there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.jwt)
    {
        token = req.cookies.jwt  
    }


    if(!token) {
        return next(new AppError('You are not logged in. Please login to get access!', 401));
    }

    // 2) Verifying token
    const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    currentUser = await User.findById(decode.id);

    if(!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exists', 401));
    }

    // 4) Check if user changed the password after the token was issued
    const changedPassword = await currentUser.passwordChanged(decode.iat);

    if(changedPassword) {
        return next(new AppError('User recently changed the password. Please login again', 401));
    }

    req.user = currentUser;

    next();
});

exports.isLoggedIn = async(req, res, next) => {
    try {
        // 1) Checking is user is Logged in or not
        if(req.cookies.jwt) {
        
            // 2) Verification Token
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            
            // 3) Check if user still exists
            const currentUser = await User.findById(decode.id);
            if (!currentUser) {
                return next();
            }

            // 4)) Check if user changed the password after the token was issued
            const changedPassword = await currentUser.changedPassword(decode.iat);
            if(changedPassword) {
                return next();
            }
            
            req.user = currentUser;

            res.locals.user = currentUser; //from this 'res.locals.user' we can use the currently logged in user with the keyword 'user' in our pug templates
            return next();
        }
    } catch(err) {
        return next();
    }
    next();
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
};


exports.updatePassword = catchAsync( async(req, res, next) => {
    // 1) Get user from the collection
    const user = await User.findById(req.user.id);

    // 2) Check if POSTed current password is correct
    const currentPassword = req.body.currentPassword;
    const correct = await user.correctPassword(currentPassword, user.password);

    if(!correct) {
        return next(new AppError('Incorrect current password, Please try again!', 401));
    }

    // 3) if so, update password
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;

    await user.save();

    createSendToken(user, res);
    
    next();
});