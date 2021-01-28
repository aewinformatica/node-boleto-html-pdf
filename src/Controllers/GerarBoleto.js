const { gerarBoletoPDF } = require("../utils/GerarBoleto");

module.exports = {
  async GerarBoleto(req, res) {
    const { banco } = req.params;
    const host = req.headers.host;

    const response = await gerarBoletoPDF(banco);

    if (response.status) {
      res.json({
        url: `http://${host}/boletos/${response.nameFile}.pdf`,
      });
    } else {
      res.json({ error: "Erro ao gerar PDF" });
    }
  },
};
