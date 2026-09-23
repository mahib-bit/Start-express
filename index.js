const express = require('express');

const app = express();

const usersRouter = require('./routes/users');

app.use(express.json());

const port = 3000;

app.use('/users' ,usersRouter);

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

const validateUser = (req, res, next) =>{
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: 'Name and email are required'
        })
    }
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

app.get('/server-error',(req,res,next) => {
    try {
        throw new Error('Database connection failed');
    }
    catch (error) {
        next(error);
    }
})

app.get('/search', (req, res) => {
    const name = req.query.name;
    const age = req.query.age;

    res.json({
        name: name,
        age: age
    })
})

app.get('/error', (req,res,next)=> {
    const error = new Error('Something broke!');

    next(error)
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

app.post('/users',validateUser, (req, res) => {
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

app.use((err, req, res, next) => {
    console.log(err);

    res.status(500).json({
        message: "Something went wrong"
    })
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
