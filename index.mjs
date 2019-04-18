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
  const scientificName = 'Achillea millefolium';
  const artdatabankenFetch = artdatabankenApi.speciesInformation(scientificName);
  const gbifFetch = getGBIFIDFromQuery(scientificName);

  const artdatabankenResult = await artdatabankenFetch;
  const gbifKey = await gbifFetch;

  const mdContent = `
---
title: "${capitalize(artdatabankenResult.swedishName)}"
subtitle: "${artdatabankenResult.scientificName}"
gbif: ${gbifKey}
---

${status(artdatabankenResult)}

## Växtplats

${landscapeTypes(artdatabankenResult)}
  `;

  const filePath = `./content/${artdatabankenResult.scientificName.toLowerCase().replace(' ', '-')}.md`;

  fs.writeFile(filePath, mdContent, console.error);
}

init();