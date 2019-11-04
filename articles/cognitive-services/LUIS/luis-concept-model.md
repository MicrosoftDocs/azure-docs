---
title: Design with models - LUIS
titleSuffix: Azure Cognitive Services
description: Language understanding provides several types of models. Some models can be used in more than one way. 
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

# Design with intent and entity models 

Language understanding provides several types of models. Some models can be used in more than one way. 

## V3 Authoring uses machine teaching

LUIS allows people to easily teach concepts to a machine. The machine can then build models (functional approximations of concepts such as classifiers and extractors) that can be used to power intelligent applications. While LUIS is powered by machine learning, understanding of machine learning is not necessary to use it. Instead, machine teachers communicate concepts to LUIS by showing positive and negative examples of the concept and explaining how a concept should be modeled using other related concepts. Teachers can also improve LUIS's model interactively by identifying and fixing the prediction mistakes. 

## V3 Authoring model decomposition

LUIS supports _model decomposition_ with the V3 authoring APIs, breaking down the model into smaller parts. This allows you to build your models with confidence in how the various parts are constructed and predicted.

Model decomposition has the following parts:

* [intents](#intents-classify-utterances)
    * [descriptors](#descriptors-are-features) provided by features
* [machine-learned entities](#machine-learned-entities)
    * [subcomponents](#entity-subcomponents-help-extract-data) (also machine-learned entities)
        * [descriptors](#descriptors-are-features) provided by features 
        * [constraints](#constraints-are-text-rules) provided by non-machine-learned entities such as (regular expressions and lists)

## V2 Authoring models

LUIS supports composite entities with the V2 authoring APIs. This provides similar model decomposition but is not the same as V3 model decomposition. The recommended model architecture is to move to model decomposition in the V3 authoring APIs. 

## Intents classify utterances

An intent classifies example utterances to teach LUIS about the intent. Example utterances within an intent are used as positive examples of the utterance. These same utterances are used as negative examples in all other intents.

Consider an app that needs to determine a user's intention to order a book and an app that needs the shipping address for the customer. This app has two intents: `OrderBook` and `ShippingLocation`.

The following utterance is a **positive example** for the `OrderBook` intent and a **negative example** for the `ShippingLocation` and `None` intents: 

`Buy the top-rated book on bot architecture.`

The result of well-designed intents, with their example utterances, is a high intent prediction. 

## Entities extract data

An entity represents a unit of data you want extracted from the utterance. 

### Machine-learned entities

A machine-learned entity is a top-level entity containing subcomponents, which are also machine-learned entities. 

**Use a machine-learned entity**:

* when the subcomponents are needed by the client application
* to help the machine learning algorithm decompose entities

Each subcomponent can have:

* subcomponents
* constraints (regular expression entity or list entity)
* descriptors (features such as a phrase list) 

An example of a machine-learned entity is an order for a plane ticket. Conceptually this is a single transaction with many smaller units of data such as date, time, quantity of seats, type of seat such as first class or coach, origin location, destination location, and meal choice.


### Entity subcomponents help extract data

A subcomponent is a machine-learned child entity within a machine-learned parent entity. 

**Use the subcomponent to**:

* decompose the parts of the machine-learned entity (parent entity).

The following represents a machine-learned entity with all these separate pieces of data:

* TravelOrder (machine-learned entity)
    * DateTime (prebuilt datetimeV2)
    * Location (machine-learned entity)
        * Origin (role found through context such as `from`)
        * Destination (role found through context such as `to`)
    * Seating (machine-learned entity)
        * Quantity (prebuilt number)
        * Quality (machine-learned entity with descriptor of phrase list)
    * Meals (machine-learned entity with constraint of list entity as food choices)

Some of this data, such as the origin location and destination location, should be learned from the context of the utterance, perhaps with such wording as `from` and `to`. Other parts of data can be extracted with exact string matches (`Vegan`) or prebuilt entities (geographyV2 of `Seattle` and `Cairo`). 

You design how the data is matched and extracted by which models you choose and how you configure them.

### Constraints are text rules

A constraint is a text-matching rule, provided by a non-machine-learned entity such as the regular expression entity or a list entity. The constraint is applied at prediction time to limit the prediction and provide entity resolution needed by the client application. You define these rules while authoring the subcomponent. 

**Use a constraint**:
* when you know the exact text to extract.

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

An intent is the desired outcome of the _whole_ utterance while entities are pieces of data extracted from the utterance. Usually intents are tied to actions the client application should take and entities are information needed to perform this action. From a programming perspective, an intent would trigger a method call and the entities would be used as parameters to that method call.

This utterance _must_ have an intent and _may_ have entities:

`Buy a airline ticket from Seattle to Cairo`

This utterance has a single intention:

* Buying a plane ticket

This utterance _may_ have several entities:

* Locations of Seattle (origin) and Cairo (destination)
* The quantity of a single ticket

## Descriptors are features

A descriptor is a feature applied to a model at training time, including phrase lists and entities. 

**Use a descriptor when you want to**:

* boost the significance of words and phrases identified by the descriptor
* have LUIS recommend new text or phrases to recommend for the descriptor
* fix an error on the training data

## Next steps

* Understand [intents](luis-concept-intent.md) and [entities](luis-concept-entity-types.md). 