// Útbýr virkni fyrir takka sem leiðir inn í grein
const newData = [];

function handleCategoryClick(container) {
  const link = container.lastChild;
  // TODO útfæra
  link.innerText = 'Allar fréttir';
  link.href = `?category=${container.id}`;
}

// Útbýr virkni fyrir takka sem leiðir á forsíðu
function handleBackClick(container) {
  const link = container.lastChild;
  // TODO útfæra
  link.innerText = 'Til baka';
  link.href = './';
}

/**
 * Útbýr takka sem fer á forsíðu.
 * @param {HTMLElement} container Element sem á að birta fréttirnar í
 * @param {number} newsItemLimit Hámark frétta sem á að birta
 * @returns {HTMLElement} Element með takka sem fer á forsíðu
 */
export function createCategoryBackLink(container, newsItemLimit) {
  for (let child = 0; child < newsItemLimit; child += 1) {
    const linkButton = document.createElement('a');
    linkButton.classList = 'news__links news__link';
    container[child].appendChild(linkButton);

    if (newsItemLimit !== 1) handleCategoryClick(container[child]);
    else handleBackClick(container[child]);
  }
}

async function loadingInformation(id, container) {
  // Byrjum á að birta loading skilaboð
  const loading = document.createElement('p');
  const currentContainer = container;
  loading.innerText = 'Sæki gögn';
  loading.id = id;

  // Birtum þau beint á container
  currentContainer.classList = 'news';
  currentContainer.appendChild(loading);

  return loading;
}

// MAIN FUNCTIONIÐ------------------------------------------------------------------
/**
 * Sækir gögn fyrir flokk og birtir í DOM.
 * @param {string} id ID á category sem við erum að sækja
 * @param {HTMLElement} parent Element sem setja á flokkinn í
 * @param {HTMLELement | null} [link=null] Linkur sem á að setja eftir fréttum
 * @param {number} [limit=Infinity] Hámarks fjöldi frétta til að sýna
 */
export async function fetchAndRenderCategory(
  id,
  parent,
  link = null,
  limit = Infinity
) {
  const cacheData = [];

  const title = document.createElement('h2');
  title.className = 'news__title';

  if (id === 'allar') title.innerText = 'Allar fréttir';
  else if (id === 'innlent') title.innerText = 'Innlent';
  else if (id === 'erlent') title.innerText = 'Erlendar fréttir';
  else if (id === 'ithrottir') title.innerText = 'Íþróttir';
  else title.innerText = 'Menning';

  cacheData.push(JSON.parse(localStorage.getItem(localStorage.key('1'))));

  // Búum til <section> sem heldur utan um flokkinn
  const container = document.createElement('section');

  // Bætum við parent og þannig DOM, allar breytingar héðan í frá fara gegnum
  // container sem er tengt parent
  parent.appendChild(container);

  // Setjum inn loading skilaboð fyrir flokkinn
  const loading = await loadingInformation(id, container);
  container.id = id;

  // Sækjum gögn fyrir flokkinn og bíðum
  async function fetchData(curLink) {
    // Athugum hér hvort að objectin inn í category er til í cache
    try {
      if (cacheData[0] && cacheData[0].length === 5) {
        let idTitle;

        if (id === 'allar') idTitle = 'Allar fréttir';
        else if (id === 'innlent') idTitle = 'Innlent';
        else if (id === 'erlent') idTitle = 'Erlendar fréttir';
        else if (id === 'ithrottir') idTitle = 'Íþróttir';
        else idTitle = 'Menning';

        const fromCache = JSON.parse(
          localStorage.getItem(localStorage.key('1'))
        );

        for (let i = 0; i < fromCache.length; i += 1) {
          if (fromCache[i].title === idTitle) return fromCache[i];
        }
      }

      const result = await fetch(curLink);

      if (!result.ok) throw new Error('result not ok');

      const newResult = await result.json();

      if (cacheData[0] < 5) newData.push(newResult);

      // Bætum objectum inn í cacheið hér
      if (newData.length === 5) {
        const newDataNotJSON = JSON.stringify(newData);
        localStorage.setItem('1', newDataNotJSON);
      }
      return newResult;
    } catch (e) {
      console.warn('unable to fetch, retrying...', e);
      // Reyni aftur ef tókst ekki að ná í objects
      return fetchData(curLink);
    }
  }

  const current = await fetchData(link);

  // Fjarlægjum loading skilaboð
  container.removeChild(loading);

  // Ef það er linkur, bæta honum við
  if (current.items.length !== 0) {
    try {
      const divEl = document.createElement('div');
      divEl.className = 'news__links news__item';
      divEl.style.flexDirection = 'column';
      container.appendChild(divEl);

      for (let article = 0; article < limit; article += 1) {
        const aEl = document.createElement('a');
        aEl.href = current.items[article].link;
        aEl.innerText = current.items[article].title;

        divEl.appendChild(aEl);
      }
    } catch (e) {
      // Villuskilaboð
      console.warn('Villa', e);
    }
  }

  // Skilaboð ef engar fréttir og hættum
  else {
    const nothing = document.createElement('p');
    nothing.innerText = 'Engar fréttir í þessum flokki';
    container.appendChild(nothing);
    return null;
  }

  // Bætum við titli

  container.insertBefore(title, container.firstChild);
  // Höfum fréttir! Ítrum og bætum við <ul>
  return container;
}
