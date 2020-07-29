---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.date: 05/28/2020
ms.topic: include
ms.custom: include file
ms.author: diberry
---
Use the Language Understanding (LUIS) runtime client library for Node.js to:

* Prediction by slot
* Prediction by Version

[Reference documentation](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-runtime/?view=azure-node-latest) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/cognitiveservices/cognitiveservices-luis-runtime) | [Runtime Package (NPM)](https://www.npmjs.com/package/@azure/cognitiveservices-luis-runtime) | [Samples](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/LUIS/luis_prediction.js)

## Prerequisites

* Language Understanding runtime resource: [Create one in the Azure portal](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesLUISAllInOne)
* [Node.js](https://nodejs.org)
* A LUIS app ID - use the public IoT app ID of `df67dcdb-c37d-46af-88e1-8b97951ca1c2`. The user query used in the quickstart code is specific to that app.

## Setting up

### Get your Language Understanding (LUIS) runtime key

Get your [runtime key](../luis-how-to-azure-subscription.md) by creating a LUIS runtime resource. Keep your key, and the endpoint of the key for the next step.

[!INCLUDE [Set up environment variables for prediction quickstart](sdk-prediction-environment-variables.md)]

### Create a new JavaScript (Node.js) file

Create a new JavaScript file in your preferred editor or IDE, named `luis_prediction.js`.

### Install the NPM library for the LUIS runtime

Within the application directory, install the dependencies with the following command:

```console
npm install @azure/cognitiveservices-luis-runtime @azure/ms-rest-js
```

## Object model

The Language Understanding (LUIS) authoring client is a [LUISAuthoringClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-runtime/luisruntimeclient?view=azure-node-latest) object that authenticates to Azure, which contains your authoring key.

Once the client is created, use this client to access functionality including:

* [Prediction](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-runtime/predictionoperations?view=azure-node-latest#getslotprediction-string--string--predictionrequest--models-predictiongetslotpredictionoptionalparams-) by `staging` or `production` slot
* [Prediction by version](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-runtime/predictionoperations?view=azure-node-latest#getversionprediction-string--string--predictionrequest--models-predictiongetversionpredictionoptionalparams-)

## Code examples

These code snippets show you how to do the following with the Language Understanding (LUIS) prediction runtime client library:

* [Prediction by slot](#get-prediction-from-runtime)

## Add the dependencies

From the project directory, open the `luis_prediction.js` file in your preferred editor or IDE. Add the following dependencies:

[!code-javascript [Dependencies](~/cognitive-services-quickstart-code/javascript/LUIS/node-sdk-authoring-prediction/luis_prediction.js?name=Dependencies)]

## Authenticate the client

1. Create variables for your own required LUIS information:

    Add variables to manage your prediction key pulled from an environment variable named `LUIS_RUNTIME_KEY`. If you created the environment variable after the application is launched, the editor, IDE, or shell running it will need to be closed and reloaded to access the variable. The methods will be created later.

    Create a variable to hold your resource name `LUIS_RUNTIME_ENDPOINT`.

    [!code-javascript [Azure resource variables](~/cognitive-services-quickstart-code/javascript/LUIS/node-sdk-authoring-prediction/luis_prediction.js?name=Variables)]

1. Create a variable for the app ID as an environment variable named `LUIS_APP_ID`. Set the environment variable to the public IoT app, **`df67dcdb-c37d-46af-88e1-8b97951ca1c2`** . Create a variable to set the `production` published slot.

    [!code-javascript [LUIS app variables](~/cognitive-services-quickstart-code/javascript/LUIS/node-sdk-authoring-prediction/luis_prediction.js?name=OtherVariables)]


1. Create an msRest.ApiKeyCredentials object with your key, and use it with your endpoint to create an [LUIS.LUISRuntimeClient](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-runtime/luisruntimeclient?view=azure-node-latest) object.

    [!code-javascript [LUIS Runtime client is required to access predictions for LUIS apps](~/cognitive-services-quickstart-code/javascript/LUIS/node-sdk-authoring-prediction/luis_prediction.js?name=AuthoringCreateClient)]

## Get prediction from runtime

Add the following method to create the request to the prediction runtime.

The user utterance is part of the [predictionRequest](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-runtime/predictionrequest?view=azure-node-latest) object.

The **[luisRuntimeClient.prediction.getSlotPrediction](https://docs.microsoft.com/javascript/api/@azure/cognitiveservices-luis-runtime/predictionoperations?view=azure-node-latest#getslotprediction-string--string--predictionrequest--models-predictiongetslotpredictionoptionalparams-)** method needs several parameters such as the app ID, the slot name, and the prediction request object to fulfill the request. The other options such as verbose, show all intents, and log are optional.

[!code-javascript [LUIS prediction request and response in Node.js NPM SDK](~/cognitive-services-quickstart-code/javascript/LUIS/node-sdk-authoring-prediction/luis_prediction.js?name=predict)]

## Main code for the prediction

Use the following main method to tie the variables and methods together to get the prediction.

[!code-javascript [Main method and main call](~/cognitive-services-quickstart-code/javascript/LUIS/node-sdk-authoring-prediction/luis_prediction.js?name=Main)]

## Run the application

Run the application with the `node luis_prediction.js` command from your application directory.

```console
node luis_prediction.js
```

The prediction result returns a JSON object:

```console
{
   "query":"turn on all lights",
   "prediction":{
      "topIntent":"HomeAutomation.TurnOn",
      "intents":{
         "HomeAutomation.TurnOn":{
            "score":0.5375382
         },
         "None":{
            "score":0.08687421
         },
         "HomeAutomation.TurnOff":{
            "score":0.0207554
         }
      },
      "entities":{
         "HomeAutomation.Operation":[
            "on"
         ],
         "$instance":{
            "HomeAutomation.Operation":[
               {
                  "type":"HomeAutomation.Operation",
                  "text":"on",
                  "startIndex":5,
                  "length":2,
                  "score":0.724984169,
                  "modelTypeId":-1,
                  "modelType":"Unknown",
                  "recognitionSources":[
                     "model"
                  ]
               }
            ]
         }
      }
   }
}
```


## Clean up resources

When you are done with your predictions, clean up the work from this quickstart by deleting the file and its subdirectories.
