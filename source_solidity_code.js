const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = 'ZB2TTGYQ56WW7ZE5TRDD48868SQXAQSTZC';
const CONTRACT_ADDRESS = '0x388C818CA8B9251b393131C08a736A67ccB19297';
const URL = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${CONTRACT_ADDRESS}&apikey=${API_KEY}`;

axios.get(URL)
  .then(response => {
    // console.log(response.data);
    const jsonContent = response.data.result[0].SourceCode;
    // console.log(jsonContent);
    const correctedJson = jsonContent.replace(/^{{/, '{').replace(/}}$/, '}');

    let parsedContent = JSON.parse(correctedJson);
    

    // 遍历'sources'对象
    for (let filePath in parsedContent.sources) {
        // 获取合约内容
        let fileContent = parsedContent.sources[filePath].content;
        // 处理文件路径，确保目录存在
        let fullFilePath = path.join(__dirname, filePath);
        let directory = path.dirname(fullFilePath);
        if (!fs.existsSync(directory)){
            fs.mkdirSync(directory, { recursive: true });
        }
        // 将合约内容写入对应的.sol文件
        fs.writeFileSync(fullFilePath, fileContent, 'utf8');
        console.log(`File saved: ${filePath}`);
    }




  });
