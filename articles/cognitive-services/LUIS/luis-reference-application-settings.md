---
title: Application settings - LUIS
description: Applications settings for Azure Cognitive Services language understanding apps are stored in the app and portal.
ms.topic: reference
ms.date: 05/04/2020
---

# App and version settings

These settings are stored in the [exported](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c40) app and updated with the REST APIs or LUIS portal.

Changing your app version settings resets your app training status to untrained.

[!INCLUDE [App and version settings](includes/app-version-settings.md)]


Text reference and examples include:

* [Punctuation](#punctuation-normalization)
* [Diacritics](#diacritics-normalization)

## Diacritics normalization

The following utterances show how diacritics normalization impacts utterances:

|With diacritics set to false|With diacritics set to true|
|--|--|
|`quiero tomar una piña colada`|`quiero tomar una pina colada`|
|||

### Language support for diacritics

#### Brazilian portuguese `pt-br` diacritics

|Diacritics set to false|Diacritics set to true|
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

|Diacritics set to false|Diacritics set to true|
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

|Diacritics set to false|Diacritics set to true|
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

|Diacritics set to false|Diacritics set to true|
|--|--|
|`ä`|`a`|
|`ö`|`o`|
|`ü`|`u`|

#### Italian `it-it` diacritics

|Diacritics set to false|Diacritics set to true|
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

|Diacritics set to false|Diacritics set to true|
|-|-|
|`á`|`a`|
|`é`|`e`|
|`í`|`i`|
|`ó`|`o`|
|`ú`|`u`|
|`ü`|`u`|
|`ñ`|`u`|

## Punctuation normalization

The following utterances show how punctuation impacts utterances:

|With punctuation set to False|With punctuation set to True|
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

## Next steps

* Learn [concepts](luis-concept-utterance.md#utterance-normalization-for-diacritics-and-punctuation) of diacritics and punctuation.
