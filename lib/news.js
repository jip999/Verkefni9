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

/**
 * Sækir fréttir frá vefþjónustu. Geymir í in-memory cache gögn eftir `id`.
 * @param {string} [id=''] ID á fréttaflokk til að sækja, sjálgefið tómi (grunn) flokkurinn
 * @returns {Promise<Array<object> | null>} Promise sem verður uppfyllt með fylki af fréttum.
 *           Skilar `null` ef villa kom upp við að sækja gögn.
 */

export async function fetchNews(id = '') {
  // TODO útfæra
  async function fetchData(curLink) {
    /*
    let object = null;;

    if (cache.length !== 0){
      console.log(cache);
      for (let i = 0; i < cache.length; i += 1)
      {
        if (cache.key(i) === id) {
          object = JSON.parse(cache.getItem(cache.key(i)));
        }
      }
    }

    if (object !== null){
      return object;
    }
    */
    try {
      const result = await fetch(curLink);

      if (!result.ok)
        throw new Error('result not ok');
      
      return result;
    }
    catch (e) {
      console.warn('unable to fetch', e);
      return fetchData(curLink);
    }
  }
  // -----------------------------------------------------
  const result = await fetchData(NEWS_API);

  if (id === '')
  {
    return result.json();
    /*
    try {
      const temp = await result.json();
      console.log(temp + "bruh");
      return temp;
    }
    catch (e) {
      console.log(result);
      return result;
    }
    */
  }
  const newsCategory = await result.json();
  /*
  let newsCategory;
  try {
    newsCategory = await result.json();
  }
  catch (e) {
    console.log(result);
    return result;
  }
  */

  for (const current of newsCategory) {
    if (current.id === id) {
      return current;
      /*
      console.log(cache.key(id));

      if (cache.key(id) !== id){
        const temp = current;
        const key = temp.id;
        const value = JSON.stringify(temp);
        cache.setItem(key, value);

        console.log("bruh");
        return current;
      }
      */
    }
  }

  return null;
}

/*
  let result = null;
  while (result === null) {
    try {
      result = await fetch(NEWS_API);

      if (!result.ok)
        throw new Error('result not ok');
    }
    catch (e) {
      console.warn('unable to fetch', e);
      result = null;
    }
  }
  */