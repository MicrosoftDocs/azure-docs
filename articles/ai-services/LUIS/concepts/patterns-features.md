---
title: Patterns and features
titleSuffix: Azure AI services
description: Use this article to learn about patterns and features in LUIS
#services: cognitive-services
ms.author: aahi
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.subservice: azure-ai-luis
ms.topic: conceptual
ms.date: 07/19/2022

---

# Patterns in LUIS apps

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


Patterns are designed to improve accuracy when multiple utterances are very similar. A pattern allows you to gain more accuracy for an intent without providing several more utterances.

## Patterns solve low intent confidence

Consider a Human Resources app that reports on the organizational chart in relation to an employee. Given an employee's name and relationship, LUIS returns the employees involved. Consider an employee, Tom, with a manager named Alice, and a team of subordinates named: Michael, Rebecca, and Carl.

:::image type="content" source="../media/luis-concept-patterns/chart.png" alt-text="A screenshot showing use of patterns" lightbox="../media/luis-concept-patterns/chart.png":::


| Utterances | Intent predicted | Intent score |
|--|--|--|
| Who is Tom's subordinate? | GetOrgChart | 0.30 |
| Who is the subordinate of Tom? | GetOrgChart | 0.30 |

If an app has between 10 and 20 utterances with different lengths of sentence, different word order, and even different words (synonyms of "subordinate", "manage", "report"), LUIS may return a low confidence score. Create a pattern to help LUIS understand the importance of the word order.

Patterns solve the following situations:

* The intent score is low
* The correct intent is not the top score but too close to the top score.

## Patterns are not a guarantee of intent

Patterns use a mix of prediction techniques. Setting an intent for a template utterance in a pattern is not a guarantee of the intent prediction, but it is a strong signal.

## Patterns do not improve machine-learning entity detection

A pattern is primarily meant to help the prediction of intents and roles. The "_pattern.any"_ entity is used to extract free-form entities. While patterns use entities, a pattern does not help detect a machine-learning entity.

Do not expect to see improved entity prediction if you collapse multiple utterances into a single pattern. For simple entities to be utilized by your app, you need to add utterances or use list entities.

## Patterns use entity roles

If two or more entities in a pattern are contextually related, patterns use entity [roles](entities.md) to extract contextual information about entities.

## Prediction scores with and without patterns

Given enough example utterances, LUIS can be able to increase prediction confidence without patterns. Patterns increase the confidence score without having to provide as many utterances.

## Pattern matching

A pattern is matched by detecting the entities inside the pattern first, then validating the rest of the words and word order of the pattern. Entities are required in the pattern for a pattern to match. The pattern is applied at the token level, not the character level.

## Pattern.any entity

The pattern.any entity allows you to find free-form data where the wording of the entity makes it difficult to determine the end of the entity from the rest of the utterance.

For example, consider a Human Resources app that helps employees find company documents. This app might need to understand the following example utterances.

* "_Where is  **HRF-123456**?_"
* "_Who authored  **HRF-123234**?_"
* "_Is **HRF-456098** published in French?_"

However, each document has both a formatted name (used in the above list), and a human-readable name, such as Request relocation from employee new to the company 2018 version 5.

Utterances with the human-readable name might look like:

* "_Where is  **Request relocation from employee new to the company 2018 version 5**?_"
* _"Who authored  **"Request relocation from employee new to the company 2018 version 5"**?_"
* _Is **Request relocation from employee new to the company 2018 version 5**  is published in French?_"

The utterances include words that may confuse LUIS about where the entity ends. Using a Pattern.any entity in a pattern allows you to specify the beginning and end of the document name, so LUIS correctly extracts the form name. For example, the following template utterances:

* Where is {FormName}[?] 
* Who authored {FormName}[?] 
* Is {FormName} is published in French[?] 

## Best practices for Patterns:

#### Do add patterns in later iterations

You should understand how the app behaves before adding patterns because patterns are weighted more heavily than example utterances and will skew confidence.

Once you understand how your app behaves, add patterns as they apply to your app. You do not need to add them  each time you iterate on the app's design.

There is no harm in adding them in the beginning of your model design, but it is easier to see how each pattern changes the model after the model is tested with utterances.

#### Don't add many patterns

Don't add too many patterns. LUIS is meant to learn quickly with fewer examples. Don't overload the system unnecessarily.

## Features

In machine learning, a _feature_ is a distinguishing trait or attribute of data that your system observes and learns through.

Machine-learning features give LUIS important cues for where to look for things that distinguish a concept. They're hints that LUIS can use, but they aren't hard rules. LUIS uses these hints with the labels to find the data.

A feature can be described as a function, like `f(x) = y`. In the example utterance, the feature tells you where to look for the distinguishing trait. Use this information to help create your schema.

## Types of features

Features are a necessary part of your schema design. LUIS supports both phrase lists and models as features:

* Phrase list feature
* Model (intent or entity) as a feature

