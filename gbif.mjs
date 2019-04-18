import fetch from 'node-fetch';

export async function getGBIFIDFromQuery(q) {
  const urlEncodedQuery = encodeURIComponent(q);
  const response = await fetch('https://api.gbif.org/v1/species/suggest?q=' + urlEncodedQuery);
  const json = await response.json();

  const isSpecies = item => item.rank === 'SPECIES';
  const notSynonym = item => !item.synonym;

  const results = json
    .filter(isSpecies)
    .filter(notSynonym)
    .sort((a, b) => {
      if (a.status === 'ACCEPTED') {
        return -1;
      }

      if (b.status === 'ACCEPTED') {
        return 1;
      }

      return 0;
    });

  return results[0].key;
}
