---
title: Simple entity type 
titleSuffix: Language Understanding - Azure Cognitive Services
description: A simple entity is a generic entity that describes a single concept and is learned from the machine-learned context. Because simple entities are generally names such as company names, product names, or other categories of names, add a phrase list when using a simple entity to boost the signal of the names used.   
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: reference
ms.date: 07/24/2019
ms.author: diberry
---
# Simple entity 

A simple entity is a generic entity that describes a single concept and is learned from the machine-learned context. Because simple entities are generally names such as company names, product names, or other categories of names, add a [phrase list](luis-concept-feature.md) when using a simple entity to boost the signal of the names used. 

The entity is a good fit when:

* The data aren't consistently formatted but indicate the same thing. 

![simple entity](./media/luis-concept-entities/simple-entity.png)

## Example JSON

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

## Next steps

[Tutorial](luis-quickstart-primary-and-secondary-data.md)<br/>
