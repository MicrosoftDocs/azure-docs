---
title: What is Custom Translator?
titleSuffix: Azure AI services
description: Custom Translator offers similar capabilities to what Microsoft Translator Hub does for Statistical Machine Translation (SMT), but exclusively for Neural Machine Translation (NMT) systems.
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.date: 07/18/2023
ms.author: lajanuar
ms.topic: overview
---
# What is Custom Translator?

Custom Translator is a feature of the Microsoft Translator service, which enables enterprises, app developers, and language service providers to build customized neural machine translation (NMT) systems. The customized translation systems seamlessly integrate into existing applications, workflows, and websites.

Translation systems built with [Custom Translator](https://portal.customtranslator.azure.ai) are available through Microsoft Translator [Microsoft Translator Text API V3](../reference/v3-0-translate.md?tabs=curl), the same cloud-based, secure, high performance system powering billions of translations every day.

The platform enables users to build and publish custom translation systems to and from English. Custom Translator supports more than three dozen languages that map directly to the languages available for NMT. For a complete list, *see* [Translator language support](../language-support.md).

This documentation contains the following article types:

* [**Quickstarts**](./quickstart.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](./how-to/create-manage-workspace.md) contain instructions for using the feature in more specific or customized ways.

## Features

Custom Translator provides different features to build custom translation system and later access it.

|Feature  |Description  |
|---------|---------|
|[Apply neural machine translation technology](https://www.microsoft.com/translator/blog/2016/11/15/microsoft-translator-launching-neural-network-based-translations-for-all-its-speech-languages/)     |  Improve your translation by applying neural machine translation (NMT) provided by Custom translator.       |
|[Build systems that knows your business terminology](./beginners-guide.md)     |  Customize and build translation systems using parallel documents that understand the terminologies used in your own business and industry.       |
|[Use a dictionary to build your models](./how-to/train-custom-model.md#when-to-select-dictionary-only-training)     |   If you don't have training data set, you can train a model with only dictionary data.       |
|[Collaborate with others](./how-to/create-manage-workspace.md#manage-workspace-settings)     |   Collaborate with your team by sharing your work with different people.     |
|[Access your custom translation model](./how-to/translate-with-custom-model.md)     |  Your custom translation model can be accessed anytime by your existing applications/ programs via Microsoft Translator Text API V3.       |

## Get better translations

Microsoft Translator released [Neural Machine Translation (NMT)](https://www.microsoft.com/translator/blog/2016/11/15/microsoft-translator-launching-neural-network-based-translations-for-all-its-speech-languages/) in 2016. NMT provided major advances in translation quality over the industry-standard [Statistical Machine Translation (SMT)](https://en.wikipedia.org/wiki/Statistical_machine_translation) technology. Because NMT better captures the context of full sentences before translating them, it provides higher quality, more human-sounding, and more fluent translations. [Custom Translator](https://portal.customtranslator.azure.ai) provides NMT for your custom models resulting better translation quality.

You can use previously translated documents to build a translation system. These documents include domain-specific terminology and style, better than a standard translation system. Users can upload ALIGN, PDF, LCL, HTML, HTM, XLF, TMX, XLIFF, TXT, DOCX, and XLSX documents.

Custom Translator also accepts data that's parallel at the document level to make data collection and preparation more effective. If users have access to versions of the same content in multiple languages but in separate documents, Custom Translator will be able to automatically match sentences across documents.

If the appropriate type and amount of training data is supplied, it's not uncommon to see [BLEU score](concepts/bleu-score.md) gains between 5 and 10 points by using Custom Translator.

## Be productive and cost effective

With [Custom Translator](https://portal.customtranslator.azure.ai), training and deploying a custom system doesn't require any programming skills.

The secure [Custom Translator](https://portal.customtranslator.azure.ai) portal enables users to upload training data, train systems, test systems, and deploy them to a production environment through an intuitive user interface. The system will then be available for use at scale within a few hours (actual time depends on training data size).

[Custom Translator](https://portal.customtranslator.azure.ai) can also be programmatically accessed through a [dedicated API](https://custom-api.cognitive.microsofttranslator.com/swagger/). The API allows users to manage creating or updating training through their own app or webservice.

The cost of using a custom model to translate content is based on the user's Translator Text API pricing tier. See the Azure AI services [Translator Text API pricing webpage](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
for pricing tier details.

## Securely translate anytime, anywhere on all your apps and services

Custom systems can be seamlessly accessed and integrated into any product or business workflow and on any device via the Microsoft Translator Text REST API.

## Next steps

* Read about [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/).

* With [Quickstart](./quickstart.md) learn to build a translation model in Custom Translator.
