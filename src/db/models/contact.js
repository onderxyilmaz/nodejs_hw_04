const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    contactType: {
      type: String,
      enum: ['personal', 'work', 'family', 'other'],
      default: 'personal',
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;