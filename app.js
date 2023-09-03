//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash")
const app = express();

// Sets up a connection with the mongoose database 
mongoose.connect("mongodb://localhost:27017/todolistDB")

//Creating our schema for the database 
const itemsSchema = {
  name: String
}
//Instance of a model is called a document. 
//Models are reponsible for creating and reading documents from underlying mongo databse. 
const Item = mongoose.model("Item",itemsSchema)

//Document 
const study = new Item({
  name: "Study today"
})

const eat = new Item({
  name: "Eat food"
})

const sleep = new Item({
  name: "Sleep"
})

const defaultItems = [study,eat,sleep]

const listSchema = {
  name: String,
  items: [itemsSchema]
}
const List = mongoose.model("List",listSchema)



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res) {

const day = "Today"

//Finding items 
Item.find({},function(err,data){
  if(data.length === 0){
    Item.insertMany(defaultItems, function(err){
      if(err)
        console.log(err)
      else
        console.log("Sucess")
      
    })
    // res.redirect("/")
  }
  else
    res.render("list", {listTitle: day, newListItems: data});
})


});

app.post("/", function(req, res){

  const newItem = req.body.newItem;
  const listName = req.body.list
  const item = new Item({
    name: newItem
  })
  if(listName === "Today"){
    item.save();
    res.redirect("/")
  }
  else{
    List.findOne({name: listName}, function(err,foundList){
      foundList.items.push(item)
      foundList.save();
      res.redirect("/" + listName)
    })
  }

});

app.post("/delete",(req,res) =>{
 let deletedItem = req.body.deleteItem
 const listName = req.body.listName

 deletedItem = deletedItem.trim()
 console.log(deletedItem)

 if(listName === "Today"){
  Item.findByIdAndRemove(deletedItem,(err) => {
    if(err)
      console.log(err)
    else
      console.log("Item deleted")
  })
  res.redirect("/")
 }
 else{

   List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: deletedItem}}}, function(err,findList){
     if(!err){
       res.redirect("/" + listName)
     }
   })
 }

})

// Route Parameters to create dynamic routes 
app.get('/:listName', (req,res) => {
  let listName = req.params.listName;
  listName = _.capitalize(listName)
  List.findOne({name:listName}, function(err, result){
    if (!err){
    if (!result){
      //Create new List
      const list = new List({
        name:listName,
        items:defaultItems
      });
      list.save(() => res.redirect('/' + listName));
    } else {
      //Show existing list
      res.render("list", {listTitle:result.name, newListItems:result.items});
    }}})});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
