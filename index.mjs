import dotenv from 'dotenv';
import ArtdatabankenAPI from './artdatabanken.mjs';
import { getGBIFIDFromQuery } from './gbif.mjs';
import { landscapeTypes, status, capitalize } from './text-generator.mjs';

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  throw new Error('Could not read .env file.');
}

const { parsed: config } = dotenvResult;

const artdatabankenApi = new ArtdatabankenAPI(config['ARTDATABANKEN_API_KEY']);

async function init() {
  const scientificName = 'Achillea millefolium';
  const artdatabankenFetch = artdatabankenApi.speciesInformation(scientificName);
  const gbifFetch = getGBIFIDFromQuery(scientificName);

  const artdatabankenResult = await artdatabankenFetch;
  const gbifKey = await gbifFetch;

  console.log(`
---
title: "${capitalize(artdatabankenResult.swedishName)}"
subtitle: "${artdatabankenResult.scientificName}"
gbif: ${gbifKey}
---

${status(artdatabankenResult)}

## Växtplats

${landscapeTypes(artdatabankenResult)}
  `);
}

init();