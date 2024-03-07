const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = 'Your_Etherscan_API';
const CONTRACT_ADDRESS = 'The_Contract_Address';
const URL = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${CONTRACT_ADDRESS}&apikey=${API_KEY}`;

axios.get(URL)
  .then(response => {
    // console.log(response.data);
    const jsonContent = response.data.result[0].SourceCode;
    // console.log(jsonContent);
    const correctedJson = jsonContent.replace(/^{{/, '{').replace(/}}$/, '}');
    let parsedContent = JSON.parse(correctedJson);
    
    // Traverse the 'sources' object
    for (let filePath in parsedContent.sources) {
        // Get the contract content
        let fileContent = parsedContent.sources[filePath].content;
        // check the file path and make sure the directory exist
        let fullFilePath = path.join(__dirname, filePath);
        let directory = path.dirname(fullFilePath);
        if (!fs.existsSync(directory)){
            fs.mkdirSync(directory, { recursive: true });
        }
        // write the contract to .sol file
        fs.writeFileSync(fullFilePath, fileContent, 'utf8');
        console.log(`File saved: ${filePath}`);
    }
  });
