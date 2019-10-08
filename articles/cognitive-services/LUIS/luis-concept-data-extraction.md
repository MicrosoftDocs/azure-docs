---
title: Data extraction - LUIS
titleSuffix: Azure Cognitive Services
description: Extract data from utterance text with intents and entities. Learn what kind of data can be extracted from Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/07/2019
ms.author: diberry
---

# Extract data from utterance text with intents and entities
LUIS gives you the ability to get information from a user's natural language utterances. The information is extracted in a way that it can be used by a program, application, or chat bot to take action. In the following sections, learn what data is returned from intents and entities with examples of JSON.

The hardest data to extract is the machine-learned data because it isn't an exact text match. Data extraction of the machine-learned [entities](luis-concept-entity-types.md) needs to be part of the [authoring cycle](luis-concept-app-iteration.md) until you're confident you receive the data you expect.

## Prediction URLs
LUIS provides the data from the published [endpoint](luis-glossary.md#endpoint). The **HTTPS request** (POST or GET) contains the utterance as well as some optional configurations such as staging or production environments.

In the following request strings, `westus` is used as an example. 

#### [V3 slot prediction request](#tab/1-1)

`https://westus.api.cognitive.microsoft.com/luis/v3.0/apps/<appID>/slots/<slot-type>/predict?subscription-key=<subscription-key>&show-all-intents=true&verbose=true&timezoneOffset=0&query=book 2 tickets to paris`

#### [V3 version prediction request](#tab/1-2)

`https://westus.api.cognitive.microsoft.com/luis/v3.0/apps/<appID>/versions/<version>/predict?subscription-key=<subscription-key>&show-all-intents=true&verbose=true&timezoneOffset=0&query=book 2 tickets to paris`

#### [V2 prediction request](#tab/1-3)

`https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<subscription-key>&verbose=true&timezoneOffset=0&q=book 2 tickets to paris`
* * * 

The `appID` is available on the **Settings** page of your LUIS app as well as part of the URL (after `/apps/`) when you're editing that LUIS app. The `subscription-key` is the endpoint key used for querying your app. While you can use your free authoring/starter key while you're learning LUIS, it is important to change the endpoint key to a key that supports your [expected LUIS usage](luis-boundaries.md#key-limits). The `timezoneOffset` unit is minutes.

The **HTTPS response** contains all the intent and entity information LUIS can determine based on the current published model of either the staging or production endpoint. The endpoint URL is found on the [LUIS](luis-reference-regions.md) website, in the **Manage** section, on the **Keys and endpoints** page.

## Data from intents

Data guidelines about intent extraction:

* Only one top scoring intent is identified
* If more than one intent is contained within the utterance, LUIS predicts the utterance as a single intent.

### Top intent only

#### [V3 response](#tab/2-1)

|Data Object|Data Type|Data Location|Value|
|--|--|--|--|
|Intent|String|prediction.topIntent|"GetStoreInfo"|

```JSON
{
  "query": "when do you open next?",
  "prediction": {
    "topIntent": "GetStoreInfo",
    "intents": {
        "GetStoreInfo": {
            "score": 0.984749258
        }
    }
  },
  "entities": []
```

#### [V2 response](#tab/2-2)


```JSON
{
  "query": "when do you open next?",
  "topScoringIntent": {
    "intent": "GetStoreInfo",
    "score": 0.984749258
  },
  "entities": []
}
```
* * * 

### All intents

Data guidelines about all intent extraction:

* Return all intents if you want the threshold determined in the client application.
* Return all intents if you want to perform an action based on the intent's individual score.
* Return all intents if you want to perform analytics on prediction results.


#### [V3 response](#tab/3-1)

Set the querystring parameter, `show-all-intents=true`. The endpoint response is:

```JSON
{
    "query": "when do you open next?",
    "prediction": {
        "topIntent": "GetStoreInfo",
        "intents": {
            "GetStoreInfo": {
                "score": 0.984749258
            },
            "None": {
                 "score": 0.2040639
            }
        },
        "entities": {
        }
    }
}
```

The intents are ordered from highest to lowest score.

|Data Object|Data Type|Data Location|Value|Score|
|--|--|--|--|:--|
|Intent|String|prediction.intents["GetStoreInfo"]|0.984749258|
|Intent|String|prediction.intents["None"]|0.0168218873|


#### [V2 response](#tab/3-2)

Set the querystring parameter, `verbose=true`. The endpoint response is:

```JSON
{
  "query": "when do you open next?",
  "topScoringIntent": {
    "intent": "GetStoreInfo",
    "score": 0.984749258
  },
  "intents": [
    {
      "intent": "GetStoreInfo",
      "score": 0.984749258
    },
    {
      "intent": "None",
      "score": 0.2040639
    }
  ],
  "entities": []
}
```

The intents are ordered from highest to lowest score.

|Data Object|Data Type|Data Location|Value|Score|
|--|--|--|--|:--|
|Intent|String|intents[0].intent|"GetStoreInfo"|0.984749258|
|Intent|String|intents[1].intent|"None"|0.0168218873|

* * * 

### Prebuilt domain intents

If you add prebuilt domains, the intent name indicates the domain, such as `Utilties` or `Communication` as well as the intent:

#### [V3 response](#tab/3-1)

```JSON
{
    "query": "Turn on the lights next monday at 9am",
    "prediction": {
        "topIntent": "Utilities.ShowNext",
        "intents": {
            "Utilities.ShowNext": {
                "score": 0.07842206
            },
            "Communication.StartOver": {
                "score": 0.0239675418
            },
            "None": {
                "score": 0.00085447653
            }
        },
        "entities": []
    }
}
```

The intents are ordered from highest to lowest score.

|Data Object|Data Type|Data Location|Value|Score|
|--|--|--|--|:--|
|Intent|String|prediction.intents["Utilities.ShowNext"]|0.07842206|
|Intent|String|prediction.intents["StartOver"]|0.0239675418|
|Intent|String|prediction.intents["None"]|0.00085447653|

#### [V2 response](#tab/3-2)

```JSON
{
  "query": "Turn on the lights next monday at 9am",
  "topScoringIntent": {
    "intent": "Utilities.ShowNext",
    "score": 0.07842206
  },
  "intents": [
    {
      "intent": "Utilities.ShowNext",
      "score": 0.07842206
    },
    {
      "intent": "Communication.StartOver",
      "score": 0.0239675418
    },
    {
      "intent": "None",
      "score": 0.0168218873
    }],
  "entities": []
}
```

|Domain|Data Object|Data Type|Data Location|Value|
|--|--|--|--|--|
|Utilities|Intent|String|intents[0].intent|"<b>Utilities</b>.ShowNext"|
|Communication|Intent|String|intents[1].intent|<b>Communication</b>.StartOver"|
||Intent|String|intents[2].intent|"None"|

* * * 

## Data from entities

Most bots and applications need more than the intent name to fullfil the customer intent. This additional, optional data comes from entities discovered in the utterance. Each type of entity returns different information about the match.

Data is extracted when data matches an entity definition. Due to the range of entities, the same text can match multiple entities. All entities matched are returned. It is up to the client application to determine which entity to use. 


## Entity roles data
Entity roles are contextual differences of entities. When the utterance is predicted to match that contextual role, the role is returned. 

## Sentiment analysis
If Sentiment analysis is configured, the LUIS json response includes sentiment analysis. Learn more about sentiment analysis in the [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/) documentation.

### Sentiment data
Sentiment data is a score between 1 and 0 indicating the positive (closer to 1) or negative (closer to 0) sentiment of the data.

When culture is `en-us`, the response is:

```JSON
"sentimentAnalysis": {
  "label": "positive",
  "score": 0.9163064
}
```

For all other cultures, the response is:

```JSON
"sentimentAnalysis": {
  "score": 0.9163064
}
```


## Next steps

See [Add entities](luis-how-to-add-entities.md) to learn more about how to add entities to your LUIS app.
