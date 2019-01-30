---
title: How to use Negatable Entities with a Conversation Learner Model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use Negatable Entities with a Conversation Learner Model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
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
The "Negatable" property of an Entity enables you to label both normal (positive) and negative instances of the Entity, teach based on positive and negative models and clear the value of an existing Entity. Entities with their "Negatable" property set are called Negatable Entities in Conversation Leaner.

## Steps

### Create the Model

1. In the Web UI, click "New Model."
2. In the "Name" field, type "NegatableEntity" and hit enter.
3. Click the "Create" button.

### Entity Creation

1. On the left panel, click "Entities", then the "New Entity" button.
2. Select "Custom" for the "Entity Type."
3. Type "name" for the "Entity Name."
4. Check the "Negatable" check-box.
	- Checking this property enables the user to provide an entity value, or say something is *not* an entity value. In the latter case, the result is deletion of the matching entity value.
5. Click the "Create" button.

![](../media/tutorial5_entities.PNG)

### Create the First Action

1. On the left panel, click "Actions", then the "New Action" button.
2. In the "Bot's response..." field, type "I don't know your name."
3. In the "Disqualifying Entitles" field, type "name."
4. Click the "Create" button.

### Create the Second Action

1. On the left panel, click "Actions", then the "New Action" button.
2. In the "Bot's response..." field, type "I know your name. It is $name."
3. Click the "Create" button.

> [!NOTE]
> The "name" Entity was automatically added as a "Required Entities" by reference in the response.

Now you have two actions.

![](../media/tutorial5_actions.PNG)

### Train the Model

1. On the left panel, click "Train Dialogs", then the "New Train Dialog" button.
2. In the chat panel, where it says "Type your message...", type in "hello."
3. Click the "Score Actions" button.
4. Select the response, "I don't know your name."
	- The percentile is 100%, as the only valid Action based on the constraints.
5. In the chat panel, where it says "Type your message...", type in "My name is Frank"
6. Select 'Frank', and choose the label "+name"
	- There are two instances for the "name" Entity: "+name" and "-name".  (+) Plus adds or overwrites the value. (-) Minus removes the value.
7. Click the "Score Actions" button.
	- The "name" Entity now is defined as "Frank" in the Model's memory, so the "I know your name. It is $name" Action is available.
8. Select the response, "I know your name. It is $name."
9. In the chat panel, where it says "Type your message...", type in "My name is not Frank."
10. Select "Frank", and choose the label "-name"
	- We are selecting "-name" to clear the Entity's current value.
11. Click the "Score Actions" button.
12. Select the response, "I don't know your name."
13. In the chat panel, where it says "Type your message...", type in "My name is Susan."
14. Select 'Susan', and choose the label "+name"

![](../media/tutorial5_dialogs.PNG)

## Next steps

> [!div class="nextstepaction"]
> [Multi-value entities](./07-multi-value-entities.md)
