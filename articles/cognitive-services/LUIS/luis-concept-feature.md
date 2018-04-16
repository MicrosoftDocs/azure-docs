---
title: Understand features in LUIS apps in Azure | Microsoft Docs
description: Learn about features, which help improve a LUIS app's performance. Features include phrase lists and patterns for recognizing regular expressions.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 02/09/2018
ms.author: v-geberr;
---
# Phrase list features in LUIS

In machine learning, a *feature* is a distinguishing trait or attribute of data that your system observes. 

You add features to a language model, to provide hints about how to recognize input that you want to label or classify. Features help LUIS recognize both intents and entities, but features are not intents or entities themselves. Instead, features might provide examples of related terms.  

## What is a phrase list feature?

LUIS offers the following type of features:


| Type          | Description           |
| ------------- |-----------------------|
| Phrase list      | A phrase list includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products). What LUIS learns about one of them is automatically applied to the others as well. This is not a white list of matched words.|


## How to use phrase lists
For example, in a travel agent app, you can create a phrase list named "Cities" that contains the values London, Paris, and Cairo. If you label one of these values as an entity, LUIS learns to recognize the others. 

A phrase list may be interchangeable or non-interchangeable. An *interchangeable* phrase list is for values that are synonyms, and a *non-interchangeable* phrase list is intended for values that aren't synonyms but are similar in another way. 

### Use phrase lists for terms that LUIS has difficulty recognizing
Phrase lists are a good way to tune the performance of your LUIS app. If your app has trouble classifying some utterances as the correct intent, or recognizing some entities, think about whether the utterances contain unusual words, or words that might be ambiguous in meaning. These words are good candidates to include in a phrase list feature.

### Use phrase lists for rare, proprietary, and foreign words
LUIS may be unable to recognize rare and proprietary words, as well as foreign words (outside of the culture of the app), and therefore they should be added to a phrase list feature. 
This phrase list should be marked non-interchangeable, to indicate that the set of rare words form a class that LUIS should learn to recognize, but they are not synonyms or interchangeable with each other.

> [!NOTE] 
> A phrase list feature is not an instruction to LUIS to perform strict matching or always label all terms in the phrase list exactly the same. It is simply a hint. For example, you could have a phrase list that indicates that "Patti" and "Selma" are names, but LUIS can still use contextual information to recognize that they mean something different in "make a reservation for 2 at patti's diner for dinner" and "give me driving directions to selma, georgia". 

### When to use phrase lists instead of list entities

 * With a phrase list, LUIS can still take context into account and generalize to identify items that are similar to, but not an exact match, as items in a list. If you need your LUIS app to be able to generalize and identify new items in a category, it's better to use a phrase list. When you want to be able to recognize new instances of an entity, like a meeting scheduler that should recognize the names of new contacts, or an inventory app that should recognize new products, use another type of machine learned entity such as a simple or hierarchical entity. Then create a phrase list of words and phrases. This list guides LUIS to recognize examples of the entity by adding additional significance to the value of those words.
 * A list entity explicitly defines every value an entity can take, and only identifies values that match exactly. A list entity may be appropriate for an app in which all instances of an entity are known and don't change often, like the food items on a restaurant menu that changes infrequently. 

## Best practice
After the model's first iteration, add a phrase list feature that has domain-specific words and phrases. This feature helps LUIS adapt to the domain-specific vocabulary, and learn it fast.

## Next steps

See [Add Features](Add-Features.md) to learn more about how to add features to your LUIS app.