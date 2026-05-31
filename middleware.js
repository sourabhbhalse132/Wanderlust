const Listing = require("./models/listing");
const Review = require("./models/review");

// LOGIN
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

// SAVE REDIRECT
module.exports.saveRedirectUrl = (req, res, next) => {
  res.locals.redirectUrl = req.session.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  next();
};

// LISTING OWNER
module.exports.isOwner = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  if (!req.user || !listing.owner.equals(req.user._id)) {
    req.flash("error", "Not authorized!");
    return res.redirect(`/listings/${req.params.id}`);
  }

  next();
};

// REVIEW OWNER
module.exports.isReviewAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect("back");
  }

  if (!req.user || !review.author.equals(req.user._id)) {
    req.flash("error", "Not authorized!");
    return res.redirect("back");
  }

  next();
};

// WRAPPER
module.exports.wrapAsync = (fn) =>
  (req, res, next) => fn(req, res, next).catch(next);