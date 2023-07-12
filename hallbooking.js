const express = require('express');
const app = express();
app.use(express.json());

// Define an array to store the hall data
let halls = [];

// Define an array to store the booking data
let bookings = [];

// 1. Creating a Hall
app.post('/halls', (req, res) => {
  const { hallName, capacity, amenities, pricePerHour } = req.body;
  const hallId = halls.length + 1;
  const hall = {
    hallId,
    hallName,
    capacity,
    amenities,
    pricePerHour
  };
  halls.push(hall);
  res.status(201).json(hall);
});

// 2. Booking a Hall
app.post('/bookings', (req, res) => {
  const { customerName, date, startTime, endTime, hallId } = req.body;
  const bookingId = bookings.length + 1;
  const hall = halls.find(hall => hall.hallId === hallId);
  if (!hall) {
    res.status(404).json({ error: 'Hall not found.' });
    return;
  }
  const booking = {
    bookingId,
    customerName,
    date,
    startTime,
    endTime,
    hallId
  };
  bookings.push(booking);
  res.status(201).json(booking);
});

// 3. List all Halls with Booked Data
app.get('/halls/bookings', (req, res) => {
  const bookedHalls = halls.map(hall => {
    const bookingsForHall = bookings.filter(booking => booking.hallId === hall.hallId);
    return {
      hallName: hall.hallName,
      booked: bookingsForHall.length > 0,
      bookings: bookingsForHall
    };
  });
  res.json(bookedHalls);
});

// 4. List all customers with booked Data
app.get('/customers/bookings', (req, res) => {
  const customersWithBookings = bookings.map(booking => {
    const hall = halls.find(hall => hall.hallId === booking.hallId);
    return {
      customerName: booking.customerName,
      hallName: hall ? hall.hallName : 'Hall not found',
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime
    };
  });
  res.json(customersWithBookings);
});

// 5. List how many times a customer has booked the hall
app.get('/customers/:customerName/bookings', (req, res) => {
  const { customerName } = req.params;
  const customerBookings = bookings.filter(booking => booking.customerName === customerName);
  res.json(customerBookings);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
