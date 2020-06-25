---
title: Features - LUIS
description: Add features to a language model to provide hints about how to recognize input that you want to label or classify.
ms.topic: conceptual
ms.date: 06/10/2020
---
# Machine-learning features

In machine learning, a *feature* is a distinguishing trait or attribute of data that your system observes and learns through.

Machine-learning features give LUIS important cues for where to look for things that distinguish a concept. They're hints that LUIS can use, but they aren't hard rules. LUIS uses these hints in conjunction with the labels to find the data.

A feature can be described as a function, like f(x) = y. In the example utterance, the feature tells you where to look for the distinguishing trait. Use this information to help create your schema.

## Types of features

LUIS supports both phrase lists and models as features:

* Phrase list feature 
* Model (intent or entity) as a feature

Features should be considered a necessary part of your schema design.

## Find features in your example utterances

Because LUIS is a language-based application, the features are text-based. Choose text that indicates the trait you want to distinguish. For LUIS, the smallest unit is the *token*. For the English language, a token is a contiguous span of letters and numbers that has no spaces or punctuation.

Because spaces and punctuation aren't tokens, focus on the text clues that you can use as features. Remember to include variations of words, such as:

* plural forms
* verb tenses
* abbreviations
* spellings and misspellings

Determine if the text, because it distinguishes a trait, has to:

* Match an exact word or phrase: Consider adding a regular expression entity or a list entity as a feature to the entity or intent.
* Match a well-known concept like dates, times, or people's names: Use a prebuilt entity as a feature to the entity or intent.
* Learn new examples over time: Use a phrase list of some examples of the concept as a feature to the entity or intent.

## Combine features

You can use more than one feature to describe a trait or concept. A common pairing is to use a phrase list feature and an entity type that's often used as a feature:

 * prebuilt entity
 * regular-expression entity
 * list entity

### Ticket-booking entity example

As a first example, consider an app for booking a flight with a flight-reservation intent and a ticket-booking entity.

The ticket-booking entity is a machine-learning entity for the flight destination. To help extract the location, use two features to help:

* A phrase list of relevant words, such as, **plane**, **flight**, **reservation**, or **ticket**
* A prebuilt **geographyV2** entity as a feature to the entity

### Pizza entity example

As another example, consider an app for ordering a pizza that has a create-pizza-order intent and a pizza entity.

The pizza entity is a machine-learning entity for the pizza details. To help extract the details, use two features to help:

* A phrase list of relevant words, such as, **cheese**, **crust**, **pepperoni**, or **pineapple**
* A prebuilt **number** entity as a feature to the entity

## Create a phrase list for a concept

A phrase list is a list of words or phrases that describes a concept. A phrase list is applied as a case-insensitive match at the token level.

