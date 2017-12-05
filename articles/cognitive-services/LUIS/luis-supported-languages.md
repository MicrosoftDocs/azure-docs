---
title: Support localization using LUIS apps in Azure | Microsoft Docs 
description: Learn about the languages that LUIS supports.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/01/2017
ms.author: cahann
---

# Localization support in LUIS apps

A LUIS app is culture-specific and cannot be changed once it is set. 

## Multi-language LUIS apps
If you need a multi-language LUIS client application such as a chat bot, you have a few options. If LUIS supports all the languages, you develop a LUIS app for each language. Each LUIS app has a unique app ID, and endpoint log. If you need to provide language understanding for a language LUIS does not support, you can use [Microsoft Translator API](../Translator/translator-info-overview.md) to translate the utterance into a supported language, submit the utterance to the LUIS endpoint, and receive the resulting scores.

## Languages supported
LUIS understands utterances in the following languages:


| Language |Locale  |  Prebuilt entity | Phrase suggestions |
| ------- |------|  :------: | ------- |
| American English |`en-US` | ✔  |✔|
| Canadian French |`fr-CA` |   -   |-|
| French (France) |`fr-FR` | ✔ |✔ |
| Italian |`it-IT` | ✔ |✔|
| Dutch |`nl-NL` |  -   |-|
| *[German](#prebuilt-entity-support-for-datetimev2) |`de-DE` | ✔ |✔ |
| Spanish (Spain) |`es-ES` | ✔ |✔|
| Spanish (Mexico)|`es-MX` |  -   |✔|
| *[Portuguese](#prebuilt-entity-support-for-datetimev2) (Brazil) |`pt-BR` | ✔ |✔ |
| Japanese |`ja-JP` | ✔ |✔|
| Korean |`ko-KR` |   -   |-|
| **[Chinese notes](#chinese-support-notes) |`zh-CN` | ✔ |✔|

Support for prebuilt entities varies. See [Prebuilt entities in LUIS](Pre-builtEntities.md) for details. 

## *Prebuilt entity datetimeV2
*German, `de-DE`, support is expected in late December 2017.
*Portuguese, `pt-BR`, support is expected in late December 2017.

## **Chinese support notes

 - In the `zh-cn` culture, LUIS expects the simplified Chinese character set instead of the traditional character set.
 - The names of intents, entities, features, and regular expressions may be in Chinese or Roman characters.
<!--- When writing regular expressions in Chinese, do not insert whitespace between Chinese characters.-->

## Rare or foreign words in an application
In the `en-us` culture, LUIS learns to distinguish most English words, including slang. In the `zh-cn` culture, LUIS learns to distinguish most Chinese characters. If you use a rare word in `en-us` or character in `zh-cn`, and you see that LUIS seems unable to distinguish that word or character, you can add that word or character to a [phrase-list feature](Add-Features.md). For example, words outside of the culture of the application -- that is, foreign words -- should be added to a phrase-list feature. This phrase list should be marked non-exchangeable, to indicate that the set of rare words form a class that LUIS should learn to recognize, but they are not synonyms or exchangeable with each other.

## Tokenization
In normal LUIS use, you don't need to worry about tokenization, but one place where tokenization is important is when manually adding labels to an exported application's JSON file. 

To perform machine learning, LUIS breaks an utterance into tokens. A token is the smallest unit that can be labeled in an entity.

How tokenization is done depends on the application's culture.

For **English, French, Italian, Brazilian Portuguese, and Spanish** token breaks are inserted at any whitespace, and around any punctuation.
For **Korean & Chinese** token breaks are inserted before and after any character, and at any whitespace, and around any punctuation.

