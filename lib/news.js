/** Slóð á frétta vefþjónustu */
const NEWS_API = 'https://vef2-2021-ruv-rss-json-proxy.herokuapp.com/';


/**
 * Hlutur sem heldur utan um in-memory „cache“ af gögnum í minni á client (í vafra).
 * Nýtir það að þegar forrit er keyrt mun `fetchNews` fallið *alltaf* keyra þar sem `cache` er í
 * scope, og það verður alltaf sami hluturinn. Við getum því bætt við niðurstöðum í hlutinn með
 * vel þekktum „lykli“ (cache key), við næstu köll getum við athugað hvort hlutur innihaldi þennan
 * lykil og skilað þá þeirri niðurstöðu í stað þess að gera sama kall aftur.
 */

// const cache = window.localStorage;
const cacheData = [];
/**
 * Sækir fréttir frá vefþjónustu. Geymir í in-memory cache gögn eftir `id`.
 * @param {string} [id=''] ID á fréttaflokk til að sækja, sjálgefið tómi (grunn) flokkurinn
 * @returns {Promise<Array<object> | null>} Promise sem verður uppfyllt með fylki af fréttum.
 *           Skilar `null` ef villa kom upp við að sækja gögn.
 */

export async function fetchNews(id = '') {

  
  cacheData.push(JSON.parse(localStorage.getItem(localStorage.key(0))));
  

  async function fetchData(curLink) {

    if (cacheData[0] && cacheData[0].length === 5) {
      console.log(cacheData[0]);
      console.log(localStorage);
      return cacheData[0];
    }
    
    try {
      const result = await fetch(curLink);

      if (!result.ok)
        throw new Error('result not ok');
      
      return result;
    }
    catch (e) {
      // console.warn('unable to fetch', e);
      return fetchData(curLink);
    }
  }
  // -----------------------------------------------------
  const result = await fetchData(NEWS_API);


  if (id === '')
  {
    try {

      const newData = await result.json();

      const newDataNotJSON = JSON.stringify(newData);
      localStorage.setItem('cache', newDataNotJSON);
      return newData;
    }
    catch (e) {
      return result;
    }
  }

  let newsCategory;

  try {
    newsCategory = await result.json();
  }
  catch (e) {
    newsCategory = result;
  }

  for (const current of newsCategory) {
    if (current.id === id) {
      return current;

    }
  }

  return null;
}
