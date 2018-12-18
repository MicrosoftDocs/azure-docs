---
title: How to use the "Expected Entity" property of Conversation Learner Actions - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use the "Expected Entity" property of a Conversation Learner Model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
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

1. In the Web UI, click New Model
2. In Name, enter ExpectedEntities. Then click Create.

### Create an Entity

1. Click Entities, then New Entity.
2. In Entity Name, enter name.
3. Click Create

> [!NOTE]
> The Entity type is 'Custom'. This value means that the Entity can be trained.  There are also Pre-Trained Entities, meaning that their behavior cannot be adjusted.  These Entities are covered in the [Pre-Trained Entities tutorial](./7-built-in-entities.md).

![](../media/tutorial4_entities.PNG)

### Create two Actions

1. Click Actions, then New Action.
2. In Response, type 'What's your name?'
3. In Expected Entities, enter "name". Click Create.
	- This saves the user's response to $name if this Action is chosen. If no Entities are detected in the response, the Bot saves the entire response into $name.
	- And automatically adds the Entity to the list of Disqualifying Entities. 

Now create a second Action.

1. Click Actions, then New Action.
2. Type 'Hi $name' for the response. Notice the Entity is automatically added as a Required Entity.
4. Click Create.

Now you have two actions.

![](../media/tutorial4_actions.PNG)

### Train the Model

1. Click Train Dialogs, then New Train Dialog.
2. Type 'hi'.
3. Click Score Actions, and Select 'What's your name?'
	- The response 'Hi $name!' cannot be selected, because it requires the Entity $name to be defined, and $name is not in the Model's memory.
2. Enter 'Frank'. 
	- The name is highlighted as an Entity due to the heuristic we set up earlier to select the response as the Entity.
5. Click Score Actions
	- The name value is now in the Model's memory.
	- 'Hello $name' is now available as a response. 
6. Select 'Hi Frank!'.

Here is a second example, based on alternative input that engages the heuristics to further train the Model.

1. Enter "I'm Jose" as alternative input. Note the Model does not recognize the name as an Entity so it selects the entire text block
2. Highlight the full "I'm Jose" text block and click the Delete icon to undo the Model's heuristics selection.
3. Highlight just "Jose" and click "name" from the Entity list.
3. Click Score Actions.
4. Select the "Hi Frank!" response.

![](../media/tutorial4_dialogs.PNG)

## Next steps

> [!div class="nextstepaction"]
> [Negatable entities](./5-negatable-entities.md)
