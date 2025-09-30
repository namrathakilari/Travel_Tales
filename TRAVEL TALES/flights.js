const express = require('express');
const fetch = require('node-fetch');


const app = express();
const PORT = 3000;
const API_KEY = 'c34257a27a6dfbeb6406d0a499351c16';



app.get('/api/flights', async (req, res) => {
  const cityName = req.query.city;
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // 1) find airport by city name
    const airportRes = await fetch(
      `http://api.aviationstack.com/v1/airports?access_key=${API_KEY}&search=${encodeURIComponent(cityName)}`
    );
    const airportData = await airportRes.json();
    if (!airportData.data?.length) {
      return res.status(404).json({ error: 'No airport found for this city' });
    }

    const airport = airportData.data[0];
    const iataCode = airport.iata_code;
    if (!iataCode) {
      return res.status(404).json({ error: 'No IATA code found for the airport' });
    }

    // 2) fetch flights arriving at that IATA
    const flightsRes = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${API_KEY}&arr_iata=${encodeURIComponent(iataCode)}`
    );
    const flightsData = await flightsRes.json();
    if (!flightsData.data) {
      return res.status(404).json({ error: 'No flights found' });
    }

    const flights = flightsData.data.map(f => ({
      flightNumber: f.flight.iata || 'Unknown',
      origin: f.departure.airport || 'Unknown',
      destination: f.arrival.airport || 'Unknown',
      departureTime: f.departure.scheduled || 'Unknown',
    }));

    res.json({ flights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flights' });
  }
});

app.listen(PORT, () => {
  // ← back-ticks here, too!
  console.log(`Server running on http://localhost:${PORT}`);
});
