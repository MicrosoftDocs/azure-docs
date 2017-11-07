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

# Build an app programmatically

LUIS provides a programmatic API that does everything that the UI at [luis.ai](http://www.luis.ai) does. This can save time when you might have a lot of pre-existing data and it'd be simpler to programmatically create a LUIS app. 

## Prerequisites

* Log in to www.luis.ai and find your Programmatic Key in Account Settings.  You use this key to call the Authoring API.
* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
* This tutorial starts with a CSV for a hypothetical company's log files of user requests. Download it [here](https://nodejs.org/en/download/).
* Install the latest Node.js with NPM. Download it from [here](https://nodejs.org/en/download/).
* **[Recommended]** Visual Studio Code for IntelliSense and debugging, download it from [here](https://code.visualstudio.com/) for free.

## Map preexisting data to intents and entities
Open the `IoT.csv` file. It contains the hypothetical records of user queries to a home automation service, including how they were categorized, what the user said, and some columns with useful information pulled out of them.

![CSV file](./media/luis-tutorial-node-import-utterances-csv/csv.png) 


You'll see that the RequestType column could be intents, the Text column shows an example utterance, and the other fields could be entities if they actually occur in the utterance. Because we have what intents, entities, and example utterances, we have what we need to create a sample app.

## Calling the API
To start building a script to import data for a new LUIS app, first you parse the data from the CSV file and gather information on what intents and entities are there. Then you'll make API calls to create the app, add intents and entities we extracted from the text, then upload the example utterances. You can see this flow in the last part of the code snippet below. Copy this code and save it.

```javascript
var path = require('path');

const download = require('./_download');
const parse = require('./_parse');
const upload = require('./_upload');

// TBD: CHANGE THESE VALUES
const LUIS_subscriptionKey = "YOUR_SUBSCRIPTION_KEY";
const LUIS_appId = "YOUR_APP_ID";
const LUIS_appName = "Your App Name";
const LUIS_appCulture = "en-us";
const LUIS_versionId = "0.1";

// NOTE: final output of add-utterances api named utterances.upload.json
const downloadFile= "./IoT.csv";
const uploadFile = "./utterances.json"

var intents = [];
var entities = [];

/* add utterances configuration */
var configAddUtterances = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    inFile: path.join(__dirname, uploadFile),
    batchSize: 100,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

/* create app configuration */
var configCreateApp = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_versionId: LUIS_versionId,
    appName: LUIS_appName,
    culture: LUIS_appCulture,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/"
};

/* add intents configuration */
var configAddIntents = {
    LUIS_subscriptionKey: LUIS_subscriptionKey,
    LUIS_appId: LUIS_appId,
    LUIS_versionId: LUIS_versionId,
    intentList: intents,
    uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/{appId}/versions/{versionId}/examples".replace("{appId}", LUIS_appId).replace("{versionId}", LUIS_versionId)
};

/* parse configuration */
var configParse = {
    inFile: path.join(__dirname, downloadFile),
    outFile: path.join(__dirname, uploadFile)
}; 

/* parse to extract intents and entities first, then add intents, entities, and add utterances */
parse(configParse)
.then((model) => {
    intents = model.intents;
    entities = model.entities;
    console.log("JSON file should contain utterances. Next step is to create an app with the intents and entities it found.");
    return createApp(configCreateApp);

}).then((appId) => {
    return addIntents(configAddIntents);
    console.log("process done");

}).then((intentIdList) => {
    return addEntities(configAddEntities);
    console.log("process done");

}).then((entityIdList) => {
    return upload(configAddUtterances);
    console.log("process done");
}).catch(err => {
    console.log(err);
});
```
## Download sample code

The code for this tutorial is at [CSV Upload Sample](https://github.com/Microsoft/LUIS-Samples/tree/master/examples/create-app-programmatically/). Download the following files:

| Filename    | Description           |
|-------------|-----------------------|
| [index.js](https://github.com/Microsoft/LUIS-Samples/blob/master/examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog/index.js)  |  The sample's main file. It contains configuration settings and uploads the batch of utterances. Change the `downloadFile` value in the index.js file to the location and name of your query log file. |
| [_parse.js](https://github.com/Microsoft/LUIS-Samples/blob/master/examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog/_parse.js)  |  This file converts the utterances to the format expected by the [Batch Add Labels API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) |
| [_create.js](https://github.com/Microsoft/LUIS-Samples/blob/master/examples/demo-upload-example-utterances/demo-Upload-utterances-from-querylog/_upload.js)  |  This file contains methods for adding utterances using the [Batch Add Labels API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) |

## Run the code


### Install Node.js dependencies
Install the Node.js dependencies from NPM in the terminal/command line.

````
> npm install
````

## Change Configuration Settings
In order to use this application, you need to change the values in the index.js file to your own subscription key, app ID, and version ID. 

Open the index.js file, and change these values at the top of the file.


````JavaScript
// TBD: CHANGE THESE VALUES
const LUIS_subscriptionKey = "YOUR_SUBSCRIPTION_KEY"; 
const LUIS_appId = "YOUR_APP_ID";
const LUIS_versionId = "0.1";
````
## Run the application
Run the application from a terminal/command line with Node.js.

````
> node index.js
````
or
````
> npm start
````

## Application progress
While the application is running, the command line shows progress.

````
> node index.js
intents: ["TurnAllOn","TurnAllOff","None","TurnOn","TurnOff"]
parse done
upload done
process done
````



## LUIS APIs used in this sample
This sample applications use the following LUIS APIs:
- [create app](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c36)
- [add intents](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09)
- [add entities](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) 
- [add utterances](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09) 



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

## Next steps

* You can work with your app in LUIS.ai.

