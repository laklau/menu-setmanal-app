/**
 * Servei d'integració amb la base de dades de plats
 * 
 * Aquest servei gestiona la càrrega i manipulació de la base de dades de plats,
 * proporcionant mètodes per accedir i filtrar els plats segons diferents criteris.
 */

// Importar l'algoritme de generació de menú
import { 
  generarMenuSetmanal, 
  generarLlistaCompra,
  determinarEstacioActual,
  filtrarPlatsPerEstacio,
  separarPlatsTipusApat
} from './algoritme_generacio_menu';

class ServeiPlats {
  constructor() {
    this.plats = [];
    this.menuActual = null;
    this.historialMenus = [];
    this.llistaCompra = null;
  }

  /**
   * Carrega la base de dades de plats des d'un fitxer JSON
   * @returns {Promise} - Promesa que es resol quan les dades s'han carregat
   */
  async carregarPlats() {
    try {
      // Crida a un fitxer local
      const response = await fetch('/data/plats_normalitzats.json');
      const data = await response.json();
      this.plats = data.plats;
      
      // Carregar historial de menús des del localStorage si existeix
      this.carregarHistorialMenus();
      
      return this.plats;
    } catch (error) {
      console.error('Error en carregar els plats:', error);
      throw error;
    }
  }

  /**
   * Obté tots els plats de la base de dades
   * @returns {Array} - Llista completa de plats
   */
  obtenirTotsElsPlats() {
    return this.plats;
  }

  /**
   * Filtra els plats segons diversos criteris
   * @param {Object} criteris - Criteris de filtratge
   * @returns {Array} - Plats filtrats
   */
  filtrarPlats(criteris = {}) {
    let platsFiltrats = [...this.plats];
    
    // Filtrar per categoria
    if (criteris.categoria) {
      platsFiltrats = platsFiltrats.filter(plat => 
        plat.categoria.toLowerCase() === criteris.categoria.toLowerCase()
      );
    }
    
    // Filtrar per tipus d'àpat
    if (criteris.tipusApat) {
      platsFiltrats = platsFiltrats.filter(plat => 
        plat.tipus_apat.some(tipus => 
          tipus.toLowerCase() === criteris.tipusApat.toLowerCase()
        )
      );
    }
    
    // Filtrar per temporada
    if (criteris.temporada) {
      platsFiltrats = platsFiltrats.filter(plat => 
        plat.temporada.some(temp => 
          temp.toLowerCase() === criteris.temporada.toLowerCase() || 
          temp.toLowerCase() === "tot l'any"
        )
      );
    }
    
    // Filtrar per etiquetes
    if (criteris.etiqueta) {
      platsFiltrats = platsFiltrats.filter(plat => 
        plat.etiquetes.some(tag => 
          tag.toLowerCase() === criteris.etiqueta.toLowerCase()
        )
      );
    }
    
    // Filtrar per calories (màxim)
    if (criteris.maxCalories) {
      platsFiltrats = platsFiltrats.filter(plat => 
        plat.valors_nutricionals.calories <= criteris.maxCalories
      );
    }
    
    return platsFiltrats;
  }

  /**
   * Obté un plat pel seu ID
   * @param {string} id - ID del plat
   * @returns {Object|null} - Plat trobat o null
   */
  obtenirPlatPerId(id) {
    return this.plats.find(plat => plat.id === id) || null;
  }

  /**
   * Obté plats similars a un plat donat (per substitució)
   * @param {Object} plat - Plat de referència
   * @returns {Array} - Plats similars
   */
  obtenirPlatsSimilars(plat) {
    if (!plat) return [];
    
    // Filtrar plats de la mateixa categoria i tipus d'àpat
    let platsSimilars = this.filtrarPlats({
      categoria: plat.categoria,
      tipusApat: plat.tipus_apat[0]
    });
    
    // Excloure el plat original
    platsSimilars = platsSimilars.filter(p => p.id !== plat.id);
    
    // Ordenar per similitud nutricional (calories similars)
    platsSimilars.sort((a, b) => {
      const difA = Math.abs(a.valors_nutricionals.calories - plat.valors_nutricionals.calories);
      const difB = Math.abs(b.valors_nutricionals.calories - plat.valors_nutricionals.calories);
      return difA - difB;
    });
    
    return platsSimilars;
  }

