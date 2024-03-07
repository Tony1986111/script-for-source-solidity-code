const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = 'ZB2TTGYQ56WW7ZE5TRDD48868SQXAQSTZC';
const CONTRACT_ADDRESS = '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D';
const URL = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${CONTRACT_ADDRESS}&apikey=${API_KEY}`;

axios.get(URL)
  .then(response => {
    // fetch contract name
    const contractName = response.data.result[0].ContractName;

    const jsonContent = response.data.result[0].SourceCode;

    // check if the contract has just one .sol file only or multiple.
    if (jsonContent.startsWith('{{') && jsonContent.endsWith('}}')) {
        const correctedJson = jsonContent.substring(1, jsonContent.length - 1);
        const parsedContent = JSON.parse(correctedJson);

        for (let filePath in parsedContent.sources) {
           
            let fileContent = parsedContent.sources[filePath].content;
            
            let fullFilePath = path.join(__dirname, contractName, filePath);
            let directory = path.dirname(fullFilePath);
            if (!fs.existsSync(directory)){
                fs.mkdirSync(directory, { recursive: true });
            }
            // write the contract to .sol file. 
            fs.writeFileSync(fullFilePath, fileContent, 'utf8');
            console.log(`File saved: ${fullFilePath}`);
        }
    } else {
        // name the file with the contract name
        const formattedSource = jsonContent.substring(1, jsonContent.length - 1); 
        const fileName = `${contractName}.sol`;
        const fullPath = path.join(__dirname, fileName);
        fs.writeFileSync(fullPath, formattedSource, 'utf8');
        console.log(`File saved: ${fullPath}`);
    }
  })
  .catch(error => {
    console.error('Error fetching contract source:', error);
  });
