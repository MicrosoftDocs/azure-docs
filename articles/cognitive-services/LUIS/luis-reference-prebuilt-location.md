---
title: Location prebuilt entity - LUIS Reference 
titleSuffix: Azure Cognitive Services
description: This article contains location prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/24/2018
ms.author: diberry
---

# Location entity
The prebuilt location entity detects places. Because this entity is already trained, you do not need to add example utterances containing location to the application intents. Location entity is supported in English [culture](luis-reference-prebuilt-entities.md).

## Resolution for location entity
The following example shows the resolution of the **builtin.location** entity.

```JSON
{
  "query": "Is Jill Jones in Cairo?",
  "topScoringIntent": {
    "intent": "WhereIsEmployee",
    "score": 0.762141049
  }
  "entities": [
    {
      "entity": "Cairo",
      "type": "builtin.location",
      "startIndex": 17,
      "endIndex": 21
    }
  ]
}
```

## Next steps

Learn about the [email](luis-reference-prebuilt-email.md), [number](luis-reference-prebuilt-number.md), and [ordinal](luis-reference-prebuilt-ordinal.md) entities. 