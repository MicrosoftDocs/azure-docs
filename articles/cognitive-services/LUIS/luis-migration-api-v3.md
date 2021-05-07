---
title: Prediction endpoint changes in the V3 API
description: The query prediction endpoint V3 APIs have changed. Use this guide to understand how to migrate to version 3 endpoint APIs.
ms.service: cognitive-services
author: aahill
ms.manager: nitinme
ms.author: aahi
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 04/21/2021

---


# Prediction endpoint changes for V3

The query prediction endpoint V3 APIs have changed. Use this guide to understand how to migrate to version 3 endpoint APIs.

**Generally available status** - this V3 API include significant JSON request and response changes from V2 API.

The V3 API provides the following new features:

* [External entities](schema-change-prediction-runtime.md#external-entities-passed-in-at-prediction-time)
* [Dynamic lists](schema-change-prediction-runtime.md#dynamic-lists-passed-in-at-prediction-time)
* [Prebuilt entity JSON changes](#prebuilt-entity-changes)

The prediction endpoint [request](#request-changes) and [response](#response-changes) have significant changes to support the new features listed above, including the following:

* [Response object changes](#top-level-json-changes)
* [Entity role name references instead of entity name](#entity-role-name-instead-of-entity-name)
* [Properties to mark entities in utterances](#marking-placement-of-entities-in-utterances)

[Reference documentation](https://aka.ms/luis-api-v3) is available for V3.

## V3 changes from preview to GA

V3 made the following changes as part of the move to GA:

* The following prebuilt entities have different JSON responses:
    * [OrdinalV1](luis-reference-prebuilt-ordinal.md)
    * [GeographyV2](luis-reference-prebuilt-geographyv2.md)
    * [DatetimeV2](luis-reference-prebuilt-datetimev2.md)
    * Measurable unit key name from `units` to `unit`

* Request body JSON change:
    * from `preferExternalEntities` to `preferExternalEntities`
    * optional `score` parameter for external entities

* Response body JSON changes:
    * `normalizedQuery` removed

## Suggested adoption strategy

If you use Bot Framework, Bing Spell Check V7, or want to migrate your LUIS app authoring only, continue to use the V2 endpoint.

If you know none of your client application or integrations (Bot Framework, and Bing Spell Check V7) are impacted and you are comfortable migrating your LUIS app authoring and your prediction endpoint at the same time, begin using the V3 prediction endpoint. The V2 prediction endpoint will still be available and is a good fall-back strategy.

For information on using the Bing Spell Check API, see [How to correct misspelled words](luis-tutorial-bing-spellcheck.md).


## Not supported

### Bot Framework and Azure Bot Service client applications

Continue to use the V2 API prediction endpoint until the V4.7 of the Bot Framework is released.


## Endpoint URL changes

### Changes by slot name and version name

The [format of the V3 endpoint HTTP](developer-reference-resource.md#rest-endpoints) call has changed.

If you want to query by version, you first need to [publish via API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c3b) with `"directVersionPublish":true`. Query the endpoint referencing the version ID instead of the slot name.

|Valid values for `SLOT-NAME`|
|--|
|`production`|
|`staging`|

## Request changes

### Query string changes

[!INCLUDE [V3 query params](./includes/v3-prediction-query-params.md)]

### V3 POST body

```JSON
{
    "query":"your utterance here",
    "options":{
        "datetimeReference": "2019-05-05T12:00:00",
        "preferExternalEntities": true
    },
    "externalEntities":[],
    "dynamicLists":[]
}
```

|Property|Type|Version|Default|Purpose|
|--|--|--|--|--|
|`dynamicLists`|array|V3 only|Not required.|[Dynamic lists](schema-change-prediction-runtime.md#dynamic-lists-passed-in-at-prediction-time) allow you to extend an existing trained and published list entity, already in the LUIS app.|
|`externalEntities`|array|V3 only|Not required.|[External entities](schema-change-prediction-runtime.md#external-entities-passed-in-at-prediction-time) give your LUIS app the ability to identify and label entities during runtime, which can be used as features to existing entities. |
|`options.datetimeReference`|string|V3 only|No default|Used to determine [datetimeV2 offset](luis-concept-data-alteration.md#change-time-zone-of-prebuilt-datetimev2-entity). The format for the datetimeReference is [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601).|
|`options.preferExternalEntities`|boolean|V3 only|false|Specifies if user's [external entity (with same name as existing entity)](schema-change-prediction-runtime.md#override-existing-model-predictions) is used or the existing entity in the model is used for prediction. |
|`query`|string|V3 only|Required.|**In V2**, the utterance to be predicted is in the `q` parameter. <br><br>**In V3**, the functionality is passed in the `query` parameter.|

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
* Easier programmatic access to predicted data. Instead of enumerating through an array in V2, you can access values by **name** for both intents and entities. For predicted entity roles, the role name is returned because it is unique across the entire app.
* Data types, if determined, are respected. Numerics are no longer returned as strings.
* Distinction between first priority prediction information and additional metadata, returned in the `$instance` object.

### Entity response changes

#### Marking placement of entities in utterances

**In V2**, an entity was marked in an utterance with the `startIndex` and `endIndex`.

**In V3**, the entity is marked with `startIndex` and `entityLength`.

#### Access `$instance` for entity metadata

If you need entity metadata, the query string needs to use the `verbose=true` flag and the response contains the metadata in the `$instance` object. Examples are shown in the JSON responses in the following sections.

#### Each predicted entity is represented as an array

The `prediction.entities.<entity-name>` object contains an array because each entity can be predicted more than once in the utterance.

<a name="prebuilt-entities-with-new-json"></a>

#### Prebuilt entity changes

The V3 response object includes changes to prebuilt entities. Review [specific prebuilt entities](luis-reference-prebuilt-entities.md) to learn more.

#### List entity prediction changes

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

<a name="external-entities-passed-in-at-prediction-time"></a>
<a name="override-existing-model-predictions"></a>

## Extend the app at prediction time

Learn [concepts](schema-change-prediction-runtime.md) about how to extend the app at prediction runtime.


## Next steps

Use the V3 API documentation to update existing REST calls to LUIS [endpoint](https://westcentralus.dev.cognitive.microsoft.com/docs/services/luis-endpoint-api-v3-0/operations/5cb0a9459a1fe8fa44c28dd8) APIs.
