const router = require('express').Router();
const Request = require('../models/Request.model');
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// GET /request/host/:userId - get all request for one host
router.get('/host/:userId', isAuthenticated, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const allRequestByHost = await Request.find({ host: userId })
        .populate({
            path: "traveler",
            select: "_id username",
        })
        .populate({
        path: "listing",
        select: "_id title city country",
        });
        res
        .status(200)
        .json({data: allRequestByHost, message: "Requests getting with success."});
    } catch (error) {
        next(error);
    }
});
// GET /request/traveler/:userId - get all request for one traveler
router.get('/traveler/:userId', isAuthenticated, async (req, res, next) => {
    try {
        const { userId } = req.params;
        const allRequestByTraveler = await Request.find({ traveler: userId })
        .populate({
            path: "listing",
            select: "_id title city country",
        });
        res
        .status(200)
        .json({data: allRequestByHost, message: "Requests getting with success."});
    } catch (error) {
        next(error);
    }
});
// GET /request/:requestId - get One request
router.get('/:requestId', isAuthenticated, async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const selectedRequest = await Request.findById(requestId);
        res
        .status(200)
        .json({data: selectedRequest, message: "Request getting with success."});
    } catch (error) {
        next(error);
    }
});
// POST /request/create - create One request
router.post('/create', isAuthenticated, async (req, res, next) => {
    try {
        const createdRequest = await Request.create(req.body)
        .populate({
            path: "listing",
            select: "_id title city country",
        });
        res
        .status(201)
        .json({data: createdRequest, message: "Request created."});
    } catch(error) {
        next(error);
    }
});
// PATCH /request/update/:requestId - update One request
router.patch('/update/:requestId', isAuthenticated, async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const updatedRequest = await Request.findByIdAndUpdate(requestId, req.body, {new: true})
        .populate({
            path: "listing",
            select: "_id title city country",
        })
        .populate({
            path: "traveler",
            select: "_id username",
        })
        .populate({
            path: "host",
            select: "_id username",
        });
        res
        .status(200)
        .json({data: updatedRequest, message: "Request updated."});
    } catch(error) {
        next(error);
    }
});
// DELETE /request/delete/:requestId - delete One request
router.delete('/delete/:requestId', isAuthenticated, async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const deletedRequest = await Request.findByIdAndDelete(requestId);
        res
        .status(204)
        .json({ message: "Request deleted." });
    } catch(error) {
        next(error);
    }
});
module.exports = router;