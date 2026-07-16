export default async function decorate(block) {
  let heroData;
  try {
    const resp = await fetch('/blocks/custom-hero/custom-hero.json');
    if (!resp.ok) throw new Error(`Failed to load custom-hero.json: ${resp.status}`);
    heroData = await resp.json();
  } catch (err) {
    console.error('Hero block: could not load custom-hero.json', err);
    return;
  }

  const image = document.createElement('img');
  image.src = heroData.image;
  image.alt = heroData.title;
  image.className = 'custom-hero-image';

  const icon = document.createElement('span');
  icon.className = 'custom-hero-icon';
  icon.innerHTML = `
    <img src="${heroData.icon}" alt="">
  `;

  block.classList.add('custom-hero');

  block.innerHTML = `
    <div class="custom-hero-bg"></div>

    <div class="custom-hero-layout">
      <div class="custom-hero-text">

        <p class="custom-hero-eyebrow">
          ${heroData.eye}
        </p>

        <div class="custom-hero-headline">
          <h2 class="custom-hero-title">
            ${heroData.title}
          </h2>

          <span class="custom-hero-badge">
            ${heroData.badge}
          </span>
        </div>

        <ul class="custom-hero-meta">
          <li>${heroData.meta[0]}</li>
          <li>${heroData.meta[1]}</li>
          <li>${heroData.meta[2]}</li>
        </ul>

        <p class="custom-hero-description">
          ${heroData.desc}
        </p>

      </div>
    </div>
  `;

  block.querySelector('.custom-hero-bg').append(image);
  block.querySelector('.custom-hero-meta li').prepend(icon);

  // reveal only after content is fully built, prevents a flash of
  // undecorated/empty block while the JSON fetch is in flight
  block.classList.add('hero-decorated');
}