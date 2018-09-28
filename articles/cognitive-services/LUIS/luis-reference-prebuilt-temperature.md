---
title: LUIS Prebuilt entities temperature reference - Azure | Microsoft Docs
titleSuffix: Azure
description: This article contains temperature prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/20/2018
ms.author: diberry
---

# Temperature entity
Temperature extracts a variety of temperature types. Because this entity is already trained, you do not need to add example utterances containing temperature to the application. Temperature entity is supported in [many cultures](luis-reference-prebuilt-entities.md). 

## Types of temperature
Temperature is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-NumbersWithUnit.yaml#L819) Github repository

## Resolution for prebuilt temperature entity
The following example shows the resolution of the **builtin.temperature** entity.

```JSON
{
  "query": "set the temperature to 30 degrees",
  "topScoringIntent": {
    "intent": "None",
    "score": 0.85310787
  },
  "intents": [
    {
      "intent": "None",
      "score": 0.85310787
    }
  ],
  "entities": [
    {
      "entity": "30 degrees",
      "type": "builtin.temperature",
      "startIndex": 23,
      "endIndex": 32,
      "resolution": {
        "unit": "Degree",
        "value": "30"
      }
    }
  ]
}
```

## Next steps

Learn about the [percentage](luis-reference-prebuilt-percentage.md), [number](luis-reference-prebuilt-number.md), and [age](luis-reference-prebuilt-age.md) entities. 