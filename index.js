const express = require('express');

const app = express();

const usersRouter = require('./routes/users');

app.use(express.json());

const port = 3000;

// ====================
// Global Middleware
// ====================

app.use((req, res, next) => {
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    next();
});

// ====================
// Home Route
// ====================

app.get('/', (req, res) => {
    res.send('Hello from my Express server!');
});

// ====================
// Users Router
// ====================

app.use('/users', usersRouter);

// ====================
// Other Practice Routes
// ====================

app.get('/search', (req, res) => {
    const name = req.query.name;
    const age = req.query.age;

    res.json({
        name: name,
        age: age
    });
});

app.get('/server-error', (req, res, next) => {
    try {
        throw new Error('Database connection failed');
    }
    catch (error) {
        next(error);
    }
});

app.get('/error', (req, res, next) => {
    const error = new Error('Something broke!');

    next(error);
});

// ====================
// Error Handling Middleware
// ====================

app.use((err, req, res, next) => {
    console.log(err);

    res.status(500).json({
        message: 'Something went wrong'
    });
});

// ====================
// Start Server
// ====================

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});