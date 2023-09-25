---
title: Application Design
titleSuffix: Azure AI services
description: Application design concepts
services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 01/10/2022

---

# Plan your LUIS app

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


A Language Understanding (LUIS) app schema contains [intents](../luis-glossary.md#intent) and [entities](../luis-glossary.md#entity) relevant to your subject [domain](../luis-glossary.md#domain). The intents classify user [utterances](../luis-glossary.md#utterance), and the entities extract data from the user utterances. Intents and entities relevant to your subject domain. The intents classify user utterances.

A LUIS app learns and performs most efficiently when you iteratively develop it. Here's a typical iteration cycle:

1. Create a new version
2. Edit the LUIS app schema. This includes:
    * Intents with example utterances
    * Entities
    * Features
3. Train, test, and publish
4. Test for active learning by reviewing utterances sent to the prediction endpoint
5. Gather data from endpoint queries

:::image type="content" source="../media/luis-concept-app-iteration/iteration.png" alt-text="A screenshot showing the authoring cycle" lightbox="../media/luis-concept-app-iteration/iteration.png":::

## Identify your domain

A LUIS app is centered around a subject domain. For example, you may have a travel app that handles booking of tickets, flights, hotels, and rental cars. Another app may provide content related to exercising, tracking fitness efforts and setting goals. Identifying the domain helps you find words or phrases that are relevant to your domain.

> [!TIP]
> LUIS offers [prebuilt domains](../howto-add-prebuilt-models.md) for many common scenarios. Check to see if you can use a prebuilt domain as a starting point for your app.

## Identify your intents

Think about the [intents](../concepts/intents.md) that are important to your application's task.

Let's take the example of a travel app, with functions to book a flight and check the weather at the user's destination. You can define two intents,  BookFlight and GetWeather for these actions.

In a more complex app with more functions, you likely would have more intents, and you should define them carefully so they aren't too specific. For example, BookFlight and BookHotel may need to be separate intents, but BookInternationalFlight and BookDomesticFlight may be too similar.

> [!NOTE]
> It is a best practice to use only as many intents as you need to perform the functions of your app. If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general that they overlap.

If you don't need to identify overall user intention, add all the example user utterances to the `None` intent. If your app grows into needing more intents, you can create them later.

## Create example utterances for each intent

To start, avoid creating too many utterances for each intent. Once you have determined the intents you need for your app, create 15 to 30 example utterances per intent. Each utterance should be different from the previously provided utterances. Include a variety of word counts, word choices, verb tenses, and [punctuation](../luis-reference-application-settings.md#punctuation-normalization).

For more information, see [understanding good utterances for LUIS apps](../concepts/utterances.md).

## Identify your entities

In the example utterances, identify the entities you want extracted. To book a flight, you need information like the destination, date, airline, ticket category, and travel class. Create entities for these data types and then mark the [entities](entities.md) in the example utterances. Entities are important for accomplishing an intent.

When determining which entities to use in your app, remember that there are different types of entities for capturing relationships between object types. See [Entities in LUIS](../concepts/entities.md) for more information about the different types.

> [!TIP]
> LUIS offers [prebuilt entities](../howto-add-prebuilt-models.md) for common, conversational user scenarios. Consider using prebuilt entities as a starting point for your application development.

## Intents versus entities

An intent is the desired outcome of the _whole_ utterance while entities are pieces of data extracted from the utterance. Usually intents are tied to actions, which the client application should take. Entities are information needed to perform this action. From a programming perspective, an intent would trigger a method call and the entities would be used as parameters to that method call.

This utterance _must_ have an intent and _may_ have entities:

"*Buy an airline ticket from Seattle to Cairo*"

This utterance has a single intention:

* Buying a plane ticket

This utterance may have several entities:

* Locations of Seattle (origin) and Cairo (destination)
* The quantity of a single ticket

## Resolution in utterances with more than one function or intent

In many cases, especially when working with natural conversation, users provide an utterance that can contain more than one function or intent. To address this, a general strategy is to understand that output can be represented by both intents and entities. This representation should be mappable to your client application's actions, and doesn't need to be limited to intents.

**Int-ent-ties**  is the concept that actions (usually understood as intents) might also be captured as entities in the app's output, and mapped to specific actions. _Negation,_ _for example, commonly_  relies on intent and entity for full extraction. Consider the following two utterances, which are similar in word choice, but have different results:

* "*Please schedule my flight from Cairo to Seattle*"
* "*Cancel my flight from Cairo to Seattle*"

Instead of having two separate intents, you should create a single intent with a FlightAction machine learning entity. This machine learning entity should extract the details of the action for both scheduling and canceling requests, and either an origin or destination location.

This FlightAction entity would be structured with the following top-level machine learning entity, and subentities:

* FlightAction
  * Action
  * Origin
  * Destination

To help with extraction, you would add features to the subentities. You would choose features based on the vocabulary you expect to see in user utterances, and the values you want returned in the prediction response.

## Best practices

### Plan Your schema

Before you start building your app's schema, you should identify how and where you plan to use this app. The more thorough and specific your planning, the better your app becomes.

* Research targeted users
* Define end-to-end personas to represent your app - voice, avatar, issue handling (proactive, reactive)
* Identify channels of user interactions (such as text or speech), handing off to existing solutions or creating a new solution for this app
* End-to-end user journey
  * What do you expect this app to do and not do? What are the priorities of what it should do?
  * What are the main use cases?
* Collecting data - [learn about collecting and preparing data](../data-collection.md) 

### Don't train and publish with every single example utterance

Add 10 or 15 utterances before training and publishing. That allows you to see the impact on prediction accuracy. Adding a single utterance may not have a visible impact on the score.

### Don't use LUIS as a training platform

LUIS is specific to a language model's domain. It isn't meant to work as a general natural language training platform.

### Build your app iteratively with versions

Each authoring cycle should be contained within a new [version](../concepts/application-design.md), cloned from an existing version.

### Don't publish too quickly

Publishing your app too quickly and without proper planning may lead to several issues such as:

* Your app will not work in your actual scenario at an acceptable level of performance.
* The schema (intents and entities) might not be appropriate, and if you have developed client app logic following the schema, you may need to redo it. This might cause unexpected delays and extra costs to the project you are working on.
* Utterances you add to the model might cause biases towards example utterances that are hard to debug and identify. It will also make removing ambiguity difficult after you have committed to a certain schema.

### Do monitor the performance of your app

Monitor the prediction accuracy using a [batch test](../luis-how-to-batch-test.md) set.

Keep a separate set of utterances that aren't used as [example utterances](utterances.md) or endpoint utterances. Keep improving the app for your test set. Adapt the test set to reflect real user utterances. Use this test set to evaluate each iteration or version of the app.

### Don't create phrase lists with all possible values

Provide a few examples in the [phrase lists](patterns-features.md#create-a-phrase-list-for-a-concept) but not every word or phrase. LUIS generalizes and takes context into account.

## Next steps
[Intents](intents.md)
