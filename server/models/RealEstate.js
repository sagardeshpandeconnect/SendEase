const mongoose = require('mongoose');

const realEstateSchema = new mongoose.Schema({
 
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  propertyType: {
    type: String,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
  },
  amenities: {
    type: [String],
    required: true
  },
  images: [
    {
      url: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      }
    }
  ],
  seller: {
    sellerId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    agency: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true
    }
  },
  availability: {
    type: String,
    required: true
  },
  dateListed: {
    type: Date,
    required: true
  }
});

const RealEstate = mongoose.model('RealEstate', realEstateSchema);

module.exports = RealEstate;
