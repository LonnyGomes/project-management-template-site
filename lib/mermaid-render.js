const path = require('path');
const puppeteer = require('puppeteer');
const mermaid = require('mermaid');
const MERMAID_URL = `file://${path.join(__dirname, 'mermaid-render.html')}`;

mermaid.mermaidAPI.initialize({
    startOnLoad: false,
});

const renderMermaidDef = async (definition) => {
    let browser = null;
    const mermaidFontFamily = 'Ubuntu, sans-serif';
    const themeCSS = `
        .titleText { 
            font-family: ${mermaidFontFamily};
        }
        
        .taskText {
            font-family: ${mermaidFontFamily};
        }
        `;
    const mermaidConfig = {
        theme: 'neutral',
        themeCSS,
        gantt: {
            titleTopMargin: 25,
            barHeight: 20,
            barGap: 4,
            topPadding: 50,
            leftPadding: 75,
            gridLineStartPadding: 35,
            fontSize: 12,
            fontFamily: '"Open-Sans", "sans-serif"',
            numberSectionStyles: 4,
            axisFormat: '%m-%d-%Y',
        },
    };

    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(MERMAID_URL);

        // generate mermaid chart
        await page.$eval(
            '#container',
            (container, definition, config) => {
                container.innerHTML = definition;
                window.mermaid.initialize(config);
                window.mermaid.init(undefined, container);
            },
            definition,
            mermaidConfig
        );

        // extract SVG contents
        const svgOutput = await page.$eval(
            '#container',
            (container) => container.innerHTML
        );

        await browser.close();

        return svgOutput;
    } catch (error) {
        if (browser) {
            // close the browser session
            browser.close();
        }

        // re-throw the error after we
        throw error;
    }
};

module.exports = { renderMermaidDef };
