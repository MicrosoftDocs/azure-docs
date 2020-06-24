---
title: Prebuilt models - LUIS
titleSuffix: Azure Cognitive Services
description: Prebuilt models provide domains, intents, utterances, and entities. You can start your app with a prebuilt domain or add a relevant domain to your app later. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/10/2019
ms.author: diberry
---

# Prebuilt models

Prebuilt models provide domains, intents, utterances, and entities. You can start your app with a prebuilt model or add a relevant model to your app later. 

## Types of prebuilt models

LUIS provides three types of prebuilt models. Each model can be added to your app at any time. 

|Model type|Includes|
|--|--|
|[Domain](luis-reference-prebuilt-domains.md)|Intents, utterances, entities|
|Intents|Intents, utterances|
|[Entities](luis-reference-prebuilt-entities.md)|Entities only| 

## Prebuilt domains

Language Understanding (LUIS) provides *prebuilt domains*, which are pre-trained models of [intents](luis-how-to-add-intents.md) and [entities](luis-concept-entity-types.md) that work together for domains or common categories of client applications. 

The prebuilt domains are trained and ready to add to your LUIS app. The intents and entities of a prebuilt domain are fully customizable once you've added them to your app. 

> [!TIP]
> The intents and entities in a prebuilt domain work best together. It's better to combine intents and entities from the same domain when possible.
> The Utilities prebuilt domain has intents that you can customize for use in any domain. For example, you can add `Utilities.Repeat` to your app and train it recognize whatever actions user might want to repeat in your application. 

### Changing the behavior of a prebuilt domain intent

You might find that a prebuilt domain contains an intent that is similar to an intent you want to have in your LUIS app but you want it to behave differently. For example, the **Places** prebuilt domain provides a `MakeReservation` intent for making a restaurant reservation, but you want your app to use that intent to make hotel reservations. In that case, you can modify the behavior of that intent by adding example utterances to the intent about making hotel reservations and then retrain the app. 

You can find a full listing of the prebuilt domains in the [Prebuilt domains reference](./luis-reference-prebuilt-domains.md).

## Prebuilt intents

LUIS provides prebuilt intents and their utterances for each of its prebuilt domains. Intents can be added without adding the whole domain. Adding an intent is the process of adding an intent and its utterances to your app. Both the intent name and the utterance list can be modified.  

## Prebuilt entities

LUIS includes a set of prebuilt entities for recognizing common types of information, like dates, times, numbers, measurements, and currency. Prebuilt entity support varies by the culture of your LUIS app. For a full list of the prebuilt entities that LUIS supports, including support by culture, see the [prebuilt entity reference](./luis-reference-prebuilt-entities.md).

When a prebuilt entity is included in your application, its predictions are included in your published application. The behavior of prebuilt entities is pre-trained and **cannot** be modified. 

> [!NOTE]
> **builtin.datetime** is deprecated. It is replaced by [**builtin.datetimeV2**](luis-reference-prebuilt-datetimev2.md), which provides recognition of date and time ranges, as well as improved recognition of ambiguous dates and times.

## Next steps

Learn how to [add prebuilt entities](luis-prebuilt-entities.md) to your app.
