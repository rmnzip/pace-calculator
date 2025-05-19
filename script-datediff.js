/* ——— Sélecteurs ——— */
const d1Input = document.getElementById('date1');
const d2Input = document.getElementById('date2');
const daysOut = document.getElementById('days-result');
const weeksOut= document.getElementById('weeks-result');
const monthsOut=document.getElementById('months-result');

/* ——— Ellipse coord. (identique Runtime) ——— */
const cx=150, cy=75, rx=120, ry=30;
const dotA=document.getElementById('dot-a');
const dotB=document.getElementById('dot-b');

/* ——— Globals animation ——— */
let theta = 0;            // angle courant
let delta = 0;            // écart angulaire entre les 2 points
let lastTS = null;
const SPEED = 1.5;        // rad/s (vitesse commune)

/* Utilitaires */
function setDot(dot,ang){
  dot.setAttribute('cx', cx + rx * Math.cos(ang));
  dot.setAttribute('cy', cy + ry * Math.sin(ang));
}

/* —— Mise à jour écart (logarithmique) —— */
function updateGap(){
  const d1=new Date(d1Input.value), d2=new Date(d2Input.value);
  if(isNaN(d1)||isNaN(d2)) return;

  const diffDays=Math.round((d2-d1)/86_400_000); // signé
  const absDays=Math.abs(diffDays);

  /* Affichage numérique */
  daysOut.textContent   = diffDays;
  weeksOut.textContent  = (diffDays/7).toFixed(2);
  monthsOut.textContent = (diffDays/30.44).toFixed(2);

  /* Gap logarithmique (0 → π) */
  const maxDays=365;
  const gapNorm = Math.log10(1+absDays)/Math.log10(1+maxDays); // 0..1
  delta = gapNorm * Math.PI * (diffDays>=0 ? 1 : -1);          // sens selon signe
}

/* —— Animation continue —— */
function animate(ts){
  if(!lastTS) lastTS = ts;
  const dt = (ts - lastTS)/1000;
  lastTS = ts;

  theta = (theta + SPEED*dt) % (2*Math.PI);

  setDot(dotA, theta);
  setDot(dotB, theta + delta);

  requestAnimationFrame(animate);
}

/* —— Listeners —— */
[d1Input,d2Input].forEach(el=>el.addEventListener('input', updateGap));

/* —— Init —— */
const todayISO=new Date().toISOString().split('T')[0];
d1Input.value=todayISO; d2Input.value=todayISO;
updateGap();
requestAnimationFrame(animate);
