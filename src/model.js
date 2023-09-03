const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/todolistDB");

//Creating our schema for the database
const itemsSchema = {
  name: String,
};

const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);
//Instance of a model is called a document.
//Models are reponsible for creating and reading documents from underlying mongo databse.
const Item = mongoose.model("Item", itemsSchema);
module.exports = { Item, List };
