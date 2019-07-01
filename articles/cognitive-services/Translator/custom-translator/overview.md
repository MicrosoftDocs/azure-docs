---
title: What is Custom Translator?
titleSuffix: Azure Cognitive Services
description: Custom Translator offers similar capabilities to what Microsoft Translator Hub does for Statistical Machine Translation (SMT), but exclusively for Neural Machine Translation (NMT) systems.  
author: swmachan
manager: christw
ms.service: cognitive-services
ms.subservice: translator-text
ms.date: 02/21/2019
ms.author: swmachan
ms.topic: overview
#Customer intent: As a custom translator user, I want to understand what is Custom Translator, so that I can start using it.
---

# What is Custom Translator?

[Custom Translator](https://portal.customtranslator.azure.ai) is a feature of the Microsoft Translator service, which enables Translator enterprises, app developers, and language service providers to build customized neural machine translation (NMT) systems. The customized translation systems seamlessly integrate into existing applications, workflows, and websites. [Custom Translator](https://portal.customtranslator.azure.ai/) offers similar capabilities to what [Microsoft Translator Hub](https://hub.microsofttranslator.com/) does for Statistical Machine Translation (SMT), but exclusively for Neural Machine Translation (NMT) systems.

Translation systems built with [Custom Translator](https://portal.customtranslator.azure.ai) are available through the same cloud-based, [secure](https://cognitive.uservoice.com/knowledgebase/articles/1147537-api-and-customization-confidentiality), high performance, highly scalable Microsoft Translator [Text API V3](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate?tabs=curl), that powers billions of translations  every day.

Custom Translator supports more than three dozen languages, and maps directly to the languages available for NMT. For a complete list, see  [Microsoft Translator Languages](https://docs.microsoft.com/azure/cognitive-services/translator/language-support#customization).

## Features

Custom Translator provides different features to build custom translation system and subsequently access it.

|Feature  |Description  |
|---------|---------|
|[Leverage neural machine translation technology](https://blogs.msdn.microsoft.com/translation/2016/11/15/microsoft-translator-launching-neural-network-based-translations-for-all-its-speech-languages/)     |  Improve your translation by leveraging neural machine translation (NMT) provided by Custom translator.       |
|[Build systems that knows your business terminology](what-are-parallel-documents.md)     |  Customize and build translation systems using parallel documents, that understand the terminologies used in your own business and industry.       |
|[Use a dictionary to build your models](what-is-dictionary.md)     |   If you don't have training data set, you can train a model with only dictionary data.       |
|[Collaborate with others](how-to-manage-settings.md#share-your-workspace)     |   Collaborate with your team by sharing your work with different people.     |
|[Access your custom translation model](https://docs.microsoft.com/azure/cognitive-services/translator/reference/v3-0-translate?tabs=curl)     |  Your custom translation model can be accessed anytime by your existing applications/ programs via Microsoft Translator Text API V3.       |

## Get better translations

Microsoft Translator released [Neural Machine Translation (NMT)](https://blogs.msdn.microsoft.com/translation/2016/11/15/microsoft-translator-launching-neural-network-based-translations-for-all-its-speech-languages/) in 2016. NMT provided major advances in translation quality over the industry-standard [Statistical Machine Translation (SMT)](https://en.wikipedia.org/wiki/Statistical_machine_translation) technology. Because NMT better captures the context of full sentences before translating them, it provides higher quality, more human-sounding, and more fluent translations. [Custom Translator](https://portal.customtranslator.azure.ai) provides NMT for your custom models resulting better translation quality.

You can use previously translated documents to build a translation system. These documents include domain-specific terminology and style, better than a generic translation system. Users can upload ALIGN, PDF, LCL, HTML, HTM, XLF, TMX, XLIFF, TXT, DOCX, and XLSX documents.

Custom Translator also accepts data that's parallel at the document level to make data collection and preparation more effective. If users have access to versions of the same content in multiple languages but in separate documents, Custom Translator will be able to automatically match sentences across documents.

If the appropriate type and amount of training data is supplied, it's not uncommon to see [BLEU score](what-is-bleu-score.md) gains between 5 and 10 points by using Custom Translator.

## Be productive and cost effective

With [Custom Translator](https://portal.customtranslator.azure.ai), training and deploying a custom system doesn't require any programming skills.

Using the secure [Custom Translator](https://portal.customtranslator.azure.ai) portal, users can upload training data, train systems, test systems, and deploy them to a production environment through an intuitive user interface. The system will then be available for use at scale within a few hours (actual time depends on training data size).

[Custom Translator](https://portal.customtranslator.azure.ai) can also be programmatically accessed through a [dedicated API](https://custom-api.cognitive.microsofttranslator.com/swagger/) (currently in preview). The API allows users to manage creating or updating training on a regular basis through their own app or webservice.

The cost of using a custom model to translate content is based on the user’s Translator Text API pricing tier. See the Cognitive Services [Translator Text API pricing webpage](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)
for pricing tier details.

## Securely translate anytime, anywhere on all your apps and services

Custom systems can be seamlessly accessed and integrated into any product or business workflow, and on any device, via the Microsoft Translator Text API through standard REST technology.

## Next steps

- Read about [pricing details](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/).

- With [Quickstart](quickstart-build-deploy-custom-model.md) learn to build a translation model in Custom Translator.
