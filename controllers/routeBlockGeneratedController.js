// controllers/routeBlockGeneratedController.js
const RouteBlockTemplate = require("../models/RouteBlockTemplate");
const RouteBlockGenerated = require("../models/RouteBlockGenerated");
const Layout = require("../models/Layout");

exports.generateFromTemplate = async (req, res) => {
  try {
    const { templateId, startDate } = req.body;

    // Buscar plantilla
    const template = await RouteBlockTemplate.findById(templateId)
      .populate("routeBlock")
      .populate("layout");
     // .populate("crew");

    if (!template) {
      return res.status(404).json({ message: "Template no encontrado" });
    }

    // Obtener layout y seats
    const layout = template.layout;
    if (!layout) {
      return res.status(400).json({ message: "La plantilla no tiene layout válido" });
    }

    const seats = [];
    if (layout.floor1?.seatMap) {
      layout.floor1.seatMap.forEach(row =>
        row.forEach(seatId => seatId && seats.push(seatId))
      );
    }
    if (layout.floor2?.seatMap) {
      layout.floor2.seatMap.forEach(row =>
        row.forEach(seatId => seatId && seats.push(seatId))
      );
    }

    // Configuración de fechas
    const start = new Date(startDate);
    const totalDays = template.horizonDays || 14;
    const generatedServices = [];

    for (let dayOffset = 0; dayOffset < totalDays; dayOffset++) {
      const currentDate = new Date(start);
      currentDate.setDate(start.getDate() + dayOffset);

      if (!template.daysOfWeek.includes(currentDate.getDay())) continue;

      // Crear seatMatrix por cada asiento y segmento
      const seatMatrix = {};
      for (const seatId of seats) {
        seatMatrix[seatId] = template.segments.map(seg => ({
          seatNumber: seatId,
          occupied: false,
          passengerName: null,
          passengerDocument: null,
          origin: seg.origin,
          destination: seg.destination
        }));
      }

      // Crear y guardar servicio
      const generatedService = new RouteBlockGenerated({
        routeBlock: template.routeBlock,
        date: currentDate,
        layout: layout._id,
        crew: template.crew,
        segments: template.segments,
        seatMatrix
      });

      await generatedService.save();
      generatedServices.push(generatedService);
    }

    res.status(201).json({
      message: "Servicios generados desde plantilla correctamente",
      total: generatedServices.length,
      data: generatedServices
    });
  } catch (error) {
    console.error("Error al generar servicios desde plantilla:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
