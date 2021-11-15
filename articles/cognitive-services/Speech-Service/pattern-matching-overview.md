---
title: Pattern Matching overview
titleSuffix: Azure Cognitive Services
description: Pattern Matching with the IntentRecognizer helps you get started quickly with offline intent matching.
author: chschrae
manager: travisw
ms.topic: conceptual
ms.date: 10/13/2020
ms.author: chschrae
keywords: intent recognition pattern matching
---

## Pattern Matching overview

Pattern matching can be customized to group together pattern intents and entities inside a PatternMatchingModel. Using this grouping, it is possible to access more advanced entity types that will help make your intent recognition more precise.

### Patterns vs. Exact Phrases
There are two types of strings used in the pattern matcher: "exact phrases" and "patterns". It is important to understand the differences. 

Exact phrases are a string of the exact words that you will want to match. For example: 

> "Take me to floor seven". 

A pattern is a phrase that contains a marked entity. Entities are marked with "{}" to define the place inside the pattern and the text inside the "{}" references the entity ID. Given the previous example perhaps you would want to extract the floor name in an entity named "floorName". You would do so with a pattern like this:

> "Take me to floor {floorName}"

### Outline of a PatternMatchingModel

The PatternMatchingModel contains an Id to reference that model by, a list of PatternMatchingIntent objects, and a list of PatternMatchingEntity objects.

#### Pattern Matching Intents

PatternMatchingIntent objects represent a collection of phrases that will be used to evaluate utterances in the IntentRecognizer. If the phrases are matched, the IntentRecognitionResult returned will have the Id of the PatternMatchingIntent that was matched.

#### Pattern Matching Entities

PatternMatchingEntity objects represent an individual entity and its corresponding properties that tell the IntentRecognizer how to treat it. All PatternMatchingEntity objects must have an Id that is present in a phrase or else it will never be matched.

### Types of Entities

#### Any Entity

The "Any" entity will match any text that appears in that slot regardless of the text it contains. If we consider our previous example using the pattern "Take me to floor {floorName}", the user might say something like:

> "Take me to the floor parking 2

In this case the "floorName" entity would match "parking 2".

These are lazy matches that will attempt to match as few words as possible unless it appears at the beginning or end of an utterance. Consider the pattern:

> "Take me to the floor {floorName1} {floorName2}"

In this case the utterance "Take me to the floor parking 2" would match and return floorName1 = "parking" and floorName2 = "2".

It may be tricky to handle extra text if it is captured. Perhaps the user kept talking and the utterance captured more than their command. "Take me to floor parking 2 yes Janice I heard about that let's". In this case the floorName1 would be correct, but floorName2 would = "2 yes Janice I heard about that let's". It is important to be aware of the way the Entities will match and adjust to your scenario appropriately. The Any entity type is the most basic and least precise.

#### List Entity

The "List" entity is made up of a list of phrases that will guide the engine on how to match it. The "List" entity has two modes. "Strict" and "Fuzzy".

Let's assume we have a list of floors for our elevator. Since we are dealing with speech, we will add entries for the lexical format as well.

> "1", "2", "3", "lobby", "ground floor", "one", "two", "three"

When an entity with an Id is of type "List" and is in "Strict" mode, the engine will only match if the text in the slot appears in the list.

> "take me to floor one" will match.</br> "take me to floor 5" will not.

It is important to note that the Intent will not match, not just the entity.

When an entity is of type "List" and is in "Fuzzy" mode, the engine will still match the Intent, and will return the text that appeared in the slot in the utterance even if it is not in the list. This is useful behind the scenes to help make the speech recognition better.
>WARNING: THIS FEATURE IS NOT IMPLEMENTED YET.

#### Prebuilt Integer Entity

The "PrebuiltInteger" entity is used when you expect to get an integer in that slot. It will not match the intent if an integer cannot be found. The return value is a string representation of the number.</br>
#### Examples of a valid match and return values:
> "Two thousand one hundred and fifty-five" -> "2155"</br>
"first" -> "1"</br>
"a" -> "1"</br>
"four oh seven one" -> "4071"

If there is text that is not recognizable as a number, the entity and intent will not match.

#### Examples of an invalid match:

> "the third"</br>
"first floor I think" </br>
"second plus three" </br>
"thirty-three and anyways" </br>

Consider our elevator example.

> "Take me to floor {floorName}"

If "floorName" is a prebuilt integer entity the expectation is that whatever text is inside the slot will represent an integer. Here a floor number would match well, but a floor with a name such as "lobby" would not.

### Intent Matching Priority

Sometimes multiple patterns may match the same utterance. In this case the engine will give priority to patterns as follows.

1. Exact Phrases.
2. Patterns with more Entities.
3. Patterns with Integer Entities.
4. Patterns with List Entities.
5. Patterns with Any Entities.
