const { Router } = require("express");
const router = Router();
const userDAO = require("../daos/user");
const orderDAO = require("../daos/order");
const itemDAO = require("../daos/item");

const jwt = require("jsonwebtoken");

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

// Create
router.post("/", isLoggedIn, async (req, res, next) => {
  const items = req.body;

  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];

    const validToken = await userDAO.validateTokenGetID(token);
    let order = { userId: validToken, items: items, total: 0 };
    for (const eachItem of items) {
      const item = await itemDAO.getByID(eachItem);
      order.total += item.price;
    }
    const newOrder = await orderDAO.create(order);
    return res.json(newOrder);
  } catch (e) {
    next(e);
  }
});

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const validToken = await userDAO.validateTokenGetID(token);

    if (isAdmin) {
      const findOrders = await itemDAO.get();
      return res.status(200).json(findOrders);
    } else {
      const findOrders = await itemDAO.getByID(validToken);
      return res.status(200).json(findOrders);
    }
  } catch (e) {
    next(e);
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const validToken = await userDAO.validateTokenGetID(token);

    if (isAdmin) {
    const findItem = await itemDAO.getByID(validToken);
    return res.status(200).json(findItem);
    } else {
      const findOrders = await itemDAO.getByID(validToken);
      return res.status(200).json(findOrders);

    }
  } catch (e) {
    next(e);
  }
});

module.exports = router;
