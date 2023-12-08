---
title: Currency Prebuilt entity - LUIS
titleSuffix: Azure AI services
description: This article contains currency prebuilt entity information in Language Understanding (LUIS).
#services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: reference
ms.date: 10/14/2019
---

# Currency prebuilt entity for a LUIS app

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

The prebuilt currency entity detects currency in many denominations and countries/regions, regardless of LUIS app culture. Because this entity is already trained, you do not need to add example utterances containing currency to the application intents. Currency entity is supported in [many cultures](luis-reference-prebuilt-entities.md).

## Types of currency
Currency is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-NumbersWithUnit.yaml#L26) GitHub repository

## Resolution for currency entity

#### [V3 response](#tab/V3)

The following JSON is with the `verbose` parameter set to `false`:

```json
"entities": {
    "money": [
        {
            "number": 10.99,
            "units": "Dollar"
        }
    ]
}
```
#### [V3 verbose response](#tab/V3-verbose)
The following JSON is with the `verbose` parameter set to `true`:

```json
"entities": {
    "money": [
        {
            "number": 10.99,
            "unit": "Dollar"
        }
    ],
    "$instance": {
        "money": [
            {
                "type": "builtin.currency",
                "text": "$10.99",
                "startIndex": 23,
                "length": 6,
                "modelTypeId": 2,
                "modelType": "Prebuilt Entity Extractor"
            }
        ]
    }
}
```

#### [V2 response](#tab/V2)

The following example shows the resolution of the **builtin.currency** entity.

```json
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
```
* * *

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

Learn about the [datetimeV2](luis-reference-prebuilt-datetimev2.md), [dimension](luis-reference-prebuilt-dimension.md), and [email](luis-reference-prebuilt-email.md) entities.
