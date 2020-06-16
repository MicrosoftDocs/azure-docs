---
title: Features - LUIS
description: Add features to a language model to provide hints about how to recognize input that you want to label or classify.
ms.topic: conceptual
ms.date: 06/10/2020
---
# Machine-learning (ML) features

In machine learning, a **feature** is a distinguishing trait or attribute of data that your system observes and learns through.

Machine learning features give LUIS important cues for where to look for things that will distinguish a concept. They are hints that LUIS can use, but not hard rules.  These hints are used in conjunction with the labels to find the data.

## What is a feature

A feature is a distinguishing trait, that can be described as a function: f(x) = y. The feature is used to know where to look, in the example utterance, for the distinguishing trait. When creating your schema, what do you know about the example utterance that indicates the trait? Your answer is your best guide to creating features.

## Types of features

 LUIS supports both phrase lists and models as features:
* Phrase list feature
* Model (intent or entity) as a feature

Features should be considered a necessary part of your schema design.

## How you find features in your example utterances

Because LUIS is a language-based application, the features will be text-based. Choose text that indicates the trait you want to distinguish. For LUIS, the text-based smallest unit is the token. For the english language, a token is a contiguous span, with no spaces or punctuation, of letters and numbers. A space is not a token.

Because spaces and punctuation are not tokens, focus on the text clues that you can use as features. Remember to include variations of word such:
* plural forms
* verb tense
* abbreviation
* spelling and misspelling

Does the text, as a distinguishing trait, have to:
* Match an exact word or phrase - consider adding a regular expression entity, or a list entity as a feature to the entity or intent
* Match a well-known concept such as dates, times, or people's names - use a prebuilt entity as a feature to the entity or intent
* Learn new examples over time - use a phrase list of some examples of the concept as a feature to the entity or intent

## Combine features

Because there are several choices in how a trait is described, you can use more than one feature that helps describe that trait or concept. A common pairing is to use a phrase list feature and one of the entity types commonly used as features: prebuilt entity, regular expression entity, or list entity.

### Ticket booking entity example

As a first example, consider an app for booking a flight with a Flight reservation intent and a ticket booking entity.

The ticket booking entity is a machine learned entity for the flight destination. To help extract the location, use two features to help:
* Phrase list of relevant words such as `plane`, `flight`, `reservation`, `ticket`
* Prebuilt `geographyV2` entity as feature to the entity

### Pizza entity example

As a another example, consider an app for order a pizza with a Create pizza order intent and a pizza entity.

The pizza entity is a machine learned entity for the pizza details. To help extract the details use two features to help:
* Phrase list of relevant words such as `cheese`, `crust`, `pepperoni`, `pineapple`
* Prebuilt `number` entity as feature to the entity

## A phrase list for a particular concept

A phrase list is a list of words or phrases that encapsulates a particular concept and is applied as a case-insensitive match at the token level.

