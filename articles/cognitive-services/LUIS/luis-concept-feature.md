---
title: Features - LUIS
description: Add features to a language model to provide hints about how to recognize input that you want to label or classify.
ms.topic: conceptual
ms.date: 04/14/2020
---
# Machine-learning features

A machine learning _feature_ is a distinguishing trait or attribute of data that your system observes & learns through. In Language Understanding (LUIS), a feature describes and explains what is significant about your intents and entities.

LUIS provides the following machine-learning features:
* Phrase list feature
* Model (intent or entity) as a feature

Features should be considered a necessary part of your schema design.

## What is a phrase list

A phrase list is a list of words or phrases that encapsulates a particular concept.

### When to use a phrase list

When you need your LUIS app to be able to generalize and identify new items for the concept, use a phrase list. Phrase lists are like domain-specific vocabulary that help with enhancing the quality of understanding of both intents and entities.

### How to use a phrase list

With a phrase list, LUIS considers context and generalizes to identify items that are similar to, but not an exact text match.

Steps to use a phrase list:
* Start with a machine-learned entity
    * Add example utterances
    * Label with a machine-learned entity
* Add a phrase list
    * Add words with similar meaning - do **not** add every possible word or phrase. Instead, add a few words or phrases at a time, then retrain and publish. As the list grows over time, you may find some terms have many forms (synonyms). Break these out into another list.
        * industry terms
        * slang
        * abbreviations
        * company-specific language
        * language that is from another language but frequently used in your app
        * key words and phrases in your example utterances
    * Review and add suggested words

### A typical scenario for a phrase list

A typical scenario for a phrase list is to boost words of a specific or central idea, for example, names. A name can be any type of word such as a noun, verb, adjective, slang, or made-up words.

If you want to have names that are unique to your subject domain extracted:
* First create example utterances and label names within those utterances.
* Then create a phrase list with examples of the names within the subject domain.
* Add the phrase list to the entity model that extracts the concept used in the phrase list. The most common scenario is a component (child) of a machine-learned entity. If the phrase list should be applied across all intents or entities, mark the phrase list as a global phrase list. The `enabledForAllModels` flag controls this model scope in the API.

<a name="how-to-use-phrase-lists"></a>
<a name="how-to-use-a-phrase-lists"></a>
<a name="phrase-lists-help-identify-simple-exchangeable-entities"></a>

## Model as a feature

A model as a feature allows you to take an existing model, an intent or an entity, and apply it as a feature to another model.

### When to use an entity as a feature

Use an entity as a feature at the intent or the entity level.

### Entity as a feature to an intent

Add an entity as a feature to an intent when the detection of that entity is significant for the intent.

For example, if the intent is for booking a flight and the entity is ticket information (such as the number of seats, origin, and destination), then finding the ticket information entity should add significant weight to the prediction of the book flight intent.

### Entity as a feature to another entity

An entity (A) should be added as a feature to another entity (B) when the detection of that entity (A) is significant for the prediction of entity (B).

For example, if the street address entity (A) is detected, then finding the street address (A) adds significant weight to the prediction for the shipping address entity (B).

## Global features

While the most common use is to apply a feature to a specific model, configure the feature as a global feature to boost the concept for your entire schema.

## Best practices
Learn [best practices](luis-concept-best-practices.md).

## Next steps

See [Add Features](luis-how-to-add-features.md) to learn more about how to add features to your LUIS app.