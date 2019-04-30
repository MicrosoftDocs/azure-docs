---
title: Age Prebuilt entity
titleSuffix: Azure
description: This article contains age prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 02/28/2019
ms.author: diberry
---

# Age prebuilt entity for a LUIS app
The prebuilt age entity captures the age value both numerically and in terms of days, weeks, months, and years. Because this entity is already trained, you do not need to add example utterances containing age to the application intents. Age entity is supported in [many cultures](luis-reference-prebuilt-entities.md). 

## Types of age
Age is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-NumbersWithUnit.yaml#L3) GitHub repository

## Resolution for prebuilt age entity
The following example shows the resolution of the **builtin.age** entity.

```json
{
  "query": "A 90 day old utilities bill is quite late.",
  "topScoringIntent": {
    "intent": "None",
    "score": 0.8236133
  },
  "intents": [
    {
      "intent": "None",
      "score": 0.8236133
    }
  ],
  "entities": [
    {
      "entity": "90 day old",
      "type": "builtin.age",
      "startIndex": 2,
      "endIndex": 11,
      "resolution": {
        "unit": "Day",
        "value": "90"
      }
    }
  ]
}
```

## Next steps

Learn about the [currency](luis-reference-prebuilt-currency.md), [datetimeV2](luis-reference-prebuilt-datetimev2.md), and [dimension](luis-reference-prebuilt-dimension.md) entities. 
