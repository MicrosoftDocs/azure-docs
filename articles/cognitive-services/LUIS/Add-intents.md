---
title: Add intents in LUIS applications | Microsoft Docs
description: Use Language Understanding Intelligent Service (LUIS) to add intents to help apps understand user requests and react to them properly.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Add Intents 
An intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's input, or utterances. Intents match user requests with the actions that should be taken by your app, so you must add intents to help your app understand user requests and respond to them. 

All applications come with the predefined intent, **None**. You should teach it to recognize user statements that are irrelevant to the app. For example, if a user says "Get me a great cookie recipe" in a travel agent app, label that utterance with the **None** intent.

You can add up to **80** intents in a single LUIS app. You add and manage your intents from the **Intents** page that is accessed by clicking **Intents** in your application's left panel. 

The following procedure demonstrates how to add the "Bookflight" intent in the TravelAgent app.

**To add an intent:**

1. Open your app (for example, TravelAgent) by clicking its name on **My Apps** page, and then click **Intents** in the left panel. 
2. On the **Intents** page, click **Add intent**.

    ![Intents List](./Images/IntentsList.JPG)
3. In the **Add Intent** dialog box, type the intent name "BookFlight" and click **Save**.

    ![Add Intent](./Images/Addintent-dialogbox.JPG)

This takes you directly to the intent details page of the newly added intent "Bookflight", like the following screenshot, to add utterances for this intent. For instructions on adding utterances, see [Add example utterances](Add-example-utterances.md).

![Intent Details page](./Images/IntentDetails-UtterancesTab1.JPG)



## Manage your intents
You can view a list of all your intents and manage them on the **Intents** page, where you can add new intents, rename and delete existing ones, or access intent details for editing. 

![Intents List](./Images/IntentsList-added.JPG)

**To rename an intent:**

1. On the **Intents** page, click the Rename icon ![Rename Intent](./Images/Rename-Intent-btn.JPG) next to the intent you want to rename. 

2. In the **Edit Intent** dialog box, edit the intent name and click **Save**.

    ![Edit Intent](./Images/EditIntent-dialogbox.JPG)


**To delete an intent:**
 
* On the **Intents** page, click the trash bin icon ![Delete intent](./Images/trashbin-button.JPG) next to the intent you want to delete.


**To access intent details for editing:**

* On the **Intents** page, click the intent name which you want to access its details.


## Next steps

After adding intents to your app, now your next task is to start adding example utterances for the intents you've added. For instructions, see [Add example utterances](Add-example-utterances.md).
