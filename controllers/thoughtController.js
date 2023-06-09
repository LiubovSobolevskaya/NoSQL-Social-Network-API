const { Thought, User, Reaction } = require('../models');

module.exports = {
    // Get all Thoughts
    getAllThoughts(req, res) {
        Thought.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    // Get a Thought
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .select('-__v')
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No Thought with that ID' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Create a Thought
    createThought(req, res) {
        Thought.create(req.body)
            .then((thought) => {
                User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $addToSet: { thoughts: thought._id } },
                    { runValidators: true, new: true }
                )
                    .then((user) => {
                        if (!user) {
                            res.status(404).json({ message: 'No user found with that ID :(' })
                        }
                        res.status(200).json(thought);
                    })
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Delete a Thought
    deleteThought(req, res) {
        // Find and delete the thought document with the specified thoughtId
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
            .then((thought) => {
                // Check if the thought was found
                if (!thought) {
                    res.status(404).json({ message: 'No Thought with that ID' })
                }
                // Find the user associated with the thought and remove the thought from their thoughts array
                User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { runValidators: true, new: true }
                )
                    .then((user) => {
                        // Check if the user was found
                        if (!user) {
                            res.status(404).json({ message: 'No user found with that thought :(' });
                        }
                        else {
                            // Send a JSON response indicating that the thought is deleted
                            res.json({ message: 'Thought is deleted!' });
                        }
                    });

            })
            .catch((err) => res.status(500).json(err));
    },
    // Update a Thought
    updateThought(req, res) {
        // Find the thought with the specified thoughtId and update it
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res.status(404).json({ message: 'No Thought with this id!' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    // add Reaction to a thought
    addReaction(req, res) {
        // Extract the thoughtId, reactionBody, and username from the request parameters and body
        const { thoughtId } = req.params;
        const { reactionBody, username } = req.body;
        // Find the thought with the specified thoughtId and add the new reaction to its reactions array
        Thought.findOneAndUpdate(
            { _id: thoughtId },
            { $addToSet: { reactions: { reactionBody, username } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                // Check if the thought was found
                !thought
                    ? res
                        .status(404)
                        .json({ message: 'No thought found with that ID :(' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },

    // Remove Reaction from a thought
    removeReaction(req, res) {
        // Find the thought with the specified thoughtId and remove the new reaction from its reactions array
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { ReactionId: req.params.ReactionId } } },
            { runValidators: true, new: true }
        )
            .then((thought) =>
                !thought
                    ? res
                        .status(404)
                        .json({ message: 'No thought found with that ID :(' })
                    : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
};
