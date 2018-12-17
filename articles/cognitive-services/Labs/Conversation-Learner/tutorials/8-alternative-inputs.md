---
title: How to use alternative inputs with Conversation Learner - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use alternative inputs with Conversation Learner.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to use alternative inputs

This tutorial shows how to use the Alternative Inputs field for user utterances in the teaching interface.

## Video

[![Tutorial 8 Preview](https://aka.ms/cl-tutorial-08-preview)](https://aka.ms/blis-tutorial-08)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details
Alternative inputs are alternate user utterances which the user might have said at a particular point in a training dialog. These alternative inputs allow you to more compactly specify variations of utterances, without having to address each variation in a separate training dialog.

## Steps

### Create the model

1. In the Web UI, click New Model
2. Name this model AlternativeInputs.
3. Click Create.

### Create an entity

1. Click Entities, then New Entity.
2. In Entity Name, enter city.
3. Click Create.

### Create three actions

1. Click Actions, then New Action.
2. In Response, type 'Which city?'.
3. Add city to both the Expected Entity and Disqualifying Entities lists.
3. Click Create.

Then create the second action:

1. Click Actions, then New Action.
2. Type 'The weather in $city is probably sunny.' for the response.
3. Click Create.

Create the third action:

1. Click Actions, then New Action.
2. Type 'Try asking for the weather.' for the response.
	- In case the user ask 'what can the system do?'
3. Add city to the list of Disqualifying Entities.
4. Click Create.

You now have three actions.

### Train the bot

1. Click Train Dialogs, then New Train Dialog.
2. Type 'what's the weather' in the chat window.
3. Click Score Actions to select the best response. Select the response for 'which city?'
4. Enter 'Denver' in the chat window.
5. Double-click on 'Denver', and select 'city' to set Denver as an entity type of city.
6. Click Score Actions.
7. Select 'The weather in $city is probably sunny' as the best response for Denver now.
8. Click Save.

Let's train the model more by creating another train dialog.

1. Click Train Dialogs, then New Train Dialog.
2. Type 'what can you do?' as the user's utterance in the the chat prompt.
3. Click Score Actions, then select 'Try asking for the weather' for the bot's response.
4. Enter 'What's the weather in Seattle?' for the user's next utterance.
5. Double-click on 'Seattle' to mark Seattle as an entity of type city. Seattle is now shown in bot's memory.
6. Click Score Actions.
7. Today is a sunny day in Seattle so select 'The weather in $city is probably sunny' as the response.
8. Click Save.

Let's create one more train dialog the model to illustrate where the alternative inputs are helpful in tuning the model for equivalent user utterances.

1. Click Train Dialogs, then New Train Dialog.
2. Type 'help' for the user's utterance.
3. Click Score Actions to see the array of available responses. The model will choose the highest percentile action if the system is left in its current state.
4. Click Abandon Teaching and Confirm.

![](../media/tutorial8_closescores.png)

Let's better tune the system using alternative inputs. You can add alternative input while teaching or later.

1. Click Train Dialogs and select the first, 'What can you do?' Train Dialog we created earlier in this tutorial.
2. In the Train Dialog, click on 'what can you do?' in the UI to select it.
3. Locate the "Add alternative input..." field midway down the UI.
4. Add the following example utterances, one by one, clicking Add between each different utterance:
	1. Enter 'Tell me my choices'.
	2. Enter 'What are my choices?'
	3. Enter 'help'
5. Click Submit Changes.

The system uses these added alternative inputs to better tune itself and know to follow the same path in this dialog when presented with alternative, yet equivalent user utterances.

Let's add another alternative input to handle Houston.

![](../media/tutorial8_helpalternates.png)

1. Click the utterance asking 'what's the weather in Seattle?'
2. Type "forecast for Houston" as the alternative input.  Conversation Learner displays an error as alternative inputs must be semantically equivalent and contain the same entities as the original utterance; not just the same values of entities. The presence of the same entities is required.
3. Double-click on 'Houston' and select city for the entity.
4. Enter 'forecast for Seattle' as another alternative input. Resolve the error by double-clicking Seattle and selecting city for the entity.
5. click Submit Changes, then Save.

Time to try the model out using a Log Dialog.

1. Click Log Dialogs, then New Log Dialog.
2. Enter 'help me' for the user utterance.
3. The bot responds more accurately and appropriately thanks to the alternative inputs.
4. Enter 'forecast for Denver' and the bot responds accordingly.

![](../media/tutorial8_altcities.png)

In summary, alternative inputs can be used to tune models to better process semantically equivalent utterances without having to create many different Training Dialogs.

## Next steps

> [!div class="nextstepaction"]
> [Log dialogs](./9-log-dialogs.md)
