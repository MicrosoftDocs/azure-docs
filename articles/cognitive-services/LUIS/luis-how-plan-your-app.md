---
title: Plan your app - LUIS
titleSuffix: Azure Cognitive Services
description: Outline relevant app intents and entities, and then create your application plans in Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/25/2019
ms.author: diberry
---

# Plan your LUIS app schema with subject domain and data extraction

A LUIS app schema contains intents and entities relevant to your subject domain. The intents classify user utterances, and the entities extract data from the user utterances. 

## Identify your domain

A LUIS app is centered around a domain-specific topic.  For example, you may have a travel app that performs booking of tickets, flights, hotels, and rental cars. Another app may provide content related to exercising, tracking fitness efforts and setting goals. Identifying the domain helps you find words or phrases that are important to your domain.

> [!TIP]
> LUIS offers [prebuilt domains](luis-how-to-use-prebuilt-domains.md) for many common scenarios.
> Check to see if you can use a prebuilt domain as a starting point for your app.

## Identify your intents

Think about the [intents](luis-concept-intent.md) that are important to your application’s task. 

Let's take the example of a travel app, with functions to book a flight and check the weather at the user's destination. You can define the `BookFlight` and `GetWeather` intents for these actions. 

In a more complex app with more functions, you have more intents, and you should define them carefully so the intents aren't too specific. For example, `BookFlight` and `BookHotel` may need to be separate intents, but `BookInternationalFlight` and `BookDomesticFlight` may be too similar.

> [!NOTE]
> It is a best practice to use only as many intents as you need to perform the functions of your app. If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general that they overlap.

If you don't need to identify overall user intention, add all the example user utterances to the None intent. If your app grows into needing more intents, you can create them later. 

## Create example utterances for each intent

Once you have determined the intents, create 15 to 30 example utterances for each intent. To begin with, do not have fewer than this number or create too many utterances for each intent. Each utterance should be different from the previous utterance. A good variety in the utterances includes overall word count, word choice, verb tense, and punctuation. 

Review [utterances](luis-concept-utterance.md) for more information.

## Identify your entities

In the example utterances, identify the entities you want extracted. To book a flight, you need information like the destination, date, airline, ticket category, and travel class. Create entities for these data types and then mark the [entities](luis-concept-entity-types.md) in the example utterances because they are important for accomplishing an intent. 

When you determine which entities to use in your app, keep in mind that there are different types of entities for capturing relationships between types of objects. [Entities in LUIS](luis-concept-entity-types.md) provides more detail about the different types.

## Next steps

Learn about the typical [development cycle](luis-concept-app-iteration.md).  