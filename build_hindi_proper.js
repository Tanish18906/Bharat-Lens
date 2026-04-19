import fs from 'fs';
import { SCHEMES } from './src/data/schemes.js';

try {
  const rawData = fs.readFileSync('bharat_lens_hindi.json', 'utf-8');
  const chunks = JSON.parse(rawData);

  // Group chunks by scheme_name
  const schemeMap = {};
  for (const chunk of chunks) {
    const name = chunk.metadata.scheme_name;
    if (!schemeMap[name]) {
      schemeMap[name] = {
        name,
        category: chunk.metadata.category,
        region: chunk.metadata.region,
        description: "",
        eligibility: "",
        benefit: "",
        applicationProcess: "",
        documents: [],
      };
    }
    
    const text = chunk.text;
    
    if (text.includes("विवरण:")) {
      const descMatch = text.match(/विवरण:\s*(.*?)(लाभ:|$)/);
      if (descMatch) schemeMap[name].description = descMatch[1].replace(/।$/, '').trim();
      const benMatch = text.match(/लाभ:\s*(.*)/);
      if (benMatch) schemeMap[name].benefit = benMatch[1].replace(/।$/, '').trim();
    }
    if (text.includes("पात्रता:")) {
      const elMatch = text.match(/पात्रता:\s*(.*?)(आवश्यक दस्तावेज:|$)/);
      if (elMatch) schemeMap[name].eligibility = elMatch[1].trim().replace(/-\s/g, '\n- ').trim();
      const docMatch = text.match(/आवश्यक दस्तावेज:\s*(.*)/);
      if (docMatch) {
         const docsText = docMatch[1];
         const docsArray = docsText.split('-').map(d => d.trim()).filter(d => d.length > 0);
         schemeMap[name].documents = docsArray;
      }
    }
    if (text.includes("आवेदन प्रक्रिया:")) {
      const apMatch = text.match(/आवेदन प्रक्रिया:\s*(.*?)(आधिकारिक स्रोत:|$)/);
      if (apMatch) schemeMap[name].applicationProcess = apMatch[1].trim().replace(/(चरण \d+:)/g, '\n$1').trim();
    }
  }

  const hindiKeys = Object.keys(schemeMap);

  const hindiSchemes = SCHEMES.map((enScheme, index) => {
    // Try to match by index if names don't perfectly align, 
    // because chunks were created sequentially.
    const hiData = schemeMap[hindiKeys[index]];

    if (hiData) {
      return {
        id: enScheme.id,
        name: hiData.name,
        region: hiData.region || enScheme.region,
        category: hiData.category || enScheme.category,
        description: hiData.description || enScheme.description,
        eligibility: hiData.eligibility || enScheme.eligibility,
        benefit: hiData.benefit || enScheme.benefit,
        applicationProcess: hiData.applicationProcess || enScheme.applicationProcess,
        documents: hiData.documents.length > 0 ? hiData.documents : enScheme.documents,
        officialUrl: enScheme.officialUrl,
        helpdesk: enScheme.helpdesk,
        tags: enScheme.tags
      };
    } else {
      return enScheme;
    }
  });

  const output = `export const SCHEMES_HI = ${JSON.stringify(hindiSchemes, null, 2)};`;
  fs.writeFileSync('./src/data/schemes_hi.js', output, 'utf-8');
  console.log('Successfully generated src/data/schemes_hi.js with ' + hindiSchemes.length + ' schemes.');

} catch (error) {
  console.error('Error:', error);
}
