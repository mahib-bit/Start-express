
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

app.use((req, res, next) => {
    console.log('Method:', req.method);
    console.log('URL:', req.url);

    next();
});

const checkSomething = (req, res, next) => {
    console.log('Route-specific middleware running');

    next();
};

const checkAccess = (req, res, next) => {
    const allowed = true;

    if(!allowed) {
        return res.status(403).json({
            message:'Access denied'
        });
    };

    next();
}

const checkHeader = (req, res, next) => {
    const user = req.headers['x-user'];

    console.log('User:', user);

    next();
};

const checkUser = (req, res, next) => {
    const user = req.headers['x-user'];

    if(!user){
        return res.status(401).json({
            message: 'User header is required'
        })
    }
    next();
}

app.get('/users', (req, res) => {
    const name = req.query.name;
    const email = req.query.email;
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;

    let filteredUsers = users;

    if (name) {
        filteredUsers = filteredUsers.filter(user =>
            user.name.toLowerCase().includes(name.toLowerCase())
        );
    }

    if (email) {
        filteredUsers = filteredUsers.filter(user =>
            user.email.toLowerCase().includes(email.toLowerCase())
        );
    }

    if (req.query.limit) {
        const limit = parseInt(req.query.limit);

        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({
                message: 'Limit must be a positive number'
            })
        }

        filteredUsers = filteredUsers.slice(0, limit);
    }

    if (sort === 'name') {
        filteredUsers.sort((a, b) =>
            a.name.localeCompare(b.name)
        )
    }

    res.json(filteredUsers);
});

app.get('/users/:id', checkAccess,checkHeader, checkUser,(req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.json({ user });
})

app.get('/search', (req, res) => {
    const name = req.query.name;
    const age = req.query.age;

    res.json({
        name: name,
        age: age
    })
})

app.put('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    user.name = req.body.name;
    user.email = req.body.email;

    res.json(user);
});

app.post('/users', (req, res) => {
    const newUser = req.body;

    users.push(newUser);

    res.status(201).json(newUser);
})

app.delete('/users/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const deletedUser = users.splice(userIndex, 1);

    res.json({
        message: 'User deleted Successfully',
        user: deletedUser[0]
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
