const path = require("path");
const ejs = require("ejs");
const template = path.resolve(__dirname, "..", "assets", "layout.ejs");
const puppeteer = require("puppeteer");

const BancosConfig = require("../utils/BancosConfig");

async function gerarBoletoPDF(linhaDigitavel) {
  try {
    console.time("Boleto");

    const codigoBanco = linhaDigitavel.substring(0, 3);

    const caminhoStorage = path.resolve(__dirname, "..", "Boletos");

    const pdfConfig = {
      path: `${caminhoStorage}/teste.pdf`,
      printBackground: true,
      landscape: false,

      format: "A4",
    };

    const params = {
      linhaDigitavel: linhaDigitavel,
      BancoVerificador: BancosConfig.Bancos[codigoBanco].NUMERO_DIGITO,
      LOGO: BancosConfig.Bancos[codigoBanco].LOGO,
      banco: BancosConfig.Bancos[codigoBanco].NOME_BANCO,
    };

    let html;
    ejs.renderFile(template, params, function (err, str) {
      if (err) {
        console.log(err);
      } else {
        html = str;
      }
    });

    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-system-font-check",
        "--disable-font-subpixel-positioning",
        "--disable-system-font-check",
        "--enable-font-antialiasing",
      ],
      defaultViewport: { width: 1300, height: 800 },
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

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
