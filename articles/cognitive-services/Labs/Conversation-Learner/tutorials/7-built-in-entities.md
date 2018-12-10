---
title: How to add Pre-trained Entities to a Conversation Learner Model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to add Pre-trained Entities to a Conversation Learner Model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to add Pre-trained Entities
This tutorial shows how to add Pre-trained Entities to your Conversation Learner Model.

## Video

[![Tutorial 7 Preview](https://aka.ms/cl-tutorial-07-preview)](https://aka.ms/blis-tutorial-07)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

Pre-trained Entities recognize common types of Entities, such as numbers, dates, monetary amounts, and others.  They work "out-of-the-box," do not require any training and their behavior cannot be changed unlike custom entities.  By default, Pre-trained Entities are multi-valued, accumulating every identified instance of the Entity.

## Steps

### Create the Model

1. In the Web UI, click New Model
2. In Name, enter BuiltInEntities. Then click Create.

### Create an Entity

1. Click Entities, then New Entity.
2. Click on EntityType drop-down, and select datetimev2.
	- Programmable and Negatable options are disabled as they do not apply to Pre-trained Entities.
3. Click Create.

![](../media/tutorial7_entities_a.PNG)

### Create two Actions

1. Click Actions, then New Action.
1. In Response, type 'The date is $builtin-datetimev2'.
1. In Required Entities, enter '$builtin-datetimev2'.
1. Click Create.

![](../media/tutorial7_actions_a.PNG)

Then create the second Action:

1. Click Actions, then New Action to create a second action.
1. In Response, type 'What's the date?'.
1. In Disqualifying Entities, enter '$builtin-datetimev2'.
1. Click Create.

![](../media/tutorial7_actions2_a.PNG)

Now you have two Actions.

### Train the Bot

1. Click Train Dialogs, then New Train Dialog.
2. Type 'hello'.
3. Click Score Actions, and Select 'What's the date?'
2. Enter 'today'. 
	- Notice today is tagged, and shows up in the second line since it is a pre-built entity and non-editable.
5. Click Score Actions.
	- Notice the date now appears in Entity Memory section. 
	- If you mouse over the date, you will see the additional data provided by LUIS, which is usable and can further be manipulated in code. 
6. Select 'The date is $builtin-datetimev2'.
7. Click Done Teaching.

## Next steps

> [!div class="nextstepaction"]
> [Alternative inputs](./8-alternative-inputs.md)
