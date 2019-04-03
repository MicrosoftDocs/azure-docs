---
title: Plan your app
titleSuffix: Language Understanding - Azure Cognitive Services
description: Outline relevant app intents and entities, and then create your application plans in Language Understanding Intelligent Services (LUIS).
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 01/02/2019
ms.author: diberry
---

# Plan your LUIS app with subject domain, intents and entities

It is important to plan your app. Identify your domain, including possible intents and entities that are relevant to your application.  

## Identify your domain

A LUIS app is centered around a domain-specific topic.  For example, you may have a travel app that performs booking of tickets, flights, hotels, and rental cars. Another app may provide content related to exercising, tracking fitness efforts and setting goals. Identifying the domain helps you find words or phrases that are important to your domain.

> [!TIP]
> LUIS offers [prebuilt domains](luis-how-to-use-prebuilt-domains.md) for many common scenarios.
> Check to see if you can use a prebuilt domain as a starting point for your app.

## Identify your intents

Think about the [intents](luis-concept-intent.md) that are important to your application’s task. Let's take the example of a travel app, with functions to book a flight and check the weather at the user's destination. You can define the "BookFlight" and "GetWeather" intents for these actions. In a more complex app with more functions, you have more intents, and you should define them carefully so as to not be too specific. For example, "BookFlight" and "BookHotel" may need to be separate intents, but "BookInternationalFlight" and "BookDomesticFlight" may be too similar.

> [!NOTE]
> It is a best practice to use only as many intents as you need to perform the functions of your app. If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general as to be overlapping.

## Create example utterances for each intent

Once you have determined the intents, create 10 or 15 example utterances for each intent. To begin with, do not have fewer than this number or create many utterances for each intent. Each utterance should be different from the previous utterance. A good variety in the utterances includes overall word count, word choice, verb tense, and punctuation. 

## Identify your entities

In the example utterances, identify the entities you want extracted. To book a flight, you need some information like the destination, date, airline, ticket category, and travel class. You create entities for these data types and then mark the [entities](luis-concept-entity-types.md) in the example utterances because they are important for accomplishing an intent. 

When you determine which entities to use in your app, keep in mind that there are different types of entities for capturing relationships between types of objects. [Entities in LUIS](luis-concept-entity-types.md) provides more detail about the different types.

## Next steps

After your app is trained, published, and gets endpoint utterances, plan to implement prediction improvements with [active learning](luis-how-to-review-endpoint-utterances.md), [phrase lists](luis-concept-feature.md), and [patterns](luis-concept-patterns.md). 


* See [Create your first Language Understanding Intelligent Services (LUIS) app](luis-get-started-create-app.md) for a quick walkthrough of how to create a LUIS app.
