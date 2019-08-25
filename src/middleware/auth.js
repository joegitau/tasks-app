const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function auth(req, res, next) {
  try {
    // find the token
    const token = req.header("Authorization").replace("Bearer ", "");

    // verify token
    const decoded = await jwt.verify(token, "jwtPrivateKey");

    // find the user
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!user) throw new Error();

    // assign the user to a new req object with name user
    req.user = user;

    next();
  } catch (err) {
    res.status(401).send("User not Authorized");
  }
}

// Alternatively-----
// async function auth (req, res, next) {
//   try {
//     const token = req.header('Autorization').replace('Bearer ', '')
//     const decoded = jwt.verify(token, 'jwtPrivateKey')
//     req.user = decoded
//     next()
//   } catch (err) {
//     res.status(401).send('User not Authorized')
//   }
// }

module.exports = auth;
