const mongoose = require("mongoose");

const StopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, required: true },
  startTime: { type: String, required: true }, // hora de salida en esa parada
  terminalOrigin: { type: String, required: true },
  priceFirst: { type: Number, required: true },
  priceSecond: { type: Number, required: true }
});

const RouteBlockSchema = new mongoose.Schema({
  routeMaster: { type: mongoose.Schema.Types.ObjectId, ref: "RouteMaster", required: true },
  name: { type: String, required: true },
  stops: [StopSchema],
  layout: { type: mongoose.Schema.Types.ObjectId, ref: "Layout", required: true }
}, { timestamps: true });

module.exports = mongoose.model("RouteBlock", RouteBlockSchema);

