const Order = require("../models/order");
const Item = require("../models/item");

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

module.exports.getID = async (id) => {
  return await Order.findOne({ order: id }).lean();
};

module.exports.getUserID = async (id) => {
  return await Order.find({ userId: id });
};

module.exports.get = async () => {
  return await Order.find().lean();
};
