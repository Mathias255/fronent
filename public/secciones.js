(() => {
  const labels = {
    sitio_turistico: 'Naturaleza',
    hotel: 'Hospedaje',
    restaurante: 'Gastronomía'
  };
  const difficultyLabels = { easy: 'Fácil', moderate: 'Moderada', hard: 'Difícil' };

  const gearRecommendations = {
    quilotoa: {
      activity: 'Sendero de cráter · gran altitud',
      items: [
        ['Ropa por capas', 'Primera capa transpirable, abrigo térmico y cortaviento.'],
        ['Chaqueta impermeable', 'La lluvia y el viento pueden cambiar durante el día.'],
        ['Botas con agarre', 'Calzado de trekking ya usado; evita estrenarlo en la ruta.'],
        ['Protección solar', 'Gorra, gafas y bloqueador solar de amplio espectro.'],
        ['Agua y energía', 'Lleva agua suficiente y refrigerio; no dependas de encontrar tiendas.'],
        ['Bastones y botiquín', 'Útiles en pendientes; lleva medicación personal y curaciones básicas.']
      ],
      guideTitle: '¿Conviene ir con guía?',
      advice: 'El borde del cráter, el descenso y el ascenso tienen tramos empinados y altura considerable. Si no conoces el terreno o quieres recorrer rutas alejadas, consulta un guía local.',
      checklist: ['Aclimátate y camina a un ritmo gradual.', 'Consulta clima, horarios y estado del sendero el mismo día.', 'Si sientes malestar por la altura, detente y avisa a tu grupo.']
    },
    banos: {
      activity: 'Cascadas · caminos húmedos',
      items: [
        ['Calzado antideslizante', 'La roca y los senderos cercanos al agua pueden estar mojados.'],
        ['Ropa de secado rápido', 'Cómoda para caminar y fácil de cambiar si te salpicas.'],
        ['Impermeable liviano', 'Una capa ligera ayuda con lluvia o neblina.'],
        ['Bolsa impermeable', 'Protege teléfono, documentos y una muda seca.'],
        ['Agua y refrigerio', 'Lleva suficiente para el tiempo de tu recorrido.'],
        ['Protección solar', 'Gorra y bloqueador, incluso en días nublados.']
      ],
      guideTitle: '¿Conviene ir con guía?',
      advice: 'Para los accesos conocidos puedes informarte localmente. Contrata un guía o proveedor con experiencia para desvíos, cascadas remotas o actividades de aventura.',
      checklist: ['No te acerques a corrientes fuertes o crecientes.', 'Pregunta por cierres y condiciones del sendero.', 'Usa operadores formales para deportes de aventura.']
    },
    cotopaxi: {
      activity: 'Páramo · ambiente frío y cambiante',
      items: [
        ['Capas térmicas', 'Primera capa, abrigo y capa exterior contra el viento.'],
        ['Impermeable y cortaviento', 'La temperatura y el clima cambian con rapidez.'],
        ['Botas de trekking', 'Cómodas, con agarre y adecuadas para barro o terreno irregular.'],
        ['Gorro y guantes', 'Recomendados para protegerte del frío en zonas expuestas.'],
        ['Agua y snacks', 'La altura exige hidratarse y hacer pausas frecuentes.'],
        ['Gafas y bloqueador', 'La radiación UV es intensa incluso con nubosidad.']
      ],
      guideTitle: '¿Conviene ir con guía?',
      advice: 'Para el área de visita, sigue las reglas e indicaciones de los guardaparques. Los ascensos de montaña requieren planificación, aclimatación, equipo apropiado y guías autorizados.',
      checklist: ['Aclimátate antes de hacer esfuerzos intensos.', 'Regístrate o informa tu itinerario según las reglas del parque.', 'No intentes un ascenso técnico sin experiencia, equipo y guía.']
    },
    cuenca: {
      activity: 'Centro histórico · recorrido urbano',
      items: [
        ['Zapatos cómodos', 'El centro se disfruta mejor caminando por tramos.'],
        ['Chaqueta ligera', 'Una capa adicional es útil si refresca o llueve.'],
        ['Agua reutilizable', 'Mantente hidratado y rellénala en lugares seguros.'],
        ['Protección solar', 'Gorra y bloqueador para las horas de sol.'],
        ['Bolso seguro', 'Guarda documentos y objetos de valor con discreción.'],
        ['Teléfono cargado', 'Lleva batería suficiente para consultar el mapa.']
      ],
      guideTitle: '¿Conviene ir con guía?',
      advice: 'El centro histórico puede recorrerse por cuenta propia. Si te interesa la historia y arquitectura, un guía patrimonial local puede complementar el paseo.',
      checklist: ['Comprueba horarios de museos e iglesias.', 'Respeta los espacios patrimoniales y las indicaciones locales.', 'Para caminar de noche, elige calles transitadas y planifica el regreso.']
    },
    default: {
      activity: 'Paseo y visita local',
      items: [
        ['Calzado cómodo', 'Adáptalo al terreno y a la duración del paseo.'],
        ['Capas ligeras', 'Lleva una prenda extra; el clima puede cambiar.'],
        ['Protección contra la lluvia', 'Una chaqueta impermeable ligera ocupa poco espacio.'],
        ['Protección solar', 'Gorra, gafas y bloqueador solar.'],
        ['Agua y refrigerio', 'Ajusta la cantidad a la duración y disponibilidad local.'],
        ['Teléfono y botiquín', 'Carga el teléfono y lleva artículos de primeros auxilios básicos.']
      ],
      guideTitle: '¿Conviene ir con guía?',
      advice: 'Para una visita urbana o un sitio concurrido, un guía puede ser opcional. En rutas remotas, técnicas o poco señalizadas, confirma con operadores y autoridades locales.',
      checklist: ['Consulta el estado y horario del lugar.', 'Comparte tu itinerario si vas a zonas apartadas.', 'Elige guías y operadores con credenciales verificables.']
    }
  };

  const mapUrl = (place) => `/mapa.html?destination=${encodeURIComponent(place.id || place.name)}`;

  const createElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };

  const normalizePlace = (place, index) => {
    const coordinates = place.location && Array.isArray(place.location.coordinates)
      ? [Number(place.location.coordinates[1]), Number(place.location.coordinates[0])]
      : null;
    if (!Array.isArray(coordinates) || coordinates.length !== 2 ||
        !Number.isFinite(coordinates[0]) || !Number.isFinite(coordinates[1]) ||
        Math.abs(coordinates[0]) > 90 || Math.abs(coordinates[1]) > 180) return null;
    return {
      id: String(place._id || `invalid-${index}`),
      name: String(place.name || 'Lugar turístico'),
      category: labels[place.category] ? place.category : 'sitio_turistico',
      description: String(place.description || ''),
      address: String(place.address || 'Ecuador'),
      province: String(place.province || ''),
      coordinates,
      image: Array.isArray(place.images) ? String(place.images[0] || '') : '',
      difficulty: place.difficulty || '',
      durationMinutes: Number(place.durationMinutes) || null,
      price: Number.isFinite(Number(place.price)) ? Number(place.price) : null,
    };
  };

  const fetchPlaces = async () => {
    const response = await fetch('http://localhost:3000/api/places?limit=100');
    if (!response.ok) throw new Error(`La API respondió ${response.status}`);
    const result = await response.json();
    if (!Array.isArray(result.items)) return [];
    return result.items.map(normalizePlace).filter(Boolean);
  };

  const setupDiscoverPage = () => {
    const grid = document.getElementById('place-grid');
    const status = document.getElementById('status');
    const search = document.getElementById('search');
    const provinceSelect = document.getElementById('province-filter');
    const difficultySelect = document.getElementById('difficulty-filter');
    const sortSelect = document.getElementById('sort');
    const dialog = document.getElementById('place-dialog');
    const dialogImage = document.getElementById('dialog-image');
    const dialogName = document.getElementById('dialog-name');
    const dialogCategory = document.getElementById('dialog-category');
    const dialogDescription = document.getElementById('dialog-description');
    const dialogAddress = document.getElementById('dialog-address');
    const dialogProvince = document.getElementById('dialog-province');
    const dialogDifficulty = document.getElementById('dialog-difficulty');
    const dialogDuration = document.getElementById('dialog-duration');
    const dialogPrice = document.getElementById('dialog-price');
    const dialogMap = document.getElementById('dialog-map');
    const requestedPlaceId = new URLSearchParams(location.search).get('place');
    let places = [];
    let categoryFilter = 'all';
    const favoriteIds = new Set();
    let token = '';

    try {
      token = localStorage.getItem('senderos_token') || '';
    } catch (error) {
      console.error('No se pudo leer la sesión local.', error);
    }

    const openDetails = (place) => {
      dialogImage.hidden = !place.image;
      if (place.image) {
        dialogImage.src = place.image;
        dialogImage.alt = place.name;
      } else {
        dialogImage.removeAttribute('src');
        dialogImage.alt = '';
      }
      dialogName.textContent = place.name;
      dialogCategory.textContent = labels[place.category];
      dialogDescription.textContent = place.description;
      dialogAddress.textContent = place.address;
      dialogProvince.textContent = place.province || 'No informada';
      dialogDifficulty.textContent = difficultyLabels[place.difficulty] || 'No especificada';
      dialogDuration.textContent = place.durationMinutes ? `${place.durationMinutes} minutos` : 'No informada';
      dialogPrice.textContent = place.price !== null ? `${place.price.toFixed(2)} USD` : 'No informado';
      dialogMap.href = mapUrl(place);
      dialog.showModal();
    };

    const render = () => {
      const query = search.value.trim().toLocaleLowerCase();
      const filtered = places.filter((place) => {
        const matchesCategory = categoryFilter === 'all' || place.category === categoryFilter;
        const matchesProvince = provinceSelect.value === 'all' || place.province === provinceSelect.value;
        const matchesDifficulty = difficultySelect.value === 'all' || place.difficulty === difficultySelect.value;
        const matchesQuery = !query ||
          `${place.name} ${place.address} ${place.province}`.toLocaleLowerCase().includes(query);
        return matchesCategory && matchesProvince && matchesDifficulty && matchesQuery;
      });
      if (sortSelect.value === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      if (sortSelect.value === 'price') filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
      grid.replaceChildren();
      if (!filtered.length) {
        grid.append(createElement('p', 'empty', places.length
          ? 'No encontramos lugares con esos filtros.'
          : 'El catálogo todavía no tiene destinos publicados.'));
        return;
      }

      for (const place of filtered) {
        const card = createElement('article', 'place-card');
        const imageWrap = createElement('div', 'place-image');
        if (place.image) {
          const image = document.createElement('img');
          image.src = place.image;
          image.alt = place.name;
          image.loading = 'lazy';
          imageWrap.append(image);
        } else {
          imageWrap.classList.add('place-image-empty');
          imageWrap.append(createElement('span', '', 'Fotografía no disponible'));
        }
        const tag = createElement('span', 'place-tag', labels[place.category]);
        imageWrap.append(tag);
        const body = createElement('div', 'place-body');
        body.append(createElement('div', 'place-location', place.province ? `${place.province} · ${place.address}` : place.address));
        body.append(createElement('h3', '', place.name));
        body.append(createElement('p', 'place-description', place.description));
        body.append(createElement('p', 'place-description', [
          place.difficulty ? `Dificultad: ${difficultyLabels[place.difficulty] || 'No especificada'}` : '',
          place.durationMinutes ? `Duración: ${place.durationMinutes} min` : '',
          place.price !== null ? `Desde ${place.price.toFixed(2)} USD` : 'Precio no informado'
        ].filter(Boolean).join(' · ')));
        const actions = createElement('div', 'place-actions');
        const mapLink = createElement('a', 'small-link primary', 'Ver en el mapa ↗');
        mapLink.href = mapUrl(place);
        const detailButton = createElement('button', 'small-link', 'Detalles');
        detailButton.type = 'button';
        detailButton.addEventListener('click', () => openDetails(place));
        const gearLink = createElement('a', 'small-link', 'Ropa y equipo');
        gearLink.href = `/guias.html?destination=${encodeURIComponent(place.id || place.name)}`;
        const favoriteButton = createElement('button', 'small-link', favoriteIds.has(place.id) ? '♥ Guardado' : '♡ Favorito');
        favoriteButton.type = 'button';
        favoriteButton.setAttribute('aria-pressed', String(favoriteIds.has(place.id)));
        favoriteButton.addEventListener('click', async () => {
          if (!token) {
            window.location.href = '/?login=1';
            return;
          }
          favoriteButton.disabled = true;
          try {
            const response = await fetch(`http://localhost:3000/api/auth/favorites/${encodeURIComponent(place.id)}`, {
              method: favoriteIds.has(place.id) ? 'DELETE' : 'PUT',
              headers: { Authorization: `Bearer ${token}` }
            });
            if (!response.ok) throw new Error(`La API respondió ${response.status}`);
            if (favoriteIds.has(place.id)) favoriteIds.delete(place.id);
            else favoriteIds.add(place.id);
            favoriteButton.textContent = favoriteIds.has(place.id) ? '♥ Guardado' : '♡ Favorito';
            favoriteButton.setAttribute('aria-pressed', String(favoriteIds.has(place.id)));
          } catch (error) {
            status.textContent = 'No se pudo actualizar el favorito. Vuelve a iniciar sesión e inténtalo otra vez.';
            console.error('No se pudo actualizar el favorito.', error);
          } finally {
            favoriteButton.disabled = false;
          }
        });
        actions.append(mapLink, detailButton, favoriteButton, gearLink);
        body.append(actions);
        card.append(imageWrap, body);
        grid.append(card);
      }
    };

    const updateProvinceOptions = () => {
      const selected = provinceSelect.value;
      const provinces = [...new Set(places.map((place) => place.province).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b, 'es'));
      provinceSelect.replaceChildren(new Option('Todas las provincias', 'all'));
      for (const province of provinces) provinceSelect.append(new Option(province, province));
      provinceSelect.value = provinces.includes(selected) ? selected : 'all';
    };

    document.querySelectorAll('.filter').forEach((button) => {
      button.addEventListener('click', () => {
        categoryFilter = button.dataset.filter || 'all';
        document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
        render();
      });
    });
    search.addEventListener('input', render);
    provinceSelect.addEventListener('change', render);
    difficultySelect.addEventListener('change', render);
    sortSelect.addEventListener('change', render);
    document.getElementById('dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    render();
    fetchPlaces()
      .then((items) => {
        places = items;
        updateProvinceOptions();
        status.textContent = items.length
          ? 'Lugares cargados desde el catálogo publicado.'
          : 'Aún no hay destinos publicados en Senderos.';
        if (token) {
          fetch('http://localhost:3000/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => response.ok ? response.json() : Promise.reject(new Error('Sesión no válida')))
            .then(({ user }) => user.favorites.forEach((id) => favoriteIds.add(id)))
            .then(render)
            .catch((error) => {
              console.error('No se pudieron cargar los favoritos.', error);
              status.textContent = 'Inicia sesión de nuevo para sincronizar tus favoritos.';
            });
        }
        render();
        const requestedPlace = places.find((place) => place.id === requestedPlaceId);
        if (requestedPlace) openDetails(requestedPlace);
      })
      .catch((error) => {
        status.textContent = 'No se pudo conectar con el catálogo de lugares.';
        console.error('No se pudieron cargar los destinos.', error);
      });
  };

  const setupTrailPage = () => {
    const grid = document.getElementById('trail-grid');
    const status = document.querySelector('.status');
    fetchPlaces()
      .then((places) => {
        const walkingPlaces = places.filter((place) =>
          place.category === 'sitio_turistico' && (place.difficulty || place.durationMinutes)
        );
        grid.replaceChildren();
        if (!walkingPlaces.length) {
          grid.append(createElement('p', 'empty', 'Aún no hay destinos con dificultad o duración verificadas. No mostramos distancias ni trazados estimados.'));
          status.textContent = 'Los recorridos y trazados se publicarán cuando estén revisados y registrados.';
          return;
        }
        for (const place of walkingPlaces) {
          const card = createElement('article', 'trail-card');
          const imageWrap = createElement('div', 'trail-image');
          if (place.image) {
            const image = document.createElement('img');
            image.src = place.image;
            image.alt = place.name;
            image.loading = 'lazy';
            imageWrap.append(image);
          }
          const body = createElement('div', 'trail-body');
          body.append(createElement('div', 'trail-location', place.province || 'Provincia no informada'));
          body.append(createElement('h2', '', place.name));
          body.append(createElement('p', '', place.description));
          const facts = createElement('div', 'trail-facts');
          if (place.difficulty) facts.append(createElement('span', '', `Dificultad: ${difficultyLabels[place.difficulty] || 'No especificada'}`));
          if (place.durationMinutes) facts.append(createElement('span', '', `Duración estimada: ${place.durationMinutes} min`));
          const actions = createElement('div', 'trail-actions');
          const mapLink = createElement('a', 'small-link primary', 'Ver ubicación ↗');
          mapLink.href = mapUrl(place);
          const gearLink = createElement('a', 'small-link', 'Ropa y equipo');
          gearLink.href = `/guias.html?destination=${encodeURIComponent(place.id)}`;
          actions.append(mapLink, gearLink);
          body.append(facts, actions);
          card.append(imageWrap, body);
          grid.append(card);
        }
        status.textContent = 'Datos informativos del destino; no representan un trazado GPS verificado.';
      })
      .catch((error) => {
        grid.replaceChildren(createElement('p', 'empty', 'No se pudo conectar con el catálogo de destinos.'));
        status.textContent = 'Inténtalo más tarde.';
        console.error('No se pudieron cargar los destinos para senderos.', error);
      });
  };

  const gearForPlace = (place) => {
    const name = place.name.toLocaleLowerCase();
    if (name.includes('quilotoa')) return gearRecommendations.quilotoa;
    if (name.includes('baños') || name.includes('banos')) return gearRecommendations.banos;
    if (name.includes('cotopaxi')) return gearRecommendations.cotopaxi;
    if (name.includes('cuenca')) return gearRecommendations.cuenca;
    if (place.category === 'hotel' || place.category === 'restaurante') {
      return {
        ...gearRecommendations.default,
        activity: place.category === 'hotel' ? 'Visita urbana · alojamiento' : 'Visita urbana · gastronomía',
        guideTitle: '¿Necesito guía para este lugar?',
        advice: 'Normalmente no se requiere un guía para visitar un alojamiento o restaurante. Consulta directamente horarios, accesibilidad y servicios disponibles.',
        checklist: ['Confirma horarios y reservas directamente con el establecimiento.', 'Comprueba cómo llegar y las opciones de transporte.', 'Para paseos por zonas apartadas, revisa las recomendaciones locales.']
      };
    }
    return gearRecommendations.default;
  };

  const setupGuidePage = () => {
    const select = document.getElementById('gear-destination');
    const image = document.getElementById('gear-image');
    const category = document.getElementById('gear-category');
    const name = document.getElementById('gear-name');
    const items = document.getElementById('gear-list');
    const adviceTitle = document.getElementById('guide-advice-title');
    const advice = document.getElementById('guide-advice');
    const checklist = document.getElementById('guide-checklist');
    const summary = document.getElementById('guide-summary');
    const mapLink = document.getElementById('gear-map-link');
    const guideLink = document.getElementById('local-guides-link');
    let places = [];

    const render = () => {
      const place = places.find((item) => item.id === select.value) || places[0];
      if (!place) {
        image.hidden = true;
        image.removeAttribute('src');
        category.textContent = '';
        name.textContent = 'Aún no hay destinos publicados';
        items.replaceChildren();
        adviceTitle.textContent = 'Recomendaciones generales';
        advice.textContent = 'Cuando el catálogo incluya destinos, podrás consultar orientación de vestimenta y equipo.';
        checklist.replaceChildren();
        summary.textContent = 'No hay destinos disponibles para personalizar estas recomendaciones.';
        mapLink.removeAttribute('href');
        guideLink.removeAttribute('href');
        return;
      }
      const recommendation = gearForPlace(place);
      image.hidden = !place.image;
      if (place.image) image.src = place.image;
      else image.removeAttribute('src');
      image.alt = place.name;
      category.textContent = `${labels[place.category]} · ${recommendation.activity}`;
      name.textContent = place.name;
      items.replaceChildren();
      for (const [title, detail] of recommendation.items) {
        const item = createElement('div', 'gear-item');
        item.append(createElement('span', 'gear-check', '✓'));
        const copy = document.createElement('div');
        copy.append(createElement('strong', '', title));
        copy.append(createElement('span', '', detail));
        item.append(copy);
        items.append(item);
      }
      adviceTitle.textContent = recommendation.guideTitle;
      advice.textContent = recommendation.advice;
      checklist.replaceChildren();
      for (const text of recommendation.checklist) checklist.append(createElement('li', '', text));
      summary.textContent = `Para ${place.name}, revisa estas condiciones antes de salir. Si buscas acompañamiento, pregunta por experiencia en este tipo de ruta y disponibilidad local.`;
      mapLink.href = mapUrl(place);
      const guideSearch = new URL('https://www.google.com/maps/search/');
      guideSearch.searchParams.set('api', '1');
      guideSearch.searchParams.set('query', `guía de turismo registrado ${place.name} Ecuador`);
      guideLink.href = guideSearch.toString();
    };

    const renderOptions = (selectedId) => {
      const selected = places.find((place) => place.id === selectedId) || places[0];
      select.replaceChildren();
      if (!selected) {
        select.append(new Option('No hay destinos publicados', ''));
        select.disabled = true;
        render();
        return;
      }
      select.disabled = false;
      for (const place of places) {
        const option = document.createElement('option');
        option.value = place.id;
        option.textContent = place.name;
        select.append(option);
      }
      select.value = selected.id;
      render();
    };

    const requested = new URLSearchParams(location.search).get('destination');
    select.addEventListener('change', render);
    renderOptions('');

    fetchPlaces()
      .then((items) => {
        const requestedPlace = items.find((place) =>
          place.id === requested || place.name.toLocaleLowerCase() === requested?.toLocaleLowerCase()
        );
        places = items;
        renderOptions(requestedPlace?.id);
      })
      .catch((error) => {
        places = [];
        renderOptions('');
        summary.textContent = 'No se pudo conectar con el catálogo de destinos.';
        console.error('No se pudieron cargar destinos para recomendaciones.', error);
      });
  };

  const page = document.body.dataset.page;
  if (page === 'places') setupDiscoverPage();
  if (page === 'trails') setupTrailPage();
  if (page === 'guides') setupGuidePage();
})();
