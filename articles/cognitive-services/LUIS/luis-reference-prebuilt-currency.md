---
title: LUIS Prebuilt entities currency reference - Azure | Microsoft Docs
titleSuffix: Azure
description: This article contains currency prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/20/2018
ms.author: diberry
---

# Currency entity
The prebuilt currency entity detects currency in many denominations and countries, regardless of LUIS app culture. Because this entity is already trained, you do not need to add example utterances containing currency to the application intents. Currency entity is supported in [many cultures](luis-reference-prebuilt-entities.md). 

## Types of currency
Currency is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-NumbersWithUnit.yaml#L26) Github repository

## Resolution for currency entity
The following example shows the resolution of the **builtin.currency** entity.

```JSON
{
  "query": "search for items under $10.99",
  "topScoringIntent": {
    "intent": "SearchForItems",
    "score": 0.926173568
  },
  "intents": [
    {
      "intent": "SearchForItems",
      "score": 0.926173568
    },
    {
      "intent": "None",
      "score": 0.07376878
    }
  ],
  "entities": [
    {
      "entity": "$10.99",
      "type": "builtin.currency",
      "startIndex": 23,
      "endIndex": 28,
      "resolution": {
        "unit": "Dollar",
        "value": "10.99"
      }
    }
  ]
}
```

## Next steps

Learn about the [datetimeV2](luis-reference-prebuilt-datetimev2.md), [dimension](luis-reference-prebuilt-dimension.md), and [email](luis-reference-prebuilt-email.md) entities. 