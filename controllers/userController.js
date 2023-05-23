const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');


module.exports = {
    // Get all users
    getUsers(req, res) {
        // Retrieve all users from the database
        User.find()
            .then(async (users) => {
                // Create an object containing the users
                const userObj = {
                    users
                };
                // Send the user object as a JSON response
                return res.json(userObj);
            })
            .catch((err) => {
                // Handle any errors that occur during the retrieval process
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Get a single user
    getSingleUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .then(async (user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json({ user })
            )
            .catch((err) => {
                // Handle any errors that occur during the retrieval process
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // create a new user
    createUser(req, res) {
        console.log(req.body);
        User.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // Delete a user and remove their thoughts
    deleteUser(req, res) {
        // Find and remove the user document with the specified userId
        User.findOneAndRemove({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No such user exists' })
                    : Thought.deleteMany({ _id: { $in: user.thoughts } })
            )
            .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
            .catch((err) => {
                // Handle any errors that occur during the retrieval process
                console.log(err);
                res.status(500).json(err);
            });
    },
    //update user
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { new: true },
        )
            .then((user) => {
                if (!user) {
                    res.status(404).json({ message: 'No such user exists' })
                }

                res.json(user);
            })

            .catch((err) => {
                console.log(err);
                // Handle any errors that occur during the retrieval process
                res.status(500).json(err);
            });
    },

    // Add an friend to a user
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>
                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found with that ID :(' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));  // Handle any errors that occur during the retrieval process
    },
    // Remove friend from a user's friends list
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
            .then((user) =>

                !user
                    ? res
                        .status(404)
                        .json({ message: 'No user found with that ID :(' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));  // Handle any errors that occur during the retrieval process
    },
};
