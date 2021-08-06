---
title: Microsoft Azure Cognitive Services Text Translation
titlesuffix: Azure Cognitive Services
description: Integrate the Text Translation API into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.topic: overview
ms.subservice: translator-text
ms.date: 08/05/2021
ms.author: lajanuar
ms.custom: cog-serv-seo-aug-2020
keywords: translator, text translation, machine translation, translation service, custom translator
---

# What is Text Translation?

 Text translation is a cloud-based REST API service that uses neural machine translation technology to enable quick and accurate source-to-target text translation in real time across all [supported languages](language-support.md). The Text translation REST APIs enables you to build intelligent solutions for your applications.

This documentation contains the following article types:

* [**Quickstarts**](quickstart-translator.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](translator-how-to-signup.md) contain instructions for using the feature in more specific or customized ways.
* [**Reference**](reference/rest-api-guide.md) provide REST API settings, values, keywords and configuration.

## Text Translation development options and features

You can add Text Translation to your projects and applications using the [**REST API***](reference/rest-api-guide.md), available in Azure or on-premises using the [**Translator Docker container**](containers/translator-how-to-install-container.md).

[**Languages**](reference/v3-0-languages.md). Returns a list of languages supported by **Translate**, **Transliterate** and **Dictionary Lookup** operations. This request does not require authentication; just copy and paste the following GET request into Postman, Fiddler, or your favorite API tool:

```http
https://api.cognitive.microsofttranslator.com/languages?api-version=3.0
```

* [**Translate**](reference/v3-0-translate.md#translate-to-multiple-languages) source-language text to multiple target languages text with a single request
* [**Transliterate**](reference/v3-0-transliterate.md) text by converting characters or letters of a source language to the corresponding characters or letters of a target language.
* [**Detect**](reference/v3-0-detect.md) returns the source code language code and receive a boolean variable denoting whether the detected language is supported for text translation and transliteration.
* [**Translate, Transliterate, and Detect**](reference/v3-0-translate.md#translate-a-single-input-with-language-autodetection) text in a single call.
* Use [**Dictionary lookup**](reference/v3-0-dictionary-lookup.md) to return equivalent words for the source term in the target language.
* Use [**Dictionary example**](reference/v3-0-dictionary-examples.md) to return grammatical structure and context examples for the source term and target term pair.

## Next Steps

* [**Create a Translator resource**](translator-how-to-signup.md) in the Azure portal.

* Explore our [**quickstart**](quickstart-translator.md) and view use examples and code for  [**C#/.NET**](quickstart-translator.md?tabs=csharp), [**Go**](quickstart-translator.md?tabs=go), [**Java**](quickstart-translator.md?tabs=java), [**JavaScript/Node.js**](quickstart-translator.md?tabs=nodejs), and [**Python**](quickstart-translator.md?tabs=python).
