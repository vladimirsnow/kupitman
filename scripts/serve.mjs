import { createServer } from 'node:http';
import { readFile,stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root=process.cwd(), port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.ttf':'font/ttf'};
createServer(async(req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let path=resolve(root,'.'+name);if(!path.startsWith(root+sep)&&path!==root)throw Error('Path');if((await stat(path)).isDirectory())path=resolve(path,'index.html');const data=await readFile(path);res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'});res.end(data)}catch{res.writeHead(404);res.end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Купитман: http://127.0.0.1:${port}`));
