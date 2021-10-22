const puppeteer = require("puppeteer");
//const ac = require("@antiadmin/anticaptchaofficial");
require('colors');

const url = "https://www.igssgt.org/cuotas/";
const igssMessages = [
    "Este número de DPI o Número de Afiliado, no existe.",
    `Regresar a <a href="/cuotas"> Consulta de Cuotas</a>`,
    "Afiliado, sin informacion que mostrar.",
    "Fecha de nacimiento no coincide con la fecha del Afiliado.",
    "Ocurrio un error inesperado"
];

async function scraping(data) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            defaultViewport: null,
            args: ['--no-sandbox'],
            ignoreHTTPSErrors: true,
            slowMo: 0,
            timeout: 0,
        });

        let results = {};

        // console.log("Opening new tab...");

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);
        console.log('Fill form...');
        await fillFormAndSubmit(page, data);

        try {
            console.log('extrayendo informacion...');
            await page.waitForSelector("#divPatronos", {
                timeout: 18000
            });

            await page.waitForSelector("select[name=zero_config_length]");
            await page.type("select[name=zero_config_length]", "100");
            await page.waitForTimeout(5000);
            console.log("filas seleccionadas...");

            const getBodyRows = await page.evaluate(() => {

                function Row(num, patron, reasonSocial, date, input) {
                    this.noPatronal = num;
                    this.patrono = patron;
                    this.nombreComercial = reasonSocial;
                    this.contribuciones = date;
                    this.aporte = input;
                }

                const bodyRows = [];
                const colums = document.querySelectorAll("#zero_config tbody tr")
                    .length;
                for (let i = 1; i <= colums; i++) {
                    const num = document.querySelector(
                        `#zero_config tbody tr:nth-of-type(${i}) th:nth-of-type(2)`
                    ).innerText;
                    const patron = document.querySelector(
                        `#zero_config tbody tr:nth-of-type(${i}) th:nth-of-type(3)`
                    ).innerText;
                    const reasonSocial = document.querySelector(
                        `#zero_config tbody tr:nth-of-type(${i}) th:nth-of-type(4)`
                    ).innerText;
                    const date = document.querySelector(
                        `#zero_config tbody tr:nth-of-type(${i}) th:nth-of-type(1)`
                    ).innerText;
                    const input = document.querySelector(
                        `#zero_config tbody tr:nth-of-type(${i}) th:nth-of-type(5)`
                    ).innerText;
                    bodyRows.push(new Row(num, patron, reasonSocial, date, input));
                }
                return bodyRows;
            });
            console.log('retornando resultados');
            results = {
                name: data.name,
                dpi: data.dpi,
                data: getBodyRows,
            };



        } catch (error) {
            try {
                console.log('Analizando un error');
                const igssResponse = await page.evaluate(() => {
                    return document.querySelector(
                        ".container center h5:nth-of-type(1)"
                    ).innerHTML;
                });

                if (igssResponse) {
                    console.log('comparando respuestas del error...');
                    if (igssResponse === igssMessages[0]) results = response(data, igssMessages[0]);
                    if (igssResponse === igssMessages[1]) results = response(data, igssMessages[2]);
                    if (igssResponse === igssMessages[3]) results = response(data, igssMessages[3]);

                } else {
                    console.log("respuesta igss: " + igssResponse);
                    results = response(data, 'Ocurrio un error inesperado');
                }

            } catch (err) {
                console.log("Fallo al analizar el error");
                console.log(err.message);
                await browser.close();
                console.log('Cerrando navegador 2');
                return results = response(data, igssResponse[4]);
            }
        }

        console.log('Cerrando navegador 1');
        await browser.close();
        return results;
    } catch (error) {
        try {
            await browser.close();
        } catch (error) {
            console.log(error);
        }
    }

}


const response = (data, message) => {
    return {
        name: data.name,
        dpi: data.dpi,
        data: [{
            noPatronal: "n/a",
            patrono: message,
            nombreComercial: "n/a",
            contribuciones: "n/a",
            aporte: "n/a",
        }]
    };
};

const fillFormAndSubmit = async (page, data) => {
    try {
        await page.goto(url);
        await page.waitForSelector("#FormDatos");

    } catch (error) {
        console.log("Conection error, retrying...");
        await page.goto(url);
        await page.waitForSelector("#FormDatos");
    }

    await page.evaluate(() => {
        document.querySelector('#FormDatos .g-recaptcha div:nth-of-type(1)').remove();
    });


    await page.waitForTimeout(4000);
    // console.log("Filling form...");
    await page.type("input[name=txtNumAfiliado]", data.dpi);
    await page.type("select[name=nacimiento-dia]", data.day);
    await page.type("select[name=nacimiento-mes]", data.month);
    await page.type("select[name=nacimiento-anio]", data.year);
    // console.log("Form fill...");

    try {
        // console.log("Submit form...");
        await page.waitForSelector("#btnConsultar");
        await page.click("#btnConsultar");
    } catch (error) {
        console.error(error);
        // console.log("x2 Submit form...");
        await page.waitForSelector("#btnConsultar");
        await page.click("#btnConsultar");
    }
};

module.exports = scraping;