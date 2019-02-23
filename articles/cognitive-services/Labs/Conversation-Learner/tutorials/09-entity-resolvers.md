---
title: Entity Resolvers in a Conversation Learner model - Microsoft Cognitive Services| Microsoft Docs
titleSuffix: Azure
description: Learn how to use Entity Resolvers in Conversation Learner.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# Entity Resolvers

This tutorial shows how to use Entity Resolvers in Conversation Learner

## Video

[![Entity Resolvers Tutorial Preview](https://aka.ms/cl_Tutorial_v3_EntityResolvers_Preview)](https://aka.ms/cl_Tutorial_v3_EntityResolvers)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

- Resolver Type is an optional property of Custom Entities.
- Entity Resolvers utilize the power of the pre-trained entity recognizers in LUIS to provide additional detail and clarity for your Custom Entity.

## Steps

### Create a new Model

1. In the Web UI, click the "New Model" button.
2. In the "Name" field, type "Entity Resolvers", hit enter or click the "Create" button.

### Create a pair of Entities

1. On the left panel, click "Entities", then click the "New Entity" button.
2. In the "Entity Name" field, type "departure".
3. In the "Resolver Type" drop down, select "datetimeV2".
4. Click the "Create" button.
5. Click the "OK" button after you read the information popup.
6. Following the same steps, create another Entity named "return" that also has a "datetimeV2" resolver type.

### Create a pair of Actions

1. On the left panel, click "Actions", then click the "New Action" button.
2. In the "Bot's response" field type, "You are leaving on $departure and returning on $return".
	- IMPORTANT - When typing in "$[entityName]" you need to hit enter or click on the entity in the drop down, otherwise Conversation Learner will consider this to be text instead of an Entity.
	- Notice that the "Required Entities" field will also get these Entities and they cannot be removed. This prevents this action from becoming available until both required Entities are present.
3. Click the "Create" button.
4. Click the "New Action" button again to create a second action.
5. In the "Bot's response" field type, "When are you planning to travel?".
6. In the "Disqualifying Entities" field type, "departure" and also type, "return".
	- These tell our Bot to NOT take this action if either of these Entities contain a value.
7. Click the "Create" button.


### Training

1. Watch the "Training: [Status]" on the upper left part of the page and wait for it to be "Completed".
	- You can click the "Refresh" link if this takes too long.
	- Training status "Completed" is necessary so that our Entity Resolvers work when we train the Model.
2. On the left panel, click "Train Dialogs", then click the "New Train Dialog" button.
3. Type in the first user utterance, "book me a flight". 
4. Click the "Score Actions" button.
5. Select the response, "When are you planning to travel?".
6. As the user, respond with, "leaving tomorrow and returning Sunday next week".
	- Notice how Conversation Learner has detected two "Pre-Trained date" Entities in that user turn.
7. In the "Entity Detection" panel, select the text "tomorrow" and label it as "departure"
8. Also label the text "Sunday next week" as "return"
9. Click the "Score Actions" button.
	- Notice how the "Memory" pane contains your departure and return dates.
	- Hover over each one and observe how the Entities are date objects which clearly capture the actual calandar date as opposed to "Sunday" or "tomorrow".
10. Select the "You are leaving on..." Bot response.
11. Click the "Save" button.

## Next steps

> [!div class="nextstepaction"]
> [Alternative inputs](./10-alternative-inputs.md)
