(function () {
  'use strict';
  var d = document, root = d.documentElement, body = d.body;
  body.classList.remove('no-js'); root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s) }, $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)) };

  // theme
  var tb = $('#themeBtn');
  if (tb) tb.addEventListener('click', function () {
    var n = root.dataset.theme === 'dark' ? 'light' : 'dark'; root.dataset.theme = n;
    try { localStorage.setItem('theme', n) } catch (e) { }
  });

  // mobile menu
  var mb = $('#menuBtn'), links = $('#links');
  function closeMenu() { if (!links) return; links.classList.remove('open'); if (mb) { mb.setAttribute('aria-expanded', 'false'); mb.textContent = '☰' } }
  if (mb && links) {
    mb.addEventListener('click', function () { var o = links.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? '✕' : '☰' });
    $$('a', links).forEach(function (a) { a.addEventListener('click', closeMenu) });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu() });
  }

  // scroll reveal
  var rv = $$('.rv');
  function show(el) { el.classList.add('in') }
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { show(e.target); io.unobserve(e.target) } }) }, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    rv.forEach(function (el) { io.observe(el) });
  } else rv.forEach(show);
  // safety: never leave content hidden
  setTimeout(function () { rv.forEach(show) }, 4000);

  // steps progress line
  var steps = $('#steps');
  if (steps) {
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { steps.style.setProperty('--p', 1); o.disconnect() } }, { threshold: .3 }).observe(steps);
    } else steps.style.setProperty('--p', 1);
  }

  // typing text
  var ty = $('#typed');
  if (ty) {
    var w = ['Car batteries', 'Bike batteries', 'Inverter batteries', 'Commercial vehicle batteries'], wi = 0, ci = 0, del = false;
    if (reduce) { ty.textContent = w.join(' · ') }
    else (function tick() {
      var s = w[wi]; ci += del ? -1 : 1; ty.textContent = s.slice(0, ci);
      var t = del ? 35 : 70;
      if (!del && ci === s.length) { del = true; t = 1400 }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % w.length; t = 300 }
      setTimeout(tick, t);
    })();
  }

  // mouse parallax
  if (!reduce) {
    var orbs = $$('.orb'), stage = $('#stage'), simg = stage ? $('img', stage) : null;
    d.addEventListener('mousemove', function (e) {
      var x = e.clientX / window.innerWidth - .5, y = e.clientY / window.innerHeight - .5;
      orbs.forEach(function (o) { var m = +o.dataset.m || 20; o.style.transform = 'translate(' + (x * m * 3) + 'px,' + (y * m * 3) + 'px)' });
      if (simg) simg.style.transform = 'rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg)';
    });
  }

  // battery selector
  var info = {
    'Car': ['Car battery', 'Tell us your car make, model and your current battery details. We will help you identify a suitable Exide or Amaron option.'],
    'Bike': ['Bike battery', 'Share your bike or scooter model and current battery details, and we will help you find a suitable option.'],
    'Inverter': ['Inverter battery', 'Tell us about your inverter setup and current battery. We will help you look at suitable Exide or Amaron options.'],
    'Commercial Vehicle': ['Commercial vehicle battery', 'Tell us your vehicle type and current battery details, and we will help you find a suitable option.']
  };
  var res = $('#res');
  function pick(k) {
    var i = info[k]; if (!i || !res) return;
    $$('.sel').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.k === k ? 'true' : 'false') });
    res.innerHTML = '';
    var h = d.createElement('h3'); h.textContent = i[0];
    var p = d.createElement('p'); p.textContent = i[1];
    var row = d.createElement('div'); row.className = 'row';
    var msg = encodeURIComponent('Hello Suraj Auto Sales, I need a battery for: ' + k + '.');
    row.innerHTML = '<a class="btn b1" href="tel:9357118980">Call 9357118980</a><a class="btn b2" target="_blank" rel="noopener" href="https://wa.me/919357118980?text=' + msg + '">WhatsApp us</a>';
    res.appendChild(h); res.appendChild(p); res.appendChild(row);
  }
  $$('.sel').forEach(function (b) { b.addEventListener('click', function () { pick(b.dataset.k) }) });
  $$('[data-pick]').forEach(function (a) { a.addEventListener('click', function () { pick(a.dataset.pick) }) });

  // FAQ
  $$('.fq').forEach(function (q) {
    var b = $('button', q), a = $('.fa', q);
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      $$('.fq').forEach(function (o) { $('button', o).setAttribute('aria-expanded', 'false'); $('.fa', o).style.maxHeight = null });
      if (!open) { b.setAttribute('aria-expanded', 'true'); a.style.maxHeight = a.scrollHeight + 'px' }
    });
  });

  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();