When adding a phrase list, you can set the feature as **[global](#global-features)**. A global feature applies to the entire app.

### When to use a phrase list

Use a phrase list when you need your LUIS app to generalize and identify new items for the concept. Phrase lists are like domain-specific vocabulary. They enhance the quality of understanding for intents and entities.

### How to use a phrase list

With a phrase list, LUIS considers context and generalizes to identify items that are similar to, but aren't an exact text match. Follow these steps to use a phrase list:

1. Start with a machine-learning entity:
    1. Add example utterances.
    1. Label with a machine-learning entity.
1. Add a phrase list:
    1. Add words with similar meaning. Don't add every possible word or phrase. Instead, add a few words or phrases at a time. Then retrain and publish.
    1. Review and add suggested words.

### A typical scenario for a phrase list

A typical scenario for a phrase list is to boost words related to a specific idea.

Medical terms are a good example of words that might need a phrase list to boost their significance. These terms can have specific physical, chemical, therapeutic, or abstract meanings. LUIS won't know the terms are important to your subject domain without a phrase list.

To extract the medical terms:

1. Create example utterances and label medical terms within those utterances.
2. Create a phrase list with examples of the terms within the subject domain. This phrase list should include the actual term you labeled and other terms that describe the same concept.
3. Add the phrase list to the entity or subentity that extracts the concept used in the phrase list. The most common scenario is a component (child) of a machine-learning entity. If the phrase list should be applied across all intents or entities, mark the phrase list as a global-phrase list. The **enabledForAllModels** flag controls this model scope in the API.

### Token matches for a phrase list

A phrase list always applies at the token level. The following table shows how a phrase list that has the word **Ann** applies to variations of the same characters in that order.


| Token variation of **Ann** | Phrase list match when the token is found |
|--------------------------|---------------------------------------|
| **ANN**<br>**aNN**<br>           | Yes - token is **Ann**                  |
| **Ann's**                    | Yes - token is **Ann**                  |
| **Anne**                     | No - token is **Anne**                  |

<a name="how-to-use-phrase-lists"></a>
<a name="how-to-use-a-phrase-lists"></a>
<a name="phrase-lists-help-identify-simple-exchangeable-entities"></a>

## A model as a feature helps another model

You can add a model (intent or entity) as a feature to another model (intent or entity). By adding an existing intent or entity as a feature, you're adding a well-defined concept that has labeled examples.

When adding a model as a feature, you can set the feature as:
* **[Required](#required-features)**. A required feature has to be found in order for the model to be returned from the prediction endpoint.
* **[Global](#global-features)**. A global feature applies to the entire app.

### When to use an entity as a feature to an intent

Add an entity as a feature to an intent when the detection of that entity is significant for the intent.

For example, if the intent is for booking a flight, like **BookFlight**, and the entity is ticket information (such as the number of seats, origin, and destination), then finding the ticket-information entity should add significant weight to the prediction of the **BookFlight** intent.

### When to use an entity as a feature to another entity

An entity (A) should be added as a feature to another entity (B) when the detection of that entity (A) is significant for the prediction of entity (B).

For example, if a shipping-address entity is contained in a street-address subentity, then finding the street-address subentity adds significant weight to the prediction for the shipping address entity.

* Shipping address (machine-learning entity):

    * Street number (subentity)
    * Street address (subentity)
    * City (subentity)
    * State or Province (subentity)
    * Country/Region (subentity)
    * Postal code (subentity)

## Nested subentities with features

A machine-learning subentity indicates a concept is present to the parent entity. The parent can be another subentity or the top entity. The value of the subentity acts as a feature to its parent.

A subentity can have both a phrase list and a model (another entity) as a feature.

When the subentity has a phrase list, it boosts the vocabulary of the concept but won't add any information to the JSON response of the prediction.

When the subentity has a feature of another entity, the JSON response includes the extracted data of that other entity.


## Required features

A required feature has to be found in order for the model to be returned from the prediction endpoint. Use a required feature when you know your incoming data must match the feature.

If the utterance text doesn't match the required feature, it won't be extracted.

A required feature uses a non-machine-learning entity:

* Regular-expression entity
* List entity
* Prebuilt entity

If you're confident that your model will be found in the data, set the feature as required. A required feature doesn't return anything if it isn't found.

Continuing with the example of the shipping address:

Shipping address (machine learned entity)

 * Street number (subentity) 
 * Street address (subentity) 
 * Street name (subentity) 
 * City (subentity) 
 * State or Province (subentity) 
 * Country/Region (subentity) 
 * Postal code (subentity)

### Required feature using prebuilt entities

The city, state, and country/region are generally a closed set of lists, meaning they don't change much over time. These entities could have the relevant recommended features and those features could be marked as required. That means the entire shipping address isn't returned if the entities that have required features aren't found.

What if the city, state, or country/region are in the utterance, but they're in a location or are slang that LUIS doesn't expect? If you want to provide some post processing to help resolve the entity, due to a low-confidence score from LUIS, don't mark the feature as required.

Another example of a required feature for the shipping address is to make the street number a required, [prebuilt](luis-reference-prebuilt-entities.md) number. This allows a user to enter "1 Microsoft Way" or "One Microsoft Way". Both resolve to the numeral "1" for the street-number subentity.

### Required feature using list entities

A [list entity](reference-entity-list.md) is used as a list of canonical names along with their synonyms. As a required feature, if the utterance doesn't include either the canonical name or a synonym, then the entity isn't returned as part of the prediction endpoint.

Suppose that your company only ships to a limited set of countries/regions. You can create a list entity that includes several ways for your customer to reference the country/region. If LUIS doesn't find an exact match within the text of the utterance, then the entity (that has the required feature of the list entity) isn't returned in the prediction.

|Canonical name|Synonyms|
|--|--|
|United States|U.S.<br>U.S.A<br>US<br>USA<br>0|

A client application, such as a chat bot, can ask a follow-up question to help. This helps the customer understand that the country/region selection is limited and *required*.

### Required feature using regular expression entities

A [regular expression entity](reference-entity-regular-expression.md) that's used as a required feature provides rich text-matching capabilities.

In the shipping address example, you can create a regular expression that captures syntax rules of the country/region postal codes.

## Global features

While the most common use is to apply a feature to a specific model, you can configure the feature as a **global feature** to apply it to your entire application.

The most common use for a global feature is to add an additional vocabulary to the app. For example, if your customers use a primary language, but expect to be able to use another language within the same utterance, you can add a feature that includes words from the secondary language.

Because the user expects to use the secondary language across any intent or entity, add words from the secondary language to the phrase list. Configure the phrase list as a global feature.

## Best practices

Learn [best practices](luis-concept-best-practices.md).

## Next steps

* [Extend](schema-change-prediction-runtime.md) your app models at prediction runtime.
* See [Add features](luis-how-to-add-features.md) to learn more about how to add features to your LUIS app.
