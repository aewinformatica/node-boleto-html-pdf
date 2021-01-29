const fs = require("fs");
const path = require("path");

const puppeteer = require("puppeteer");

async function gerarBoletoPDF(Banco) {
  try {
    console.time("Boleto");

    const params = {
      linhaDigitavel: "10499125107500010004200019664622684960000000001",
      banco: Banco,
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
      path: `${caminhoStorage}/${params.banco}.pdf`,
      printBackground: true,
      landscape: false,
      format: "A4",
    };

    await page.pdf(pdfConfig);
    await browser.close();

    console.timeEnd("Boleto");
    return {
      status: true,
      nameFile: Banco,
    };
  } catch (error) {
    console.timeEnd("Boleto");
    console.log(error);
  }
}

module.exports = { gerarBoletoPDF };
