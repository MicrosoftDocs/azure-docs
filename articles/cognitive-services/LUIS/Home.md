---
title: About Language Understanding (LUIS) in Azure | Microsoft Docs 
description: Learn how to use Language Understanding (LUIS) to bring the power of machine learning to your applications.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/07/2017
ms.author: v-geberr
---

# About Language Understanding (LUIS)

Language Understanding (LUIS) allows your application to understand what a person wants in their own words. LUIS uses machine learning to allow developers to build applications that can receive user input in natural language and extract meaning from it. A client application that converses with the user can pass user input to a LUIS app and receive relevant, detailed information back.

Several Microsoft technologies work with LUIS:

* [Bot Framework][bot-framework] allows a chat bot to talk with a user via text input.
* [Speech][speech] converts spoken language requests into text. Once converted to text, LUIS processes the requests.
* [Text Analytics][text-analytics] provides sentiment analysis and key phrase data extraction. 

## What is a LUIS app?

A LUIS app is a domain-specific language model designed by you and tailored to your needs. You can start with a prebuilt domain model, build your own, or blend pieces of a prebuilt domain with your own custom information.

A model starts with a list of general user intentions such as "Book Flight" or "Contact Help Desk." Once the intentions are identified, you supply example phrases called utterances for the intents. Then you label the utterances with any specific details you want LUIS to pull out of the utterance.

[Prebuilt domain models][prebuilt-domains] include all these pieces for you and are a great way to start using LUIS quickly.

After the model is designed, trained, and published, it is ready to receive and process utterances. The LUIS app receives the utterance as an HTTP request and responds with extracted user intentions. Your client application sends the utterance and receives LUIS's evaluation as a JSON object. Your client app can then take appropriate action.

![LUIS recognizes user intent](./media/luis-overview/luis-overview-process.png)

## Key LUIS concepts

* **Intents** An [intent][add-intents] represents actions the user wants to perform. The intent is a purpose or goal expressed in a user's input, such as booking a flight, paying a bill, or finding a news article. You define and name intents that correspond to these actions. A travel app may define an intent named "BookFlight." 
* **Utterances** An [utterance][add-example-utterances] is text input from the user that your app needs to understand. It may be a sentence, like "Book a ticket to Paris", or a fragment of a sentence, like "Booking" or "Paris flight." Utterances aren't always well-formed, and there can be many utterance variations for a particular intent. 
* **Entities** An [entity][add-entities] represents detailed information that is relevant in the utterance. For example, in the utterance "Book a ticket to Paris", "Paris" is a location. By recognizing and labeling the entities that are mentioned in the user’s utterance, LUIS helps you choose the specific action to take to answer a user's request. 

|Intent|Sample User Utterance|Entities|
|-----------|-----------|-----------|
|BookFlight|"Book a flight to __Seattle__?"|Seattle|
|StoreHoursAndLocation|"When does your store __open__?"|open|
|ScheduleMeeting|"Schedule a meeting at __1pm__ with __Bob__ in Distribution"|1pm, Bob|

## Accessing LUIS

LUIS has two ways to build a model: the [Authoring REST-based APIs][authoring-apis] and the [LUIS][LUIS] website. Both methods give you and your collaborators control of your LUIS model definition. You can use either the [LUIS][LUIS] website or the Authoring APIs or a combination of both to build your model. This management includes models, versions, collaborators, external APIs, testing, and training. 

Once your model is built and published, you pass the utterance to LUIS and receive the JSON object results with the [Endpoint REST-based APIs][endpoint-apis].

> [!NOTE]
> * The Authoring APIs and the [LUIS](luis-reference-regions.md) website use the authoring key found in your LUIS account page.
> * The Endpoint APIs use the LUIS subscription key found in the [Azure portal][azure-portal].

## Author your LUIS model 
Begin your LUIS model with the intents your client app can resolve. Intents are just names such as "BookFlight" or "OrderPizza." 

After an intent is identified, you need [sample utterances][add-example-utterances] that you want LUIS to map to your intent such as "Buy a ticket to Seattle tomorrow." Then, [label][label-suggested-utterances] the parts of the utterance that are relevant to your app domain as entities and set a type such as date or location.

Generally, an **intent** is used to trigger an action and an **entity** is used as a parameter to execute an action.

For example, a "BookFlight" intent could trigger an API call to an external service for booking a plane ticket, which requires entities like the travel destination, date, and airline. See [Plan your app](Plan-your-app.md) for examples and guidance on how to choose intents and entities to reflect the functions and relationships in an app.

### Identify Entities  
[Entity][luis-concept-entity-types] identification determines how successfully the end user gets the correct answer. LUIS provides several ways to identify and categorize entities.

* **Prebuilt Entities** LUIS has many prebuilt domain models including intents, utterances, and [prebuilt entities][prebuilt-entities]. You can use the prebuilt entities without having to use the intents and utterances of the prebuilt model. The prebuilt entities save you time.

* **Custom Entities** LUIS gives you several ways to identify your own custom [entities][entity-concept] including simple entities, composite entities, list entities, regular expression entities, hierarchical entities, and key phrase entities.

### Improve performance
Once your application is [published][publish-app] and real user utterances are entered, LUIS provides several methods to improve prediction accuracy.

* **Active learning** In the [active learning](label-suggested-utterances.md) process, LUIS provides real utterances that it is relatively unsure of for you to review. You can label them according to intent and entities, retrain, and republish. This iterative process has tremendous advantages. LUIS knows what it is unsure of, and your help leads to the maximum improvement in system performance. LUIS learns quicker, and takes the minimum amount of your time and effort. LUIS is an active machine learning at its best. 

* **Phrase lists** LUIS provides [phrases lists](luis-concept-feature.md) so you can indicate words or phrases that are significant to your app domain.  

* **Patterns** Patterns allow you to simplify an intent's utterance collection into common [patterns][patterns] of word choice and word order. 

## Next steps
Create a [new LUIS app](LUIS-get-started-create-app.md).

<!-- Reference-style links -->
[create-app]:luis-get-started-create-app.md
[azure-portal]:https://docs.microsoft.com/azure/cognitive-services/cognitive-services-apis-create-account
[publish-app]:PublishApp.md#test-your-published-endpoint-in-a-browser
[luis-concept-entity-types]:luis-concept-entity-types.md
[add-example-utterances]: add-example-utterances.md
[prebuilt-entities]: pre-builtentities.md
[prebuilt-domains]: luis-how-to-use-prebuilt-domains.md
[label-suggested-utterances]: label-suggested-utterances.md
[intro-video]:https://aka.ms/LUIS-Intro-Video
[bot-framework]:https://docs.microsoft.com/bot-framework/
[speech]:../Speech/index.md
[flow]:https://docs.microsoft.com/connectors/luis/
[entity-concept]:luis-concept-entity-types.md
[add-intents]:Add-intents.md
[add-entities]:Add-entities.md
[authoring-apis]:https://aka.ms/luis-authoring-api
[endpoint-apis]:https://aka.ms/luis-endpoint-apis
[LUIS]:luis-reference-regions.md
[text-analytics]:https://fix-this-url
[patterns]:https://fix-this-url