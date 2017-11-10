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
const createApp = require('./_create');
const addEntities = require('./_entities');
const addIntents = require('./_intents');
const upload = require('./_upload');

// Change these values
const LUIS_programmaticKey = "YOUR_PROGRAMMATIC_KEY";
const LUIS_appName = "Sample App";
const LUIS_appCulture = "en-us"; 
const LUIS_versionId = "0.1";

// Source CSV
const downloadFile = "./IoT.csv";
// Parsed JSON
const uploadFile = "./utterances.json"

// The app ID is returned from LUIS when your app is created
var LUIS_appId = ""; // default app ID
var intents = [];
var entities = [];


/* add utterances parameters */
var configAddUtterances = {
    LUIS_subscriptionKey: LUIS_programmaticKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    inFile: path.join(__dirname, uploadFile),
    batchSize: 100,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples"
};

/* create app parameters */
var configCreateApp = {
    LUIS_subscriptionKey: LUIS_programmaticKey,
    LUIS_versionId: LUIS_versionId,
    appName: LUIS_appName,
    culture: LUIS_appCulture,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/"
};

/* add intents parameters */
var configAddIntents = {
    LUIS_subscriptionKey: LUIS_programmaticKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    intentList: intents,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/intents"
};

/* add entities parameters */
var configAddEntities = {
    LUIS_subscriptionKey: LUIS_programmaticKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    entityList: intents,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/entities"
};

/* input and output files for parsing CSV */
var configParse = {
    inFile: path.join(__dirname, downloadFile),
    outFile: path.join(__dirname, uploadFile)
};

// Parse CSV
parse(configParse)
    .then((model) => {
        // Save intent and entity names from parse
        intents = model.intents;
        entities = model.entities;
        // Create the LUIS app
        return createApp(configCreateApp);

    }).then((appId) => {
        // Add intents
        LUIS_appId = appId;
        configAddIntents.LUIS_appId = appId;
        configAddIntents.intentList = intents;
        return addIntents(configAddIntents);

    }).then(() => {
        // Add entities
        configAddEntities.LUIS_appId = LUIS_appId;
        configAddEntities.entityList = entities;
        return addEntities(configAddEntities);

    }).then(() => {
        // Add example utterances to the intents in the app
        configAddUtterances.LUIS_appId = LUIS_appId;
        return upload(configAddUtterances);

    }).catch(err => {
        console.log(err.message);
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
// node 7.x
// uses async/await - promises

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
            let appId = results.response;  
            console.log(`Called createApp, created app with ID ${appId}`);
            return appId;

    
        } catch (err) {
            console.log(`Error creating app:  ${err.message} `);
            throw err;
        }
    
    }

