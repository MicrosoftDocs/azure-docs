---
title: Node.js Quickstart - change model and train LUIS app
titleSuffix: Azure Cognitive Services
description: In this Node.js quickstart, add example utterances to a Home Automation app and train the app. Example utterances are conversational user text mapped to an intent. By providing example utterances for intents, you teach LUIS what kinds of user-supplied text belongs to which intent.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: quickstart
ms.date: 09/10/2018
ms.author: diberry
#Customer intent: As an API or REST developer new to the LUIS service, I want to programmatically add an example utterance to an intent and train the model using Node.js.  
---

# Quickstart: Change model using Node.js

[!INCLUDE [Quickstart introduction for change model](../../../includes/cognitive-services-luis-qs-endpoint-intro-para.md)]

## Prerequisites

[!INCLUDE [Quickstart prerequisites for changing model](../../../includes/cognitive-services-luis-qs-change-model-prereq.md)]
* Latest [**Node.js**](https://nodejs.org/en/download/) with NPM.
* NPM dependencies for this article: [**request**](https://www.npmjs.com/package/request), [**request-promise**](https://www.npmjs.com/package/request-promise), [**fs-extra**](https://www.npmjs.com/package/fs-extra).  
* [Visual Studio Code](https://code.visualstudio.com/).

[!INCLUDE [Code is available in LUIS-Samples Github repo](../../../includes/cognitive-services-luis-qs-change-model-luis-repo-note.md)]

## Example utterances JSON file

[!INCLUDE [Quickstart explanation of example utterance JSON file](../../../includes/cognitive-services-luis-qs-change-model-json-ex-utt.md)]

## Create quickstart code 

Add the NPM dependencies to the file named `add-utterances.js`.

   [!code-javascript[NPM Dependencies](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=8-11 "NPM Dependencies")]

Add the LUIS constants to the file. Copy the following code and change to your authoring key, application ID, and version ID.

   [!code-javascript[LUIS key and IDs](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=13-22 "LUIS key and IDs")]

Add the name and location of the upload file containing your utterances. 

   [!code-javascript[Add upload file](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=24-26 "Add upload file")]

Add method and object for `addUtterance` function.

   [!code-javascript[Add configuration information for adding utterance](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=28-67 "Add configuration information for adding utterance")]

Add method and object for `train` function.

   [!code-javascript[Add configuration information for training LUIS](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=69-101 "Add configuration information for training LUIS")]

Add the function `sendUtteranceToApi` to send and receive HTTP calls. 

   [!code-javascript[Send the HTTP request](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=103-119 "Send the HTTP request")]

Add the **main** code that chooses which action.

   [!code-javascript[Main function](~/samples-luis/documentation-samples/quickstarts/change-model/node/add-utterances.js?range=121-143 "Main function")]

### Install dependencies

Create `package.json` file with the following text:

   [!code-json[Package.json](~/samples-luis/documentation-samples/quickstarts/change-model/node/package.json "Package.json")]

On the command-line, from the directory that has the package.json, install dependencies with NPM: `npm install`.

## Run code

Run the application from a command-line with Node.js.

Calling `npm start`adds the utterances, trains, and gets training status.

```CMD
> npm start 
```

This command-line displays the results of calling the add utterances API. 

[!INCLUDE [Quickstart response from API calls](../../../includes/cognitive-services-luis-qs-change-model-json-results.md)]


## Clean up resources

When you are done with the quickstart, remove all the files created in this quickstart. 

## Next steps
> [!div class="nextstepaction"] 
> [Build a LUIS app programmatically](luis-tutorial-node-import-utterances-csv.md)