---
title: Translator Text API Translation Customization
titlesuffix: Azure Cognitive Services
description: Use the Microsoft Translator Hub to build your own machine translation system using your preferred terminology and style.
services: cognitive-services
author: Jann-Skotdal
manager: cgronlun

ms.service: cognitive-services
ms.component: translator-text
ms.topic: article
ms.date: 05/10/2018
ms.author: v-jansko
---

# Customize your text translations

The Microsoft Custom Translator preview is feature of the Microsoft Translator service, which allows users to customize Microsoft Translator’s advanced neural machine translation when translating text using the Translator Text API (version 3 only). 

The feature can also be used to customize speech translation when used with [Cognitive Services Speech preview](https://docs.microsoft.com/azure/cognitive-services/speech-service/).

## Custom Translator

With Custom Translator, you can build neural translation systems that understand the terminology used in your own business and industry. The customized translation system will then integrate into existing applications, workflows, and websites. 

### How does it work?

Use your previously translated documents (leaflets, webpages, documentation, etc.) to build a translation system that reflects your domain-specific terminology and style, better than a generic translation system. Users can upload TMX, XLIFF, TXT, DOCX, and XLSX documents.  

The system also accepts data that is parallel at the document level but is not yet aligned at the sentence level. If users have access to versions of the same content in multiple languages but in separate documents Custom Translator will be able to automatically match sentences across documents.  The system can also use monolingual data in either or both languages to complement the parallel training data to improve the translations. 

The customized system is then available through a regular call to the Microsoft Translator Text API using the category parameter.

Given the appropriate type and amount of training data it is not uncommon to expect gains between 5 and 10, or even more BLEU points on translation quality by using Custom Translator.

More details about the various levels of customization based on available data can be found in the [Custom Translator User Guide](http://aka.ms/CustomTranslatorDocs).


## Microsoft Translator Hub

The legacy Microsoft Translator Hub can be used to translate statistical machine translation. [Learn more](https://www.microsoft.com/en-us/translator/hub.aspx) 

## Custom Translator versus Hub

|   | **Hub** | **Custom Translator**|
|:-----|:----:|:----:|
|Customization Feature Status	| General Availability	| Preview |
| Text API version	| V2 only	| V3 only |
| SMT customization	| Yes	| No | 
| NMT customization	| No	| Yes |
| New unified Speech services customization	| No	| Yes | 
| [No Trace](http://www.aka.ms/notrace) | Yes	| Yes | 

## Collaborative Translations Framework

> [!NOTE]
> As of February 1, 2018, AddTranslation() and AddTranslationArray() are no longer available for use with the Translator Text API V2.0. These methods will fail and nothing will be written. The Translator Text API V3.0 does not support these methods.

>Similar functionality is available in the Translator Hub API. See [https://hub.microsofttranslator.com/swagger](https://hub.microsofttranslator.com/swagger). 

## Next steps

> [!div class="nextstepaction"]
> [Set up a customized language system using Custom Translator](http://aka.ms/CustomTranslatorDocs)
