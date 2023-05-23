const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

// Define the user schema
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        },
        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought',
            },
        ],
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    {
        toJSON: {
            getters: true,
        },
    }
);

// Define the virtual property 'friendCount' for user schema
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// Create the User model based on the user schema
const User = mongoose.model('User', userSchema);

module.exports = User;