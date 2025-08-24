const mongoose = require("mongoose");



const SeatMatrixSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  occupied: { type: Boolean, default: false }, // confirmado (pagado)
  reserved: { type: Boolean, default: false }, // reserva temporal
  reservationExpiresAt: { type: Date }, // tiempo de expiración de la reserva
  passengerName: { type: String },
  passengerDocument: { type: String },
  origin: { type: String, required: true },
  destination: { type: String, required: true }
});

const RouteBlockGeneratedSchema = new mongoose.Schema({
  routeBlock: { type: mongoose.Schema.Types.ObjectId, ref: "RouteBlock", required: true },
  date: { type: Date, required: true },
  layout: { type: mongoose.Schema.Types.ObjectId, ref: "Layout", required: true },
  crew: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  segments: [
    {
      origin: String,
      destination: String,
      terminalOrigin: String,
      terminalDestination: String,
      departureDate: Date,
      departureTime: String,
      arrivalDate: Date,
      arrivalTime: String,
      priceFirst: Number,
      priceSecond: Number,
    }
  ],
  seatMatrix: { type: Map, of: [SeatMatrixSchema] }  // key = seatId, value = array de reservas por segmento
}, { timestamps: true });

module.exports = mongoose.model("RouteBlockGenerated", RouteBlockGeneratedSchema);
