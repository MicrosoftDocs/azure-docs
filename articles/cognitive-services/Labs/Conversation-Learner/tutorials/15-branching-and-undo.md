---
title: How to use branching and undo operations with a Conversation Learner model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use branching and undo operations with a Conversation Learner model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to use branching and undo operations
In this tutorial, we will go over undo and branching operations.


## Details
### Undo
Allows the developer to “undo” the last user input or action choice. Behind the scenes, “undo” actually creates a new dialog and re-plays it up to the previous step.  This means that the entity detection callback and API calls in the dialog will be called again.

### Branch
Creates a new train dialog which begins in the same way as an existing train dialog – this saves the effort of manually re-entering dialog turns. Behind the scenes, “branch” creates a new dialog and re-plays the existing train dialog up to the selected step.  This means that the entity detection callback and API calls in the dialog will be called again.


## Requirements
This tutorial requires that the pizza order Bot is running:

	npm run demo-pizza

### Open or Import the Demo

If you've already worked through the Tutorial for Pizza Order then simply open that Model from the list in the web UI. Otherwise you will need to do the following to get started:
1. From the Model List Page, click the `Import Model` button.
2. Type in "Pizza Demo" as the New Model Name.
3. Click the `Locate File` buton, select this file: `<your-repo-path>\models\Demo-PizzaOrder.cl`

## Undo

Here is an example of how to see the `Undo` feature in action:

### Training Dialogs
1. On the left panel, click "Train Dialogs", then click the "New Train Dialog" button.
1. Type "Order a pizza".
2. Click the `Score Actions` button.
3. Click to Select "What would you like on your pizza?"
4. Type "anything".
5. Click the `Undo` button.
	- The last entry is removed, leaving the last Bot response of "What would you like on your pizza?"

## Branch

For this demo, we'll open an existing Train Dialog and create a new Train Dialog from it by branching.

1. On the left panel, click "Train Dialogs".
2. In the grid, click "new order" to open the existing Train Dialog.
2. Click on the last "no" in the dialog.
3. Click the "Branch" icon, it is circled in red in this image:
	- ![](../media/tutorial15_branch.PNG)
	- The entire Train Dialog prior to the "no" is copied into a new Train Dialog.
	- This saves you re-entering the preceding turns to explore a new conversation "branch" from this point.
1. Type "yes".
2. Click the `Score Actions` button.
3. Select "You have $Toppings on your pizza".
6. Select "Would you like anything else?"
7. Type "no".
4. Click Done Teaching.

## Next steps

> [!div class="nextstepaction"]
> [Versioning and tagging](./16-versioning-and-tagging.md)
