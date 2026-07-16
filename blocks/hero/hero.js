const COHORT_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
  <circle cx="8.5" cy="8" r="3.1" />
  <circle cx="16.5" cy="9.2" r="2.4" />
  <path d="M2.6 18.4c0-3 2.6-4.9 5.9-4.9s5.9 1.9 5.9 4.9" />
  <path d="M15.4 13.8c2.9.1 5 1.9 5 4.6" />
</svg>`;

const cellText = (cell) => (cell ? cell.textContent.trim() : '');

function readMeta(cell) {
  if (!cell) return [];
  
  const items = [...cell.querySelectorAll('li')].map((li) => li.textContent.trim());
  if (items.length) return items;
  return cellText(cell).split(',').map((s) => s.trim()).filter(Boolean);
}

function primeLcp(picture) {
  if (!picture) return;
  const img = picture.querySelector('img') || picture;
  img.setAttribute('loading', 'eager');
  img.setAttribute('fetchpriority', 'high');
}

function render(block, data) {
  if (data.media) {
    const bg = document.createElement('div');
    bg.className = 'hero-bg';
    bg.append(data.media);
    block.append(bg);
  }

  const layout = document.createElement('div');
  layout.className = 'hero-layout';
  block.append(layout);

  const text = document.createElement('div');
  text.className = 'hero-text';
  layout.append(text);

  if (data.eyebrow) {
    const p = document.createElement('p');
    p.className = 'hero-eyebrow';
    p.textContent = data.eyebrow;
    text.append(p);
  }

  if (data.title || data.badge) {
    const headline = document.createElement('div');
    headline.className = 'hero-headline';

    if (data.title) {
      const h1 = document.createElement('h1');
      h1.className = 'hero-title';
      h1.textContent = data.title;
      headline.append(h1);
    }
    if (data.badge) {
      const span = document.createElement('span');
      span.className = 'hero-badge';
      span.textContent = data.badge;
      headline.append(span);
    }
    text.append(headline);
  }

  if (data.meta.length) {
    const ul = document.createElement('ul');
    ul.className = 'hero-meta';
    data.meta.forEach((item, i) => {
      const li = document.createElement('li');
      if (i === 0) li.innerHTML = COHORT_ICON;
      li.append(document.createTextNode(item));
      ul.append(li);
    });
    text.append(ul);
  }

  if (data.description) {
    const p = document.createElement('p');
    p.className = 'hero-description';
    p.textContent = data.description;
    text.append(p);
  }
}

export default function decorate(block) {
  const picture = block.querySelector('picture, img');
  primeLcp(picture);

  if (block.children.length === 1 && block.querySelector('h1')) {
    const title = block.querySelector('h1').textContent.trim();
    block.textContent = '';
    render(block, { title, meta: [], media: picture });
    return;
  }

  const [eyebrow, title, badge, meta, description] = [...block.children]
    .map((row) => row.firstElementChild);

  const data = {
    eyebrow: cellText(eyebrow),
    title: cellText(title),
    badge: cellText(badge),
    meta: readMeta(meta),
    description: cellText(description),
    media: picture,
  };

  block.textContent = '';
  render(block, data);
}