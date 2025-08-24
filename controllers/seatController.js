const RouteBlockGenerated = require("../models/RouteBlockGenerated");

// Reservar asiento
exports.reserveSeat = async (req, res) => {
  try {
    const { serviceId, seatNumber, origin, destination, passengerName, passengerDocument } = req.body;

    const service = await RouteBlockGenerated.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    let seatReservations = service.seatMatrix.get(seatNumber) || [];

    // Revisar si ya está ocupado o reservado
    const active = seatReservations.find(r => r.occupied || (r.reserved && r.reservationExpiresAt > new Date()));
    if (active) {
      return res.status(400).json({ error: "El asiento ya está ocupado o reservado." });
    }

    // Agregar reserva con expiración de 10 min
    seatReservations.push({
      seatNumber,
      reserved: true,
      reservationExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
      passengerName,
      passengerDocument,
      origin,
      destination
    });

    service.seatMatrix.set(seatNumber, seatReservations);
    await service.save();

    res.json({ message: "Asiento reservado temporalmente por 10 minutos", service });
  } catch (error) {
    res.status(500).json({ error: "Error al reservar asiento", details: error.message });
  }
};

// Confirmar asiento
exports.confirmSeat = async (req, res) => {
  try {
    const { serviceId, seatNumber, passengerDocument } = req.body;

    const service = await RouteBlockGenerated.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    let seatReservations = service.seatMatrix.get(seatNumber) || [];

    const reservation = seatReservations.find(r => r.reserved && r.passengerDocument === passengerDocument);
    if (!reservation) return res.status(404).json({ error: "Reserva no encontrada para este asiento" });

    reservation.reserved = false;
    reservation.occupied = true;
    reservation.reservationExpiresAt = null;

    service.seatMatrix.set(seatNumber, seatReservations);
    await service.save();

    res.json({ message: "Asiento confirmado", service });
  } catch (error) {
    res.status(500).json({ error: "Error al confirmar asiento", details: error.message });
  }
};

// Liberar asiento
exports.releaseSeat = async (req, res) => {
  try {
    const { serviceId, seatNumber, passengerDocument } = req.body;

    const service = await RouteBlockGenerated.findById(serviceId);
    if (!service) return res.status(404).json({ error: "Servicio no encontrado" });

    let seatReservations = service.seatMatrix.get(seatNumber) || [];

    // Filtramos eliminando la reserva
    seatReservations = seatReservations.filter(r => !(r.passengerDocument === passengerDocument && r.reserved));

    service.seatMatrix.set(seatNumber, seatReservations);
    await service.save();

    res.json({ message: "Asiento liberado", service });
  } catch (error) {
    res.status(500).json({ error: "Error al liberar asiento", details: error.message });
  }
};
