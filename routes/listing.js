const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const { wrapAsync, isLoggedIn, isOwner } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });


// INDEX
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);


// NEW
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});


// SHOW
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" }
      });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  })
);


// CREATE
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  wrapAsync(async (req, res) => {

    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;

    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();
    req.flash("success", "Listing created!");
    res.redirect("/listings");
  })
);


// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render("listings/edit", { listing });
  })
);


// UPDATE (🔥 FIXED IMAGE NOT DISAPPEARING ISSUE)
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(async (req, res) => {

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // update fields
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // ONLY replace image if new file uploaded
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await listing.save();

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${listing._id}`);
  })
);


// DELETE
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;