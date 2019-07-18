---
title: Data extraction
titleSuffix: Language Understanding - Azure Cognitive Services
description: Extract data from utterance text with intents and entities. Learn what kind of data can be extracted from Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 04/01/2019
ms.author: diberry
---

# Extract data from utterance text with intents and entities
LUIS gives you the ability to get information from a user's natural language utterances. The information is extracted in a way that it can be used by a program, application, or chat bot to take action. In the following sections, learn what data is returned from intents and entities with examples of JSON.

The hardest data to extract is the machine-learned data because it isn't an exact text match. Data extraction of the machine-learned [entities](luis-concept-entity-types.md) needs to be part of the [authoring cycle](luis-concept-app-iteration.md) until you're confident you receive the data you expect.

## Data location and key usage
LUIS provides the data from the published [endpoint](luis-glossary.md#endpoint). The **HTTPS request** (POST or GET) contains the utterance as well as some optional configurations such as staging or production environments.

`https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<appID>?subscription-key=<subscription-key>&verbose=true&timezoneOffset=0&q=book 2 tickets to paris`

The `appID` is available on the **Settings** page of your LUIS app as well as part of the URL (after `/apps/`) when you're editing that LUIS app. The `subscription-key` is the endpoint key used for querying your app. While you can use your free authoring/starter key while you're learning LUIS, it is important to change the endpoint key to a key that supports your [expected LUIS usage](luis-boundaries.md#key-limits). The `timezoneOffset` unit is minutes.

The **HTTPS response** contains all the intent and entity information LUIS can determine based on the current published model of either the staging or production endpoint. The endpoint URL is found on the [LUIS](luis-reference-regions.md) website, in the **Manage** section, on the **Keys and endpoints** page.

## Data from intents
The primary data is the top scoring **intent name**. Using the `MyStore` [quickstart](luis-quickstart-intents-only.md), the endpoint response is:

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

|Data Object|Data Type|Data Location|Value|
|--|--|--|--|
|Intent|String|topScoringIntent.intent|"GetStoreInfo"|

If your chatbot or LUIS-calling app makes a decision based on more than one intent score, return all the intents' scores by setting the querystring parameter, `verbose=true`. The endpoint response is:

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

If you add prebuilt domains, the intent name indicates the domain, such as `Utilties` or `Communication` as well as the intent:

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


## Data from entities
Most chatbots and applications need more than the intent name. This additional, optional data comes from entities discovered in the utterance. Each type of entity returns different information about the match.

A single word or phrase in an utterance can match more than one entity. In that case, each matching entity is returned with its score.

All entities are returned in the **entities** array of the response from the endpoint:

```JSON
"entities": [
  {
    "entity": "bob jones",
    "type": "Name",
    "startIndex": 0,
    "endIndex": 8,
    "score": 0.473899543
  },
  {
    "entity": "3",
    "type": "builtin.number",
    "startIndex": 16,
    "endIndex": 16,
    "resolution": {
      "value": "3"
    }
  }
]
```

## Tokenized entity returned
Several [cultures](luis-language-support.md#tokenization) return the entity object with the `entity` value [tokenized](luis-glossary.md#token). The startIndex and endIndex returned by LUIS in the entity object do not map to the new, tokenized value but instead to the original query in order for you to extract the raw entity programmatically. 

For example, in German, the word `das Bauernbrot` is tokenized into `das bauern brot`. The tokenized value, `das bauern brot`, is returned and the original value can be programmatically determined from the startIndex and endIndex of the original query, giving you `das Bauernbrot`.

## Simple entity data

A [simple entity](luis-concept-entity-types.md) is a machine-learned value. It can be a word or phrase.

`Bob Jones wants 3 meatball pho`

In the previous utterance, `Bob Jones` is labeled as a simple `Customer` entity.

The data returned from the endpoint includes the entity name, the discovered text from the utterance, the location of the discovered text, and the score:

```JSON
"entities": [
  {
  "entity": "bob jones",
  "type": "Customer",
  "startIndex": 0,
  "endIndex": 8,
  "score": 0.473899543
  }
]
```

|Data object|Entity name|Value|
|--|--|--|
|Simple Entity|`Customer`|`bob jones`|

## Composite entity data
[Composite](luis-concept-entity-types.md) entities are machine-learned and can include a word or phrase. For example, consider a composite entity of prebuilt `number` and `Location::ToLocation` with the following utterance:

`book 2 tickets to paris`

Notice that `2`, the number, and `paris`, the ToLocation have words between them that are not part of any of the entities. The green underline, used in a labeled utterance in the [LUIS](luis-reference-regions.md) website, indicates a composite entity.

![Composite Entity](./media/luis-concept-data-extraction/composite-entity.png)

Composite entities are returned in a `compositeEntities` array and all entities within the composite are also returned in the `entities` array:

```JSON

"entities": [
    {
    "entity": "2 tickets to cairo",
    "type": "ticketInfo",
    "startIndex": 0,
    "endIndex": 17,
    "score": 0.67200166
    },
    {
    "entity": "2",
    "type": "builtin.number",
    "startIndex": 0,
    "endIndex": 0,
    "resolution": {
        "subtype": "integer",
        "value": "2"
    }
    },
    {
    "entity": "cairo",
    "type": "builtin.geographyV2",
    "startIndex": 13,
    "endIndex": 17
    }
],
"compositeEntities": [
    {
    "parentType": "ticketInfo",
    "value": "2 tickets to cairo",
    "children": [
        {
        "type": "builtin.geographyV2",
        "value": "cairo"
        },
        {
        "type": "builtin.number",
        "value": "2"
        }
    ]
    }
]
```    

|Data object|Entity name|Value|
|--|--|--|
|Prebuilt Entity - number|"builtin.number"|"2"|
|Prebuilt Entity - GeographyV2|"Location::ToLocation"|"paris"|

## List entity data

A [list](luis-concept-entity-types.md) entity isn't machine-learned. It is an exact text match. A list represents items in the list along with synonyms for those items. LUIS marks any match to an item in any list as an entity in the response. A synonym can be in more than one list.

Suppose the app has a list, named `Cities`, allowing for variations of city names including city of airport (Sea-tac), airport code (SEA), postal zip code (98101), and phone area code (206).

|List item|Item synonyms|
|---|---|
|`Seattle`|`sea-tac`, `sea`, `98101`, `206`, `+1` |
|`Paris`|`cdg`, `roissy`, `ory`, `75001`, `1`, `+33`|

`book 2 tickets to paris`

In the previous utterance, the word `paris` is mapped to the paris item as part of the `Cities` list entity. The list entity matches both the item's normalized name as well as the item synonyms.

```JSON
"entities": [
  {
    "entity": "paris",
    "type": "Cities",
    "startIndex": 18,
    "endIndex": 22,
    "resolution": {
      "values": [
        "Paris"
      ]
    }
  }
]
```

Another example utterance, using a synonym for Paris:

`book 2 tickets to roissy`

```JSON
"entities": [
  {
    "entity": "roissy",
    "type": "Cities",
    "startIndex": 18,
    "endIndex": 23,
    "resolution": {
      "values": [
        "Paris"
      ]
    }
  }
]
```

## Prebuilt entity data
[Prebuilt](luis-concept-entity-types.md) entities are discovered based on a regular expression match using the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. Prebuilt entities are returned in the entities array and use the type name prefixed with `builtin::`. The following text is an example utterance with the returned prebuilt entities:

`Dec 5th send to +1 360-555-1212`

```JSON
"entities": [
    {
      "entity": "dec 5th",
      "type": "builtin.datetimeV2.date",
      "startIndex": 0,
      "endIndex": 6,
      "resolution": {
        "values": [
          {
            "timex": "XXXX-12-05",
            "type": "date",
            "value": "2017-12-05"
          },
          {
            "timex": "XXXX-12-05",
            "type": "date",
            "value": "2018-12-05"
          }
        ]
      }
    },
    {
      "entity": "1",
      "type": "builtin.number",
      "startIndex": 18,
      "endIndex": 18,
      "resolution": {
        "value": "1"
      }
    },
    {
      "entity": "360",
      "type": "builtin.number",
      "startIndex": 20,
      "endIndex": 22,
      "resolution": {
        "value": "360"
      }
    },
    {
      "entity": "555",
      "type": "builtin.number",
      "startIndex": 26,
      "endIndex": 28,
      "resolution": {
        "value": "555"
      }
    },
    {
      "entity": "1212",
      "type": "builtin.number",
      "startIndex": 32,
      "endIndex": 35,
      "resolution": {
        "value": "1212"
      }
    },
    {
      "entity": "5th",
      "type": "builtin.ordinal",
      "startIndex": 4,
      "endIndex": 6,
      "resolution": {
        "value": "5"
      }
    },
    {
      "entity": "1 360 - 555 - 1212",
      "type": "builtin.phonenumber",
      "startIndex": 18,
      "endIndex": 35,
      "resolution": {
        "value": "1 360 - 555 - 1212"
      }
    }
  ]
```

## Regular expression entity data
[Regular expression](luis-concept-entity-types.md) entities are discovered based on a regular expression match using an expression you provide when you create the entity. When using `kb[0-9]{6}` as the regular expression entity definition, the following JSON response is an example utterance with the returned regular expression entities for the query `When was kb123456 published?`:

```JSON
{
  "query": "when was kb123456 published?",
  "topScoringIntent": {
    "intent": "FindKBArticle",
    "score": 0.933641255
  },
  "intents": [
    {
      "intent": "FindKBArticle",
      "score": 0.933641255
    },
    {
      "intent": "None",
      "score": 0.04397359
    }
  ],
  "entities": [
    {
      "entity": "kb123456",
      "type": "KB number",
      "startIndex": 9,
      "endIndex": 16
    }
  ]
}
```

## Extracting names
Getting names from an utterance is difficult because a name can be almost any combination of letters and words. Depending on what type of name you're extracting, you have several options. The following suggestions are not rules but more guidelines.

### Add prebuilt PersonName and GeographyV2 entities

[PersonName](luis-reference-prebuilt-person.md) and [GeographyV2](luis-reference-prebuilt-geographyV2.md) entities are available in some [language cultures](luis-reference-prebuilt-entities.md). 

### Names of people

People's name can have some slight format depending on language and culture. Use either a prebuilt **[personName](luis-reference-prebuilt-person.md)** entity or a **[simple entity](luis-concept-entity-types.md#simple-entity)** with [roles](luis-concept-roles.md) of first and last name. 

If you use the simple entity, make sure to give examples that use the first and last name in different parts of the utterance, in utterances of different lengths, and utterances across all intents including the None intent. [Review](luis-how-to-review-endoint-utt.md) endpoint utterances on a regular basis to label any names that were not predicted correctly.

### Names of places

Location names are set and known such as cities, counties, states, provinces, and countries/regions. Use the prebuilt entity **[geographyV2](luis-reference-prebuilt-geographyv2.md)** to extract location information.

### New and emerging names

Some apps need to be able to find new and emerging names such as products or companies. These types of names are the most difficult type of data extraction. Begin with a **[simple entity](luis-concept-entity-types.md#simple-entity)** and add a [phrase list](luis-concept-feature.md). [Review](luis-how-to-review-endoint-utt.md) endpoint utterances on a regular basis to label any names that were not predicted correctly.

## Pattern roles data
Roles are contextual differences of entities.

```JSON
{
  "query": "move bob jones from seattle to redmond",
  "topScoringIntent": {
    "intent": "MoveAssetsOrPeople",
    "score": 0.9999998
  },
  "intents": [
    {
      "intent": "MoveAssetsOrPeople",
      "score": 0.9999998
    },
    {
      "intent": "None",
      "score": 1.02040713E-06
    },
    {
      "intent": "GetEmployeeBenefits",
      "score": 6.12244548E-07
    },
    {
      "intent": "GetEmployeeOrgChart",
      "score": 6.12244548E-07
    },
    {
      "intent": "FindForm",
      "score": 1.1E-09
    }
  ],
  "entities": [
    {
      "entity": "bob jones",
      "type": "Employee",
      "startIndex": 5,
      "endIndex": 13,
      "score": 0.922820568,
      "role": ""
    },
    {
      "entity": "seattle",
      "type": "Location",
      "startIndex": 20,
      "endIndex": 26,
      "score": 0.948008537,
      "role": "Origin"
    },
    {
      "entity": "redmond",
      "type": "Location",
      "startIndex": 31,
      "endIndex": 37,
      "score": 0.7047979,
      "role": "Destination"
    }
  ]
}
```

## Pattern.any entity data
Pattern.any entities are variable-length entities used in template utterances of a [pattern](luis-concept-patterns.md).

```JSON
{
  "query": "where is the form Understand your responsibilities as a member of the community and who needs to sign it after I read it?",
  "topScoringIntent": {
    "intent": "FindForm",
    "score": 0.999999464
  },
  "intents": [
    {
      "intent": "FindForm",
      "score": 0.999999464
    },
    {
      "intent": "GetEmployeeBenefits",
      "score": 4.883697E-06
    },
    {
      "intent": "None",
      "score": 1.02040713E-06
    },
    {
      "intent": "GetEmployeeOrgChart",
      "score": 9.278342E-07
    },
    {
      "intent": "MoveAssetsOrPeople",
      "score": 9.278342E-07
    }
  ],
  "entities": [
    {
      "entity": "understand your responsibilities as a member of the community",
      "type": "FormName",
      "startIndex": 18,
      "endIndex": 78,
      "role": ""
    }
  ]
}
```


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


### Key phrase extraction entity data
The key phrase extraction entity returns key phrases in the utterance, provided by [Text Analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/).

```JSON
{
  "query": "Is there a map of places with beautiful views on a favorite trail?",
  "topScoringIntent": {
    "intent": "GetJobInformation",
    "score": 0.764368951
  },
  "intents": [
    ...
  ],
  "entities": [
    {
      "entity": "beautiful views",
      "type": "builtin.keyPhrase",
      "startIndex": 30,
      "endIndex": 44
    },
    {
      "entity": "map of places",
      "type": "builtin.keyPhrase",
      "startIndex": 11,
      "endIndex": 23
    },
    {
      "entity": "favorite trail",
      "type": "builtin.keyPhrase",
      "startIndex": 51,
      "endIndex": 64
    }
  ]
}
```

## Data matching multiple entities

LUIS returns all entities discovered in the utterance. As a result, your chatbot may need to make decision based on the results. An utterance can have many entities in an utterance:

`book me 2 adult business tickets to paris tomorrow on air france`

The LUIS endpoint can discover the same data in different entities:

```JSON
{
  "query": "book me 2 adult business tickets to paris tomorrow on air france",
  "topScoringIntent": {
    "intent": "BookFlight",
    "score": 1.0
  },
  "intents": [
    {
      "intent": "BookFlight",
      "score": 1.0
    },
    {
      "intent": "Concierge",
      "score": 0.04216196
    },
    {
      "intent": "None",
      "score": 0.03610297
    }
  ],
  "entities": [
    {
      "entity": "air france",
      "type": "Airline",
      "startIndex": 54,
      "endIndex": 63,
      "score": 0.8291798
    },
    {
      "entity": "adult",
      "type": "Category",
      "startIndex": 10,
      "endIndex": 14,
      "resolution": {
        "values": [
          "adult"
        ]
      }
    },
    {
      "entity": "paris",
      "type": "Cities",
      "startIndex": 36,
      "endIndex": 40,
      "resolution": {
        "values": [
          "Paris"
        ]
      }
    },
    {
      "entity": "tomorrow",
      "type": "builtin.datetimeV2.date",
      "startIndex": 42,
      "endIndex": 49,
      "resolution": {
        "values": [
          {
            "timex": "2018-02-21",
            "type": "date",
            "value": "2018-02-21"
          }
        ]
      }
    },
    {
      "entity": "paris",
      "type": "Location::ToLocation",
      "startIndex": 36,
      "endIndex": 40,
      "score": 0.9730773
    },
    {
      "entity": "2",
      "type": "builtin.number",
      "startIndex": 8,
      "endIndex": 8,
      "resolution": {
        "value": "2"
      }
    },
    {
      "entity": "business",
      "type": "Seat",
      "startIndex": 16,
      "endIndex": 23,
      "resolution": {
        "values": [
          "business"
        ]
      }
    },
    {
      "entity": "2 adult business",
      "type": "TicketSeatOrder",
      "startIndex": 8,
      "endIndex": 23,
      "score": 0.8784727
    }
  ],
  "compositeEntities": [
    {
      "parentType": "TicketSeatOrder",
      "value": "2 adult business",
      "children": [
        {
          "type": "Category",
          "value": "adult"
        },
        {
          "type": "builtin.number",
          "value": "2"
        },
        {
          "type": "Seat",
          "value": "business"
        }
      ]
    }
  ]
}
```

## Data matching multiple list entities

If a word or phrase matches more than one list entity, the endpoint query returns each List entity.

For the query `when is the best time to go to red rock?`, and the app has the word `red` in more than one list, LUIS recognizes all the entities and returns an array of entities as part of the JSON endpoint response: 

```JSON
{
  "query": "when is the best time to go to red rock?",
  "topScoringIntent": {
    "intent": "Calendar.Find",
    "score": 0.06701678
  },
  "entities": [
    {
      "entity": "red",
      "type": "Colors",
      "startIndex": 31,
      "endIndex": 33,
      "resolution": {
        "values": [
          "Red"
        ]
      }
    },
    {
      "entity": "red rock",
      "type": "Cities",
      "startIndex": 31,
      "endIndex": 38,
      "resolution": {
        "values": [
          "Destinations"
        ]
      }
    }
  ]
}
```

## Next steps

See [Add entities](luis-how-to-add-entities.md) to learn more about how to add entities to your LUIS app.
