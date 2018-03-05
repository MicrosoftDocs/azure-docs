---
title: Understanding entity types in LUIS apps in Azure | Microsoft Docs
description: Add entities (key data in your application's domain) in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 02/21/2018
ms.author: v-geberr;
---
# Entities in LUIS

<!--
Entities are key data in your application’s domain. An entity represents a class including a collection of similar objects (places, things, people, events or concepts). Entities describe information relevant to the intent, and sometimes they are essential for your app to perform its task. For example, a News Search app may include entities such as “topic”, “source”, “keyword” and “publishing date”, which are key data to search for news. In a travel booking app, the “location”, “date”, "airline", "travel class" and "tickets" are key information for flight booking (relevant to the "Bookflight" intent). 
--> 
Entities are important words in utterances that describe information relevant to the intent, and sometimes they are essential to it. Entities belong to classes of similar objects. 

Entities are shared among intents. They don't belong to any single intent. Intents and entities can be semantically associated but it is not an exclusive relationship.

In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent.

You do not need to create entities for every concept in your app, but only for those required for the app to take action. 

You can add, edit, or delete entities in your app through the **Entities list** on the **Entities** page in the LUIS app web portal. LUIS offers many types of entities; prebuilt entities, custom machine learned entities and list entities.

## Entities are optional but highly recommended
While most LUIS apps have entities, they are not required. 

## Types of entities

LUIS offers the following types of entities:


| Name |Type | Can label | Description |
| -- |--|--|--|
| Prebuilt |[RegEx](#regex)| X|  Built-in types that represent common concepts like numbers, dates, and email. More than one prebuilt entity may match the same word or phrase. All prebuilt entities are returned in the [endpoint](luis-glossary.md#endpoint) query. For more information, see [Prebuilt entities](./Pre-builtEntities.md).|
| List | [Exact match](#exact-match)|X| List entities represent a fixed set of related words in your system. Each list entity may have one or more forms. They aren't machine learned, and are best used for a known set of variations on ways to represent the same concept. List entities are not labeled in utterances or trained by the system.  <br/><br/> A list entity is an explicitly specified list of values.  Unlike other entity types, LUIS does not discover additional values for list entities during training. Therefore, each list entity forms a closed set. <br/><br>If there is more than one list entity with the same value, each entity is returned in the endpoint query. | 
| Simple | [Machine-learned](#machine-learned) | ✔ | A simple entity is a generic entity that describes a single concept and is learned from context.  <br/> |  
| Hierarchical | [Machine-learned](#machine-learned) |✔ | A hierarchical entity is a special type of a simple entity; defining a category and its members in the form of parent-child relationship. For example, given a hierarchical entity of `Location` with children `ToLocation` and `FromLocation`, each child can be determined based on the context within the utterance. In the utterance, `Book 2 tickets from Seattle to New York`, the `ToLocation` and `FromLocation` are contextually different based the words around them. <br/><br/>If you are looking for an entity that has exact text matches for children regardless of context, you should use a List entity.|
| Composite | [Machine-learned](#machine-learned) | ✔|A composite entity is made up of other entities that form parts of a whole.  For example, a composite entity named PlaneTicketOrder may have child entities prebuilt `number` and `ToLocation`. You build a composite entity from pre-existing simple entities, children of hierarchical entities, or prebuilt entities.  |  

<a name="machine-learned"></a>
**Machine-learned** entities work best when tested via [endpoint queries](luis-concept-test.md#endpoint-testing) and [reviewing endpoint utterances](label-suggested-utterances.md). 

<a name="regex"></a>
**Regular expression entities** use the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. There are many [examples](https://github.com/Microsoft/Recognizers-Text/tree/master/Specs) of the regular expressions in the /Specs directory for the supported cultures. If your specific culture or regular expression isn't currently supported, contribute to the project. 

<a name="exact-match"></a>
**Exact-match** entities use the text provided in the entity to make an exact text match.

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
Create an entity when the calling application or bot needs some parameters required to execute an action.

## Next steps

See [Add entities](Add-entities.md) to learn more about how to add entities to your LUIS app.
