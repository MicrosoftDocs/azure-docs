---
title: Translation Customization - Translator
titleSuffix: Azure AI services
description: Use the Microsoft Translator Hub to build your own machine translation system using your preferred terminology and style.
services: cognitive-services
author: laujan
manager: nitinme
ms.service: azure-ai-translator
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
---

# Customize your text translations

The Custom Translator is a feature of the Translator service, which allows users to customize Microsoft Translator's advanced neural machine translation when translating text using Translator (version 3 only).

The feature can also be used to customize speech translation when used with [Azure AI Speech](../../../speech-service/index.yml).

## Custom Translator

With Custom Translator, you can build neural translation systems that understand the terminology used in your own business and industry. The customized translation system will then integrate into existing applications, workflows, and websites.

### How does it work?

Use your previously translated documents (leaflets, webpages, documentation, etc.) to build a translation system that reflects your domain-specific terminology and style, better than a standard translation system. Users can upload TMX, XLIFF, TXT, DOCX, and XLSX documents.  

The system also accepts data that is parallel at the document level but isn't yet aligned at the sentence level. If users have access to versions of the same content in multiple languages but in separate documents, Custom Translator will be able to automatically match sentences across documents.  The system can also use monolingual data in either or both languages to complement the parallel training data to improve the translations.

The customized system is then available through a regular call to Translator using the category parameter.

Given the appropriate type and amount of training data it isn't uncommon to expect gains between 5 and 10, or even more BLEU points on translation quality by using Custom Translator.

More details about the various levels of customization based on available data can be found in the [Custom Translator User Guide](../overview.md).

## Next steps

> [!div class="nextstepaction"]
> [Set up a customized language system using Custom Translator](../overview.md)
