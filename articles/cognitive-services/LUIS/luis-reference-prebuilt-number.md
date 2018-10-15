---
title: LUIS Prebuilt entities number reference - Azure| Microsoft Docs
titleSuffix: Azure
description: This article contains number prebuilt entity information in Language Understanding (LUIS).
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/20/2018
ms.author: diberry
---

# Number entity
There are many ways in which numeric values are used to quantify, express, and describe pieces of information. This article covers only some of the possible examples. LUIS interprets the variations in user utterances and returns consistent numeric values. Because this entity is already trained, you do not need to add example utterances containing number to the application intents. 

## Types of number
Number is managed from the [Recognizers-text](https://github.com/Microsoft/Recognizers-Text/blob/master/Patterns/English/English-Numbers.yaml) Github repository

## Examples of number resolution

| Utterance        | Entity   | Resolution |
| ------------- |:----------------:| --------------:|
| ```one thousand times```  | ```"one thousand"``` |   ```"1000"```      | 
| ```1,000 people```        | ```"1,000"```    |   ```"1000"```      |
| ```1/2 cup```         | ```"1 / 2"```    |    ```"0.5"```      |
|  ```one half the amount```     | ```"one half"```     |    ```"0.5"```      |
| ```one hundred fifty orders``` | ```"one hundred fifty"``` | ```"150"``` |
| ```one hundred and fifty books``` | ```"one hundred and fifty"``` | ```"150"```|
| ```a grade of one point five```| ```"one point five"``` |  ```"1.5"``` |
| ```buy two dozen eggs```    | ```"two dozen"``` | ```"24"``` |


LUIS includes the recognized value of a **`builtin.number`** entity in the `resolution` field of the JSON response it returns.

## Resolution for prebuilt number
The following example shows a JSON response from LUIS, that includes the resolution of the value 24, for the utterance "two dozen".

```JSON
{
  "query": "order two dozen eggs",
  "topScoringIntent": {
    "intent": "OrderFood",
    "score": 0.105443209
  },
  "intents": [
    {
      "intent": "None",
      "score": 0.105443209
    },
    {
      "intent": "OrderFood",
      "score": 0.9468431361
    },
    {
      "intent": "Help",
      "score": 0.000399122015
    },
  ],
  "entities": [
    {
      "entity": "two dozen",
      "type": "builtin.number",
      "startIndex": 6,
      "endIndex": 14,
      "resolution": {
        "value": "24"
      }
    }
  ]
}
```

## Next steps

Learn about the [currency](luis-reference-prebuilt-currency.md), [ordinal](luis-reference-prebuilt-ordinal.md), and [percentage](luis-reference-prebuilt-percentage.md). 