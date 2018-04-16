---
title: Understanding Patterns.any in LUIS apps in Azure | Microsoft Docs
description: Describes what Patterns.any are in Language Understanding Intelligent Service (LUIS) apps.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/7/2018
ms.author: v-geberr;
---
# Patterns.any in LUIS
Patterns.any is a variable-length placeholder. 

## Patterns.any usage
Patterns.any helps LUIS determine where an entity ends in the utterance. 

## Patterns.any example
If an utterance contains a name or title of a book or movie, the words of the title can be anything including a partial phrase. It can be difficult to know where the book or movie title ends and the next word or entity in the utterances begins. Mark the book or movie title with the {Pattern.any} syntax in order for the pattern to be able to find and return the complete entity.

## Patterns.any boundaries
3 patterns.any per pattern

## Next steps

* Learn more about [entities](luis-concept-entity-types.md), which are important words relevant to intents
* Learn how to [add and manage intents](Add-intents.md) in your LUIS app.