When adding a phrase list, you can set the feature as:
* **[Global](#global-features)**. A global feature applies to the entire app.

### When to use a phrase list

When you need your LUIS app to be able to generalize and identify new items for the concept, use a phrase list. Phrase lists are like domain-specific vocabulary that help with enhancing the quality of understanding of both intents and entities.

### How to use a phrase list

With a phrase list, LUIS considers context and generalizes to identify items that are similar to, but not an exact text match.

Steps to use a phrase list:
* Start with a machine-learning entity
    * Add example utterances
    * Label with a machine-learning entity
* Add a phrase list
    * Add words with similar meaning - do **not** add every possible word or phrase. Instead, add a few words or phrases at a time, then retrain and publish.
    * Review and add suggested words

### A typical scenario for a phrase list

A typical scenario for a phrase list is to boost words related to a specific idea.

An example of words that may need a phrase list to boost their significance are medical terms. The terms can have specific physical, chemical, therapeutic, or abstract meaning. LUIS won't know the terms are important to your subject domain without a phrase list.

If you want to extract the medical terms:
* First create example utterances and label medical terms within those utterances.
* Then create a phrase list with examples of the terms within the subject domain. This phrase list should include the actual term you labeled and other terms that describe the same concept.
* Add the phrase list to the entity or subentity that extracts the concept used in the phrase list. The most common scenario is a component (child) of a machine-learning entity. If the phrase list should be applied across all intents or entities, mark the phrase list as a global phrase list. The `enabledForAllModels` flag controls this model scope in the API.

### Token matches for a phrase list

A phrase list applies at the token level, regardless of case. The following chart shows how a phrase list containing the word `Ann` is applied to variations of the same characters in that order.


| Token variation of `Ann` | Phrase list match when token is found |
|--------------------------|---------------------------------------|
| ANN<br>aNN<br>           | Yes - token is `Ann`                  |
| Ann's                    | Yes - token is `Ann`                  |
| Anne                     | No - token is `Anne`                  |


<a name="how-to-use-phrase-lists"></a>
<a name="how-to-use-a-phrase-lists"></a>
<a name="phrase-lists-help-identify-simple-exchangeable-entities"></a>

## A model as a feature helps another model

You can add a model (intent or entity) as a feature to another model (intent or entity). By adding an existing intent or entity as a feature, your adding a well-defined concept with labeled examples.

When adding a model as a feature, you can set the feature as:
* **[Required](#required-features)**. A required feature has to be found in order for the model to be returned from the prediction endpoint.
* **[Global](#global-features)**. A global feature applies to the entire app.

### When to use an entity as a feature to an intent

Add an entity as a feature to an intent when the detection of that entity is significant for the intent.

For example, if the intent is for booking a flight, `BookFlight`, and the entity is ticket information (such as the number of seats, origin, and destination), then finding the ticket information entity should add significant weight to the prediction of the `BookFlight` intent.

### When to use an entity as a feature to another entity

An entity (A) should be added as a feature to another entity (B) when the detection of that entity (A) is significant for the prediction of entity (B).

For example, if n shipping address entity contained a street address subentity, then finding the street address subentity adds significant weight to the prediction for the shipping address entity.

* Shipping address (machine learned entity)
    * Street number (subentity)
    * Street address (subentity)
    * City (subentity)
    * State or Province (subentity)
    * Country/Region (subentity)
    * Postal code (subentity)

## Nested subentities with features

A machine learned subentity indicates a concept is present to the parent entity, whether that parent is another subentity or the top entity. The value of the subentity acts as a feature to its parent.

A subentity can have both a phrase list as a feature as well as a model (another entity) as a feature.

When the subentity has a phrase list, this will boost the vocabulary of the concept but won't add any information to the JSON response of the prediction.

When the subentity has a feature of another entity, the JSON response includes the extracted data of that other entity.

## Required features

A required feature has to be found in order for the model to be returned from the prediction endpoint. Use a required feature when you know your incoming data must match the feature.

If the utterance text doesn't match the required feature, it will not be extracted.

**A required feature uses a non-machine learned entity**:
* Regular expression entity
* List entity
* Prebuilt entity

What are good features to mark as required? If you are confident your model will be found in the data, set the feature as required. A required feature doesn't return anything, if it isn't found.

Continuing with the example of the shipping address:
* Shipping address (machine learned entity)
    * Street number (subentity)
    * Street address (subentity)
    * Street name (subentity)
    * City (subentity)
    * State or Province (subentity)
    * Country/Region (subentity)
    * Postal code (subentity)

### Required feature using prebuilt entities

The city, state, and country/region are generally a closed set of lists, meaning they don't change much over time. These entities could have the relevant recommended features and those features could be marked as required. That means the entire shipping address is not returned is the entities with required features are not found.

What if the city, state, or country/region are in the utterance but either in a location or slang that LUIS doesn't expect? If you want to provide some post processing to help resolve the entity, due to a low confidence score from LUIS, do not mark the feature as required.

Another example of a required feature for the shipping address is to make the street number a required [prebuilt](luis-reference-prebuilt-entities.md) number. This allows a user to enter "1 Microsoft Way" or "One Microsoft Way". Both will resolve to a number of "1" for the Street number subentity.

### Required feature using list entities

A [list entity](reference-entity-list.md) is used as a list of canonical names along with their synonyms. As a required feature, if the utterance doesn't include either the canonical name or a synonym, then the entity isn't returned as part of the prediction endpoint.

Continuing with the shipping address example, suppose your company only ships to a limited set of countries/regions. You can create a list entity that includes several ways your customer may reference the country. If LUIS doesn't find an exact match within the text of the utterance, then the entity (that has the required feature of the list entity) isn't returned in the prediction.

|Canonical name|Synonyms|
|--|--|
|United States|U.S.<br>U.S.A<br>US<br>USA<br>0|

The client application, such as a chat bot can ask a follow-question, so the customer understands that the country/region selection is limited and _required_.

### Required feature using regular expression entities

A [regular expression entity](reference-entity-regular-expression.md) used as a required feature provides rich text-matching capabilities.

Continuing with the shipping address, you can create a regular expression that captures syntax rules of the country/region postal codes.

## Global features

While the most common use is to apply a feature to a specific model, you can configure the feature as a **global feature** to apply it to your entire application.

The most common use for a global feature is to add an additional vocabulary, such as words from another language, to the app. If your customers use a primary language, but expect to be able to use another language within the same utterance, you can add a feature that includes words from the secondary language.

Because the user expected to use the second language across any intent or entity, it should be added in a phrase list with the phrase list configured as a global feature.

## Best practices
Learn [best practices](luis-concept-best-practices.md).

## Next steps

* [Extend](schema-change-prediction-runtime.md) your app models at prediction runtime
* See [Add Features](luis-how-to-add-features.md) to learn more about how to add features to your LUIS app.
