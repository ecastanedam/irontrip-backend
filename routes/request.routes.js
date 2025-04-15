const router = require("express").Router();
const Request = require("../models/Request.model");
const { isAuthenticated } = require("../middlewares/jwt.middleware");

// GET /request/ - get all request
router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const allRequests = await Request.find()
      .populate({
        path: "host",
        select: "_id username",
      })
      .populate({
        path: "traveler",
        select: "_id username",
      })
      .populate("listing");
    res
      .status(200)
      .json({ data: allRequests, message: "Requests getting with succes." });
  } catch (error) {
    next(error);
  }
});

// GET /request/host/:userId - get all request for one host
router.get("/host/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;
  if (userId !== req.payload.id) {
    const error = new Error("Access denied.");
    error.status = 403;
    return next(error);
  }
  try {
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
      .json({
        data: allRequestByHost,
        message: "Requests getting with success.",
      });
  } catch (error) {
    next(error);
  }
});
// GET /request/traveler/:userId - get all request for one traveler
router.get("/traveler/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  if (userId !== req.payload.id) {
    const error = new Error("Access denied.");
    error.status = 403;
    return next(error);
  }

  try {
    const allRequestByTraveler = await Request.find({
      traveler: userId,
    }).populate({
      path: "listing",
      select: "_id title city country",
    });
    res
      .status(200)
      .json({
        data: allRequestByTraveler,
        message: "Requests getting with success.",
      });
  } catch (error) {
    next(error);
  }
});
// GET /request/user/:userId - get all the request of ons user
router.get("/user/:userId", isAuthenticated, async (req, res, next) => {
  const { userId } = req.params;

  if (userId !== req.payload.id) {
    const error = new Error("Access denied.");
    error.status = 403;
    return next(error);
  }

  try {
    const allRequestByUser = await Request.find({
      $or: [{ traveler: userId }, { host: userId }],
    }).populate({
        path: "host",
        select: "_id username",
      })
      .populate({
        path: "traveler",
        select: "_id username",
      })
      .populate("listing");
    res
      .status(200)
      .json({
        data: allRequestByUser,
        message: "Requests getting with success.",
      });
  } catch (error) {
    next(error);
  }
});

// GET /request/:requestId - get One request
router.get("/:requestId", isAuthenticated, async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const selectedRequest = await Request.findById(requestId);
    if (
      selectedRequest.host.toString() !== req.payload.id &&
      selectedRequest.traveler.toString() !== req.payload.id
    ) {
      const error = new Error("Access denied.");
      error.status = 403;
      return next(error);
    }
    res
      .status(200)
      .json({
        data: selectedRequest,
        message: "Request getting with success.",
      });
  } catch (error) {
    next(error);
  }
});
// POST /request/create - create One request
router.post("/create", isAuthenticated, async (req, res, next) => {
  try {
    const newRequest = await Request.create(req.body);
    const createdRequest = await Request.findById(newRequest._id)
      .populate({
        path: "listing",
        select: "_id title city country",
      })
      .populate({
        path: "host",
        select: "_id username",
      })
      .populate({
        path: "traveler",
        select: "_id username",
      });
    res.status(201).json({ data: createdRequest, message: "Request created." });
  } catch (error) {
    next(error);
  }
});
// PATCH /request/update/:requestId - update One request
router.patch("/update/:requestId", isAuthenticated, async (req, res, next) => {
  try {
    const { requestId } = req.params;
    // Find the request by ID
    const selectedRequest = await Request.findById(requestId);
    if (!selectedRequest) {
      // check if the request exists
      return res.status(404).json({ message: "Request not found." });
    }

    // check if the user is the host or the traveler of the request
    if (
      selectedRequest.host.toString() !== req.payload.id &&
      selectedRequest.traveler.toString() !== req.payload.id
    ) {
      const error = new Error("Access denied.");
      error.status = 403;
      return next(error);
    }
    //update the request
    const updatedRequest = await Request.findByIdAndUpdate(
      requestId,
      req.body,
      { new: true }
    )
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
    res.status(200).json({ data: updatedRequest, message: "Request updated." });
  } catch (error) {
    next(error);
  }
});
// DELETE /request/delete/:requestId - delete One request
router.delete("/delete/:requestId", isAuthenticated, async (req, res, next) => {
  try {
    const { requestId } = req.params;

    // Find the request by ID
    const selectedRequest = await Request.findById(requestId);
    if (!selectedRequest) {
      return res.status(404).json({ message: "Request not found." });
    }
    // check if the user is the host or the traveler of the request
    if (
      selectedRequest.host.toString() !== req.payload.id &&
      selectedRequest.traveler.toString() !== req.payload.id
    ) {
      const error = new Error("Access denied.");
      error.status = 403;
      return next(error);
    }
    //delete the request
    const deletedRequest = await Request.findByIdAndDelete(requestId);
    res.status(200).json({ data: deletedRequest, message: "Request deleted." });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
