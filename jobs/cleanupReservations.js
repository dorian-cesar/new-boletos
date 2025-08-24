const RouteBlockGenerated = require("../models/RouteBlockGenerated");

async function cleanupExpiredReservations() {
  try {
    const now = new Date();

    // Buscar todos los servicios
    const services = await RouteBlockGenerated.find();

    for (let service of services) {
      let modified = false;

      for (let [seatNumber, reservations] of service.seatMatrix.entries()) {
        // Filtrar reservas expiradas
        const updatedReservations = reservations.filter(r => {
          // Mantener ocupados o reservas activas
          return r.occupied || (r.reserved && r.reservationExpiresAt > now);
        });

        if (updatedReservations.length !== reservations.length) {
          service.seatMatrix.set(seatNumber, updatedReservations);
          modified = true;
        }
      }

      if (modified) {
        await service.save();
        console.log(`🧹 Limpieza: reservas expiradas eliminadas en servicio ${service._id}`);
      }
    }
  } catch (error) {
    console.error("Error en limpieza de reservas:", error.message);
  }
}

module.exports = cleanupExpiredReservations;
