const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
        "Please fill a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: 6,
    },

    city: {
      type: String,
      required: [true, "City is required."],
    },

    country: {
      type: String,
      required: [true, "Country is required."],
    },
       
    offerSpace: {
      type: Boolean,
      default: false,
    },
    bio: {
      type: String,
      maxlength: 300,
    },
    profilePicture: {
      type: String,
      default:
        "https://res.cloudinary.com/dy3z5jv7f/image/upload/v1698238444/irontrip/default-profile-picture.png",
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;