  /**
   * Genera un nou menú setmanal
   * @returns {Object} - Menú setmanal generat
   */
  generarNouMenu() {
    // Utilitzar l'algoritme de generació
    this.menuActual = generarMenuSetmanal(this.plats);
    
    // Guardar al localStorage
    this.guardarMenuActual();
    
    // Afegir a l'historial
    this.afegirMenuAHistorial(this.menuActual);
    
    return this.menuActual;
  }

  /**
   * Substitueix un plat al menú actual
   * @param {string} dia - Dia de la setmana
   * @param {string} tipusApat - Tipus d'àpat (dinar/sopar)
   * @param {Object} nouPlat - Nou plat a afegir
   * @returns {Object} - Menú actualitzat
   */
  substituirPlat(dia, tipusApat, nouPlat) {
    if (!this.menuActual) return null;
    
    // Trobar el dia al menú
    const diaMenu = this.menuActual.dies.find(d => d.dia === dia);
    if (!diaMenu) return this.menuActual;
    
    // Substituir el plat
    diaMenu.apats[tipusApat] = nouPlat;
    
    // Actualitzar al localStorage
    this.guardarMenuActual();
    
    return this.menuActual;
  }

  /**
   * Genera la llista de la compra pel menú actual
   * @returns {Object} - Llista de la compra agrupada per categories
   */
  generarLlistaCompra() {
    if (!this.menuActual) return null;
    
    this.llistaCompra = generarLlistaCompra(this.menuActual, this.plats);
    
    // Guardar al localStorage
    localStorage.setItem('llistaCompra', JSON.stringify(this.llistaCompra));
    
    return this.llistaCompra;
  }

  /**
   * Guarda el menú actual al localStorage
   */
  guardarMenuActual() {
    if (this.menuActual) {
      localStorage.setItem('menuActual', JSON.stringify(this.menuActual));
    }
  }

  /**
   * Carrega el menú actual des del localStorage
   * @returns {Object|null} - Menú carregat o null
   */
  carregarMenuActual() {
    const menuGuardat = localStorage.getItem('menuActual');
    if (menuGuardat) {
      this.menuActual = JSON.parse(menuGuardat);
      return this.menuActual;
    }
    return null;
  }

  /**
   * Afegeix un menú a l'historial
   * @param {Object} menu - Menú a afegir
   */
  afegirMenuAHistorial(menu) {
    // Crear una còpia simplificada pel historial
    const menuHistorial = {
      id: `menu_${new Date().getTime()}`,
      data_generacio: menu.data_generacio,
      plats_utilitzats: this.obtenirPlatsUtilitzats(menu)
    };
    
    // Afegir a l'historial
    this.historialMenus.push(menuHistorial);
    
    // Limitar l'historial a 10 menús
    if (this.historialMenus.length > 10) {
      this.historialMenus.shift();
    }
    
    // Guardar al localStorage
    localStorage.setItem('historialMenus', JSON.stringify(this.historialMenus));
  }

  /**
   * Carrega l'historial de menús des del localStorage
   */
  carregarHistorialMenus() {
    const historialGuardat = localStorage.getItem('historialMenus');
    if (historialGuardat) {
      this.historialMenus = JSON.parse(historialGuardat);
    }
  }

  /**
   * Obté la llista d'IDs de plats utilitzats en un menú
   * @param {Object} menu - Menú
   * @returns {Array} - Llista d'IDs de plats
   */
  obtenirPlatsUtilitzats(menu) {
    const platsUtilitzats = [];
    
    menu.dies.forEach(dia => {
      Object.values(dia.apats).forEach(plat => {
        if (plat && plat.id && !platsUtilitzats.includes(plat.id)) {
          platsUtilitzats.push(plat.id);
        }
      });
    });
    
    return platsUtilitzats;
  }
}

// Exportar una instància única del servei
export const serveiPlats = new ServeiPlats();


