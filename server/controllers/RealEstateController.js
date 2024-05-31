const RealEstate = require('../models/RealEstate')

const getRealEstateData = async (req, res) => {
    try {
      const realEstate = await RealEstate.find();
      res.status(200).json(realEstate);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  module.exports = {
    getRealEstateData
  };