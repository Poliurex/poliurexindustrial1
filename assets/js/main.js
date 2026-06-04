;(function(){
var canvas=document.getElementById('hero-canvas');
if(!canvas||typeof THREE==='undefined')return;
var renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:false,alpha:true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor(0x000000,0);
var scene=new THREE.Scene();
var camera=new THREE.PerspectiveCamera(48,window.innerWidth/window.innerHeight,.1,100);
camera.position.set(0,2,7);camera.lookAt(0,0,0);
var geo=new THREE.PlaneGeometry(22,14,80,50);
var mat=new THREE.MeshBasicMaterial({color:0xFAB95B,wireframe:true,transparent:true,opacity:.04});
var mesh=new THREE.Mesh(geo,mat);mesh.rotation.x=-Math.PI*.22;mesh.position.y=-.5;scene.add(mesh);
var pos=geo.attributes.position,orig=new Float32Array(pos.array),cnt=pos.count;
var clock=new THREE.Clock(),raf,paused=false;
function animate(){raf=requestAnimationFrame(animate);if(paused)return;
var t=clock.getElapsedTime();
for(var i=0;i<cnt;i++){var xi=orig[i*3],yi=orig[i*3+1];
pos.setZ(i,Math.sin(xi*.30+t*.42)*.20+Math.cos(yi*.25+t*.34)*.14+Math.sin((xi+yi)*.18+t*.26)*.09);}
pos.needsUpdate=true;renderer.render(scene,camera);}
function onResize(){var w=window.innerWidth,h=window.innerHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);}
window.addEventListener('resize',onResize,{passive:true});
document.addEventListener('visibilitychange',function(){if(document.hidden){paused=true;cancelAnimationFrame(raf);}else{paused=false;clock.start();animate();}});
onResize();animate();
})();


;(function(){
'use strict';
var cursor=document.getElementById('cursor'),follower=document.getElementById('cursor-follower');
if(cursor&&follower&&window.matchMedia('(hover: hover)').matches){
  var cx=-100,cy=-100,fx=-100,fy=-100;
  document.addEventListener('mousemove',function(e){cx=e.clientX;cy=e.clientY;cursor.style.left=cx+'px';cursor.style.top=cy+'px';});
  (function fl(){fx+=(cx-fx)*.11;fy+=(cy-fy)*.11;follower.style.left=fx+'px';follower.style.top=fy+'px';requestAnimationFrame(fl);})();
  document.addEventListener('mouseleave',function(){cursor.style.opacity='0';follower.style.opacity='0';});
  document.addEventListener('mouseenter',function(){cursor.style.opacity='1';follower.style.opacity='1';});
}
var nav=document.getElementById('nav');
function handleNav(){nav.classList.toggle('is-scrolled',window.scrollY>40);}
window.addEventListener('scroll',handleNav,{passive:true});handleNav();
var hbg=document.getElementById('nav-hamburger'),mob=document.getElementById('nav-mobile');
function closeMenu(){if(!mob)return;mob.classList.remove('is-open');hbg&&hbg.classList.remove('is-open');hbg&&hbg.setAttribute('aria-expanded','false');mob.setAttribute('aria-hidden','true');}
if(hbg&&mob){
  hbg.addEventListener('click',function(){var o=mob.classList.toggle('is-open');hbg.classList.toggle('is-open',o);hbg.setAttribute('aria-expanded',String(o));mob.setAttribute('aria-hidden',String(!o));});
  mob.querySelectorAll('a').forEach(function(a){a.addEventListener('click',closeMenu);});
  document.addEventListener('click',function(e){if(!nav.contains(e.target))closeMenu();});
}
var revs=document.querySelectorAll('.reveal');
if('IntersectionObserver'in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target);}});},{threshold:.10,rootMargin:'0px 0px -40px 0px'});
  revs.forEach(function(el){io.observe(el);});
}else{revs.forEach(function(el){el.classList.add('is-visible');});}
function easeOut(t){return 1-Math.pow(1-t,3);}
function animCounter(el){var tgt=parseInt(el.getAttribute('data-count'),10);if(isNaN(tgt)||tgt===0)return;var dur=1600,s=performance.now();(function tick(n){var p=Math.min((n-s)/dur,1);el.textContent=Math.round(easeOut(p)*tgt);if(p<1)requestAnimationFrame(tick);else el.textContent=tgt;})(s);}
var ctrs=document.querySelectorAll('.stat__num[data-count]');
if('IntersectionObserver'in window&&ctrs.length){
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){animCounter(e.target);cio.unobserve(e.target);}});},{threshold:.6});
  ctrs.forEach(function(el){cio.observe(el);});
}
var form=document.getElementById('hero-form'),success=document.getElementById('form-success');
if(form&&success){
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var hon=form.querySelector('[name="_honey"]');if(hon&&hon.value)return;
    var ok=true;
    form.querySelectorAll('[required]').forEach(function(f){f.classList.remove('error');if(!f.value.trim()){f.classList.add('error');ok=false;}});
    if(!ok)return;
    var v=function(id){var el=document.getElementById(id);return el?el.value.trim():'';};
    var msg=['📋 *Solicitud de diagnóstico técnico — POLIUREX*','','👤 *Nombre:* '+(v('nombre')||'—'),'🏢 *Empresa:* '+(v('empresa')||'—'),'💼 *Cargo:* '+(v('cargo')||'—'),'📞 *Teléfono:* '+(v('telefono')||'—'),'🏗️ *Superficie:* '+(v('superficie')||'—')];
    var m=v('metros');if(m)msg.push('📐 *M²:* '+m);
    form.style.opacity='0';form.style.transition='opacity .3s';
    setTimeout(function(){form.style.display='none';success.classList.add('is-active');setTimeout(function(){window.open('https://wa.me/573115572571?text='+encodeURIComponent(msg.join('\n')),'_blank','noopener,noreferrer');},400);},300);
  });
  form.querySelectorAll('.form__input,.form__select').forEach(function(el){el.addEventListener('input',function(){this.classList.remove('error');});});
}
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var t=document.querySelector(this.getAttribute('href'));if(!t)return;e.preventDefault();window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-90,behavior:'smooth'});});});
var ss=document.createElement('style');
ss.textContent='@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-5px)}40%{transform:translateX(5px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}';
document.head.appendChild(ss);
})();