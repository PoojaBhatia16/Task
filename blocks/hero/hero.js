function HeroHelper({eye,title,badge,meta,desc,image,}) {
  const fr = document.createDocumentFragment();
  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  bg.append(image);
  fr.append(bg);

  const lyt = document.createElement('div');
  lyt.className = 'hero-layout';

  const text = document.createElement('div');
  text.className = 'hero-text';

  text.append(eye);

  const headline = document.createElement('div');
  headline.className = 'hero-headline';
  headline.append(title, badge);

  text.append(headline);
  text.append(meta, desc);

  lyt.append(text);
  fr.append(lyt);

  return fr;
}

export default function decorate(block) {
  const [eye, title, badge, meta, description, image] = block.children;

  eye.classList.add('hero-eyebrow');
  title.classList.add('hero-title');
  badge.classList.add('hero-badge');
  meta.classList.add('hero-meta');
  description.classList.add('hero-description');

  block.replaceChildren(
    HeroHelper({
      eye,
      title,
      badge,
      meta,
      desc: description,
      image: image.querySelector('picture'),
    }),
  );
}