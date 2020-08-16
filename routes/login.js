const { Router } = require("express");
const router = Router();
const userDAO = require("../daos/user");
const { body, validationResult } = require("express-validator");

const isLoggedIn = async (req, res, next) => {
    const { authorization } = req.headers;
    try {
      if (authorization) {
        const token = authorization.split(" ")[1];
        if (token) {
          req.token = token;
          const validToken = await userDAO.validateToken(token);
          if (validToken) {
              next();
          } else {
            res.sendStatus(401);
          }
        } else {
          res.sendStatus(401);
        }
      } else {
        res.sendStatus(401);
      }
    } catch (e) {
      next(e);
    }
  };

router.post(
  "/signup",
  [body("email").isEmail(), body("password").isLength({ min: 1 })],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const createdUser = await userDAO.create(req.body);
      return res.json(createdUser.email);
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/",
  [body("email").isEmail(), body("password").isLength({ min: 1 })],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const issueToken = await userDAO.issueToken(req.body, req.headers.authorization);
      if (!issueToken) {
        res.sendStatus(401);
      } else {
        return res.json({ token: issueToken });
      }
    } catch (e) {
      next(e);
    }
  }
);

router.post(
  "/password",
  isLoggedIn,
  [body("password").isLength({ min: 1 })],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    user = req.body
    token = req.headers.authorization.split(" ")[1]

    try {
      const updatedPassword = await userDAO.updatePassword(user, token);
      return res.json(updatedPassword)
    
    } catch (e) {
      next(e);
    }
  }
);

module.exports = router;
