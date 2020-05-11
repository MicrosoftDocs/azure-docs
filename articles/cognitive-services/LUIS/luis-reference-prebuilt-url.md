---
title: URL Prebuilt entities - LUIS
titleSuffix: Azure Cognitive Services
description: This article contains url prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: reference
ms.date: 10/04/2019
ms.author: diberry
---

# URL prebuilt entity for a LUIS app
URL entity extracts URLs with domain names or IP addresses. Because this entity is already trained, you do not need to add example utterances containing URLs to the application. URL entity is supported in `en-us` culture only.

## Types of URLs
Url is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/Base-URL.yaml) GitHub repository

## Resolution for prebuilt URL entity

The following entity objects are returned for the query:

`https://www.luis.ai is a great cognitive services example of artificial intelligence`

#### [V3 response](#tab/V3)

The following JSON is with the `verbose` parameter set to `false`:

```json
"entities": {
    "url": [
        "https://www.luis.ai"
    ]
}
```
#### [V3 verbose response](#tab/V3-verbose)

The following JSON is with the `verbose` parameter set to `true`:

```json
"entities": {
    "url": [
        "https://www.luis.ai"
    ],
    "$instance": {
        "url": [
            {
                "type": "builtin.url",
                "text": "https://www.luis.ai",
                "startIndex": 0,
                "length": 17,
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

The following example shows the resolution of the https://www.luis.ai is a great cognitive services example of artificial intelligence

```json
"entities": [
    {
        "entity": "https://www.luis.ai",
        "type": "builtin.url",
        "startIndex": 0,
        "endIndex": 17
    }
]
```

* * *

## Next steps

Learn more about the [V3 prediction endpoint](luis-migration-api-v3.md).

Learn about the [ordinal](luis-reference-prebuilt-ordinal.md), [number](luis-reference-prebuilt-number.md), and [temperature](luis-reference-prebuilt-temperature.md) entities.
