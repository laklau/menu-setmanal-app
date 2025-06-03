/**
 * Algoritme de generació automàtica del menú setmanal
 * 
 * Aquest algoritme genera un menú setmanal equilibrat segons els requisits nutricionals
 * i les restriccions especificades per l'usuari.
 */

// Constants i configuració
const DIES_SETMANA = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge'];
const TIPUS_APATS = ['dinar', 'sopar'];
const LIMIT_CALORIES_DIARI = 1400; // Límit màxim de calories per dia (dinar + sopar)
const MIN_PROTEINA_DIARIA = 40; // MODIFICAT: Mínim de proteïna combinada entre dinar i sopar (g) - rebaixat de 50g a 40g
const ESTACIONS = {
  hivern: [12, 1, 2, 3],
  primavera: [4, 5],
  estiu: [6, 7, 8, 9],
  tardor: [10, 11]
};

// Requisits setmanals per categories
const REQUISITS_SETMANALS = {
  ous: 2,
  llegums: 2,
  peix: 1,
  carn: 2
};

// Plats amb restriccions de dies
const PLATS_RESTRICCIONS_DIES = {
  "Pollastre a l'ast": ['dissabte', 'diumenge'] // Només disponible dissabte i diumenge
};

/**
 * Determina l'estació actual basada en la data
 * @param {Date} data - Data actual
 * @returns {string} - Nom de l'estació
 */
function determinarEstacioActual(data = new Date()) {
  const mes = data.getMonth() + 1; // getMonth() retorna 0-11
  
  for (const [estacio, mesos] of Object.entries(ESTACIONS)) {
    if (mesos.includes(mes)) {
      return estacio;
    }
  }
  
  return 'estiu'; // Per defecte
}

/**
 * Filtra els plats per estació
 * @param {Array} plats - Llista de plats
 * @param {string} estacioActual - Estació actual
 * @returns {Array} - Plats filtrats per estació
 */
function filtrarPlatsPerEstacio(plats, estacioActual) {
  return plats.filter(plat => {
    // Acceptar plats de l'estació actual o de "Tot l'any"
    return plat.temporada.some(temp => 
      temp.toLowerCase() === estacioActual.toLowerCase() || 
      temp.toLowerCase() === "tot l'any"
    );
  });
}

/**
 * Barreja aleatòriament un array (algoritme Fisher-Yates)
 * @param {Array} array - Array a barrejar
 * @returns {Array} - Array barrejat
 */
function shuffleArray(array) {
  const arrayCopy = [...array]; // Crear una còpia per no modificar l'original
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]; // Intercanvi
  }
  return arrayCopy;
}

/**
 * Separa els plats per tipus d'àpat (dinar/sopar)
 * @param {Array} plats - Llista de plats
 * @returns {Object} - Objecte amb plats separats per tipus d'àpat
 */
function separarPlatsTipusApat(plats) {
  const resultat = {
    dinar: [],
    sopar: []
  };
  
  plats.forEach(plat => {
    // Convertir a minúscules per evitar problemes de coincidència
    const tipusApats = plat.tipus_apat.map(tipus => tipus.toLowerCase());
    
    // Afegir el plat a la categoria corresponent
    if (tipusApats.includes('dinar')) {
      resultat.dinar.push(plat);
    }
    
    if (tipusApats.includes('sopar')) {
      // Prioritzar plats lleugers per sopar
      const esLleuger = plat.etiquetes.some(tag => tag.toLowerCase() === 'lleuger') || 
                        plat.valors_nutricionals.calories < 400;
      
      if (esLleuger) {
        // Afegir al principi per prioritzar
        resultat.sopar.unshift(plat);
      } else {
        resultat.sopar.push(plat);
      }
    }
    
    // Ignorar plats de tipus "piscolabis" o altres
  });
  
  // Barrejar aleatòriament els plats
  resultat.dinar = shuffleArray(resultat.dinar);
  resultat.sopar = shuffleArray(resultat.sopar);
  
  return resultat;
}

