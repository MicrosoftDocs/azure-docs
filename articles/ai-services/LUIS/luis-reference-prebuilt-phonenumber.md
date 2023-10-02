---
title: Phone number Prebuilt entities - LUIS
titleSuffix: Azure AI services
description: This article contains phone number prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: reference
ms.date: 09/27/2019
---

# Phone number prebuilt entity for a LUIS app

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

The `phonenumber` entity extracts a variety of phone numbers including country code. Because this entity is already trained, you do not need to add example utterances to the application. The `phonenumber` entity is supported in `en-us` culture only.

## Types of a phone number
`Phonenumber` is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/Base-PhoneNumbers.yaml) GitHub repository

## Resolution for this prebuilt entity

The following entity objects are returned for the query:

`my mobile is 1 (800) 642-7676`

#### [V3 response](#tab/V3)

The following JSON is with the `verbose` parameter set to `false`:

```json
"entities": {
    "phonenumber": [
        "1 (800) 642-7676"
    ]
}
```
#### [V3 verbose response](#tab/V3-verbose)
The following JSON is with the `verbose` parameter set to `true`:

```json
"entities": {
    "phonenumber": [
        "1 (800) 642-7676"
    ],
    "$instance": {

        "phonenumber": [
            {
                "type": "builtin.phonenumber",
                "text": "1 (800) 642-7676",
                "startIndex": 13,
                "length": 16,
                "score": 1.0,
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

The following example shows the resolution of the **builtin.phonenumber** entity.

```json
"entities": [
    {
        "entity": "1 (800) 642-7676",
        "type": "builtin.phonenumber",
        "startIndex": 13,
        "endIndex": 28,
        "resolution": {
            "score": "1",
            "value": "1 (800) 642-7676"
        }
    }
]
```
* * *

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

Learn about the [percentage](luis-reference-prebuilt-percentage.md), [number](luis-reference-prebuilt-number.md), and [temperature](luis-reference-prebuilt-temperature.md) entities.
