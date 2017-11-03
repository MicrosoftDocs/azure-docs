---
title: Add utterances to a LUIS app using Node.js | Microsoft Docs 
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

# Add utterances to a LUIS app using Node.js 

This quickstart shows you how to programmatically add utterances to your Language Understanding Intelligent Service (LUIS) app and train LUIS. 

Using the command line is a quick way to enter many utterances and train LUIS. You can also automate this task into a larger pipeline.

Refer to the [Authoring API definitions][authoring-apis] for technical documentation for the APIs.

## Prerequisites

* Latest **Node.js** with NPM. Download it from [here](https://nodejs.org/en/download/).
* NPM dependencies for this quickstart: **request-promise**, **fs-extra**.  
* **[Recommended]** [Visual Studio Code](https://code.visualstudio.com/) for IntelliSense and debugging.
* Your LUIS **programmatic key**. You can find this key under Account Settings in [https://www.luis.ai](https://www.luis.ai).
* Your LUIS [**application ID**](./luis-get-started-create-app.md). The application ID is shown in the application dashboard.
* The **version ID** within the application that receives the utterances. The default ID is "0.1"
* Create a new file named `add-utterances.js` project in VSCode.

## Add NPM dependencies
Add the NPM dependencies to the file.

   [!code-nodejs[Add NPM dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterance.js?range=16-19)]

## Add constants 
Add the LUIS constants to the file. Copy the code below and change to your programmatic key, application ID, and version ID.

   [!code-nodejs[Add NPM dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterance.js?range=21-29)]

## Add upload file
Add the name and location of the upload file containing your utterances. 

## Add command line variables
Add the variables that will hold the command line values.

   [!code-nodejs[Add NPM dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterance.js?range=35-37)]

## Add configuration information for adding utterance
Add the configuration JSON object used by the `addUtterance` function.

   [!code-nodejs[Add NPM dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterance.js?range=51-59)]


## Add an utterance
Add the function `addUtterance` which manages the API request and response used by `SendUtteranceToApp`.

   [!code-nodejs[Add NPM dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterance.js?range=61-92)]

## Add configuration information for training LUIS
Add the configuration JSON object used by the `train` function.

   [!code-nodejs[Add NPM dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterance.js?range=93-101)]

## Train the application
Add the function `train` which starts the training process. 

   [!code-nodejs[Add NPM dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterance.js?range=102-133)]

## Send the HTTP Request
Add the function `sendUtteranceToApi` which sends and receives HTTP calls. 

   [!code-nodejs[Add NPM dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterance.js?range=135-152)]


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
 
[authoring-apis]:https://aka.ms/luis-authoring-api