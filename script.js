// -------- Sélection des éléments --------
const distanceButtons = document.querySelectorAll('.distance-button');
const paceSlider      = document.getElementById('pace-slider');
const runningPaceSpan = document.getElementById('running-pace');
const speedSpan       = document.getElementById('speed-kmh');
const finishTimeSpan  = document.getElementById('finish-time');
const saveButton      = document.getElementById('save-goal');

// Orbit animation elements
const orbitDot   = document.getElementById('orbit-dot');
const ellipseCX  = 150, ellipseCY = 75, rx = 120, ry = 30;   // same as SVG

// -------- Constantes slider logarithmique --------
const MIN_PACE = 3, MAX_PACE = 9;
const LOG_K    = Math.log(MAX_PACE / MIN_PACE) / 100;



// -------- Variables d’état --------
let currentDistance = 5;  // km
let currentPace;
let currentSpeed;         // km/h
let theta = 0;            // angle pour l’orbite
let lastTime = null;      // timestamp animation

// -------- Fonctions utilitaires --------
const sliderToPace = v => MIN_PACE * Math.exp(LOG_K * v);
const paceToSlider = p => Math.log(p / MIN_PACE) / LOG_K;
const formatPace   = p => {
    let m = Math.floor(p), s = Math.round((p - m) * 60);
    if (s === 60) { s = 0; m += 1; }
    return `${m}:${s.toString().padStart(2, '0')}`;
};
const formatTime = (h, m, s) =>
    `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

// -------- Affichage --------
function updateDisplays() {
    runningPaceSpan.textContent = `${formatPace(currentPace)} min/km`;
    currentSpeed = 60 / currentPace;
    speedSpan.textContent = `${currentSpeed.toFixed(1)} km/h`;

    const totalMin = currentDistance * currentPace;
    const h = Math.floor(totalMin / 60);
    const m = Math.floor(totalMin % 60);
    const s = Math.floor((totalMin % 1) * 60);
    finishTimeSpan.textContent = formatTime(h, m, s);
}

// -------- Activation visuelle bouton --------
function setActiveDistanceButton() {
    distanceButtons.forEach(btn =>
        btn.classList.toggle('active', parseFloat(btn.dataset.distance) === currentDistance)
    );
}

// -------- Enregistrement / chargement localStorage --------
function loadSavedGoal() {
    const saved = JSON.parse(localStorage.getItem('runningGoal') || 'null');
    if (saved && saved.pace && saved.distance) {
        currentDistance = parseFloat(saved.distance);
        currentPace     = Math.min(MAX_PACE, Math.max(MIN_PACE, parseFloat(saved.pace)));
        paceSlider.value = Math.round(paceToSlider(currentPace));
    } else {
        currentPace = sliderToPace(parseInt(paceSlider.value, 10));
    }
    setActiveDistanceButton();
    updateDisplays();
}


saveButton.addEventListener('click', () => {
    localStorage.setItem('runningGoal', JSON.stringify({
        distance: currentDistance,
        pace: currentPace,
        finish: finishTimeSpan.textContent,
        date: new Date().toISOString()
    }));
    saveButton.textContent = 'Objectif enregistré !';
    setTimeout(() => saveButton.textContent = 'Enregistrer mon objectif', 2000);
});

// -------- Listeners UI --------
distanceButtons.forEach(btn =>
    btn.addEventListener('click', () => {
        currentDistance = parseFloat(btn.dataset.distance);
        setActiveDistanceButton();
        updateDisplays();
    })
);

paceSlider.addEventListener('input', () => {
    currentPace = sliderToPace(parseInt(paceSlider.value, 10));
    updateDisplays();
});

// -------- Animation orbitale --------
function animateOrbit(ts) {
    if (!lastTime) lastTime = ts;
    const dt = (ts - lastTime) / 1000;                  // secondes
    lastTime = ts;

    // Vitesse angulaire proportionnelle : ~ 0.8 rad/s à 6 km/h → 2.4 rad/s à 18 km/h
    const omega = (currentSpeed / 7.5) * 1;             // facteur empirique
    theta = (theta + omega * dt) % (2 * Math.PI);

    // Position point
    const x = ellipseCX + rx * Math.cos(theta);
    const y = ellipseCY + ry * Math.sin(theta);
    orbitDot.setAttribute('cx', x);
    orbitDot.setAttribute('cy', y);

    requestAnimationFrame(animateOrbit);
}

// -------- Init --------
loadSavedGoal();
requestAnimationFrame(animateOrbit);
