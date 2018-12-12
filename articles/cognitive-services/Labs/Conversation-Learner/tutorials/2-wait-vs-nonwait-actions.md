---
title: How to use wait and non-wait actions with a Conversation Learner model - Microsoft Cognitive Services| Microsoft Docs
titleSuffix: Azure
description: Learn how to use wait and non-wait actions with a Conversation Learner model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# Wait and non-wait actions

This tutorial shows the difference between wait actions and non-wait actions in the Conversation Learner.

## Video

[![Tutorial 2 Preview](https://aka.ms/cl-tutorial-02-preview)](https://aka.ms/blis-tutorial-02)

## Requirements
This tutorial requires that the general tutorial bot is running

	npm run tutorial-general

## Details

- Wait action: After the system takes a "wait" action, it will stop taking actions and wait for user input.
- Non-wait action: After the system takes a "non-wait" action, it will immediately choose another action (without waiting for user input).

## Steps

### Create a new model

1. In the Web UI, click New Model
2. In Name, enter Wait Non-Wait. Then click Create.

### Create the first two Wait Actions

1. Click Actions, then New Action.
2. In the "Bot's response" field, enter "What pizza would you like?".
	- This is a Wait action, so leave the "Wait for Response" box checked.
3. Click Create.
4. Repeating those steps, create another action with 'Pizza on the way!' as the Bot's response.

### Train using those Wait Actions

1. On the left panel, click "Train Dialogs", then "New Train Dialog".
2. In the chat panel, where it says "Type your message...", type in "Hi". This simulates the user's side of the conversation.
3. Click "Score Actions".
4. Select the response, "What pizza would you like?".
5. As the user, respond with, "Margherita".
6. Click "Score Actions".
7. Select the response, "Pizza on the way!".
8. Save

### Create a Non-Wait Action while Training
Although you could create the Non-Wait Action like you did earlier, you can also create it from within a Training session.
1. Click on "New Train Dialog".
2. As the user type in, "Hello".
3. Click "Score Actions".
4. Click on the "+ Action" button. This will take you to the familiar "Create an Action" dialog box.
5. Type in the Bot's response as, "Welcome to Pizza Bot!"
6. Un-check the Wait for Response check-box.
7. Click Create
8. Notice that the Bot responds immediately with "Welcome to Pizza Bot!" and that you are again prompted for another Bot response. This is because the Bot's response was the Non-Wait Action we just created.
9. Select the response, "What pizza would you like?".
10. As the user, respond with, "Margherita".
11. Click "Score Actions".
12. Select the response, "Pizza on the way!".
13. Save

> [!NOTE]
> The sequence of the bot responses with regards to wait and non-wait actions.

## Next steps

> [!div class="nextstepaction"]
> [Introduction to entities](./3-introduction-to-entities.md)
