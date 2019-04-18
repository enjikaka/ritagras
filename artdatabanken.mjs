import fetch from 'node-fetch';

const speciesDataEndpoint = 'https://api.artdatabanken.se/information/v1/speciesdataservice/v1/speciesdata';

export default class ArtdatabankenAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async get (url) {
    const response = await fetch(url, {
      headers: {
        'Ocp-Apim-Subscription-Key': this.apiKey
      }
    });

    const json = await response.json();

    return json;
  }

  async latinNameToTaxonId(latinName) {
    const url = new URL(speciesDataEndpoint + '/search');

    url.searchParams.append('searchString', latinName);

    const json = await this.get(url);

    return json[0].taxonId;
  }

  async speciesInformation(latinName) {
    const taxonId = await this.latinNameToTaxonId(latinName);
    const url = new URL(speciesDataEndpoint);

    url.searchParams.append('taxa', taxonId);

    const json = await this.get(url);

    return json[0];
  }
}