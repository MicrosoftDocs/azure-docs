---
title: Extend app at runtime - LUIS
description: Learn how to extend an already published prediction endpoint to pass new information.
ms.service: azure-ai-language
ms.author: aahi
author: aahill
manager: nitinme
ms.subservice: azure-ai-luis
ms.topic: conceptual
ms.date: 04/14/2020
---
# Extend app at prediction runtime

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


The app's schema (models and features) is trained and published to the prediction endpoint. This published model is used on the prediction runtime. You can pass new information, along with the user's utterance, to the prediction runtime to augment the prediction.

Two prediction runtime schema changes include:
* [External entities](#external-entities)
* [Dynamic lists](#dynamic-lists)

<a name="external-entities-passed-in-at-prediction-time"></a>

## External entities

External entities give your LUIS app the ability to identify and label entities during runtime, which can be used as features to existing entities. This allows you to use your own separate and custom entity extractors before sending queries to your prediction endpoint. Because this is done at the query prediction endpoint, you don't need to retrain and publish your model.

The client-application is providing its own entity extractor by managing entity matching and determining the location within the utterance of that matched entity and then sending that information with the request.

External entities are the mechanism for extending any entity type while still being used as signals to other models.

This is useful for an entity that has data available only at query prediction runtime. Examples of this type of data are constantly changing data or specific per user. You can extend a LUIS contact entity with external information from a user's contact list.

External entities are part of the V3 authoring API. Learn more about [migrating](luis-migration-api-v3.md) to this version.

### Entity already exists in app

The value of `entityName` for the external entity, passed in the endpoint request POST body, must already exist in the trained and published app at the time the request is made. The type of entity doesn't matter, all types are supported.

### First turn in conversation

Consider a first utterance in a chat bot conversation where a user enters the following incomplete information:

`Send Hazem a new message`

The request from the chat bot to LUIS can pass in information in the POST body about `Hazem` so it is directly matched as one of the user's contacts.

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

In this turn of the conversation, the utterance uses `him` as a reference to `Hazem`. The conversational chat bot, in the POST body, can map `him` to the entity value extracted from the first utterance, `Hazem`.

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

### Override existing model predictions

The `preferExternalEntities` options property specifies that if the user sends an external entity that overlaps with a predicted entity with the same name, LUIS chooses the entity passed in or the entity existing in the model.

For example, consider the query `today I'm free`. LUIS detects `today` as a datetimeV2 with the following response:

```JSON
"datetimeV2": [
    {
        "type": "date",
        "values": [
            {
                "timex": "2019-06-21",
                "value": "2019-06-21"
            }
        ]
    }
]
```

If the user sends the external entity:

```JSON
{
    "entityName": "datetimeV2",
    "startIndex": 0,
    "entityLength": 5,
    "resolution": {
        "date": "2019-06-21"
    }
}
```

If the `preferExternalEntities` is set to `false`, LUIS returns a response as if the external entity were not sent.

```JSON
"datetimeV2": [
    {
        "type": "date",
        "values": [
            {
                "timex": "2019-06-21",
                "value": "2019-06-21"
            }
        ]
    }
]
```

If the `preferExternalEntities` is set to `true`, LUIS returns a response including:

```JSON
"datetimeV2": [
    {
        "date": "2019-06-21"
    }
]
```



#### Resolution

The _optional_ `resolution` property returns in the prediction response, allowing you to pass in the metadata associated with the external entity, then receive it back out in the response.

The primary purpose is to extend prebuilt entities but it is not limited to that entity type.

The `resolution` property can be a number, a string, an object, or an array:

* "Dallas"
* {"text": "value"}
* 12345
* ["a", "b", "c"]

<a name="dynamic-lists-passed-in-at-prediction-time"></a>

## Dynamic lists

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
            "listEntity*":"ProductList",
            "requestLists":[
                {
                    "name": "Azure AI services",
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

## Next steps

* [Prediction score](luis-concept-prediction-score.md)
* [Authoring API V3 changes](luis-migration-api-v3.md)