/**
 * Verifica si un plat pot ser servit en un dia específic
 * @param {Object} plat - Plat a verificar
 * @param {string} dia - Dia de la setmana
 * @returns {boolean} - Si el plat pot ser servit en aquest dia
 */
function platPermesEnDia(plat, dia) {
  // Comprovar si el plat té restriccions de dies
  if (plat.nom in PLATS_RESTRICCIONS_DIES) {
    const diesPermesos = PLATS_RESTRICCIONS_DIES[plat.nom];
    return diesPermesos.includes(dia.toLowerCase());
  }
  
  // Si no té restriccions, es pot servir qualsevol dia
  return true;
}

/**
 * Verifica si un plat compleix amb els requisits per ser afegit al menú
 * @param {Object} plat - Plat a verificar
 * @param {Array} platsSeleccionats - Plats ja seleccionats
 * @param {Object} platAnteriorDia - Plat del dia anterior (mateixa posició)
 * @param {Object} altreApatDia - Altre àpat del mateix dia
 * @param {string} dia - Dia de la setmana
 * @returns {boolean} - Si el plat compleix els requisits
 */
function compleixRequisits(plat, platsSeleccionats, platAnteriorDia, altreApatDia, dia) {
  // Evitar repetir plats
  if (platsSeleccionats.some(p => p.id === plat.id)) {
    return false;
  }
  
  // Evitar repetir categoria "llegums" en dies consecutius
  if (platAnteriorDia && 
      plat.categoria.toLowerCase() === 'llegums' && 
      platAnteriorDia.categoria.toLowerCase() === 'llegums') {
    return false;
  }
  
  // Categoria diferent per dinar i sopar el mateix dia (mantingut)
  if (altreApatDia && plat.categoria === altreApatDia.categoria) {
    return false;
  }
  
  // Verificar restriccions de dies per plats específics
  if (!platPermesEnDia(plat, dia)) {
    return false;
  }
  
  return true;
}

/**
 * Calcula les calories i proteïnes combinades d'un dia
 * @param {Object} dinar - Plat de dinar
 * @param {Object} sopar - Plat de sopar
 * @returns {Object} - Calories i proteïnes totals
 */
function calcularNutrientsDiaris(dinar, sopar) {
  const calories = (dinar ? dinar.valors_nutricionals.calories : 0) + 
                  (sopar ? sopar.valors_nutricionals.calories : 0);
  
  const proteines = (dinar ? dinar.valors_nutricionals.proteines : 0) + 
                   (sopar ? sopar.valors_nutricionals.proteines : 0);
  
  return { calories, proteines };
}

/**
 * Compta els plats per categoria en el menú actual
 * @param {Array} platsSeleccionats - Plats ja seleccionats
 * @returns {Object} - Comptador de plats per categoria
 */
function comptarPlatsPorCategoria(platsSeleccionats) {
  const comptador = {
    ous: 0,
    llegums: 0,
    peix: 0,
    carn: 0
  };
  
  platsSeleccionats.forEach(plat => {
    if (plat.categoria.toLowerCase() in comptador) {
      comptador[plat.categoria.toLowerCase()]++;
    }
  });
  
  return comptador;
}

/**
 * Genera un menú setmanal equilibrat
 * @param {Array} plats - Llista completa de plats
 * @param {number} intentRecursiu - Comptador d'intents recursius (intern)
 * @returns {Object} - Menú setmanal generat
 */
