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
ms.date: 03/12/2019
ms.author: diberry
---
# Entity roles for contextual subtypes

Roles allow entities to have named subtypes. A role can be used with any prebuilt or custom entity type, and used in both example utterances and patterns. 

<a name="example-role-for-entities"></a>
<a name="roles-with-prebuilt-entities"></a>

## Simple entity example of roles

In the utterance "buy a ticket from **New York** to **London**, both New York and London are cities but each has a different meaning in the sentence. New York is the origin city and London is the destination city. 

```
buy a ticket from New York to London
```

Roles give a name to those differences:

|Entity type|Entity name|Role|Purpose|
|--|--|--|--|
|Simple|Location|origin|where the plane leaves from|
|Simple|Location|destination|where the plane lands|

## Prebuilt entity example of roles

In the utterance "Schedule the meeting from 8 to 9", both the numbers indicate a time but each time has a different meaning in the utterance. Roles provide the name for the differences. 

```
Schedule the meeting from 8 to 9
```

|Entity type|Role name|Value|
|--|--|--|
|Prebuilt datetimeV2|Starttime|8|
|Prebuilt datetimeV2|Endtime|9|

## How are roles used in example utterances?

When an entity has a role, and the entity is marked in an example utterance, you have the choice of selecting just the entity, or selecting the entity and role. 

The following example utterances use entities and roles:

|Token view|Entity view|
|--|--|
|I'm interesting in learning more about **Seattle**|I'm interested in learning more about {Location}|
|Buy a ticket from Seattle to New York|Buy a ticket from {Location:Origin} to {Location:Destination}|

## How are roles related to hierarchical entities?

Roles are now available for all entities in example utterances, as well as the previous use of patterns. Because they are available everywhere, they replace the need for hierarchical entities. New entities should be created with roles, instead of using hierarchical entities. 

Hierarchical entities will eventually be deprecated.

## How are roles used in patterns?
In a pattern's template utterance, roles are used within the utterance: 

|Pattern with entity roles|
|--|
|`buy a ticket from {Location:origin} to {Location:destination}`|


## Role syntax in patterns
The entity and role are surrounded in parentheses, `{}`. The entity and the role are separated by a colon. 

## Entity roles versus collaborator roles

Entity roles apply to the data model of the LUIS app. [Collaborator](luis-concept-collaborator.md) roles apply to levels of authoring access. 

## Next steps

* Learn how to add [roles](luis-how-to-add-entities.md#add-a-role-to-pattern-based-entity)
