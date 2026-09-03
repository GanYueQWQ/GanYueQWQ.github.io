(function () {
  'use strict';

  function initSeasonalBackground() {
    var host = document.getElementById('nexmoe-background');
    if (!host || document.getElementById('seasonal-background')) return;

    var month = new Date().getMonth() + 1;
    var season = month >= 3 && month <= 5 ? 'spring'
      : month >= 6 && month <= 8 ? 'summer'
        : month >= 9 && month <= 11 ? 'autumn' : 'winter';
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var compact = window.innerWidth < 720;

    var layer = document.createElement('div');
    layer.id = 'seasonal-background';
    layer.dataset.season = season;
    layer.setAttribute('aria-hidden', 'true');

    var glow = document.createElement('div');
    glow.className = 'seasonal-glow';
    layer.appendChild(glow);

    var depths = compact ? [18, 16, 14] : [32, 30, 26];
    var depthLayers = [];

    if (!reducedMotion) {
      depths.forEach(function (count, depthIndex) {
        var depthLayer = document.createElement('div');
        depthLayer.className = 'seasonal-depth seasonal-depth-' + (depthIndex + 1);
        depthLayer.dataset.depth = String(depthIndex + 1);

        for (var index = 0; index < count; index += 1) {
          depthLayer.appendChild(createParticle(season, depthIndex));
        }

        depthLayers.push(depthLayer);
        layer.appendChild(depthLayer);
      });
    }

    host.appendChild(layer);

    if (reducedMotion || !depthLayers.length) return;

    var framePending = false;
    var pointerX = 0;
    var pointerY = 0;

    function applyParallax() {
      framePending = false;
      depthLayers.forEach(function (depthLayer, index) {
        var strength = (index + 1) * 2.7;
        depthLayer.style.transform = 'translate3d(' +
          (pointerX * strength).toFixed(2) + 'px,' +
          (pointerY * strength * 0.75).toFixed(2) + 'px,0)';
      });
    }

    function scheduleParallax() {
      if (framePending) return;
      framePending = true;
      requestAnimationFrame(applyParallax);
    }

    window.addEventListener('pointermove', function (event) {
      if (event.pointerType === 'touch') return;
      pointerX = event.clientX / window.innerWidth * 2 - 1;
      pointerY = event.clientY / window.innerHeight * 2 - 1;
      scheduleParallax();
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', function () {
      pointerX = 0;
      pointerY = 0;
      scheduleParallax();
    });
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function createParticle(season, depthIndex) {
    var particle = document.createElement('span');
    var duration = season === 'summer'
      ? random(7, 13)
      : random(14, 25) - depthIndex * 1.4;
    var sizeBase = season === 'summer' ? random(2, 4.5) : random(3, 8);
    var depthScale = 0.68 + depthIndex * 0.2;
    var alpha = random(0.3, 0.68) + depthIndex * 0.06;

    particle.className = 'seasonal-particle';
    particle.style.setProperty('--particle-x', random(0, 100).toFixed(2) + 'vw');
    particle.style.setProperty('--particle-y', random(0, 100).toFixed(2) + 'vh');
    particle.style.setProperty('--particle-size', (sizeBase * depthScale).toFixed(2) + 'px');
    particle.style.setProperty('--particle-duration', duration.toFixed(2) + 's');
    particle.style.setProperty('--particle-delay', (-random(0, duration)).toFixed(2) + 's');
    particle.style.setProperty('--particle-drift', random(-90, 90).toFixed(1) + 'px');
    particle.style.setProperty('--particle-turn', random(-260, 260).toFixed(1) + 'deg');
    particle.style.setProperty('--particle-alpha', Math.min(alpha, 0.82).toFixed(2));
    return particle;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSeasonalBackground, { once: true });
  } else {
    initSeasonalBackground();
  }
})();
