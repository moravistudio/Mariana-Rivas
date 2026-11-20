/* =====================================================================
   Datos de las bodas. La galería (galeria.html) y la página de cada boda
   (boda.html?id=...) se generan desde aquí.

   Cada boda:
     id          texto corto sin espacios ni tildes; es la dirección: boda.html?id=camila-mateo
                 y también la carpeta de sus fotos: img/bodas/<id>/
     pareja      los dos nombres
     lugar       lugar de la boda
     fecha       fecha completa (se muestra en la página de la boda)
     anio        año (se muestra en la tarjeta de la galería)
     resumen     2 frases para la página de inicio (solo las dos primeras bodas salen ahí)
     historia    la historia de la boda (página de la boda)
     testimonio  las palabras de la pareja, tal como las dijeron (sin inventar)
     portada     { archivo, alt }  foto ancha de la parte de arriba (16:9)
     fotos       9 fotos en este orden, que es el que usa el mosaico: { archivo, alt }
                 01 vertical · 02 cuadrada · 03 vertical · 04 cuadrada · 05 alta
                 06 vertical · 07 vertical · 08 vertical · 09 vertical
     tarjeta     opcional: foto vertical para la galería (por defecto, la foto 01)
     bloqueada   true = la tarjeta sale en la galería, pero no abre (demo). Solo necesita tarjeta.

   Todo lo que está entre corchetes [ ] es un dato que falta.
   Para agregar una boda: copia un bloque, cambia el id y los textos, y pon sus
   fotos en img/bodas/<id>/ (01.jpg a 09.jpg y portada.jpg).
   Las bodas «bloqueadas» (demo) solo llevan su foto de tarjeta: img/bodas/<id>/tarjeta.jpg.
   ===================================================================== */

(function () {
  'use strict';

  /* Las nueve fotos de una boda de ejemplo (descripciones = lo que debe mostrar cada foto) */
  function fotos(descripciones) {
    return descripciones.map(function (alt, i) {
      var n = (i + 1 < 10 ? '0' : '') + (i + 1);
      return { archivo: n + '.jpg', alt: alt };
    });
  }

  /* Tarjeta bloqueada: sale en la galería con su foto, pero no abre (es un demo) */
  function bloqueada(n, alt, pareja, lugar, anio) {
    var num = (n < 10 ? '0' : '') + n;
    return {
      id: 'boda-' + num,
      pareja: pareja,
      lugar: lugar,
      fecha: '',
      anio: anio,
      resumen: '',
      historia: '',
      testimonio: '',
      portada: { archivo: 'portada.jpg', alt: alt },
      fotos: [],
      tarjeta: { archivo: 'tarjeta.jpg', alt: alt },
      bloqueada: true
    };
  }

  window.BODAS = [
    {
      id: 'camila-mateo',
      pareja: ['Camila', 'Mateo'],
      lugar: 'Punta Hermosa, Lima',
      fecha: '14 de febrero de 2026',
      anio: '2026',
      resumen: 'Una boda frente al mar, con los pies descalzos, risas largas y el último sol del día.',
      historia: 'Una boda frente al mar, con los pies descalzos, risas largas y el último sol del día. Camila y Mateo se dieron el sí en la playa, rodeados de su familia, y el atardecer hizo el resto.',
      testimonio: 'Cuando vimos las fotos volvimos a llorar de la emoción. Estaba todo ahí: el sol, las risas y nuestras familias.',
      portada: { archivo: 'portada.jpg', alt: 'Camila y Mateo abrazados en la playa al atardecer, en un plano medio amplio' },
      fotos: fotos([
        'Camila y Mateo en silueta frente al atardecer en la playa, a punto de besarse',
        'Camila y Mateo caminando de la mano por una playa amplia al atardecer',
        'El vestido de novia con su velo, colgado de una ventana abierta con vista al mar',
        'El ramo de flores silvestres y rosas sobre una mesa de madera, con el mar al fondo',
        'Camila y Mateo abrazados con las frentes juntas, sonriendo, en la playa al atardecer',
        'Camila y Mateo sonriéndose a la orilla del mar al atardecer',
        'Invitados sonriendo durante la ceremonia en la playa, en un retrato cercano',
        'Camila del brazo de su padre, camino al altar en la playa, con los invitados detrás',
        'Mateo riendo, mirando a su esposa fuera de cuadro, en un retrato cercano'
      ])
    },
    {
      id: 'valeria-andres',
      pareja: ['Valeria', 'Andrés'],
      lugar: 'Cieneguilla, Lima',
      fecha: '22 de noviembre de 2025',
      anio: '2025',
      resumen: 'Un matrimonio íntimo entre familia y amigos, con mucha luz y pocos protocolos.',
      historia: 'Un matrimonio íntimo entre familia y amigos, con mucha luz y pocos protocolos. Valeria y Andrés celebraron al aire libre, en un jardín lleno de flores blancas, con una mesa larga y sus seres queridos muy cerca.',
      testimonio: 'Queríamos fotos que se sintieran como ese día: tranquilo, luminoso y lleno de cariño. Mariana lo logró.',
      portada: { archivo: 'portada.jpg', alt: 'Valeria y Andrés abrazados en un jardín luminoso, con los ojos cerrados y sonriendo' },
      fotos: fotos([
        'Valeria apoyada en el pecho de Andrés, abrazados en un jardín con luz suave de media mañana',
        'Una mesa larga puesta al aire libre, con flores y vajilla sencilla, lista para el almuerzo',
        'Valeria de perfil junto a una ventana luminosa, con su vestido, lista para la ceremonia',
        'Los anillos sobre una hoja verde con gotas de agua, junto a unas flores blancas',
        'Andrés de perfil junto a una ventana muy luminosa, con lentes redondos y su traje beige',
        'Valeria y su abuela sonriendo juntas, mejilla con mejilla',
        'Dos invitados riendo juntos en el jardín, con la mesa de la boda al fondo',
        'Valeria y Andrés caminando entre los árboles, mirándose y sonriendo',
        'Valeria y Andrés sonriendo juntos en el jardín al final de la tarde'
      ])
    },
    bloqueada(3, 'Una pareja riendo abrazada entre las hileras de un viñedo, al atardecer', ['Daniela', 'Marcos'], 'Ica', '2025'),
    bloqueada(4, 'Una pareja sonriéndose frente a la puerta de madera de un patio colonial, con flores', ['Luciana', 'Diego'], 'Arequipa', '2025'),
    bloqueada(5, 'Una pareja riendo en un prado de flores silvestres, con montañas al fondo', ['Ximena', 'Rodrigo'], 'Cusco', '2026'),
    bloqueada(6, 'Una pareja sentada bajo un olivo, frente a una casa de campo de piedra', ['Sofía', 'Gabriel'], 'Tacna', '2025')
  ];
})();
