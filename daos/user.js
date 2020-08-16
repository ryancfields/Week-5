const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const jwtKey = "my_secret_key";
const jwtExpirySeconds = 9999;

module.exports = {};

module.exports.create = async (user) => {
  user.password = await bcrypt.hash(user.password, 1);
  user.roles = ["user"];
  return User.create(user);
};

module.exports.findByEmail = async (email) => {
  return await User.findOne({ email: email }).lean();
};

module.exports.getById = async (userId) => {
  return await User.findOne({ _id: userId }).lean();
}

module.exports.issueToken = async (user) => {
  const { email, password } = user;

  const foundUser = await User.findOne({ email: email }).lean();
  if (foundUser) {
    const returnToken = await bcrypt.compare(password, foundUser.password);
    if (returnToken) {
      const { _id, roles } = foundUser;

      const token = jwt.sign({ email, _id, roles }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
      });
      return token;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports.updatePassword = async (user, token) => {
    decodeToken = jwt.decode(token, jwtKey);
    email = decodeToken.email
    
    user.password = await bcrypt.hash(user.password, 1);
    return await User.updateOne({ email : email }, { $set: { 'password' : user.password}});

};

module.exports.validateToken = async (token) => {
        const validateToken = await jwt.verify(token, jwtKey);
        return validateToken.roles

  };
  
  module.exports.validateTokenGetID = async (token) => {
    const validateToken = await jwt.verify(token, jwtKey);
    return validateToken._id

};

//All User Info
module.exports.getUserInfo = async (token) => {
  const userInfo = await jwt.verify(token, jwtKey);
  return userInfo

};
