const expressJwt = require('express-jwt');
const config = require('../config.json');
const userService = require('../users/user.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    console.log(config.secret);
    return expressJwt({ secret,
      getToken: isRevoked
    }).unless({
        path: [
            // public routes that don't require authentication
            '/api/users/authenticate',
            '/api/users/register'
        ]
    });
}

function isRevoked(req, payload, done) {
    // const user = await userService.getById(payload.sub);
    // revoke token if user no longer exists
    return req.body.token;
};
