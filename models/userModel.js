const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A User must have a name'],
    },
    email: {
        type: String,
        required: [true, 'A User must have a name'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'A User must have a password'],
        minlength: 8,
        // select: false
    },
    confirmPassword: {
        type: String,
        required: [true],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords are not same'
        }
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    photo : {
        type: String,
        default: 'default.jpg'
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSchema.pre('save', async function(next) {
    var bcrypt = require('bcryptjs');

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmPassword = undefined;
    
    next();
});

userSchema.pre('save', function(next) {
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000; 
    next();
});

userSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'secrets'
    });
    next();
});

userSchema.virtual('secrets', {
    ref: 'Secret',
    foreignField: 'user',
    localField: '_id'
});

userSchema.pre(/^find/, function(next) {
    this.find({active: {$ne: false}});
    next();
});

userSchema.methods.correctPassword = async function(password, hash) {
    const result = await bcrypt.compare(password, hash);
    return result;
};

userSchema.methods.passwordChanged = function(JWTtimeStamp) {
    if(this.passwordChangedAt) {
        const passwordChangedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        return JWTtimeStamp < passwordChangedTimestamp;
    }
    
    return false;
};


const User = new mongoose.model('User', userSchema);

module.exports = User;