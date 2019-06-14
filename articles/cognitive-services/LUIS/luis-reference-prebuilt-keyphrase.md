---
title: Keyphrase Prebuilt entity
titleSuffix: Azure
description: This article contains keyphrase prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 05/07/2019
ms.author: diberry
---

# keyPhrase prebuilt entity for a LUIS app
keyPhrase extracts a variety of key phrases from an utterance. You do not need to add example utterances containing keyPhrase to the application. keyPhrase entity is supported in [many cultures](luis-language-support.md#languages-supported) as part of the [text analytics](../text-analytics/overview.md) features. 

## Resolution for prebuilt keyPhrase entity

### API version 2.x

The following example shows the resolution of the **builtin.keyPhrase** entity.

```json
{
  "query": "where is the educational requirements form for the development and engineering group",
  "topScoringIntent": {
    "intent": "GetJobInformation",
    "score": 0.182757929
  },
  "entities": [
    {
      "entity": "development",
      "type": "builtin.keyPhrase",
      "startIndex": 51,
      "endIndex": 61
    },
    {
      "entity": "educational requirements",
      "type": "builtin.keyPhrase",
      "startIndex": 13,
      "endIndex": 36
    }
  ]
}
```

## Next steps

Learn about the [percentage](luis-reference-prebuilt-percentage.md), [number](luis-reference-prebuilt-number.md), and [age](luis-reference-prebuilt-age.md) entities.
