const express = require('express');

const router = express.Router();

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

router.get('/', (req, res) => {
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

router.get('/:id', checkAccess,checkHeader, checkUser,(req, res) => {
    const id = parseInt(req.params.id);

    const user = users.find(user => user.id === id);

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    res.json({ user });
})


module.exports = router;