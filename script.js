// Mobile menu
var t = document.querySelector('.nav-toggle'), m = document.getElementById('menu');
t.addEventListener('click', function () {
  var open = m.classList.toggle('open');
  t.classList.toggle('open', open);
  t.setAttribute('aria-expanded', open);
});
m.addEventListener('click', function (e) {
  if (e.target.closest('a')) { m.classList.remove('open'); t.classList.remove('open'); t.setAttribute('aria-expanded', false); }
});

// Dropdown menus: open on hover/focus on desktop (CSS); the chevron button toggles them on touch and mobile.
var subItems = [].slice.call(document.querySelectorAll('.has-sub'));
function closeSubs(except) {
  subItems.forEach(function (item) {
    if (item === except) return;
    item.classList.remove('open');
    item.querySelector('.sub-toggle').setAttribute('aria-expanded', false);
  });
}
subItems.forEach(function (item) {
  var btn = item.querySelector('.sub-toggle');
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    closeSubs(item);
  });
});
document.addEventListener('click', function (e) { if (!e.target.closest('.has-sub')) closeSubs(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeSubs(); });

// Hero slider (home page). Slide images come from the hero's data-slides attribute; one dot per slide.
var hero = document.querySelector('.hero');
if (hero) {
  var slides = (hero.getAttribute('data-slides') || '').split(',').filter(Boolean);
  var dots = [].slice.call(document.querySelectorAll('.slider-dots button'));
  var current = 0, timer;
  slides.forEach(function (src) { new Image().src = src; });   // preload so slides swap without a flash
  function show(i) {
    current = i % slides.length;
    dots.forEach(function (x, j) { x.classList.toggle('active', j === current); });
    hero.style.backgroundImage = "url('" + slides[current] + "')";
  }
  function autoplay() {
    clearInterval(timer);
    if (slides.length > 1) timer = setInterval(function () { show(current + 1); }, 6000);
  }
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { show(i); autoplay(); });
  });
  if (slides.length) { show(0); autoplay(); }
}

// Gallery lightbox
var lightbox = document.querySelector('.lightbox');
if (lightbox) {
  var items = [].slice.call(document.querySelectorAll('.g-item'));
  var lbImg = lightbox.querySelector('img'), lbIndex = 0, lastFocus;
  function openAt(i) {
    lbIndex = (i + items.length) % items.length;
    lbImg.src = items[lbIndex].getAttribute('href');
    lbImg.alt = items[lbIndex].getAttribute('data-caption') || '';
  }
  items.forEach(function (a, i) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      lastFocus = a;
      openAt(i);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lb-close').focus();
    });
  });
  function closeLb() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  lightbox.querySelector('.lb-close').addEventListener('click', closeLb);
  lightbox.querySelector('.lb-prev').addEventListener('click', function () { openAt(lbIndex - 1); });
  lightbox.querySelector('.lb-next').addEventListener('click', function () { openAt(lbIndex + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openAt(lbIndex - 1);
    if (e.key === 'ArrowRight') openAt(lbIndex + 1);
  });
}

// Contact form. The site is static, so the enquiry opens in the visitor's email app, addressed to data-mailto.
// Swap this for a form service or server endpoint when the site goes live.
var form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements;
    var body = 'Name: ' + f.name.value + '\nEmail: ' + f.email.value + '\nPhone: ' + f.phone.value +
               '\nService: ' + (f.service.value || '-') + '\n\n' + f.message.value;
    var subject = 'Website enquiry' + (f.service.value ? ' - ' + f.service.value : '');
    window.location.href = 'mailto:' + form.getAttribute('data-mailto') +
      '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    form.querySelector('.form-status').textContent = 'Your email app should now open with your message ready to send.';
  });
}
