---
title: Pattern.any entity type - LUIS
titleSuffix: Azure AI services
description: Pattern.any is a variable-length placeholder used only in a pattern's template utterance to mark where the entity begins and ends.
services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: reference
ms.date: 09/29/2019
---
# Pattern.any entity

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


Pattern.any is a variable-length placeholder used only in a pattern's template utterance to mark where the entity begins and ends.  

Pattern.any entities need to be marked in the [Pattern](luis-how-to-model-intent-pattern.md) template examples, not the intent user examples.

**The entity is a good fit when:**

* The ending of the entity can be confused with the remaining text of the utterance.

## Usage

Given a client application that searches for books based on title, the pattern.any extracts the complete title. A template utterance using pattern.any for this book search is `Was {BookTitle} written by an American this year[?]`.

In the following table, each row has two versions of the utterance. The top utterance is how LUIS initially sees the utterance. It isn't clear where the book title begins and ends. The bottom utterance uses a Pattern.any entity to mark the beginning and end of the entity.

|Utterance with entity in bold|
|--|
|`Was The Man Who Mistook His Wife for a Hat and Other Clinical Tales written by an American this year?`<br><br>Was **The Man Who Mistook His Wife for a Hat and Other Clinical Tales** written by an American this year?|
|`Was Half Asleep in Frog Pajamas written by an American this year?`<br><br>Was **Half Asleep in Frog Pajamas** written by an American this year?|
|`Was The Particular Sadness of Lemon Cake: A Novel written by an American this year?`<br><br>Was **The Particular Sadness of Lemon Cake: A Novel** written by an American this year?|
|`Was There's A Wocket In My Pocket! written by an American this year?`<br><br>Was **There's A Wocket In My Pocket!** written by an American this year?|
||



## Example JSON

Consider the following query:

`where is the form Understand your responsibilities as a member of the community and who needs to sign it after I read it?`

With the embedded form name to extract as a Pattern.any:

`Understand your responsibilities as a member of the community`

#### [V2 prediction endpoint response](#tab/V2)

```JSON
"entities": [
  {
    "entity": "understand your responsibilities as a member of the community",
    "type": "FormName",
    "startIndex": 18,
    "endIndex": 78,
    "role": ""
  }
```


#### [V3 prediction endpoint response](#tab/V3)

This is the JSON if `verbose=false` is set in the query string:

```json
"entities": {
    "FormName": [
        "Understand your responsibilities as a member of the community"
    ]
}
```

This is the JSON if `verbose=true` is set in the query string:

```json
"entities": {
    "FormName": [
        "Understand your responsibilities as a member of the community"
    ],
    "$instance": {
        "FormName": [
            {
                "type": "FormName",
                "text": "Understand your responsibilities as a member of the community",
                "startIndex": 18,
                "length": 61,
                "modelTypeId": 7,
                "modelType": "Pattern.Any Entity Extractor",
                "recognitionSources": [
                    "model"
                ]
            }
        ]
    }
}
```

* * *

## Next steps

In this [tutorial](luis-how-to-model-intent-pattern.md), use the **Pattern.any** entity to extract data from utterances where the utterances are well-formatted and where the end of the data may be easily confused with the remaining words of the utterance.
