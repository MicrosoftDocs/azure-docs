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

# Types of models in Language Understanding

Language understand provides several types of models. Some models can be used in more than one way. 

## Types of models

Language Understanding has several types of models:

|Name|Purpose|Definition|
|--|--|--|
|Intent|Classify primary purpose of user's utterance.|Model that groups example user utterances with same intent.|
|Entities|Extracts data from inside a user utterance.|Model that identifies the type of data.|
|Constraints|Extracts data from inside a user utterance.|A model that doesn't require machine-learning to extract information. These models include a regular expression entity, a list entity, or a prebuilt entity.|
|Descriptors|Boost relevance so classification or extraction is successful.|Models such as entities or phrase lists.|

## Single intent utterances

Intents are applied to the utterance's intention:

`Buy a airline ticket from Seattle to Cairo`

This utterance has a single intention:

* Buying a plane ticket

## Multiple-intent utterances

An utterance can have more than one intent:

`Buy an airline ticket from Seattle to Cairo and purchase the vegan meal`

This utterance has two intentions:

* Buying a plane ticket 
* Buying the meal for the plane flight

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

* Understand [intents](luis-concept-intents.md) and [entities](luis-concept-entity-types.md). 