---
title: Design with models - LUIS
description: Language understanding provides several types of models. Some models can be used in more than one way.
ms.service: azure-ai-language
author: aahill
ms.author: aahi
ms.manager: nitinme
ms.subservice: azure-ai-luis
ms.topic: conceptual
ms.date: 01/07/2022
---

# Design with intent and entity models

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]


Language understanding provides two types of models for you to define your app schema. Your app schema determines what information you receive from the prediction of a new user utterance.

The app schema is built from models you create using [machine teaching](#authoring-uses-machine-teaching):
* [Intents](#intents-classify-utterances) classify user utterances
* [Entities](#entities-extract-data) extract data from utterance

## Authoring uses machine teaching

LUIS's machine teaching methodology allows you to easily teach concepts to a machine. Understanding _machine learning_ is not necessary to use LUIS. Instead, you as the teacher, communicates a concept to LUIS by providing examples of the concept and explaining how a concept should be modeled using other related concepts. You, as the teacher, can also improve LUIS's model interactively by identifying and fixing prediction mistakes.

<a name="v3-authoring-model-decomposition"></a>

## Intents classify utterances

An intent classifies example utterances to teach LUIS about the intent. Example utterances within an intent are used as positive examples of the utterance. These same utterances are used as negative examples in all other intents.

Consider an app that needs to determine a user's intention to order a book and an app that needs the shipping address for the customer. This app has two intents: `OrderBook` and `ShippingLocation`.

The following utterance is a **positive example** for the `OrderBook` intent and a **negative example** for the `ShippingLocation` and `None` intents:

`Buy the top-rated book on bot architecture.`

## Entities extract data

An entity represents a unit of data you want extracted from the utterance. A machine-learning entity is a top-level entity containing subentities, which are also machine-learning entities.

An example of a machine-learning entity is an order for a plane ticket. Conceptually this is a single transaction with many smaller units of data such as date, time, quantity of seats, type of seat such as first class or coach, origin location, destination location, and meal choice.

## Intents versus entities

An intent is the desired outcome of the _whole_ utterance while entities are pieces of data extracted from the utterance. Usually intents are tied to actions, which the client application should take. Entities are information needed to perform this action. From a programming perspective, an intent would trigger a method call and the entities would be used as parameters to that method call.

This utterance _must_ have an intent and _may_ have entities:

`Buy an airline ticket from Seattle to Cairo`

This utterance has a single intention:

* Buying a plane ticket

This utterance _may_ have several entities:

* Locations of Seattle (origin) and Cairo (destination)
* The quantity of a single ticket

## Entity model decomposition

LUIS supports _model decomposition_ with the authoring APIs, breaking down a concept into smaller parts. This allows you to build your models with confidence in how the various parts are constructed and predicted.

Model decomposition has the following parts:

* [intents](#intents-classify-utterances)
    * [features](#features)
* [machine-learning entities](reference-entity-machine-learned-entity.md)
    * subentities (also machine-learning entities)
        * [features](#features)
            * [phrase list](concepts/patterns-features.md)
            * [non-machine-learning entities](concepts/patterns-features.md) such as [regular expressions](reference-entity-regular-expression.md), [lists](reference-entity-list.md), and [prebuilt entities](luis-reference-prebuilt-entities.md)

<a name="entities-extract-data"></a>
<a name="machine-learned-entities"></a>

## Features

A [feature](concepts/patterns-features.md) is a distinguishing trait or attribute of data that your system observes. Machine learning features give LUIS important cues for where to look for things that will distinguish a concept. They are hints that LUIS can use, but not hard rules. These hints are used in conjunction with the labels to find the data.

## Patterns

[Patterns](concepts/patterns-features.md) are designed to improve accuracy when several utterances are very similar. A pattern allows you to gain more accuracy for an intent without providing many more utterances.

## Extending the app at runtime

The app's schema (models and features) is trained and published to the prediction endpoint. You can [pass new information](schema-change-prediction-runtime.md), along with the user's utterance, to the prediction endpoint to augment the prediction.

## Next steps

* Understand [intents](concepts/patterns-features.md) and [entities](concepts/entities.md).
* Learn more about [features](concepts/patterns-features.md)
