---
title: Understanding entity types in LUIS apps in Azure | Microsoft Docs
description: Add entities (key data in your application's domain) in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 03/26/2018
ms.author: v-geberr
---
# Entities in LUIS

Entities are key data in your application’s domain.<!-- An entity represents a class including a collection of similar objects (places, things, people, events or concepts). Entities describe information relevant to the intent, and sometimes they are essential for your app to perform its task. For example, a News Search app may include entities such as “topic”, “source”, “keyword” and “publishing date”, which are key data to search for news. In a travel booking app, the “location”, “date”, "airline", "travel class" and "tickets" are key information for flight booking (relevant to the "Bookflight" intent). 
--> 
## Entities represent data
Entities are data you want to pull from the utterance. This can be a name, date, product name, or any group of words. 

|Utterance|Entity|Data|
|--|--|--|
|Buy 3 tickets to New York|Prebuilt number<br>Location.Destination|3<br>New York|
|Buy a ticket from New York to London on March 5|Location.Origin<br>Location.Destination<br>Prebuilt datetimeV2|New York<br>London<br>March 5, 2018|

## Entities are optional but highly recommended
While intents are required, entities are optional. You do not need to create entities for every concept in your app, but only for those required for the app to take action. 

If your utterances do not have details your bot needs to continue, you do not need to add them. As your app matures, you can add them later. 

If you are not sure how you would use the information, add a few common prebuilt entities such as datetimeV2, ordinal, email, and phone number.

All intents, including the **None** intent, should have entities labeled. This helps LUIS learn more about where the entities are in the utterances and what words are around the entities. 

## Entities are shared across intents
Entities are shared among intents. They don't belong to any single intent. Intents and entities can be semantically associated but it is not an exclusive relationship.

In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent.

## Types of entities
LUIS offers many types of entities; prebuilt entities, custom machine learned entities and list entities.

| Name |Type | Can label | Description |
| -- |--|--|--|
| **Prebuilt** |[RegEx](#regex)| |  **Definition**<br>Built-in types that represent common concepts like numbers, dates, and email. <br><br>Prebuilt entity names are reserved. <br><br>All prebuilt entities that are added to the application are returned in the [endpoint](luis-glossary.md#endpoint) query. For more information, see [Prebuilt entities](./Pre-builtEntities.md).<br/><br/>[Example response for entity](luis-concept-data-extraction.md#prebuilt-entity-data)|
|<!-- added week of 3/21/08 --> **Regular Expression** | [RegEx](#regex)||**Definition**<br>Custom regular expression that ignores case and ignores cultural variant.  <br><br>Regular expression matching is applied after spell-check alterations. <br><br>If the regular expression is too complex, such as using many brackets, you are not able to add the expression to the model. <br><br>**Example**<br>`kb[0-9]{6,}` matches kb123456.<br/><br/>[Quickstart](luis-quickstart-intents-regex-entity.md)<br>[Example response for entity](luis-concept-data-extraction.md)|
| **List** | [Exact match](#exact-match)|| **Definition**<br>List entities represent a fixed, closed set of related words in your system. <br><br>Each list entity may have one or more forms. Best used for a known set of variations on ways to represent the same concept.<br/><br/> LUIS does not discover additional values for list entities. <br/><br>If there is more than one list entity with the same value, each entity is returned in the endpoint query. <br/><br/>[Quickstart](luis-quickstart-intent-and-list-entity.md)<br>[Example response for entity](luis-concept-data-extraction.md#list-entity-data)| 
| **Simple** | [Machine-learned](#machine-learned) | ✔ | **Definition**<br>A simple entity is a generic entity that describes a single concept and is learned from machine-learned context.<br/><br/>[Quickstart](luis-quickstart-primary-and-secondary-data.md)<br>[Example response for entity](luis-concept-data-extraction.md#simple-entity-data)|  
| **Composite** | [Machine-learned](#machine-learned) | ✔|**Definition**<br>A composite entity is made up of other entities, such as prebuilt entities, list entities, and simple. The separate entities form a whole entity. <br><br>**Example**<br>A composite entity named PlaneTicketOrder may have child entities prebuilt `number` and `ToLocation`. <br/><br/>[Tutorial](luis-tutorial-composite-entity.md)<br>[Example response for entity](luis-concept-data-extraction.md#composite-entity-data)|
| **Pattern.any** | [Mixed](#mixed) | ✔|**Definition**<br>Patterns.any is a variable-length placeholder used only in a pattern's template utterance to mark where the entity begins and ends.  <br><br>**Example**<br>Given an utterance search for books based on title, the pattern.any extracts the complete title. A template utterance using pattern.any is `Who wrote {BookTitle}?`.<br/><br/>[Tutorial](luis-tutorial-pattern.md)<br>[Example response for entity](luis-concept-data-extraction.md#composite-entity-data)|  
| **Hierarchical** | [Machine-learned](#machine-learned) |✔ | **Definition**<br>A hierarchical entity is a special type of a **simple** entity; defining a category and its members in the form of parent-child relationship.<br><br>**Example**<br>Given a hierarchical entity of `Location` with children `ToLocation` and `FromLocation`, each child can be determined based on the **context** within the utterance. In the utterance, `Book 2 tickets from Seattle to New York`, the `ToLocation` and `FromLocation` are contextually different based the words around them. <br/><br/>**Do not use if**<br>If you are looking for an entity that has exact text matches for children regardless of context, you should use a List entity. If you are looking for a parent-child relationship with other entity types, you should use the Composite entity.<br/><br/>[Quickstart](luis-quickstart-intent-and-hier-entity.md)<br>[Example response for entity](luis-concept-data-extraction.md#hierarchical-entity-data)|

<a name="machine-learned"></a>
**Machine-learned** entities work best when tested via [endpoint queries](luis-concept-test.md#endpoint-testing) and [reviewing endpoint utterances](label-suggested-utterances.md). 

<a name="regex"></a>
**Regular expression entities** use the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. There are many [examples](https://github.com/Microsoft/Recognizers-Text/tree/master/Specs) of the regular expressions in the /Specs directory for the supported cultures. If your specific culture or regular expression isn't currently supported, contribute to the project. 

<a name="exact-match"></a>
**Exact-match** entities use the text provided in the entity to make an exact text match.

<a name="mixed"></a>
**Mixed** entities use a combination of entity detection methods.


## Entity limits
Review [limits](luis-boundaries.md#model-boundaries) to understand how many of each type of entity you can add to a model.

## Composite vs hierarchical entities
Composite entities and hierarchical entities both have parent-child relationships and are machine learned. The machine-learning allows LUIS to understand the entities based on different contexts (arrangement of words). Composite entities are more flexible because they allow different entity types as children. A hierarchical entity's children are only simple entities. 

|Type|Purpose|Example|
|--|--|--|
|Hierarchical|Parent-child of simple entities|Location.Origin=New York<br>Location.Destination=London|
|Composite|Parent-child entities: prebuilt, list, simple, hierarchical| number=3<br>list=first class<br>prebuilt.datetimeV2=March 5|

## Data matching multiple entities
If a word or phrase matches more than one entity, the endpoint query returns each entity. If you add both prebuilt number entity and prebuild datetimeV2, and have an utterance `create meeting on 2018/03/12 for lunch with wayne`, LUIS recognizes all the entities and returns an array of entities as part of the JSON endpoint response: 

```JSON
{
  "query": "create meeting on 2018/03/12 for lunch with wayne",
  "topScoringIntent": {
    "intent": "Calendar.Add",
    "score": 0.9333419
  },
  "entities": [
    {
      "entity": "2018/03/12",
      "type": "builtin.datetimeV2.date",
      "startIndex": 18,
      "endIndex": 27,
      "resolution": {
        "values": [
          {
            "timex": "2018-03-12",
            "type": "date",
            "value": "2018-03-12"
          }
        ]
      }
    },
    {
      "entity": "2018",
      "type": "builtin.number",
      "startIndex": 18,
      "endIndex": 21,
      "resolution": {
        "value": "2018"
      }
    },
    {
      "entity": "03/12",
      "type": "builtin.number",
      "startIndex": 23,
      "endIndex": 27,
      "resolution": {
        "value": "0.25"
      }
    }
  ]
}
```

## Data matching multiple List entities
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

## Best practices
See [Entity best practices](luis-concept-best-practices.md#entities) to learn more.

## Next steps

See [Add entities](Add-entities.md) to learn more about how to add entities to your LUIS app.
