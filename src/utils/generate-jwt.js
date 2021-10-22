const jwt = require('jsonwebtoken');

const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, { expiresIn: '24h' }, (err, token) => {
            if (err) {
                console.error(err);
                reject('The token could not be generated');
            } else {
                resolve(token);
            }
        })
    });
}

module.exports = {
    generateJWT,
}