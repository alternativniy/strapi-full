import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';

const getAllFiles = function(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath)

  arrayOfFiles = arrayOfFiles || []

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file))
    }
  })

  return arrayOfFiles
};

function writeFileSyncRecursive(filename, content = '') {
  fs.mkdirSync(path.dirname(filename), {recursive: true})
  fs.writeFileSync(filename, content)
}

// eslint-disable-next-line no-undef
const outDir = process.argv[2] ?? 'dist/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

fs.copyFileSync(toAbsolute(`${outDir}/index.html`), toAbsolute(`${outDir}/template.html`))

const template = fs.readFileSync(toAbsolute(`${outDir}/template.html`), 'utf-8');
const render = (await import('./.static/entry-server.js')).SSRRender;

const pagesPath = toAbsolute('src/pages');

// determine routes to pre-render from src/pages
const pages = getAllFiles(pagesPath).filter((page) => page.includes('.static'));

const routesToPrerender = pages.map((file) => {
  let name = file.replace(pagesPath, '').replace(/\.static.jsx$/, '').toLowerCase();

  if(name.split('/').pop() == 'index') {
    name = name.replace('index', '')
  }

  return name;
});

(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    const appHtml = await render(url);
    const scripts = `<script>window.strapiFullStaticPage = true;</script>`;

    const html = template.replace(`<!--app-html-->`, appHtml).replace('<!--ssr-scripts-->', scripts);

    let filePath = `${outDir}${url === '/' ? '/index' : url}`;

    if(filePath.endsWith('/')) {
      filePath += 'index';
    }

    filePath += '.html';


    writeFileSyncRecursive(toAbsolute(filePath), html);
  }
})();

fs.rmSync(toAbsolute('.static'), { recursive: true, force: true });
