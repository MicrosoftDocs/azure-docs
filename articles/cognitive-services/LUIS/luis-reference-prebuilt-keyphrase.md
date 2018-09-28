---
title: LUIS Prebuilt entities keyphrase reference - Azure | Microsoft Docs
titleSuffix: Azure
description: This article contains keyphrase prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 07/09/2018
ms.author: diberry
---

# keyPhrase entity
keyPhrase extracts a variety of key phrases from an utterance. You do not need to add example utterances containing keyPhrase to the application. keyPhrase entity is supported in [many cultures](luis-language-support.md#languages-supported) as part of the [text analytics](../text-analytics/overview.md) features. 

## Resolution for prebuilt keyPhrase entity
The following example shows the resolution of the **builtin.keyPhrase** entity.

```JSON
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
