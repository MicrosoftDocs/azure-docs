---
title: Add intents in LUIS applications | Microsoft Docs
description: Use Language Understanding (LUIS) to add intents to help apps understand user requests and react to them properly.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 01/18/2018
ms.author: v-geberr
---

# Manage intents 
Add [intents](luis-concept-intent.md) to your LUIS app to identify groups of questions or commands that have the same intentions. 

You add and manage your intents from the **Intents** page, available from **Intents** in LUIS's left panel. 

The following procedure demonstrates how to add the "Bookflight" intent in the TravelAgent app.

## Add intent

1. Open your app (for example, TravelAgent) by clicking its name on **My Apps** page, and then click **Intents** in the left panel. 
2. On the **Intents** page, click **Create new intent**.

    ![Intents List](./media/luis-how-to-add-intents/IntentsList.png)
3. In the **Create new intent** dialog box, type the intent name "BookFlight" and click **Done**.

    ![Add Intent](./media/luis-how-to-add-intents/Addintent-dialogbox.png)

On the intent details page of the newly added intent "Bookflight", you add utterances for this intent. For instructions on adding utterances, see [Add example utterances](Add-example-utterances.md).

![Intent Details page](./media/luis-how-to-add-intents/IntentDetails-UtterancesTab1.png)

## Rename intent

1. On the **Intent** page, click the Rename icon ![Rename Intent](./media/luis-how-to-add-intents/Rename-Intent-btn.png) next to the intent name. 

2. On the **Intent** page, the current intent name is shown in a dialog box. Edit the intent name and press enter. The new name is saved and displayed on the intent page.

    ![Edit Intent](./media/luis-how-to-add-intents/EditIntent-dialogbox.png)

## Delete intent
 
1. On the **Intent** page, click the **Delete Intent** button next to the right of the intent name. 

    ![Delete Intent Button](./media/luis-how-to-add-intents/DeleteIntent.png)

2. Click the "Ok" button on the confirmation dialog box.

    ![Delete Intent Dialog](./media/luis-how-to-add-intents/DeleteIntent-Confirmation.png)


## Next steps

After adding intents to your app, your next task is to start adding [example utterances](Add-example-utterances.md) for the intents you've added. 
