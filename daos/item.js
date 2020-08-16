const Item = require("../models/item");

module.exports = {};

module.exports.create = async (item) => {
  return await Item.create(item);
};

module.exports.update = async (item) => {
  return await Item.update(update);
};

module.exports.updateID = async (item) => {
  return await Item.updateOne(item);
};

module.exports.getID = async (id) => {
  return await Item.findOne({ id: id }).lean();
};

module.exports.getByID = async (id) => {
  return await Item.findOne({ _id: id }).lean();
};

module.exports.get = async () => {
  return await Item.find().lean();
};
