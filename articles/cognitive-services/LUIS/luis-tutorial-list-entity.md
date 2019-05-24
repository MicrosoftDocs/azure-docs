---
title: Extact text match entities
description: Learn how to add a list entity to help LUIS label variations of a word or phrase.
services: cognitive-services
author: diberry
titleSuffix: Azure
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 01/23/2019
ms.author: diberry 
---

# Use a list entity to increase entity detection 
This tutorial demonstrates the use of a [list entity](luis-concept-entity-types.md) to increase entity detection. List entities do not need to be labeled as they are an exact match of terms.  

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a list entity 
> * Add normalized values and synonyms
> * Validate improved entity identification

## Prerequisites

> [!div class="checklist"]
> * Latest [Node.js](https://nodejs.org)
> * [HomeAutomation LUIS app](luis-get-started-create-app.md). If you do not have the Home Automation app created, create a new app, and add the Prebuilt Domain **HomeAutomation**. Train and publish the app. 
> * [AuthoringKey](luis-concept-keys.md#authoring-key), [EndpointKey](luis-concept-keys.md#endpoint-key) (if querying many times), app ID, version ID, and [region](luis-reference-regions.md) for the LUIS app.

> [!Tip]
> If you do not already have a subscription, you can register for a [free account](https://azure.microsoft.com/free/).

All of the code in this tutorial is available on the [Azure-Samples GitHub repository](https://github.com/Azure-Samples/cognitive-services-language-understanding/tree/master/documentation-samples/tutorial-list-entity). 

## Use HomeAutomation app
The HomeAutomation app gives you control of devices such as lights, entertainment systems, and environment controls such as heating and cooling. These systems have several different names that can include Manufacturer names, nicknames, acronyms, and slang. 

One system that has many names across different cultures and demographics is the thermostat. A thermostat can control both cooling and heating systems for a house or building.

Ideally the following utterances should resolve to the Prebuilt entity **HomeAutomation.Device**:

|#|utterance|entity identified|score|
|--|--|--|--|
|1|turn on the ac|HomeAutomation.Device - "ac"|0.8748562|
|2|turn up the heat|HomeAutomation.Device - "heat"|0.784990132|
|3|make it colder|||

The first two utterances map to different devices. The third utterance, "make it colder", doesn't map to a device but instead requests a result. LUIS doesn't know that the term, "colder", means the thermostat is the requested device. Ideally, LUIS should resolve all of these utterances to the same device. 

## Use a list entity
The HomeAutomation.Device entity is great for a small number of devices or with few variations of the names. For an office building or campus, the device names grow beyond the usefulness of the HomeAutomation.Device entity. 

A **list entity** is a good choice for this scenario because the set of terms for a device in a building or campus is a known set, even if it is a huge set. By using a list entity, LUIS can receive any possible value in the set for the thermostat, and resolve it down to just the single device "thermostat". 

This tutorial is going to create an entity list with the thermostat. The alternative names for a thermostat in this tutorial are: 

|alternative names for thermostat|
|--|
| ac |
| a/c|
| a-c|
|heater|
|hot|
|hotter|
|cold|
|colder|

If LUIS needs to determine a new alternative often, then a [phrase list](luis-concept-feature.md#how-to-use-phrase-lists) is a better answer.

## Create a list entity
Create a Node.js file and copy the following code into it. Change the authoringKey, appId, versionId, and region values.

   [!code-javascript[Create DevicesList List Entity](~/samples-luis/documentation-samples/tutorial-list-entity/add-entity-list.js "Create DevicesList List Entity")]

Use the following command to install the NPM dependencies and run the code to create the list entity:

```console
npm install && node add-entity-list.js
```

The output of the run is the ID of the list entity:

```console
026e92b3-4834-484f-8608-6114a83b03a6
```

## Train the model
Train LUIS in order for the new list to affect the query results. Training is a two-part process of training, then checking status if the training is done. An app with many models may take a few moments to train. The following code trains the app then waits until the training is successful. The code uses a wait-and-retry strategy to avoid the 429 "Too many requests" error. 

Create a Node.js file and copy the following code into it. Change the authoringKey, appId, versionId, and region values.

   [!code-javascript[Train LUIS](~/samples-luis/documentation-samples/tutorial-list-entity/train.js "Train LUIS")]

Use the following command to run the code to train the app:

```console
node train.js
```

The output of the run is the status of each iteration of the training of the LUIS models. The following execution required only one check of training:

```console
1 trained = true
[ { modelId: '2c549f95-867a-4189-9c35-44b95c78b70f',
    details: { statusId: 2, status: 'UpToDate', exampleCount: 45 } },
  { modelId: '5530e900-571d-40ec-9c78-63e66b50c7d4',
    details: { statusId: 2, status: 'UpToDate', exampleCount: 45 } },
  { modelId: '519faa39-ae1a-4d98-965c-abff6f743fe6',
    details: { statusId: 2, status: 'UpToDate', exampleCount: 45 } },
  { modelId: '9671a485-36a9-46d5-aacd-b16d05115415',
    details: { statusId: 2, status: 'UpToDate', exampleCount: 45 } },
  { modelId: '9ef7d891-54ab-48bf-8112-c34dcd75d5e2',
    details: { statusId: 2, status: 'UpToDate', exampleCount: 45 } },
  { modelId: '8e16a660-8781-4abf-bf3d-f296ebe1bf2d',
    details: { statusId: 2, status: 'UpToDate', exampleCount: 45 } } ]

```
## Publish the model
Publish so the list entity is available from the endpoint.

Create a Node.js file and copy the following code into it. Change the endpointKey, appId, and region values. You can use your authoringKey if you do not plan to call this file beyond your quota limit.

   [!code-javascript[Publish LUIS](~/samples-luis/documentation-samples/tutorial-list-entity/publish.js "Publish LUIS")]

Use the following command to run the code to query the app:

```console
node publish.js
```

The following output includes the endpoint url for any queries. Real JSON results would include the real appID. 

```json
{ 
  versionId: null,
  isStaging: false,
  endpointUrl: 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>',
  region: null,
  assignedEndpointKey: null,
  endpointRegion: 'westus',
  publishedDateTime: '2018-01-29T22:17:38Z' }
}
```

## Query the app 
Query the app from the endpoint to prove that the list entity helps LUIS determine the device type.

Create a Node.js file and copy the following code into it. Change the endpointKey, appId, and region values. You can use your authoringKey if you do not plan to call this file beyond your quota limit.

   [!code-javascript[Query LUIS](~/samples-luis/documentation-samples/tutorial-list-entity/query.js "Query LUIS")]

Use the following command to run the code and query the app:

```console
node train.js
```

The output is the query results. Because the code added the **verbose** name/value pair to the query string, the output includes all intents and their scores:

```json
{
  "query": "turn up the heat",
  "topScoringIntent": {
    "intent": "HomeAutomation.TurnOn",
    "score": 0.139018849
  },
  "intents": [
    {
      "intent": "HomeAutomation.TurnOn",
      "score": 0.139018849
    },
    {
      "intent": "None",
      "score": 0.120624863
    },
    {
      "intent": "HomeAutomation.TurnOff",
      "score": 0.06746891
    }
  ],
  "entities": [
    {
      "entity": "heat",
      "type": "HomeAutomation.Device",
      "startIndex": 12,
      "endIndex": 15,
      "score": 0.784990132
    },
    {
      "entity": "heat",
      "type": "DevicesList",
      "startIndex": 12,
      "endIndex": 15,
      "resolution": {
        "values": [
          "Thermostat"
        ]
      }
    }
  ]
}
```

The specific device of **Thermostat** is identified with a result-oriented query of "turn up the heat". Since the original HomeAutomation.Device entity is still in the app, you can see its results as well. 

Try the other two utterances to see that they are also returned as a thermostat. 

|#|utterance|entity|type|value|
|--|--|--|--|--|
|1|turn on the ac| ac | DevicesList | Thermostat|
|2|turn up the heat|heat| DevicesList |Thermostat|
|3|make it colder|colder|DevicesList|Thermostat|

## Next steps

You can create another List entity to expand device locations to rooms, floors, or buildings. 
