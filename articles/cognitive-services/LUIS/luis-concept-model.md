---
title: Design with models - LUIS
description: Language understanding provides several types of models. Some models can be used in more than one way.
ms.topic: conceptual
ms.date: 04/17/2020
---

# Design with intent and entity models

Language understanding provides two types of models for you to define your app schema. Your app schema determines what information you receive from the prediction of a new user utterance.

The app schema is built from models you create using [machine teaching](#authoring-uses-machine-teaching):
* [Intents](#intents-classify-utterances) classify user utterances
* [Entities](#entities-extract-data) extract data from utterance

## Authoring uses machine teaching

LUIS's machine teaching methodology allows you to easily teach concepts to a machine. Understanding _machine learning_ is not necessary to use LUIS. Instead, you as the teacher, communicates a concept to LUIS by providing examples of the concept and explaining how a concept should be modeled using other related concepts. You, as the teacher, can also improve LUIS's model interactively by identifying and fixing prediction mistakes.

<a name="v3-authoring-model-decomposition"></a>

## Authoring model decomposition

LUIS supports _model decomposition_ with the authoring APIs, breaking down a concept into smaller parts. This allows you to build your models with confidence in how the various parts are constructed and predicted.

Model decomposition has the following parts:

* [intents](#intents-classify-utterances)
    * [features](#features)
* [machine-learned entities](#machine-learned-entities)
    * [subentities](#machine-learned-entity-components-help-extract-data) (also machine-learned entities)
        * [features](#features)
        * [constraints](#constraints-are-text-rules) provided by non-machine-learned entities such as regular expressions, lists, and prebuilt entities (such as number and date)

## Intents classify utterances

An intent classifies example utterances to teach LUIS about the intent. Example utterances within an intent are used as positive examples of the utterance. These same utterances are used as negative examples in all other intents.

Consider an app that needs to determine a user's intention to order a book and an app that needs the shipping address for the customer. This app has two intents: `OrderBook` and `ShippingLocation`.

The following utterance is a **positive example** for the `OrderBook` intent and a **negative example** for the `ShippingLocation` and `None` intents:

`Buy the top-rated book on bot architecture.`

The result of well-designed intents, with their example utterances, is a high intent prediction.

## Entities extract data

An entity represents a unit of data you want extracted from the utterance.

## Machine-learned entities

A machine-learned entity is a top-level entity containing subentities, which are also machine-learned entities.

Each subentity can have:

* child subentities - total length of 5 entities from parent to last child
    * machine-learned features - such as a phrase list
    * constraints (regular expression entity, list entity, prebuilt entity)

An example of a machine-learned entity is an order for a plane ticket. Conceptually this is a single transaction with many smaller units of data such as date, time, quantity of seats, type of seat such as first class or coach, origin location, destination location, and meal choice.

<a name="machine-learned-entity-components-help-extract-data"></a>

### Machine-learned subentity help extract data

A subentity is a machine-learned child entity within a machine-learned parent entity.

**Use the subentity to**:

* decompose the parts of the machine-learned entity (parent entity).

The following represents a machine-learned entity with all these separate pieces of data:

* TravelOrder (machine-learned entity)
    * DateTime (subentity with prebuilt datetimeV2 constraint)
    * Location To (subentity with prebuilt geographyV2 constraint)
    * Location From (subentity with prebuilt geographyV2 constraint)
    * Seating (subentity)
        * Quantity (subentity with prebuilt number constraint)
        * Quality (subentitywith feature of phrase list such as `first`, `business`, and `couch`)
    * Meals (subentity with constraint of list entity as food choices)

Some of this data, such as the origin location and destination location, should be learned from the context of the utterance, perhaps with such wording as `from` and `to`. Other parts of data can be extracted with exact string matches (`Vegan`) or prebuilt entities (geographyV2 of `Seattle` and `Cairo`).

You design how the data is matched and extracted by which models you choose and how you configure them.

### Constraints are text rules

A constraint is a text-matching rule, provided by a non-machine-learned entity. The constraint is applied at prediction time to limit the prediction and provide entity resolution needed by the client application. You define these rules while authoring the subentity.

Use a constraint when you know the exact text to extract.

Constraints include:

* [regular expression](reference-entity-regular-expression.md) entities
* [list](reference-entity-list.md) entities
* [prebuilt](luis-reference-prebuilt-entities.md) entities

Continuing with the example of the plane ticket, the airport codes can be in a List entity for exact text matches.

For an airport list, the list entry for Seattle is the city name, `Seattle` and the synonyms for Seattle include the airport code for Seattle along with surrounding towns and cities:

|`Seattle` List entity synonyms|
|--|
|`Sea`|
|`seatac`|
|`Bellevue`|

If you want to only recognize 3 letter codes for airport codes, use a regular expression as the constraint.

`/^[A-Z]{3}$/`

## Intents versus entities

An intent is the desired outcome of the _whole_ utterance while entities are pieces of data extracted from the utterance. Usually intents are tied to actions, which the client application should take. Entities are information needed to perform this action. From a programming perspective, an intent would trigger a method call and the entities would be used as parameters to that method call.

This utterance _must_ have an intent and _may_ have entities:

`Buy an airline ticket from Seattle to Cairo`

This utterance has a single intention:

* Buying a plane ticket

This utterance _may_ have several entities:

* Locations of Seattle (origin) and Cairo (destination)
* The quantity of a single ticket

## Features

A [feature](luis-concept-feature.md) is applied to a model at training time, including phrase lists and entities.

**Use a feature when you want to**:

* boost the significance of words and phrases identified by the feature
* have LUIS recommend new text or phrases to recommend for the phrase list
* fix an error on the training data

## Next steps

* Understand [intents](luis-concept-intent.md) and [entities](luis-concept-entity-types.md).
* Learn more about [features](luis-concept-feature.md)