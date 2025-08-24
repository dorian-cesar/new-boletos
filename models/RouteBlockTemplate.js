const mongoose = require("mongoose");

const RouteBlockTemplateSchema = new mongoose.Schema({
  routeBlock: { type: mongoose.Schema.Types.ObjectId, ref: "RouteBlock", required: true },
  layout: { type: mongoose.Schema.Types.ObjectId, ref: "Layout", required: true },
//  crew: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  daysOfWeek: { type: [Number], required: true },
  horizonDays: { type: Number, default: 14 },
  company: { type: String },

  segments: [
    {
      origin: { type: String, required: true },
      destination: { type: String, required: true },
      terminalOrigin: { type: String , required: true },
      terminalDestination: { type: String , required: true },
      departureDate: { type: Date, required: true },
      departureTime: { type: String, required: true },
      arrivalDate: { type: Date, required: true },
      arrivalTime: { type: String, required: true },
      priceFirst: { type: Number },
      priceSecond: { type: Number },
    }
  ],
}, { timestamps: true });

module.exports = mongoose.model("RouteBlockTemplate", RouteBlockTemplateSchema);
