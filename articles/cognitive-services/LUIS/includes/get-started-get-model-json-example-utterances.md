---
title: include file
description: include file
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.date: 05/18/2020
ms.subservice: language-understanding
ms.topic: include
ms.custom: include file
ms.author: diberry
---
The example utterances follow a specific format.

The `text` field contains the text of the example utterance. The `intentName` field must correspond to the name of an existing intent in the LUIS app. The `entityLabels` field is required. If you don't want to label any entities, provide an empty array.

If the entityLabels array is not empty, the `startCharIndex` and `endCharIndex` need to mark the entity referred to in the `entityName` field. The index is zero-based. If you begin or end the label at a space in the text, the API call to add the utterances fails.

```JSON
[
    {
        "text": "order a cheese pizza",
        "intentName": "ModifyOrder",
        "entityLabels":[]
    },
    {
        "text": "order a large pepperoni pizza",
        "intentName": "ModifyOrder",
        "entityLabels": [
            {
                "entityName": "Order",
                "startCharIndex": 8,
                "endCharIndex": 28
            }
        ]
    },
    {
        "text": "order 2 large pepperoni pizzas on thin crust",
        "intentName": "ModifyOrder",
        "entityLabels": [
            {
                "entityName": "Order",
                "startCharIndex": 6,
                "endCharIndex": 61
            },
            {
                "entityName": "FullPizzaWithModifiers",
                "startCharIndex": 6,
                "endCharIndex": 61
            },
            {
                "entity": "Quantity",
                "startPos": 6,
                "endPos": 7
            },
            {
                "entity": "PizzaType",
                "startPos": 14,
                "endPos": 22
            },
            {
                "entity": "Size",
                "startPos": 8,
                "endPos": 12
            },
            {
                "entity": "Crust",
                "startPos": 34,
                "endPos": 37
            }
        ]
    }
]
```
