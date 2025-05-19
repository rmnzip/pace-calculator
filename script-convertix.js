/* ——— Conversion fuseaux horaires avec Luxon ——— */
const { DateTime } = luxon;

/* --- Sélecteurs DOM --- */
const srcInput   = document.getElementById('src-datetime');
const srcSelect  = document.getElementById('src-tz');
const destSelect = document.getElementById('dest-tz');
const outputSpan = document.getElementById('dest-output');

/* --- Liste de fuseaux courants (IANA) --- */
const zones = [
  'Europe/Paris',        'Europe/London',
  'America/New_York',    'America/Los_Angeles',
  'America/Sao_Paulo',   'Africa/Johannesburg',
  'Asia/Tokyo',          'Asia/Shanghai',
  'Asia/Dubai',          'Australia/Sydney',
  'Pacific/Auckland'
];

/* Remplir les deux <select> */
zones.forEach(z => {
  const opt1 = document.createElement('option');
  opt1.value = opt1.textContent = z;
  srcSelect.appendChild(opt1);

  const opt2 = document.createElement('option');
  opt2.value = opt2.textContent = z;
  destSelect.appendChild(opt2);
});

/* Valeurs par défaut */
srcSelect.value  = 'Europe/Paris';
destSelect.value = 'America/New_York';
srcInput.value   = DateTime.now().setZone('Europe/Paris').toISO({ suppressMilliseconds: true }).slice(0,16);

/* --- Fonction de conversion --- */
function convert() {
  const srcZone  = srcSelect.value;
  const destZone = destSelect.value;
  const srcISO   = srcInput.value;

  if (!srcISO) { outputSpan.textContent = '--'; return; }

  const srcDT   = DateTime.fromISO(srcISO, { zone: srcZone });
  if (!srcDT.isValid) { outputSpan.textContent = '--'; return; }

  const destDT  = srcDT.setZone(destZone);
  const offset  = destDT.offset / 60; // minutes → heures

  outputSpan.textContent = destDT.toFormat("yyyy-LL-dd HH:mm") +
    `  (UTC${offset >= 0 ? '+' : ''}${offset})`;
}

/* --- Écouteurs --- */
[srcInput, srcSelect, destSelect].forEach(el => el.addEventListener('input', convert));

/* --- Init --- */
convert();
