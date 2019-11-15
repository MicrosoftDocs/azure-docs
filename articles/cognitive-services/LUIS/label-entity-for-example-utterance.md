---
title: Label entity example utterance
titleSuffix: Azure Cognitive Services
description: Learn how to label a machine-learned entity with subcomponents in an example utterance in an intent detail page of the LUIS portal. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 11/15/2019
ms.author: diberry
#Customer intent: As a new user, I want to label a machine-learned entity in an example utterance. 
---

# Label machine-learned entity in an example utterance

Labeling an entity in an example utterance shows LUIS has an example of the entity is and where the entity can appear in the utterance. 

## Which words to label

Label all words that may indicate an entity, even if the words are not used when extracted in the client application. 

Consider a pizza app with an intent for the pizza order. The example utterances most likely already have the word `pizza`, for example, `Pick up a cheese pizza in 20 minutes`. 

When creating the entity to represent the _entire_ pizza order 

Label is differen