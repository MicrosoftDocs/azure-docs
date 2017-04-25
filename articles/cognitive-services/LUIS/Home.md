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

One of the key problems in human-computer interactions is the ability of the computer to understand what a person wants. Language Understanding Intelligent Services (LUIS) enables developers to build smart applications that can understand human language and react accordingly to user requests. LUIS uses the power of machine learning to solve the difficult problem of extracting meaning from natural language input, so that your application doesn't have to. Any application that converses with users, like a spoken dialog system or a chat bot, can pass user input to a LUIS app and receive results about the user intent and the entities relevant to their purpose. 

## What is a LUIS app?

A LUIS app is a place for a developer to define a custom language model. The output of a LUIS application is a web service with an HTTP endpoint that you reference from your client application to add natural language understanding to it. A LUIS app takes a user utterance and extracts intents and entities that are relevant to your client application’s domain. Your client app can then take appropriate action based on the user intentions that LUIS recognizes.

## Key concepts

* **What is an utterance?** An utterance is the textual or spoken input from the user, that your app needs to interpret. It may be a sentence, like "Book me a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight." Utterances aren't always well-formed, and there can be many utterance variations for a particular intent. See [Add example utterances][add-example-utterances] for information on training a LUIS app to understand user utterances.
* **What are intents?** Intents are like verbs. An intent represents actions the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. You define a set of named intents that correspond to actions users want to take in your application. A travel app may define an intent named "BookFlight", that LUIS extracts from the utterance "Book me a ticket to Paris".
* **What are entities?** If intents are verbs, then entities are nouns. An entity represents an instance of a class of object that is relevant to a user’s purpose. In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent. LUIS also provides [pre-built entities][pre-built-entities] that you can use in your app.

## How do you use active learning to improve performance?
Once your application is deployed and traffic starts to flow into the system, LUIS uses active learning to improve itself. In the active learning process, LUIS identifies the utterances that it is relatively unsure of, and asks you to label them according to intent and entities. This process has tremendous advantages. LUIS knows what it is unsure of, and asks for your help in the cases that lead to the maximum improvement in system performance. LUIS learns quicker, and takes the minimum amount of your time and effort. This is active machine learning at its best. See [Label suggested utterances][label-suggested-utterances] for an explanation of how to implement active learning using the LUIS web interface.

## Supported Languages
LUIS understands utterances in English, French, Italian, German, Spanish, Brazilian Portuguese, Japanese, Korean, and Chinese. You choose the culture when you start creating your application, and it cannot be modified once the application is created.

### Chinese support notes

 - In the zh-cn culture, LUIS expects the simplified Chinese character set (not the traditional character set).
 - The names of intents, entities, features, and regular expressions may be in Chinese or Roman characters.
 - When writing regular expressions in Chinese, do not insert whitespace between Chinese characters.

### Rare or foreign words in an application
In the en-us culture, LUIS can learn to distinguish most English words, including slang. In the zh-cn culture, LUIS can learn to distinguish most Chinese characters. If you use a rare word (en-us) or character (zh-cn), and you see that LUIS seems unable to distinguish that word or character, you can add that word or character to a phrase-list feature. For example, words outside of the culture of the application -- that is, foreign words -- should be added to a phrase-list feature.

### Tokenization
In normal LUIS use, you don't need to worry about tokenization, but one place where tokenization is important is when manually adding labels to an exported application's JSON file. See the section on importing and exporting an application for details.

To perform machine learning, LUIS breaks an utterance into tokens. A token is the smallest unit that can be labeled in an entity.

How tokenization is done depends on the application's culture:

 * **English, French, Italian, Brazilian Portuguese, and Spanish:** token breaks are inserted at
   any whitespace, and around any punctuation.
 * **Korean & Chinese:** token breaks are inserted before and after any
   character, and at any whitespace, and around any punctuation.

## Accessing LUIS programmatically
LUIS offers a set of programmatic REST APIs that can be used by developers to automate the application creation process. These APIs allow you to author and publish your application.

[LUIS Programmmatic API](https://dev.projectoxford.ai/docs/services/56d95961e597ed0f04b76e58/operations/5739a8c71984550500affdfa).

## Speech Integration
Your LUIS endpoints work seamlessly with [Microsoft Cognitive Service's speech recognition service](https://www.microsoft.com/cognitive-services/en-us/speech-api). In the C# SDK for Microsoft Cognitive Services Speech API, you can add the LUIS application ID and LUIS subscription key, and the speech recognition result is sent for interpretation. 

See [Microsoft Cognitive Services Speech API Overview](../Speech/Home.md).

<!-- Reference-style links -->
[add-example-utterances]: https://review.docs.microsoft.com/en-us/azure/cognitive-services/luis/add-example-utterances
[pre-built-entities]: https://review.docs.microsoft.com/en-us/azure/cognitive-services/luis/pre-builtentities
[label-suggested-utterances]: https://review.docs.microsoft.com/en-us/azure/cognitive-services/luis/label-suggested-utterances
