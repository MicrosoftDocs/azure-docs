---
title: Microsoft Azure Cognitive Services Translator
titlesuffix: Azure Cognitive Services
description: Integrate Translator into your applications, websites, tools, and other solutions to provide multi-language user experiences.
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
# What is Translator?

Translator is a cloud-based neural machine service that is part of the [Azure Cognitive Services](../../index.yml?panel=ai&pivot=products) family of RESTful APIs used to build intelligent applications. Translator allows you to add multi-language solutions to your apps, websites, and tools, supports user experiences in [90 languages and dialects](./language-support.md), and can be used with any operating system. Translator powers many Microsoft products and services, and is used by thousands of businesses worldwide in their applications and workflows.

## Translator documentation

* [**Quickstarts**](quickstart-translator.md). Getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](translator-how-to-signup.md). Instructions for using the service in more specific or customized ways.
* [**Tutorials**](tutorial-wpf-translation-csharp.md). Longer guides that show you how to use the service as a component in broader business solutions.
* [**Reference articles**](reference/v3-0-reference.md). API documentation and programming language-based content.

## Translator features

Translator supports the following :

* [**Text Translation**](text-translation-overview.md). Execute real-time and/or asynchronous translation of text between supported source and target languages.
* [**Document Translation**](document-translation/overview.md). Translate batch and complex files while preserving the structure and format of the original documents.
* [**Custom Translator**](custom-translator/overview.md). Build customized models to translate domain- and industry-specific language, terminology and style.

## Neural Machine Translation

Neural Machine Translation (NMT) is the new standard for high-quality AI-powered machine translations. It replaces the legacy Statistical Machine Translation (SMT) technology that reached a quality plateau in the mid-2010s.

NMT provides better translations than SMT not only from a raw translation quality scoring standpoint but also because they will sound more fluent and human. The key reason for this fluidity is that NMT uses the full context of a sentence to translate words. SMT only took the immediate context of a few words before and after each word.

NMT models are at the core of the API and are not visible to end users. The only noticeable difference is improved translation quality, especially for languages such as Chinese, Japanese, and Arabic.

Learn more about [how NMT works](https://www.microsoft.com/translator/mt.aspx#nnt).

## Next steps

* [Create a Translator service](./translator-how-to-signup.md) to get your access keys and endpoint.
* Try our [Quickstart](quickstart-translator.md) to quickly call the Translator service.
* [API reference](./reference/v3-0-reference.md) provides the technical documentation for the APIs.
* [Pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
