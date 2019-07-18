---
title: How to use Version Tagging with a Conversation Learner Model - Azure Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use versioning and tagging with a Conversation Learner model.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# How to use Version Tagging

This tutorial illustrates how to tag versions of your Conversation Learner Model, and set which version is “live”.  

## Requirements
This tutorial requires using the Bot Framework Emulator to create Log Dialogs, not the Log Dialog Web UI.  

This tutorial requires that the general tutorial Bot is running:

	npm run tutorial-general

## Details

Tagged versions of the Model are static; you cannot edit or change them. When editing your model, you are always editing the Master version. When you add a new Tag, Conversation Learner captures a snapshot of the Model at that point in time. 

Your Bot will use the version of the Model that you have selected as the "Live" version, but any conversations it has will be viewable only when the "Editing Tag" is set to "Master". If the "Editing Tag" property of the Model is set to anything other than "Master", then you can view the snapshot of the Model, but you cannot change it in any way.

## Steps

### Install the Bot Framework Emulator

1. Go to [https://github.com/Microsoft/BotFramework-Emulator](https://github.com/Microsoft/BotFramework-Emulator).
2. Download and install the emulator.

### Create a Model

1. From the Model List Home Page, click the `New Model` button.
2. In the `Name` field type, "Tutorial-18-Versioning", hit enter.
4. On the left panel, click "Settings".
5. Copy the contents of the CONVERSATION_LEARNER_MODEL_ID field to the clipboard.

### Configure the Emulator

1. In the Conversation Learner root folder, open the ".env" file.
2. Add a line to the ".env" file like this:
	- `CONVERSATION_LEARNER_MODEL_ID=[paste-model-id-from-clipboard-here]`
3. Restart the Conversation Learner service by exiting from the command prompt, and rerunning:
	- `npm run tutorial-general`
4. In Bot Framework Emulator, create a new bot configuration, set the Endpoint URL to `http://localhost:3978/api/messages`

### Version 1

We'll create a single Action for Version 1.

1. In the left panel of the Web UI, click "Actions", then click the `New Action` button.
2. In the "Bot's Response" field, enter “hi there (version 1)”.
3. Click the `Save` button.

Now we'll tag this as "Version 1" of the Model.

1. In the left panel click on “settings”, then click on the ![](../media/tutorial18_version_tags.PNG)"Version Tags" icon to reveal the `New Tag` button which you should click.
	- Name it “Version 1”
1. In the "Live Tag" drop down select “Version 1”.  
	- Now channels using this Bot will use “Version 1” of our Model.
	- The Entities, Actions, and Train Dialogs of this Version 1 Model can no longer be changed.
	- If you select "Version 1" as the "Editing Tag" you will ONLY be able to view the Model and not edit it.
	- Leave "Editing Tag" set to "Master", it is the only version of the model that can be edited.

Now you will see "Version 1" in the "Version Tags" grid.

### Version 2

Now we will edit our Model to distinguish it from Version 1.

1. In the left panel click on "Actions".
2. In the Actions grid click on "hi there (version 1)".
3. Change the "Bot's response" field to "hi there (version 2)".
4. Click the `Save` button.
5. Click the `New Action` button.
6. In the "Bot's response" field type, "bye bye (version 2)".

### Confirm Bot Framework Emulator is Using Version 1

1. In the Bot Framework Emulator, type in the message, "Hey there".
2. Notice that the Bot responds with "hi there (version 1)".
	- This verifies that Version 1 is "live".

### View the Conversation Logs in Conversation Learner Web UI

1. In the left panel click on "Log Dialogs"
	- If you don't see any dialogs, click the refresh button.
2. Notice the "Version 1" tag in the grid.
3. In the grid, click on "hi there (version 1)"

> [!NOTE]
> We can make corrections by choosing from all currently available Conversation Learner functionality, however, these edits will be made to Master and not to Version 1.

You have now seen how versioning works, and how you can interact with the Bot using the Bot Framework Emulator.

## Next steps

> [!div class="nextstepaction"]
> [Enum entities and Set entity actions](./tutorial-enum-set-entity.md)
