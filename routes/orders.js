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

// const isAdmin = async (req, res, next) => {
//   const { authorization } = req.headers;
//   try {
//     const token = authorization.split(" ")[1];
//     if (token) {
//       req.token = token;
//       const validToken = await userDAO.validateToken(token);
//       if (validToken.includes("admin")) {
//         next();
//       } else {
//         res.sendStatus(403);
//       }
//     }
//   } catch (e) {
//     next(e);
//   }
// };

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
    const user = await userDAO.getUserInfo(token);

    if (user.roles.includes("admin")) {
      const findOrders = await orderDAO.get();
      return res.status(200).json(findOrders);
    } else {
      const findOrders = await orderDAO.getUserID(user._id);
      return res.status(200).json(findOrders);
    }
  } catch (e) {
    next(e);
  }
});

router.get("/:id", isLoggedIn, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const user = await userDAO.getUserInfo(token);
    const userID = user._id;

    const findOrders = await orderDAO.getOrderId(orderId);

    console.log(findOrders.userId, userID);

    if (user.roles.includes("admin")) {
      return res.status(200).json(findOrders);
    } else if (findOrders.userId.toString() == userID.toString()) {
      return res.status(200).json(findOrders);
    } 

    return res.status(404).json();

    
  } catch (e) {
    next(e);
  }
});

module.exports = router;
