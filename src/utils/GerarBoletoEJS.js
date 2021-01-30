const path = require("path");
const ejs = require("ejs");
const template = path.resolve(__dirname, "..", "assets", "layout.ejs");
const puppeteer = require("puppeteer");
const html_to_pdf = require("html-pdf-node");

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

    const browser = await puppeteer.launch({
      args: ["--no-sandbox"],
    });

    console.log(browser);

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const caminhoStorage = path.resolve(__dirname, "..", "Boletos");

    const file = { content: html };

    html_to_pdf
      .generatePdf(file, { path: `${caminhoStorage}/teste2.pdf`, format: "A4" })
      .then((pdfBuffer) => {
        console.log("PDF Buffer:-", pdfBuffer);
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
