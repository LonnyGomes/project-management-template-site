const util = require('util');

module.exports = function (eleventyConfig) {
    // directories to copy over
    eleventyConfig.addPassthroughCopy('src/css');
    eleventyConfig.addPassthroughCopy('src/assets');

    // layouts
    eleventyConfig.addLayoutAlias('base', 'base.njk');

    // filters
    eleventyConfig.addFilter('debug', (data) => util.inspect(data));

    return {
        dir: {
            input: 'src',
        },
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
    };
};
