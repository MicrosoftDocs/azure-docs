---
title: What is Translator? - Translator
titlesuffix: Azure Cognitive Services
description: Integrate Translator into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: overview
ms.date: 05/26/2020
ms.author: swmachan
ms.custom: seodec18
---

# What is Translator?

Azure Cognitive Services Translator is a cloud-based machine translation service and is part of the [Azure Cognitive Services](https://docs.microsoft.com/azure/?pivot=products&panel=ai) family of cognitive APIs for building intelligent apps. Translator is easy to integrate in your applications, websites, tools, and solutions. It allows you to add multi-language user experiences in [more than 70 languages](languages.md), and can be used on any hardware platform with any operating system for text-to-text language translation.

## About Microsoft Translator

Azure Cognitive Services Translator is a cloud-based machine translation service. Translator powers a number of Microsoft products and services, and is used by thousands of businesses worldwide in their applications and workflows, which allows their content to reach a global audience.

Speech translation, powered by Translator, is also available through the [Microsoft Speech Service](https://docs.microsoft.com/azure/cognitive-services/speech-service/). It combines functionality from the Translator Speech API and the Custom Speech Service into a unified and fully customizable service. 

## Language support

Microsoft Translator provides multi-language support for translation, transliteration, language detection, and dictionaries. See [language support](language-support.md) for a complete list, or access the list programmatically with the [REST API](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-languages).  

## Microsoft Translator Neural Machine Translation

Neural Machine Translation (NMT) is the new standard for high-quality AI-powered machine translations. It replaces the legacy Statistical Machine Translation (SMT) technology that reached a quality plateau in the mid-2010s.

NMT provides better translations than SMT not only from a raw translation quality scoring standpoint but also because they will sound more fluent and human. The key reason for this fluidity is that NMT uses the full context of a sentence to translate words. SMT only took the immediate context of a few words before and after each word.

NMT models are at the core of the API and are not visible to end users. The only noticeable difference is improved translation quality, especially for languages such as Chinese, Japanese, and Arabic.

Learn more about [how NMT works](https://www.microsoft.com/en-us/translator/mt.aspx#nnt)

## Language customization

An extension of the Translator service, Custom Translator can be used in conjunction with Translator to help you customize the neural translation system and improve the translation for your specific terminology and style.

With Custom Translator, you can build translation systems that handle the terminology used in your own business or industry. Your customized translation system will then easily integrate into your existing applications, workflows, and websites, across multiple types of devices, through the regular Translator, by using the category parameter.

Learn more about [language customization](customization.md)

## Next steps

- [Sign up](translator-text-how-to-signup.md) for an access key.
- [API reference](https://docs.microsoft.com/azure/cognitive-services/Translator/reference/v3-0-reference) provides the technical documentation for the APIs.
- [Pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
