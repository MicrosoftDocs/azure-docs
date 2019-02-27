---
title: Prebuilt models
titleSuffix: Language Understanding - Azure Cognitive Services
description: Prebuilt models provide domains, intents, utterances, and entities. You can start your app with a prebuilt domain or add a relevant domain to your app later. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 01/24/2019
ms.author: diberry
---

# Prebuilt domain, intent, and entity models

Prebuilt models provide domains, intents, utterances, and entities. You can start your app with a prebuilt domain or add a relevant domain to your app later. 

## Types of prebuilt models

There are 3 types of prebuilt models LUIS provides. Each model can be added to your app at any time. 

|Model type|Includes|
|--|--|
|Domain|Intents, utterances, entities|
|Intents|Intents, utterances|
|Entities|Entities only| 

## Prebuilt domains

Language Understanding (LUIS) provides *prebuilt domains*, which are prebuilt sets of [intents](luis-how-to-add-intents.md) and [entities](luis-concept-entity-types.md) that work together for domains or common categories of client applications. 

The prebuilt domains are trained and ready to add to your LUIS app. The intents and entities in a prebuilt domain are fully customizable once you've added them to your app. 

If you start from customizing an entire prebuilt domain, delete the intents and entities that your app doesn't need to use. You can also add some intents or entities to the set that the prebuilt domain already provides. For example, if you are using the **Events** prebuilt domain for a sports event app, you can to add entities for sports teams. When you start [providing utterances](luis-how-to-add-example-utterances.md) to LUIS, include terms that are specific to your app. LUIS learns to recognize them and tailors the prebuilt domain's intents and entities to your app's needs. 

> [!TIP]
> The intents and entities in a prebuilt domain work best together. It's better to combine intents and entities from the same domain when possible.
> The Utilities prebuilt domain has intents that you can customize for use in any domain. For example, you can add `Utilities.Repeat` to your app and train it recognize whatever actions user might want to repeat in your application. 

### Changing the behavior of a prebuilt domain intent

You might find that a prebuilt domain contains an intent that is similar to an intent you want to have in your LUIS app but you want it to behave differently. For example, the **Places** prebuilt domain provides an `MakeReservation` intent for making a restaurant reservation, but you want your app to use that intent to make hotel reservations. In that case, you can modify the behavior of that intent by providing utterances to LUIS about making hotel reservations and labeling them using the `MakeReservation` intent, so then LUIS can be retrained to recognize the `MakeReservation` intent in a request to book a hotel.

You can find a full listing of the prebuilt domains in the [Prebuilt domains reference](./luis-reference-prebuilt-domains.md).

## Prebuilt intents

LUIS provides prebuilt intents and their utterances. Intents can be added without adding the whole domain. Adding an intent is the process of adding an intent and its utterances. Both the intent name and the utterance list can be modified.  

## Prebuilt entities

LUIS includes a set of prebuilt entities for recognizing common types of information, like dates, times, numbers, measurements, and currency. Prebuilt entity support varies by the culture of your LUIS app. For a full list of the prebuilt entities that LUIS supports, including support by culture, see the [prebuilt entity reference](./luis-reference-prebuilt-entities.md).

When a prebuilt entity is included in your application, its predictions are included in your published application. 
The behavior of prebuilt entities is pre-trained and **cannot** be modified. Follow these steps to see how a prebuilt entity works:

> [!NOTE]
> **builtin.datetime** is deprecated. It is replaced by [**builtin.datetimeV2**](luis-reference-prebuilt-datetimev2.md), which provides recognition of date and time ranges, as well as improved recognition of ambiguous dates and times.

## Next steps

Learn how to [add prebuilt entities](luis-prebuilt-entities.md) to your app.
