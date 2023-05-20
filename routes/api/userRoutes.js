
app.get('/api/users', (req, res) => {

    User.find({}, (err, result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            console.log('something went wrong');
            res.status(500).json({ message: 'something went wrong' });
        }
    });
});



app.post('/api/users', (req, res) => {
    const newUser = new User({ name: req.params.genre });
    newUswe.save();
    if (newGenre) {
        res.status(200).json(newUser);
    } else {
        console.log('Something went wrong');
        res.status(500).json({ message: 'Something went wrong' });
    }
});


app.get('/api/users/:id', (req, res) => {

});