function generarMenuSetmanal(plats, intentRecursiu = 0) {
  // Barrejar aleatòriament tots els plats abans de començar
  plats = shuffleArray(plats);
  
  // Limitar el nombre d'intents recursius per evitar desbordament de pila
  if (intentRecursiu >= 3) {
    console.log('S\'ha arribat al límit d\'intents recursius. Retornant el millor menú possible.');
    
    // Crear un menú bàsic amb els plats disponibles
    return generarMenuBasic(plats);
  }
  
  // Determinar estació actual
  const estacioActual = determinarEstacioActual();
  
  // Filtrar plats per estació
  const platsEstacio = filtrarPlatsPerEstacio(plats, estacioActual);
  
  // Verificar si hi ha prou plats per generar un menú
  if (platsEstacio.length < 14) {
    console.log(`No hi ha prou plats per l'estació ${estacioActual}. Utilitzant plats de totes les estacions.`);
    // Utilitzar tots els plats si no n'hi ha prou per l'estació actual
    return generarMenuAmbPlats(plats, intentRecursiu);
  }
  
  return generarMenuAmbPlats(platsEstacio, intentRecursiu);
}

/**
 * Genera un menú amb els plats proporcionats
 * @param {Array} platsDisponibles - Plats disponibles per generar el menú
 * @param {number} intentRecursiu - Comptador d'intents recursius
 * @returns {Object} - Menú setmanal generat
 */
function generarMenuAmbPlats(platsDisponibles, intentRecursiu) {
  // Barrejar aleatòriament els plats disponibles
  platsDisponibles = shuffleArray(platsDisponibles);
  
  // Separar plats per tipus d'àpat
  const { dinar: platsDinar, sopar: platsSopar } = separarPlatsTipusApat(platsDisponibles);
  
  // Estructura del menú setmanal
  const menuSetmanal = {
    data_generacio: new Date().toISOString().split('T')[0],
    temporada_actual: determinarEstacioActual(),
    dies: []
  };
  
  // Plats ja seleccionats per evitar repeticions
  const platsSeleccionats = [];
  
  // Generar menú per cada dia de la setmana
  DIES_SETMANA.forEach((dia, indexDia) => {
    const diaMenu = {
      dia,
      apats: {
        dinar: null,
        sopar: null
      }
    };
    
    // Barrejar aleatòriament els plats de dinar per aquest dia
    const platsDinarBarrejats = shuffleArray(platsDinar);
    
    // Seleccionar plat per dinar
    for (const platDinar of platsDinarBarrejats) {
      // Verificar requisits per dinar
      const compleix = compleixRequisits(
        platDinar, 
        platsSeleccionats, 
        indexDia > 0 ? menuSetmanal.dies[indexDia - 1].apats.dinar : null,
        null,
        dia // Passar el dia actual
      );
      
      if (compleix) {
        diaMenu.apats.dinar = platDinar;
        platsSeleccionats.push(platDinar);
        break;
      }
    }
    
    // Si no s'ha trobat cap plat per dinar, utilitzar qualsevol plat disponible
    if (!diaMenu.apats.dinar && platsDinar.length > 0) {
      // Trobar un plat que no s'hagi utilitzat encara i que compleixi les restriccions de dia
      const platsPermesos = platsDinar.filter(p => 
        !platsSeleccionats.some(ps => ps.id === p.id) && 
        platPermesEnDia(p, dia)
      );
      
      if (platsPermesos.length > 0) {
        // Seleccionar un plat aleatori dels permesos
        const platAleatori = platsPermesos[Math.floor(Math.random() * platsPermesos.length)];
        diaMenu.apats.dinar = platAleatori;
        platsSeleccionats.push(platAleatori);
      } else {
        // Si no hi ha plats permesos, utilitzar qualsevol plat que compleixi les restriccions de dia
        const platsPermesosPerDia = platsDinar.filter(p => platPermesEnDia(p, dia));
        if (platsPermesosPerDia.length > 0) {
          const platAleatori = platsPermesosPerDia[Math.floor(Math.random() * platsPermesosPerDia.length)];
          diaMenu.apats.dinar = platAleatori;
          platsSeleccionats.push(platAleatori);
        }
      }
    }
    
    // Barrejar aleatòriament els plats de sopar per aquest dia
    const platsSoparBarrejats = shuffleArray(platsSopar);
    
    // Seleccionar plat per sopar
    for (const platSopar of platsSoparBarrejats) {
      // Verificar requisits per sopar
      const compleix = compleixRequisits(
        platSopar, 
        platsSeleccionats, 
        indexDia > 0 ? menuSetmanal.dies[indexDia - 1].apats.sopar : null,
        diaMenu.apats.dinar,
        dia // Passar el dia actual
      );
      
      if (compleix) {
        // Verificar límit de calories i proteïnes
        const { calories, proteines } = calcularNutrientsDiaris(diaMenu.apats.dinar, platSopar);
        
        if (calories <= LIMIT_CALORIES_DIARI && proteines >= MIN_PROTEINA_DIARIA) {
          diaMenu.apats.sopar = platSopar;
          platsSeleccionats.push(platSopar);
          break;
        }
      }
    }
    
    // Si no s'ha trobat cap plat per sopar, utilitzar qualsevol plat disponible
    if (!diaMenu.apats.sopar && platsSopar.length > 0) {
      // Trobar un plat que no s'hagi utilitzat encara i que compleixi les restriccions de dia
      const platsPermesos = platsSopar.filter(p => 
        !platsSeleccionats.some(ps => ps.id === p.id) && 
        platPermesEnDia(p, dia)
      );
      
      if (platsPermesos.length > 0) {
        // Seleccionar un plat aleatori dels permesos
        const platAleatori = platsPermesos[Math.floor(Math.random() * platsPermesos.length)];
        diaMenu.apats.sopar = platAleatori;
        platsSeleccionats.push(platAleatori);
      } else {
        // Si no hi ha plats permesos, utilitzar qualsevol plat que compleixi les restriccions de dia
        const platsPermesosPerDia = platsSopar.filter(p => platPermesEnDia(p, dia));
        if (platsPermesosPerDia.length > 0) {
          const platAleatori = platsPermesosPerDia[Math.floor(Math.random() * platsPermesosPerDia.length)];
          diaMenu.apats.sopar = platAleatori;
          platsSeleccionats.push(platAleatori);
        }
      }
    }
    
    menuSetmanal.dies.push(diaMenu);
  });
  
  // Verificar requisits setmanals de categories
  const comptadorCategories = comptarPlatsPorCategoria(platsSeleccionats);
  const requisitsComplerts = Object.entries(REQUISITS_SETMANALS).every(
    ([categoria, minim]) => comptadorCategories[categoria] >= minim
  );
  
  // Si no es compleixen els requisits, tornar a generar el menú amb un nou intent
  if (!requisitsComplerts) {
    console.log(`Intent ${intentRecursiu + 1}: No s'han complert tots els requisits. Provant de nou...`);
    return generarMenuSetmanal(platsDisponibles, intentRecursiu + 1);
  }
  
  return menuSetmanal;
}

