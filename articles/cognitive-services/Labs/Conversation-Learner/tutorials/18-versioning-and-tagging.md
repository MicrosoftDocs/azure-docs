---
title: How to use Version Tagging with a Conversation Learner Model - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn how to use versioning and tagging with a Conversation Learner model.
services: cognitive-services
author: v-jaswel
manager: nolachar
ms.service: cognitive-services
ms.component: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: v-jaswel
---

# How to use Version Tagging

This tutorial illustrates how to tag versions of your Conversation Learner Model, and set which version is “live”.  

## Requirements
This tutorial requires using the Bot Framework Emulator to create Log Dialogs, not the Log Dialog Web UI.  

This tutorial requires that the general tutorial Bot is running:

	npm run tutorial-general

## Details

When editing, you are always editing the tag called “master” -- you can create tagged versions from master (which essentially take a snapshot of master), but you cannot edit tagged versions.

## Steps

### Install the Bot Framework Emulator

- Go to [https://github.com/Microsoft/BotFramework-Emulator](https://github.com/Microsoft/BotFramework-Emulator).
- Download and install the emulator.

### Create a Model

1. From the Model List Home Page, click the `New Model` button.
2. In the `Name` field type, "Tutorial-18-Versioning", hit enter.
4. On the left panel, click "Settings".
5. Copy the contents of the CONVERSATION_LEARNER_MODEL_ID field to the clipboard.

### Configure the Emulator

1. In the Conversation Learner root folder, open the .env file.
2. Add a line to the .env file like this:
	- CONVERSATION_LEARNER_MODEL_ID=<paste-model-id-from-clipboard-here>
3. Restart the Conversation Learner service by exiting from the command prompt, and rerunning:
	- `npm run tutorial-general` 

### Version 1 Action

We'll create a single Action for Version 1.

1. In the left panel of the Web UI, click "Actions", then click the `New Action` button.
2. In the "Bot's Response" field, enter “hi there (version 1)”.
3. Click the `Save` button.

Now we'll tag this as "version 1".

4. In the left panel click on “settings”, then click on this ![](../media/tutorial18_version_tags.PNG)
	- Call it “version 1”
4. Set “version 1” to be “live”.  
	- The effect of setting the live tag to "version 1" is that channels using this Bot will use the “version 1” tag.
	- Tagged versions of models are not affected by edits (changing actions, entities, adding train dialogs).  
	- Edits to an model (changing actions, entities, adding train dialogs) are always made on the "master" tag.  In other words, "master" is the only tag that can change; other tags are fixed snapshots.
	- Log dialogs in the Conversation Learner UI always use master (not the live tag).

![](../media/tutorial16_v1_create.PNG)

The version has been created in settings:

![](../media/tutorial16_settings.PNG)

Let's add a second action:

1. Click Actions, then New Action.
2. In Response, enter “bye bye (version 2)”.

Edit the first action:

1. Click Actions.
2. Under Actions, click on "hi there (version 1)".
3. Change the Response to "hi there (version 2)".

![](../media/tutorial16_hi_there_v2.PNG)

### Switch to the Bot emulator

1. In the Bot UI, enter "goodbye".
2. The Bot responds with "hi there (version 1)".
	- This shows the version 1 is "live". 

![](../media/tutorial16_bf_response.PNG)

### Switch to the Web UI

1. Click on Log Dialogs (If you don't see any dialogs, click the refresh button).
2. Click on "hi there (version 2)"

> [!NOTE]
> We can make corrections by choosing from all currently available actions. These edits will be made to the master.

You have now seen how versioning works, and how you can interact with the Bot using the Bot Framework Emulator.

## Next steps

> [!div class="nextstepaction"]
> [Demo - password reset](./demo-password-reset.md)
