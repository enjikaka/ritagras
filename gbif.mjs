import fetch from 'node-fetch';

export async function getGBIFIDFromQuery(q) {
  const urlEncodedQuery = encodeURIComponent(q);
  const response = await fetch('https://api.gbif.org/v1/species/suggest?q=' + urlEncodedQuery);
  const json = await response.json();

  const results = json.
    filter(item => item.rank === 'SPECIES').
    filter(item => !item.synonym).
    sort((a, b) => {
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
