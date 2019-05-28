---
title: How to use the "Expected Entity" property of Conversation Learner Actions - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use the "Expected Entity" property of a Conversation Learner Model.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# How to use the "Expected Entity" property of Actions

This tutorial demonstrates the "Expected Entity" property of Actions.

## Video

[![Expected Entity Tutorial Preview](https://aka.ms/cl_Tutorial_v3_ExpectedEntity_Preview)](https://aka.ms/cl_Tutorial_v3_ExpectedEntity)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details
Use the "Expected Entity" property of an Action to save the user's response to this Action into an Entity.

When adding Entities to the "Expected Entity" property of an Action, the system will:

1. Start by attempting to match Entities using the machine-learning based Entity Extraction Model
2. Assign the whole user utterance to $entity based on heuristics if no Entities are found
3. Call `EntityDetectionCallback`, and proceed to Action selection.

## Steps

### Create the Model

1. In the Web UI, click "New Model."
2. In the "Name" field, type "ExpectedEntities" and hit enter.
3. Click the "Create" button.

### Entity Creation

1. On the left panel, click "Entities", then the "New Entity" button.
2. Select "Custom Trained" for the "Entity Type."
3. Type "name" for the "Entity Name."
4. Click the "Create" button.

> [!NOTE]
> The 'Custom Trained' entity type means this entity can be trained, unlike other types of Entities.

![](../media/tutorial4_entities.PNG)

### Create the First Action

1. On the left panel, click "Actions", then the "New Action" button.
2. In the "Bot's response..." field, type "What's your name?"
3. In the "Expected Entities" field, type "name."
4. Click the "Create" button.

> [!NOTE]
> Entities detected and extracted from the user's response will be saved to the "name" entity if this Action is chosen. If no entities are detected, the entire response will be saved to this entity.

### Create the Second Action

1. On the left panel, click "Actions", then the "New Action" button.
2. In the "Bot's response..." field, type "Hi $name!"
3. Click the "Create" button.

> [!NOTE]
> The "name" Entity was automatically added as a "Required Entities" by reference in the response.

Now you have two actions.

![](../media/tutorial4_actions.PNG)

### Train the Model

1. On the left panel, click "Train Dialogs", then the "New Train Dialog" button.
2. In the chat panel, where it says "Type your message...", type in "hi."
	- This simulates the user's side of the conversation.
3. Click the "Score Actions" button.
4. Select the response, "What's your name?"
	- The "Hi $name!" response cannot be selected as this response requires the "name" Entity to be defined in the Model's memory now.
5. In the chat panel, where it says "Type your message...", type in "Frank."
	- "Frank" is highlighted as an Entity based on the heuristic we set up earlier to save the response as the Entity.
6. Click the "Score Actions" button.
	- The "name" Entity now is defined as "Frank" in the Model's memory, so the "Hello $name" action is selectable as an Action.
7. Select the response, "Hi $name!"
8. Click the "Save" button.

Adding alternative inputs further trains the Model.

1. In the "Add alternative input..." field, type "I'm Jose."
	- The Model does not recognize the name as an Entity so it selects the entire text block as the entity's value
2. Click on the "I'm Jose" phrase, then click the trash can icon.
3. Click on "Jose", then click "name" from the Entity list.
4. Click Score Actions.
5. Select the response, "Hi Frank!"
6. Click the "Save" button.

![](../media/tutorial4_dialogs.PNG)

## Next steps

> [!div class="nextstepaction"]
> [Negatable entities](./06-negatable-entities.md)
