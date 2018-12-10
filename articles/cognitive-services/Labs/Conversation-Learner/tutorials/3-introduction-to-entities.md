---
title: How to use entities with a Conversation Learner Model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use entities with a Conversation Learner Model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# Introduction to Entities

This tutorial introduces Entities, Disqualifying Entities, Required Entities and their usage within Conversation Learner.

## Video

[![Tutorial 3 Preview](https://aka.ms/cl-tutorial-03-preview)](https://aka.ms/blis-tutorial-03)

## Requirements

This tutorial requires that the general tutorial Bot is running

	npm run tutorial-general

## Details

One key capability of Entities is their ability to hold substrings from user messages (or "utterances").  For example an Entity named "city" stores "Seattle" as extracted from "What's the weather in Seattle?".

A second, powerful capability of Entities is their ability to constrain Actions by being explicitly set as "Required" or "Disqualifying."

- Required Entities must be present in the Model's memory in order for the Action to be available
- Disqualifying Entities must *not* be present in the Model's memory in order for the action to be available

Pre-Trained, Multi-Value, Negatable Entities and Programmatic Entities are covered in other tutorials. Manipulating entities is covered several other tutorials.

## Steps

### Create the Model

1. In the Web UI, click New Model
2. In Name, enter IntroToEntities. Then click Create.

### Create Entity

1. Click Entities, then New Entity.
2. In Entity Name, enter city.
3. Click Create

> [!NOTE]
> The Entity Type is 'Custom' -- this means that the Entity can be trained.  There are also Pre-Trained Entities, meaning that their behavior cannot be adjusted. Pre-Trained Entities are covered in another tutorial.

### Create two Actions

1. Click Actions, then New Action.
2. Enter 'I don't know what city you want' for the Bot's response.
3. In Disqualifying Entities, enter city. Click Save.

Disqualifying this Entity removes this Action from consideration by the Bot if this Entity is defined in Bot's memory.

Now, create a second Action.

2. Click Actions, then New Action.
3. Type 'The weather in the $city is probably sunny' for the Bot's Response.
4. Notice how city Entity has been added automatically in the Required Entities list by reference in the response.
5. Click Save.

Now you have two actions.

![](../media/tutorial3_actions.PNG)

### Train the Model

1. Click Train Dialogs, then New Train Dialog.
2. Type 'hello'.
3. Click Score Actions, and Select 'I don't know what city you want?'
	- The Action where the city Entity is required cannot be selected because the city Entity is not defined in the Model's memory.
2. Select 'I don't know what city you want'.
4. Enter 'Seattle'. Highlight Seattle, then click city from the list of existing Entities.
5. Click Score Actions
	- City value is now in the Model's memory.
	- 'Weather in $city is probably sunny' is now available as a response. 
6. Select the 'Weather in $city is probably sunny' Action.

Imagine the user enters 'repeat that' as they missed the most recent response. So type "repeat that" to mimic the user, then enter. Click Score Action and select the Action that includes the city Entity. Notice the city Entity retains the value Seattle.

![](../media/tutorial3_entities.PNG)

You have now created an Entity and labeled instances of Entities in user utterances.  You've also used the presence/absence of the entity in the Bot's memory to control when Actions are available, via the Action's Disqualifying and Required Entities properties.

## Next steps

> [!div class="nextstepaction"]
> [Expected entity](./4-expected-entity.md)
