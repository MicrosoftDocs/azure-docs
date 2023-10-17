---
title: Migrate to V3 - Translator
titleSuffix: Azure AI services
description: This article provides the steps to help you migrate from V2 to V3 of the Azure AI Translator.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
---

# Translator V2 to V3 Migration

> [!NOTE]
> V2 was deprecated on April 30, 2018. Please migrate your applications to V3 in order to take advantage of new functionality available exclusively in V3. V2 was retired on May 24, 2021. 

The Microsoft Translator team has released Version 3 (V3) of the Translator. This release includes new features, deprecated methods and a new format for sending to, and receiving data from the Microsoft Translator Service. This document provides information for changing applications to use V3. 

The end of this document contains helpful links for you to learn more.

## Summary of features

* No Trace - In V3 No-Trace applies to all pricing tiers in the Azure portal. This feature means that no text submitted to the V3 API, will be saved by Microsoft.
* JSON - XML is replaced by JSON. All data sent to the service and received from the service is in JSON format.
* Multiple target languages in a single request - The Translate method accepts multiple 'to' languages for translation in a single request. For example, a single request can be 'from' English and 'to' German, Spanish and Japanese, or any other group of languages.
* Bilingual dictionary - A bilingual dictionary method has been added to the API. This method includes 'lookup' and 'examples'.
* Transliterate - A transliterate method has been added to the API. This method will convert words and sentences in one script into another script. For example, Arabic to Latin.
* Languages - A new 'languages' method delivers language information, in JSON format, for use with the 'translate', 'dictionary', and 'transliterate' methods.
* New to Translate - New capabilities have been added to the 'translate' method to support some of the features that were in the V2 API as separate methods. An example is TranslateArray.
* Speak method - Text to speech functionality is no longer supported in the Microsoft Translator. Text to speech functionality is available in [Microsoft Speech Service](../speech-service/text-to-speech.md).

The following list of V2 and V3 methods identifies the V3 methods and APIs that will provide the functionality that came with V2.

| V2 API Method   | V3 API Compatibility |
|:----------- |:-------------|
| `Translate`     | [Translate](reference/v3-0-translate.md)          |
| `TranslateArray`      | [Translate](reference/v3-0-translate.md)        |
| `GetLanguageNames`      | [Languages](reference/v3-0-languages.md)         |
| `GetLanguagesForTranslate`     | [Languages](reference/v3-0-languages.md)       |
| `GetLanguagesForSpeak`      | [Microsoft Speech Service](../speech-service/language-support.md)         |
| `Speak`     | [Microsoft Speech Service](../speech-service/text-to-speech.md)          |
| `Detect`     | [Detect](reference/v3-0-detect.md)         |
| `DetectArray`     | [Detect](reference/v3-0-detect.md)         |
| `AddTranslation`     | Feature is no longer supported       |
| `AddTranslationArray`    | Feature is no longer supported          |
| `BreakSentences`      | [BreakSentence](reference/v3-0-break-sentence.md)       |
| `GetTranslations`      | Feature is no longer supported         |
| `GetTranslationsArray`      | Feature is no longer supported         |

## Move to JSON format

Microsoft Translator Translation V2 accepted and returned data in XML format. In V3, all data sent and received using the API is in JSON format. XML will no longer be accepted or returned in V3.

This change will affect several aspects of an application written for the V2 Text Translation API. As an example: The Languages API returns language information for text translation, transliteration, and the two dictionary methods. You can request all language information for all methods in one call or request them individually.

The languages method does not require authentication; by selecting the following link you can see all the language information for V3 in JSON:

[https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation,dictionary,transliteration](https://api.cognitive.microsofttranslator.com/languages?api-version=3.0&scope=translation,dictionary,transliteration)

## Authentication Key

The authentication key you are using for V2 will be accepted for V3. You will not need to get a new subscription. You will be able to mix V2 and V3 in your apps during the yearlong migration period, making it easier for you to release new versions while you are still migrating from V2-XML to V3-JSON.

## Pricing Model

Microsoft Translator V3 is priced in the same way V2 was priced; per character, including spaces. The new features in V3 make some changes in what characters are counted for billing.

| V3 Method   | Characters Counted for Billing |
|:----------- |:-------------|
| `Languages`     | No characters submitted, none counted, no charge.          |
| `Translate`     | Count is based on how many characters are submitted for translation, and how many languages the characters are translated into. 50 characters submitted, and 5 languages requested will be 50x5.           |
| `Transliterate`     | Number of characters submitted for transliteration are counted.         |
| `Dictionary lookup & example`     | Number of characters submitted for Dictionary lookup and examples are counted.         |
| `BreakSentence`     | No Charge.       |
| `Detect`     | No Charge.      |

## V3 End Points

Global

* api.cognitive.microsofttranslator.com

## V3 API text translations methods

[`Languages`](reference/v3-0-languages.md)

[`Translate`](reference/v3-0-translate.md)

[`Transliterate`](reference/v3-0-transliterate.md)

[`BreakSentence`](reference/v3-0-break-sentence.md)

[`Detect`](reference/v3-0-detect.md)

[`Dictionary/lookup`](reference/v3-0-dictionary-lookup.md)

[`Dictionary/example`](reference/v3-0-dictionary-examples.md)

## Compatibility and customization

> [!NOTE]
> 
> The Microsoft Translator Hub will be retired on May 17, 2019. [View important migration information and dates](https://www.microsoft.com/translator/business/hub/).   

Microsoft Translator V3 uses neural machine translation by default. As such, it cannot be used with the Microsoft Translator Hub. The Translator Hub only supports legacy statistical machine translation. Customization for neural translation is now available using the Custom Translator. [Learn more about customizing neural machine translation](custom-translator/overview.md)

Neural translation with the V3 text API does not support the use of standard categories (SMT, speech, tech, _generalnn_).

| Version | Endpoint | GDPR Processor Compliance | Use Translator Hub | Use Custom Translator (Preview) |
| :------ | :------- | :------------------------ | :----------------- | :------------------------------ |
|Translator Version 2|    api.microsofttranslator.com|    No    |Yes    |No|
|Translator Version 3|    api.cognitive.microsofttranslator.com|    Yes|    No|    Yes|

**Translator Version 3**

* It's generally available and fully supported.
* It's GDPR-compliant as a processor and satisfies all ISO 20001 and 20018 as well as SOC 3 certification requirements. 
* It allows you to invoke the neural network translation systems you have customized with Custom Translator (Preview), the new Translator NMT customization feature. 
* It doesn't provide access to custom translation systems created using the Microsoft Translator Hub.

You are using Version 3 of the Translator if you are using the api.cognitive.microsofttranslator.com endpoint.

**Translator Version 2**

* Doesn't satisfy all ISO 20001,20018 and SOC 3 certification requirements. 
* Doesn't allow you to invoke the neural network translation systems you have customized with the Translator customization feature.
* Provides access to custom translation systems created using the Microsoft Translator Hub.
* You are using Version 2 of the Translator if you are using the api.microsofttranslator.com endpoint.

No version of the Translator creates a record of your translations. Your translations are never shared with anyone. More information on the [Translator No-Trace](https://www.aka.ms/NoTrace) webpage.

## Links

* [Microsoft Privacy Policy](https://privacy.microsoft.com/privacystatement)
* [Microsoft Azure Legal Information](https://azure.microsoft.com/support/legal)
* [Online Services Terms](https://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&DocumentTypeId=31)

## Next steps

> [!div class="nextstepaction"]
> [View V3.0 Documentation](reference/v3-0-reference.md)
