// TODO importa því sem nota þarf
import { fetchNews } from './lib/news.js';
import { fetchAndRenderCategory, createCategoryBackLink } from './lib/ui.js';

/** Fjöldi frétta til að birta á forsíðu */
const CATEGORY_ITEMS_ON_FRONTPAGE = 5;

/** Vísun í <main> sem geymir allt efnið og við búum til element inn í */
const main = document.querySelector('main');
/**
 * Athugar útfrá url (`window.location`) hvað skal birta:
 * - `/` birtir yfirlit
 * - `/?category=X` birtir yfirlit fyrir flokk `X`
 */
let result;
async function route() {
  // Athugum hvort það sé verið að biðja um category í URL, t.d.
  // /?category=menning
  let location = window.location.search;

  if (location !== '') {

    location = window.location.search.substr(10,window.location.search.length);
    
    result = await fetchNews(location);
    await fetchAndRenderCategory(result.id, main, result.url);

    createCategoryBackLink(main.children, 1);

  }

  // Annars birtum við „forsíðu“
  else {

    main.className = 'newsList__list';
    
    result = await fetchNews();
    const results = [];

    for (const object of result) {
      results.push(fetchAndRenderCategory(
      object.id, main, object.url, CATEGORY_ITEMS_ON_FRONTPAGE
      ))
    }
    
    await Promise.all(results);

    createCategoryBackLink(main.children, results.length);
    
      /*
      const remove = await currentObject;
      if (remove === null) {
        document.getElementById(object.id).remove();
      }
      */
  }

  // Ef svo er, birtum fréttir fyrir þann flokk
  // Annars birtum við „forsíðu“
}

/**
 * Sér um að taka við `popstate` atburð sem gerist þegar ýtt er á back takka í
 * vafra. Sjáum þá um að birta réttan skjá.
 */
window.onpopstate = () => {
  // TODO útfæra
  window.history.go({id: null});
};

// Í fyrsta skipti sem vefur er opnaður birtum við það sem beðið er um út frá URL
route();
