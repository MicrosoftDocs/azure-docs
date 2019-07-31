---
title: List entity type - LUIS
titleSuffix: Azure Cognitive Services
description: List entities represent a fixed, closed set of related words along with their synonyms. LUIS does not discover additional values for list entities. Use the Recommend feature to see suggestions for new words based on the current list.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: reference
ms.date: 07/24/2019
ms.author: diberry
---
# List entity 

List entities represent a fixed, closed set of related words along with their synonyms. LUIS does not discover additional values for list entities. Use the **Recommend** feature to see suggestions for new words based on the current list. If there is more than one list entity with the same value, each entity is returned in the endpoint query. 

A list entity isn't machine-learned. It is an exact text match. LUIS marks any match to an item in any list as an entity in the response. 

**The entity is a good fit when the text data:**

* Are a known set.
* Doesn't change often. If you need to change the list often or want the list to self-expand, a simple entity boosted with a phrase list is a better choice. 
* The set doesn't exceed the maximum LUIS [boundaries](luis-boundaries.md) for this entity type.
* The text in the utterance is an exact match with a synonym or the canonical name. LUIS doesn't use the list beyond exact text matches. Fuzzy matching, case-insensitivity, stemming, plurals, and other variations are not resolved with a list entity. To manage variations, consider using a [pattern](luis-concept-patterns.md#syntax-to-mark-optional-text-in-a-template-utterance) with the optional text syntax.

![list entity](./media/luis-concept-entities/list-entity.png)

## Example JSON

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

|Data object|Entity name|Value|
|--|--|--|
|Simple Entity|`Customer`|`bob jones`|

## Next steps

In this [tutorial](luis-quickstart-intent-and-list-entity.md), learn how to use a **list entity** to extract exact matches of text from a list of known items. 
