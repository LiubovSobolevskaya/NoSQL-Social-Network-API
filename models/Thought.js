const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

// Define the thought schema
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            getters: true,
        }
    }
);

// Define the virtual property 'reactionCount' for thought schema
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// Create the Thought model based on the thought schema
const Thought = model('Thought', thoughtSchema);
module.exports = Thought;
