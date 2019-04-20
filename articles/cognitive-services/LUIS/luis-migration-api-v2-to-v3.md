---
title: V2 to V3 API Migration  
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


# Preview: Migrate to API version 3.x  for LUIS apps

The query prediction endpoint APIs have changed. Use this guide to understand how to migrate to version 3 endpoint APIs. 

This V3 API provides the following new features: 

* [External entities](#pass-in-external-entities-at-prediction-time)
* [Dynamic lists](#pass-in-dynamic-lists-at-prediction-time)
* [Multi-intent](#multi-intent-prediction)

The following LUIS features are **not supported** in V3:

* Bing Spell Check V7

The query prediction endpoint [request](#changes-to-the-query-prediction-endpoint-request) and [response](#changes-to-the-query-prediction-endpoint-response) have significant changes, including the following:

* [Top level changes](#top-level-json-changes)
* [Entity role name instead of entity name](#entity-role-name-instead-of-entity-name)
* [Prebuilt domain changes](#prebuilt-domains-with-new-models-and-language-coverage)
* [Prebuilt entity changes](#prebuilt-entities-with-new-json)

[Reference documentation](https://aka.ms/luis-api-v3) is available for V3.

## Pass in external entities at prediction time

External entities give your LUIS app the ability to identify and label entities during runtime, which can be used as features to existing entities. This allows you to provide your own separate and custom entity extractors to the query prediction endpoint. Because this is done at the query prediction endpoint, you don't need to retrain and publish your model.

The client-application is providing its own entity extractor by managing entity matching and determining the location within the utterance of that matched entity and then sending that information with the request. 

External entities are the mechanism for extending any entity type while still being used as signals to other models like roles, composite and others.

This is useful for an entity that has data available only at runtime. Examples of this type of data are constantly changing data or specific per user. You can extend a LUIS contact entity with external information from a user’s contact list. 

`Send Hazem a new message`, where `Hazem` is directly matched as one of the user’s contacts.

In a [multi-intent](#multi-intent-prediction) utterance, you can use the external entity data to help with secondary references. For example, in the utterance `Send Hazem a new message, and let him know about the party.`, two segments of the utterance are predicted:

* `Send Hazem a new message, and`
* `let him know about the party.`

The first segment can correctly predict Hazem when the external entity is sent with the prediction request. The second segment won't know that `him` is a secondary reference to the same data unless you send it with the request and mark it as the same entity.

This feature includes significant [JSON request and response changes](#json-request-and-response-changes-for-external-entities). 

## Pass in dynamic lists at prediction time

Dynamic lists allow you to update and extend an existing trained and published list entity, already in the LUIS app. 

Use this feature when your list entity values need to change periodically. This feature allows up to update an already trained and published list entity:

* At the time of the query prediction endpoint request.
* For a period of time or a single request.

This feature includes significant [JSON response changes](#json-request-and-response-for-dynamic-list). 

## Multi-intent prediction

This feature identifies multiple intents from as utterance, enabling better understanding of complex and compound utterances that include more than one action.

This feature includes significant [JSON response changes](#detect-multiple-intents-within-single-utterance). 

## Changes impacting both request and response of query prediction endpoint 

### Changes to identifying placement of entities in utterances

In V2, an entity was marked in an utterance with the `startIndex` and `endIndex`. 
In V3, the entity is marked with `startIndex` and `entityLength`.

## Changes to the query prediction endpoint request

### V3 Query string parameters

The V3 API has different query string parameters.

|Param name|Type|Version|Purpose|
|--|--|--|--|
|`multiple-segments`|boolean|V3|Break utterance into segments and predict each segment for intents and entities.|
|`query`|string|V3|**In V2**, the utterance to be predicted is in the `q` parameter. <br><br>**In V3**, the functionality is passed in the `query` parameter.|
|`show-all-intents`|boolean|V3 only|Return all intents with the corresponding score in the **prediction.intents** object. Intents are returned as objects in a parent `intents` object. This allows programmatic access without needing to find the intent in an array: `prediction.intents.give`. In V2, these were returned in an array. |
|`verbose`|boolean|V2 & V3|**In V2**, when set to true, all predicted intents were returned. If you need all predicted intents, use the V3 param of `show-all-intents`.<br><br>**In V3**, this parameter only provides entity metadata details of entity prediction.  |

### Changes to the query prediction JSON body for the `POST` request

```JSON
"query":"your utterance here",
"options":{
    "timezoneOffset": "-8:00"
},
"externalEntities":[],
"dynamicLists":[]
```

## Changes to the query prediction endpoint response

The query response JSON changed to allow greater programmatic access to the data used most frequently. 

### Top level JSON changes

The top JSON properties for V2 are, when `verbose` is set to true, which returns all intents and their scores in the `intents` property:

```JSON
"query":"this is your utterance you want predicted",
"topScoringIntent":{},
"intents":[],
"entities":[],
"compositeEntities":[]
```

The top JSON properties for V3 are:

```JSON
"query": "this is your utterance you want predicted",
"prediction":{
    "normalizedQuery": "this is your utterance you want predicted - after normalization",
    "topIntent": "intent-name-1",
    "intents": {}, 
    "entities":{}
}
```

The schema changes allow for:

* Clear distinction between original utterance, `query`, and returned prediction, `prediction`.
* Easier programmatic access to predicted data. Instead of enumerating through an array in V2, you can access values by **named** for both intents and entities. For predicted entity roles, the role name is returned because it is unique across the entire app.
* Data types, if determined, are respected. Numerics are no longer returned as strings.
* Distinction between first priority prediction information and additional metadata, returned in the `$instance` object. 

#### Entity role name instead of entity name 

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
                "role": "Role1",
                "type": "simple",
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

### JSON request and response changes for external entities

#### JSON request body format for external entities

Send in the following JSON body to mark the person's name, `Hazem`, as an external entity with the `POST` query prediction request:

```JSON
{
    "query": "Send Hazem a new message.",
    "options":{
        "timezoneOffset": "-8:00"
    },
    "externalEntities": [
        {
            "entityName":"my-entity-name-already-in-LUIS-app",
            "startIndex": 5,
            "entityLength": 5
        }
    ]
}
```

The entity name, `my-entity-name-already-in-LUIS-app`, exists in the trained and published app at the time the request is made. The type of entity doesn't matter, all types are supported.

The prediction response includes that external entity, with all the other predicted entities, because it is defined in the request.  

### JSON request and response for Dynamic lists

#### JSON request body format for dynamic lists

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

### Detect multiple intents within single utterance

The V3 endpoint query supports multi-intent query predictions if `multiple-segments=true` is passed in the query string. This means each sentence can have its own intent prediction.

In the V2 endpoint success response, the entire utterance is predicted to a single intent.

In the V3 endpoint success response, each segment is predicted including entities:

```json
{
    "query": "Carol goes to Cairo and Mohamed attends the meeting",
    "prediction": {
        "normalizedQuery": "carol goes to cairo and mohamed attends the meeting",
        "topIntent": "Meetings",
        "intents": {
            "Travel": {
                "score": 0.6123635
            },
            "MultipleSegments": {
                "segments": [
                    {
                        "normalizedQuery": "Carol goes to Cairo and",
                        "topIntent": "Travel",
                        "intents": {
                            "Travel": {
                                "score": 0.6826963
                            }
                        },
                        "entities": {
                            "geographyV2": [
                                "Cairo"
                            ],
                            "personName": [
                                "Carol"
                            ]
                        }
                    },
                    {
                        "normalizedQuery": "and Mohamed attends the meeting",
                        "topIntent": "Meetings",
                        "intents": {
                            "Meetings": {
                                "score": 0.7100854
                            }
                        },
                        "entities": {
                            "personName": [
                                "Mohamed"
                            ]
                        }
                    }
                ]
            }
        },
        "entities": {
            "geographyV2": [
                "Cairo"
            ],
            "personName": [
                "Carol",
                "Mohamed"
            ]
        }
    }
}
```

You can use `multiple-segments=true` with `verbose=true` to get the entity metadata.

If multiple segments are not identified, value of `MultipleSegments` is `none`.

#### Segment splitting tokens

Segments are split based on tokens such as:

Verbs are the primary splitting tokens. For example, where N represents a noun and V represents a verb, and you have an utterance schema that can be defined as `N V N N V N N`, the two segments will be `N V N N`, and `V N N`. 

LUIS doesn't split into segments when:

* Utterance has consecutive verbs. 
* Entity is at the end of the utterance.

### Prebuilt domains with new models and language coverage

Review the [V3 API list of prebuilt domains](luis-reference-prebuilt-domains.md). These domains are more complete, both in the model, and the language coverage. 

### Prebuilt entities with new JSON

The following prebuilt entities have JSON schema changes:

* [Age](luis-reference-prebuilt-age.md#preview-api-version-3x)
* [Currency (Money)](luis-reference-prebuilt-currency.md#preview-api-version-3x)
* [DateTimeV2](luis-reference-prebuilt-datetimev2.md#preview-api-version-3x)
* [Dimension](luis-reference-prebuilt-dimension.md#preview-api-version-3x)
* [Email](luis-reference-prebuilt-email.md#preview-api-version-3x)
* [GeographyV2](luis-reference-prebuilt-geographyv2.md#preview-api-version-3x)
* [Number](luis-reference-prebuilt-number.md#preview-api-version-3x)
* [Ordinal](luis-reference-prebuilt-ordinal.md#preview-api-version-3x)
* [Percentage](luis-reference-prebuilt-percentage.md#preview-api-version-3x)
* [PersonName](luis-reference-prebuilt-person.md#preview-api-version-3x)
* [Phonenumber](luis-reference-prebuilt-phonenumber.md#preview-api-version-3x)
* [Temperature](luis-reference-prebuilt-temperature.md#preview-api-version-3x)
* [URL](luis-reference-prebuilt-url.md#preview-api-version-3x)


## Next steps

Use the V3 API documentation to update existing REST calls to LUIS [endpoint](https://aka.ms/luis-api-v3) APIs. 