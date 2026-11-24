import * as THREE from './assets/vendor/three.module.min.js';
const stage=document.getElementById('ball-stage'),canvas=document.getElementById('ball-canvas'),button=document.getElementById('ball-spin');
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let kick=0,visible=false,frame=0,last=0;
try{
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,100);camera.position.set(0,0,5.7);
 scene.add(new THREE.HemisphereLight(0xffffff,0x603c30,2.6));
 const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(-3,4,4);scene.add(key);
 const rim=new THREE.DirectionalLight(0xffd2aa,2);rim.position.set(4,1,-1);scene.add(rim);
 const ball=new THREE.Group();scene.add(ball);ball.rotation.set(.3,.3,-.4);
 // Geometric seams and a fine repeating bump give the ball a tactile surface.
 const textureCanvas=document.createElement('canvas');textureCanvas.width=128;textureCanvas.height=128;
 const ctx=textureCanvas.getContext('2d');ctx.fillStyle='#999';ctx.fillRect(0,0,128,128);ctx.fillStyle='#666';
 for(let y=0;y<128;y+=8)for(let x=0;x<128;x+=8){ctx.beginPath();ctx.arc(x+(y%16?4:0),y,1.7,0,Math.PI*2);ctx.fill()}
 const bump=new THREE.CanvasTexture(textureCanvas);bump.wrapS=bump.wrapT=THREE.RepeatWrapping;bump.repeat.set(9,5);
 const skin=new THREE.MeshStandardMaterial({color:0xb16137,roughness:.72,bumpMap:bump,bumpScale:.035});
 ball.add(new THREE.Mesh(new THREE.SphereGeometry(.98,64,48),skin));
 const seamMat=new THREE.MeshStandardMaterial({color:0x351c13,roughness:.9});
 const seamGeo=new THREE.TorusGeometry(.982,.011,8,160);
 for(const rot of [[0,0,0],[Math.PI/2,0,0],[0,Math.PI/2,0]]){let ring=new THREE.Mesh(seamGeo,seamMat);ring.rotation.set(...rot);ball.add(ring)}
 for(const sign of [-1,1]){let pts=[];for(let i=0;i<=150;i++){const t=i/150*Math.PI*2;const y=.982*Math.sin(t),a=sign*.50*Math.cos(t);pts.push(new THREE.Vector3(.982*Math.cos(t)*Math.cos(a),y,.982*Math.cos(t)*Math.sin(a)))}ball.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),150,.011,7,true),seamMat))}
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d');const grad=sc.createRadialGradient(64,64,0,64,64,64);grad.addColorStop(0,'#1a1b1833');grad.addColorStop(1,'#1a1b1800');sc.fillStyle=grad;sc.fillRect(0,0,128,128);
 const shadow=new THREE.Mesh(new THREE.PlaneGeometry(3,1),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(shadowCanvas),transparent:true,depthWrite:false}));shadow.position.set(0,-1.25,-1);scene.add(shadow);
 function size(){const r=stage.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();renderOnce()}
 function renderOnce(){renderer.render(scene,camera)}
 function tick(now){frame=0;if(!visible||document.hidden)return;const dt=Math.min((now-(last||now))/1000,.04);last=now;if(!reduced.matches||kick>.01){ball.rotation.y+=dt*(.22+kick);ball.rotation.x+=dt*kick*.3;kick*=Math.exp(-dt*1.8);if(!reduced.matches)ball.position.y=Math.sin(now*.0008)*.055;renderOnce()}if(!reduced.matches||kick>.01)frame=requestAnimationFrame(tick)}
 function start(){if(!frame){last=0;if(!reduced.matches||kick>.01)frame=requestAnimationFrame(tick)}}
 button.addEventListener('click',()=>{kick=7;start()});
 new ResizeObserver(size).observe(stage);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)start();else if(frame){cancelAnimationFrame(frame);frame=0}},{rootMargin:'80px'}).observe(stage);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else if(visible)start()});
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();stage.classList.remove('ready');cancelAnimationFrame(frame)});
 size();stage.classList.add('ready');
}catch(e){
 canvas.hidden=true;button.addEventListener('click',()=>{stage.querySelector('.ball-fallback').animate([{transform:'translate(-50%,-50%) rotate(0deg)'},{transform:'translate(-50%,-50%) rotate(360deg)'}],{duration:900,easing:'ease-out'})});
}
