/* eslint-env node */
/* eslint-disable no-console */

const del = require('del');
const cpy = require('cpy');

async function build() {
    await del('dist/');
    await cpy('node_modules/redux/dist/redux.min.js', 'dist/node_modules/redux/dist/');
    await cpy('src/elements/mixins/*.js', 'dist/elements/mixins/');
    await cpy('src/elements/*.js', 'dist/elements/');
    await cpy('src/music/*.mp3', 'dist/music/');
    await cpy('src/utils/reducers/*.js', 'dist/utils/reducers/');
    await cpy('src/utils/*.js', 'dist/utils/');
    await cpy('src/index.html', 'dist/');
    await cpy('src/style.css', 'dist/');
}

build().catch(console.error);
