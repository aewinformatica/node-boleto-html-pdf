const path = require("path");
const ejs = require("ejs");
const template = path.resolve(__dirname, "..", "assets", "layout.ejs");
const puppeteer = require("puppeteer");
const { chromium } = require("playwright");

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

    let html;
    ejs.renderFile(template, params, function (err, str) {
      if (err) {
        console.log(err);
      } else {
        html = str;
      }
    });

    const caminhoStorage = path.resolve(__dirname, "..", "Boletos");

    const browserFirefox = await chromium.launch();

    const context = await browserFirefox.newContext();
    const pageFirefox = await context.newPage();
    await pageFirefox.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfConfigFirefox = {
      path: `${caminhoStorage}/firefox.pdf`,
      printBackground: true,
      landscape: false,
      format: "A4",
    };

    await pageFirefox.pdf(pdfConfigFirefox);
    await browserFirefox.close();

    //outro

    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-system-font-check",
        "--disable-font-subpixel-positioning",
        "--disable-system-font-check",
        "--enable-font-antialiasing",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

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
