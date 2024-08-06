require('dotenv').config()

const secretKey = process.env.tokensecret;
const tokeAdmin = process.env.admintoken;

const authenticateAndAuthorize = (req, res, next) => {
    const authHeader = req.header('Authorization');

    console.log(authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized Bearer' });
    }

    const token = authHeader.slice(7); 
    // console.log(token);

    if (token === null || token === 'null') {
        return res.status(403).json({ message: 'Forbidden: Token is null' });
    }

    try {
        if (token === secretKey || token === tokeAdmin) {
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden: Wrong Token' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authenticateAndAuthorize;