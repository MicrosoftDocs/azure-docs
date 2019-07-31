---
title: How to create a "Hello World" Conversation Learner model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to create a "Hello World" Conversation Learner model.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# How to create a "Hello World" model with Conversation Learner

This tutorial shows how to get started with Conversation Learner, including creating actions, teaching the Bot interactively, and making corrections of logged dialogs which come from end users.

## Video

[![Hello World Tutorial Preview](https://aka.ms/cl_Tutorial_v3_HelloWorld_Preview)](https://aka.ms/cl_tutorial_v3_helloworld)


## Requirements
If you haven't already, first ensure all setup steps have been completed, including creating a `.env` file with your LUIS authoring key.  See [Quickstart](../quickstart.md) for details.

This tutorial requires that the general tutorial Bot is running

	npm run tutorial-general

## Steps

Start on the home page in the Web UI.

### Create the Model
1. Click the "New Model" button.
2. In the "Name" field, enter "Hello World".
3. Click the "Create" button.

You should now see the view of the model you created.

### Create an Action
1. On the left panel, click "Actions", then the "New Action" button.
	- An Action can be a text message that Conversation Learner returns to the user, an API call, or a card.
2. In the "Bot's Response..." field type "Hello".
	- This is the response that the Bot will return.
3. Click the "Create" button.

You have created the first Action that the Bot can perform, i.e. return a text response.

### Train Dialogs
This is where you Train the Model on how to respond to user utterances.

#### First Training Dialog

1. On the left panel, click "Train Dialogs", then the "New Train Dialog" button.
2. Type "Hi", hit enter.
	- As an example of what the user might say in the beginning of a conversation.
3. Click the "Score Actions" button.
4. Select "Hello".
	- You just completed one full turn in this example dialog. 
5. Type in the user reply, "Goodbye".
6. Click the "Score Actions" button.
7. Click the "+ Action" button.
8. Type "Goodbye!" in "Bot's response..." field, then click the "Create" button.
	- Notice that the Bot responded with that action you just created.
9. Click the "Save" button. 
	- This will end and save this Training Dialog.

Now you have one Training Dialog in the Model, along with a single Entity and two Actions.

#### Second Training Dialog
Let's do one more training and see how the Bot responds.

1. Click the "New Train Dialog" button.
2. Type in, "Hi"
	- This is similar to the first dialog and we expect to get a good score from the Bot.
3. Click the "Score Actions" button.
	- The position and score may still not be accurate enough and may require additional training.
4. Select "Hello".
5. Type in the user reply, "bye".
6. Click the "Score Actions" button.
7. Select "Goodbye!"
8. Click the "Save" button.

### Log Dialogs
This is where you Test, View and Correct Conversations that you or real users have had with your Bot.

#### Test the Model as an End User
1. On the left panel, click "Log Dialogs", then the "New Log Dialog" button.
2. Type "hello there".
3. Wait a short time, the Bot should respond automatically with "Hello"
4. Enter 'byebye'
5. Wait a short time, again the Bot should respond automatically with "Hello".
6. Click the "Done Testing" button.

#### View and Correct a User Conversation
Using Log Dialogs, you can view the list of conversations users held with your Bot. You can also edit them in order to correct the Bot's responses and save the interactions as Training Dialogs. To do that:
1. In the grid, click on the log of the conversation.
2. Click on the last Bot action e.g. "Hello".
3. Select "Goodbye!" to correct the Bot.
4. Click the "Save As Train Dialog" button.

## Next steps

> [!div class="nextstepaction"]
> [Introduction to Training](./02-intro-to-training.md)