/**
 * Genera un menú bàsic sense aplicar requisits estrictes
 * @param {Array} plats - Llista completa de plats
 * @returns {Object} - Menú setmanal bàsic
 */
function generarMenuBasic(plats) {
  // Barrejar aleatòriament tots els plats
  plats = shuffleArray(plats);
  
  // Separar plats per tipus d'àpat
  const { dinar: platsDinar, sopar: platsSopar } = separarPlatsTipusApat(plats);
  
  // Estructura del menú setmanal
  const menuSetmanal = {
    data_generacio: new Date().toISOString().split('T')[0],
    temporada_actual: determinarEstacioActual(),
    dies: []
  };
  
  // Generar menú per cada dia de la setmana
  DIES_SETMANA.forEach((dia, indexDia) => {
    // Filtrar plats permesos per aquest dia
    const platsDinarPermesos = platsDinar.filter(p => platPermesEnDia(p, dia));
    const platsSoparPermesos = platsSopar.filter(p => platPermesEnDia(p, dia));
    
    // Seleccionar plats aleatoris per cada dia que compleixin les restriccions de dia
    const indexDinar = platsDinarPermesos.length > 0 
      ? Math.floor(Math.random() * platsDinarPermesos.length)
      : Math.floor(Math.random() * platsDinar.length);
    
    const indexSopar = platsSoparPermesos.length > 0
      ? Math.floor(Math.random() * platsSoparPermesos.length)
      : Math.floor(Math.random() * platsSopar.length);
    
    const diaMenu = {
      dia,
      apats: {
        dinar: platsDinarPermesos.length > 0 ? platsDinarPermesos[indexDinar] : platsDinar[indexDinar],
        sopar: platsSoparPermesos.length > 0 ? platsSoparPermesos[indexSopar] : platsSopar[indexSopar]
      }
    };
    
    menuSetmanal.dies.push(diaMenu);
  });
  
  return menuSetmanal;
}

