---
title: How to use wait and non-wait actions with a Conversation Learner model - Microsoft Cognitive Services| Microsoft Docs
titleSuffix: Azure
description: Learn how to use wait and non-wait actions with a Conversation Learner model.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# Wait and non-wait actions

This tutorial shows the difference between wait actions and non-wait actions in the Conversation Learner.

## Video

[![Wait vs Non-Wait Tutorial Preview](https://aka.ms/cl_Tutorial_v3_WaitnonWait_Preview)](https://aka.ms/cl_Tutorial_v3_WaitnonWait)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

- Wait action: After the system takes a "wait" action, it will stop taking actions and wait for user input.
- Non-wait action: After the system takes a "non-wait" action, it will immediately choose another action (without waiting for user input).

## Steps

### Create a new model

1. In the Web UI, click New Model
2. In the "Name" field, type "Wait Non-Wait", hit enter or click the "Create" button.

### Create the first two Wait Actions

1. On the left panel, click "Actions", then the "New Action" button.
2. In the "Bot's response..." field, type "What pizza would you like?".
	- This is a Wait action, so leave the "Wait for Response" box checked.
3. Click the "Create" button.
4. Repeating those steps, create another action with "Pizza on the way!" as the Bot's response.

### Train using those Wait Actions

1. On the left panel, click "Train Dialogs", then the "New Train Dialog" button.
2. In the chat panel, where it says "Type your message...", type in "Hi". 
	- This simulates the user's side of the conversation.
3. Click the "Score Actions" button.
4. Select the response, "What pizza would you like?".
5. As the user, respond with, "Margherita".
6. Click the "Score Actions" button.
7. Select the response, "Pizza on the way!".
8. Click the "Save" button.

### Create a Non-Wait Action while Training
Although you could create the Non-Wait Action like you did earlier, you can also create it from within a Training session.
1. Click the "New Train Dialog" button.
2. As the user type in, "Hello".
3. Click the "Score Actions" button.
4. Click on the "+ Action" button. 
	- This will take you to the familiar "Create an Action" dialog box.
5. Type in the Bot's response as, "Welcome to Pizza Bot!"
6. Un-check the "Wait for Response" check-box.
7. Click the "Create" button.
	- Notice that the Bot responds immediately with, "Welcome to Pizza Bot!" and that you are again prompted for another Bot response. This is because the Bot's response was the Non-Wait Action we just created.
9. Select the response, "What pizza would you like?".
10. As the user, respond with, "Margherita".
11. Click the "Score Actions" button.
12. Select the response, "Pizza on the way!".
13. Click the "Save" button.

> [!NOTE]
> The sequence of the bot responses with regards to wait and non-wait actions.

## Next steps

> [!div class="nextstepaction"]
> [Introduction to entities](./04-introduction-to-entities.md)
