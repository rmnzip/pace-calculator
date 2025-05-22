/* -----------------------------------------------------------------------
   Lifomatix – point animé en continu dès le chargement
   -------------------------------------------------------------------- */
(() => {
  /* Sélecteurs DOM ------------------------------------------------------ */
  const birthdateInput = document.getElementById("birthdate");
  const matixerBtn     = document.getElementById("matixer-btn");
  const gridContainer  = document.getElementById("grid-container");
  const orbitDot       = document.getElementById("orbit-dot");

  /* Constantes ---------------------------------------------------------- */
  const SQUARE_COUNT = 500;        // 25 × 20
  const TOTAL_MONTHS = 90 * 12;    // 1 080 mois
  const STEP         = 0.02;       // +2 % du tour par seconde
  const INTERVAL_MS  = 1000;       // cadence

  /* Génération de la grille (une seule fois) ---------------------------- */
  for (let i = 0; i < SQUARE_COUNT; i++) {
    const sq = document.createElement("div");
    sq.className = "square";
    gridContainer.appendChild(sq);
  }
  const squares = Array.from(gridContainer.children);

  /* État animation ------------------------------------------------------ */
  let currentProgress = 0;    // position normalisée 0-1

  /* Utilitaires --------------------------------------------------------- */
  function monthsLived(birth) {
    const today = new Date();
    let months =
      (today.getFullYear() - birth.getFullYear()) * 12 +
      (today.getMonth()    - birth.getMonth());
    if (today.getDate() < birth.getDate()) months--;
    return months;
  }

  function moveOrbitDot(progress01) {
    const angle = progress01 * 2 * Math.PI;   // 0-1 → 0-360 °
    const rx = 120, ry = 30, cx = 150, cy = 75;
    orbitDot.setAttribute("cx", (cx + rx * Math.cos(angle)).toFixed(2));
    orbitDot.setAttribute("cy", (cy + ry * Math.sin(angle)).toFixed(2));
  }

  function fillSquares(livedMonths) {
    const filled = Math.round((livedMonths / TOTAL_MONTHS) * SQUARE_COUNT);
    squares.forEach((sq, i) => sq.classList.toggle("filled", i < filled));
  }

  /* Animation continue -------------------------------------------------- */
  function startTicking() {
    moveOrbitDot(currentProgress);           // place le point au départ
    setInterval(() => {
      currentProgress = (currentProgress + STEP) % 1;
      moveOrbitDot(currentProgress);
    }, INTERVAL_MS);
  }

  /* Callback principal -------------------------------------------------- */
  function updateCalendar() {
    if (!birthdateInput.value) return;
    const birth        = new Date(birthdateInput.value);
    const livedMonths  = monthsLived(birth);
    fillSquares(livedMonths);                // seules les cases changent
  }

  /* Listeners ----------------------------------------------------------- */
  birthdateInput.addEventListener("input", () => {
    matixerBtn.disabled = !birthdateInput.value;
  });
  matixerBtn.addEventListener("click", updateCalendar);

  /* Activation si champ déjà rempli ------------------------------------ */
  if (birthdateInput.value) matixerBtn.disabled = false;

  /* Démarrage immédiat du tic-tac -------------------------------------- */
  startTicking();
})();
