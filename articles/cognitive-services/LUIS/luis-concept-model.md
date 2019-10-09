---
title: Types of models - LUIS
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

# App Models are your schema in Language Understanding

Language understanding provides several types of models. Some models can be used in more than one way. 

## Types of models

Language Understanding has several types of models:

|Name|Purpose|Definition|
|--|--|--|
|Intent|Classify primary purpose of user's utterance.|Model that categorizes groups of example utterances that have a common action.|
|Entities|Extracts data from inside a user utterance.|Model that identifies a span of tokens.|
|Constraints|Extracts data from inside a user utterance. Bounds the extraction of a child entity (subcomponent) by a non-machine-learned-entity (matching entity).|Rule that constrains the firing of a child entity extraction model by a non-machine learned entity (regular expression entity, list entity, prebuilt entity).A model that doesn't require machine-learning to extract information. These models include a regular expression entity, a list entity, or a prebuilt entity.|
|Descriptors|Boost relevance so classification or extraction is successful by signaling to the machine-learned model.|Models such as entities or phrase lists. Features such as intents, entities, or phrase list.|
|Feature|Boost relevance.| In machine learning, a feature is a distinguishing trait or attribute of data that your system observes and learns through. In Language Understanding (LUIS), a feature describes and explains what is significant about your intents and entities.|
|Token|Identify entity for extraction.|Set of words|

## Single intent utterances

Intents are applied to the utterance's intention:

`Buy a airline ticket from Seattle to Cairo`

This utterance has a single intention:

* Buying a plane ticket

## Intents versus entities

An intent is the desired outcome of the utterance while entities are pieces of data extracted from the utterance.

This utterance _must_ have an intent and _may_ have entities:

`Buy a airline ticket from Seattle to Cairo`

This utterance has a single intention:

* Buying a plane ticket

This utterance _may_ have several entities:

* Locations of Seattle (origin) and Cairo (destination)
* The quantity of a single ticket


## Next steps

* Understand [intents](luis-concept-intent.md) and [entities](luis-concept-entity-types.md). 