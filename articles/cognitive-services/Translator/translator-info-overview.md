---
title: Overview of Microsoft Translator API in Cognitive Services | Microsoft Docs
description: Integrate Microsoft Translator APIs into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: chriswendt1
manager: arulm

ms.service: cognitive-services
ms.technology: translator
ms.topic: article
ms.date: 11/21/2016
ms.author: christw
---

**Microsoft Translator Text API** can be seamlessly integrated into your applications, websites, tools, or other solutions to provide multi-language user experiences in 60+ languages. Leveraging industry standards, it can be used on any hardware platform and with any operating system to perform text to text language translation.

Microsoft Translator Text API is part of the Microsoft [Cognitive Services API](https://docs.microsoft.com/en-us/azure/cognitive-services/) collection of machine learning and AI algorithms in the cloud, readily consumable in your development projects.

## Customization
The Microsoft Translator Text API can be used in conjunction with the Microsoft Translator Hub to provide pre- and post-publishing cusomization of your translated text.

**Microsoft Translator Hub**

The Microsoft Translator Hub service and API lets you customize translations for words and sentences that are specific to a particular domain of knowledge. [Learn more](translator-hub-overview.md)

**Collaborative Translations Framework (CTF)**

The Microsoft Translator API also offers the unique ability to improve the accuracy of the delivered translations through the use of the Collaborative Translations Framework (CTF), allowing users to recommend alternative translations to those provided by Translator’s automatic translation engine. [Learn more](collaborative-translation-framework-reporting-api.md)

## Microsoft Translator Deep Neural Network translation
Since it began, Microsoft Translator API has used Statistical Machine Translation (SMT) technology to provide translations. The technology has reached a plateau in terms of performance improvement. Translation quality is no longer improving with SMT.
A new AI-based translation technology is gaining momentum based on Deep Neural Networks (DNN).

DNN provides better translations not only from a raw translation quality scoring standpoint but also because they will sound more fluid, more human, than SMT ones. 
The key reason for this fluidity is that DNN translation uses the full context of a sentence to translate words contrary to SMT that only takes the context of a few words before and after each word.

DNN models are at the core of the API and are not visible to end users. 
The only noticeable differences are
-	The improved translation quality, especially for languages such as Chinese, Japanese, and Arabic. View suported languages on [Microsoft.com](https://www.microsoft.com/en-us/translator/languages.aspx. 
-	The incompatibility with the existing Hub and CTF customization features

Learn more about [how DNN works](https://www.microsoft.com/en-us/translator/mt.aspx#nnt) .

## Next steps
- [Sign up](/translator-text-how-to-signup.md) for an access key. A Free tier for 2 million characters per month is available, or [view pricing options for paid tiers](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/translator-text-api/)
- Start coding&mdash; view Quickstarts and Tutorials to get started. [Microsoft Translator on Github](https://github.com/MicrosoftTranslator) provides sample apps with open source code. Further documentation can be found in References. 
- Resources provides subscription [FAQ](https://www.microsoft.com/en-us/translator/faq.aspx) as well as links to our [technical](https://stackoverflow.com/questions/tagged/microsoft-translator) and [user](https://cognitive.uservoice.com/knowledgebase/topics/132647-translator) forums

## See also
- [Cognitive Services Documentation page](https://docs.microsoft.com/en-us/azure/#pivot=products&panel=cognitive)
- [Cognitive Services Product page](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [Solution and pricing information](https://www.microsoft.com/en-us/translator/default.aspx).

