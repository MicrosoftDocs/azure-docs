---
title: Application settings
titleSuffix: Azure Cognitive Services
description: Understand applications settings for Language understanding apps.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 05/29/2019
ms.author: diberry
---

# Application settings

These application settings are stored in the [exported](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40) app and [updated](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings) with the REST APIs. Changing your app version settings resets your app training status to untrained.

|Setting|Default value|Notes|
|--|--|--|
|NormalizePunctuation|True|Removes punctuation.|
|NormalizeDiacritics|True|Removes diacritics.|

## Diacritics normalization 

Turn on utterance normalization for diacritics to your LUIS JSON app file in the `settings` parameter.

```JSON
"settings": [
    {"name": "NormalizeDiacritics", "value": "true"}
] 
```

The following utterances show how diacritics normalization impacts utterances:

|With diacritics set to false|With diacritics set to true|
|--|--|
|`quiero tomar una piña colada`|`quiero tomar una pina colada`|
|||

### Language support for diacritics

#### Brazilian portuguese `pt-br` diacritics

|Diacritics set to false|Diacritics set to false|
|-|-|
|`á`|`a`|
|`â`|`a`|
|`ã`|`a`|
|`à`|`a`|
|`ç`|`c`|
|`é`|`e`|
|`ê`|`e`|
|`í`|`i`|
|`ó`|`o`|
|`ô`|`o`|
|`õ`|`o`|
|`ú`|`u`| 
|||

#### Dutch `nl-nl` diacritics

|Diacritics set to false|Diacritics set to false|
|-|-|
|`á`|`a`|
|`à`|`a`|
|`é`|`e`|
|`ë`|`e`|
|`è`|`e`|
|`ï`|`i`|
|`í`|`i`|
|`ó`|`o`|
|`ö`|`o`|
|`ú`|`u`| 
|`ü`|`u`|
|||

#### French `fr-` diacritics

This includes both french and canadian subcultures.

|Diacritics set to false|Diacritics set to false|
|--|--|
|`é`|`e`|
|`à`|`a`|
|`è`|`e`|
|`ù`|`u`|
|`â`|`a`| 
|`ê`|`e`| 
|`î`|`i`| 
|`ô`|`o`| 
|`û`|`u`| 
|`ç`|`c`| 
|`ë`|`e`| 
|`ï`|`i`| 
|`ü`|`u`| 
|`ÿ`|`y`| 

#### German `de-de` diacritics

|Diacritics set to false|Diacritics set to false|
|--|--|
|`ä`|`a`|
|`ö`|`o`| 
|`ü`|`u`| 

#### Italian `it-it` diacritics

|Diacritics set to false|Diacritics set to false|
|--|--|
|`à`|`a`|
|`è`|`e`|
|`é`|`e`|
|`ì`|`i`| 
|`í`|`i`| 
|`î`|`i`| 
|`ò`|`o`| 
|`ó`|`o`| 
|`ù`|`u`|
|`ú`|`u`|

#### Spanish `es-` diacritics

This includes both spanish and canadian mexican.

|Diacritics set to false|Diacritics set to false|
|-|-|
|`á`|`a`|
|`é`|`e`|
|`í`|`i`| 
|`ó`|`o`| 
|`ú`|`u`|
|`ü`|`u`|
|`ñ`|`u`|


## Punctuation normalization

Turn on utterance normalization for punctuation to your LUIS JSON app file in the `settings` parameter.

```JSON
"settings": [
    {"name": "NormalizePunctuation", "value": "true"}
] 
```

The following utterances show how diacritics impacts utterances:

|With diacritics set to False|With diacritics set to True|
|--|--|
|`Hmm..... I will take the cappuccino`|`Hmm I will take the cappuccino`|
|||

### Punctuation removed

The following punctuation is removed with `NormalizePunctuation` is set to true.

|Punctuation|
|--|
|`-`| 
|`.`| 
|`'`|
|`"`|
|`\`|
|`/`|
|`?`|
|`!`|
|`_`|
|`,`|
|`;`|
|`:`|
|`(`|
|`)`|
|`[`|
|`]`|
|`{`|
|`}`|
|`+`|
|`¡`|
