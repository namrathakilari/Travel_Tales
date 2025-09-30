const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

// Initialize environment variables
dotenv.config();

const app = express();

// Set view engine to EJS
app.set('view engine', 'ejs');

// Serve static files (for CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));

// Home route
app.get('/', (req, res) => {
  res.render('index', { hotels: null, error: null });
});

// Hotel search route
app.post('/search', async (req, res) => {
  const city = req.body.city;
  const rapidApiKey = process.env.RAPIDAPI_KEY;
 

  if (!city) {
    return res.render('index', { hotels: null, error: 'Please enter a city.' });
  }

  try {
    // Call RapidAPI Hotel Search API
    const response = await axios.get('https://hotels4.p.rapidapi.com/locations/v2/search', {
      params: { query: city, locale: 'en_US', currency: 'INR' },
      headers: {
        'X-RapidAPI-Host': 'hotels4.p.rapidapi.com',
        'X-RapidAPI-Key': rapidApiKey,
      },
    });

    const hotels = response.data.suggestions[0]?.entities || [];

    if (hotels.length === 0) {
      return res.render('index', { hotels: null, error: 'No hotels found for this city.' });
    }

    // Render hotels on the page
    res.render('index', { hotels: hotels, error: null });
  } catch (error) {
    console.error(error);
    res.render('index', { hotels: null, error: 'Something went wrong. Please try again later.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
