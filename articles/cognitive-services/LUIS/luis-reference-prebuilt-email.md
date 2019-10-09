---
title: LUIS Prebuilt entities email reference
titleSuffix: Azure Cognitive Services
description: This article contains email prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 09/27/2019
ms.author: diberry
---

# Email prebuilt entity for a LUIS app
Email extraction includes the entire email address from an utterance. Because this entity is already trained, you do not need to add example utterances containing email to the application intents. Email entity is supported in `en-us` culture only. 

## Resolution for prebuilt email

#### [V2 prediction endpoint response](#tab/V2)

The following example shows the resolution of the **builtin.email** entity.

```json
{
  "query": "please send the information to patti@contoso.com",
  "topScoringIntent": {
    "intent": "None",
    "score": 0.811592042
  },
  "intents": [
    {
      "intent": "None",
      "score": 0.811592042
    }
  ],
  "entities": [
    {
      "entity": "patti@contoso.com",
      "type": "builtin.email",
      "startIndex": 31,
      "endIndex": 55,
      "resolution": {
        "value": "patti@contoso.com"
      }
    }
  ]
}
```

#### [V3 prediction endpoint response](#tab/V3)

The following JSON is with the `verbose` parameter set to `false`:

```json
{
    "query": "please send the information to patti@contoso.com",
    "prediction": {
        "normalizedQuery": "please send the information to patti@contoso.com",
        "topIntent": "None",
        "intents": {
            "None": {
                "score": 0.5023781
            }
        },
        "entities": {
            "email": [
                "patti@contoso.com"
            ]
        }
    }
}
```


The following JSON is with the `verbose` parameter set to `true`:

```json
{
    "query": "please send the information to patti@contoso.com",
    "prediction": {
        "normalizedQuery": "please send the information to patti@contoso.com",
        "topIntent": "None",
        "intents": {
            "None": {
                "score": 0.5023781
            }
        },
        "entities": {
            "email": [
                "patti@contoso.com"
            ],
            "$instance": {
                "email": [
                    {
                        "type": "builtin.email",
                        "text": "patti@contoso.com",
                        "startIndex": 31,
                        "length": 25,
                        "modelTypeId": 2,
                        "modelType": "Prebuilt Entity Extractor"
                    }
                ]
            }
        }
    }
}
```

* * * 

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

Learn about the [number](luis-reference-prebuilt-number.md), [ordinal](luis-reference-prebuilt-ordinal.md), and [percentage](luis-reference-prebuilt-percentage.md). 
