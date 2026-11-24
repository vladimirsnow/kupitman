import { mkdir, cp, readdir } from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for (const file of ['index.html','style.css','app.js','ball.js','.nojekyll','assets',...(await readdir('.')).filter(f=>/^photo_.*\.jpg$/.test(f))]) await cp(file,`dist/${file}`,{recursive:true});
console.log('Static website built in dist/');
