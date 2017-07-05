---
title: Support localization using LUIS apps in Azure | Microsoft Docs 
description: Learn about the languages that LUIS supports.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Localization support in LUIS apps

This article describes considerations for designing LUIS apps in multiple languages.

You choose the culture when you start creating your LUIS app, and it cannot be modified once the application is created.

LUIS understands utterances in the following languages. Support for prebuilt entities varies. See [Prebuilt entities in LUIS](Pre-builtEntities.md) for details. 

Locale  | Language | Prebuilt entity support |
------| ------- | ------- |
en-US | American English | :ballot_box_with_check:  |
fr-CA | Canadian French |   -   |
fr-FR | French (France) | :ballot_box_with_check: |
it-IT | Italian | :ballot_box_with_check: |
nl-NL | Dutch |  -   |
de-DE | German |  :ballot_box_with_check: |
es-ES | Spanish (Spain) | :ballot_box_with_check: |
es-MX | Spanish (Mexico)|  -   |
pt-BR | Portuguese (Brazil) | :ballot_box_with_check: |
ja-JP | Japanese | :ballot_box_with_check: |
ko-KR | Korean |   -   |
zh-CN | Chinese | :ballot_box_with_check: |



## Chinese support notes

 - In the zh-cn culture, LUIS expects the simplified Chinese character set (not the traditional character set).
 - The names of intents, entities, features, and regular expressions may be in Chinese or Roman characters.
 - When writing regular expressions in Chinese, do not insert whitespace between Chinese characters.

## Rare or foreign words in an application
In the en-us culture, LUIS can learn to distinguish most English words, including slang. In the zh-cn culture, LUIS can learn to distinguish most Chinese characters. If you use a rare word (en-us) or character (zh-cn), and you see that LUIS seems unable to distinguish that word or character, you can add that word or character to a [phrase-list feature](Add-Features.md). For example, words outside of the culture of the application -- that is, foreign words -- should be added to a phrase-list feature. This phrase list should be marked non-exchangeable, to indicate that the set of rare words form a class that LUIS should learn to recognize, but they are not synonyms or exchangable with each other.

## Tokenization
In normal LUIS use, you don't need to worry about tokenization, but one place where tokenization is important is when manually adding labels to an exported application's JSON file. See the section on importing and exporting an application for details.

To perform machine learning, LUIS breaks an utterance into tokens. A token is the smallest unit that can be labeled in an entity.

How tokenization is done depends on the application's culture:

 * **English, French, Italian, Brazilian Portuguese, and Spanish:** token breaks are inserted at
   any whitespace, and around any punctuation.
 * **Korean & Chinese:** token breaks are inserted before and after any
   character, and at any whitespace, and around any punctuation.

