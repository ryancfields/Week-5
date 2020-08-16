const { Router } = require("express");
const router = Router();
const itemDAO = require("../daos/item");
const userDAO = require("../daos/user");

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

const isAdmin = async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(" ")[1];
    if (token) {
      req.token = token;
      const validToken = await userDAO.validateToken(token);
      if (validToken.includes("admin")) {
        next();
      } else {
        res.sendStatus(403);
      }
    }
  } catch (e) {
    next(e);
  }
};

router.post("/", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const createdItem = await itemDAO.create(req.body);
    return res.status(200).json(createdItem);
  } catch (e) {
    next(e);
  }
});

router.put("/:id", isLoggedIn, isAdmin, async (req, res, next) => {
  try {
    const updateItem = await itemDAO.updateID(req.body);
    return res.status(200).json(updateItem);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const findItem = await itemDAO.getID(req.body.id);
    return res.status(200).json(findItem);
  } catch (e) {
    next(e);
  }
});

router.get("/", isLoggedIn, async (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const findItems = await itemDAO.get();
    return res.status(200).json(findItems);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
