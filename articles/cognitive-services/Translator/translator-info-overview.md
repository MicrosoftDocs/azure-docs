---
title: Microsoft Translator service
titlesuffix: Azure Cognitive Services
description: Integrate Translator into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.topic: overview
ms.subservice: translator-text
ms.date: 03/15/2021
ms.author: lajanuar
ms.custom: cog-serv-seo-aug-2020
keywords: translator, text translation, machine translation, translation service
---
# What is the Translator service?

Translator is a cloud-based machine translation service and is part of the [Azure Cognitive Services](../../index.yml?panel=ai&pivot=products) family of cognitive APIs used to build intelligent apps. Translator is easy to integrate in your applications, websites, tools, and solutions. It allows you to add multi-language user experiences in [90 languages and dialects](./language-support.md) and can be used for text translation with any operating system.

This documentation contains the following article types:  

* [**Quickstarts**](quickstart-translator.md) are getting-started instructions to guide you through making requests to the service.  
* [**How-to guides**](translator-how-to-signup.md) contain instructions for using the service in more specific or customized ways.  
* [**Concepts**](character-counts.md) provide in-depth explanations of the service functionality and features.  
* [**Tutorials**](tutorial-wpf-translation-csharp.md) are longer guides that show you how to use the service as a component in broader business solutions.  


## About Microsoft Translator

Translator powers many Microsoft products and services, and is used by thousands of businesses worldwide in their applications and workflows.

Speech translation, powered by Translator, is also available through the [Azure Speech service](../speech-service/index.yml). It combines functionality from the Translator Speech API and the Custom Speech Service into a unified and fully customizable service. 

## Language support

Translator provides multi-language support for text translation, transliteration, language detection, and dictionaries. See [language support](language-support.md) for a complete list, or access the list programmatically with the [REST API](./reference/v3-0-languages.md).  

## Microsoft Translator Neural Machine Translation

Neural Machine Translation (NMT) is the new standard for high-quality AI-powered machine translations. It replaces the legacy Statistical Machine Translation (SMT) technology that reached a quality plateau in the mid-2010s.

NMT provides better translations than SMT not only from a raw translation quality scoring standpoint but also because they will sound more fluent and human. The key reason for this fluidity is that NMT uses the full context of a sentence to translate words. SMT only took the immediate context of a few words before and after each word.

NMT models are at the core of the API and are not visible to end users. The only noticeable difference is improved translation quality, especially for languages such as Chinese, Japanese, and Arabic.

Learn more about [how NMT works](https://www.microsoft.com/en-us/translator/mt.aspx#nnt).

## Improve translations with Custom Translator

 [Custom Translator](customization.md), an extension of the Translator service, can be used to customize the neural translation system and improve the translation for your specific terminology and style.

With Custom Translator, you can build translation systems to handle the terminology used in your own business or industry. Your customized translation system can easily integrate with your existing applications, workflows, websites, and devices, through the regular Translator, by using the category parameter.

## Next steps

- [Create a Translator service](./translator-how-to-signup.md) to get your access keys and endpoint.
- Try our [Quickstart](quickstart-translator.md) to quickly call the Translator service.
- [API reference](./reference/v3-0-reference.md) provides the technical documentation for the APIs.
- [Pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
