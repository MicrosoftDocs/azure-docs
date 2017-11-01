---
title: Add an utterance to a LUIS app using Node.js | Microsoft Docs 
description: Learn to call a LUIS app using Node.js. 
services: cognitive-services
author: DeniseMak
manager: rstand

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 09/29/2017
ms.author: v-demak
---

# Add an utterance to a LUIS app using Node.js 

This quickstart shows you how to programmatically add utterances to your Language Understanding Intelligent Service (LUIS) app in just a few minutes. When you're finished, you'll be able to use Node.js code to add an utterance to a LUIS app.

## Before you begin

* This quickstart assumes you have already created a LUIS app. You can see [Create a LUIS app](./luis-get-started-create-app.md) for instructions on how to create a LUIS app, or import a sample LUIS app using the instructions [here](https://github.com/Microsoft/LUIS-Samples/tree/master/examples/add-utterances/nodejs). 
* You need to use a programmatic key. You can find this key under Account Settings in [https://www.luis.ai](https://www.luis.ai).

The prerequisites to run the sample code are:
* Download the [sample code](https://github.com/Microsoft/LUIS-Samples/tree/master/examples/add-utterances/nodejs). 
* Latest Node.js with NPM. Download it from [here](https://nodejs.org/en/download/).
* A [created](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/create-app) LUIS Application. 
* **[Recommended]** Visual Studio Code for IntelliSense and debugging, download it from [here](https://code.visualstudio.com/) for free.


## Get the ID and version of your LUIS app

You can find your app ID and version number by logging into [https://www.luis.ai](https://www.luis.ai) and go to App Settings. 

## Add an utterance by calling the Authoring API with Node.js

### Install the Node.js dependencies from NPM in the terminal/command line.

````
> npm install
````

### Change Configuration Settings
In order to use this application, you need to change the values in the `add-utterances.js` file to your own subscription key, app ID, and version ID. 
   * The subscription key is the Programmatic key, available in luis.ai under Account Settings. 
   * To see your App ID and Version ID (which defaults to 0.1), click on your app's entry under **My Apps** in www.luis.ai and click **Settings**.

Open `add-utterances.js`, and change these values in the file. 


````JavaScript
// Programmatic key, available in luis.ai under Account Settings
const LUIS_subscriptionKey = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
// ID of your LUIS app to which you want to add an utterance
const LUIS_appId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
// The version number of your LUIS app
const LUIS_versionId = "0.1";
````

### Specify utterances to add
Open the file `utterances.json`, and edit it to specify the entities you want to add to the app you imported. The `text` field contains the text of the utterance. The `intentName` field must correspond to the name of an intent in the LUIS app. The `entityLabels` field is required. If you don't want to label any entities, provide an empty list as shown in the following example:

```json
[
    {
        "text": "go to Seattle",
        "intentName": "BookFlight",
        "entityLabels": [
            {
                "entityName": "Location::LocationTo",
                "startCharIndex": 6,
                "endCharIndex": 12
            }
        ]
    }
,
    {
        "text": "book a flight",
        "intentName": "BookFlight",
        "entityLabels": []
    }
]
```

### Run the application

Run the application from a terminal/command line with Node.js.

Calling add-utterance with no arguments adds an utterance to the app, without training it.
````
> node add-utterances.js
````

Call add-utterance the `-train` argument to sends a request to begin training, and subsequently request training status. The status is generally Queued immediate after training begins. Status details are written to a file.

````
> node add-utterances.js -train
````

The `status` argument checks the training status and writes status details to a file.

````
> node add-utterances.js -status
````

### Verify that utterances were added
This sample creates a file with the `results.json` that contains the results from calling the add utterances API. The `response` field is in this format for an utterances that was added.

```json
    "response": [
        {
            "value": {
                "UtteranceText": "go to seattle",
                "ExampleId": -5123383
            },
            "hasError": false
        },
        {
            "value": {
                "UtteranceText": "book a flight",
                "ExampleId": -169157
            },
            "hasError": false
        }
    ]
```
In addition to viewing the result file, you can verify that the utterances were added by logging in to luis.ai and looking at the utterances in your app. 

> NOTE: 
> Duplicate utterances aren't added again, but don't cause an error. The `response` will contain the ID of the original utterance.

### Verify that the LUIS app is trained
If you call the sample with the `-train` argument, it creates a `training-results.json` file indicating if the request to train the LUIS app was successfully queued. 

The following shows the result of a successful request to train with new utterances added:
```json
{
    "request": null,
    "response": {
        "statusId": 9,
        "status": "Queued"
    }
}
```

#### Getting training status
After the request to train is queued, it can take a moment for training to complete. To see if training is complete, call the sample with the `-status` argument. This command creates a `training-status-results.json` file containing a response that indicates the training status of each intent and entity in the app. The format of this response is documented [here](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c46).

If you're logged in to [https://www.luis.ai](https://www.luis.ai), you can also view the time your app was most recently trained. 


## Verify that the utterance has been added to your intent

If you log into www.luis.ai and look at the intents page of your app, you should be able to see the utterance there. You can also call the [API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c0a) for returning a list of utterances in your LUIS app.
<!-- Add image -->

## Next steps

* After adding an utterance, you may want to [train](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/train-test) your LUIS app.
* See the [LUIS Endpoint API reference](https://westus.dev.cognitive.microsoft.com/docs/services/5819c76f40a6350ce09de1ac/operations/5819c77140a63516d81aee78) to learn more about the parameters for calling your LUIS endpoint.
