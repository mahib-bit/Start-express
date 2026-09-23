const checkAccess = (req, res, next) => {
    const allowed = true;

    if (!allowed) {
        return res.status(403).json({
            message: 'Access denied'
        });
    }

    next();
};

const checkUser = (req, res, next) => {
    const user = req.headers['x-user'];

    if (!user) {
        return res.status(401).json({
            message: 'User header is required'
        });
    }

    next();
};

module.exports = {
    checkAccess,
    checkUser
};