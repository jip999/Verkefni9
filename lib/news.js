/** Slóð á frétta vefþjónustu */
const NEWS_API = 'https://vef2-2021-ruv-rss-json-proxy.herokuapp.com/';

const cacheData = [];

export async function fetchNews(id = '') {
  cacheData.push(JSON.parse(localStorage.getItem('cache')));

  async function fetchData(curLink) {
    // Athugum hér hvort að categories eru til í cachei, ef svo þá notum við það
    if (cacheData[0] && cacheData[0].length === 5) return cacheData[0];

    try {
      const result = await fetch(curLink);

      if (!result.ok) throw new Error('result not ok');

      return result;
    } catch (e) {
      console.warn('unable to fetch, retrying...', e);
      // Reyni aftur ef tókst ekki að ná í objects
      return fetchData(curLink);
    }
  }

  const result = await fetchData(NEWS_API);

  if (id === '') {
    try {
      const newData = await result.json();

      const newDataNotJSON = JSON.stringify(newData);
      localStorage.setItem('cache', newDataNotJSON);
      return newData;
    } catch (e) {
      return result;
    }
  }

  let newsCategory;

  try {
    newsCategory = await result.json();
  } catch (e) {
    newsCategory = result;
  }

  for (const current of newsCategory) {
    if (current.id === id) {
      return current;
    }
  }

  return null;
}
