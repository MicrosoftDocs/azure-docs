---
title: Plan your app - LUIS
description: Outline relevant app intents and entities, and then create your application plans in Language Understanding Intelligent Services (LUIS).
ms.topic: how-to
ms.date: 05/14/2020
---

# Plan your LUIS app schema with subject domain and data extraction

A LUIS app schema contains [intents](luis-glossary.md#intent) and [entities](luis-glossary.md#entity) relevant to your subject [domain](luis-glossary.md#domain). The intents classify user [utterances](luis-glossary.md#utterance), and the entities extract data from the user utterances.

## Identify your domain

A LUIS app is centered around a subject domain. For example, you may have a travel app that handles booking of tickets, flights, hotels, and rental cars. Another app may provide content related to exercising, tracking fitness efforts and setting goals. Identifying the domain helps you find words or phrases that are relevant to your domain.

> [!TIP]
> LUIS offers [prebuilt domains](luis-how-to-use-prebuilt-domains.md) for many common scenarios. Check to see if you can use a prebuilt domain as a starting point for your app.

## Identify your intents

Think about the [intents](luis-concept-intent.md) that are important to your application's task.

Let's take the example of a travel app, with functions to book a flight and check the weather at the user's destination. You can define the `BookFlight` and `GetWeather` intents for these actions.

In a more complex app with more functions, you have more intents, and you should define them carefully so the intents aren't too specific. For example, `BookFlight` and `BookHotel` may need to be separate intents, but `BookInternationalFlight` and `BookDomesticFlight` may be too similar.

> [!NOTE]
> It is a best practice to use only as many intents as you need to perform the functions of your app. If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general that they overlap.

If you don't need to identify overall user intention, add all the example user utterances to the `None` intent. If your app grows into needing more intents, you can create them later.

## Create example utterances for each intent

To begin with, avoid creating too many utterances for each intent. Once you have determined the intents, create 15 to 30 example utterances per intent. Each utterance should be different from the previously provided utterances. A good variety in utterances include overall word count, word choice, verb tense, and [punctuation](luis-reference-application-settings.md#punctuation-normalization).

For more information, see [understanding good utterances for LUIS apps](luis-concept-utterance.md).

## Identify your entities

In the example utterances, identify the entities you want extracted. To book a flight, you need information like the destination, date, airline, ticket category, and travel class. Create entities for these data types and then mark the [entities](luis-concept-entity-types.md) in the example utterances. Entities are important for accomplishing an intent.

When determining which entities to use in your app, keep in mind that there are different types of entities for capturing relationships between object types. [Entities in LUIS](luis-concept-entity-types.md) provides more detail about the different types.

> [!TIP]
> LUIS offers [prebuilt entities](luis-prebuilt-entities.md) for common, conversational user scenarios. Consider using prebuilt entities as a starting point for your application development.

## Resolution with intent or entity?

In many cases, especially when working with natural conversation, users provide an utterance that can contain more than one function or intent. To address this, a general rule of thumb is to understand that the representation of the output can be done in both intents and entities. This representation should be mappable to your client application actions, and it doesn't need to be limited to the intents.

**Int-ent-ties** is the concept that actions (usually understood as intents) could also be captured as entities and relied on in this form in the output JSON where you can map it to a specific action. _Negation_ is a common usage to leverage this reliance on both intent and entity for full extraction.

Consider the following two utterances which are very close considering word choice but have different results:

|Utterance|
|--|
|`Please schedule my flight from Cairo to Seattle`|
|`Cancel my flight from Cairo to Seattle`|

Instead of having two separate intents, create a single intent with a `FlightAction` machine learning entity. The machine learning entity should extract the details of the action for both a scheduling and a cancelling request as well as either a origin or destination location.

The `FlightAction` entity would be structured in the following suedo-schema of machine learning entity and subentities:

* FlightAction
    * Action
    * Origin
    * Destination

To help the extraction add features to the subentities. You will choose your features based on the vocabulary you expect to see in user utterances and the values you want returned in the prediction response.

## Next steps

> [!div class="nextstepaction"]
> [Learning the LUIS development lifecylce](luis-concept-app-iteration.md)

