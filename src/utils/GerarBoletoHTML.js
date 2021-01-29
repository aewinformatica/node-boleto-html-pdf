const path = require("path");

const puppeteer = require("puppeteer");

const BancosConfig = require("../utils/BancosConfig");

async function gerarBoletoPDF(linhaDigitavel) {
  try {
    console.time("Boleto");

    const codigoBanco = linhaDigitavel.substring(0, 3);

    const params = {
      linhaDigitavel: linhaDigitavel,
      BancoVerificador: BancosConfig.Bancos[codigoBanco].NUMERO_DIGITO,
      LOGO: BancosConfig.Bancos[codigoBanco].LOGO,
      banco: BancosConfig.Bancos[codigoBanco].NOME_BANCO,
    };

    const paramsString = JSON.stringify(params);

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(
      `http://127.0.0.1:5501/src/assets/layout.html?params=${paramsString}`,
      {
        waitUntil: "networkidle0",
      }
    );

    const caminhoStorage = path.resolve(__dirname, "..", "Boletos");

    const pdfConfig = {
      path: `${caminhoStorage}/teste.pdf`,
      printBackground: true,
      landscape: false,
      format: "A4",
    };

    await page.pdf(pdfConfig);
    await browser.close();

    console.timeEnd("Boleto");
    return {
      status: true,
      nameFile: "teste",
    };
  } catch (error) {
    console.timeEnd("Boleto");
    console.log(error);
  }
}

module.exports = { gerarBoletoPDF };
