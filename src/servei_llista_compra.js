/**
 * Servei per a la generació i gestió de la llista de compra
 * 
 * Aquest servei s'encarrega de generar la llista de compra a partir del menú setmanal,
 * agrupar els ingredients per categories i gestionar l'estat de compra dels items.
 */

import { serveiPlats } from './servei_plats';

class ServeiLlistaCompra {
  constructor() {
    this.llistaCompra = null;
    this.itemsComprats = new Set();
  }

  /**
   * Genera la llista de compra a partir del menú actual
   * @returns {Object} - Llista de compra agrupada per categories
   */
  generarLlistaCompra() {
    // Utilitzar el servei de plats per generar la llista
    this.llistaCompra = serveiPlats.generarLlistaCompra();
    
    // Carregar l'estat dels items comprats
    this.carregarItemsComprats();
    
    return this.llistaCompra;
  }

  /**
   * Marca un ingredient com a comprat o no comprat
   * @param {string} categoria - Categoria de l'ingredient
   * @param {number} index - Índex de l'ingredient dins la categoria
   * @param {boolean} comprat - Estat de compra
   */
  marcarItem(categoria, index, comprat) {
    if (!this.llistaCompra || !this.llistaCompra[categoria]) return;
    
    const item = this.llistaCompra[categoria][index];
    if (!item) return;
    
    const itemId = `${categoria}-${index}-${item.nom}`;
    
    if (comprat) {
      this.itemsComprats.add(itemId);
    } else {
      this.itemsComprats.delete(itemId);
    }
    
    // Guardar l'estat al localStorage
    this.guardarItemsComprats();
  }

  /**
   * Comprova si un ingredient està marcat com a comprat
   * @param {string} categoria - Categoria de l'ingredient
   * @param {number} index - Índex de l'ingredient dins la categoria
   * @returns {boolean} - Si l'ingredient està comprat
   */
  esItemComprat(categoria, index) {
    if (!this.llistaCompra || !this.llistaCompra[categoria]) return false;
    
    const item = this.llistaCompra[categoria][index];
    if (!item) return false;
    
    const itemId = `${categoria}-${index}-${item.nom}`;
    return this.itemsComprats.has(itemId);
  }

  /**
   * Guarda l'estat dels items comprats al localStorage
   */
  guardarItemsComprats() {
    localStorage.setItem('itemsComprats', JSON.stringify(Array.from(this.itemsComprats)));
  }

  /**
   * Carrega l'estat dels items comprats des del localStorage
   */
  carregarItemsComprats() {
    const itemsGuardats = localStorage.getItem('itemsComprats');
    if (itemsGuardats) {
      this.itemsComprats = new Set(JSON.parse(itemsGuardats));
    }
  }

  /**
   * Reinicia la llista d'items comprats
   */
  reiniciarItemsComprats() {
    this.itemsComprats.clear();
    this.guardarItemsComprats();
  }

  /**
   * Genera un text formatat de la llista de compra per imprimir o compartir
   * @returns {string} - Text formatat de la llista de compra
   */
  generarTextLlistaCompra() {
    if (!this.llistaCompra) return '';
    
    let text = '🛒 LLISTA DE LA COMPRA 🛒\n\n';
    
    Object.entries(this.llistaCompra).forEach(([categoria, items]) => {
      if (items.length === 0) return;
      
      text += `== ${categoria.toUpperCase()} ==\n`;
      
      items.forEach(item => {
        let linia = `- ${item.nom}`;
        
        if (item.quantitat && item.unitat) {
          linia += ` (${item.quantitat} ${item.unitat})`;
        } else if (item.comptador > 1) {
          linia += ` (${item.comptador} plats)`;
        }
        
        text += linia + '\n';
      });
      
      text += '\n';
    });
    
    return text;
  }

  /**
   * Comparteix la llista de compra
   * @returns {Promise} - Promesa que es resol quan s'ha compartit la llista
   */
  async compartirLlistaCompra() {
    const text = this.generarTextLlistaCompra();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Llista de la compra',
          text: text
        });
        return true;
      } catch (error) {
        console.error('Error en compartir:', error);
        return false;
      }
    } else {
      // Fallback si l'API Share no està disponible
      try {
        await navigator.clipboard.writeText(text);
        alert('Llista de compra copiada al portapapers!');
        return true;
      } catch (error) {
        console.error('Error en copiar al portapapers:', error);
        return false;
      }
    }
  }
}

// Exportar una instància única del servei
export const serveiLlistaCompra = new ServeiLlistaCompra();
