/* ——— Pips sur la face frontale ——— */
const FACE_MAP = {
  1: ["f7"],
  2: ["f1","f6"],
  3: ["f1","f7","f6"],
  4: ["f1","f3","f5","f6"],
  5: ["f1","f3","f7","f5","f6"],
  6: ["f1","f3","f2","f4","f5","f6"]
};

const svg   = document.getElementById('dice-svg');
const pips  = [...svg.querySelectorAll('circle')];
const btn   = document.getElementById('roll-btn');

function showFace(n){
  pips.forEach(p=>p.style.visibility="hidden");
  FACE_MAP[n].forEach(id=>document.getElementById(id).style.visibility="visible");
}

function roll(){
  const n = Math.floor(Math.random()*6)+1;
  svg.style.transition='transform .4s ease-out';
  svg.style.transform ='rotateX(360deg)';
  setTimeout(()=>{ svg.style.transition='none'; svg.style.transform='none'; showFace(n); },400);
}

btn.addEventListener('click',roll);
document.addEventListener('keydown',e=>{ if(e.key==='r') roll(); });

showFace(1);     // face initiale
