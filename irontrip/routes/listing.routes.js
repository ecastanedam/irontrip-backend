const router = require('express').Router();
const Listing = require('../models/Listing.model');
const geocodeAddress = require("../services/geocode");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// GET /listing/ - get all listings
router.get('/', async (req, res, next) => {
   try {
    const allListings = await Listing.find().populate('host');
    res
    .status(200)
    .json({data: allListings, message: "Listings getting with succes."});
   } catch (error) {
    next(error);
   }
});
// GET /listing/host/:userId - get all listings for one host 
router.get('/host/:userId', isAuthenticated, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const allListingByHost = await Listing.find({host : userId});
        res
        .status(200)
        .json({data: allListingByHost, message: "Listings getting with success."});
    } catch(error) {
        next(error);
    }
});
// GET /listing/:listingId - get one listing
router.get('/:listingId', async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const oneListing = await Listing.findById(listingId).populate('host');
        res
        .status(200)
        .json({data: oneListing, message: "Listing getting with succes."});
    } catch (error) {
        next(error);
    }
});
// POST /listing/create - create one listing
router.post('/create', isAuthenticated, async (req, res, next) => {
    try {
        // get the exact coordonates from adress details
        const { address, city, country } = req.body;
        const fullAddress = `${address}, ${city}, ${country}`;
        const coords = await geocodeAddress(fullAddress);
        const formattedData = {
            ...req.body,
            location: coords // {lat: xx..., lgn: yy...}
        };
        const createdListing = await Listing.create(formattedData).populate('host');
        res
        .status(201)
        .json({data: createdListing, message: "Listing created."});
    } catch (error) {
        next(error);
    }
});
// PATCH /listing/update/:listingId - update one listing
router.patch('/update/:listingId', isAuthenticated, async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const formattedData = {
            ...req.body,
            description: req.body.description,
            avaiibility: req.body.avaiibility
        };
        const updatedListing = await Listing.findByIdAndUpdate(listingId, formattedData, { new: true }).populate('host');
        res
        .status(200)
        .json({data : updatedListing, message : "Listing updated."});
    } catch (error) {
        next(error);
    }
});
// DELETE /listing/delete/:listingId - delete one listing
router.delete('/delete/:listingId', isAuthenticated, async (req, res, next) => {
    try {
        const { listingId } = req.params;
        const deletedListing = await Listing.findByIdAndDelete(listingId);
        res
        .status(204)
        .json({ message: "Listing deleted." });
    } catch (error) {
        next(error);
    }
});

module.exports = router;