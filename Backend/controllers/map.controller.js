const { validationResult } = require("express-validator");
const mapService = require("../services/maps.service");

module.exports.getCoordinates = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({
        message: "Address is required",
      });
    }

    const coordinates = await mapService.getAddressCoordinate(address);

    return res.status(200).json({
      success: true,
      coordinates,
    });
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);

    if (error.message === "Unable to fetch coordinates") {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.getDistanceTime = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({
        message: "Origin and destination are required",
      });
    }

    const distanceTime = await mapService.getDistanceTime(origin, destination);

    res.status(200).json({
      success: true,
      distanceTime,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.getAutoCompleteSuggestions = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { input } = req.query;

    const suggestions = await mapService.getAutoCompleteSuggestions(input);

    res.status(200).json(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
