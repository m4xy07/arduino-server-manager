
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB using mongoose
mongoose.connect('mongodb://127.0.0.1:27017/weather-data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB server');
});

const weatherSchema = new mongoose.Schema({
  time: String,
  temperature: Number,
  humidity: Number,
  aqi: Number,
  hi: Number,
  alt: Number,
  pres: Number,
  moisture: Number,
  crop: String,
  raining: String,
  wifiStrength: Number,
});

const WeatherData = mongoose.model('WeatherData', weatherSchema);

app.post('/data', async (req, res) => {
  // Print out the JSON data being received
  console.log('Received JSON data:', req.body);

  // Create a new weather document
  const newWeatherData = new WeatherData({
    time: req.body.time,
    temperature: req.body.temperature,
    humidity: req.body.humidity,
    aqi: req.body.aqi,
    hi: req.body.hi,
    alt: req.body.alt,
    pres: req.body.pres,
    moisture: req.body.moisture,
    crop: req.body.crop,
    raining: req.body.raining,
    wifiStrength: req.body.wifi_strength,
  });

  // Print out the data being saved to the database
  console.log('Saving weather data:', newWeatherData);

  // Save the new weather document to the database
  await newWeatherData.save();

  // Send a response back to the client
  res.status(200).send('Data received and saved to database');
});

app.get('/data', async (req, res) => {
  const weatherData = await WeatherData.find({});
  res.status(200).json(weatherData);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});