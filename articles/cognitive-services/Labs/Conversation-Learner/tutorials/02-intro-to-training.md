---
title: Introduction to Training a Conversation Learner model - Microsoft Cognitive Services| Microsoft Docs
titleSuffix: Azure
description: Learn how to train a model including branching and editing previous training via Conversation Learner.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# Introduction to Training

This tutorial shows the basics of training a Model, branching off a new training based on a previous training, and editing a Bot response in order to change it.

## Video

[![Intro to Training Tutorial Preview](https://aka.ms/cl_Tutorial_v3_IntroTraining_Preview)](https://aka.ms/cl_Tutorial_v3_IntroTraining)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

- Actions: A Bot response to user input.
- Train: The way we teach a Bot to respond to user input.
- Branching: The modification of a user input within a saved Train Dialog for the purpose of creating a new Train Dialog that starts out the same as the original, but takes the conversation in a different direction.

## Steps

### Create a new model

1. In the Web UI, click New Model
2. For the "Name", type "Inspire Bot". Then click Create.

### Create an Action

1. On the left panel, click "Actions", then the "New Action" button.
2. In the "Bot's response" field, enter "Hi! Would you like to be inspired today?".
	- Leave all other fields and check boxes at their default setting.
3. Click Create.

### First Training and Creating Another Action while Training

1. On the left panel, click "Train Dialogs", then the "New Train Dialog" button.
2. In the chat panel, where it says "Type your message...", type in "hello". 
	- This simulates the user's side of the conversation.
3. Click "Score Actions".
4. Select the response, "Hi! Would you like to be inspired today?".
5. As the user, respond with, "yes".
6. Click "Score Actions".
7. Click on the "+ Action" button. 
	- This will take you to the familiar "Create an Action" dialog box.
8. Type in the Bot's response as, "You're awesome!"
9. Click Create.
10. Notice that the Bot responds immediately.
11. Click the "Save" button.

### Branch a Second Training off of the First Training
1. Click on the grid row that summarizes the first training. 
	- This allows you to view and edit the existing training.
2. Click on the "yes" user response. 
	- This will expose editing controls.
3. Click on the branch icon. 
	- This will bring up a prompt for a different user input for a new conversation.
4. Type in "no", hit enter or click the "Create" button. 
	- At this point you will have a new instance of a Train Dialog, the original one remains unchanged.
5. Click "Score Actions".
6. Click on the Bot's incorrect response that just appeared.
7. Click on the "+ Action" button 
	- so that we can create a new Action for the Bot to respond with.
8. Type in the Bot's response as, "No problem! Have a great day!"
9. Click Create
10. Notice that the Bot responds immediately.
11. Click the "Save" button.

### Test the Trainings
1. On the left panel, click "Log Dialogs", then "New Log Dialog".
2. Type in the message, "hi". 
3. Notice that the Bot responds automatically in the way we trained it.
4. Type in the user reply, "yes".
5. Notice the Bot response, it shows that the first training is working.
6. Click the "Session Timeout" button. This tells Conversation Learner we want to begin again, ignoring the conversational turns that just took place.
7. Type in the message, "hi". 
8. Notice that the Bot responds automatically in the way we trained it.
9. Type in the user reply, "no".
10. Notice the Bot response, it shows that the second training is working.
11. Click the "Done Testing" button.

## Next steps

> [!div class="nextstepaction"]
> [Wait and non-wait actions](./03-wait-vs-nonwait-actions.md)
