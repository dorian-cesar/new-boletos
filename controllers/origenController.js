const RouteBlockGenerated = require("../models/RouteBlockGenerated");

exports.getCities = async (req, res) => {
  try {
    // Buscar todos los segmentos de todos los servicios generados
    const services = await RouteBlockGenerated.find({}, "segments");

    const cityMap = new Map();

    services.forEach(service => {
      service.segments.forEach(seg => {
        if (!cityMap.has(seg.origin)) {
          cityMap.set(seg.origin, new Set());
        }
        cityMap.get(seg.origin).add(seg.destination);
      });
    });

    // Convertimos los sets en arrays
    const result = [];
    for (let [origin, destinations] of cityMap.entries()) {
      result.push({
        origin,
        destinations: Array.from(destinations)
      });
    }

    res.json(result);
  } catch (error) {
    console.error("Error al obtener ciudades:", error);
    res.status(500).json({ error: "Error al obtener ciudades", details: error.message });
  }
};
