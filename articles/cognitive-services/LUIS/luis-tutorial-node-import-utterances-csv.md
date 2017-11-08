---
title: Import utterances from the CSV query log using Node.js | Microsoft Docs 
description: Learn how to import utterances from the query log that contains all the user utterances passed to your LUIS endpoint. 
services: cognitive-services
author: DeniseMak
manager: rstand

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 10/26/2017
ms.author: v-demak
---

# Build a LUIS app programmatically using Node.js

LUIS provides a programmatic API that does everything that the UI at [luis.ai](http://www.luis.ai) does. This can save time when you might have a lot of preexisting data and it'd be faster to programmatically create a LUIS app than entering information by hand. 

## Prerequisites

* Log in to www.luis.ai and find your Programmatic Key in Account Settings.  You use this key to call the Authoring API.
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* This tutorial starts with a CSV for a hypothetical company's log files of user requests. Download it [here](https://github.com/Microsoft/LUIS-Samples/tree/master/examples).
* Install the latest Node.js with NPM. Download it from [here](https://nodejs.org/en/download/).
* **[Recommended]** Visual Studio Code for IntelliSense and debugging, download it from [here](https://code.visualstudio.com/) for free.

## Map preexisting data to intents and entities
Even if you have a system that wasn't created with LUIS in mind, if it contains textual data that maps to different things users want to do, you might be able to come up a mapping from the existing categories of user input to intents in LUIS. If you can identify important words or phrases in what the users said, these might map to entities.

Open the `IoT.csv` file. It contains a log of user queries to a hypothetical home automation service, including how they were categorized, what the user said, and some columns with useful information pulled out of them. 

![CSV file](./media/luis-tutorial-node-import-utterances-csv/csv.png) 

You'll see that the **RequestType** column could be intents, the **Request** column shows an example utterance, and the other fields could be entities if they actually occur in the utterance. Because we have what intents, entities, and example utterances, we have what we need to create a sample app.

## Steps to generate a LUIS app from non-LUIS data
To generate a new LUIS app from the source file, first you parse the data from the CSV file and convert this data to a format that you can upload to LUIS using the Authoring API. From the parsed data, you gather information on what intents and entities are there. Then you make API calls to create the app, and add intents and entities that were gathered from the parsed data. Once you have created the LUIS app, you can add the example utterances from the parsed data. You can see this flow in the last part of the code below. Copy or [download](https://github.com/Microsoft/LUIS-Samples/tree/master/examples) this code and save it in `index.js`.

```javascript
var path = require('path');

const parse = require('./_parse');
const create = require('./_create');
const intents = require('./_intents');
const entities = require('./_entities');
const upload = require('./_utterances');

// CHANGE THESE VALUES
const LUIS_subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
const LUIS_appName = "Your App Name";
const LUIS_appCulture = "en-us";
const LUIS_versionId = "0.1";

// Source CSV
const sourceFile= "./IoT_sample.csv";
// Parsed JSON for the Authoring API
const outputFile = "./utterances.json"

var intents = [];
var entities = [];

// add utterances parameters 
var configAddUtterances = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    inFile: path.join(__dirname, uploadFile),
    batchSize: 100,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

// create app parameters 
var configCreateApp = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_versionId: LUIS_versionId,
    appName: LUIS_appName,
    culture: LUIS_appCulture,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/"
};

// add intents parameters 
var configAddIntents = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    intentList: intents,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

// parse parameters 
var configParse = {
    inFile: path.join(__dirname, downloadFile),
    outFile: path.join(__dirname, uploadFile)
}; 

// Parse the CSV to extract intents and entities first.
// Then create an app, add intents, entities, and add utterances 
parse(configParse)
.then((model) => {
    // After parsing the CSV, the model contains utterances labeled with intents and entities.
    intents = model.intents;
    entities = model.entities;

    // Create the LUIS app
    return createApp(configCreateApp);

}).then((appId) => {
    // Add intents
    return addIntents(configAddIntents);
    console.log("process done");

}).then((intentIdList) => {
    // Add entities
    return addEntities(configAddEntities);
    console.log("process done");

}).then((entityIdList) => {
    return upload(configAddUtterances);
    console.log("process done");
}).catch(err => {
    console.log(err);
});
```
## Parsing the CSV

The column entries that contain the utterances in the CSV have to be parsed into a JSON format that LUIS can understand. This JSON format must contain an `intentName` field that identifies the intent of the utterance. It must also contain an `entityLabels` field, which can be empty if there are no entities in the utterance. 

For example, the entry for "Turn on the lights" maps to this JSON:

```json
        {
            "text": "Turn on the lights",
            "intentName": "TurnOn",
            "entityLabels": [
                {
                    "entityName": "Operation",
                    "startCharIndex": 5,
                    "endCharIndex": 6
                },
                {
                    "entityName": "Device",
                    "startCharIndex": 12,
                    "endCharIndex": 17
                }
            ]
        }
```

In this example, the `intentName` comes from the user request under the **Request** column heading in the CSV file, and the `entityName` comes from the other columns with key information. For example, if there's an entry for **Operation** or **Device**, and that string also occurs in the actual request, then it can be labeled as an entity. The following code demonstrates this parsing process. You can copy or download it and save it to `_parse.js`.

```javascript
const fse = require('fs-extra');
const path = require('path');
const lineReader = require('line-reader');
const Promise = require('bluebird');
const babyparse = require("babyparse");
const csv = require('csvtojson');

const intent_column = 0;
const utterance_column = 1;
var entityNames = [];

var eachLine = Promise.promisify(lineReader.eachLine);

function listOfIntents(intents) {
    return intents.reduce(function (a, d) {
        if (a.indexOf(d.intentName) === -1) {
            a.push(d.intentName);
        }
        return a;
    }, []);

}
function listOfEntities(utterances) {
    return utterances.reduce(function (a, d) {
        
        d.entityLabels.forEach(function(entityLabel) {
            if (a.indexOf(entityLabel.entityName) === -1) {
                a.push(entityLabel.entityName);
            }     
        }, this);

        return a;
    }, []);

}

// Create the JSON for the text in a row
var utterance = function (rowAsString) {

    let json = {
        "text": "",
        "intentName": "",
        "entityLabels": [],
    };

    if (!rowAsString) return json;

    // csv to parser object
    let dataRow = babyparse.parse(rowAsString);

    // unwrap parser's first row
    json.intentName = dataRow.data[0][intent_column];
    json.text = dataRow.data[0][utterance_column];
    entityNames.forEach(function (entityName) {
        // if there's a string at this column, search for it in the utterance.
        entityToFind = dataRow.data[0][entityName.column];
        if (entityToFind != "") {
            strInd = json.text.indexOf(entityToFind);
            if (strInd > -1) {
                let entityLabel = {
                    "entityName": entityName.name,
                    "startCharIndex": strInd,
                    "endCharIndex": strInd + entityToFind.length -1

                }
                json.entityLabels.push(entityLabel);
            }
        }
    }, this);
    return json;
};

// main function for parsing the file
// reads the stream one line at a time
const convert = async (config) => {

    try {

        var i = 0;

        // get inFile stream
        inFileStream = await fse.createReadStream(config.inFile, 'utf-8')

        // create out file
        var myOutFile = await fse.createWriteStream(config.outFile, 'utf-8');
        var utterances = [];

        // read 1 line
        return eachLine(inFileStream, (line) => {

            // skip first line with headers
            if (i++ == 0) {
                // on the first line, [0]=Intent,[1]=text, [2]..[n]= entity fields
                // csv to baby parser object
                let dataRow = babyparse.parse(line);

                // populate entityType list
                var index = 0;
                dataRow.data[0].forEach(function (element) {
                    if ((index != intent_column) && (index != utterance_column)) {
                        entityNames.push({ name: element, column: index });
                    }
                    index++;
                }, this);

                return;
            }

            // transform utterance from csv to json
            utterances.push(utterance(line));

        }).then(() => {
            console.log("intents: " + JSON.stringify(listOfIntents(utterances)));
            console.log("entities: " + JSON.stringify(listOfEntities(utterances)));
            myOutFile.write(JSON.stringify({ "converted_date": new Date().toLocaleString(), "utterances": utterances }));
            myOutFile.end();
            console.log("parse done");

            var model = 
            {
                intents: listOfIntents(utterances),
                entities: listOfEntities(utterances)                
            }
            return model;
            //return config;
        });

    } catch (err) {
        throw err;
    }

}

module.exports = convert;
``` 
## Creating the app
Once the data has been parsed into JSON, we need a LUIS app to add it to. The following code creates the LUIS app. Copy or download it, and save it into `_create.js`.

```javascript
var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');


// main function to call
// Call Apps_Create
var createApp = async (config) => {
    
        try {
    
            // JSON for the request body
            // { "name": MyAppName, "culture": "en-us"}
            var jsonBody = { 
                "name": config.appName, 
                "culture": config.culture
            };
    
            // Create a LUIS app
            var createAppPromise = callCreateApp({
                uri: config.uri,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: jsonBody
            });
    
            let results = await createAppPromise;

            // Create app returns an app ID
            let response = results;
    
            console.log("Add utterance done");
    
        } catch (err) {
            console.log(`Error adding utterance:  ${err.message} `);
            //throw err;
        }
    
    }

// Send JSON as the body of the POST request to the API
var callCreateApp = async (options) => {
    try {

        var response; 
        if (options.method === 'POST') {
            response = await rp.post(options);
        } else if (options.method === 'GET') {
            response = await rp.get(options);
        }
        // response from successful create should be the new app ID
        return { response };

    } catch (err) {
        throw err;
    }
} 

module.exports = createApp;
```
## Add intents
Once you have an app, you need to intents to it. The following code creates the LUIS app. Copy or download it, and save it into `_intents.js`.

```javascript
var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');


// main function to call
// Call add-intents
var addIntents = async (config) => {
    var intentPromises = [];
    config.intentList.forEach(function (intent) {
        try {

            // JSON for the request body
            // { "name": MyIntentName}
            var jsonBody = {
                "name": config.intentName,
            };

            // Create an app
            var addIntentPromise = callAddIntent({
                uri: config.uri,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: jsonBody
            });
            intentPromises.push(addIntentPromise);

            console.log("Add utterance done");

        } catch (err) {
            console.log(`Error adding utterance:  ${err.message} `);
            //throw err;
        }
    }, this);
    let results = await Promise.all(intentPromises);
    let response = results;// await fse.writeJson(createResults.json, results);


}

// Send JSON as the body of the POST request to the API
var callAddIntent = async (options) => {
    try {

        var response;
        if (options.method === 'POST') {
            response = await rp.post(options);
        } else if (options.method === 'GET') {
            response = await rp.get(options);
        }
        // response from successful create should be the new app ID
        return { response };

    } catch (err) {
        throw err;
    }
}

module.exports = addIntents;
```
## Add entities
The following code adds the entities to the LUIS app. Copy or download it, and save it into `_entities.js`.

```javascript
var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');


// main function to call
// Call add-entities
var addEntities = async (config) => {
    var entityPromises = [];
    config.entityList.forEach(function (entity) {
        try {

            // JSON for the request body
            // { "name": MyEntityName}
            var jsonBody = {
                "name": config.entityName,
            };

            // Create an app
            var addEntityPromise = callAddEntity({
                uri: config.uri,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: jsonBody
            });
            entityPromises.push(addEntityPromise);

            console.log("Add utterance done");

        } catch (err) {
            console.log(`Error adding utterance:  ${err.message} `);
            //throw err;
        }
    }, this);
    let results = await Promise.all(entityPromises);
    let response = results;// await fse.writeJson(createResults.json, results);


}

// Send JSON as the body of the POST request to the API
var callAddEntity = async (options) => {
    try {

        var response;
        if (options.method === 'POST') {
            response = await rp.post(options);
        } else if (options.method === 'GET') {
            response = await rp.get(options);
        }
        // response from successful create should be the new app ID
        return { response };

    } catch (err) {
        throw err;
    }
}

module.exports = addEntities;
```
## Add utterances
Once the entities and intents have been defined in the LUIS app, you can add the utterances. The following code uses the [Utterances_AddBatch](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) API which allows you to add up to 100 utterances at a time.  Copy or download it, and save it into `_utterances.js`.

```javascript
var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');


// main function for adding utterances to the LUIS app
var upload = async (config) => {

    try{
      
        // read in utterances
        var entireBatch = await fse.readJson(config.inFile);

        // break items into pages to fit max batch size
        var pages = getPagesForBatch(entireBatch.utterances, config.batchSize);

        var uploadPromises = [];

        // load up promise array
        pages.forEach(page => {

            var pagePromise = sendBatchToApi({
                uri: config.uri,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: page
            });

            uploadPromises.push(pagePromise);
        })

        //execute promise array
        
        let results =  await Promise.all(uploadPromises)
        let response = await fse.writeJson(config.inFile.replace('.json','.upload.json'),results);

        console.log("upload done");

    } catch(err){
        throw err;        
    }

}
// turn whole batch into pages batch 
// because API can only deal with N items in batch
var getPagesForBatch = (batch, maxItems) => {

    try{
        var pages = []; 
        var currentPage = 0;

        var pageCount = (batch.length % maxItems == 0) ? Math.round(batch.length / maxItems) : Math.round((batch.length / maxItems) + 1);

        for (let i = 0;i<pageCount;i++){

            var currentStart = currentPage * maxItems;
            var currentEnd = currentStart + maxItems;
            var pagedBatch = batch.slice(currentStart,currentEnd);

            var j = 0;
            pagedBatch.forEach(item=>{
                item.ExampleId = j++;
            });

            pages.push(pagedBatch);

            currentPage++;
        }
        return pages;
    }catch(err){
        throw(err);
    }
}

// send json batch as post.body to API
var sendBatchToApi = async (options) => {
    try {

        var response =  await rp.post(options);
        return {page: options.body, response:response};

    }catch(err){
        throw err;
    }   
}   

module.exports = upload;
```
<!-- 
## Download sample code

The code for this tutorial is at [CSV Upload Sample](https://github.com/Microsoft/LUIS-Samples/tree/master/examples/create-app-programmatically/). Download the following files:

| Filename    | Description           |
|-------------|-----------------------|
| [index.js](https://github.com/Microsoft/LUIS-Samples/blob/master/examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog/index.js)  |  The sample's main file. It contains configuration settings and uploads the batch of utterances. Change the `sourceFile` value in the `index.js` file to the location and name of your query log file. |
| [_parse.js](https://github.com/Microsoft/LUIS-Samples/blob/master/examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog/_parse.js)  |  This file converts the utterances to the format expected by the [Utterances_AddBatch API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) |
| [_create.js](https://github.com/Microsoft/LUIS-Samples/blob/master/examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog/_upload.js)  |  This file contains methods for adding utterances using the [Batch Add Labels API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) |

-->

## Run the code


### Install Node.js dependencies
Install the Node.js dependencies from NPM in the terminal/command line.

````
> npm install
````

### Change Configuration Settings
In order to use this application, you need to change the values in the index.js file to your own subscription key, app ID, and version ID. 

Open the index.js file, and change these values at the top of the file.


````JavaScript
// TBD: CHANGE THESE VALUES
const LUIS_subscriptionKey = "YOUR_SUBSCRIPTION_KEY"; 
const LUIS_appId = "YOUR_APP_ID";
const LUIS_versionId = "0.1";
````
### Run the script
Run the script from a terminal/command line with Node.js.

````
> node index.js
````
or
````
> npm start
````

### Application progress
While the application is running, the command line shows progress.

````
> node index.js
intents: ["TurnAllOn","TurnAllOff","None","TurnOn","TurnOff"]
entities: ["Operation","Device"]
parse done
upload done
process done
````


<!-- 
````JavaScript
// malformed item - malformed JSON - no comma
// fix - add comma after every key:value pair
[
    {
        "text": "Hello"
        "intent": "Greetings"
    },
    {
        "text": "I want bread"
        "intent": "Request"
    }
]
```` 

````JavaScript
// malformed item - malformed JSON - extra comma at end of key:value pair
// while Node.js will ignore this, the LUIS API will not
// fix - remove extra comma
[
    {
        "text": "Hello",
        "intent": "Greetings",
    },
    {
        "text": "I want bread",
        "intent": "Request"
    }
]
````
-->

## Open the LUIS app in LUIS.ai
Once the script completes, you can log in to [luis.ai](https://www.luis.ai) and see the LUIS app you just created under **My Apps**. You should be able to see the utterances you added under the **TurnOn**, **TurnOff**, and **None** intents.

## Next steps

* You can work with your app in LUIS.ai.

## Additional resources

This sample applications use the following LUIS APIs:
- [create app](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36)
- [add intents](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0c)
- [add entities](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0e) 
- [add utterances](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) 



