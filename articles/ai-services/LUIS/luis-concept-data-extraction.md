---
title: Data extraction - LUIS
description: Extract data from utterance text with intents and entities. Learn what kind of data can be extracted from Language Understanding (LUIS).
ms.service: cognitive-services
ms.subservice: language-understanding
ms.author: aahi
author: aahill
manager: nitinme
ms.topic: conceptual
ms.date: 03/21/2022
---

# Extract data from utterance text with intents and entities

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

LUIS gives you the ability to get information from a user's natural language utterances. The information is extracted in a way that it can be used by a program, application, or chat bot to take action. In the following sections, learn what data is returned from intents and entities with examples of JSON.

The hardest data to extract is the machine-learning data because it isn't an exact text match. Data extraction of the machine-learning [entities](concepts/entities.md) needs to be part of the [authoring cycle](concepts/application-design.md) until you're confident you receive the data you expect.

## Data location and key usage
LUIS extracts data from the user's utterance at the published [endpoint](luis-glossary.md#endpoint). The **HTTPS request** (POST or GET) contains the utterance as well as some optional configurations such as staging or production environments.

**V2 prediction endpoint request**

`https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<subscription-key>&verbose=true&timezoneOffset=0&q=book 2 tickets to paris`

**V3 prediction endpoint request**

`https://westus.api.cognitive.microsoft.com/luis/v3.0-preview/apps/<appID>/slots/<slot-type>/predict?subscription-key=<subscription-key>&verbose=true&timezoneOffset=0&query=book 2 tickets to paris`

