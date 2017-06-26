---
title: Understand features in LUIS apps in Azure | Microsoft Docs
description: Learn about features, which help improve a LUIS app's performance. Features include phrase lists and patterns for recognizing regular expressions.
services: cognitive-services
author: DeniseMak
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/23/2017
ms.author: cahann
---
# Features in LUIS

In machine learning, a *feature* is a distinguishing trait or attribute of data that your system observes. 

You add features to a language model, to provide hints about how to recognize input that you want to label or classify. Features help LUIS recognize both intents and entities, but features are not intents or entities themselves. Instead, features might provide examples of related terms, or a pattern to recognize in related terms.  

## Types of features

LUIS offers the following types of features:


| Type          | Description           |
| ------------- |-----------------------|
| Phrase list      | A phrase list includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products). What LUIS learns about one of them is automatically applied to the others as well.<ul><li> The maximum length of a phrase list is 5000 items. You may have a maximum of 10 phrase lists per LUIS app. </li></ul>|
| Pattern      | A pattern specifies a regular expression to help LUIS recognize regular patterns that are frequently used in your application's domain. Some examples are the pattern of flight numbers in a travel app or product codes in a shopping app. | 

## How to use phrase lists
For example, in a travel agent app, you can create a phrase list named "Cities" that contains the values London, Paris, and Cairo. If you label one of these values as an entity, LUIS learns to recognize the others. 

A phrase list may be exchangeable or non-exchangeable. An *exchangeable* phrase list is for values that are synonyms, and a *non-exchangeable* phrase list is intended for values that aren't synonyms but are similar in another way. 

### Use phrase lists for terms that LUIS has difficulty recognizing
Phrase lists are a good way to tune the performance of your LUIS app. If your app has trouble classifying some utterances as the correct intent, or recognizing some entities, think about whether the utterances contain unusual words, or words that might be ambiguous in meaning. These words are good candidates to include in a phrase list feature.

### Use phrase lists for rare, proprietary, and foreign words
LUIS may be unable to recognize rare and proprietary words, as well as foreign words (outside of the culture of the app), and therefore they should be added to a phrase list feature. 
This phrase list should be marked non-exchangeable, to indicate that the set of rare words form a class that LUIS should learn to recognize, but they are not synonyms or exchangeable with each other.

> [!NOTE] 
> A phrase list feature is not an instruction to LUIS to perform strict matching or always label all terms in the phrase list exactly the same. It is simply a hint. For example, you could have a phrase list that indicates that "Patti" and "Selma" are names, but LUIS can still use contextual information to recognize that they mean something different in "make a reservation for 2 at patti's diner for dinner" and "give me driving directions to selma, georgia". 

### When to use phrase lists instead of list entities

 * When you use a phrase list, LUIS can still take context into account and generalize to identify items that are similar to, but not an exact match as items in a list. If you need your LUIS app to be able to generalize and identify new items in a category, it's better to use a phrase list.
 * In contrast, a list entity explicitly defines every value an entity can take, and only identifies values those that match exactly. A list entity may be appropriate for an app in which all instances of an entity are known and don't change often, like the food items on a restaurant menu that changes infrequently. In a system in which you want to be able to recognize new instances of an entity, like a meeting scheduler that should recognize the names of new contacts, or an inventory app that should recognize new products, it's better to use another type of entity and then use phrase list features to help guide LUIS to recognize examples of the entity.


## How to use patterns
The regular expression, or *regex*, in a pattern feature provides a hint to LUIS that helps it see the difference between words that match the regex and words that don't. 

For example, a pattern can help recognize a `KnowledgeBaseArticle` entity if the regex matches the terms in the entity, like the regex `"kb\d+"` for identifying knowledge base article IDs like `kb8732827` or `kb23737`.  In addition, you also need to enter some utterances and label the entity. For example, label the utterance `"look for article kb22716"` so that `"kb22716"` is tagged as a `KnowledgeBaseArticle` entity.

> [!NOTE] 
> A pattern feature is not an instruction to LUIS to perform strict matching or label all terms that match the expression exactly the same. It is simply a hint. For example, if you use a pattern to tell LUIS that airport codes in your travel app consist of three letters, you shouldn't expect (and don't want) LUIS to always label every three-letter word as an airport code.



## Next steps

See [Add Features](Add-Features.md) to learn more about how to add features to your LUIS app.