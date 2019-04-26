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
ms.date: 05/07/2019
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

[Reference documentation](https://aka.ms/luis-preview-api-v3) is available for V3.

## Prebuilt domains with new models and language coverage

Review the [V3 API list of prebuilt domains](luis-reference-prebuilt-domains.md). These domains are more complete, both in the model, and the language coverage. 

## Prebuilt entities with new JSON

The following prebuilt entities have JSON schema changes for the V3 API:

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

`Send Hazem a new message`, where `Hazem` is directly matched as one of the user’s contacts.

<!--

In a [multi-intent](#detect-multiple-intents-within-single-utterance) utterance, you can use the external entity data to help with secondary references. For example, in the utterance `Send Hazem a new message, and let him know about the party.`, two segments of the utterance are predicted:

* `Send Hazem a new message, and`
* `let him know about the party.`

The first segment can correctly predict Hazem when the external entity is sent with the prediction request. The second segment won't know that `him` is a secondary reference to the same data unless you send it with the request and mark it as the same entity.

-->

### External entities JSON request body 

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
            "entityLength": 5,
            "resolution": {
                "employee": "program manager",
                "type": "individual contributor"
            }
        }
    ]
}
```

The prediction response includes that external entity, with all the other predicted entities, because it is defined in the request.  

#### Entity already exists in app

The entity name, `my-entity-name-already-in-LUIS-app`, exists in the trained and published app at the time the request is made. The type of entity doesn't matter, all types are supported.

#### Resolution

The _optional_ `resolution` property returns in the prediction response, allowing you to pass in the metadata associated with the external entity, then receive it back out in the response. 

The primary purpose is to extend prebuilt entities but it is not limited to that entity type. 

The `resolution` property can be a number, a string, an object, or an array:

* "Dallas"
* {"text": "value"}
* 12345 
* ["a", "b", "c"]

<!--
Returned JSON response is:

```JSON
not sure what to do here
```
-->

## Dynamic lists passed in at prediction time

Dynamic lists allow you to update and extend an existing trained and published list entity, already in the LUIS app. 

Use this feature when your list entity values need to change periodically. This feature allows you to update an already trained and published list entity:

* At the time of the query prediction endpoint request.
* For a single request.

The list entity can be empty in the LUIS app but it has to exist. 

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

<!--


## Detect multiple intents within single utterance

This feature identifies multiple intents from an utterance, enabling better understanding of complex and compound utterances that include more than one action. There is not prerequisite, or change needed to support this, in the LUIS app for this feature to work. It happens at the query prediction runtime if the associated query string parameter is passed in. 

The V3 query prediction endpoint supports multi-intent query predictions if `multiple-segments=true` is passed in the query string. This means each sentence can have its own intent prediction.

You can use `multiple-segments=true` with `verbose=true` to get the entity metadata for each individual segment.

If multiple segments are not identified, value of the `MultipleSegments` property in the response is `none`.

In **Review endpoint utterances**, the segments are displayed and not the whole query.

In the endpoint logs, an additional boolean column indicates if the query is a multi-intent prediction.

In the V2 endpoint success response, the entire utterance is predicted to a single intent.

### Multiple intents JSON response

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

### Segment splitting tokens

Segments are split based on tokens such as:

Verbs are the primary splitting tokens. For example, where N represents a noun and V represents a verb, and you have an utterance schema that can be defined as `N V N N V N N`, the two segments will be `N V N N`, and `V N N`. 

LUIS doesn't split into segments when:

* Utterance has consecutive verbs. 
* Entity is at the end of the utterance.

--->

## Marking placement of entities in utterances

**In V2**, an entity was marked in an utterance with the `startIndex` and `endIndex`. 

**In V3**, the entity is marked with `startIndex` and `entityLength`.


## Next steps

Use the V3 API documentation to update existing REST calls to LUIS [endpoint](https://aka.ms/luis-api-v3) APIs. 