The `appID` is available on the **Settings** page of your LUIS app as well as part of the URL (after `/apps/`) when you're editing that LUIS app. The `subscription-key` is the endpoint key used for querying your app. While you can use your free authoring/starter key while you're learning LUIS, it is important to change the endpoint key to a key that supports your [expected LUIS usage](luis-limits.md#resource-usage-and-limits). The `timezoneOffset` unit is minutes.

The **HTTPS response** contains all the intent and entity information LUIS can determine based on the current published model of either the staging or production endpoint. The endpoint URL is found on the [LUIS](luis-reference-regions.md) website, in the **Manage** section, on the **Keys and endpoints** page.

## Data from intents
The primary data is the top scoring **intent name**. The endpoint response is:

#### [V2 prediction endpoint response](#tab/V2)

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

#### [V3 prediction endpoint response](#tab/V3)

```JSON
{
  "query": "when do you open next?",
  "prediction": {
    "normalizedQuery": "when do you open next?",
    "topIntent": "GetStoreInfo",
    "intents": {
        "GetStoreInfo": {
            "score": 0.984749258
        }
    }
  },
  "entities": []
}
```

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

* * *

|Data Object|Data Type|Data Location|Value|
|--|--|--|--|
|Intent|String|topScoringIntent.intent|"GetStoreInfo"|

If your chatbot or LUIS-calling app makes a decision based on more than one intent score, return all the intents' scores.


#### [V2 prediction endpoint response](#tab/V2)

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

#### [V3 prediction endpoint response](#tab/V3)

Set the querystring parameter, `show-all-intents=true`. The endpoint response is:

```JSON
{
    "query": "when do you open next?",
    "prediction": {
        "normalizedQuery": "when do you open next?",
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

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

* * *

The intents are ordered from highest to lowest score.

|Data Object|Data Type|Data Location|Value|Score|
|--|--|--|--|:--|
|Intent|String|intents[0].intent|"GetStoreInfo"|0.984749258|
|Intent|String|intents[1].intent|"None"|0.0168218873|

If you add prebuilt domains, the intent name indicates the domain, such as `Utilties` or `Communication` as well as the intent:

#### [V2 prediction endpoint response](#tab/V2)

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

#### [V3 prediction endpoint response](#tab/V3)

```JSON
{
    "query": "Turn on the lights next monday at 9am",
    "prediction": {
        "normalizedQuery": "Turn on the lights next monday at 9am",
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

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

* * *

|Domain|Data Object|Data Type|Data Location|Value|
|--|--|--|--|--|
|Utilities|Intent|String|intents[0].intent|"<b>Utilities</b>.ShowNext"|
|Communication|Intent|String|intents[1].intent|<b>Communication</b>.StartOver"|
||Intent|String|intents[2].intent|"None"|


## Data from entities
Most chat bots and applications need more than the intent name. This additional, optional data comes from entities discovered in the utterance. Each type of entity returns different information about the match.

A single word or phrase in an utterance can match more than one entity. In that case, each matching entity is returned with its score.

All entities are returned in the **entities** array of the response from the endpoint

## Tokenized entity returned

Review the [token support](luis-language-support.md#tokenization) in LUIS.


## Prebuilt entity data
[Prebuilt](concepts/entities.md) entities are discovered based on a regular expression match using the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. Prebuilt entities are returned in the entities array and use the type name prefixed with `builtin::`.

## List entity data

[List entities](reference-entity-list.md) represent a fixed, closed set of related words along with their synonyms. LUIS does not discover additional values for list entities. Use the **Recommend** feature to see suggestions for new words based on the current list. If there is more than one list entity with the same value, each entity is returned in the endpoint query.

## Regular expression entity data

A [regular expression entity](reference-entity-regular-expression.md) extracts an entity based on a regular expression you provide.

## Extracting names
Getting names from an utterance is difficult because a name can be almost any combination of letters and words. Depending on what type of name you're extracting, you have several options. The following suggestions are not rules but more guidelines.

### Add prebuilt PersonName and GeographyV2 entities

[PersonName](luis-reference-prebuilt-person.md) and [GeographyV2](luis-reference-prebuilt-geographyV2.md) entities are available in some [language cultures](luis-reference-prebuilt-entities.md).

### Names of people

People's name can have some slight format depending on language and culture. Use either a prebuilt **[personName](luis-reference-prebuilt-person.md)** entity or a **[simple entity](concepts/entities.md)** with roles of first and last name.

If you use the simple entity, make sure to give examples that use the first and last name in different parts of the utterance, in utterances of different lengths, and utterances across all intents including the None intent. [Review](./how-to/improve-application.md) endpoint utterances on a regular basis to label any names that were not predicted correctly.

### Names of places

Location names are set and known such as cities, counties, states, provinces, and countries/regions. Use the prebuilt entity **[geographyV2](luis-reference-prebuilt-geographyv2.md)** to extract location information.

### New and emerging names

Some apps need to be able to find new and emerging names such as products or companies. These types of names are the most difficult type of data extraction. Begin with a **[simple entity](concepts/entities.md)** and add a [phrase list](concepts/patterns-features.md). [Review](./how-to/improve-application.md) endpoint utterances on a regular basis to label any names that were not predicted correctly.

## Pattern.any entity data

[Pattern.any](reference-entity-pattern-any.md) is a variable-length placeholder used only in a pattern's template utterance to mark where the entity begins and ends. The entity used in the pattern must be found in order for the pattern to be applied.

## Sentiment analysis
If sentiment analysis is configured while [publishing](how-to/publish.md), the LUIS json response includes sentiment analysis. Learn more about sentiment analysis in the [Language service](../language-service/sentiment-opinion-mining/overview.md) documentation.

## Key phrase extraction entity data
The [key phrase extraction entity](luis-reference-prebuilt-keyphrase.md) returns key phrases in the utterance, provided by the [Language service](../language-service/key-phrase-extraction/overview.md).

## Data matching multiple entities

LUIS returns all entities discovered in the utterance. As a result, your chat bot may need to make a decision based on the results.

## Data matching multiple list entities

If a word or phrase matches more than one list entity, the endpoint query returns each List entity.

For the query `when is the best time to go to red rock?`, and the app has the word `red` in more than one list, LUIS recognizes all the entities and returns an array of entities as part of the JSON endpoint response.

## Next steps

See [Add entities](how-to/entities.md) to learn more about how to add entities to your LUIS app.
