const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const requestSchema = new Schema(
  {
    traveler: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },

    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    arrivalDate: {
      type: Date,
      required: true,
    },

    departureDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > this.arrivalDate;
        },
        message: "Departure date must be after arrival date.",
      },
    },

    messageToHost: {
      type: String,
      required: true,
      maxlength: 300,
    },
    
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Request = model("Request", requestSchema);

module.exports = Request;
