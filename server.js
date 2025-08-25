require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cron = require("node-cron");


const templatesRoutes = require("./routes/templates");
const rutaMaster = require("./routes/routeMasters");
const routeBlock = require("./routes/routeBlocks");
const layoutsRoutes = require('./routes/layouts');
const generateFromTemplateRoutes = require("./routes/generateFromTemplate");
const terminalRoutes = require('./routes/terminals');
const cityRoutes = require('./routes/cities');
const tipoServicioRoutes = require('./routes/busServiceTypes');
const cityRoutes2 = require("./routes/origenRoute");
const seatRoutes = require("./routes/seatRoutes");
const servicesRoutes = require("./routes/services");


const cleanupExpiredReservations = require("./jobs/cleanupReservations");


const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/templates", templatesRoutes);
app.use("/api/rutaMaster", rutaMaster);
app.use("/api/bloques-ruta", routeBlock);
app.use('/api/layouts', layoutsRoutes);
app.use("/api/generate-from-template", generateFromTemplateRoutes);
app.use('/api/terminales', terminalRoutes);
app.use('/api/ciudades', cityRoutes);
app.use('/api/tipoServicio', tipoServicioRoutes);
app.use("/api/origenes", cityRoutes2);
app.use("/api/seat", seatRoutes);
app.use("/api/services", servicesRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => console.log(`🚍 Servidor corriendo en puerto ${PORT}`));

    cron.schedule("*/1 * * * *", async () => {
      console.log("⏰ Ejecutando limpieza de reservas...(10min)");
      await cleanupExpiredReservations();
    });
   
  })
  .catch(err => console.error("❌ Error conectando a MongoDB", err));
