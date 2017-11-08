---
title: Translation Customization | Microsoft Docs
description: Use the Microsoft Translator Hub and the Collaborative Translations Framework (CTF) to build your own machine translation system using your preferred terminology and style.
services: cognitive-services
author: jann-skotdal
manager: chriswendt1

ms.service: cognitive-services
ms.technology: translator
ms.topic: article
ms.date: 11/01/2017
ms.author: v-jansko
---

# Customize and improve your text translations

The Translator Hub and Collaborative Translations Framework are free extensions of the Microsoft Translator service which allow you to customize and improve text translations you receive from the Translator Text API. They are both fully integrated into the Translator Text API. 

## Customize translations with the Microsoft Translator Hub

With the Hub, you can build translation systems customized on existing statistical machine translation systems to understand the terminology used in your own business and industry. The Hub will combine your domain specific data with Microsoft's vast language knowledge to generate a custom and unique translation system. 

Your customized translation system will then easily integrate into your existing applications, workflows and websites, across multiple types of devices.

### How does it work?
The Hub allows for varying levels of customization. You can start by adding just a few words in a dictionary, such as product names, etc. which would then be translated exactly the way you want. 

As your needs grow, you can use parallel sentences to build a translation system that reflects your domain-specific terminology and style better than a generic translation system. Use your previously translated documents (leaflets, webpages, documentation, etc.) in TMX, XLIFF, TXT, HTML, DOCX, XLSX and PDF document formats. 

The customized system is then available by through a regular call to the Microsoft Translator Text API using the category parameter.

More details about the various levels of customization, based on available data, can be found on the [Microsoft Translator Blog](https://blogs.msdn.microsoft.com/translation/2016/01/27/new-microsoft-translator-customization-features-help-unleash-the-power-of-artificial-intelligence-for-everyone/).

## Improve translated content with the Collaborative Translations Framework

> [!NOTE]
> As of January 1, 2018 AddTranslation() will do nothing, it will silently fail. The API response will still be success (200), but nothing will be written.
Microsoft will replace the functionality with an extended version of the Translator Hub API, which produces a custom system with your terminology, and you can invoke it using the Category ID of your custom Hub system. See [https://hub.microsofttranslator.com](https://hub.microsofttranslator.com). 

The Collaborative Translations Framework (CTF) is an extension of the core Microsoft Translator Text API that enables postpublishing improvement of translated text. There are no additional costs associated with the use of the CTF.

Once machine translated text has been published on your site or in your application, you can use reader feedback to improve its quality, to the benefit of all readers.

### How does it work?
The CTF API enables a mechanism by which a reader can provide alternative translations to those already published. A reader can also vote on previously offered alternatives. This is a very powerful tool because, even if the reader is not an expert in the original language, the quality of the machine translation is, most of the time, good enough that the understanding of the translated text is enough to elicit relevant feedback.

As a simple example, assume a text translated into English comes out as "I are very happy today." A fluent English speaker will easily be able to propose an appropriate solution with "I am very happy today."

Once the alternative translation has been submitted, the content administrators can decide whether to approve it and replace the original text with the human-improved text. If your translation automation also uses the Microsoft Translator Hub, you can very easily import the corrected translations into the Hub and use them in custom engine training.

## Next Steps
> [!div class="nextstepaction"]
> [Set up a customized language system using the Microsoft Translator Hub](https://hub.microsofttranslator.com)

> [!div class="nextstepaction"]
> [Lean how to integrate the CTF into your application](https://github.com/MicrosoftTranslator/Documentation-Code-TextAPI/blob/master/ctf/collaborative-translation-framework-reporting-api.md)
