const Order = require("../models/order");
const Item = require("../models/item");
const mongoose = require("mongoose");

module.exports = {};

module.exports.create = async (order) => {
  try {
    return await Order.create(order);
  } catch {
    return e;
  }
};

module.exports.update = async (order) => {
  return await Order.update(order);
};

module.exports.updateID = async (order) => {
  return await Order.updateOne(order);
};

module.exports.getByID = async (id) => {
  return await Order.find({ _id: id }).lean();
};

module.exports.getUserID = async (id) => {
  return await Order.find({ userId: id });
};

module.exports.get = async () => {
  return await Order.find().lean();
};

module.exports.getOrderId = async (orderId) => {
  const order = await Order.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(orderId) } },
    {
      $lookup: {
        from: "items",
        localField: "items",
        foreignField: "_id",
        as: "items",
      },
    },
    {
      $project: {
        "items.price": 1,
        "items.title": 1,
        total: 1,
        userId: 1,
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);
  return order[0];
};
