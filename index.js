
const express = require('express');

const app = express();

app.use(express.json());

const port = 3000;

const users = [
    {
        id: 1,
        name: 'Mahib',
        email: 'mahib@example.com'
    },
    {
        id: 2,
        name: 'Rahim',
        email: 'rahim@example.com'
    },
    {
        id: 3,
        name: 'Karim',
        email: 'karim@example.com'
    }
];

app.get('/', (req, res) => {
    res.send('Hello from my Express server!');
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user){
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.json({ user });
})

app.post ('/users', (req ,res) => {
    const newUser = req.body;
    
    users.push(newUser);

    res.status(201).json(newUser);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
