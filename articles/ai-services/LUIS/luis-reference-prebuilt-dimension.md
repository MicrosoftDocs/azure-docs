---
title: Dimension Prebuilt entities - LUIS
titleSuffix: Azure AI services
description: This article contains dimension prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
ms.custom: seodec18
ms.author: aahi
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: reference
ms.date: 10/14/2019
---

# Dimension prebuilt entity for a LUIS app

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

The prebuilt dimension entity detects various types of dimensions, regardless of the LUIS app culture. Because this entity is already trained, you do not need to add example utterances containing dimensions to the application intents. Dimension entity is supported in [many cultures](luis-reference-prebuilt-entities.md).

## Types of dimension

Dimension is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-NumbersWithUnit.yaml) GitHub repository.

## Resolution for dimension entity

The following entity objects are returned for the query:

`10 1/2 miles of cable`

#### [V3 response](#tab/V3)

The following JSON is with the `verbose` parameter set to `false`:

```json
"entities": {
    "dimension": [
        {
            "number": 10.5,
            "units": "Mile"
        }
    ]
}
```
#### [V3 verbose response](#tab/V3-verbose)
The following JSON is with the `verbose` parameter set to `true`:

```json
"entities": {
    "dimension": [
        {
            "number": 10.5,
            "units": "Mile"
        }
    ],
    "$instance": {
        "dimension": [
            {
                "type": "builtin.dimension",
                "text": "10 1/2 miles",
                "startIndex": 0,
                "length": 12,
                "modelTypeId": 2,
                "modelType": "Prebuilt Entity Extractor",
                "recognitionSources": [
                    "model"
                ]
            }
        ]
    }
}
```

#### [V2 response](#tab/V2)

The following example shows the resolution of the **builtin.dimension** entity.

```json
{
    "entity": "10 1/2 miles",
    "type": "builtin.dimension",
    "startIndex": 0,
    "endIndex": 11,
    "resolution": {
    "unit": "Mile",
    "value": "10.5"
    }
}
```
* * *

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

Learn about the [email](luis-reference-prebuilt-email.md), [number](luis-reference-prebuilt-number.md), and [ordinal](luis-reference-prebuilt-ordinal.md) entities.
