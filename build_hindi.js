import fs from 'fs';
import { SCHEMES } from './src/data/schemes.js';

try {
  const rawData = fs.readFileSync('bharat_lens_hindi.json', 'utf-8');
  
  // Use regex to locate each metadata block and text block, bypassing JSON parse errors
  const regex = /"metadata":\s*\{\s*"scheme_name":\s*"(.*?)"\s*,\s*"category":\s*"(.*?)"\s*,\s*"region":\s*"(.*?)"\s*\}.*?"text":\s*"(.*?)"/gs;
  
  const schemeMap = {};
  let match;
  
  while ((match = regex.exec(rawData)) !== null) {
    const [_, name, category, region, textRaw] = match;
    const text = textRaw.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    if (!schemeMap[name]) {
      schemeMap[name] = {
        name, category, region,
        description: "", eligibility: "", benefit: "", applicationProcess: "", documents: []
      };
    }
    
    // Extract using logic
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
         const docsArray = docMatch[1].split('-');
         schemeMap[name].documents = docsArray.map(d=>d.trim()).filter(d=>d.length > 0);
      }
    }
    if (text.includes("आवेदन प्रक्रिया:")) {
      const apMatch = text.match(/आवेदन प्रक्रिया:\s*(.*?)(आधिकारिक स्रोत:|$)/);
      if (apMatch) schemeMap[name].applicationProcess = apMatch[1].trim().replace(/(चरण \d+:)/g, '\n$1').trim();
    }
  }

  // Now align with English SCHEMES array to get IDs, tags, URLs
  const hindiSchemes = SCHEMES.map((enScheme, i) => {
    // English names might not perfectly match Hindi names, so we can try to guess by order or simple mapping.
    // The user's array was built mostly 1:1 with the english one.
    // Let's just grab the values from schemeMap. 
    // They are almost exactly parallel, so let's match by index since `bharat_lens_hindi.json` chunks were created sequentially.
    const keys = Object.keys(schemeMap);
    const hiMatch = schemeMap[keys[i]];

    if (hiMatch) {
      return {
        id: enScheme.id,
        name: hiMatch.name,
        region: hiMatch.region || "केंद्र",
        category: hiMatch.category || "कृषि",
        description: hiMatch.description || enScheme.description,
        eligibility: hiMatch.eligibility || "विस्तृत विवरण उपलब्ध नहीं।",
        benefit: hiMatch.benefit || enScheme.benefit,
        applicationProcess: hiMatch.applicationProcess || enScheme.applicationProcess,
        documents: hiMatch.documents.length > 0 ? hiMatch.documents : enScheme.documents,
        officialUrl: enScheme.officialUrl,
        helpdesk: enScheme.helpdesk,
        tags: enScheme.tags // Keep english tags for filtering or translate later
      };
    } else {
      // Fallback: If not found, use english with a tag
      return { ...enScheme, name: enScheme.name + ' (HINDI NOT FOUND)' };
    }
  });

  const output = `export const SCHEMES_HI = ${JSON.stringify(hindiSchemes, null, 2)};`;
  fs.writeFileSync('./src/data/schemes_hi.js', output, 'utf-8');
  console.log('Successfully generated src/data/schemes_hi.js with ' + hindiSchemes.length + ' schemes.');
} catch (error) {
  console.error('Error:', error);
}
