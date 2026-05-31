const express = require("express");
const session = require("express-session");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views')); // Corrected __dirname and 'views'

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true, // Fixed typo here
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
  let { name = "anonymous" } = req.query;
  req.session.name = name;  // Store the name in session

  if(name === "anonymous") {
 req.flash("error", "An Erorr Occured!!");
  } else{
req.flash("success", "User registered successfully!!");
  }
 
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
 res.locals.SuccessMsg = req.flash("success");
 res.locals.ErrorMsg = req.flash("error");
 res.render("page.ejs", { name: req.session.name });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
