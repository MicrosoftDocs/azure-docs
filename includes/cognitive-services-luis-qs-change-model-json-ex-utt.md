---
title: include file
description: include file 
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.subservice: luis
ms.topic: include
ms.custom: include file
ms.date: 08/16/2018
ms.author: diberry
---
The example utterances file, **utterances.json**, follows a specific format. 

The `text` field contains the text of the example utterance. The `intentName` field must correspond to the name of an existing intent in the LUIS app. The `entityLabels` field is required. If you don't want to label any entities, provide an empty array.

If the entityLabels array is not empty, the `startCharIndex` and `endCharIndex` need to mark the entity referred to in the `entityName` field. The index is zero-based, meaning 6 in the top example refers to the "S" of Seattle and not the space before the capital S. If you begin or end the label at a space in the text, the API call to add the utterances fails.

```JSON
[
  {
    "text": "go to Seattle today",
    "intentName": "BookFlight",
    "entityLabels": [
      {
        "entityName": "Location::LocationTo",
        "startCharIndex": 6,
        "endCharIndex": 12
      }
    ]
  },
  {
    "text": "purple dogs are difficult to work with",
    "intentName": "BookFlight",
    "entityLabels": []
  }
]
```
