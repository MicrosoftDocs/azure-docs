---
title: Roles for entities
titleSuffix: Azure Cognitive Services
description: Roles are named, contextual subtypes of an entity used only in patterns. For example, in the utterance `buy a ticket from New York to London`, both New York and London are cities but each has a different meaning in the sentence. New York is the origin city and London is the destination city.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 12/17/2018
ms.author: diberry
---
# Entity roles in patterns are contextual subtypes
Roles are named, contextual subtypes of an entity used only in [patterns](luis-concept-patterns.md).

For example, in the utterance `buy a ticket from New York to London`, both New York and London are cities but each has a different meaning in the sentence. New York is the origin city and London is the destination city. 

Roles give a name to those differences:

|Entity|Role|Purpose|
|--|--|--|
|Location|origin|where the plane leaves from|
|Location|destination|where the plane lands|
|Prebuilt datetimeV2|to|end date|
|Prebuilt datetimeV2|from|beginning date|

## How are roles used in patterns?
In a pattern's template utterance, roles are used within the utterance: 

|Pattern with entity roles|
|--|
|`buy a ticket from {Location:origin} to {Location:destination}`|


## Role syntax in patterns
The entity and role are surrounded in parentheses, `{}`. The entity and the role are separated by a colon. 


[!INCLUDE [H2 Roles versus hierarchical entities](../../../includes/cognitive-services-luis-hier-roles.md)] 

## Example role for Entities

A role is just a contextually learned placement of an entity within an utterance. It is most effective when the utterance has more than one of that entity type. The easiest example for any entity type is to distinguish between a to and from location. The location can be represented in a lot of different entity types. 

An example use case is transferring an employee from one department to another where each department is an item in a list. For example: 

`Move [PersonName] from [Department:from] to [Department:to]`. 

In the returned prediction, both department entities will be returned in the JSON response and each will include the role name. 

## Roles with prebuilt entities

Use roles with prebuilt entities to give meaning to different instances of the prebuilt entity within an utterance. 

### Roles with datetimeV2

The prebuilt entity, datetimeV2, does a great job of understanding a wide range of variety in dates and times in utterances. You may want to specify dates and date ranges differently than the prebuilt entity's default understanding. 

## Next steps

* Learn how to add [roles](luis-how-to-add-entities.md#add-a-role-to-pattern-based-entity)