## Find features in your example utterances

Because LUIS is a language-based application, the features are text-based. Choose text that indicates the trait you want to distinguish. For LUIS, the smallest unit is the _token_. For the English language, a token is a contiguous span of letters and numbers that has no spaces or punctuation.

Because spaces and punctuation aren't tokens, focus on the text clues that you can use as features. Remember to include variations of words, such as:

* Plural forms
* Verb tenses
* Abbreviations
* Spellings and misspellings

Determine if the text needs the following because it distinguishes a trait:

* Match an exact word or phrase: Consider adding a regular expression entity or a list entity as a feature to the entity or intent.
* Match a well-known concept like dates, times, or people's names: Use a prebuilt entity as a feature to the entity or intent.
* Learn new examples over time: Use a phrase list of some examples of the concept as a feature to the entity or intent.

## Create a phrase list for a concept

A phrase list is a list of words or phrases that describe a concept. A phrase list is applied as a case-insensitive match at the token level.

When adding a phrase list, you can set the feature to [**global**](#global-features). A global feature applies to the entire app.

## When to use a phrase list

Use a phrase list when you need your LUIS app to generalize and identify new items for the concept. Phrase lists are like domain-specific vocabulary. They enhance the quality of understanding for intents and entities.

## How to use a phrase list

With a phrase list, LUIS considers context and generalizes to identify items that are similar to, but aren't, an exact text match. Follow these steps to use a phrase list:

1. Start with a machine-learning entity:
  1. Add example utterances.
  2. Label with a machine-learning entity.
2. Add a phrase list:
  1. Add words with similar meaning. Don't add every possible word or phrase. Instead, add a few words or phrases at a time. Then retrain and publish.
  2. Review and add suggested words.

## A typical scenario for a phrase list

A typical scenario for a phrase list is to boost words related to a specific idea.

Medical terms are a good example of words that might need a phrase list to boost their significance. These terms can have specific physical, chemical, therapeutic, or abstract meanings. LUIS won't know the terms are important to your subject domain without a phrase list.

For example, to extract the medical terms:

1. Create example utterances and label medical terms within those utterances.
2. Create a phrase list with examples of the terms within the subject domain. This phrase list should include the actual term you labeled and other terms that describe the same concept.
3. Add the phrase list to the entity or subentity that extracts the concept used in the phrase list. The most common scenario is a component (child) of a machine-learning entity. If the phrase list should be applied across all intents or entities, mark the phrase list as a global phrase list. The  **enabledForAllModels**  flag controls this model scope in the API.

## Token matches for a phrase list

A phrase list always applies at the token level. The following table shows how a phrase list that has the word  **Ann**  applies to variations of the same characters in that order.

| Token variation of "Ann" | Phrase list match when the token is found |
|--|--|
| **ANN** <br> **aNN** | Yes - token is  **Ann** |
| **Ann's** | Yes - token is  **Ann** |
| **Anne** | No - token is  **Anne** |

## A model as a feature helps another model

You can add a model (intent or entity) as a feature to another model (intent or entity). By adding an existing intent or entity as a feature, you're adding a well-defined concept that has labeled examples.

When adding a model as a feature, you can set the feature as:

* [**Required**](#required-features). A required feature must be found for the model to be returned from the prediction endpoint.
* [**Global**](#global-features). A global feature applies to the entire app.

## When to use an entity as a feature to an intent

Add an entity as a feature to an intent when the detection of that entity is significant for the intent.

For example, if the intent is for booking a flight, like  **BookFlight** , and the entity is ticket information (such as the number of seats, origin, and destination), then finding the ticket-information entity should add significant weight to the prediction of the  **BookFlight**  intent.

## When to use an entity as a feature to another entity

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

## Required feature using prebuilt entities

Prebuilt entities such as city, state, and country/region are generally a closed set of lists, meaning they don't change much over time. These entities could have the relevant recommended features and those features could be marked as required. However, the isRequired flag is only related to the entity it is assigned to and doesn't affect the hierarchy. If the prebuilt sub-entity feature is not found, this will not affect the detection and return of the parent entity.

As an example of a required feature, consider you want to detect addresses. You might consider making a street number a requirement. This would allow a user to enter "1 Microsoft Way" or "One Microsoft Way", and both would resolve to the numeral "1" for the street number sub-entity. See the [prebuilt entity](../luis-reference-prebuilt-entities.md)article for more information.

## Required feature using list entities

A [list entity](../reference-entity-list.md) is used as a list of canonical names along with their synonyms. As a required feature, if the utterance doesn't include either the canonical name or a synonym, then the entity isn't returned as part of the prediction endpoint.

Suppose that your company only ships to a limited set of countries/regions. You can create a list entity that includes several ways for your customer to reference the country/region. If LUIS doesn't find an exact match within the text of the utterance, then the entity (that has the required feature of the list entity) isn't returned in the prediction.

| Canonical name** | Synonyms |
|--|--|
| United States | U.S.<br> U.S.A <br> US <br> USA <br> 0 |

A client application, such as a chat bot, can ask a follow-up question to help. This helps the customer understand that the country/region selection is limited and _required_.

## Required feature using regular expression entities

A [regular expression entity](../reference-entity-regular-expression.md) that's used as a required feature provides rich text-matching capabilities.

In the shipping address example, you can create a regular expression that captures syntax rules of the country/region postal codes.

## Global features

While the most common use is to apply a feature to a specific model, you can configure the feature as a  **global feature**  to apply it to your entire application.

The most common use for a global feature is to add an additional vocabulary to the app. For example, if your customers use a primary language, but expect to be able to use another language within the same utterance, you can add a feature that includes words from the secondary language.

Because the user expects to use the secondary language across any intent or entity, add words from the secondary language to the phrase list. Configure the phrase list as a global feature.

## Combine features for added benefit

You can use more than one feature to describe a trait or concept. A common pairing is to use:

* A phrase list feature: You can use multiple phrase lists as features to the same model.
* A model as a feature: [prebuilt entity](../luis-reference-prebuilt-entities.md), [regular expression entity](../reference-entity-regular-expression.md), [list entity](../reference-entity-list.md).

## Example: ticket-booking entity features for a travel app

As a basic example, consider an app for booking a flight with a flight-reservation _intent_ and a ticket-booking _entity_. The ticket-booking entity captures the information to book an airplane ticket in a reservation system.

The machine-learning entity for ticket-book has two subentities to capture origin and destination. The features need to be added to each subentity, not the top-level entity.

:::image type="content" source="../media/luis-concept-patterns/ticket-booking-example.png" alt-text="A screenshot showing example entities for a ticket booking application." lightbox="../media/luis-concept-patterns/ticket-booking-example.png":::

The ticket-booking entity is a machine-learning entity, with subentities including _Origin_ and _Destination_. These subentities both indicate a geographical location. To help extract the locations, and distinguish between _Origin_ and _Destination_, each subentity should have features.

| Type | Origin subentity | Destination subentity |
|--|--|--|
| Model as a feature | [geographyV2](../luis-reference-prebuilt-geographyv2.md) prebuilt entity | [geographyV2](../luis-reference-prebuilt-geographyv2.md) prebuilt entity |
| Phrase list | **Origin words** : start at, begin from, leave | **Destination words** : to, arrive, land at, go, going, stay, heading |
| Phrase list | Airport codes - same list for both origin and destination | Airport codes - same list for both origin and destination |
| Phrase list | Airport names - same list for both origin and destination | Airport codes - same list for both origin and destination |


If you anticipate that people use airport codes and airport names, then LUIS should have phrase lists that use both types of phrases. Airport codes may be more common with text entered in a chatbot while airport names may be more common with spoken conversation such as a speech-enabled chatbot.

The matching details of the features are returned only for models, not for phrase lists because only models are returned in prediction JSON.

## Ticket-booking labeling in the intent

After you create the machine-learning entity, you need to add example utterances to an intent, and label the parent entity and all subentities.

For the ticket booking example, Label the example utterances in the intent with the TicketBooking entity and any subentities in the text.

:::image type="content" source="../media/luis-concept-patterns/ticket-booking-labeling.png" alt-text="A screenshot showing labeling for an example utterance." lightbox="../media/luis-concept-patterns/ticket-booking-labeling.png":::


## Example: pizza ordering app

For a second example, consider an app for a pizza restaurant, which receives pizza orders including the details of the type of pizza someone is ordering. Each detail of the pizza should be extracted, if possible, in order to complete the order processing.

The machine-learning entity in this example is more complex with nested subentities, phrase lists, prebuilt entities, and custom entities.

:::image type="content" source="../media/luis-concept-patterns/pizza-example-machine-learning-entity.png" alt-text="A screenshot showing a machine learning entity with different subentities." lightbox="../media/luis-concept-patterns/pizza-example-machine-learning-entity.png":::

This example uses features at the subentity level and child of subentity level. Which level gets what kind of phrase list or model as a feature is an important part of your entity design.

While subentities can have many phrase lists as features that help detect the entity, each subentity has only one model as a feature. In this [pizza app](https://github.com/Azure/pizza_luis_bot/blob/master/CognitiveModels/MicrosoftPizza.json), those models are primarily lists.

:::image type="content" source="../media/luis-concept-patterns/pizza-example-example-phrase-lists.png" alt-text="A screenshot showing a machine learning entity many phrase lists as features." lightbox="../media/luis-concept-patterns/pizza-example-example-phrase-lists.png":::

The correctly labeled example utterances display in a way to show how the entities are nested.

## Next steps

* [LUIS application design](application-design.md)
* [prebuilt models](../luis-concept-prebuilt-model.md)
* [intents](intents.md)
* [entities](entities.md).
