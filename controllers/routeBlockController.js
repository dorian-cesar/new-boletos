const RouteBlock = require('../models/RouteBlock');
const RouteMaster = require('../models/RouteMaster');

// Crear nuevo bloque
exports.createRouteBlock = async (req, res) => {
  try {
    const { routeMasterId, name, stops, layoutId } = req.body;

    if (!routeMasterId || !stops || stops.length < 2 || !layoutId) {
      return res.status(400).json({ error: 'Campos obligatorios: routeMasterId, stops[2+], layoutId' });
    }

    // validar que cada stop tenga los campos nuevos
    for (const stop of stops) {
      if (!stop.startTime || !stop.terminalOrigin || stop.priceFirst == null || stop.priceSecond == null) {
        return res.status(400).json({ 
          error: `Cada parada debe incluir startTime, terminalOrigin, priceFirst y priceSecond. Error en parada: ${stop.name}` 
        });
      }
    }

    const routeMaster = await RouteMaster.findById(routeMasterId);
    if (!routeMaster) return res.status(404).json({ error: 'Ruta maestra no encontrada.' });

    const sortedStops = stops.sort((a, b) => a.order - b.order);

    const block = new RouteBlock({
      routeMaster: routeMasterId,
      name,
      stops: sortedStops,
      layout: layoutId
    });

    await block.save();
    res.status(201).json(block);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el bloque de ruta', details: error.message });
  }
};
