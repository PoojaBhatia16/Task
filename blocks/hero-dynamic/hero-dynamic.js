const COHORT_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <circle cx="8.5" cy="8" r="3.1" />
  <circle cx="16.5" cy="9.2" r="2.4" />
  <path d="M2.6 18.4c0-3 2.6-4.9 5.9-4.9s5.9 1.9 5.9 4.9" />
  <path d="M15.4 13.8c2.9.1 5 1.9 5 4.6" />
</svg>`;

function readCell(cell) {
  if (!cell) return '';
  const link = cell.querySelector('a');
  return (link ? link.getAttribute('href') : cell.textContent).trim();
}

function buildImage(record) {
  const img = document.createElement('img');
  img.src = record.image;
  img.alt = record.imageAlt || '';
  img.loading = 'lazy';
  img.width = 1740;
  img.height = 500;
  return img;
}

function showError(block, message) {
  block.classList.remove('is-loading');
  block.innerHTML = '';
  const p = document.createElement('p');
  p.className = 'hero-dynamic-error';
  p.textContent = message;
  block.append(p);
}

function render(block, record) {
  if (record.image) {
    const bg = document.createElement('div');
    bg.className = 'hero-dynamic-bg';
    bg.append(buildImage(record));
    block.append(bg);
  }

  const layout = document.createElement('div');
  layout.className = 'hero-dynamic-layout';
  block.append(layout);

  const text = document.createElement('div');
  text.className = 'hero-dynamic-text';
  layout.append(text);

  if (record.eyebrow) {
    const p = document.createElement('p');
    p.className = 'hero-dynamic-eyebrow';
    p.textContent = record.eyebrow;
    text.append(p);
  }

  if (record.title || record.badge) {
    const headline = document.createElement('div');
    headline.className = 'hero-dynamic-headline';

    if (record.title) {
      const h1 = document.createElement('h1');
      h1.className = 'hero-dynamic-title';
      h1.textContent = record.title;
      headline.append(h1);
    }
    if (record.badge) {
      const span = document.createElement('span');
      span.className = 'hero-dynamic-badge';
      span.textContent = record.badge;
      headline.append(span);
    }
    text.append(headline);
  }

  const meta = (record.meta || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (meta.length) {
    const ul = document.createElement('ul');
    ul.className = 'hero-dynamic-meta';
    meta.forEach((item, i) => {
      const li = document.createElement('li');
      if (i === 0) li.innerHTML = COHORT_ICON;
      li.append(document.createTextNode(item));
      ul.append(li);
    });
    text.append(ul);
  }

  if (record.description) {
    const p = document.createElement('p');
    p.className = 'hero-dynamic-description';
    p.textContent = record.description;
    text.append(p);
  }
}

export default async function decorate(block) {
  const [sourceCell, keyCell] = [...block.children].map((row) => row.firstElementChild);
  const source = readCell(sourceCell);
  const key = readCell(keyCell);

  if (!source) {
    showError(block, 'Add a JSON source URL to the first row of this block.');
    return;
  }

  block.classList.add('is-loading');
  block.innerHTML = `<div class="hero-dynamic-skeleton" aria-hidden="true">
    <span></span><span></span><span></span><span></span>
  </div>`;

  let rows;
  try {
    const resp = await fetch(source);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    rows = (await resp.json()).data || [];
  } catch (e) {
    showError(block, `Couldn't load course data from ${source} — ${e.message}`);
    return;
  }

  const record = key ? rows.find((row) => row.path === key) : rows[0];
  if (!record) {
    showError(block, key ? `No course matching "${key}" in ${source}.` : `No courses in ${source}.`);
    return;
  }

  block.classList.remove('is-loading');
  block.textContent = '';
  render(block, record);
}