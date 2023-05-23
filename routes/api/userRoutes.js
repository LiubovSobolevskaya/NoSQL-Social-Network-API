
const router = require('express').Router();
// Import user controller methods
const {
    getUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    removeFriend,
} = require('../../controllers/userController');

// Routes for handling users
router.route('/').get(getUsers).post(createUser);

// Routes for handling a single user
router.route('/:userId').put(updateUser).get(getSingleUser).delete(deleteUser);

// Routes for handling friends of a user
router.route('/:userId/friends/:friendId').delete(removeFriend).post(addFriend);

module.exports = router;


