---
title: Learn about Language Understanding Intelligent Service (LUIS) in Azure | Microsoft Docs 
description: Learn how to use Language Understanding Intelligent Service (LUIS) to bring the power of machine learning to your applications.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Learn about Language Understanding Intelligent Service (LUIS)

One of the key problems in human-computer interactions is the ability of the computer to understand what a person wants. Language Understanding Intelligent Service (LUIS) enables developers to build smart applications that can understand human language and react accordingly to user requests. LUIS uses the power of machine learning to solve the difficult problem of extracting meaning from natural language input, so that your application doesn't have to. A client application that converses with users, such a chat bot, can pass user input to a LUIS app and receive results that provide natural language understanding.

## What is a LUIS app?

A LUIS app is a place for a developer to define a custom language model. The output of a LUIS app is a web service with an HTTP endpoint that you reference from your client application to add natural language understanding to it. A LUIS app takes a user utterance and extracts intents and entities that correspond to activities in the client application’s logic. Your client application can then take appropriate action based on the user intentions that LUIS recognizes.

![LUIS recognizes user intent](./media/luis-overview/luis-overview-process.png)

## Key LUIS concepts

* **Utterances** An utterance is the textual input from the user, that your app needs to interpret. It may be a sentence, like "Book me a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight." Utterances aren't always well-formed, and there can be many utterance variations for a particular intent. See [Add example utterances][add-example-utterances] for information on training a LUIS app to understand user utterances.
* **Intents** Intents are like verbs in a sentence. An intent represents actions the user wants to perform. The intent is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. You define and name intents that correspond to these actions. A travel app may define an intent named "BookFlight", that LUIS extracts from the utterance "Book me a ticket to Paris".
* **Entities** If intents are verbs, then entities are nouns. An entity represents an instance of a class of object that is relevant to a user’s intent. In the utterance "Book me a ticket to Paris", "Paris" is an entity of type location. By recognizing the entities that are mentioned in the user’s input, LUIS helps you choose the specific actions to take to fulfill an intent. See [Entities in LUIS](luis-concept-entity-types.md) for more detail on the types of entities that LUIS provides.

|Utterance|Intent|Entities|
|-----------|-----------|-----------|
|"Book a flight to __Seattle__?"|BookFlight|Seattle=Destination|
|"When does your store __open__?"|StoreHoursAndLocation|open=Time|
|"Schedule a meeting at __1pm__ with __Bob__ in Distribution"|ScheduleMeeting|1pm=Time, Bob=Person|

## Key Development concepts

LUIS has two sets of APIs. The authoring APIs allow you and your collaborators to create, edit, train, and publish your model. The endpoint APIs allow you and your users to pass short utterance phrases (500 characters maximum) to LUIS. LUIS processes the utterance phrase and responds with identified intents and entities.

* **Authoring APIs and LUIS.ai** Both the authoring APIs and LUIS.ai give you control of your LUIS app model definition and management. This control includes management of: models, versions, collaborators, external APIs, Azure subscription keys, testing, and training.

* **Endpoint APIs** The endpoint APIs allow users to pass a query of a short utterance phrase to LUIS. The query can either be in the HTTP GET query string or in an HTTP POST body. LUIS identifies the intents and entities within that query. When you publish your LUIS app, the endpoint URL is created. You can open that link in a browser window and immediately enter an utterance query to interact with your LUIS model.

> [!NOTE]
> * The Authoring APIs and LUIS.ai use the programmatic key found in your [LUIS.ai][luis.ai] account page.
> * The Endpoint APIs use the LUIS subscription key found in the [Azure portal][azure-portal].

## Plan your LUIS app
Before you create your LUIS app, plan your LUIS app with some sample user utterances.

Then you need to determine the intent of the utterance, and the entities within the intent. Generally, an **intent** is used to trigger an action in a client application or bot and an **entity** is used to model some parameters required to execute an action.

For example, a "BookFlight" intent could trigger an API call to an external service for booking a plane ticket, which requires entities like the travel destination, date, and airline. See [Plan your app](Plan-your-app.md) for examples and guidance on how to choose intents and entities to reflect the functions and relationships in an app.

## Entity Planning
[Entity][luis-concept-entity-types] planning is important because the entity determines how successfully the end user gets the correct answer.

Entity identification is easy in the beginning but can grow more complex as you want to identify more information in utterances or allow for differences in culture or style of utterance phrases.

* **Prebuilt Entities** LUIS has many prebuilt domains with prebuilt entities. You can use the entity without having to use the entire domain. The prebuilt entities allow you to quickly identify and label utterances.

* **Custom Entities** LUIS gives you several ways to identify your own custom entities including simple, flat, and hierarchical lists.

* **Regular Expressions and Phrase Features** LUIS also allows for [features](luis-concept-feature.md) such as regular expression patterns and phrase lists, which also help identify entities.

## Build and train your LUIS app
Once you determine which intents and entities you want to recognize, you can start adding them to your LUIS app. See [create a new LUIS app](LUIS-get-started-create-app.md), for a quick walkthrough of creating a LUIS app.<!-- that you can monitor using the [Dashboard](App-Dashboard.md)-->
For more detail about the steps in configuring your LUIS app, see the following articles:
1.	[Add intents](Add-intents.md)
2.  [Add utterances](Add-example-utterances.md)
3.	[Add entities](Add-entities.md)
4.  [Improve performance using features](Add-Features.md)
5.	[Train and test](Train-Test.md)
6.  [Use active learning](label-suggested-utterances.md)
7.	[Publish](PublishApp.md)

You can also watch a short [video tutorial][intro-video] on these steps.

## Improve performance using active learning
Once your application is published and utterances starts to flow into the system, LUIS uses active learning to improve identification. In the active learning process, LUIS identifies the utterances that it is relatively unsure of. You can label them according to intent and entities, retrain, and republish.

This reiterative process has tremendous advantages. LUIS knows what it is unsure of, and your help leads to the maximum improvement in system performance. LUIS learns quicker, and takes the minimum amount of your time and effort. LUIS is an active machine learning at its best. See [Label suggested utterances][label-suggested-utterances] for an explanation of how to implement active learning using the LUIS web site.

## Next steps

[Create][create-app] and publish your first LUIS app in [LUIS.ai][luis.ai].

Call your new [LUIS app endpoint][publish-app].

<!-- Reference-style links -->
[create-app]:luis-get-started-create-app.md
[luis.ai]:https://www.luis.ai/
[eu.LUIS.ai]:https://eu.LUIS.ai/
[azure-portal]:https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account
[publish-app]:PublishApp.md#test-your-published-endpoint-in-a-browser
[add-example-utterances]: https://docs.microsoft.com/azure/cognitive-services/luis/add-example-utterances
[pre-built-entities]: https://docs.microsoft.com/azure/cognitive-services/luis/pre-builtentities
[label-suggested-utterances]: label-suggested-utterances.md
[intro-video]:https://aka.ms/LUIS-Intro-Video
[luis-concept-entity-types]:luis-concept-entity-types.md
<!-- this link not working 5/8 -->
[cs-speech-service]: https://www.microsoft.com/cognitive-services/speech-api