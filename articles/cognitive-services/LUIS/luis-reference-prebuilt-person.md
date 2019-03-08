---
title: PersonName prebuilt entity
titleSuffix: Azure Cognitive Services
description: This article contains personName prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 01/23/2019
ms.author: diberry
---

# PersonName prebuilt entity for a LUIS app
The prebuilt personName entity detects people names. Because this entity is already trained, you do not need to add example utterances containing personName to the application intents. personName entity is supported in English and Chinese [cultures](luis-reference-prebuilt-entities.md).

## Resolution for personName entity
The following example shows the resolution of the **builtin.personName** entity.

```json
{
  "query": "Is Jill Jones in Cairo?",
  "topScoringIntent": {
    "intent": "WhereIsEmployee",
    "score": 0.762141049
  }
  "entities": [
    {
      "entity": "Jill Jones",
      "type": "builtin.personName",
      "startIndex": 3,
      "endIndex": 12
    }
  ]
}
```

## Next steps

Learn about the [email](luis-reference-prebuilt-email.md), [number](luis-reference-prebuilt-number.md), and [ordinal](luis-reference-prebuilt-ordinal.md) entities. 
