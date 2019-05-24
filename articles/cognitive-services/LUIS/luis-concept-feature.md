---
title: Features 
titleSuffix: Language Understanding - Azure Cognitive Services
description: Add features to a language model to provide hints about how to recognize input that you want to label or classify.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 04/01/2019
ms.author: diberry
---
# Phrase list features in your LUIS app

In machine learning, a *feature* is a distinguishing trait or attribute of data that your system observes. 

Add features to a language model to provide hints about how to recognize input that you want to label or classify. Features help LUIS recognize both intents and entities, but features are not intents or entities themselves. Instead, features might provide examples of related terms.  

## What is a phrase list feature?
A phrase list is a list of words or phrases that are significant to your app, more so than other words in utterances. A phrase list adds to the vocabulary of the app domain as an additional signal to LUIS about those words. What LUIS learns about one of them is automatically applied to the others as well. This list is not a closed [list entity](luis-concept-entity-types.md#types-of-entities) of exact text matches.

Phrase lists do not help with stemming so you need to add utterance examples that use a variety of stemming for any significant vocabulary words and phrases.

## Phrase lists help all models

Phrase lists are not linked to a specific intent or entity but are added as a significant boost to all the intents and entities. Its purpose is to improve intent detection and entity classification.

## How to use phrase lists

Create a phrase list when your app has words or phrases that are important to the app such as:

* industry terms
* slang
* abbreviations
* company-specific language
* language that is from another language but frequently used in your app
* key words and phrases in your example utterances

Once you've entered a few words or phrases, use the **Recommend** feature to find related values. Review the related values before adding to your phrase list values.

|List type|Purpose|
|--|--|
|Interchangeable|Synonyms or words that, when changed to another word in the list, have the same intent, and entity extraction.|
|Non-interchangeable|App vocabulary, specific to your app, more so than generally other words in that language.|

### Interchangeable lists

An *interchangeable* phrase list is for values that are synonyms. For example, if you want all bodies of water found and you have example utterances such as: 

* What cities are close to the Great Lakes? 
* What road runs along Lake Havasu?
* Where does the Nile start and end? 

Each utterance should be determined for both intent and entities regardless of body of water: 

* What cities are close to [bodyOfWater]?
* What road runs along [bodyOfWater]?
* Where does the [bodyOfWater] start and end? 

Because the words or phrases for the body of water are synonymous and can be used interchangeably in the utterances, use the **Interchangeable** setting on the phrase list. 

### Non-interchangeable lists

A non-interchangeable phrase list is a signal that boosts detection to LUIS. The phrase list indicates words or phrases that are more significant that other words. This helps with both determining intent and entity detection. For example, say you have a subject domain like travel that is global (meaning across cultures but still in a single language). There are words and phrases that are important to the app but are not synonymous. 

For another example, use a non-interchangeable phrase list for rare, proprietary, and foreign words. LUIS may be unable to recognize rare and proprietary words, as well as foreign words (outside of the culture of the app). The non-interchangeable setting indicates that the set of rare words forms a class that LUIS should learn to recognize, but they are not synonyms or interchangeable with each other.

Do not add every possible word or phrase to a phrase list, add a few words or phrases at a time, then retrain and publish. 

As the phrase list grows over time, you may find some terms have many forms (synonyms). Break these out into another phrase list that is interchangeable. 

<a name="phrase-lists-help-identify-simple-exchangeable-entities"></a>

## Phrase lists help identify simple Interchangeable entities
Interchangeable phrase lists are a good way to tune the performance of your LUIS app. If your app has trouble predicting utterances to the correct intent, or recognizing entities, think about whether the utterances contain unusual words, or words that might be ambiguous in meaning. These words are good candidates to include in a phrase list.

## Phrase lists help identify intents by better understanding context
A phrase list is not an instruction to LUIS to perform strict matching or always label all terms in the phrase list exactly the same. It is simply a hint. For example, you could have a phrase list that indicates that "Patti" and "Selma" are names, but LUIS can still use contextual information to recognize that they mean something different in "Make a reservation for 2 at Patti's Diner for dinner" and "Find me driving directions to Selma, Georgia". 

Adding a phrase list is an alternative to adding more example utterances to an intent. 

## When to use phrase lists versus list entities
While both a phrase list and list entities can impact utterances across all intents, each does this in a different way. Use a phrase list to affect intent prediction score. Use a list entity to affect entity extraction for an exact text match. 

### Use a phrase list
With a phrase list, LUIS can still take context into account and generalize to identify items that are similar to, but not an exact match, as items in a list. If you need your LUIS app to be able to generalize and identify new items in a category, use a phrase list. 

When you want to be able to recognize new instances of an entity, like a meeting scheduler that should recognize the names of new contacts, or an inventory app that should recognize new products, use another type of machine-learned entity such as a simple entity. Then create a phrase list of words and phrases that helps LUIS find other words similar to the entity. This list guides LUIS to recognize examples of the entity by adding additional significance to the value of those words. 

Phrase lists are like domain-specific vocabulary that help with enhancing the quality of understanding of both intents and entities. A common usage of a phrase list is proper nouns such as city names. A city name can be several words including hyphens, or apostrophes.
 
### Don't use a phrase list 
A list entity explicitly defines every value an entity can take, and only identifies values that match exactly. A list entity may be appropriate for an app in which all instances of an entity are known and don't change often. Examples are food items on a restaurant menu that changes infrequently. If you need an exact text match of an entity, do not use a phrase list. 

## Best practices
Learn [best practices](luis-concept-best-practices.md).

## Next steps

See [Add Features](luis-how-to-add-features.md) to learn more about how to add features to your LUIS app.
