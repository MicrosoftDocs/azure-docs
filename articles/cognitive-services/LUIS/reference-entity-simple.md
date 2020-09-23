---
title: Simple entity type - LUIS
titleSuffix: Azure Cognitive Services
description: A simple entity describes a single concept from the machine-learning context. Add a phrase list when using a simple entity to improve results.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: reference
ms.date: 09/29/2019
ms.author: diberry
---
# Simple entity

A simple entity is a generic entity that describes a single concept and is learned from the machine-learning context. Because simple entities are generally names such as company names, product names, or other categories of names, add a [phrase list](luis-concept-feature.md) when using a simple entity to boost the signal of the names used.

**The entity is a good fit when:**

* The data aren't consistently formatted but indicate the same thing.

![simple entity](./media/luis-concept-entities/simple-entity.png)

## Example JSON

`Bob Jones wants 3 meatball pho`

In the previous utterance, `Bob Jones` is labeled as a simple `Customer` entity.

The data returned from the endpoint includes the entity name, the discovered text from the utterance, the location of the discovered text, and the score:

#### [V2 prediction endpoint response](#tab/V2)

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

#### [V3 prediction endpoint response](#tab/V3)

This is the JSON if `verbose=false` is set in the query string:

```json
"entities": {
    "Customer": [
        "Bob Jones"
    ]
}```

This is the JSON if `verbose=true` is set in the query string:

```json
"entities": {
    "Customer": [
        "Bob Jones"
    ],
    "$instance": {
        "Customer": [
            {
                "type": "Customer",
                "text": "Bob Jones",
                "startIndex": 0,
                "length": 9,
                "score": 0.9339134,
                "modelTypeId": 1,
                "modelType": "Entity Extractor",
                "recognitionSources": [
                    "model"
                ]
            }
        ]
    }
}
```

* * *

|Data object|Entity name|Value|
|--|--|--|
|Simple Entity|`Customer`|`bob jones`|

## Next steps

> [!div class="nextstepaction"]
> [Learn pattern syntax](reference-pattern-syntax.md)