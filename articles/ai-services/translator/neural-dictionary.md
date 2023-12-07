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

## Limitations and recommendation

1. An entry from the phrase dictionary is applied only if the source part is found in the source sentence via an exact case-sensitive match. This action applies to both hard and neural phrase fixing.
a. When working with neural phrase fix dictionary, to ensure that the phrase dictionary entry is applied more often, consider adding phrase entries with the source in various forms. For example, next to `solution _ alternative`, you can add the following entries as well: `Solution _ alternative`, `solutions _ alternative`, `Solutions _ alternative`.
1. Neural phrase dictionary doesn't guarantee copying "as is" because it can inflect words or change casing. However, it should be able to copy named entities and acronyms well.
a. When using a phrase dictionary, if your goal is to ensure that a specific word or phrase is copied verbatim from the input text to the output translation, consider enforcing standard phrase fixing.
1. Neural phrase fixing isn't applied for a sentence containing at least one of the following elements:  Emoji, emoticon, URL, social media identifier, code identifier, math symbols, long number sequences like Hex.
a.    Emoji, emoticon, URL, social media identifier, code identifier, math symbols, long number sequences like Hex.
1. It's infrequent (but technically possible—less than 0.1%) that a neural phrase fix doesn't respect the dynamic dictionary annotation or phrase dictionary entry and the requested translation doesn't appear in the output translation.


