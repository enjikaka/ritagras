import dotenv from 'dotenv';
import ArtdatabankenAPI from './artdatabanken.mjs';
import { getGBIFIDFromQuery } from './gbif.mjs';
import { landscapeTypes, status, capitalize } from './text-generator.mjs';
import fs from 'fs';

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  throw new Error('Could not read .env file.');
}

const artdatabankenApi = new ArtdatabankenAPI(process.env.ARTDATABANKEN_API_KEY);

async function init() {
  const scientificName = process.env.SCIENTIFIC_NAME || process.argv.slice(2, 4).join(' ');

  if (!scientificName) {
    throw new ReferenceError('You need to pass a scientific name via SCIENTIFIC_NAME env or as first argument in CLI.');
  }

  console.log(`Genererar markdown-fil för växt ${scientificName}`);

  const artdatabankenFetch = artdatabankenApi.speciesInformation(scientificName);
  const gbifFetch = getGBIFIDFromQuery(scientificName);

  let artdatabankenResult = await artdatabankenFetch;
  let gbifKey = await gbifFetch;

  const mdContent = `---
title: "${capitalize(artdatabankenResult.swedishName)}"
subtitle: "${artdatabankenResult.scientificName}"
gbif: ${gbifKey}
---

${status(artdatabankenResult)}

${artdatabankenResult.speciesData.speciesFactText.characteristic}

## Växtplats

${landscapeTypes(artdatabankenResult)}`;

  const filePath = `./content/${artdatabankenResult.scientificName.toLowerCase().replace(' ', '-')}.md`;

  fs.writeFile(filePath, mdContent, console.error);
}

(async () => {
  try {
    await init();
  } catch (error) {
    console.error(error);
  }
})();