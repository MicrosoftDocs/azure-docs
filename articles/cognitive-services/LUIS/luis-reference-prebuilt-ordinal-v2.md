---
title: Ordinal V2 prebuilt entity - LUIS
titleSuffix: Azure Cognitive Services
description: This article contains ordinal V2 prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: reference
ms.date: 09/27/2019
ms.author: diberry
---

# Ordinal V2 prebuilt entity for a LUIS app
Ordinal V2 number expands [Ordinal](luis-reference-prebuilt-ordinal.md) to provide relative references such as `next`, `last`, and `previous`. These are not extracted using the ordinal prebuilt entity.

## Resolution for prebuilt ordinal V2 entity

The following entity objects are returned for the query:

`what is the second to last choice in the list`

#### [V3 response](#tab/V3)

The following JSON is with the `verbose` parameter set to `false`:

```json
"entities": {
    "ordinalV2": [
        {
            "offset": -1,
            "relativeTo": "end"
        }
    ]
}
```

#### [V3 verbose response](#tab/V3-verbose)

The following JSON is with the `verbose` parameter set to `true`:

```json
"entities": {
    "ordinalV2": [
        {
            "offset": -1,
            "relativeTo": "end"
        }
    ],
    "$instance": {
        "ordinalV2": [
            {
                "type": "builtin.ordinalV2.relative",
                "text": "the second to last",
                "startIndex": 8,
                "length": 18,
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

The following example shows the resolution of the **builtin.ordinalV2** entity.

```json
"entities": [
    {
        "entity": "the second to last",
        "type": "builtin.ordinalV2.relative",
        "startIndex": 8,
        "endIndex": 25,
        "resolution": {
            "offset": "-1",
            "relativeTo": "end"
        }
    }
]
```
* * *

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

Learn about the [percentage](luis-reference-prebuilt-percentage.md), [phone number](luis-reference-prebuilt-phonenumber.md), and [temperature](luis-reference-prebuilt-temperature.md) entities.
