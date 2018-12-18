---
title: How to use Negatable Entities with a Conversation Learner Model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use Negatable Entities with a Conversation Learner Model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to use Negatable Entities with a Conversation Learner Model

This tutorial demonstrates the "Negatable" property of Entities.

## Video

[![Negatable Entities Tutorial Preview](https://aka.ms/cl_Tutorial_v3_NegatableEntities_Preview)](https://aka.ms/cl_Tutorial_v3_NegatableEntities)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details
Mark an Action as "Negatable" if the user can "clear" an Entity value, as in "No, I do not want $entity" or "no, not $entity." For example, "No, I do not want to leave from Boston."

The "Negatable" property of an Entity:

- Enables you to label both normal (positive) and a "negative" instances of the entity
- Teach LUIS both positive and negative entity Models
- Enables you to clear the value of an existing Entity

## Steps

### Create the Model

1. In the Web UI, click New Model
2. In Name, enter NegatableEntity. Then click Create.

### Create an Entity

1. Click Entities, then New Entity.
2. In Entity Name, enter name.
3. Check Negatable.
	- This property indicates the user will be able to provide a value for the entity, or say something is *not* the value of the entity. In the latter case, this will result in deleting a matching value of the entity.
3. Click Create.

![](../media/tutorial5_entities.PNG)

### Create two Actions

1. Click Actions, then New Action.
2. Type 'I don't know your name' for the Bot's Response. 
3. In Disqualifying Entities, enter name.
3. Click Create.

Then create the second action.

1. Click Actions, then New Action to create a second action.
3. Type 'I know your name. It is $name' for the Bot's Response.
4. Click Create.

Now you have two actions.

![](../media/tutorial5_actions.PNG)

### Train the Bot

1. Click Train Dialogs, then New Train Dialog.
2. Type 'hello'.
3. Click Score Actions, and Select 'I don't know your name'
	- The score is 100% because it is the only valid action.
2. Enter 'my name is Frank'
3. Select 'Frank', and choose the label '+name'
	- There are two instances of 'name': '+name' and '-name'.  (+) Plus adds or overwrites the value. (-) Minus removes the value.
5. Click Score Actions.
	- The name value is now in the Bot's memory.
	- 'I know your name. It is $name' is the only available response. 
6. Select 'I know your name. It is $name'.

Let's try clearing the negatable entity:

1. Enter 'my name is not Frank'.
	- Notice 'not' is selected as name based on the previous pattern. This label is incorrect.
2. Click on '-name'. 
3. Click Score Actions.
4. Click 'I don't know your name" from the listed responses.
5. Type 'my name is susan'.
	- This is now a Negative Entity communicating that this is not the value of the name Entity.
6. Click Score Actions.
7. Select 'I know your name. It is $name'.

![](../media/tutorial5_dialogs.PNG)

## Next steps

> [!div class="nextstepaction"]
> [Multi-value entities](./6-multi-value-entities.md)
