---
title: Pattern Matching overview
titleSuffix: Azure AI services
description: Pattern Matching with the ``IntentRecognizer`` helps you get started quickly with offline intent matching.
author: chschrae
manager: travisw
ms.topic: include
ms.date: 11/15/2021
ms.author: chschrae
keywords: intent recognition pattern matching
---

Pattern matching can be customized to group together pattern intents and entities inside a ``PatternMatchingModel``. Using this grouping, it's possible to access more advanced entity types that help make your intent recognition more precise.

For supported locales, see [here](../language-support.md?tabs=intent-recognition).

## Patterns vs. Exact Phrases

There are two types of strings used in the pattern matcher: "exact phrases" and "patterns". It's important to understand the differences.

Exact phrases are a strings of the exact words that you want to match. For example:

> "Take me to floor seven".

A pattern is a phrase that contains a marked entity. Entities are marked with "{}" to define the place inside the pattern and the text inside the "{}" references the entity ID. Given the previous example perhaps you would want to extract the floor name in an entity named "floorName". You would do so with a pattern like this:

> "Take me to floor {floorName}"

## Outline of a PatternMatchingModel

The ``PatternMatchingModel`` contains an ID to reference that model by, a list of ``PatternMatchingIntent`` objects, and a list of ``PatternMatchingEntity`` objects.

### Pattern Matching Intents

``PatternMatchingIntent`` objects represent a collection of phrases that are used to evaluate speech or text in the ``IntentRecognizer``. If the phrases are matched, then the ``IntentRecognitionResult`` returned will have the ID of the ``PatternMatchingIntent`` that was matched.

### Pattern Matching Entities

``PatternMatchingEntity`` objects represent an individual entity reference and its corresponding properties that tell the ``IntentRecognizer`` how to treat it. All ``PatternMatchingEntity`` objects must have an ID that is present in a phrase or else it will not be matched.

#### Entity Naming restrictions

Entity names containing ':' characters assign a role to an entity. (See below)

## Types of Entities

### Any Entity

The "Any" entity matches any text that appears in that slot regardless of the text it contains. If we consider our previous example using the pattern "Take me to floor {floorName}", the user might say something like:

> "Take me to the floor parking 2

In this case, the "floorName" entity would match "parking 2".

These entities are lazy matches that attempt to match as few words as possible unless it appears at the beginning or end of an utterance. Consider the following pattern:

> "Take me to the floor {floorName1} {floorName2}"

In this case, the utterance "Take me to the floor parking 2" would match and return floorName1 = "parking" and floorName2 = "2".

It may be tricky to handle extra text if it's captured. Perhaps the user kept talking and the utterance captured more than their command. "Take me to floor parking 2 yes Janice I heard about that let's". In this case the floorName1 would be correct, but floorName2 would = "2 yes Janice I heard about that let's". It's important to be aware of the way the Entities match, and adjust your scenario appropriately. The Any entity type is the most basic and least precise type of matching done.

### List Entity

The "List" entity is made up of a list of phrases that guide the engine on how to match it. The "List" entity has two modes. "Strict" and "Fuzzy".

Let's assume we have a list of floors for our elevator. Since we're dealing with speech, we add entries using the lexical format as well.

> "1", "2", "3", "lobby", "ground floor", "one", "two", "three"

When an entity of type ID "List" is used in "Strict" mode, the engine only matches if the text in the slot appears in the list.

> "take me to floor one" will match.

> "take me to floor 5" will not.

It's important to note that the entire Intent will not match, not just the entity.

When an entity of type ID "List" is used in "Fuzzy" mode, the engine still matches the Intent, and will return the text that appeared in the slot in the utterance, even if it's not in the list. This is useful behind the scenes to help make the speech recognition better.

> [!WARNING]
> Fuzzy list entities are implemented, but not integrated into the speech recognition part. Therefore, they will match entities, but not improve speech recognition.

### Prebuilt Integer Entity

The "PrebuiltInteger" entity is used when you expect to get an integer in that slot. It will not match the intent if an integer cannot be found. The return value is a string representation of the number.

### Examples of a valid match and return values

> "Two thousand one hundred and fifty-five" -> "2155"

> "first" -> "1"

> "a" -> "1"

> "four oh seven one" -> "4071"

If there's text that is not recognizable as a number, the entity and intent will not match.

### Examples of an invalid match

> "the third"

> "first floor I think"

> "second plus three"

> "thirty-three and anyways"

Consider our elevator example.

> "Take me to floor {floorName}"

If "floorName" is a prebuilt integer entity, the expectation is that whatever text is inside the slot represents an integer. Here a floor number would match well, but a floor with a name such as "lobby" would not.

## Grouping required and optional items

In the pattern, it is allowed to include words or entities that "might" be present in the utterance. This is especially useful for determiners like "the", "a", or "an". This doesn't have any functional difference from hard coding out the many combinations, but can help reduce the number of patterns needed. Indicate optional items with "[" and "]". Indicate required items with "(" and ")". You may include multiple items in the same group by separating them with a '|' character.

To see how this would reduce the number of patterns needed, consider the following set:

> "Take me to {floorName}"

> "Take me the {floorName}"

> "Take me {floorName}"

> "Take me to {floorName} please"

> "Take me the {floorName} please"

> "Take me {floorName} please"

> "Bring me {floorName} please"

> "Bring me to {floorName} please"

These can all be reduced to a single pattern with grouping and optional items. First, it is possible to group "to" and "the" together as optional words like so: "[to | the]", and second we can make the "please" optional as well. Last, we can group the "bring" and "take" as required.

>"(Bring | Take) me [to | the] {floorName} [please]"

It's also possible to include optional entities. Imagine there are multiple parking levels and you want to match the word before the {floorName}. You could do so with a pattern like this:

>"Take me to [{floorType}] {floorName}"

Optionals are also useful if you might be using keyword recognition and a push-to-talk function. This means sometimes the keyword will be present, and sometimes it won't. Assuming your keyword was "computer" your pattern would look something like this.

>"[Computer] Take me to {floorName}"

> [!NOTE]
> While it's helpful to use optional items, it increases the chances of pattern collisions. This is where two patterns can match the same-spoken phrase. If this occurs, it can sometimes be solved by separating out the optional items into separate patterns.

## Entity roles

Inside the pattern, there may be a scenario where you want to use the same entity multiple times. Consider the scenario of booking a flight from one city to another. In this case the list of cities is the same, but it's necessary to know which city is the user coming from and which city is the destination. To accomplish this, you can use a role assigned to an entity using a ':'.

> "Book a flight from {city:from} to {city:destination}"

Given a pattern like this, there will be two entities in the result labeled "city:from" and "city:destination" but they'll both be referencing the "city" entity for matching purposes.

## Intent Matching Priority

Sometimes multiple patterns may match the same utterance. In this case, the engine gives priority to patterns as follows.

1. Exact Phrases.
2. Patterns with more Entities.
3. Patterns with Integer Entities.
4. Patterns with List Entities.
5. Patterns with Any Entities.
6. Patterns with more bytes matched.
    - Example: Pattern "click {something} on the left" will be higher priority than "click {something}".

## Next steps

* Start with [simple pattern matching](../how-to-use-simple-language-pattern-matching.md).
* Improve your pattern matching by using [custom entities](../how-to-use-custom-entity-pattern-matching.md).
* Look through our [GitHub samples](https://github.com/Azure-Samples/cognitive-services-speech-sdk).
