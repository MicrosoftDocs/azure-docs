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
ms.date: 04/01/2019
ms.author: diberry
---
# Entity roles for contextual subtypes

Roles allow entities to have named subtypes. A role can be used with any prebuilt or custom entity type, and used in both example utterances and patterns. 

<a name="example-role-for-entities"></a>
<a name="roles-with-prebuilt-entities"></a>

## Machine-learned entity example of roles

In the utterance "buy a ticket from **New York** to **London**, both New York and London are cities but each has a different meaning in the sentence. New York is the origin city and London is the destination city. 

```
buy a ticket from New York to London
```

Roles give a name to those differences:

|Entity type|Entity name|Role|Purpose|
|--|--|--|--|
|Simple|Location|origin|where the plane leaves from|
|Simple|Location|destination|where the plane lands|

## Non-machine-learned entity example of roles

In the utterance "Schedule the meeting from 8 to 9", both the numbers indicate a time but each time has a different meaning in the utterance. Roles provide the name for the differences. 

```
Schedule the meeting from 8 to 9
```

|Entity type|Role name|Value|
|--|--|--|
|Prebuilt datetimeV2|Starttime|8|
|Prebuilt datetimeV2|Endtime|9|

## Are multiple entities in an utterance the same thing as roles? 

Multiple entities can exist in an utterance and can be extracted without using roles. If the context of the sentence indicates with version of the entity has a value, then a role should be used. 

### Don't use roles for duplicates without meaning

If the utterance includes a list of locations, `I want to travel to Seattle, Cairo, and London.`, this is a list where each item doesn't have an additional meaning. 

### Use roles if duplicates indicate meaning

If the utterance includes a list of locations with meaning, `I want to travel from Seattle, with a layover in Londen, landing in Cairo.`, this meaning of origin, layover, and destination should be captured with roles.

### Roles can indicate order

If the utterance changed to indicate order that you wanted to extract, `I want to first start with Seattle, second London, then third Cairo`, you can extract in a couple of ways. You can tag the tokens that indicate the role, `first start with`, `second`, `third`. You could also use the prebuilt entity **Ordinal** and the **GeographyV2** prebuilt entity in a composite entity to capture the idea of order and place. 

## How are roles used in example utterances?

When an entity has a role, and the entity is marked in an example utterance, you have the choice of selecting just the entity, or selecting the entity and role. 

The following example utterances use entities and roles:

|Token view|Entity view|
|--|--|
|I'm interesting in learning more about **Seattle**|I'm interested in learning more about {Location}|
|Buy a ticket from Seattle to New York|Buy a ticket from {Location:Origin} to {Location:Destination}|

## How are roles used in patterns?
In a pattern's template utterance, roles are used within the utterance: 

|Pattern with entity roles|
|--|
|`buy a ticket from {Location:origin} to {Location:destination}`|


## Role syntax in patterns
The entity and role are surrounded in parentheses, `{}`. The entity and the role are separated by a colon. 

## Entity roles versus collaborator roles

Entity roles apply to the data model of the LUIS app. [Collaborator](luis-concept-collaborator.md) roles apply to levels of authoring access. 

[!INCLUDE [Entity roles in batch testing - currently not supported](../../../includes/cognitive-services-luis-roles-not-supported-in-batch-testing.md)]

## Next steps

* Use a [hands-on tutorial](tutorial-entity-roles.md) using entity roles with non-machine-learned entities
* Learn how to add [roles](luis-how-to-add-entities.md#add-a-role-to-pattern-based-entity)
