---
title: How to add pre-built entities to a Conversation Learner model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to add pre-built entities to a Conversation Learner model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to add pre-built entities
This tutorial shows how to add "pre-built" entities to your Conversation Learner model.

## Video

[![Tutorial 7 Preview](http://aka.ms/cl-tutorial-07-preview)](http://aka.ms/blis-tutorial-07)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

Pre-built entities recognize common types of entities, such as numbers, dates, monetary amounts, and others.  Unlike custom entities, they work "out-of-the-box" and do not require any training.  Unlike custom entities, their behavior cannot be changed.  By default, pre-built entities are multi-valued - that is, the bot's memory will accumulate every identified instance of the entity.

## Steps

### Create the model

1. In the Web UI, click New Model
2. In Name, enter BuiltInEntities. Then click Create.

### Create an entity

1. Click Entities, then New Entity.
2. Click on EntityType drop-down, and select datetimev2.
	- Programmable and Negatable options are disabled, because they do not apply to pre-build entities.
3. Click Create.

![](../media/tutorial7_entities.PNG)

### Create two actions

1. Click Actions, then New Action
2. In Response, type 'The date is $luis-datetimev2'.
3. Click Create.

![](../media/tutorial7_actions.PNG)

Then create the second action:

1. Click Actions, then New Action to create a second action.
3. In Response, type 'What's the date?'.
4. In Disqualifying Entities, enter 'luis-datetimev2'.
4. Click Create

![](../media/tutorial7_actions2.PNG)

Now you have two actions.

### Train the bot

1. Click Train Dialogs, then New Train Dialog.
2. Type 'hello'.
3. Click Score Actions, and Select 'What's the date?'
2. Enter 'today'. 
	- Notice today is tagged, and shows up in the second line since it is a pre-built entity and non-editable.
5. Click Score Actions
	- Notice the date now appears in Entity Memory section. 
	- If you mouse over the date, you will see the additional data provided by LUIS, which is usable and can further be manipulated in code. 
6. Select 'The date is $luis-datetimev2'.
7. Click Done Teaching

## Next steps

> [!div class="nextstepaction"]
> [Alternative inputs](./8-alternative-inputs.md)
