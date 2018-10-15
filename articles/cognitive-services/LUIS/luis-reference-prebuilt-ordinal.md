---
title: LUIS Prebuilt entities ordinal reference - Azure | Microsoft Docs
titleSuffix: Azure
description: This article contains ordinal prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/20/2018
ms.author: diberry
---

# Ordinal entity
Ordinal number is a numeric representation of an object inside a set: `first`, `second`, `third`. Because this entity is already trained, you do not need to add example utterances containing ordinal to the application intents. Ordinal entity is supported in [many cultures](luis-reference-prebuilt-entities.md). 

## Types of ordinal
Ordinal is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-Numbers.yaml#L45) Github repository

## Resolution for prebuilt ordinal entity
The following example shows the resolution of the **builtin.ordinal** entity.

```JSON
{
  "query": "Order the second option",
  "topScoringIntent": {
    "intent": "OrderFood",
    "score": 0.9993253
  },
  "intents": [
    {
      "intent": "OrderFood",
      "score": 0.9993253
    },
    {
      "intent": "None",
      "score": 0.05046708
    }
  ],
  "entities": [
    {
      "entity": "second",
      "type": "builtin.ordinal",
      "startIndex": 10,
      "endIndex": 15,
      "resolution": {
        "value": "2"
      }
    }
  ]
}
```

## Next steps

Learn about the [percentage](luis-reference-prebuilt-percentage.md), [phonenumber](luis-reference-prebuilt-phonenumber.md), and [temperature](luis-reference-prebuilt-temperature.md) entities. 