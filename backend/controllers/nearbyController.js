const axios = require('axios');

// Maps our friendly category names to OpenStreetMap's tagging system
const CATEGORY_TAGS = {
  police: 'amenity=police',
  hospital: 'amenity=hospital',
  pharmacy: 'amenity=pharmacy',
  shelter: 'amenity=shelter',
};

// GET nearby places based on latitude, longitude, and category
exports.getNearbyPlaces = async (req, res) => {
  try {
    const { lat, lng, category } = req.query;

    if (!lat || !lng || !category) {
      return res.status(400).json({ message: 'Latitude, longitude, and category are required' });
    }

    const tag = CATEGORY_TAGS[category];
    if (!tag) {
      return res.status(400).json({ message: 'Invalid category. Use: police, hospital, pharmacy, or shelter' });
    }

    // Overpass QL query: find places matching the tag within 3km of the given point
    const query = `
      [out:json];
      node[${tag}](around:3000,${lat},${lng});
      out body 15;
    `;

    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      query,
      { headers: { 'Content-Type': 'text/plain' } }
    );

    // Format the results into something simple and clean for our frontend
    const places = response.data.elements.map((place) => ({
      id: place.id,
      name: place.tags.name || 'Unnamed location',
      latitude: place.lat,
      longitude: place.lon,
      address: place.tags['addr:street'] || 'Address not available',
    }));

    res.status(200).json(places);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch nearby places', error: error.message });
  }
};