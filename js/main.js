/* =====================================================================
   Mariana Rivas · Fotografía de bodas
   1) CONFIG: marca y datos de contacto (todo lo que hay que reemplazar está aquí).
      La cabecera y el pie de las 6 páginas se arman desde este bloque.
   2) Funciones: cabecera y pie, fotos, galería, boda, vista ampliada y formulario.
   Los datos de las bodas están en js/bodas.js.
   ===================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1) CONFIG — edita aquí. Lo que sigue entre corchetes [ ] es un dato
        que falta: la página lo muestra tal cual para que lo encuentres.
     ------------------------------------------------------------------ */
  var CONFIG = {
    marca: 'MARIANA RIVAS',                       // nombre en el logo
    submarca: 'FOTOGRAFÍA DE BODAS',         // línea pequeña bajo el nombre
    nombreCorto: 'Mariana Rivas',                 // para el © y los títulos
    logo: '',                                // ruta de la imagen del logo, p. ej. 'img/logo.svg'. Vacío = se usa el nombre en texto
    aviso: 'Agenda abierta para bodas 2027 · Escríbeme y reservamos tu fecha',   // barra de arriba; déjala vacía para quitarla
    fraseMarca: '[Una frase corta sobre tu forma de trabajar y el tipo de bodas que fotografías.]',

    nombre: 'Mariana',                        // nombre de la fotógrafa (Sobre mí)
    ciudad: 'Lima',                          // ciudad (Sobre mí)
    correo: 'contacto@tunegocio.com',
    whatsapp: '+51 987 654 321',
    ubicacionPie: 'Lima · Viajo a donde me lleve tu boda',
    ubicacionContacto: 'Lima, Perú',
    horarioRespuesta: 'Lunes a sábado, de 9:00 a. m. a 7:00 p. m.',
    tiempoRespuesta: '24 horas',
    plazoEntrega: '4 semanas',

    redes: { instagram: '', facebook: '', pinterest: '' },   // direcciones completas; mientras estén vacías, al pulsar sale el aviso de demo
    anio: '2026',
    legal: 'Términos · Privacidad',
    firma: true,                             // «Desarrollado por moravistudio.com» en el pie; false para quitarla

    formulario: {
      modo: 'demo',                          // 'demo' = solo simula el envío. Cambia a 'real' cuando conectes un servicio
      endpoint: ''                           // p. ej. la URL de Formspree: 'https://formspree.io/f/XXXXXXXX'
    }
  };

  var PAGINAS = [
    { id: 'sobre-mi', texto: 'Sobre mí', url: 'sobre-mi.html' },
    { id: 'paquetes', texto: 'Paquetes', url: 'paquetes.html' },
    { id: 'galeria', texto: 'Galería', url: 'galeria.html' },
    { id: 'contacto', texto: 'Contacto', url: 'contacto.html' }
  ];
  var REDES = [
    { id: 'instagram', texto: 'Instagram' },
    { id: 'facebook', texto: 'Facebook' },
    { id: 'pinterest', texto: 'Pinterest' }
  ];

  var pagina = document.body.getAttribute('data-page') || '';

  /* ---------- utilidades ---------- */
  function escapar(t) {
    return String(t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function enlaceRed(r, clase) {
    var url = CONFIG.redes[r.id];
    var ext = url ? ' target="_blank" rel="noopener noreferrer"' : '';
    return '<a class="' + clase + '" href="' + escapar(url || '#') + '"' + ext + '>' + r.texto + '</a>';
  }

  /* ---------- cabecera y pie (iguales en las 6 páginas) ---------- */
  function construirCabecera() {
    var cont = document.getElementById('cabecera');
    if (!cont) return;
    var activa = pagina === 'boda' ? 'galeria' : pagina;
    var logo = CONFIG.logo
      ? '<img src="' + escapar(CONFIG.logo) + '" alt="' + escapar(CONFIG.marca) + '">'
      : '<span class="logo__nombre">' + escapar(CONFIG.marca) + '</span><span class="logo__sub">' + escapar(CONFIG.submarca) + '</span>';
    var menu = PAGINAS.map(function (p) {
      var cur = p.id === activa ? ' aria-current="page"' : '';
      return '<li><a class="navlink" href="' + p.url + '"' + cur + '>' + p.texto + '</a></li>';
    }).join('');
    var redes = REDES.slice(0, 2).map(function (r) { return '<li>' + enlaceRed(r, 'navlink') + '</li>'; }).join('');

    cont.innerHTML =
      (CONFIG.aviso ? '<div class="aviso">' + escapar(CONFIG.aviso) + '</div>' : '') +
      '<header class="cabecera"><div class="cabecera__fila">' +
        '<a class="logo" href="index.html" aria-label="' + escapar(CONFIG.nombreCorto) + ' · Inicio">' + logo + '</a>' +
        '<button class="menu-boton" type="button" aria-expanded="false" aria-controls="menu-principal">Menú</button>' +
        '<div class="cabecera__menu" id="menu-principal">' +
          '<nav class="cabecera__nav" aria-label="Principal"><ul class="menu-lista">' + menu + '</ul></nav>' +
          '<ul class="redes-lista">' + redes + '</ul>' +
        '</div>' +
      '</div></header>';

    var boton = $('.menu-boton', cont), panel = $('#menu-principal', cont);
    function cerrar(devolverFoco) {
      panel.classList.remove('is-abierto');
      boton.setAttribute('aria-expanded', 'false');
      if (devolverFoco) boton.focus();
    }
    boton.addEventListener('click', function () {
      var abierto = panel.classList.toggle('is-abierto');
      boton.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('is-abierto')) cerrar(true);
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1000) cerrar(false); });
  }

  function construirPie() {
    var cont = document.getElementById('pie');
    if (!cont) return;
    var explora = PAGINAS.map(function (p) { return '<a class="flink" href="' + p.url + '">' + p.texto + '</a>'; }).join('');
    var redes = REDES.map(function (r) { return enlaceRed(r, 'flink'); }).join('');
    cont.innerHTML =
      '<footer class="pie">' +
        '<div class="pie__interior">' +
          '<div class="pie__col--marca">' +
            '<span class="pie__nombre">' + escapar(CONFIG.marca) + '</span>' +
            '<span class="pie__sub">' + escapar(CONFIG.submarca) + '</span>' +
            '<p class="pie__frase">' + escapar(CONFIG.fraseMarca) + '</p>' +
          '</div>' +
          '<div class="pie__columnas">' +
            '<nav class="pie__col" aria-label="Explora"><span class="pie__titulo">Explora</span>' + explora + '</nav>' +
            '<div class="pie__col pie__col--contacto"><span class="pie__titulo">Escríbeme</span>' +
              '<span>' + escapar(CONFIG.correo) + '</span><span>' + escapar(CONFIG.whatsapp) + '</span><span>' + escapar(CONFIG.ubicacionPie) + '</span></div>' +
            '<div class="pie__col"><span class="pie__titulo">Redes</span>' + redes + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="pie__legal">' +
          '<span class="pie__legal-izq">© ' + escapar(CONFIG.anio) + ' ' + escapar(CONFIG.nombreCorto) + '. Todos los derechos reservados.</span>' +
          '<span class="firma-moravi">' + (CONFIG.firma ? 'Desarrollado por <a class="flink" href="https://www.moravistudio.com/" target="_blank" rel="noopener">moravistudio.com</a>' : '') + '</span>' +
          '<span class="pie__legal-der">' + escapar(CONFIG.legal) + '</span>' +
        '</div>' +
      '</footer>';
  }

  /* Enlaces sin destino todavía (href="#"): no saltan al inicio y muestran una tarjetita de demo */
  function frenarEnlacesVacios() {
    var tarjeta = null, reloj = null;
    function ocultar() {
      if (tarjeta) { tarjeta.classList.remove('is-visible'); }
      clearTimeout(reloj);
    }
    function mostrar(msg) {
      if (!tarjeta) {
        tarjeta = document.createElement('div');
        tarjeta.className = 'aviso-demo';
        tarjeta.setAttribute('role', 'status');
        tarjeta.innerHTML = '<p></p>';
        document.body.appendChild(tarjeta);
      }
      tarjeta.firstChild.textContent = msg || 'Esta página es un demo. Aquí deberían salir tus enlaces.';
      tarjeta.classList.remove('is-visible');
      void tarjeta.offsetWidth;                         // reinicia la animación si se pulsa de nuevo
      tarjeta.classList.add('is-visible');
      clearTimeout(reloj);
      reloj = setTimeout(ocultar, 3500);
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href="#"]');
      if (a) { e.preventDefault(); mostrar(a.getAttribute('data-aviso')); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') ocultar(); });
  }

  /* Datos sueltos de CONFIG dentro de las páginas: <span data-cfg="correo"> */
  function aplicarConfig() {
    $$('[data-cfg]').forEach(function (el) {
      var v = CONFIG[el.getAttribute('data-cfg')];
      if (v) el.textContent = v;
    });
    $$('[data-redes]').forEach(function (el) {
      el.innerHTML = REDES.map(function (r) { return enlaceRed(r, 'enlace-sub'); }).join(' · ');
    });
  }

  /* ---------- fotos: si el archivo no existe, se ve el color liso con su etiqueta ---------- */
  function revisarFotos(ctx) {
    $$('.ph', ctx).forEach(function (ph) {
      if (ph.getAttribute('data-revisada')) return;
      ph.setAttribute('data-revisada', '1');
      var img = $('img', ph);
      if (!img) return;
      function vacia() { ph.classList.add('is-empty'); }
      function llena() { ph.classList.remove('is-empty'); }
      img.addEventListener('error', vacia);
      img.addEventListener('load', llena);
      if (img.complete && img.naturalWidth === 0) vacia();
    });
  }

  function rutaFoto(boda, archivo) { return 'img/bodas/' + boda.id + '/' + archivo; }
  function nombresBoda(b) { return b.pareja[0] + ' &amp; ' + b.pareja[1]; }
  function nombresTexto(b) { return b.pareja[0] + ' y ' + b.pareja[1]; }
  function buscarBoda(id) {
    var lista = window.BODAS || [];
    for (var i = 0; i < lista.length; i++) if (lista[i].id === id) return { boda: lista[i], indice: i };
    return null;
  }

  /* ---------- inicio: textos y enlaces de las dos bodas, desde bodas.js ---------- */
  function paginaInicio() {
    $$('[data-boda]').forEach(function (cont) {
      var r = buscarBoda(cont.getAttribute('data-boda'));
      if (!r) return;
      var n = $('[data-boda-nombre]', cont), t = $('[data-boda-resumen]', cont), a = $('[data-boda-enlace]', cont);
      if (n) n.innerHTML = nombresBoda(r.boda);
      if (t) t.textContent = r.boda.resumen;
      if (a) a.setAttribute('href', 'boda.html?id=' + encodeURIComponent(r.boda.id));
    });
  }

  /* ---------- galería: una tarjeta por boda ---------- */
  function paginaGaleria() {
    var lista = document.getElementById('lista-bodas');
    if (!lista || !window.BODAS) return;
    lista.innerHTML = window.BODAS.map(function (b, i) {
      var tarjeta = b.tarjeta || b.fotos[0];
      var enlace = b.bloqueada
        ? '<a class="wcard wcard--bloqueada" href="#" data-aviso="Esto es un demo. Las demás galerías tendrán tu trabajo, tus fotos y lo que quieras poner.">'
        : '<a class="wcard" href="boda.html?id=' + encodeURIComponent(b.id) + '">';
      return '<li>' + enlace +
        '<div class="ph' + (i % 2 ? ' ph--2' : '') + '" data-label="[ FOTO · PORTADA DE LA BODA · 3:4 ]">' +
          '<img src="' + escapar(rutaFoto(b, tarjeta.archivo)) + '" alt="' + escapar(tarjeta.alt) + '" width="900" height="1200"' + (i < 3 ? '' : ' loading="lazy"') + '>' +
        '</div>' +
        '<div class="wcard__datos">' +
          '<h2 class="wcard__nombre">' + nombresBoda(b) + '</h2>' +
          '<span class="wcard__meta">' + escapar(b.lugar) + ' · ' + escapar(b.anio) + '</span>' +
          '<span class="wcard__enlace">Ver galería</span>' +
        '</div></a></li>';
    }).join('');
    revisarFotos(lista);
  }

  /* ---------- boda individual ---------- */
  // Proporciones de cada foto del mosaico (ancho / alto, medidas de la maqueta)
  var RELACION = [
    '368 / 420', '368 / 380', '368 / 410',
    '368 / 360', '368 / 440', '368 / 410',
    '368 / 400', '368 / 400', '368 / 410'
  ];
  var ETIQUETA = ['3:4', '1:1', '3:4', '1:1', '2:3', '3:4', '3:4', '3:4', '3:4'];

  function paginaBoda() {
    var cont = document.getElementById('boda');
    if (!cont || !window.BODAS) return;
    var params = new URLSearchParams(window.location.search);
    var r = buscarBoda(params.get('id') || window.BODAS[0].id);
    if (!r) {
      cont.innerHTML =
        '<section class="boda-titulo"><h1 class="titulo-cursiva">No encontramos esa boda</h1>' +
        '<p class="lead">Puede que el enlace esté incompleto. Mira todas las galerías:</p>' +
        '<a class="btn btn--oliva btn--grande" href="galeria.html">Ver la galería</a></section>';
      document.title = 'Boda no encontrada · ' + CONFIG.nombreCorto + ' Fotografía de bodas';
      return;
    }
    var b = r.boda;
    if (b.bloqueada) {
      cont.innerHTML =
        '<section class="boda-titulo"><h1 class="titulo-cursiva">Esta galería es parte del demo</h1>' +
        '<p class="lead">Aquí irá una boda con su historia y sus fotos. Por ahora, solo están abiertas las dos primeras galerías.</p>' +
        '<a class="btn btn--oliva btn--grande" href="galeria.html">Volver a la galería</a></section>';
      document.title = 'Galería de demostración · ' + CONFIG.nombreCorto + ' Fotografía de bodas';
      return;
    }
    var lista = window.BODAS.filter(function (x) { return !x.bloqueada; });
    var pos = lista.indexOf(b);
    var ant = lista[(pos - 1 + lista.length) % lista.length];
    var sig = lista[(pos + 1) % lista.length];
    var nombres = nombresTexto(b);

    document.title = nombres + ' · ' + CONFIG.nombreCorto + ' Fotografía de bodas';
    var desc = $('meta[name="description"]');
    if (desc) desc.setAttribute('content', 'Galería de la boda de ' + nombres + ': su historia y las mejores fotos del día, por ' + CONFIG.nombreCorto + ' Fotografía de bodas.');

    var columnas = [[], [], []];
    b.fotos.forEach(function (f, i) {
      var col = Math.min(2, Math.floor(i / 3));
      columnas[col].push(
        '<button class="foto-boton" type="button" data-i="' + i + '" aria-label="Ampliar la foto ' + (i + 1) + ': ' + escapar(f.alt) + '">' +
          '<span class="ph' + (i % 2 ? ' ph--2' : '') + '" style="--ar:' + RELACION[i] + '" data-label="[ FOTO · ' + ETIQUETA[i] + ' ]">' +
            '<img src="' + escapar(rutaFoto(b, f.archivo)) + '" alt="" width="800" height="1000" loading="lazy">' +
          '</span></button>'
      );
    });

    cont.innerHTML =
      '<section class="boda-titulo">' +
        '<a class="volver" href="galeria.html">← Volver a la galería</a>' +
        '<h1 class="titulo-caps">' + nombresBoda(b) + '</h1>' +
        '<span class="filete"></span>' +
        '<p class="boda-titulo__meta">' + escapar(b.lugar) + ' · ' + escapar(b.fecha) + '</p>' +
      '</section>' +
      '<section class="portada-boda"><div class="ph ph--2" data-label="[ FOTO · PORTADA DE LA BODA, PAREJA EN SU LUGAR FAVORITO · 16:9 ]">' +
        '<img src="' + escapar(rutaFoto(b, b.portada.archivo)) + '" alt="' + escapar(b.portada.alt) + '" width="1600" height="700" fetchpriority="high">' +
      '</div></section>' +
      '<section class="boda-historia"><h2 class="titulo-cursiva">Su historia</h2><p>' + escapar(b.historia) + '</p></section>' +
      '<section class="fotos-boda" aria-label="Fotos de la boda">' +
        columnas.map(function (c) { return '<div class="fotos-boda__col">' + c.join('') + '</div>'; }).join('') +
      '</section>' +
      '<section class="palabras"><blockquote>«' + escapar(b.testimonio) + '»</blockquote><span class="rotulo">' + nombresBoda(b) + '</span></section>' +
      '<nav class="boda-nav" aria-label="Entre bodas">' +
        '<a class="enlace-sub" href="boda.html?id=' + encodeURIComponent(ant.id) + '">← Boda anterior</a>' +
        '<a class="enlace-sub" href="boda.html?id=' + encodeURIComponent(sig.id) + '">Siguiente boda →</a>' +
      '</nav>';

    revisarFotos(cont);
    iniciarVisor(b, cont);
  }

  /* ---------- vista ampliada de las fotos (teclado, Escape y foco controlado) ---------- */
  function iniciarVisor(boda, cont) {
    var d = document.createElement('dialog');
    d.className = 'visor';
    d.setAttribute('aria-label', 'Fotos de la boda de ' + nombresTexto(boda));
    d.innerHTML =
      '<div class="visor__caja">' +
        '<div class="visor__barra"><span class="visor__contador" aria-live="polite"></span>' +
          '<button class="visor__boton" type="button" data-cerrar>Cerrar</button></div>' +
        '<div class="visor__escena"></div>' +
        '<div class="visor__pie">' +
          '<button class="visor__boton" type="button" data-ant>Anterior</button>' +
          '<p class="visor__texto"></p>' +
          '<button class="visor__boton" type="button" data-sig>Siguiente</button></div>' +
      '</div>';
    document.body.appendChild(d);

    var escena = $('.visor__escena', d), contador = $('.visor__contador', d), texto = $('.visor__texto', d);
    var actual = 0, opener = null, total = boda.fotos.length;

    function mostrar(i) {
      actual = (i + total) % total;
      var f = boda.fotos[actual];
      escena.innerHTML = '';
      var img = new Image();
      img.className = 'visor__foto';
      img.alt = f.alt;
      img.onerror = function () {
        var v = document.createElement('div');
        v.className = 'visor__vacio';
        v.textContent = '[ FOTO · ' + ETIQUETA[actual] + ' ]';
        escena.innerHTML = '';
        escena.appendChild(v);
      };
      img.src = rutaFoto(boda, f.archivo);
      escena.appendChild(img);
      contador.textContent = (actual + 1) + ' / ' + total;
      texto.textContent = f.alt;
    }
    function abrir(i, desde) {
      opener = desde;
      mostrar(i);
      d.showModal();
      document.documentElement.classList.add('visor-abierto');
      $('[data-cerrar]', d).focus();
    }

    cont.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('.foto-boton');
      if (b) abrir(Number(b.getAttribute('data-i')), b);
    });
    d.addEventListener('click', function (e) {
      if (e.target === d) d.close();                       // clic fuera de la foto
      if (e.target.closest('[data-cerrar]')) d.close();
      if (e.target.closest('[data-ant]')) mostrar(actual - 1);
      if (e.target.closest('[data-sig]')) mostrar(actual + 1);
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); mostrar(actual - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); mostrar(actual + 1); }
    });
    d.addEventListener('close', function () {
      document.documentElement.classList.remove('visor-abierto');
      if (opener) opener.focus();                          // el foco vuelve a la foto que se abrió
    });
  }

  /* ---------- contacto: validación y punto único de envío ---------- */
  var CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var FECHA = /^\d{1,2}\s*[\/\-.]\s*\d{1,2}\s*[\/\-.]\s*\d{2,4}$/;

  // Único punto de conexión: cuando tengas un servicio (Formspree, WhatsApp, etc.), pon modo 'real' y la URL en CONFIG.
  function enviar(datos) {
    var c = CONFIG.formulario;
    if (c.modo !== 'real' || !c.endpoint) {
      return new Promise(function (resolve) { setTimeout(resolve, 500); });   // simulación
    }
    return fetch(c.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(datos)
    }).then(function (r) { if (!r.ok) throw new Error('Respuesta ' + r.status); });
  }

  function paginaContacto() {
    var form = document.getElementById('formulario');
    if (!form) return;
    var estado = document.getElementById('formulario-estado');
    var boton = $('button[type="submit"]', form);

    // Paquete elegido desde Paquetes: contacto.html?paquete=clasico
    var p = new URLSearchParams(window.location.search).get('paquete');
    var sel = form.elements.paquete;
    if (p && sel) {
      for (var i = 0; i < sel.options.length; i++) if (sel.options[i].value === p) sel.selectedIndex = i;
    }

    function error(campo, msg) {
      var span = document.getElementById('error-' + campo.name);
      if (span) span.textContent = msg;
      if (msg) campo.setAttribute('aria-invalid', 'true'); else campo.removeAttribute('aria-invalid');
    }
    function validar(campo) {
      var v = campo.value.trim(), n = campo.name, msg = '';
      if (n === 'nombres') {
        if (v.length < 3) msg = 'Escribe los nombres de la pareja.';
      } else if (n === 'correo') {
        if (!v) msg = 'Escribe tu correo electrónico.';
        else if (!CORREO.test(v)) msg = 'Revisa el correo: parece que falta algo, por ejemplo nombre@correo.com.';
      } else if (n === 'whatsapp') {
        var digitos = v.replace(/\D/g, '');
        if (v && (digitos.length < 7 || digitos.length > 15)) msg = 'Revisa el número: escríbelo con su código de país, por ejemplo +51 987 654 321.';
      } else if (n === 'fecha') {
        if (!v) msg = 'Escribe la fecha de la boda. Si aún no la tienes, escribe «por definir».';
        else if (!FECHA.test(v) && !/^por definir$/i.test(v)) msg = 'Escribe la fecha como día/mes/año, por ejemplo 12/05/2027, o «por definir».';
      } else if (n === 'lugar') {
        if (v.length < 3) msg = 'Cuéntame dónde será la ceremonia o la fiesta.';
      } else if (n === 'invitados') {
        var num = Number(v);
        if (v && (!/^\d+$/.test(v) || num < 1 || num > 3000)) msg = 'Escribe un número aproximado, por ejemplo 80.';
      }
      error(campo, msg);
      return !msg;
    }

    $$('.campo input, .campo textarea', form).forEach(function (c) {
      c.addEventListener('blur', function () { if (c.value.trim() || c.getAttribute('aria-invalid')) validar(c); });
      c.addEventListener('input', function () { if (c.getAttribute('aria-invalid')) validar(c); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var campos = $$('.campo input, .campo textarea', form);
      var primero = null;
      campos.forEach(function (c) { if (!validar(c) && !primero) primero = c; });
      if (primero) {
        estado.className = 'formulario__estado is-error';
        estado.textContent = 'Revisa los campos marcados para poder enviar tu mensaje.';
        primero.focus();
        return;
      }
      var datos = {};
      Array.prototype.forEach.call(form.elements, function (el) { if (el.name) datos[el.name] = el.value.trim(); });
      boton.disabled = true;
      estado.className = 'formulario__estado';
      estado.textContent = 'Enviando…';
      enviar(datos).then(function () {
        form.reset();
        estado.className = 'formulario__estado is-ok';
        estado.textContent = CONFIG.formulario.modo === 'real'
          ? '¡Gracias! Recibí tu mensaje y te respondo en ' + CONFIG.tiempoRespuesta + '.'
          : 'Gracias. Esto es una demostración: el formulario todavía no envía mensajes.';
      }).catch(function () {
        estado.className = 'formulario__estado is-error';
        estado.textContent = 'No pudimos enviar tu mensaje en este momento. Inténtalo de nuevo en unos minutos o escríbeme por WhatsApp.';
      }).then(function () { boton.disabled = false; });
    });
  }

  /* ---------- inicio ---------- */
  construirCabecera();
  construirPie();
  frenarEnlacesVacios();
  aplicarConfig();
  revisarFotos();
  if (pagina === 'inicio') paginaInicio();
  if (pagina === 'galeria') paginaGaleria();
  if (pagina === 'boda') paginaBoda();
  if (pagina === 'contacto') paginaContacto();
})();
