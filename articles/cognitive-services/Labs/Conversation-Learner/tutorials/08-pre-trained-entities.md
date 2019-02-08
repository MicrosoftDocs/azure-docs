---
title: How to add Pre-Trained Entities to a Conversation Learner Model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to add Pre-trained Entities to a Conversation Learner Model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to add Pre-trained Entities
This tutorial shows how to add Pre-Trained Entities to your Conversation Learner Model.

## Video

[![Pre-Trained Entities Tutorial Preview](https://aka.ms/cl_Tutorial_v3_PreTrainedEntities_Preview)](https://aka.ms/cl_Tutorial_v3_PreTrainedEntities)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

Pre-Trained Entities recognize common types of Entities, such as numbers, dates, monetary amounts, and others.  They work "out-of-the-box," do not require any training and their behavior cannot be changed unlike custom entities.  By default, Pre-Trained Entities are multi-valued, accumulating every identified instance of the Entity.

## Steps

### Create the Model

1. In the Web UI, click "New Model."
2. In the "Name" field, type "PretrainedEntities" and hit enter.
3. Click the "Create" button.

### Entity Creation

1. On the left panel, click "Entities", then the "New Entity" button.
2. Select "Pre-Trained/datetimeV2" for the "Entity Type."
3. Check the "Multi-valued" check-box.
	- Multi-value entities accumulate one or more values in the Entity.
	- Negatable properties are disabled for Pre-Trained Entities.
4. Click the "Create" button.

![](../media/tutorial7_entities_a.PNG)

### Create the First Action

1. On the left panel, click "Actions", then the "New Action" button.
2. In the "Bot's response..." field, type "The date is $builtin-datetimev2"
3. Click the "Create" button.

![](../media/tutorial7_actions_a.PNG)

### Create the Second Action

1. On the left panel, click "Actions", then the "New Action" button.
2. In the "Bot's response..." field, type "What's the date?"
	- Pre-Trained entities cannot be Required Entities as they are recognized by default for all user utterances.
3. In the "Disqualifying Entitles" field, type "builtin-datetimev2."
4. Click the "Create" button.

![](../media/tutorial7_actions2_a.PNG)

### Train the Model

1. On the left panel, click "Train Dialogs", then the "New Train Dialog" button.
2. In the chat panel, where it says "Type your message...", type in "hello."
3. Click the "Score Actions" button.
4. Select the response, "What's the date?"
5. In the chat panel, where it says "Type your message...", type in "today"
	- The today utterance is automatically recognized by pre-trained models in LUIS.
	- Hovering over values of Pre-Trained Entities shows additional data provided by LUIS.

## Next steps

> [!div class="nextstepaction"]
> [Entity Resolvers](./09-entity-resolvers.md)
