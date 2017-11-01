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

The Translator Hub and Collaborative Translations Framework are free extensions of the Microsoft Translator service which allow you to customize and improve text translations you recieve from the Translator Text API. They are both fully integrated into the Translator Text API. 

## Customize translations with the Microsoft Translator Hub

With the Hub, you can build translation systems that understand the terminology used in your own business and industry. Your customized translation system will then easily integrate into your existing applications, workflows and websites, across multiple types of devices, through the regular Microsoft Translator Text API, by using the category parameter.

Customization with the Hub or the Hub API is both easy and adaptable. When using the Hub, users can start from a simple customization level starting with a few words (such as product names, etc.) in a dictionary, then use as little as one thousand parallel sentences to start customizing the actual translations. More details about the various levels of customization, based on available data, can be found on the [Microsoft Translator Blog](https://blogs.msdn.microsoft.com/translation/2016/01/27/new-microsoft-translator-customization-features-help-unleash-the-power-of-artificial-intelligence-for-everyone/).

### Advantages of the Hub

**Get Better Translations**

Use your previously translated documents (leaflets, webpages, documentation, etc.) to build a translation system that reflects your domain-specific terminology and style, better than a generic translation system. Hub supports TMX, XLIFF, TXT, HTML, DOCX, XLSX and PDF document formats. The Hub will combine your domain specific data with Microsoft's vast language knowledge to generate translation systems combining the best of both our large scale training data and your industry specific one. Given the appropriate type and amount of training data it is not uncommon to expect gains between 5 and 10, even 15 in some instances, BLEU points on translation quality by using the Hub, to customize your translations.

**Securely translate anytime, anywhere on all your apps and services**

Translation systems built with Hub are available through a cloud-based, high performance, highly scalable translation service that powers billions of translations every day. Your system can be accessed and integrated into any product or business workflow, and on any device, via the Microsoft Translator API, which is available leveraging industry REST technology.

**Build translation systems for native and endangered languages**

Governments, universities and language preservation communities can use the Hub to build translation systems between any pair of languages, including languages not yet supported by Microsoft Translator, to reduce communication barriers. With communication gaps removed, communities are empowered and business can serve their people. A new language can be easily kick-started and improved over time with the support of an involved community, that regularly contributing to enriching the translation system.

### Get started with the Translator Hub

The following user guides give instructions for setting up a customized language system using the Translator Hub and the Translator Hub API. 

[Hub User guide](https://hub.microsofttranslator.com/Help/Download/Microsoft%20Translator%20Hub%20User%20Guide.pdf)

[Hub API User Guide](https://hub.microsofttranslator.com/Help/Download/Microsoft%20Translator%20Hub%20API%20Guide.pdf)

## Improve translated content with the Collaborative Translations Framework

The Collaborative Translations Framework (CTF) is an extension of the core Microsoft Translator Text API that enables postpublishing improvement of translated text. There are no additional costs associated with the use of the CTF.

Once machine translated text has been published on your site or in your application, you can use reader feedback to improve its quality, to the benefit of all readers.

### How does it work?
The CTF API enables a mechanism by which a reader can provide alternative translations to those already published. A reader can also vote on previously offered alternatives. This is a very powerful tool because, even if the reader is not an expert in the original language, the quality of the machine translation is, most of the time, good enough that the understanding of the translated text is enough to elicit relevant feedback.

As a simple exampl, assume a text translated into English comes out as "I are very happy today." A fluent English speaker will easily be able to propose an appropriate solution with "I am very happy today."

Once the alternative translation has been submitted, the content administrators can decide whether to approve it and replace the original text with the human-improved text. If your translation automation also uses the Microsoft Translator Hub, you can very easily import the corrected translations into the Hub and use them in custom engine training.

### What are the options for gathering this postpublishing feedback?

**Internal community**

Use your organization's internal teams and native language speakers to review translated content and provide alternate translations.

**External community**
Use your external community of partners, users, and readers to review the machine translations. You can grant permission to this open or closed community to suggest alternate translations and even vote on translations that better fit the context of the text.

**Language service providers**
Use language experts to provide postpublishing edits to your content, saving you time and reducing the costs of end-to-end translation. See the Microsoft Translator Partner page for a list of language service providers who are API, Hub, and CTF experts.

### How to integrate the CTF?
To lean how to integrate the CTF into your application please refer to [The CTF Sample Code](collaborative-translation-framework-reporting-api.md)
