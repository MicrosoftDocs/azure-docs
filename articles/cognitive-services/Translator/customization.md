---
title: Microsoft Translator Text API Translation Customization | Microsoft Docs
description: Use the Microsoft Translator Hub to build your own machine translation system using your preferred terminology and style.
services: cognitive-services
author: Jann-Skotdal
manager: chriswendt1

ms.service: cognitive-services
ms.technology: translator
ms.topic: article
ms.date: 11/01/2017
ms.author: v-jansko
---

# Customize your text translations

The Translator Hub is a free extension of the Microsoft Translator service, which allows you to customize and improve the translations you receive from the Translator Text API. It is fully integrated into the Translator Text API. 

## Customize translations with the Microsoft Translator Hub

With the Hub, you can build translation systems customized to the terminology and style of a business or industry. The Hub combines your domain-specific data with Microsoft's vast language knowledge to generate a custom translation system. 

Your customized translation system easily integrates into your existing applications, workflows, and websites, across multiple types of devices.

### How does it work?
The Hub allows for varying levels of customization. You can start by adding just a few words in a dictionary, such as product names, etc., which would then be translated exactly the way you want. 

As your needs grow, you can use parallel sentences to build a translation system that reflects your domain-specific terminology and style better than a generic translation system. Use your previously translated documents (leaflets, webpages, documentation, etc.) or an export of your translation memory in TMX, XLIFF, TXT, HTML, DOCX, XLSX, and PDF document formats. 

The customized system is then available through a regular call to the Microsoft Translator Text API using the category parameter.

More details about the various levels of customization, based on available data, can be found on the [Microsoft Translator Blog](https://blogs.msdn.microsoft.com/translation/2016/01/27/new-microsoft-translator-customization-features-help-unleash-the-power-of-artificial-intelligence-for-everyone/).

## Collaborative Translations Framework

> [!NOTE]
> As of February 1, 2018, AddTranslation() and AddTranslationArray() will fail and nothing will be written.
Similar functionality is available in the Translator Hub API. See [https://hub.microsofttranslator.com/swagger](https://hub.microsofttranslator.com/swagger). 

## Next steps
> [!div class="nextstepaction"]
> [Set up a customized language system using the Microsoft Translator Hub](https://hub.microsofttranslator.com)
