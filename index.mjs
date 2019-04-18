import dotenv from 'dotenv';
import ArtdatabankenAPI from './artdatabanken.mjs';
import { landscapeTypes, status, capitalize } from './text-generator.mjs';

const dotenvResult = dotenv.config();

if (dotenvResult.error) {
  throw new Error('Could not read .env file.');
}

const { parsed: config } = dotenvResult;

const artdatabankenApi = new ArtdatabankenAPI(config['ARTDATABANKEN_API_KEY']);

async function init() {
  const result = await artdatabankenApi.speciesInformation('Achillea millefolium');

  console.log(`
  # ${capitalize(result.swedishName)}

  ${status(result)}

  ## Växtplats

  ${landscapeTypes(result)}
  `);
}

init();