/**
 * Genera la llista de la compra a partir del menú setmanal
 * @param {Object} menuSetmanal - Menú setmanal generat
 * @param {Array} plats - Llista completa de plats
 * @returns {Object} - Llista de la compra agrupada per categories
 */
function generarLlistaCompra(menuSetmanal, plats) {
  // Mapa d'ingredients amb quantitats
  const ingredients = new Map();
  
  // Recórrer tots els plats del menú
  menuSetmanal.dies.forEach(dia => {
    Object.values(dia.apats).forEach(plat => {
      if (!plat) return;
      
      // Trobar el plat complet amb ingredients
      const platComplet = plats.find(p => p.id === plat.id);
      if (!platComplet) return;
      
      // Afegir ingredients a la llista
      platComplet.ingredients.forEach(ing => {
        const nomIng = ing.nom.toLowerCase();
        
        if (ingredients.has(nomIng)) {
          const ingExistent = ingredients.get(nomIng);
          
          // Sumar quantitats si tenen la mateixa unitat
          if (ing.unitat === ingExistent.unitat && ing.quantitat && ingExistent.quantitat) {
            ingExistent.quantitat += ing.quantitat;
          } else {
            // Si no tenen la mateixa unitat, incrementar comptador
            ingExistent.comptador += 1;
          }
        } else {
          ingredients.set(nomIng, {
            nom: ing.nom,
            quantitat: ing.quantitat,
            unitat: ing.unitat,
            comptador: 1
          });
        }
      });
    });
  });
  
  // Convertir el mapa a un array
  const llistaIngredients = Array.from(ingredients.values());
  
  // Agrupar per categories (simplificat, es podria millorar amb una classificació real)
  const categories = {
    fruites: [],
    verdures: [],
    proteines: [],
    lactis: [],
    cereals: [],
    altres: []
  };
  
  // Classificació simple basada en paraules clau
  llistaIngredients.forEach(ing => {
    const nom = ing.nom.toLowerCase();
    
    if (/poma|plàtan|taronja|fruita|préssec|cirera|maduixa|meló|síndria/.test(nom)) {
      categories.fruites.push(ing);
    } else if (/enciam|tomàquet|ceba|pastanaga|espinac|cogombre|pebrot|albergínia|carbassó/.test(nom)) {
      categories.verdures.push(ing);
    } else if (/carn|pollastre|vedella|porc|peix|ou|llegum|tofu|tempeh/.test(nom)) {
      categories.proteines.push(ing);
    } else if (/llet|formatge|iogurt|nata|mantega/.test(nom)) {
      categories.lactis.push(ing);
    } else if (/arròs|pasta|pa|farina|quinoa|civada/.test(nom)) {
      categories.cereals.push(ing);
    } else {
      categories.altres.push(ing);
    }
  });
  
  return categories;
}

// Exportar funcions
export {
  generarMenuSetmanal,
  generarLlistaCompra,
  determinarEstacioActual,
  filtrarPlatsPerEstacio,
  separarPlatsTipusApat
};
