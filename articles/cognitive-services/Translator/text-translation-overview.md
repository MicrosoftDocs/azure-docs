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

Text translation is a REST API that enables the following requests:

* **Languages**. Get a list of the languages supported by Translate, Transliterate and Dictionary Lookup requests. This request does not require authentication; just copy and paste the following GET request into Postman or your favorite API tool:

```http
https://api.cognitive.microsofttranslator.com/languages?api-version=3.0
```

## Language support

Translator provides multi-language support for text translation, transliteration, language detection, and dictionaries. See [language support](language-support.md) for a complete list, or access the list programmatically with the [REST API](./reference/v3-0-languages.md).

## Improve translations with Custom Translator

 [Custom Translator](customization.md), an extension of the Translator service, can be used to customize the neural translation system and improve the translation for your specific terminology and style.

With Custom Translator, you can build translation systems to handle the terminology used in your own business or industry. Your customized translation system can easily integrate with your existing applications, workflows, websites, and devices, through the regular Translator, by using the category parameter.