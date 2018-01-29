---
title: Enhance LUIS understanding of category items with a list entity using Nodejs | Microsoft Docs 
description: Learn how to add a list entity to a LUIS app and see the improvement of the score in Nodejs.
services: cognitive-services
author: v-geberr
titleSuffix: Azure
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 01/29/2018
ms.author: v-geberr
---

# Enhance LUIS understanding of category items with a list entity 
Improve accuracy of entity identification for entities that can have multiple words and phrases to identify the entity. A list entity is used as an exact match for a known set of values of up to 20,000 items. 

In this tutorial, you learn how to:

> [!div class="checklist"]
* Create list entity in C#
* Add normalized values and synonyms in C#
* Validate improved entity identification

## Prerequisite

> [!div class="checklist"]
> * Latest [Nodejs](https://nodejs.org)
> * [HomeAutomation LUIS app](luis-get-started-create-app.md). If you do not have the Home Automation app created, create a new app, and add the Prebuilt Domain **HomeAutomation**. Train and publish the app. 

> [!Tip]
> If you do not already have a subscription, you can register for a [free account](https://azure.microsoft.com/free/).

All of the code in this tutorial is available on the [LUIS-Samples github repository](https://github.com/Microsoft/LUIS-Samples/tree/master/documentation-samples/luis-tutorial-list-entity) and each line associated with this tutorial is commented with `//APPINSIGHT:`. 

## Use HomeAutomation app
The HomeAutomation gives you control of devices such as lights, entertainment systems, and environment controls such as heating and cooling. These systems have several different names that can include Manufacturer names, nicknames, acronyms, and slang. 

One system that has many names across different cultures and demographics is the thermostat. A thermostat can control both cooling and heating systems for a house or building.

The following utterances should resolve the term for the Prebuilt entity **HomeAutomation.Device**:

|#|utterance|entity identified|score|
|--|--|--|--|
|1|turn on the ac|HomeAutomation.Device - "ac"|0.8748562|
|2|turn up the heat|HomeAutomation.Device - "heat"|0.784990132|
|3|make it colder|||

The third utterance utterance, "make it colder", doesn't map to a device but instead requests a result. The app needs to understand the end result term of "colder" maps to the thermostat. 

## Create a list entity to manage device names
A list entity is the best approach because there is a limited and known set of terms for a thermostat. If the purpose was to determine is a new, unknown term should be mapped to the thermostat, then a phrase list is a better setting.

If there were other devices that had many, known names, acronyms and slang, you add these devices and there alternative names to the entity list.

Create a Nodejs file and copy the following code into it. Change the programmaticKey, appId, versionId, and region values.

   [!code-javascript[Create DevicesList List Entity](~/samples-luis/documentation-samples/tutorial-list-entity/add-entity-list.js "Create DevicesList List Entity")]

Use the following command line to run the code and create the list entity:

```Javascript
node add-entity-list.js
```

The output of the run will be the ID of the list entity:

```Javascript
026e92b3-4834-484f-8608-6114a83b03a6
```
## Train the model
LUIS needs to be trained in order for the new list to affect the query results. Training is a two-part process of training, then checking status if the training is done. An app with many models may take a few moments to train. The following code trains the app then waits until the training is successful. The code uses a wait-and-retry strategy to avoid the 429 "Too many requests" error. 

Create a Nodejs file and copy the following code into it. Change the programmaticKey, appId, versionId, and region values.

   [!code-javascript[Train LUIS](~/samples-luis/documentation-samples/tutorial-list-entity/train.js "Train LUIS")]

Use the following command line to run the code and train the app:

```Javascript
node train.js
```

The output of the run will be the status of each iteration of the training of the LUIS models. The following execution required only 1 check of training:

```Javascript
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

## Query the app to prove the enhancement
Query the app to prove that the additional of the list entity helps LUIS determine the device type.

Create a Nodejs file and copy the following code into it. Change the endpointKey, appId, and region values.

   [!code-javascript[Query LUIS](~/samples-luis/documentation-samples/tutorial-list-entity/query.js "Query LUIS")]

Use the following command line to run the code and query the app:

```Javascript
node train.js
```

The output of the run will be the query results. Because the code added the **verbose** name/value pair to the querystring, the output will include all intents:

```JSON
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
      "type": "Devices",
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

The specific device of **Thermostat** is identified with a result-oriented query of "turn up the heat". Since the original HomeAutomation.Device entity is still in the app, you can see its results as well. In order to have the same impact as the list entity when using simple entities such as the HomeAutomation.Device, you would have to have a simple entity for every name, acronym, slang, and manufacturer term for the device. 