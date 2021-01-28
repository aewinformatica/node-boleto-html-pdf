const express = require("express");
const path = require("path");
const cors = require("cors");

const GerarBoletoController = require("./src/Controllers/GerarBoleto");

const server = express();
server.use(express.json());
server.use(cors());

server.use(
  "/boletos",
  express.static(path.resolve(__dirname, "./", "Boletos"))
);

server.get("/gerar/boleto/:banco", GerarBoletoController.GerarBoleto);

server.listen(process.env.PORT || 4444, () => {
  console.log("Rodando...");
});
