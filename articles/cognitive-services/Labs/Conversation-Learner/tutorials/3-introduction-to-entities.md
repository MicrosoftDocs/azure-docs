---
title: How to use entities with a Conversation Learner model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use entities with a Conversation Learner model.
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

This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

One key capability of Entities is their ability to hold substrings from user messages (or "utterances").  For example an Entity named "city" stores "Seattle" as extracted from "What's the weather in Seattle?".

A second, powerful capability of Entities is their ability to constrain Actions by being explicitly set as "Required" or "Disqualifying" to Actions:

- Required Entities must be present in the Bot's memory in order for the Action to be available
- Disqualifying Entities must *not* be present in the Bot's memory in order for the action to be available

Pre-built, multi-value, negatable entities and manipulating entities are covered in other tutorials.  Programmatic Entities are introduced in another tutorial.

## Steps

### Create the model

1. In the Web UI, click New Model
2. In Name, enter IntroToEntities. Then click Create.

### Create entity

1. Click Entities, then New Entity.
2. In Entity Name, enter city.
3. Click Create

> [!NOTE]
> The entity type is 'Custom' -- this means that the entity can be trained.  There are also pre-built entities, meaning that their behavior cannot be adjusted -- these are covered in another tutorial.

### Create two actions

1. Click Actions, then New Action
2. In Response, type 'I don't know what city you want'.
3. In Disqualifying Entities, enter $city. Click Save.
	- This means that if this entity is defined in bot's memory, then this action will *not* be available.
2. Click Actions, then New Action to create a second action.
3. In Response, type 'The weather in the $city is probably sunny'.
4. In Required Entities, city entity has been added automatically since it was referred to.
5. Click Save

Now you have two actions.

![](../media/tutorial3_actions.PNG)

### Train the bot

1. Click Train Dialogs, then New Train Dialog.
2. Type 'hello'.
3. Click Score Actions, and Select 'I don't know what city you want?'
	- The response where the city entity is required cannot be selected because the city entity is not defined in bot's memory.
2. Select 'I don't know what city you want'.
4. Enter 'Seattle'. Highlight Seattle, then click city from the list of existing Entities.
5. Click Score Actions
	- City value is now in the bot's memory.
	- 'Weather in $city is probably sunny' is now available as a response. 
6. Select 'Weather in $city is probably sunny'.

Imagine the user enters 'repeat that' as they missed the most recent response. Type "repeat that" to mimic the user, then enter. Click Score Action and select the Action that includes the city Entity. Notice the city Entity retains the value Seattle.

![](../media/tutorial3_entities.PNG)

You have now created an Entity and labeled instances of Entities in user utterances.  You've also used the presence/absence of the entity in the bot's memory to control when actions are available, via the action's disqualifying and required entities fields.

## Next steps

> [!div class="nextstepaction"]
> [Expected entity](./4-expected-entity.md)
