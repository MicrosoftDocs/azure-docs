---
title: Microsoft Azure Cognitive Services Translator
titlesuffix: Azure Cognitive Services
description: Integrate the Text Translation API into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.topic: overview
ms.subservice: translator-text
ms.date: 07/21/2021
ms.author: lajanuar
ms.custom: cog-serv-seo-aug-2020
keywords: translator, text translation, machine translation, translation service, custom translator
---

# What is Text Translation?

 Text translation is a cloud-based REST API service that uses neural machine translation technology to enable quick and accurate source-to-target text translation in real time across all [supported languages](language-support.md). The service

This documentation contains the following article types:  

* [**Quickstarts**](quickstart-translator) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](translator-how-to-signup.md) contain instructions for using the feature in more specific or customized ways.
* [**Reference**](reference/text-translator-rest-api-guide.md) provide REST API settings, values, keywords and configuration.

## Text Translation features

You can use a client library SDK or the REST API  to integrate the following features into your workflows and applications: 

* Return a list of [**languages**](reference/v3-0-languages) supported by Translate, Transliterate and Dictionary Lookup requests. This request does not require authentication; just copy and paste the following GET request into your favorite API tool, such as Postman or Fiddler:

    ```http
    https://api.cognitive.microsofttranslator.com/languages?api-version=3.0
    ```

* [**Translate**](reference/v3-0-translate.md#translate-to-multiple-languages) source-language text to multiple target languages text with a single request
* [**Transliterate**](v3-0-transliterate) text by converting characters or letters of a source language to the corresponding characters or letters of a target language.
* [**Detect**](reference/v3-0-detect) returns the source code language code and receive a boolean variable denoting whether the detected language is supported for text translation and transliteration.
* [**Translate, Transliterate, and Detect**](reference/v3-0-translate#translate-a-single-input-with-language-autodetection) text in a single call.
* Use [**Dictionary lookup**](reference/v3-0-dictionary-lookup.md) to return equivalent words for the source term in the target language.
* Use [**Dictionary example**](reference/v3-0-dictionary-examples.md) to return grammatical structure and context examples for the source term and target term pair.



## Improve translations with Custom Translator

 [Custom Translator](customization.md), an extension of the Translator service, can be used to customize the neural translation system and improve the translation for your specific terminology and style.

With Custom Translator, you can build translation systems to handle the terminology used in your own business or industry. Your customized translation system can easily integrate with your existing applications, workflows, websites, and devices, through the regular Translator, by using the category parameter.