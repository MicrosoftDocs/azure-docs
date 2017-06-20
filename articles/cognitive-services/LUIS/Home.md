---
title: Overview of LUIS machine learning | Microsoft Docs
description: Use Language Understanding Intelligent Services (LUIS) to bring the power of machine learning to your applications.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Overview
## Language Understanding Intelligent Services (LUIS) brings the power of machine learning to your apps

One of the key problems in human-computer interactions is the ability of the computer to understand what a person wants. LUIS is designed to enable developers to build smart applications that can understand human language and accordingly react to user requests. With LUIS, a developer can quickly deploy an HTTP endpoint that will take the sentences sent to it and interpret them in terms of their intents (the intentions they convey) and entities (key information relevant to the intent). 

By using LUIS web interface, you can create an application, with a set of intents and entities that are relevant to your application’s domain. For example, in a travel agent app, a user might say an utterance like "Book me a ticket to Paris". In this utterance, there is the intention to "BookFlight" and "Paris" is the entity. Intention or the intent can be defined as the desired action and usually contains a verb, in this case "book". The entity is a relevant information of a specific data type, in this case "Paris" is the location entity. 

Once your application is deployed and traffic starts to flow into the system, LUIS uses active learning to improve itself. In the active learning process, LUIS identifies the utterances that it is relatively unsure of, and asks you to label them according to intent and entities. This has tremendous advantages; LUIS knows what it is unsure of, and asks for your help in the cases which will lead to the maximum improvement in system performance. LUIS learns quicker, and takes the minimum amount of your time and effort. This is active machine learning at its best.

## Supported Languages
LUIS suppors several languages as English, French, Italian, German, Spanish, Brazilian Portuguese, Japanese, Korean and Chinese are supported when it comes to understanding utterances. You choose the culture when you start creating your application, and it cannot be modified once the application is created.
### Chinese support notes

 - In the zh-cn culture, LUIS expects the simplified Chinese character set (not the traditional character set).
 - The names of intents, entities, features, and regular expressions may be in Chinese or Roman characters.
 - When writing regular expressions in Chinese, do not insert whitespace between Chinese characters.

### Rare or foreign words in an application
In the en-us culture, LUIS can learn to distinguish most English words, including slang. In the zh-cn culture, LUIS can learn to distinguish most Chinese characters. If you use a rare word (en-us) or character (zh-cn), and you see that LUIS seems unable to distinguish that word or character, you can add that word or character to a phrase-list feature. For example, Words outside of the culture of the application -- i.e., foreign words -- should be added to a phrase-list feature.

### Tokenization
In normal LUIS use, you won't need to worry about tokenization, but one place where tokenization is important is when manually adding labels to an exported application's JSON file. See the section on importing and exporting an application for details.

To perform machine learning, LUIS breaks an utterance into "tokens". A "token" is the smallest unit that can be labeled in an entity.

How tokenization is done depends on the application's culture:

 * **English, French, Italian, Brazilian Portuguese and Spanish:** token breaks are inserted at
   any whitespace, and around any punctuation.
 * **Korean & Chinese:** token breaks are inserted before and after any
   character, and at any whitespace, and around any punctuation.

## Accessing LUIS programmatically
LUIS offers a set of programmatic REST APIs that can be used by developers to automate the application creation process. These APIs allow you to author and publish your application.

[Click here for a complete API reference](https://dev.projectoxford.ai/docs/services/56d95961e597ed0f04b76e58/operations/5739a8c71984550500affdfa).

## Speech Integration
Your LUIS endpoints work seamlessly with [Microsoft Cognitive Service's speech recognition service](https://www.microsoft.com/cognitive-services/en-us/speech-api). In the C# SDK for Microsoft Cognitive Services Speech API, you can simply add the LUIS application ID and LUIS subscription key, and the speech recognition result will be sent for interpretation. 

See [Microsoft Cognitive Services Speech API Overview](../Speech/Home.md).
