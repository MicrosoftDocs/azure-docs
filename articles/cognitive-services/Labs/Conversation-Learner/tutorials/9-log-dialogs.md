---
title: How to log dialogs in a Conversation Learner model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to log dialogs in a Conversation Learner model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to log dialogs in a Conversation Learner model

This tutorial demonstrates how Log Dialogs are employed to better train Conversation Learner models from recorded interactions with real world users.

## Video

[![Log Dialogs Tutorial Preview](https://aka.ms/cl_Tutorial_v3_LogDialogs_Preview)](https://aka.ms/cl_Tutorial_v3_LogDialogs)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

and the weather model created in previous tutorials.

## Details
Log Dialogs are recorded logs of your bot's interaction with end users. By harnessing these Log Dialogs you can fix entity labels and action selections to improve the model's performance and overall system performance.

## Steps

Import the existing weather model into the Conversation Learner UI. This model contains one entity named city, and actions designed to respond to inquires about weather in that city. Two Train Dialogs only were used to train the model so you set performance expectations quite low. The model would improve with additional training and exposure to real world user interactions.

### Create a new Log Dialog

1. Click Log Dialogs, then New Log Dialog.

### Create a new Conversation

1. Type "Austin weather forecast" for the utterance.
2. Click Done Testing as the model could use more training based on the selection response.
3. Click on the Austin weather forecast utterance and notice the lack of entity tagging. The model needs to be trained to recognize Austin as a city entity.
4. Double-click on Austin and select city from the entity list.
5. Click Submit Changes. Note, this change will cause downstream changes to the conversation since we have new entity values in memory. Later actions have likely become invalid especially ones involving the city entity.
6. Click on the response mentioning sunshine to select this action as the best response to the utterance.
7. Click Save As Train Dialog. The Log Dialog is converted, fed into the model, and kicks off model training.

Log dialogs support adding brand new actions and enable you to completely train a new flow of the dialog from actual user interactions. 

One last note. Depending on business needs, the conversation logging feature can be turned off by going to Settings and unchecking “Log Conversations.”

## Next steps

> [!div class="nextstepaction"]
> [Entity detection callback](./10-entity-detection-callback.md)
