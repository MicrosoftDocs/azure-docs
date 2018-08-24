---
title: Quickstart change model and train LUIS app using Node.js - Azure Cognitive Services | Microsoft Docs
description: In this Node.js quickstart, add example utterances to a Home Automation app and train the app. Example utterances are conversational user text mapped to an intent. By providing example utterances for intents, you teach LUIS what kinds of user-supplied text belongs to which intent.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 08/16/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to programmatically add an example utterance to an intent and train the model using Node.js.  
---

# Quickstart: Change model using Node.js

[!include[Quickstart introduction for change model](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

## Prerequisites

[!include[Quickstart prerequisites for changing model](../../../includes/cognitive-services-luis-qs-change-model-prereq.md)]
* Latest [**Node.js**](https://nodejs.org/en/download/) with NPM.
* NPM dependencies for this article: [**request**](https://www.npmjs.com/package/request), [**request-promise**](https://www.npmjs.com/package/request-promise), [**fs-extra**](https://www.npmjs.com/package/fs-extra).  
* [Visual Studio Code](https://code.visualstudio.com/).

[!include[Code is available in LUIS-Samples Github repo](../../../includes/cognitive-services-luis-qs-change-model-luis-repo-note.md)]

## Example utterances JSON file

[!include[Quickstart explanation of example utterance JSON file](../../../includes/cognitive-services-luis-qs-change-model-json-ex-utt.md)]

## Create quickstart code 

Add the NPM dependencies to the file.

   [!code-javascript[NPM Dependencies](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=16-19 "NPM Dependencies")]

Add the LUIS constants to the file. Copy the following code and change to your authoring key, application ID, and version ID.

   [!code-javascript[LUIS key and IDs](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=22-29 "LUIS key and IDs")]

Add the name and location of the upload file containing your utterances. 

   [!code-javascript[Add upload file](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=31-33 "Add upload file")]

Add the variables that hold the command-line values.

   [!code-javascript[Add upload file](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=35-49 "Add upload file")]


Add the function `sendUtteranceToApi` to send and receive HTTP calls. 

   [!code-javascript[Send the HTTP request](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=135-151 "Send the HTTP request")]

Add the configuration JSON object used by the `addUtterance` function.

   [!code-javascript[Add configuration information for adding utterance](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=52-59 "Add configuration information for adding utterance")]

Add the function `addUtterance` manage the API request and response used by `SendUtteranceToApp`.

   [!code-javascript[Add configuration information for adding utterance](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=62-92 "Add configuration information for adding utterance")]

Add the configuration JSON object used by the `train` function.

   [!code-javascript[Add configuration information for training LUIS](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=94-101 "Add configuration information for training LUIS")]

Add the function `train` to start the training process. 

   [!code-javascript[Train the application](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=103-133 "Train the application")]

Add the code that chooses which action to take (add utterance or train) based on the command-line variables.

   [!code-javascript[Train the application](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=153-184 "Train the application")]

### Install dependencies

Create `package.json` file with the following text:

```JSON
{
  "name": "node",
  "version": "1.0.0",
  "description": "",
  "main": "add-single-utterance.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "fs-extra": "^5.0.0",
    "request": "^2.83.0",
    "request-promise": "^4.2.2"
  }
}

```

On the command-line, from the directory that has the package.json, install dependencies with NPM: `npm install`.

## Run code

Run the application from a command-line with Node.js.

Calling add-utterance with no arguments adds an utterance to the app, without training it.
````
> node add-utterances.js -train -status
````

This command-line displays the results of calling the add utterances API. 

[!include[Quickstart response from API calls](../../../includes/cognitive-services-luis-qs-change-model-json-results.md)]


## Clean up resources

When you are done with the quickstart, remove all the files created in this quickstart. 

## Next steps
> [!div class="nextstepaction"] 
> [Build a LUIS app programmatically](luis-tutorial-node-import-utterances-csv.md)