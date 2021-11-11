// const cacheData = [];

// Útbýr virkni fyrir takka sem leiðir inn í grein
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

  for (let child = 0; child < newsItemLimit; child += 1){
    const linkButton = document.createElement('a');
    linkButton.classList = 'news__links news__link';
    container[child].appendChild(linkButton);

    if (newsItemLimit !== 1)
      handleCategoryClick(container[child]);
    else
      handleBackClick(container[child]);
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
  // cacheData.push();
  // cacheData.push(JSON.parse(localStorage.getItem(localStorage.key(1))));

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

    /*
    if (cacheData[0] !== null){
      console.log(cacheData[0]);
      for (let i = 0; i < cacheData[0].length; i += 1) {
        if (cacheData[0][i] === id){
          console.log(cacheData[0][i]);
          return cacheData[0][i];
        }
      }
    }
    */
      

    try {
      const result = await fetch(curLink);
      
      if (!result.ok)
        throw new Error('result not ok');

      return result.json();
    }
    catch (e) {
      return fetchData(curLink);
    }
  }

  const current = await fetchData(link);
  console.log(current);

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
    }

    // Villuskilaboð
    catch (e) {
      console.warn('Villa', e);
    }
  }
  
  // Skilaboð ef engar fréttir og hættum
  else {
    const nothing = document.createElement('p');
    nothing.innerText = 'Engar fréttir í þessu flokki';
    container.appendChild(nothing);
    return null;
  }

  // Bætum við titli
  const title = document.createElement('h2');
  title.className = 'news__title';

  if (id === 'allar') title.innerText = 'Allar fréttir';
  else if (id === 'innlent') title.innerText = 'Innlent';
  else if (id === 'erlent') title.innerText = 'Erlendar fréttir';
  else if (id === 'ithrottir') title.innerText = 'Íþróttir';
  else title.innerText = 'Menning';

  container.insertBefore(title, container.firstChild);
  // Höfum fréttir! Ítrum og bætum við <ul>
  return container;
}
