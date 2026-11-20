/* =====================================================================
   Pétalos y hojitas que flotan sobre la página (muy discretos).
   - Un solo <canvas> fijo, sin clics, que no tapa botones ni texto.
   - Pocas piezas, pequeñas y suaves; en celular, menos todavía.
   - Se apaga con «reducir movimiento» y se detiene si cambias de pestaña.
   Para quitarlo del todo: borra la línea <script src="js/petalos.js"> de las páginas
   o pon ACTIVO en false.
   ===================================================================== */

(function () {
  'use strict';

  var ACTIVO = true;
  var CANTIDAD_ESCRITORIO = 16;   // piezas a la vez en pantallas grandes
  var CANTIDAD_CELULAR = 8;       // piezas a la vez en celular
  var OPACIDAD_MAX = 0.9;         // 1 = sin transparencia

  /* Colores de la paleta: marfil, arena, taupe rosado y oliva claro (hojitas) */
  var PETALOS = [
    { a: '#F3EADF', b: '#D6C3B1' },
    { a: '#EBDBCD', b: '#C8AF9D' },
    { a: '#DFC9BA', b: '#B8A090' },
    { a: '#D4BBAB', b: '#A98F7E' }
  ];
  var HOJAS = [
    { a: '#ABA891', b: '#807C66' },
    { a: '#B6B39D', b: '#8C8870' }
  ];

  if (!ACTIVO) return;
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  if (mq && mq.matches) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'petalos';
  canvas.setAttribute('aria-hidden', 'true');
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  document.body.appendChild(canvas);

  var W = 0, H = 0, dpr = 1, piezas = [], previo = 0, corriendo = false, scrollY0 = window.scrollY || 0, impulso = 0;

  function cantidad() { return window.innerWidth < 700 ? CANTIDAD_CELULAR : CANTIDAD_ESCRITORIO; }
  function azar(a, b) { return a + Math.random() * (b - a); }

  function medir() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = cantidad();
    while (piezas.length < n) piezas.push(nueva(true));
    if (piezas.length > n) piezas.length = n;
  }

  /* profundidad: 0 = lejos (pequeño, lento, más transparente), 1 = cerca (más grande y rápido) */
  function nueva(inicio) {
    var z = Math.random();
    var esHoja = Math.random() < 0.22;
    var paleta = esHoja ? HOJAS[(Math.random() * HOJAS.length) | 0] : PETALOS[(Math.random() * PETALOS.length) | 0];
    var tam = esHoja ? azar(11, 17) : azar(10, 16);
    return {
      hoja: esHoja, c: paleta,
      z: z,
      s: tam * (0.7 + z * 0.65),                 // tamaño en px
      x: azar(-0.05, 1.05) * W,
      y: inicio ? azar(-0.1, 1) * H : azar(-0.15, -0.02) * H,
      vy: azar(22, 38) * (0.55 + z * 0.75),      // caída lenta, px por segundo
      viento: azar(-6, 10),                      // deriva lateral suave
      amp: azar(14, 34) * (0.6 + z * 0.6),       // balanceo
      freq: azar(0.35, 0.8), fase: azar(0, 6.28),
      rot: azar(0, 6.28), vrot: azar(-0.9, 0.9) * 0.6,
      tilt: azar(0, 6.28), vtilt: azar(0.8, 1.7),
      alfa: azar(0.7, 1) * OPACIDAD_MAX * (0.65 + z * 0.35)
    };
  }

  function formaPetalo(s) {
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.bezierCurveTo(s * 0.95, -s * 0.55, s * 0.8, s * 0.55, 0, s);
    ctx.bezierCurveTo(-s * 0.8, s * 0.55, -s * 0.95, -s * 0.55, 0, -s);
    ctx.closePath();
  }
  function formaHoja(s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.25);
    ctx.bezierCurveTo(s * 0.7, -s * 0.5, s * 0.6, s * 0.6, 0, s * 1.25);
    ctx.bezierCurveTo(-s * 0.6, s * 0.6, -s * 0.7, -s * 0.5, 0, -s * 1.25);
    ctx.closePath();
  }

  function dibujar(p) {
    var giro = Math.cos(p.tilt);                 // simula que gira en 3D (se «voltea»)
    var ancho = 0.28 + Math.abs(giro) * 0.72;
    var borde = p.y < 60 ? Math.max(0, p.y / 60) : (p.y > H - 80 ? Math.max(0, (H - p.y) / 80) : 1);
    var a = p.alfa * borde * (0.78 + 0.22 * Math.abs(giro));
    if (a <= 0.01) return;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(ancho, 1);
    ctx.globalAlpha = a;

    var s = p.s;
    var g = ctx.createLinearGradient(0, -s, 0, s);
    g.addColorStop(0, giro > 0 ? p.c.a : p.c.b);
    g.addColorStop(1, giro > 0 ? p.c.b : p.c.a);
    ctx.fillStyle = g;
    ctx.shadowColor = 'rgba(94, 90, 80, 0.22)';  // sombra suave: se ven también sobre fondo blanco
    ctx.shadowBlur = 3 + p.z * 3;
    ctx.shadowOffsetY = 1 + p.z * 1.5;

    if (p.hoja) {
      formaHoja(s); ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(94, 90, 70, 0.35)'; ctx.lineWidth = 0.7;
      ctx.beginPath(); ctx.moveTo(0, -s * 1.1); ctx.lineTo(0, s * 1.1); ctx.stroke();
    } else {
      formaPetalo(s); ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(117, 100, 85, 0.28)'; ctx.lineWidth = 0.7;
      ctx.stroke();
      // nervadura muy suave
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(0, -s * 0.7); ctx.lineTo(0, s * 0.55); ctx.stroke();
    }
    ctx.restore();
  }

  function cuadro(t) {
    if (!corriendo) return;
    var dt = Math.min((t - previo) / 1000, 0.05);   // tope para que no «salte» al volver de otra pestaña
    previo = t;

    // el scroll mueve un poco las piezas (más las cercanas): da profundidad
    var y = window.scrollY || 0;
    impulso += (y - scrollY0) * -0.35;
    scrollY0 = y;
    var empuje = impulso * Math.min(dt * 6, 1);
    impulso -= empuje;

    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < piezas.length; i++) {
      var p = piezas[i];
      p.fase += p.freq * dt;
      p.rot += p.vrot * dt;
      p.tilt += p.vtilt * dt;
      p.x += (p.viento + Math.cos(p.fase) * p.amp * p.freq) * dt;
      p.y += p.vy * dt + empuje * (0.4 + p.z);
      if (p.y > H + 30 || p.x < -40 || p.x > W + 40 || p.y < -H * 0.5) {
        piezas[i] = nueva(false);
        continue;
      }
      dibujar(p);
    }
    requestAnimationFrame(cuadro);
  }

  function iniciar() {
    if (corriendo) return;
    corriendo = true;
    previo = performance.now();
    requestAnimationFrame(cuadro);
  }
  function detener() { corriendo = false; ctx.clearRect(0, 0, W, H); }

  medir();
  window.addEventListener('resize', medir);
  document.addEventListener('visibilitychange', function () { if (document.hidden) { corriendo = false; } else { iniciar(); } });
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if (mq.matches) detener(); else iniciar(); });
  iniciar();
})();
