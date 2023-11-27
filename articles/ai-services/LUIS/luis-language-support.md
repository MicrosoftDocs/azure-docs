---
title: Language support - LUIS
titleSuffix: Azure AI services
description: LUIS has a variety of features within the service. Not all features are at the same language parity. Make sure the features you are interested in are supported in the language culture you are targeting. A LUIS app is culture-specific and cannot be changed once it is set.
#services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: reference
ms.date: 01/18/2022
---

# Language and region support for LUIS

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


LUIS has a variety of features within the service. Not all features are at the same language parity. Make sure the features you are interested in are supported in the language culture you are targeting. A LUIS app is culture-specific and cannot be changed once it is set.

## Multilingual LUIS apps

If you need a multilingual LUIS client application such as a chatbot, you have a few options. If LUIS supports all the languages, you develop a LUIS app for each language. Each LUIS app has a unique app ID, and endpoint log. If you need to provide language understanding for a language LUIS does not support, you can use the [Translator service](../translator/translator-overview.md) to translate the utterance into a supported language, submit the utterance to the LUIS endpoint, and receive the resulting scores.

> [!NOTE]
> A newer version of Language Understanding capabilities is now available as part of Azure AI Language. For more information, see [Azure AI Language Documentation](../language-service/index.yml). For language understanding capabilities that support multiple languages within the Language Service, see [Conversational Language Understanding](../language-service/conversational-language-understanding/concepts/multiple-languages.md).

## Languages supported

LUIS understands utterances in the following languages:

| Language |Locale  |  Prebuilt domain | Prebuilt entity | Phrase list recommendations | **[Sentiment analysis](../language-service/sentiment-opinion-mining/overview.md) and [key phrase extraction](../language-service/key-phrase-extraction/overview.md)|
|--|--|:--:|:--:|:--:|:--:|
| Arabic (preview - modern standard Arabic) |`ar-AR`|-|-|-|-|
| *[Chinese](#chinese-support-notes) |`zh-CN` | ✔ | ✔ |✔|-|
| Dutch |`nl-NL` |✔|-|-|✔|
| English (United States) |`en-US` | ✔ | ✔  |✔|✔|
| English (UK) |`en-GB` | ✔ | ✔  |✔|✔|
| French (Canada) |`fr-CA` |-|-|-|✔|
| French (France) |`fr-FR` |✔| ✔ |✔ |✔|
| German |`de-DE` |✔| ✔ |✔ |✔|
| Gujarati (preview) | `gu-IN`|-|-|-|-|
| Hindi (preview) | `hi-IN`|-|✔|-|-|
| Italian |`it-IT` |✔| ✔ |✔|✔|
| *[Japanese](#japanese-support-notes) |`ja-JP` |✔| ✔ |✔|Key phrase only|
| Korean |`ko-KR` |✔|-|-|Key phrase only|
| Marathi (preview) | `mr-IN`|-|-|-|-|
| Portuguese (Brazil) |`pt-BR` |✔| ✔ |✔ |not all sub-cultures|
| Spanish (Mexico)|`es-MX` |-|✔|✔|✔|
| Spanish (Spain) |`es-ES` |✔| ✔ |✔|✔|
| Tamil (preview) | `ta-IN`|-|-|-|-|
| Telugu (preview) | `te-IN`|-|-|-|-|
| Turkish | `tr-TR` |✔|✔|-|Sentiment only|




Language support varies for [prebuilt entities](luis-reference-prebuilt-entities.md) and [prebuilt domains](luis-reference-prebuilt-domains.md).

[!INCLUDE [Chinese language support notes](includes/chinese-language-support-notes.md)]

### *Japanese support notes

 - Because LUIS does not provide syntactic analysis and will not understand the difference between Keigo and informal Japanese, you need to incorporate the different levels of formality as training examples for your applications.
     - でございます is not the same as です.
     - です is not the same as だ.

[!INCLUDE [Language service support notes](includes/text-analytics-support-notes.md)]

### Speech API supported languages
See Speech [Supported languages](../speech-service/speech-to-text.md) for Speech dictation mode languages.

### Bing Spell Check supported languages
See Bing Spell Check [Supported languages](../../cognitive-services/bing-spell-check/language-support.md) for a list of supported languages and status.

## Rare or foreign words in an application
In the `en-us` culture, LUIS learns to distinguish most English words, including slang. In the `zh-cn` culture, LUIS learns to distinguish most Chinese characters. If you use a rare word in `en-us` or character in `zh-cn`, and you see that LUIS seems unable to distinguish that word or character, you can add that word or character to a [phrase-list feature](concepts/patterns-features.md). For example, words outside of the culture of the application -- that is, foreign words -- should be added to a phrase-list feature.

<!--This phrase list should be marked non-interchangeable, to indicate that the set of rare words forms a class that LUIS should learn to recognize, but they are not synonyms or interchangeable with each other.-->

### Hybrid languages
Hybrid languages combine words from two cultures such as English and Chinese. These languages are not supported in LUIS because an app is based on a single culture.

## Tokenization
To perform machine learning, LUIS breaks an utterance into [tokens](luis-glossary.md#token) based on culture.

|Language|  every space or special character | character level|compound words
|--|:--:|:--:|:--:|
|Arabic|✔|||
|Chinese||✔||
|Dutch|✔||✔|
|English (en-us)|✔ |||
|English (en-GB)|✔ |||
|French (fr-FR)|✔|||
|French (fr-CA)|✔|||
|German|✔||✔|
|Gujarati|✔|||
|Hindi|✔|||
|Italian|✔|||
|Japanese|||✔
|Korean||✔||
|Marathi|✔|||
|Portuguese (Brazil)|✔|||
|Spanish (es-ES)|✔|||
|Spanish (es-MX)|✔|||
|Tamil|✔|||
|Telugu|✔|||
|Turkish|✔|||


### Custom tokenizer versions

The following cultures have custom tokenizer versions:

|Culture|Version|Purpose|
|--|--|--|
|German<br>`de-de`|1.0.0|Tokenizes words by splitting them using a machine learning-based tokenizer that tries to break down composite words into their single components.<br>If a user enters `Ich fahre einen krankenwagen` as an utterance, it is turned to `Ich fahre einen kranken wagen`. Allowing the marking of `kranken` and `wagen` independently as different entities.|
|German<br>`de-de`|1.0.2|Tokenizes words by splitting them on spaces.<br> If a user enters `Ich fahre einen krankenwagen` as an utterance, it remains a single token. Thus `krankenwagen` is marked as a single entity. |
|Dutch<br>`nl-nl`|1.0.0|Tokenizes words by splitting them using a machine learning-based tokenizer that tries to break down composite words into their single components.<br>If a user enters `Ik ga naar de kleuterschool` as an utterance, it is turned to `Ik ga naar de kleuter school`. Allowing the marking of `kleuter` and `school` independently as different entities.|
|Dutch<br>`nl-nl`|1.0.1|Tokenizes words by splitting them on spaces.<br> If a user enters `Ik ga naar de kleuterschool` as an utterance, it remains a single token. Thus `kleuterschool` is marked as a single entity. |


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

[Import the file as a new app](how-to/sign-in.md), instead of a version. This action means the new app has a different app ID but uses the tokenizer version specified in the file.
