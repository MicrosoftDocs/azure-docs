---
title: Neural dictionary - Translator
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

# Neural dictionary

The neural dictionary is an extension to our [dynamic dictionary](dynamic-dictionary.md) and [phrase dictionary](custom-translator/concepts/dictionaries.md#phrase-dictionary) capabilities. Both dynamic and phrase dictionaries allow you to customize the translation output by providing your own translations for specific terms or phrases. The neural dictionary improves translation quality for sentences that include one or more term translations by letting the machine translation model adjust both the term and the context.

## Neural dictionary key features

* Greater translation accuracy in comparison to phrase dictionaries that rely on an exact find-and-replace method.

* More fluent translations for sentences that include one or more term translations.

* Overall high-term translation accuracy.

* Neural phrase fixing that effectively handles verbs, adjectives, and noun phrases. **Both source and target must have the same part-of-speech (syntax) tags**.

The following table lists the differences between standard and neural phrase fixing:

|Standard phrase fix | Neural phrase fix|
|--------------------|------------------
|An exact find-and-replace operation. The requested translation appears in the output in the exact same format. | The requested translation can be inflected or changed casing.|
|The requested translation is assumed to be the exact translation. |The requested translation is expected to be in a lemma (word base) form.|
|The phrase is applied only if the source part appears in the text in the exact same form (no difference). | The phrase is applied only if the source part appears in the text in the exact same form (no difference).|
|Can be reliably used for copying. | Can't be used reliably for copying.|
|Works most effectively with nouns. |Works effectively with nouns, verbs, adjectives, and noun phrases.|

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

Neural dictionary is available using [Custom Translator](https://portal.customtranslator.azure.ai/) platform with phrase dictionaries for all [supported languages](#supported-languages). Full (or dictionary only) custom model retraining is required to enable neural dictionary.

## Guidance and recommendations

- An entry from the phrase dictionary is applied only if the source element is found via an exact case-sensitive match. This action applies to both hard and neural phrase fixing.

    * When working with a neural phrase-fix dictionary, to ensure that the phrase dictionary entry is applied consistently, consider adding phrase entries with the source in various forms.

    * For example, If you want to make sure that "solution" is translated as "alternatywa" (Polish translation of the English word "alternative") next to `solution _ alternatywa` you can add the following entries as well: `Solution _ alternatywa`, `solutions _ alternatywy`, `Solutions _ alternatywy`.

- If you're using a phrase dictionary to ensure that a specific word or phrase is copied "*as is*" from the input text to the output translation, consider enforcing a verbatim dictionary for greater consistency.  "*As is*" copying isn't guaranteed with the neural phrase dictionary because it can inflect words or change casing. However, it can copy named entities and acronyms.

- Neural phrase fixing isn't applied for sentences containing at least one of the following elements:  emoji, emoticon, URL, social media identifier, code identifier, math symbols, or long number sequences such as a hexadecimal.

- Infrequently (less than 0.1%), a neural phrase fix doesn't respect the dynamic dictionary annotation or phrase dictionary entry and the requested translation doesn't appear in the output translation.

- Avoid adding translations of common or frequent words or phrases to the phrase dictionary.

## Next steps

To learn more, start with the [Custom Translator beginner's guide](custom-translator/beginners-guide.md).
