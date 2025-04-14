const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const listingSchema = new Schema(
  {
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },
    availability: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
      },
    ],

    image: {
      type: String, // URL of the image
      required: false, // Optional field
      trim: true,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Listing = model("Listing", listingSchema);

module.exports = Listing;
