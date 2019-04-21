
function randomItemFromArray(items) {
  return items[Math.floor(Math.random() * items.length)]
}

function joinArrayWithLanguageSeparator(array) {
  return array.slice(0, -1).join(', ') + ' och ' + array.slice(-1);
}

function parseLandscapeOrBiotopeName (landscapeType) {
  const lowerCaseName = landscapeType.name.toLowerCase();

  if (lowerCaseName.indexOf('(') !== -1) {
    return lowerCaseName.split(' (')[0];
  }

  return lowerCaseName;
}

/**
 *
 * @param {'NE'|'NA'|'DD'|'RE'|'EN'|'CR'|'NT'|'LC'|'VU'} category
 */
function redlistCategoryToString (category) {
  switch (category) {
    case 'NE':
      return 'ej bedömd';
    case 'NA':
      return 'ej tilllämplig';
    case 'DD':
      return 'kunskapsbrist';
    case 'DD':
      return 'nära hotad';
    case 'EN':
      return 'starkt hotad';
    case 'CR':
      return 'akut hotad';
    case 'RE':
      return 'nationellt utrotad';
    case 'VU':
      return 'sårbar';
      break;

    case 'LC':
    default:
      return 'livskraftig';
      break;
  }
}

/**
 * @param {string} s
 */
export function capitalize (s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getLandscapesWithStatus(taxa, status) {
  const names = taxa.speciesData.landscapeTypes
    .filter(type => type.status === status)
    .map(parseLandscapeOrBiotopeName);

  if (names.length === 0) {
    return undefined;
  }

  if (names.length > 1) {
    return joinArrayWithLanguageSeparator(names)
  }

  return names[0];
}

function getBiotiopesWithSignificance(taxa, significance) {
  const names = taxa.speciesData.biotopes
    .filter(type => type.significance === significance)
    .map(parseLandscapeOrBiotopeName);

  if (names.length === 0) {
    return undefined;
  }

  if (names.length > 1) {
    return joinArrayWithLanguageSeparator(names)
  }

  return names[0];
}

function generateUtnyttjadBiotop(taxa, utnyttjadBiotop) {
  if (!utnyttjadBiotop) {
    return null;
  }

  const variations = [
    'Förekommer även i {{utnyttjadBiotop}}.',
    '{{swedishName}} förekommer även i {{utnyttjadBiotop}}.',
  ];

  let text = randomItemFromArray(variations);

  text = text.replace(/{{swedishName}}/gi, taxa.swedishName);
  text = text.replace(/{{utnyttjadBiotop}}/gi, utnyttjadBiotop);

  return capitalize(text);
}

function generateViktigBiotop(taxa, viktigBiotop) {
  if (!viktigBiotop) {
    return null;
  }

  const variations = [
    'Viktigt inslag i {{viktigBiotop}}.',
    'I {{viktigBiotop}} är {{swedishName}} ett viktigt inslag.',
    '{{viktigBiotop}} är viktiga växtplatser.'
  ];

  let text = randomItemFromArray(variations);

  text = text.replace(/{{swedishName}}/gi, taxa.swedishName);
  text = text.replace(/{{viktigBiotop}}/gi, viktigBiotop);

  return capitalize(text);
}

function generateStorBetydelseLandscape(taxa, storBetydelse) {
  if (!storBetydelse) {
    return null;
  }

  const variations = [
    '{{swedishName}} förekommer i och har stor betydelse för utformingen av {{storBetydelse}}.',
    'Förekommer i och har stor betydelse för utformingen av {{storBetydelse}}.',
    'I {{storBetydelse}} har {{swedishName}} stor betydelse för att forma landskapet.'
  ];

  let text = randomItemFromArray(variations);

  text = text.replace(/{{swedishName}}/gi, taxa.swedishName);
  text = text.replace(/{{storBetydelse}}/gi, storBetydelse);

  return capitalize(text);
}

function generateHarBetydelseLandscape(taxa, harBetydelse) {
  if (!harBetydelse) {
    return null;
  }

  const variations = [
    '{{swedishName}} förekommer även i {{harBetydelse}}.',
    'Även i {{harBetydelse}} förekommer växten.',
    'I {{harBetydelse}} förekommer också växten.'
  ];

  let text = randomItemFromArray(variations);

  text = text.replace(/{{swedishName}}/gi, taxa.swedishName);
  text = text.replace(/{{harBetydelse}}/gi, harBetydelse);

  return capitalize(text);
}

export function landscapeTypes(taxa) {
  const storBetydelse = getLandscapesWithStatus(taxa, 'Stor betydelse');
  const harBetydelse = getLandscapesWithStatus(taxa, 'Har betydelse');

  const viktigBiotop = getBiotiopesWithSignificance(taxa, 'Viktig');
  const utnyttjadBiotop = getBiotiopesWithSignificance(taxa, 'Utnyttjas');

  const landscape = [generateStorBetydelseLandscape(taxa, storBetydelse), generateHarBetydelseLandscape(taxa, harBetydelse)];
  const biotop = [generateViktigBiotop(taxa, viktigBiotop), generateUtnyttjadBiotop(taxa, utnyttjadBiotop)];

  const text = [...landscape, ...biotop].filter(Boolean).join(' ');

  return text;
}

export function status(taxa) {
  const variations = [
    'I Sverige är {{swedishName}} {{swedishPresence}} och har status som {{redListStatus}}.',
    '{{swedishName}} är i Sverige {{swedishPresence}} och har status som {{redListStatus}}.',
    '{{swedishName}} har status som {{redListStatus}} och är {{swedishPresence}} i Sverige.'
  ];

  let text = randomItemFromArray(variations);

  console.log(JSON.stringify(taxa, null, 4));

  text = text.replace(/{{swedishName}}/gi, taxa.swedishName);
  text = text.replace(/{{swedishPresence}}/gi, taxa.speciesData.taxonRelatedInformation.swedishPresence.toLowerCase());
  text = text.replace(/{{redListStatus}}/gi, redlistCategoryToString(taxa.speciesData.redlistInfo[0].category));

  return capitalize(text);
}
