---
title: Features - LUIS
titleSuffix: Azure Cognitive Services
description: Add features to a language model to provide hints about how to recognize input that you want to label or classify.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 11/03/2019
ms.author: diberry
---
# Machine-learned features 

In machine learning, a *feature* is a distinguishing trait or attribute of data that your system observes & learns through. In Language Understanding (LUIS), a feature describes and explains what is significant about your intents and entities.

## Features in Language Understanding

Features, also known as descriptors, describe clues to help Language Understanding identify the example utterances. Features include: 

* Phrase list as a feature to intents or entities
* Entities as features to intents or entities

Features should be considered as a necessary part of your schema for model decomposition. 

## What is a phrase list

A phrase list is a list of words, phrases, numbers or other characters that help identify the concept you are trying to identify. The list is case-insensitive. 

## When to use a phrase list

With a phrase list, LUIS considers context and generalizes to identify items that are similar to, but not an exact text match. If you need your LUIS app to be able to generalize and identify new items, use a phrase list. 

When you want to be able to recognize new instances, like a meeting scheduler that should recognize the names of new contacts, or an inventory app that should recognize new products, start with a machine-learned entity. Then create a phrase list that helps LUIS find words with similar meaning. This phrase list guides LUIS to recognize examples by adding additional significance to the value of those words. 

Phrase lists are like domain-specific vocabulary that help with enhancing the quality of understanding of both intents and entities. 

## Considerations when using a phrase list

A phrase list is applied, by default, to all models in the app. This will work for phrase lists that can cross all intents and entities. For decomposability, you should apply a phrase list to only the models it is relevant to. 

If you create a phrase list (created globally by default), then later apply it as a descriptor (feature) to a specific model, it is removed from the other models. This removal adds relevance to the phrase list for the model it is applied to, helping improve the accuracy it provides in the model. 

The `enabledForAllModels` flag controls this model scope in the API. 

<a name="how-to-use-phrase-lists"></a>

### How to use a phrase list

[Create a phrase list](luis-how-to-add-features.md) list when your intent or entity has words or phrases that are important such as:

* industry terms
* slang
* abbreviations
* company-specific language
* language that is from another language but frequently used in your app
* key words and phrases in your example utterances

Do **not** add every possible word or phrase. Instead, add a few words or phrases at a time, then retrain and publish. As the list grows over time, you may find some terms have many forms (synonyms). Break these out into another list. 

<a name="phrase-lists-help-identify-simple-exchangeable-entities"></a>

## When to use an entity as a feature 

An entity can be added as a feature at the intent or the entity level. 

### Entity as a feature to an intent

Add an entity as a descriptor (feature) to an intent when the detection of that entity is significant for the intent.

For example, if the intent is for booking a flight and the entity is ticket information (such as the number of seats, origin, and destination), then finding the ticket information entity should add weight to the prediction of the book flight intent. 

### Entity as a feature to another entity

An entity (A) should be added as a feature to another entity (B) when the detection of that entity (A) is significant for the (B).

For example, if the street address entity (A) is detected, then finding the street address (A) adds weight to the prediction for the shipping address entity (B). 

## Best practices
Learn [best practices](luis-concept-best-practices.md).

## Next steps

See [Add Features](luis-how-to-add-features.md) to learn more about how to add features to your LUIS app.