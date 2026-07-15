import { renderHero, readMeta } from '../hero/hero.js';

const cellText = (cell) => (cell ? cell.textContent.trim() : '');


function readSource(cell) {
  if (!cell) return '';
  const link = cell.querySelector('a');
  return (link ? link.getAttribute('href') : cellText(cell)) || '';
}


export function pickRecord(rows, key) {
  if (!Array.isArray(rows) || !rows.length) return null;
  if (!key) return rows[0];
  return rows.find((row) => [row.path, row.id, row.key]
    .filter(Boolean)
    .some((v) => String(v).trim() === key)) || null;
}

function buildImage(record) {
  if (!record.image) return null;
  const img = document.createElement('img');
  img.src = record.image;
  img.alt = record.imageAlt || '';
  img.loading = 'lazy';
  img.width = 1740;
  img.height = 500;
  return img;
}

function showSkeleton(block) {
  block.classList.add('is-loading');
  block.innerHTML = `<div class="hero-skeleton" aria-hidden="true">
    <span></span><span></span><span></span><span></span>
  </div>`;
}

function showError(block, message) {
  block.classList.remove('is-loading');
  block.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'hero-error';
  p.textContent = message;
  block.append(p);
}

export default async function decorate(block) {
  block.classList.add('hero');

  const [sourceCell, recordCell] = [...block.children].map((r) => r.firstElementChild);
  const source = readSource(sourceCell);
  const key = cellText(recordCell);

  if (!source) {
    showError(block, 'Add a JSON source URL to the first row of this block.');
    return;
  }

  showSkeleton(block);

  let record;
  try {
    const resp = await fetch(source);
    if (!resp.ok) throw new Error(`${resp.status}`);
    const json = await resp.json();
    record = pickRecord(json.data || json, key);
  } catch (e) {
    showError(block, `Couldn't load course data from ${source}.`);
    return;
  }

  if (!record) {
    showError(block, key
      ? `No course matching "${key}" in ${source}.`
      : `No courses found in ${source}.`);
    return;
  }

  const hero = renderHero({
    eyebrow: record.eyebrow,
    title: record.title,
    badge: record.badge,
    meta: readMeta(record.meta),
    description: record.description,
    media: buildImage(record),
  });

  block.classList.remove('is-loading');
  block.textContent = '';
  block.append(hero);
}