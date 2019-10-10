---
title: Design with models - LUIS
titleSuffix: Azure Cognitive Services
description: 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 10/03/2019
ms.author: diberry
---

# Design with intent and entity models 

Language understanding provides several types of models. Some models can be used in more than one way. 

## Model decomposition

LUIS supports _model decomposition_, breaking down the model into smaller models, with the following model types:

* intents
* machine-learned entities
* machine-learned entity subcomponents
* machine-learned entity subcomponent's descriptors 
* machine-learned entity subcomponent's constraints

[add conceptual image]

## Intents classify utterances

Intents classify groups of example utterances. The example utterances are used to train the LUIS app. Example utterances within an intent are used as positive examples of the utterance. 

The result of well-designed intents, with their example utterances, is a high intent prediction. 

## Machine-learned entities extract data

A machine-learned entity represents a unit of data you want extracted from the utterance. This top-level entity can have subcomponents and each subcomponent can have constraints and descriptors. 

Use a machine-learned entity to define a single unit of information within an utterance. 

An example of a machine-learned entity is an order for a plane ticket. Conceptually this is a single transaction with many smaller units of data.

## Intents versus entities

An intent is the desired outcome of the utterance while entities are pieces of data extracted from the utterance.

This utterance _must_ have an intent and _may_ have entities:

`Buy a airline ticket from Seattle to Cairo`

This utterance has a single intention:

* Buying a plane ticket

This utterance _may_ have several entities:

* Locations of Seattle (origin) and Cairo (destination)
* The quantity of a single ticket

## Entity subcomponents help extract data

A subcomponent is a child entity within a machine-learned entity. The subcomponent can be any entity type: machine-learned, non-machine-learned, prebuilt entity. 

Use the subcomponent to decompose the parts of the machine-learned entity (parent entity).

Continuing the example of a plane ticket, there can be many pieces of data to extract, such as:
* quantity of tickets
* date of travel
* preferred time of day to travel
* preferred airports
* origin location
* destination location
* preferred seating 
* preferred meal 

Some of this data, such as the origin location and destination location, should be learned from the context of the utterance, perhaps with such wording as `from` and `to`. Other parts of data can be extracted with exact string matches (`Vegan`) or prebuilt entities (geographyV2 of `Seattle` and `Cairo`). 

You design how the data is matched and extracted by which models you choose and how you configure them.

## Constraints are text rules

A constraint is a text-matching rule applied at prediction time to a subcomponent of a machine-learned entity. You define these rules while authoring the subcomponent. The rule is applied to a user utterance at prediction time. 

Constraints are regular expression entities or list entities. 

Use a constraint when you know the exact text to extract.

Continuing with the example of the plane ticket, the airport codes can be in a List entity for exact text matches. 

## Descriptors are features

A descriptor is a feature applied to a model at training time. A descriptor includes both phrase lists and entities. 

Use a descriptor when you want to add boost the prediction score, using the words and phrases identified by the descriptor, to an intent or entity. 


## Next steps

* Understand [intents](luis-concept-intent.md) and [entities](luis-concept-entity-types.md). 