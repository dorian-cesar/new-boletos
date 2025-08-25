const RouteBlockGenerated = require("../models/RouteBlockGenerated");

exports.getServicesByRouteAndDate = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;

    if (!origin || !destination || !date) {
      return res.status(400).json({ message: "Debes indicar origin, destination y date" });
    }

    // Normalizamos la fecha: buscamos solo los servicios del día indicado
    const searchDate = new Date(date);
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    // Buscar servicios generados en esa fecha y que tengan al menos un segmento con ese origen-destino
    const services = await RouteBlockGenerated.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      "segments.origin": origin,
      "segments.destination": destination
    })
      .populate("layout")
      //.populate("crew")
      .populate("routeBlock");

    if (!services.length) {
      return res.status(404).json({ message: "No se encontraron servicios para esa ruta y fecha" });
    }

    // Opcional: devolver solo los segmentos relevantes dentro de cada servicio
    const formatted = services.map(service => {
      const matchingSegments = service.segments.filter(
        seg => seg.origin === origin && seg.destination === destination
      );

      return {
        _id: service._id,
        date: service.date,
        routeBlock: service.routeBlock,
        layout: service.layout,
        crew: service.crew,
        segments: matchingSegments,
        seatMatrix: service.seatMatrix
      };
    });

    res.json(formatted);

  } catch (error) {
    console.error("Error buscando servicios:", error);
    res.status(500).json({ message: "Error interno del servidor", error: error.message });
  }
};
