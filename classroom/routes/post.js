const express = require("express");
const router = express.Router();

//index-posts
router.get("/", (req, res) => {
  res.send("Hii there! its posts .");
});

//show-post
router.get("/:id", (req, res) => {
  res.send("Hii there! posts id");
});

//POST -  creat posts
router.post("/", (req, res) => {
  res.send("Hii there!create posts");
});

//DELETE - posts
router.delete("/:id", (req, res) => {
  res.send("Hii there! DELETE for posts id");
});

module.exports = router;
