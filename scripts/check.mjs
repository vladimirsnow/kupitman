import { readFile,access } from 'node:fs/promises';
const html=await readFile('index.html','utf8');
const paths=[...html.matchAll(/(?:src|href)="\.\/([^"#]+)"/g)].map(m=>m[1]);
for (const path of paths) await access(path);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
if(new Set(ids).size!==ids.length)throw Error('Duplicate HTML id');
for(const [,id] of html.matchAll(/href="#([^"]+)"/g)) if(!ids.includes(id)) throw Error(`Missing anchor: ${id}`);
for(const name of ['photo_2026-11-25_02-41-18.jpg','photo_2026-11-25_02-40-51.jpg','photo_2026-11-25_02-41-13.jpg','photo_2026-11-25_02-40-17.jpg','photo_2026-11-25_02-41-07.jpg'])await access(name);
console.log(`Passed: ${paths.length} local references, unique IDs, all anchor targets, five photo originals.`);
