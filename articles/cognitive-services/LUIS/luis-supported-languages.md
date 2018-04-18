---
title: Support localization using LUIS apps in Azure | Microsoft Docs 
description: Learn about the languages that LUIS supports.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/13/2017
ms.author: cahann
---

# Culture-specific understanding in LUIS apps

A LUIS app is culture-specific and cannot be changed once it is set. 

## Multi-language LUIS apps
If you need a multi-language LUIS client application such as a chat bot, you have a few options. If LUIS supports all the languages, you develop a LUIS app for each language. Each LUIS app has a unique app ID, and endpoint log. If you need to provide language understanding for a language LUIS does not support, you can use [Microsoft Translator API](../Translator/translator-info-overview.md) to translate the utterance into a supported language, submit the utterance to the LUIS endpoint, and receive the resulting scores.

## Languages supported
LUIS understands utterances in the following languages:


| Language |Locale  |  Prebuilt domain | Prebuilt entity | Phrase suggestions |
| --|  ------- |  :------: |  :------: |   :------:  |
| American English |`en-US` | ✔ | ✔  |✔|
| Canadian French |`fr-CA` |-|   -   |-|
| *[Chinese](#chinese-support-notes) |`zh-CN` | ✔ | ✔ |✔|
| Dutch |`nl-NL` |-|  -   |-|
| French (France) |`fr-FR` |-| ✔ |✔ |
| German |`de-DE` |-| ✔ |✔ |
| Italian |`it-IT` |-| ✔ |✔|
| *[Japanese](#japanese-support-notes) |`ja-JP` |-| ✔ |✔|
| Korean |`ko-KR` |-|   -   |-|
| Portuguese (Brazil) |`pt-BR` |-| ✔ |✔ |
| Spanish (Spain) |`es-ES` |-| ✔ |✔|
| Spanish (Mexico)|`es-MX` |-|  -   |✔|


Language support varies for [prebuilt entities](luis-reference-prebuilt-entities.md) and [prebuilt domains](luis-reference-prebuilt-domains.md). 

### *Chinese support notes

 - In the `zh-cn` culture, LUIS expects the simplified Chinese character set instead of the traditional character set.
 - The names of intents, entities, features, and regular expressions may be in Chinese or Roman characters.
 - See the [prebuilt domains reference ](luis-reference-prebuilt-domains.md) for information on which prebuilt domains are supported in the `zh-cn` culture.
<!--- When writing regular expressions in Chinese, do not insert whitespace between Chinese characters.-->

### *Japanese support notes

 - Because LUIS does not provide syntactic analysis and will not understand the difference between Keigo and informal Japanese, you need to incorporate the different levels of formality as training examples for your applications. 
     - でございます is not the same as です. 
     - です is not the same as だ. 

## Rare or foreign words in an application
In the `en-us` culture, LUIS learns to distinguish most English words, including slang. In the `zh-cn` culture, LUIS learns to distinguish most Chinese characters. If you use a rare word in `en-us` or character in `zh-cn`, and you see that LUIS seems unable to distinguish that word or character, you can add that word or character to a [phrase-list feature](Add-Features.md). For example, words outside of the culture of the application -- that is, foreign words -- should be added to a phrase-list feature. This phrase list should be marked non-interchangeable, to indicate that the set of rare words form a class that LUIS should learn to recognize, but they are not synonyms or interchangeable with each other.

## Tokenization
To perform machine learning, LUIS breaks an utterance into tokens. A token is the smallest unit that can be labeled in an entity.

Tokenization is based on the application's culture.

|Language|  every space or special character | character level|compound words
|--|:--:|:--:|:--:|
|Chinese||✔||
|Dutch|||✔|
|English|✔ |||
|French|✔|||
|German|||✔|
|Italian|✔|||
|Korean||✔|||
|Portuguese (Brazil)|✔|||
|Spanish|✔|||