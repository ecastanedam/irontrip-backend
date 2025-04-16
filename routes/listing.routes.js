const router = require("express").Router();
const Listing = require("../models/Listing.model");
const geocodeAddress = require("../services/geocode");
const { isAuthenticated } = require("../middlewares/jwt.middleware");
const uploader = require("../middlewares/cloudinary.config");
const { json } = require("express");

// GET /listing/ - get all listings
router.get("/", async (req, res, next) => {
  try {
    const allListings = await Listing.find().populate({
      path: "host",
      select: "_id username",
    });
    res
      .status(200)
      .json({ data: allListings, message: "Listings getting with succes." });
  } catch (error) {
    next(error);
  }
});
// GET /listing/host/:userId - get all listings for one host
router.get("/host/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  if (userId !== req.payload.id) {
    const error = new Error("Access denied.");
    error.status = 403;
    return next(error);
    // res.status(403).json({message: "Access denied."})
  }
  try {
    const allListingByHost = await Listing.find({ host: userId });
    res.status(200).json({
      data: allListingByHost,
      message: "Listings getting with success.",
    });
  } catch (error) {
    next(error);
  }
});
// GET /listing/:listingId - get one listing
router.get("/:listingId", async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const oneListing = await Listing.findById(listingId).populate({
      path: "host",
      select: "_id username",
    });

    if (!oneListing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    // Ensure availability is always included, even if it's missing
    if (!oneListing.availability) {
      oneListing.availability = [];
    }

    res
      .status(200)
      .json({ data: oneListing, message: "Listing retrieved successfully." });
  } catch (error) {
    next(error);
  }
});
// POST /listing/create - create one listing
router.post("/create", isAuthenticated,  uploader.single("listingPicture"), async (req, res, next) => {
  try {
    // get the exact coordonates from adress details
    const { address, city, country, listingPicture, availability } = req.body;
    const fullAddress = `${address}, ${city}, ${country}`;
    const coords = await geocodeAddress(fullAddress);
    
    if (typeof availability === "string") {
      req.body.availability = JSON.parse(availability);
    }
    // Check if a picture file is uploaded with the middleware "uploader"
    let finalImageUrl = "";
    if (req.file) {
      // Uploaded image retrieved by multer
      console.log("req.file : ", req.file);
      finalImageUrl = req.file?.path;
    } else if (listingPicture) {
      // URL image 
      console.log("listingPicture : ", listingPicture);
      finalImageUrl = listingPicture;
    }

    const formattedData = {
      ...req.body,
      location: coords, // {lat: xx..., lgn: yy...}
      image: finalImageUrl || undefined,
    };

    const createdListing = await Listing.create(formattedData);
    res.status(201).json({ data: createdListing, message: "Listing created." });
  } catch (error) {
    next(error);
  }
});
// PATCH /listing/update/:listingId - update one listing
router.patch("/update/:listingId", isAuthenticated, async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const selectedListing = await Listing.findById(listingId);
    // console.log('selectedListing => ', selectedListing);
    if (selectedListing.host.toString() !== req.payload.id) {
      console.log("User is not the host");
      const error = new Error("Access denied.");
      error.status = 403;
      return next(error);
      // res.status(403).json({message: "Access denied."})
    } else {
      const formattedData = {
        ...req.body,
        description: req.body.description,
        availability: req.body.availability,
      };
      const updatedListing = await Listing.findByIdAndUpdate(
        listingId,
        formattedData,
        { new: true }
      );
      // .populate({
      //     path: "host",
      //     select: "_id username",
      // });
      res
        .status(200)
        .json({ data: updatedListing, message: "Listing updated." });
    }
  } catch (error) {
    next(error);
  }
});
// DELETE /listing/delete/:listingId - delete one listing
router.delete("/delete/:listingId", isAuthenticated, async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const selectedListing = await Listing.findById(listingId);
    if (selectedListing.host.toString() !== req.payload.id) {
      const error = new Error("Access denied.");
      error.status = 403;
      return next(error);
      // res.status(403).json({message: "Access denied."})
    } else {
      const deletedListing = await Listing.findByIdAndDelete(listingId);
      res.status(200).json({ message: "Listing deleted." });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
