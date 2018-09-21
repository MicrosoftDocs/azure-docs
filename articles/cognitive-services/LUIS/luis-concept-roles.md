---
title: Understanding how roles are used in pattern-based entities
titleSuffix: Azure Cognitive Services
description: Roles are named, contextual subtypes of an entity used only in patterns. For example, in the utterance buy a ticket from New York to London, both New York and London are cities but each has a different meaning in the sentence. New York is the origin city and London is the destination city.
services: cognitive-services
author: diberry
manager: cjgronlund

ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/10/2018
ms.author: diberry
---
# Entity roles in Patterns are contextual subtypes
Roles are named, contextual subtypes of an entity used only in [patterns](luis-concept-patterns.md).

For example, in the utterance `buy a ticket from New York to London`, both New York and London are cities but each has a different meaning in the sentence. New York is the origin city and London is the destination city. 

Roles give a name to those differences:

|Entity|Role|Purpose|
|--|--|--|
|Location|origin|where the plane leaves from|
|Location|destination|where the plane lands|

## How are roles used in patterns?
In a pattern's template utterance, roles are used within the utterance: 

|Pattern with entity roles|
|--|
|`buy a ticket from {Location:origin} to {Location:destination}`|


## Role syntax in patterns
The entity and role are surrounded in parentheses, `{}`. The entity and the role are separated by a colon. 

## Roles versus Hierarchical entities
Hierarchical entities provide the same contextual information as roles but only to utterances in **intents**. Similarly, roles provide the same contextual information as hierarchical entities but only in **patterns**.

|Contextual learning|Used in|
|--|--|
|hierarchical entities|intents|
|roles|patterns|

## Next steps

* Learn how to add [roles](luis-how-to-add-entities.md#add-role-to-pattern-based-entity)
