---
title: Understanding how roles are used in pattern-based entities - Azure| Microsoft Docs
description: Learn how a role is used in an pattern-based entity to give a name to a contextual entity subtype.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/07/2018
ms.author: v-geberr;
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

```
buy a ticket from {Location:origin} to {Location:destination}
```

## Role syntax in patterns
The entity and role are surrounded in parentheses, `{}`. The entity is separated by the role with a colon. 

## Next steps

* Learn more about [entities](luis-concept-entity-types.md), which are important words relevant to intents
* Learn how to [add and manage intents](Add-intents.md) in your LUIS app.
