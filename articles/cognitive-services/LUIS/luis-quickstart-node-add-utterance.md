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

Refer to the [Authoring API definitions][authoring-apis] for technical documentation for the [add utterance](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08), [train](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c450), [training status](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c46) APIs.

## Prerequisites

* Latest [**Node.js**](https://nodejs.org/en/download/) with NPM.
* NPM dependencies for this quickstart: [**request**](https://www.npmjs.com/package/request), [**request-promise**](https://www.npmjs.com/package/request-promise), [**fs-extra**](https://www.npmjs.com/package/fs-extra).  
* **[Recommended]** [Visual Studio Code](https://code.visualstudio.com/) for IntelliSense and debugging.
* Your LUIS **programmatic key**. You can find this key under Account Settings in [https://www.luis.ai](https://www.luis.ai).
* Your LUIS [**application ID**](./luis-get-started-create-app.md). The application ID is shown in the application dashboard.
* The **version ID** within the application that receives the utterances. The default ID is "0.1"
* Create a new file named `add-utterances.js` project in VSCode.

## Write the Node.js code

### Add NPM dependencies
Add the NPM dependencies to the file.

   [!code-nodejs[NPM Dependencies](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=16-19 "NPM Dependencies")]


### Add LUIS key and IDs
Add the LUIS constants to the file. Copy the code below and change to your programmatic key, application ID, and version ID.

   [!code-nodejs[LUIS key and IDs](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=22-29 "LUIS key and IDs")]

### Add upload file
Add the name and location of the upload file containing your utterances. 

   [!code-nodejs[Add upload file](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=31-33 "Add upload file")]

### Add command line variables
Add the variables that will hold the command line values.

   [!code-nodejs[Add upload file](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=31-49 "Add upload file")]


### Send the HTTP request
Add the function `sendUtteranceToApi` which sends and receives HTTP calls. 

   [!code-nodejs[Send the HTTP request](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=135-151 "Send the HTTP request")]


### Add configuration information for adding utterance
Add the configuration JSON object used by the `addUtterance` function.

   [!code-nodejs[Add configuration information for adding utterance](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=52-59 "Add configuration information for adding utterance")]

### Add an utterance
Add the function `addUtterance` which manages the API request and response used by `SendUtteranceToApp`.

   [!code-nodejs[Add configuration information for adding utterance](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=62-92 "Add configuration information for adding utterance")]

### Add configuration information for training LUIS
Add the configuration JSON object used by the `train` function.

   [!code-nodejs[Add configuration information for training LUIS](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=94-101 "Add configuration information for training LUIS")]


### Train the application
Add the function `train` which starts the training process. 

   [!code-nodejs[Train the application](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=103-133 "Train the application")]

### Choose action based on command line paramaters
Add the code that chooses which action to take (add utterance or train) based on the command line variables.

   [!code-nodejs[Train the application](~/samples-luis/documentation-samples/authoring-api-samples/node/add-utterances.js?range=153-183 "Train the application")]

## Specify utterances to add
Create and edit the file `utterances.json` to specify the entities you want to add to the LUIS app. The `text` field contains the text of the utterance. The `intentName` field must correspond to the name of an intent in the LUIS app. The `entityLabels` field is required. If you don't want to label any entities, provide an empty list as shown in the following example:

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

## Add an utterance from the command line

Run the application from a command line with Node.js.

Calling add-utterance with no arguments adds an utterance to the app, without training it.
````
> node add-utterances.js
````

## Add an utterance and train from the command line
Call add-utterance the `-train` argument to sends a request to begin training, and subsequently request training status. The status is generally Queued immediate after training begins. Status details are written to a file.

````
> node add-utterances.js -train
````

> NOTE: 
> Duplicate utterances aren't added again, but don't cause an error. The `response` will contain the ID of the original utterance.

When you call the sample with the `-train` argument, it creates a `training-results.json` file indicating if the request to train the LUIS app was successfully queued. 

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

After the request to train is queued, it can take a moment for training to complete.

## Get training status from the command line
To see if training is complete, call the sample with the `-status` argument to check the training status and write status details to a file.

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
## Next steps

 
> [!div class="nextstepaction"] 
> [Integrate LUIS with a bot](luis-nodejs-tutorial-build-bot-framework-sample.md)


[authoring-apis]:https://aka.ms/luis-authoring-api