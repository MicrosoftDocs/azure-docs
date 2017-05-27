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

# Microsoft Translator API
Microsoft Translator APIs can be seamlessly integrated into your applications, websites, tools, or other solutions to provide multi-language user experiences. Leveraging industry standards, it can be used on any hardware platform and with any operating system to perform language translation and other language-related operations such as speech to speech translation, text language detection or text to speech.

## Microsoft Translator Deep Neural Network translation
Microsoft Translator API has been using Statistical Machine Translation (SMT) technology since it started. The technology has reached a plateau in terms of performance improvement. Translation quality is no longer improving with SMT.
A new AI-based translation technology is gaining momentum based on Deep Neural Networks (DNN).

DNN enabled translations will first appear for users of the Microsoft Translator Speech API, and will spread from there to eventually include all languages and APIs.

## Technology
DNN models are at the core of the API and are not visible to end users. 
The only noticeable differences will be:
-	The improved translation quality, especially for languages such as Chinese and Japanese. 
-	The incompatibility with the existing Hub and CTF customization features

## High-level product architecture

[How DNN works](http://translator.microsoft.com)

DNN will provide better translations not only from a raw translation quality scoring standpoint but also because they will sound more fluid, more human, than SMT ones. 
The key reason for this fluidity is that DNN translation uses the full context of a sentence to translate words contrary to SMT that only takes the context of a few words before and after each word.
Use cases
Although DNN translation can be used for all types of translations the improvements are particularly impressive for languages where translation quality has previously lagged. For instance, Japanese, Chinese and Arabic.


The Microsoft Translator Hub service and API lets you customize translations for words and sentences that are specific to a particular domain of knowledge.

The Microsoft Translator API also offers the unique ability to improve the accuracy of the delivered translations through the use of the Collaborative Translations Framework (CTF), allowing users to recommend alternative translations to those provided by Translator’s automatic translation engine.

To get started, you will first need to [sign up for a subscription](https://www.microsoft.com/en-us/translator/getstarted.aspx) to the text or speech API. Free tiers are available for 2 million characters per month for the text API and 2 hours per month for the speech API.

[Solution and pricing information](https://www.microsoft.com/en-us/translator/default.aspx).

