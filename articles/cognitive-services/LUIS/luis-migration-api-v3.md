---
title: V2 to V3 API migration  
titleSuffix: Azure Cognitive Services
description: The version 3 endpoint APIs have changed. Use this guide to understand how to migrate to version 3 endpoint APIs. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 05/22/2019
ms.author: diberry
---


# Preview: Migrate to API version 3.x  for LUIS apps

The query prediction endpoint APIs have changed. Use this guide to understand how to migrate to version 3 endpoint APIs. 

This V3 API provides the following new features, which include significant JSON request and/or response changes: 

* [External entities](#external-entities-passed-in-at-prediction-time)
* [Dynamic lists](#dynamic-lists-passed-in-at-prediction-time)
* [Prebuilt entity JSON changes](#prebuilt-entities-with-new-json)

<!--
* [Multi-intent detection of utterance](#detect-multiple-intents-within-single-utterance)
-->

The query prediction endpoint [request](#request-changes) and [response](#response-changes) have significant changes to support the new features listed above, including the following:

* [Response object changes](#top-level-json-changes)
* [Entity role name references instead of entity name](#entity-role-name-instead-of-entity-name)
* [Properties to mark entities in utterances](#marking-placement-of-entities-in-utterances)

The following LUIS features are **not supported** in the V3 API:

* Bing Spell Check V7

[Reference documentation](https://aka.ms/luis-api-v3) is available for V3.

## Prebuilt entities with new JSON

The V3 response object changes include [prebuilt entities](luis-reference-prebuilt-entities.md). 

## Request changes 

### Query string parameters

The V3 API has different query string parameters.

|Param name|Type|Version|Purpose|
|--|--|--|--|
|`query`|string|V3 only|**In V2**, the utterance to be predicted is in the `q` parameter. <br><br>**In V3**, the functionality is passed in the `query` parameter.|
|`show-all-intents`|boolean|V3 only|Return all intents with the corresponding score in the **prediction.intents** object. Intents are returned as objects in a parent `intents` object. This allows programmatic access without needing to find the intent in an array: `prediction.intents.give`. In V2, these were returned in an array. |
|`verbose`|boolean|V2 & V3|**In V2**, when set to true, all predicted intents were returned. If you need all predicted intents, use the V3 param of `show-all-intents`.<br><br>**In V3**, this parameter only provides entity metadata details of entity prediction.  |

<!--
|`multiple-segments`|boolean|V3 only|Break utterance into segments and predict each segment for intents and entities.|
-->


### The query prediction JSON body for the `POST` request

```JSON
{
    "query":"your utterance here",
    "options":{
        "timezoneOffset": "-8:00"
    },
    "externalEntities":[],
    "dynamicLists":[]
}
```

## Response changes

The query response JSON changed to allow greater programmatic access to the data used most frequently. 

### Top level JSON changes

The top JSON properties for V2 are, when `verbose` is set to true, which returns all intents and their scores in the `intents` property:

```JSON
{
    "query":"this is your utterance you want predicted",
    "topScoringIntent":{},
    "intents":[],
    "entities":[],
    "compositeEntities":[]
}
```

The top JSON properties for V3 are:

```JSON
{
    "query": "this is your utterance you want predicted",
    "prediction":{
        "normalizedQuery": "this is your utterance you want predicted - after normalization",
        "topIntent": "intent-name-1",
        "intents": {}, 
        "entities":{}
    }
}
```

The `intents` object is an unordered list. Do not assume the first child in the `intents` corresponds to the `topIntent`. Instead, use the `topIntent` value to find the score:

```nodejs
const topIntentName = response.prediction.topIntent;
const score = intents[topIntentName];
```

The response JSON schema changes allow for:

* Clear distinction between original utterance, `query`, and returned prediction, `prediction`.
* Easier programmatic access to predicted data. Instead of enumerating through an array in V2, you can access values by **named** for both intents and entities. For predicted entity roles, the role name is returned because it is unique across the entire app.
* Data types, if determined, are respected. Numerics are no longer returned as strings.
* Distinction between first priority prediction information and additional metadata, returned in the `$instance` object. 

### Access `$instance` for entity metadata

If you need entity metadata, the query string needs to use the `verbose=true` flag and the response contains the metadata in the `$instance` object. Examples are shown in the JSON responses in the following sections.

### Each predicted entity is represented as an array

The `prediction.entities.<entity-name>` object contains an array because each entity can be predicted more than once in the utterance. 

### List entity prediction changes

The JSON for a list entity prediction has changed to be an array of arrays:

```JSON
"entities":{
    "my_list_entity":[
        ["canonical-form-1","canonical-form-2"],
        ["canonical-form-2"]
    ]
}
```
Each interior array corresponds to text inside the utterance. The interior object is an array because the same text can appear in more than one sublist of a list entity. 

When mapping between the `entities` object to the `$instance` object, the order of objects is preserved for the list entity predictions.

```nodejs
const item = 0; // order preserved, use same enumeration for both
const predictedCanonicalForm = entities.my_list_entity[item];
const associatedMetadata = entities.$instance.my_list_entity[item];
```

### Entity role name instead of entity name 

In V2, the `entities` array returned all the predicted entities with the entity name being the unique identifier. In V3, if the entity uses roles and the prediction is for an entity role, the primary identifier is the role name. This is possible because entity role names must be unique across the entire app including other model (intent, entity) names.

In the following example: consider an utterance that includes the text, `Yellow Bird Lane`. This text is predicted as a custom `Location` entity's role of `Destination`.

|Utterance text|Entity name|Role name|
|--|--|--|
|`Yellow Bird Lane`|`Location`|`Destination`|

In V2, the entity is identified by the _entity name_ with the role as a property of the object:

```JSON
"entities":[
    {
        "entity": "Yellow Bird Lane",
        "type": "Location",
        "startIndex": 13,
        "endIndex": 20,
        "score": 0.786378264,
        "role": "Destination"
    }
]
```

In V3, the entity is referenced by the _entity role_, if the prediction is for the role:

```JSON
"entities":{
    "Destination":[
        "Yellow Bird Lane"
    ]
}
```

In V3, the same result with the `verbose` flag to return entity metadata:

```JSON
"entities":{
    "Destination":[
        "Yellow Bird Lane"
    ],
    "$instance":{
        "Destination": [
            {
                "role": "Destination",
                "type": "Location",
                "text": "Yellow Bird Lane",
                "startIndex": 25,
                "length":16,
                "score": 0.9837309,
                "modelTypeId": 1,
                "modelType": "Entity Extractor"
            }
        ]
    }
}
```

## External entities passed in at prediction time

External entities give your LUIS app the ability to identify and label entities during runtime, which can be used as features to existing entities. This allows you to use your own separate and custom entity extractors before sending queries to your prediction endpoint. Because this is done at the query prediction endpoint, you don't need to retrain and publish your model.

The client-application is providing its own entity extractor by managing entity matching and determining the location within the utterance of that matched entity and then sending that information with the request. 

External entities are the mechanism for extending any entity type while still being used as signals to other models like roles, composite and others.

This is useful for an entity that has data available only at query prediction runtime. Examples of this type of data are constantly changing data or specific per user. You can extend a LUIS contact entity with external information from a user’s contact list. 

### Entity already exists in app

The value of `entityName` for the external entity, passed in the endpoint request POST body, must already exist in the trained and published app at the time the request is made. The type of entity doesn't matter, all types are supported.

### First turn in conversation

Consider a first utterance in a chat bot conversation where a user enters the following incomplete information:

`Send Hazem a new message`

The request from the chat bot to LUIS can pass in information in the POST body about `Hazem` so it is directly matched as one of the user’s contacts.

```json
    "externalEntities": [
        {
            "entityName":"contacts",
            "startIndex": 5,
            "entityLength": 5,
            "resolution": {
                "employeeID": "05013",
                "preferredContactType": "TeamsChat"
            }
        }
    ]
```

The prediction response includes that external entity, with all the other predicted entities, because it is defined in the request.  

### Second turn in conversation

The next user utterance into the chat bot uses a more vague term:

`Send him a calendar reminder for the party.`

In the previous utterance, the utterance uses `him` as a reference to `Hazem`. The conversational chat bot, in the POST body, can map `him` to the entity value extracted from the first utterance, `Hazem`.

```json
    "externalEntities": [
        {
            "entityName":"contacts",
            "startIndex": 5,
            "entityLength": 3,
            "resolution": {
                "employeeID": "05013",
                "preferredContactType": "TeamsChat"
            }
        }
    ]
```

The prediction response includes that external entity, with all the other predicted entities, because it is defined in the request.  

#### Resolution

The _optional_ `resolution` property returns in the prediction response, allowing you to pass in the metadata associated with the external entity, then receive it back out in the response. 

The primary purpose is to extend prebuilt entities but it is not limited to that entity type. 

The `resolution` property can be a number, a string, an object, or an array:

* "Dallas"
* {"text": "value"}
* 12345 
* ["a", "b", "c"]


## Dynamic lists passed in at prediction time

Dynamic lists allow you to extend an existing trained and published list entity, already in the LUIS app. 

Use this feature when your list entity values need to change periodically. This feature allows you to extend an already trained and published list entity:

* At the time of the query prediction endpoint request.
* For a single request.

The list entity can be empty in the LUIS app but it has to exist. The list entity in the LUIS app isn't changed, but the prediction ability at the endpoint is extended to include up to 2 lists with about 1,000 items.

### Dynamic list JSON request body

Send in the following JSON body to add a new sublist with synonyms to the list, and predict the list entity for the text, `LUIS`, with the `POST` query prediction request:

```JSON
{
    "query": "Send Hazem a message to add an item to the meeting agenda about LUIS.",
    "options":{
        "timezoneOffset": "-8:00"
    },
    "dynamicLists": [
        {
            "listEntityName":"ProductList",
            "requestLists":[
                {
                    "name": "Azure Cognitive Services",
                    "canonicalForm": "Azure-Cognitive-Services",
                    "synonyms":[
                        "language understanding",
                        "luis",
                        "qna maker"
                    ]
                }
            ]
        }
    ]
}
```

The prediction response includes that list entity, with all the other predicted entities, because it is defined in the request. 

## TimezoneOffset renamed to datetimeReference

**In V2**, the `timezoneOffset` [parameter](luis-concept-data-alteration.md#change-time-zone-of-prebuilt-datetimev2-entity) is sent in the prediction request as a query string parameter, regardless if the request is sent as a GET or POST request. 

**In V3**, the same functionality is provided with the POST body parameter, `datetimeReference`. 

## Marking placement of entities in utterances

**In V2**, an entity was marked in an utterance with the `startIndex` and `endIndex`. 

**In V3**, the entity is marked with `startIndex` and `entityLength`.

## Deprecation 

The V2 API will not be deprecated for at least 9 months after the V3 preview. 

## Next steps

Use the V3 API documentation to update existing REST calls to LUIS [endpoint](https://aka.ms/luis-api-v3) APIs. 