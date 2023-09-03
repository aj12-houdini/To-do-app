const express = require("express");
const router = express.Router();

const { getHome, makeHomePost, deletePost, getDynamicPost } = require("./auth");
router.route("/").get(getHome);
router.route("/").post(makeHomePost);
router.route("/delete").post(deletePost);
router.route("/:listName").get(getDynamicPost);

module.exports = router;
