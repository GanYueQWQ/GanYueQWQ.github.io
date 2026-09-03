(function () {
  'use strict';

  function initSeasonalBackground() {

  var host = document.getElementById('nexmoe-background');
  if (!host) return;

  var month = new Date().getMonth() + 1;
  var season = month >= 3 && month <= 5 ? 'spring'
    : month >= 6 && month <= 8 ? 'summer'
      : month >= 9 && month <= 11 ? 'autumn' : 'winter';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var layer = document.createElement('div');
  layer.id = 'seasonal-background';
  layer.dataset.season = season;
  layer.setAttribute('aria-hidden', 'true');
  var glow = document.createElement('div');
  glow.className = 'seasonal-glow';
  layer.appendChild(glow);
  host.appendChild(layer);

  if (reducedMotion) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'seasonal-particles';
  layer.appendChild(canvas);
  var context = canvas.getContext('2d');
  var particles = [];
  var width = 0;
  var height = 0;
  var ratio = 1;
  var targetX = 0;
  var targetY = 0;
  var depthX = 0;
  var depthY = 0;
  var animationId = 0;
  var lastTime = performance.now();

  var palettes = {
    spring: ['255,170,199', '255,205,218', '245,151,183'],
    summer: ['255,226,128', '190,255,176', '255,244,190'],
    autumn: ['239,144,62', '208,92,45', '247,190,88'],
    winter: ['235,247,255', '194,225,255', '255,255,255']
  };

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeParticle(fromTop) {
    var isSummer = season === 'summer';
    return {
      x: random(0, width),
      y: fromTop ? random(-height * 0.18, 0) : random(0, height),
      size: isSummer ? random(1.2, 3.1) : random(1.6, 5.2),
      speed: isSummer ? random(2, 8) : random(10, season === 'winter' ? 32 : 22),
      drift: random(-12, 12),
      phase: random(0, Math.PI * 2),
      spin: random(-1.2, 1.2),
      color: palettes[season][Math.floor(random(0, palettes[season].length))],
      alpha: random(0.24, 0.62)
    };
  }

  function resetParticles() {
    var compact = window.innerWidth < 720;
    var count = compact ? 44 : 96;
    if (season === 'summer') count = compact ? 32 : 64;
    particles = Array.from({ length: count }, function () { return makeParticle(false); });
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    resetParticles();
  }

  function drawSoftParticle(particle, x, y, pulse) {
    context.beginPath();
    if (season === 'spring') {
      context.ellipse(x, y, particle.size * 1.5, particle.size * 0.72, particle.phase, 0, Math.PI * 2);
    } else if (season === 'autumn') {
      context.ellipse(x, y, particle.size * 1.3, particle.size * 0.58, particle.phase, 0, Math.PI * 2);
    } else {
      context.arc(x, y, particle.size * pulse, 0, Math.PI * 2);
    }
    context.fillStyle = 'rgba(' + particle.color + ',' + particle.alpha * pulse + ')';
    context.fill();
  }

  function drawFirefly(particle, x, y, pulse) {
    var radius = particle.size * 6 * pulse;
    var gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, 'rgba(' + particle.color + ',' + particle.alpha + ')');
    gradient.addColorStop(0.24, 'rgba(' + particle.color + ',' + particle.alpha * 0.42 + ')');
    gradient.addColorStop(1, 'rgba(' + particle.color + ',0)');
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function animate(time) {
    var delta = Math.min((time - lastTime) / 1000, 0.034);
    lastTime = time;
    context.clearRect(0, 0, width, height);
    depthX += (targetX - depthX) * 0.055;
    depthY += (targetY - depthY) * 0.055;
    if (Math.abs(targetX - depthX) > 0.001 || Math.abs(targetY - depthY) > 0.001) {
      document.documentElement.style.setProperty('--season-bg-x', (depthX * -11).toFixed(2) + 'px');
      document.documentElement.style.setProperty('--season-bg-y', (depthY * -8).toFixed(2) + 'px');
    }

    particles.forEach(function (particle) {
      particle.phase += particle.spin * delta;
      var pulse = season === 'summer' ? 0.88 + Math.sin(time * 0.0009 + particle.phase) * 0.12 : 1;
      var x = particle.x + Math.sin(particle.phase * 1.7) * particle.drift + depthX * 5;
      var y = particle.y + depthY * 4;

      if (season === 'summer') {
        particle.x += Math.sin(particle.phase) * particle.speed * delta;
        particle.y += Math.cos(particle.phase * 0.7) * particle.speed * delta;
        drawFirefly(particle, x, y, pulse);
        if (particle.x < -30) particle.x = width + 30;
        if (particle.x > width + 30) particle.x = -30;
        if (particle.y < -30) particle.y = height + 30;
        if (particle.y > height + 30) particle.y = -30;
      } else {
        particle.y += particle.speed * delta;
        particle.x += particle.drift * delta * 0.16;
        drawSoftParticle(particle, x, y, pulse);
        if (particle.y > height + 16 || particle.x < -24 || particle.x > width + 24) {
          Object.assign(particle, makeParticle(true));
        }
      }
    });

    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener('pointermove', function (event) {
    if (event.pointerType === 'touch') return;
    targetX = event.clientX / window.innerWidth * 2 - 1;
    targetY = event.clientY / window.innerHeight * 2 - 1;
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', function () {
    targetX = 0;
    targetY = 0;
  });

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      lastTime = performance.now();
      animationId = requestAnimationFrame(animate);
    }
  });

  resize();
  animationId = requestAnimationFrame(animate);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSeasonalBackground, { once: true });
  } else {
    initSeasonalBackground();
  }
})();
