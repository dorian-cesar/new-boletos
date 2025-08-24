const RouteBlock = require("../models/RouteBlock");
const RouteBlockTemplate = require("../models/RouteBlockTemplate");

// Crear plantilla desde un bloque de ruta
exports.createTemplateFromBlock = async (req, res) => {
  try {
    const { routeBlockId, daysOfWeek, horizonDays, company } = req.body;

    if (!routeBlockId || !daysOfWeek) {
      return res.status(400).json({ error: "Campos obligatorios: routeBlockId, daysOfWeek" });
    }

    // Buscar el bloque
    const routeBlock = await RouteBlock.findById(routeBlockId).populate("layout");
    if (!routeBlock) {
      return res.status(404).json({ error: "Bloque de ruta no encontrado" });
    }

    const stops = routeBlock.stops.sort((a, b) => a.order - b.order);

    const segments = [];

    // Generar todas las combinaciones de segmentos
    for (let i = 0; i < stops.length - 1; i++) {
      for (let j = i + 1; j < stops.length; j++) {
        const origin = stops[i];
        const destination = stops[j];

        segments.push({
          origin: origin.name,
          destination: destination.name,
          terminalOrigin: origin.terminalOrigin,
          terminalDestination: destination.terminalOrigin, // usamos el terminalOrigin de la parada destino
          departureDate: new Date(), // puedes ajustar para que sea la fecha inicial del template
          departureTime: origin.startTime,
          arrivalDate: new Date(), // puedes calcular fecha real si es overnight
          arrivalTime: destination.startTime,
          priceFirst: destination.priceFirst,
          priceSecond: destination.priceSecond,
        });
      }
    }

    const template = new RouteBlockTemplate({
      routeBlock: routeBlock._id,
      layout: routeBlock.layout,
      daysOfWeek,
      horizonDays: horizonDays || 14,
      company: company || "Sin definir",
      segments,
    });

    await template.save();

    res.status(201).json(template);
  } catch (error) {
    console.error("Error al crear plantilla:", error);
    res.status(500).json({ error: "Error al crear plantilla desde bloque", details: error.message });
  }
};
