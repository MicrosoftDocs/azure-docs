---
title: Overview of LUIS machine learning in Azure | Microsoft Docs 
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

One of the key problems in human-computer interactions is the ability of the computer to understand what a person wants. Language Understanding Intelligent Services (LUIS) enables developers to build smart applications that can understand human language and react accordingly to user requests. LUIS uses the power of machine learning to solve the difficult problem of extracting meaning from natural language input, so that your application doesn't have to. Any client application that converses with users, like a dialog system or a chat bot, can pass user input to a LUIS app and receive results that provide natural language understanding. 

## What is a LUIS app?

A LUIS app is a place for a developer to define a custom language model. The output of a LUIS application is a web service with an HTTP endpoint that you reference from your client application to add natural language understanding to it. A LUIS app takes a user utterance and extracts intents and entities that correspond to activities in the client application’s logic. Your client app can then take appropriate action based on the user intentions that LUIS recognizes.

## Key concepts

* **What is an utterance?** An utterance is the textual input from the user, that your app needs to interpret. It may be a sentence, like "Book me a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight." Utterances aren't always well-formed, and there can be many utterance variations for a particular intent. See [Add example utterances][add-example-utterances] for information on training a LUIS app to understand user utterances.
* **What are intents?** Intents are like verbs. An intent represents actions the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. You define a set of named intents that correspond to actions users want to take in your application. A travel app may define an intent named "BookFlight", that LUIS extracts from the utterance "Book me a ticket to Paris".
* **What are entities?** If intents are verbs, then entities are nouns. An entity represents an instance of a class of object that is relevant to a user’s purpose. In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent. LUIS also provides [pre-built entities][pre-built-entities] that you can use in your app.

## How do you plan a LUIS app?
All LUIS applications are centered around a domain-specific topic, for example booking of tickets, flights, hotels, rental cars etc. or content related to exercising, tracking fitness efforts and setting goals. Before you start creating it in LUIS web interface, plan your LUIS app by preparing an outline (schema) of the possible intents and entities that are relevant to the domain-specific topic of your application.
Let's take the example of a virtual travel booking agency application. In this travel booking application, users would like to book a flight and check the weather at their travel destination. Some of the the relevant intents would be "BookFlight" and "GetWeather". To book a flight, some relevant information is needed such as the location, date, airline, tickets category and travel class. These can be added as entities. Once you have a planned outline of intents and entities, you can start creating your application in LUIS and add these intents and entities to the LUIS app.

## Get started creating a LUIS app
Once you've planned your app so that you know which intents and entities it will recognize, you can [create a new LUIS app](LUIS-get-started-create-app.md), that you can monitor using the [Dashboard](App-Dashboard.md).
Once you've created it, the following articles provide more detail about the main steps in configuring your LUIS app:
1.	[Add intents](Add-intents.md)
2.	[Add entities](Add-entities.md)
3.	[Train and test](Train-Test.md)
4.	[Publish](PublishApp.md)

You can also watch a basic [video tutorial](https://www.youtube.com/watch?v=jWeLajon9M8&index=4&list=PLD7HFcN7LXRdHkFBFu4stPPeWJcQ0VFLx) on these steps.

## How do you use active learning to improve performance?
Once your application is deployed and traffic starts to flow into the system, LUIS uses active learning to improve itself. In the active learning process, LUIS identifies the utterances that it is relatively unsure of, and asks you to label them according to intent and entities. This process has tremendous advantages. LUIS knows what it is unsure of, and asks for your help in the cases that lead to the maximum improvement in system performance. LUIS learns quicker, and takes the minimum amount of your time and effort. This is active machine learning at its best. See [Label suggested utterances][label-suggested-utterances] for an explanation of how to implement active learning using the LUIS web interface.

## How do you use LUIS from a bot?
It's easy to use a LUIS app from a bot built using the [Bot Framework](https://docs.microsoft.com/bot-framework/), which provides the Bot Builder SDK for Node.js or .NET. You simply reference the LUIS app as shown in the following examples.
```javascript
// Add global LUIS recognizer to bot
var model = process.env.model || 'https://api.projectoxford.ai/luis/v2.0/apps/c413b2ef-382c-45bd-8ff0-f76d60e2a821?subscription-key=6d0966209c6e4f6b835ce34492f3e6d9';
bot.recognizer(new builder.LuisRecognizer(model));
```

```cs
    [LuisModel("<YOUR_LUIS_APP_ID>", "<YOUR_LUIS_SUBSCRIPTION_KEY>")]
    [Serializable]
    public class TravelGuidDialog : LuisDialog<object>
    {
      // ...
```

The Bot Builder SDK provides classes that automatically handle the intents and entities returned from the LUIS app. For samples that demonstrate how to use these classes, see the following samples:
•	[LUIS demo bot (C#)](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-LUIS)
•	[LUIS demo bot (Node.js)](https://github.com/Microsoft/BotBuilder-Samples/tree/master/Node/intelligence-LUIS) 

## Configure LUIS programmatically
LUIS offers a set of programmatic REST APIs that can be used by developers to automate the application creation process. These APIs allow you to author and publish your application.

[LUIS Programmatic API](https://dev.projectoxford.ai/docs/services/56d95961e597ed0f04b76e58/operations/5739a8c71984550500affdfa).

## Speech Integration
Your LUIS endpoints work seamlessly with [Microsoft Cognitive Service's speech recognition service](https://www.microsoft.com/cognitive-services/speech-api). In the C# SDK for Microsoft Cognitive Services Speech API, you can add the LUIS application ID and LUIS subscription key, and the speech recognition result is sent for interpretation. 

See [Microsoft Cognitive Services Speech API Overview](../Speech/Home.md).

<!-- Reference-style links -->
[add-example-utterances]: https://docs.microsoft.com/azure/cognitive-services/luis/add-example-utterances
[pre-built-entities]: https://docs.microsoft.com/azure/cognitive-services/luis/pre-builtentities
[label-suggested-utterances]: label-suggested-utterances.md
