---
title: v2 to v3 API Migration  
titleSuffix: Azure Cognitive Services
description: The version 3 endpoint APIs have changed. Use this guide to understand how to migrate to version 3 endpoint APIs. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 05/07/2019
ms.author: diberry
---


# Pre-release: API v2 to v3 Migration guide for LUIS apps
The endpoint APIs have changed. Use this guide to understand how to migrate to version 3 endpoint APIs. 

[Questions:
Mohamed's v3 had `connectedServiceResult` - but we never talked about this - what is it?
]

## Endpoint JSON changes

General changes:

* Uses object format, `{}`, instead of array format, `[]`. This allows for object navigation by name instead of enumeration. 
* data types are respected: text is in quotes, numbers are not in quotes
* primary prediction information is separated from metadata

### Entity role instead of entity name used

In v2, the `entities` array returned all the predicted entities with the entity name being the unique identifier. In v3, if the entity uses roles and the prediction is for an entity role, the primary identifier is the role name. This is possible because entity roles names must be unique across the entire app including other model (intent, entity) names.

In v2, entity identified by entity name:

```JSON
"entities":[
    {
        "entity": "12345 wa",
        "type": "Address",
        "startIndex": 13,
        "endIndex": 20,
        "score": 0.786378264,
        "role": "Source"
    }
]
```

In v3, entity identified by entity role, if prediction was for the role:

```JSON
"entities":{
    "Role1":[
        {
            "number":[
                12345
            ]
        }
    ]
}
```

In v3, the same result with the `verbose` flag to return entity metadata:

```JSON
"entities":{
    "Role1":[
        {
            "number":[
                12345
            ]
        }
    ],
    "$instance":{
        "Role1": {
            "number": [
                "name": "number",
                "type": "builtin.number"
                "text": "12345"
                "startIndex": 25,
                "length":5,
                "modelTypeId": 2,
                "modelType": "Prebuilt Entity Extractor"
            ]
        }
    }
}
```

### Detect dispatch child apps

### Detect multiple intents within single utterance

The v3 endpoint query supports multi-intent query predictions. This means each sentence can have its own intent prediction.

v2 endpoint success response, entire utterance is predicted to a single intent:

```json
{
  "query": "forward to frank 30 dollars through HSBC",
  "topScoringIntent": {
    "intent": "give",
    "score": 0.8064121
  },
  "entities": [
    {
      "entity": "30",
      "type": "builtin.number",
      "startIndex": 17,
      "endIndex": 18,
      "resolution": {
        "value": "30"
      }
    },
    {
      "entity": "30 dollars",
      "type": "builtin.currency",
      "startIndex": 17,
      "endIndex": 26,
      "resolution": {
        "unit": "Dollar",
        "value": "30"
      }
    }
  ]
}
```

v3 endpoint success response, predicted to multiple intents:

```json
{
  "query": "forward to frank 30 dollars through HSBC",
  "topScoringIntent": {
    "intent": "give",
    "score": 0.8064121
  },
  "entities": [
    {
      "entity": "30",
      "type": "builtin.number",
      "startIndex": 17,
      "endIndex": 18,
      "resolution": {
        "value": "30"
      }
    },
    {
      "entity": "30 dollars",
      "type": "builtin.currency",
      "startIndex": 17,
      "endIndex": 26,
      "resolution": {
        "unit": "Dollar",
        "value": "30"
      }
    }
  ]
}
```

### V3 Query string parameters

The v3 API has different query string parameters.

|Param name|Version|Purpose|
|--|--|--|
|`log-query`|v3 only|This replaces the `log` querystring from v2.|
|`show-all-intents`|v3 only|Return all intents with the corresponding score in the **prediction.intents** object. Intents are returned as objects in a parent `intents` object. This allows programmatic access without needing to find the intent in an array: `prediction.intents.give`. In v2, these were returned in an array. |
|`verbose`|v2 & v3|**In v2**, when set to true, all predicted intents were returned. If you need all predicted intents, use the v3 param of `show-all-intents`.<br><br>**In v3**, this parameter only provides entity metadata details of entity prediction.  |

### Prediction endpoint JSON schema changes

The schema changes allow for easier programmatic access to data and align with the Bot Framework middleware.

|Property|Version|Purpose|
|--|--|--|
|`prediction`|v3|Encapsulates the prediction response.|
|`prediction.topIntent`|v3|Replaces v2's `topScoringIntent`. |
|`<propertyname>.$instance`|v3|Contains details beyond prediction score.|

v3 endpoint success response:

```json
{
    "query": "forward to frank 30 dollars through HSBC",
    "prediction": {
        "normalizedQuery": "forward to frank 30 dollars through hsbc",
        "topIntent": "give",
        "intents": {
            "give": {
                "score": 0.8064121
            }
        },
        "entities": {
            "money": [
                {
                    "number": 30,
                    "unit": "Dollar"
                }
            ],
            "number": [
                30
            ],
            "$instance": {
                "money": [
                    {
                        "name": "money",
                        "type": "builtin.currency",
                        "text": "30 dollars",
                        "startIndex": 17,
                        "length": 10,
                        "modelTypeId": 2,
                        "modelType": "Prebuilt Entity Extractor"
                    }
                ],
                "number": [
                    {
                        "name": "number",
                        "type": "builtin.number",
                        "text": "30",
                        "startIndex": 17,
                        "length": 2,
                        "modelTypeId": 2,
                        "modelType": "Prebuilt Entity Extractor"
                    }
                ]
            }
        }
    }
}
```

## Prebuilt domains with new models and language coverage

Review the [V3 API list of prebuilt domains](luis-reference-prebuilt-domains.md). These domains are more complete, both in the model, and the language coverage. 

<!--

## Bind entities are runtime


-->

## Prediction endpoint JSON changes for prebuilt DatetimeV2 entity

Review the [JSON response changes](luis-reference-prebuilt-datetimev2.md#preview-api-version-3x) to the datetimeV2 released in the API V3. 

## Next steps

Use the v3 API documentation to update existing REST calls to LUIS [endpoint](https://aka.ms/luis-endpoint-apis) APIs. 