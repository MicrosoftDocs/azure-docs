---
title: Language support
titleSuffix: Azure Cognitive Services
description: LUIS has a variety of features within the service. Not all features are at the same language parity. Make sure the features you are interested in are supported in the language culture you are targeting. A LUIS app is culture-specific and cannot be changed once it is set.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 03/19/2019
ms.author: diberry
---

# Language and region support for LUIS

LUIS has a variety of features within the service. Not all features are at the same language parity. Make sure the features you are interested in are supported in the language culture you are targeting. A LUIS app is culture-specific and cannot be changed once it is set.

## Multi-language LUIS apps

If you need a multi-language LUIS client application such as a chatbot, you have a few options. If LUIS supports all the languages, you develop a LUIS app for each language. Each LUIS app has a unique app ID, and endpoint log. If you need to provide language understanding for a language LUIS does not support, you can use [Microsoft Translator API](../Translator/translator-info-overview.md) to translate the utterance into a supported language, submit the utterance to the LUIS endpoint, and receive the resulting scores.

## Languages supported

LUIS understands utterances in the following languages:

| Language |Locale  |  Prebuilt domain | Prebuilt entity | Phrase list recommendations | **[Text analytics](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages)<br>(Sentiment and<br>Keywords)|
|--|--|:--:|:--:|:--:|:--:|
| American English |`en-US` | ✔ | ✔  |✔|✔|
| *[Chinese](#chinese-support-notes) |`zh-CN` | ✔ | ✔ |✔|-|
| Dutch |`nl-NL` |-|  -   |-|✔|
| French (France) |`fr-FR` |-| ✔ |✔ |✔|
| French (Canada) |`fr-CA` |-|   -   |-|✔|
| German |`de-DE` |-| ✔ |✔ |✔|
| Italian |`it-IT` |-| ✔ |✔|✔|
| *[Japanese](#japanese-support-notes) |`ja-JP` |-| ✔ |✔|Key phrase only|
| Korean |`ko-KR` |-|   -   |-|Key phrase only|
| Portuguese (Brazil) |`pt-BR` |-| ✔ |✔ |not all sub-cultures|
| Spanish (Spain) |`es-ES` |-| ✔ |✔|✔|
| Spanish (Mexico)|`es-MX` |-|  -   |✔|✔|
| Turkish | `tr-TR` |-|-|-|Sentiment only|


Language support varies for [prebuilt entities](luis-reference-prebuilt-entities.md) and [prebuilt domains](luis-reference-prebuilt-domains.md).

### *Chinese support notes

 - In the `zh-cn` culture, LUIS expects the simplified Chinese character set instead of the traditional character set.
 - The names of intents, entities, features, and regular expressions may be in Chinese or Roman characters.
 - See the [prebuilt domains reference](luis-reference-prebuilt-domains.md) for information on which prebuilt domains are supported in the `zh-cn` culture.
<!--- When writing regular expressions in Chinese, do not insert whitespace between Chinese characters.-->

### *Japanese support notes

 - Because LUIS does not provide syntactic analysis and will not understand the difference between Keigo and informal Japanese, you need to incorporate the different levels of formality as training examples for your applications.
     - でございます is not the same as です.
     - です is not the same as だ.

### **Text analytics support notes
Text analytics includes keyPhrase prebuilt entity and sentiment analysis. Only Portuguese is supported for subcultures: `pt-PT` and `pt-BR`. All other cultures are supported at the primary culture level. Learn more about Text Analytics [supported languages](https://docs.microsoft.com/azure/cognitive-services/text-analytics/text-analytics-supported-languages).

### Speech API supported languages
See Speech [Supported languages](https://docs.microsoft.com/azure/cognitive-services/Speech/api-reference-rest/supportedlanguages##interactive-and-dictation-mode) for Speech dictation mode languages.

### Bing Spell Check supported languages
See Bing Spell Check [Supported languages](https://docs.microsoft.com/azure/cognitive-services/bing-spell-check/bing-spell-check-supported-languages) for a list of supported languages and status.

## Rare or foreign words in an application
In the `en-us` culture, LUIS learns to distinguish most English words, including slang. In the `zh-cn` culture, LUIS learns to distinguish most Chinese characters. If you use a rare word in `en-us` or character in `zh-cn`, and you see that LUIS seems unable to distinguish that word or character, you can add that word or character to a [phrase-list feature](luis-how-to-add-features.md). For example, words outside of the culture of the application -- that is, foreign words -- should be added to a phrase-list feature. This phrase list should be marked non-interchangeable, to indicate that the set of rare words forms a class that LUIS should learn to recognize, but they are not synonyms or interchangeable with each other.

### Hybrid languages
Hybrid languages combine words from two cultures such as English and Chinese. These languages are not supported in LUIS because an app is based on a single culture.

## Tokenization
To perform machine learning, LUIS breaks an utterance into [tokens](luis-glossary.md#token) based on culture.

|Language|  every space or special character | character level|compound words|[tokenized entity returned](luis-concept-data-extraction.md#tokenized-entity-returned)
|--|:--:|:--:|:--:|:--:|
|Chinese||✔||✔|
|Dutch|||✔|✔|
|English (en-us)|✔ ||||
|French (fr-FR)|✔||||
|French (fr-CA)|✔||||
|German|||✔|✔|
|Italian|✔||||
|Japanese||||✔|
|Korean||✔||✔|
|Portuguese (Brazil)|✔||||
|Spanish (es-ES)|✔||||
|Spanish (es-MX)|✔||||

### Custom tokenizer versions

The following cultures have custom tokenizer versions:

|Culture|Version|Purpose|
|--|--|--|
|German<br>`de-de`|1.0.0|Tokenizes words by splitting them using a machine learning-based tokenizer that tries to break down composite words into their single components.<br>If a user enters `Ich fahre einen krankenwagen` as an utterance, it is turned to `Ich fahre einen kranken wagen`. Allowing the marking of `kranken` and `wagen` independently as different entities.|
|German<br>`de-de`|1.0.2|Tokenizes words by splitting them on spaces.<br> if a user enters `Ich fahre einen krankenwagen` as an utterance, it remains a single token. Thus `krankenwagen` is marked as a single entity. |

### Migrating between tokenizer versions
<!--
Your first choice is to change the tokenizer version in the app file, then import the version. This action changes how the utterances are tokenized but allows you to keep the same app ID. 

Tokenizer JSON for 1.0.0. Notice the property value for  `tokenizerVersion`. 

```JSON
{
    "luis_schema_version": "3.2.0",
    "versionId": "0.1",
    "name": "german_app_1.0.0",
    "desc": "",
    "culture": "de-de",
    "tokenizerVersion": "1.0.0",
    "intents": [
        {
            "name": "i1"
        },
        {
            "name": "None"
        }
    ],
    "entities": [
        {
            "name": "Fahrzeug",
            "roles": []
        }
    ],
    "composites": [],
    "closedLists": [],
    "patternAnyEntities": [],
    "regex_entities": [],
    "prebuiltEntities": [],
    "model_features": [],
    "regex_features": [],
    "patterns": [],
    "utterances": [
        {
            "text": "ich fahre einen krankenwagen",
            "intent": "i1",
            "entities": [
                {
                    "entity": "Fahrzeug",
                    "startPos": 23,
                    "endPos": 27
                }
            ]
        }
    ],
    "settings": []
}
```

Tokenizer JSON for version 1.0.1. Notice the property value for  `tokenizerVersion`. 

```JSON
{
    "luis_schema_version": "3.2.0",
    "versionId": "0.1",
    "name": "german_app_1.0.1",
    "desc": "",
    "culture": "de-de",
    "tokenizerVersion": "1.0.1",
    "intents": [
        {
            "name": "i1"
        },
        {
            "name": "None"
        }
    ],
    "entities": [
        {
            "name": "Fahrzeug",
            "roles": []
        }
    ],
    "composites": [],
    "closedLists": [],
    "patternAnyEntities": [],
    "regex_entities": [],
    "prebuiltEntities": [],
    "model_features": [],
    "regex_features": [],
    "patterns": [],
    "utterances": [
        {
            "text": "ich fahre einen krankenwagen",
            "intent": "i1",
            "entities": [
                {
                    "entity": "Fahrzeug",
                    "startPos": 16,
                    "endPos": 27
                }
            ]
        }
    ],
    "settings": []
}
```
-->

Tokenization happens at the app level. There is no support for version-level tokenization. 

[Import the file as a new app](luis-how-to-start-new-app.md#import-an-app-from-file), instead of a version. This action means the new app has a different app ID but uses the tokenizer version specified in the file. 