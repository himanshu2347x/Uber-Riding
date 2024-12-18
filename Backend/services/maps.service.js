const axios = require("axios");
const captainModel = require("../models/captain.model");

const getAddressCoordinate = async (address) => {
  const apiKey = process.env.HERE_API_KEY; // Ensure you set this in your environment
  if (!apiKey) {
    throw new Error("HERE_API_KEY is not set in the environment variables.");
  }

  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
    address
  )}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);

    if (response.data.items && response.data.items.length > 0) {
      const location = response.data.items[0];
      return {
        ltd: location.position.lat,
        lng: location.position.lng,
      };
    } else {
      throw new Error(
        "Unable to fetch coordinates. Please verify the address."
      );
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error.message);
    throw error;
  }
};

const getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const apiKey = process.env.HERE_API_KEY;
  if (!apiKey) {
    throw new Error("HERE_API_KEY is not set in the environment variables.");
  }

  // Convert city names to coordinates
  const originCoordinates = await getAddressCoordinate(origin);
  const destinationCoordinates = await getAddressCoordinate(destination);

  const originString = `${originCoordinates.ltd},${originCoordinates.lng}`;
  const destinationString = `${destinationCoordinates.ltd},${destinationCoordinates.lng}`;

  const url = `https://router.hereapi.com/v8/routes?origin=${originString}&destination=${destinationString}&transportMode=car&return=summary&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);

    // Log the full API response for debugging


    if (response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0].sections[0];

      // Fetching distance in meters
      const distance = route.summary?.length;
      if (typeof distance !== "number") {
        throw new Error(
          "Distance information is missing or invalid in the API response."
        );
      }

      // Fetching duration in seconds
      const duration = route.summary?.duration;
      if (typeof duration !== "number") {
        throw new Error(
          "Duration information is missing or invalid in the API response."
        );
      }

      // Return the raw values
      return {
        distance, 
        duration, 
      };
    } else {
      throw new Error("No routes found between the given locations.");
    }
  } catch (err) {
    console.error("Error fetching distance and time:", err.message);
    throw err;
  }
};


const getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("Query is required");
  }

  const apiKey = process.env.HERE_API_KEY;
  if (!apiKey) {
    throw new Error("HERE_API_KEY is not set in the environment variables.");
  }

  // Construct the API URL for HERE Places Autosuggest
  const url = `https://autosuggest.search.hereapi.com/v1/autosuggest?at=0,0&q=${encodeURIComponent(
    input
  )}&apiKey=${apiKey}`;

  try {
    const response = await axios.get(url);


    if (response.data.items && response.data.items.length > 0) {
      // Extracting suggestions
      return response.data.items
        .map((item) => item.title)
        .filter((title) => title); // Filter out any undefined or empty titles
    } else {
      throw new Error("No suggestions found");
    }
  } catch (err) {
    console.error("Error fetching autocomplete suggestions:", err.message);
    throw err;
  }
};


const getCaptainsInTheRadius = async (ltd, lng, radius) => {
  try {
    const captains = await captainModel.find({
      location: {
        $geoWithin:{
          $centerSphere:[[ltd,lng],radius/ 6371]
        }
      }
    })

    return captains;
  } catch (error) {
  }
}

module.exports = {
  getAddressCoordinate,
  getDistanceTime,
  getAutoCompleteSuggestions,
  getCaptainsInTheRadius,
};
