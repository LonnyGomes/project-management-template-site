const util = require('util');
const { renderMermaidDef } = require('./lib/mermaid-render');

module.exports = function (eleventyConfig) {
    // directories to copy over
    eleventyConfig.addPassthroughCopy('src/css');
    eleventyConfig.addPassthroughCopy('src/assets');

    // layouts
    eleventyConfig.addLayoutAlias('base', 'base.njk');

    // filters
    eleventyConfig.addFilter('debug', (data) => util.inspect(data));

    // shortcodes
    eleventyConfig.addPairedNunjucksAsyncShortcode(
        'mermaid',
        async (content) => {
            let results = null;
            try {
                results = await renderMermaidDef(content);
            } catch (error) {
                results = `<pre>${error.message}</pre>`;
            }

            return results;
        }
    );

    return {
        dir: {
            input: 'src',
        },
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
    };
};
