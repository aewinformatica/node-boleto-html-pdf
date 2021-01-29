const { gerarBoletoPDF } = require("../utils/GerarBoletoEJS");

module.exports = {
  async GerarBoleto(req, res) {
    const { linhaDigitavel } = req.params;
    const host = req.headers.host;

    const response = await gerarBoletoPDF(linhaDigitavel);

    if (response.status) {
      res.json({
        url: `http://${host}/boletos/${response.nameFile}.pdf`,
      });
    } else {
      res.json({ error: "Erro ao gerar PDF" });
    }
  },
};
