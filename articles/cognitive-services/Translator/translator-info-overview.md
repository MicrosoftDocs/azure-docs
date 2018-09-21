---
title: What is Translator Text API?
titlesuffix: Azure Cognitive Services
description: Integrate the Translator Text API into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: noellelacharite
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: overview
ms.date: 05/10/2018
ms.author: nolachar
---

# What is Translator Text API?

The Translator Text API can be seamlessly integrated into your applications, websites, tools, or other solutions to provide multi-language user experiences in [more than 60 languages](languages.md). It can be used on any hardware platform and with any operating system to perform text to text language translation.

The Translator Text API is part of the Azure [Cognitive Services API](https://docs.microsoft.com/azure/#pivot=products&panel=ai) collection of machine learning and AI algorithms in the cloud, readily consumable in your development projects.

## About Microsoft Translator

Microsoft Translator is a cloud-based machine translation service. At the core of this service are the Translator Text API and [Translator Speech API](https://docs.microsoft.com/azure/cognitive-services/speech-service/speech-translation) which power various Microsoft products and services and are used by thousands of businesses worldwide in their applications and workflows, allowing their content to reach a worldwide audience.

Speech translation is also available through the [Cognitive Services Speech preview](https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/), which combines existing Translator Speech API, Bing Speech API, and Custom Speech Service (preview) into a unified and fully customizable service.  

Learn more about the [Microsoft Translator service](https://www.microsoft.com/en-us/translator/home.aspx)

## Language customization

An extension of the core Microsoft Translator service, Custom Translator can be used in conjunction with the Translator Text API to help you customize the neural translation system and improve the translation for your specific terminology and style.

With Custom Translator, you can build translation systems that handle the terminology used in your own business or industry. Your customized translation system will then easily integrate into your existing applications, workflows, and websites, across multiple types of devices, through the regular Microsoft Translator Text API, by using the category parameter. 

Learn more about [language customization](customization.md)

## Microsoft Translator Neural Machine Translation

Neural Machine Translation (NMT) is the new standard for high-quality AI-powered machine translations. It replaces the legacy Statistical Machine Translation (SMT) technology that reached a quality plateau in the mid-2010s.

NMT provides better translations than SMT not only from a raw translation quality scoring standpoint but also because they will sound more fluent and human. The key reason for this fluidity is that NMT uses the full context of a sentence to translate words. SMT only took the immediate context of a few words before and after each word.

NMT models are at the core of the API and are not visible to end users. The only noticeable difference is improved translation quality, especially for languages such as Chinese, Japanese, and Arabic. 

Learn more about [how NMT works](https://www.microsoft.com/en-us/translator/mt.aspx#nnt)

## Next steps

- Read about [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/).

- [Sign up](translator-text-how-to-signup.md) for an access key.

- [Quickstart](quickstarts/csharp.md) is a walkthrough of the REST API calls written in C#. Learn how to translate text from one language to another with minimal code.

- [API reference documentation](https://docs.microsoft.com/azure/cognitive-services/Translator/reference/v3-0-reference) provides the technical documentation for the APIs.

## See also

- [Cognitive Services Documentation page](https://docs.microsoft.com/azure/#pivot=products&panel=ai)
- [Cognitive Services Product page](https://azure.microsoft.com/services/cognitive-services/)
- [Solution and pricing information](https://www.microsoft.com/en-us/translator/default.aspx)
