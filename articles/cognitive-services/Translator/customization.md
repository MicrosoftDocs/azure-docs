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

# Customize your text translations

The Translator Hub is a free extension of the Microsoft Translator service which allows you to customize and improve the text translations you receive from the Translator Text API. It is fully integrated into the Translator Text API. 

## Customize translations with the Microsoft Translator Hub

With the Hub, you can build translation systems customized on existing statistical machine translation systems to understand the terminology used in your own business and industry. The Hub will combine your domain specific data with Microsoft's vast language knowledge to generate a custom and unique translation system. 

Your customized translation system will then easily integrate into your existing applications, workflows and websites, across multiple types of devices.

### How does it work?
The Hub allows for varying levels of customization. You can start by adding just a few words in a dictionary, such as product names, etc. which would then be translated exactly the way you want. 

As your needs grow, you can use parallel sentences to build a translation system that reflects your domain-specific terminology and style better than a generic translation system. Use your previously translated documents (leaflets, webpages, documentation, etc.) in TMX, XLIFF, TXT, HTML, DOCX, XLSX and PDF document formats. 

The customized system is then available by through a regular call to the Microsoft Translator Text API using the category parameter.

More details about the various levels of customization, based on available data, can be found on the [Microsoft Translator Blog](https://blogs.msdn.microsoft.com/translation/2016/01/27/new-microsoft-translator-customization-features-help-unleash-the-power-of-artificial-intelligence-for-everyone/).

## Collaborative Translations Framework

> [!NOTE]
> As of January 1, 2018 AddTranslation() will do nothing, it will silently fail. The API response will still be success (200), but nothing will be written.
Microsoft will replace the functionality with an extended version of the Translator Hub API, which produces a custom system with your terminology, and you can invoke it using the Category ID of your custom Hub system. See [https://hub.microsofttranslator.com](https://hub.microsofttranslator.com). 

The Collaborative Translations Framework (CTF) is an extension of the core Microsoft Translator Text API that enables postpublishing improvement of translated text. [View documentation for the CTF on GitHub](https://github.com/MicrosoftTranslator/Documentation-Code-TextAPI/blob/master/ctf/collaborative-translation-framework-reporting-api.md) 

## Next Steps
> [!div class="nextstepaction"]
> [Set up a customized language system using the Microsoft Translator Hub](https://hub.microsofttranslator.com)
