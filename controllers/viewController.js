const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/app-error');
const Secret = require('../models/secretsModel');

exports.landing = catchAsync( async(req, res) => {
    
    res.render('landing', {
        title: 'Secrets.io',
    });
});

exports.login = catchAsync(async (req, res, next) => {
    res.render('login', {
      title: "Log In to your account"
    });
  });
  
exports.signup = catchAsync(async (req, res, next) => {
    res.render('signup', {
      title: "Sign up to register your account"
    });
});
//   exports.getAccount = (req, res) => {
//     res.render('account', {
//       title: "Your Account"
//     });
//   };

exports.secrets = catchAsync(async (req, res, next) => {
  const secrets = await Secret.find({user: req.user.id});

  res.render('secret', {
    secrets,
    id: req.user.id,
    title: "Secrets"
  });
});