---
title: Neural Dictionary - Translator
titleSuffix: Azure AI services
description: How to use the neural dictionary feature of the Azure AI Translator.
#services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: conceptual
ms.date: 12/06/2023
ms.author: lajanuar
---

# Neural Dictionary

The neural dictionary is an extension to our [dynamic dictionary](dynamic-dictionary.md) and [phrase dictionary](custom-translator/concepts/dictionaries.md#phrase-dictionary) capabilities. Both dynamic and phrase dictionaries allow you to customize the translation output by providing your own translations for specific terms or phrases.

## Neural dictionary key features

* Greater translation accuracy in comparison to verbatim dictionaries that rely on an exact find-and-replace method.

* More fluent translations for sentences that include one or more term translations by letting the machine translation model adjust both the term and the context.

* Overall high-term translation accuracy.

* Standard phrase fixing, where specific phrases are required to be translated in a specific way, is traditionally recommended to use with nouns. Neural phrase fixing is less limited and can also effectively handle verbs, adjectives, noun phrases, etc. However, both source and target parts should have the same part of speech tags.

The following table shows the differences between standard and neural phrase fixing:

|Standard phrase fix | Neural phrase fix|
|--------------------|------------------
|An exact find-and-replace operation, that is, the requested translation appears in the output in the exact same form. | The requested translation can be inflected or changed casing.|
|Can produce disfluencies.| Produces fluent output.|
|The requested translation is assumed to be the exact translation. |The requested translation is expected to be in a lemma/base form.|
|In phrase dictionary, the phrase is applied only if the source part appears in the text in the exact same form. | (No difference) In phrase dictionary, the phrase is applied only if the source part appears in the text in the exact same form.|
|Can be reliably used for copying. | Can't be used reliably for copying.|
|Works most effectively with nouns. |Works good with nouns, verbs, adjectives, and nouns phrases.|

## Supported languages

Listed here are the current supported **neural dictionary** language pairs:

|Source|Target|
|:----|:----|
|Chinese Simplified (`zh-cn`)|English (`en-us`)|
|English (`en-us`)|Chinese Simplified (`zh-cn`)|
|English (`en-us`)|French (`fr-fr`)|
|English (`en-us`)|German (`de-de`)|
|English (`en-us`)|Italian (`it-it`)|
|English (`en-us`)|Japanese (`ja-jp`)|
|English (`en-us`)|Korean (`ko-kr`)|
|English (`en-us`)|Polish (`pl-pl`)|
|English (`en-us`)|Russian (`ru-ru`)|
|English (`en-us`)|Spanish (`es-es`)|
|English (`en-us`)|Swedish (`sv-se`)|
|French (`fr-fr`)|English (`en-us`)|
|German (`de-de`)|English (`en-us`)|
|Italian (`it-it`)|English (`en-us`)|
|Japanese (`ja-jp`)|English (`en-us`)|
|Korean (`ko-kr`)|English (`en-us`)|
|Polish (`pl-pl`)|English (`en-us`)|
|Russian (`ru-ru`)|English (`en-us`)|
|Spanish (`es-es`)|English (`en-us`)|
|Swedish (`sv-se`)|English (`en-us`)|

## Enable neural dictionary

Neural dictionary is available using Custom Translator platform with phrase dictionaries for all supported languages. Full (or dictionary only) custom model retraining is required to enable neural dictionary.

## Limitations and recommendation

1. An entry from the phrase dictionary is applied only if the source part is found in the source sentence via an exact case-sensitive match. This action applies to both hard and neural phrase fixing.
a. When working with neural phrase fix dictionary, to ensure that the phrase dictionary entry is applied more often, consider adding phrase entries with the source in various forms. For example, If you want to make sure that "solution" is translated as "alternatywa" (Polish translation of "alternative" in English) next to `solution _ alternatywa`, you can add the following entries as well: `Solution _ alternatywa`, `ssolutions _ alternatywy`, `Solutions _ alternatywy`.

1. If you're using a phrase dictionary to ensure that a specific word or phrase is copied "as is" from the input text to the output translation, consider enforcing a verbatim dictionary for greater consistency. Neural phrase dictionary doesn't guarantee copying "as is" because it can inflect words or change casing. However, it can copy named entities and acronyms.

1. Neural phrase fixing isn't applied for a sentence containing at least one of the following elements:  Emoji, emoticon, URL, social media identifier, code identifier, math symbols, long number sequences like hex.

1. Infrequently (but technically possible—less than 0.1%) a neural phrase fix doesn't respect the dynamic dictionary annotation or phrase dictionary entry and the requested translation doesn't appear in the output translation.

1. Avoid adding translations of common or frequent words or phrases to the phrase dictionary.

## Next steps

To learn more, start with the [Custom Translator beginner's guide](custom-translator/beginners-guide.md).
