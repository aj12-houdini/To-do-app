const { Item, List } = require("./model");
const _ = require("lodash");

//Document
const study = new Item({
  name: "Study today",
});

const eat = new Item({
  name: "Eat food",
});

const sleep = new Item({
  name: "Sleep",
});

const defaultItems = [study, eat, sleep];

function getHome(req, res) {
  const day = "Today";

  //Finding items
  Item.find({}, function (err, data) {
    if (data.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) console.log(err);
        else console.log("Sucess");
      });
      // res.redirect("/")
    } else res.render("list", { listTitle: day, newListItems: data });
  });
}

function makeHomePost(req, res) {
  const newItem = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: newItem,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
}

function deletePost(req, res) {
  let deletedItem = req.body.deleteItem;
  const listName = req.body.listName;

  deletedItem = deletedItem.trim();
  console.log(deletedItem);

  if (listName === "Today") {
    Item.findByIdAndRemove(deletedItem, (err) => {
      if (err) console.log(err);
      else console.log("Item deleted");
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: deletedItem } } },
      function (err, findList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
}
// Route Parameters to create dynamic routes
function getDynamicPost(req, res) {
  let listName = req.params.listName;
  listName = _.capitalize(listName);
  List.findOne({ name: listName }, function (err, result) {
    if (!err) {
      if (!result) {
        //Create new List
        const list = new List({
          name: listName,
          items: defaultItems,
        });
        list.save(() => res.redirect("/" + listName));
      } else {
        //Show existing list
        res.render("list", {
          listTitle: result.name,
          newListItems: result.items,
        });
      }
    }
  });
}
module.exports = { getHome, makeHomePost, deletePost, getDynamicPost };
