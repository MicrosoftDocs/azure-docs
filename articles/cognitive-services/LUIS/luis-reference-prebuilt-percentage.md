---
title: LUIS Prebuilt entities percentage reference | Microsoft Docs
description: This article contains percentage prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/20/2017
ms.author: v-geberr
---

# Percentage entity
Percentage entity is supported in many cultures. 

The following example shows the resolution of the **builtin.percentage** entity.

```JSON
{
  "query": "set a trigger when my stock goes up 2%",
  "topScoringIntent": {
    "intent": "SetTrigger",
    "score": 0.971157849
  },
  "intents": [
    {
      "intent": "SetTrigger",
      "score": 0.971157849
    },
    {
      "intent": "None",
      "score": 0.07398871
    },
    {
      "intent": "Help",
      "score": 2.57078386E-06
    }
  ],
  "entities": [
    {
      "entity": "2",
      "type": "builtin.number",
      "startIndex": 36,
      "endIndex": 36,
      "resolution": {
        "value": "2"
      }
    },
    {
      "entity": "2%",
      "type": "builtin.percentage",
      "startIndex": 36,
      "endIndex": 37,
      "resolution": {
        "value": "2%"
      }
    }
  ]
}
```