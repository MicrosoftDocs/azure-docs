---
title: Temperature Prebuilt entity - LUIS
titleSuffix: Azure AI services
description: This article contains temperature prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: reference
ms.date: 10/14/2019
---

# Temperature prebuilt entity for a LUIS app

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

Temperature extracts a variety of temperature types. Because this entity is already trained, you do not need to add example utterances containing temperature to the application. Temperature entity is supported in [many cultures](luis-reference-prebuilt-entities.md).

## Types of temperature
Temperature is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-NumbersWithUnit.yaml#L819) GitHub repository

## Resolution for prebuilt temperature entity

The following entity objects are returned for the query:

`set the temperature to 30 degrees`


#### [V3 response](#tab/V3)

The following JSON is with the `verbose` parameter set to `false`:

```json
"entities": {
    "temperature": [
        {
            "number": 30,
            "units": "Degree"
        }
    ]
}
```
#### [V3 verbose response](#tab/V3-verbose)
The following JSON is with the `verbose` parameter set to `true`:

```json
"entities": {
    "temperature": [
        {
            "number": 30,
            "units": "Degree"
        }
    ],
    "$instance": {
        "temperature": [
            {
                "type": "builtin.temperature",
                "text": "30 degrees",
                "startIndex": 23,
                "length": 10,
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

The following example shows the resolution of the **builtin.temperature** entity.

```json
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
```
* * *

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

Learn about the [percentage](luis-reference-prebuilt-percentage.md), [number](luis-reference-prebuilt-number.md), and [age](luis-reference-prebuilt-age.md) entities.