// Send JSON as the body of the POST request to the API
var callCreateApp = async (options) => {
    try {

        var response; 
        if (options.method === 'POST') {
            response = await rp.post(options);
        } else if (options.method === 'GET') { // TODO: There's no GET for create app
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
var request = require('requestretry');

// time delay between requests
const delayMS = 1000;

// retry recount
const maxRetry = 5;

// retry request if error or 429 received
var retryStrategy = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retrying add intent...");
    return shouldRetry;
}

// Call add-intents
var addIntents = async (config) => {
    var intentPromises = [];
    config.uri = config.uri.replace("{appId}", config.LUIS_appId).replace("{versionId}", config.LUIS_versionId);

    config.intentList.forEach(function (intent) {
        config.intentName = intent;
        try {

            // JSON for the request body
            var jsonBody = {
                "name": config.intentName,
            };

            // Create an intent
            var addIntentPromise = callAddIntent({
                // uri: config.uri,
                url: config.uri,
                fullResponse: false,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: jsonBody,
                maxAttempts: maxRetry,
                retryDelay: delayMS,
                retryStrategy: retryStrategy
            });
            intentPromises.push(addIntentPromise);

            console.log(`Called addIntents for intent named ${intent}.`);

        } catch (err) {
            console.log(`Error in addIntents:  ${err.message} `);

        }
    }, this);

    let results = await Promise.all(intentPromises);
    console.log(`Results of all promises = ${JSON.stringify(results)}`);
    let response = results;


}

// Send JSON as the body of the POST request to the API
var callAddIntent = async (options) => {
    try {

        var response;        
        response = await request(options);
        return { response: response };

    } catch (err) {
        console.log(`Error in callAddIntent:  ${err.message} `);
    }
}

module.exports = addIntents;
```
## Add entities
The following code adds the entities to the LUIS app. Copy or download it, and save it into `_entities.js`.

```javascript
// node 7.x
// uses async/await - promises

const request = require("requestretry");
var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');

// time delay between requests
const delayMS = 1000;

// retry recount
const maxRetry = 5;

// retry request if error or 429 received
var retryStrategy = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retrying add entity...");
    return shouldRetry;
}

// main function to call
// Call add-entities
var addEntities = async (config) => {
    var entityPromises = [];
    config.uri = config.uri.replace("{appId}", config.LUIS_appId).replace("{versionId}", config.LUIS_versionId);

    config.entityList.forEach(function (entity) {
        try {
            config.entityName = entity;
            // JSON for the request body
            // { "name": MyEntityName}
            var jsonBody = {
                "name": config.entityName,
            };

            // Create an app
            var addEntityPromise = callAddEntity({
                url: config.uri,
                fullResponse: false,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: jsonBody,
                maxAttempts: maxRetry,
                retryDelay: delayMS,
                retryStrategy: retryStrategy
            });
            entityPromises.push(addEntityPromise);

            console.log(`called addEntity for entity named ${entity}.`);

        } catch (err) {
            console.log(`Error in addEntities:  ${err.message} `);
            //throw err;
        }
    }, this);
    let results = await Promise.all(entityPromises);
    console.log(`Results of all promises = ${JSON.stringify(results)}`);
    let response = results;// await fse.writeJson(createResults.json, results);


}

// Send JSON as the body of the POST request to the API
var callAddEntity = async (options) => {
    try {

        var response;        
        response = await request(options);
        return { response: response };

    } catch (err) {
        console.log(`error in callAddEntity: ${err.message}`);
    }
}

module.exports = addEntities;
```
## Add utterances
Once the entities and intents have been defined in the LUIS app, you can add the utterances. The following code uses the [Utterances_AddBatch](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) API which allows you to add up to 100 utterances at a time.  Copy or download it, and save it into `_utterances.js`.

```javascript
// node 7.x
// uses async/await - promises

var rp = require('request-promise');
var fse = require('fs-extra');
var path = require('path');
var request = require('requestretry');

// time delay between requests
const delayMS = 500;

// retry recount
const maxRetry = 5;

// retry request if error or 429 received
var retryStrategy = function (err, response, body) {
    let shouldRetry = err || (response.statusCode === 429);
    if (shouldRetry) console.log("retrying add examples...");
    return shouldRetry;
}

// main function to call
var upload = async (config) => {

    try{
      
        // read in utterances
        var entireBatch = await fse.readJson(config.inFile);

        // break items into pages to fit max batch size
        var pages = getPagesForBatch(entireBatch.utterances, config.batchSize);

        var uploadPromises = [];

        // load up promise array
        pages.forEach(page => {
            config.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", config.LUIS_appId).replace("{versionId}", config.LUIS_versionId)
            var pagePromise = sendBatchToApi({
                url: config.uri,
                fullResponse: false,
                method: 'POST',
                headers: {
                    'Ocp-Apim-Subscription-Key': config.LUIS_subscriptionKey
                },
                json: true,
                body: page,
                maxAttempts: maxRetry,
                retryDelay: delayMS,
                retryStrategy: retryStrategy
            });

            uploadPromises.push(pagePromise);
        })

        //execute promise array
        
        let results =  await Promise.all(uploadPromises)
        console.log(`\n\nResults of all promises = ${JSON.stringify(results)}`);
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

        var response = await request(options);
        //return {page: options.body, response:response};
        return {response:response};
    }catch(err){
        throw err;
    }   
}   

module.exports = upload;
```


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
// CHANGE THESE VALUES
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

![TurnOn intent](./media/luis-tutorial-node-import-utterances-csv/imported-utterances.png) 

## Next steps

* You can work with your app in LUIS.ai.

## Additional resources

This sample applications use the following LUIS APIs:
- [create app](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36)
- [add intents](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0c)
- [add entities](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0e) 
- [add utterances](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) 



