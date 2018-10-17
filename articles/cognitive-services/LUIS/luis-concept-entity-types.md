---
title: Entity types in LUIS apps - Language Understanding
titleSuffix: Azure Cognitive Services
description: Add entities (key data in your application's domain) in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/10/2018
ms.author: diberry
---
# Entities in LUIS

Entities are words or phrases in utterances that are key data in your application’s domain.

## Entity compared to intent
The entity represents a word or phrase inside the utterance that you want extracted. An utterance can include many entities or none at all. An entity represents a class including a collection of similar objects (places, things, people, events or concepts). Entities describe information relevant to the intent, and sometimes they are essential for your app to perform its task. For example, a News Search app may include entities such as “topic”, “source”, “keyword” and “publishing date”, which are key data to search for news. In a travel booking app, the “location”, “date”, "airline", "travel class" and "tickets" are key information for flight booking (relevant to the "Bookflight" intent).

By comparison, the intent represents the prediction of the entire utterance. 

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

## Label for word meaning
If the word choice or word arrangement is the same, but doesn't mean the same thing, do not label it with the entity. 

The following utterances, the word `fair` is a homograph. It is spelled the same but has a different meaning:

|Utterance|
|--|
|What kind of county fairs are happening in the Seattle area this summer?|
|Is the current rating for the Seattle review fair?|

If you wanted an event entity to find all event data, label the word `fair` in the first utterance, but not in the second.

## Entities are shared across intents
Entities are shared among intents. They don't belong to any single intent. Intents and entities can be semantically associated but it is not an exclusive relationship.

In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent.

## Assign entities in None intent
All intents, including the **None** intent, should have entities labeled. This helps LUIS learn more about where the entities are in the utterances and what words are around the entities. 

## Types of entities
LUIS offers many types of entities; prebuilt entities, custom machine learned entities and list entities.

| Name | Can label | Description |
| -- |--|--|
| **Prebuilt** <br/>[Custom](#prebuilt)| |  **Definition**<br>Built-in types that represent common concepts. <br><br>**List**<br/>key phrase number, ordinal, temperature, dimension, money, age, percentage, email, URL, phone number, and key phrase. <br><br>Prebuilt entity names are reserved. <br><br>All prebuilt entities that are added to the application are returned in the [endpoint](luis-glossary.md#endpoint) query. For more information, see [Prebuilt entities](./luis-prebuilt-entities.md). <br/><br/>[Example response for entity](luis-concept-data-extraction.md#prebuilt-entity-data)|
|<!-- added week of 3/21/08 --> **Regular Expression**<br/>[RegEx](#regex)||**Definition**<br>Custom regular expression for formatted raw utterance text. It ignores case and ignores cultural variant.  <br><br>This entity is good for words or phrases that are consistently formatted with any variation that is also consistent.<br><br>Regular expression matching is applied after spell-check alterations. <br><br>If the regular expression is too complex, such as using many brackets, you are not able to add the expression to the model. <br><br>**Example**<br>`kb[0-9]{6,}` matches kb123456.<br/><br/>[Quickstart](luis-quickstart-intents-regex-entity.md)<br>[Example response for entity](luis-concept-data-extraction.md)|
| **Simple** <br/>[Machine-learned](#machine-learned) | ✔ | **Definition**<br>A simple entity is a generic entity that describes a single concept and is learned from machine-learned context. Context include word choice, word placement, and utterance length.<br/><br/>This is a good entity for words or phrases that are not consistently formatted but indicate the same thing. <br/><br/>[Quickstart](luis-quickstart-primary-and-secondary-data.md)<br/>[Example response for entity](luis-concept-data-extraction.md#simple-entity-data)|  
| **List** <br/>[Exact match](#exact-match)|| **Definition**<br>List entities represent a fixed, closed set of related words along with their synoymns in your system. <br><br>Each list entity may have one or more forms. Best used for a known set of variations on ways to represent the same concept.<br/><br/>LUIS does not discover additional values for list entities. Use the **Recommend** feature to see suggestions for new words based on the current list.<br/><br>If there is more than one list entity with the same value, each entity is returned in the endpoint query. <br/><br/>[Quickstart](luis-quickstart-intent-and-list-entity.md)<br>[Example response for entity](luis-concept-data-extraction.md#list-entity-data)| 
| **Pattern.any** <br/>[Mixed](#mixed) | ✔|**Definition**<br>Patterns.any is a variable-length placeholder used only in a pattern's template utterance to mark where the entity begins and ends.  <br><br>**Example**<br>Given an utterance search for books based on title, the pattern.any extracts the complete title. A template utterance using pattern.any is `Who wrote {BookTitle}[?]`.<br/><br/>[Tutorial](luis-tutorial-pattern.md)<br>[Example response for entity](luis-concept-data-extraction.md#composite-entity-data)|  
| **Composite** <br/>[Machine-learned](#machine-learned) | ✔|**Definition**<br>A composite entity is made up of other entities, such as prebuilt entities, simple, regex, list, hierarchical. The separate entities form a whole entity. <br><br>**Example**<br>A composite entity named PlaneTicketOrder may have child entities prebuilt `number` and `ToLocation`. <br/><br/>[Tutorial](luis-tutorial-composite-entity.md)<br>[Example response for entity](luis-concept-data-extraction.md#composite-entity-data)|  
| **Hierarchical** <br/>[Machine-learned](#machine-learned) |✔ | **Definition**<br>A hierarchical entity is a category of contextually learned simple entities.<br><br>**Example**<br>Given a hierarchical entity of `Location` with children `ToLocation` and `FromLocation`, each child can be determined based on the **context** within the utterance. In the utterance, `Book 2 tickets from Seattle to New York`, the `ToLocation` and `FromLocation` are contextually different based the words around them. <br/><br/>**Do not use if**<br>If you are looking for an entity that has exact text matches for children regardless of context, you should use a List entity. If you are looking for a parent-child relationship with other entity types, you should use the Composite entity.<br/><br/>[Quickstart](luis-quickstart-intent-and-hier-entity.md)<br>[Example response for entity](luis-concept-data-extraction.md#hierarchical-entity-data)|

<a name="prebuilt"></a>
**Prebuilt** entities are custom entities provided by LUIS. Some of these entities are defined in the open-source [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. There are many [examples](https://github.com/Microsoft/Recognizers-Text/tree/master/Specs) in the /Specs directory for the supported cultures. If your specific culture or entity isn't currently supported, contribute to the project. 

<a name="machine-learned"></a>
**Machine-learned** entities work best when tested via [endpoint queries](luis-concept-test.md#endpoint-testing) and [reviewing endpoint utterances](luis-how-to-review-endoint-utt.md). 

<a name="regex"></a>
**Regular expression entities** are defined by a regular expression the user provides as part of the entity definition. 

<a name="exact-match"></a>
**Exact-match** entities use the text provided in the entity to make an exact text match.

<a name="mixed"></a>
**Mixed** entities use a combination of entity detection methods.

## Entity limits
Review [limits](luis-boundaries.md#model-boundaries) to understand how many of each type of entity you can add to a model.

## Entity roles
Entity [roles](luis-concept-roles.md) apply to custom and prebuilt entities and are used in patterns only. 

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

## If you need more than the maximum number of entities 

You might need to use hierarchical and composite entities. Hierarchical entities reflect the relationship between entities that share characteristics or are members of a category. The child entities are all members of their parent's category. For example, a hierarchical entity named PlaneTicketClass might have the child entities EconomyClass and FirstClass. The hierarchy spans only one level of depth.  

Composite entities represent parts of a whole. For example, a composite entity named PlaneTicketOrder might have child entities Airline, Destination, DepartureCity, DepartureDate, and PlaneTicketClass. You build a composite entity from pre-existing simple entities, children of hierarchical entities, or prebuilt entities.  

LUIS also provides the list entity type that is not machine-learned but allows your LUIS app to specify a fixed list of values. See [LUIS Boundaries](luis-boundaries.md) reference to review limits of the List entity type. 

If you've considered hierarchical, composite, and list entities and still need more than the limit, contact support. To do so, gather detailed information about your system, go to the [LUIS](luis-reference-regions.md#luis-website) website, and then select **Support**. If your Azure subscription includes support services, contact [Azure technical support](https://azure.microsoft.com/support/options/). 

## Best practices

Create an [entity](luis-concept-entity-types.md) when the calling application or bot needs some parameters or data from the utterance required to execute an action. An entity is a word or phrase in the utterance that you need extracted -- perhaps as a parameter for a function. 

In order to select the correct type of entity to add to your application, you need to know how that data is entered by users. Each entity type is found using a different mechanism such as machine-learning, closed list or regular expression. If you are unsure, begin with a simple entity and label the word or phrase that represents that data in all utterances, across all intents including the None intent.  

Review endpoint utterances on a regular basis to find common usage where an entity can be identified as a regular expression or found with an exact text match.  

As part of the review, consider adding a phrase list to add a signal to LUIS for words or phrases that are significant to your domain but are not exact matches, and for which LUIS doesn't have a high confidence.  

See [best practices](luis-concept-best-practices.md) for more information.

## Next steps

Learn concepts about good [utterances](luis-concept-utterance.md). 

See [Add entities](luis-how-to-add-entities.md) to learn more about how to add entities to your LUIS app.