---
title: Overview of Microsoft Translator API in Cognitive Services | Microsoft Docs
description: Integrate the Microsoft Translator Text API into your applications, websites, tools, and other solutions to provide multi-language user experiences.
services: cognitive-services
author: chriswendt1
manager: arulm

ms.service: cognitive-services
ms.technology: translator
ms.topic: article
ms.date: 11/21/2016
ms.author: christw
---

# Microsoft Translator Text API
Microsoft Translator Text API can be seamlessly integrated into your applications, websites, tools, or other solutions to provide multi-language user experiences in 60+ languages. Leveraging industry standards, it can be used on any hardware platform and with any operating system to perform text to text language translation.

Microsoft Translator Text API is part of the Microsoft [Cognitive Services API](https://docs.microsoft.com/en-us/azure/cognitive-services/) collection of machine learning and AI algorithms in the cloud, readily consumable in your development projects.

## About Microsoft Translator
Microsoft Translator is a cloud based machine translation service. At the core of this service are the Translator Text API and [Translator Speech API](https://www.microsoft.com/en-us/translator/speech.aspx) which power various Microsoft products and services and are used by thousands of businesses worldwide in their applications and workflows enable their content to reach a worldwide audience.

Learn more about the [Microsoft Translator service](https://www.microsoft.com/en-us/translator/home.aspx)


## Language customization and translation improvement
Two extensions of the core Microsoft Translator service, the Microsoft Translator Hub and the Collaborative Translations Framework, can be used in conjunction with the Translator Text API to help you customize and improve your translated text.

**Microsoft Translator Hub**&mdash; With the Microsoft Translator Hub, you can build translation systems that understand the terminology used in your own business and industry. Your customized translation system will then easily integrate into your existing applications, workflows and websites, across multiple types of devices, through the regular Microsoft Translator Text API, by using the category parameter. The Hub only support customization of traditional statistical translation systems, not the new neural ones. 

**Collaborative Translations Framework (CTF)**&mdash; The Microsoft Translator API offers the unique ability to improve the accuracy of the delivered translations through the use of the Collaborative Translations Framework, allowing users to recommend alternative translations to those provided by Translator’s automatic translation engine. 

Learn more about [language customization and translation improvement](customization.md)

## Microsoft Translator Neural Machine Translation (NMT)
Since it began, Microsoft Translator API has used industry standard statistical machine translation (SMT) technology to provide translations. The technology has reached a plateau in terms of performance improvement. Translation quality is no longer improving in any significant way for generic systems with SMT.
A new AI-based translation technology is gaining momentum based on Neural Networks (NN).

NMT provides better translations not only from a raw translation quality scoring standpoint but also because they will sound more fluent, more human, than SMT ones. 
The key reason for this fluidity is that NMT uses the full context of a sentence to translate words contrary to SMT that only takes the context of a few words before and after each word.

NMT models are at the core of the API and are not visible to end users. 
The only noticeable differences are
-	The improved translation quality, especially for languages such as Chinese, Japanese, and Arabic. View suported languages on [Microsoft.com](https://www.microsoft.com/en-us/translator/languages.aspx). 
-	The incompatibility with the existing Hub and CTF customization features

Learn more about [how NMT works](https://www.microsoft.com/en-us/translator/mt.aspx#nnt)

## Next steps

> [!div class="nextstepaction"]
> [Sign up](translator-text-how-to-signup.md)

> [!div class="nextstepaction"]
> [Start coding](quickstarts/csharp.md)

## See also
- [Cognitive Services Documentation page](https://docs.microsoft.com/en-us/azure/#pivot=products&panel=cognitive)
- [Cognitive Services Product page](https://azure.microsoft.com/en-us/services/cognitive-services/)
- [Solution and pricing information](https://www.microsoft.com/en-us/translator/default.aspx).

