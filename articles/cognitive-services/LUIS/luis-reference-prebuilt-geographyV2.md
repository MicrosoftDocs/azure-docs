---
title: Geography V2 prebuilt entity - LUIS Reference 
titleSuffix: Azure Cognitive Services
description: This article contains geographyV2 prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/24/2018
ms.author: diberry
---

# GeographyV2 entity
The prebuilt geographyV2 entity detects places. Because this entity is already trained, you do not need to add example utterances containing GeographyV2 to the application intents. GeographyV2 entity is supported in English [culture](luis-reference-prebuilt-entities.md).

## Subtypes
The geographical locations have subtypes:

|Subtype|Purpose|
|--|--|
|`poi`|point of interest|
|`city`|name of city|
|`countryRegion`|name of country or region|
|`continent`|name of continent|
|`state`|name of state or province|


## Resolution for GeographyV2 entity
The following example shows the resolution of the **builtin.geographyV2** entity.

```JSON
{
    "query": "Carol is visiting the sphinx in gizah egypt in africa before heading to texas",
    "topScoringIntent": {
        "intent": "None",
        "score": 0.8008023
    },
    "intents": [
        {
            "intent": "None",
            "score": 0.8008023
        }
    ],
    "entities": [
        {
            "entity": "the sphinx",
            "type": "builtin.geographyV2.poi",
            "startIndex": 18,
            "endIndex": 27
        },
        {
            "entity": "gizah",
            "type": "builtin.geographyV2.city",
            "startIndex": 32,
            "endIndex": 36
        },
        {
            "entity": "egypt",
            "type": "builtin.geographyV2.countryRegion",
            "startIndex": 38,
            "endIndex": 42
        },
        {
            "entity": "africa",
            "type": "builtin.geographyV2.continent",
            "startIndex": 47,
            "endIndex": 52
        },
        {
            "entity": "texas",
            "type": "builtin.geographyV2.state",
            "startIndex": 72,
            "endIndex": 76
        },
        {
            "entity": "carol",
            "type": "builtin.personName",
            "startIndex": 0,
            "endIndex": 4
        }
    ]
} 
```

## Next steps

Learn about the [email](luis-reference-prebuilt-email.md), [number](luis-reference-prebuilt-number.md), and [ordinal](luis-reference-prebuilt-ordinal.md) entities. 