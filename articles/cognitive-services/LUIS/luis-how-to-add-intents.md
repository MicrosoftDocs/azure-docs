---
title: Add intents in LUIS applications
titleSuffix: Azure Cognitive Services
description: Add intents to your LUIS app to identify groups of questions or commands that have the same intentions. 
services: cognitive-services
author: diberry
manager: cgronlun
ms.component: language-understanding
ms.topic: article
ms.date: 09/10/2018
ms.author: diberry
ms.service: cognitive-services
---

# Manage intents 
Add [intents](luis-concept-intent.md) to your LUIS app to identify groups of questions or commands that have the same intentions. 

Intents are managed from the **Build** Section in the top toolbar. You add and manage your intents from the **Intents** page, available in the left panel. 

The following procedure demonstrates how to add the "Bookflight" intent in the TravelAgent app.

## Add intent

1. Open your app (for example, TravelAgent) by clicking its name on **My Apps** page, and then click **Intents** in the left panel. 
2. On the **Intents** page, click **Create new intent**.

3. In the **Create new intent** dialog box, type the intent name "BookFlight" and click **Done**.

    ![Add Intent](./media/luis-how-to-add-intents/Addintent-dialogbox.png)

    On the intent details page of the newly added intent, [add utterances](#add-an-utterance-on-intent-page).

## Rename intent

1. On the **Intent** page, click the Rename icon ![Rename Intent](./media/luis-how-to-add-intents/Rename-Intent-btn.png) next to the intent name. 

2. On the **Intent** page, the current intent name is shown in a dialog box. Edit the intent name and press enter. The new name is saved and displayed on the intent page.

    ![Edit Intent](./media/luis-how-to-add-intents/EditIntent-dialogbox.png)

## Delete intent
When deleting an intent other than the None intent, you can choose to add all the utterances to the None intent. This is useful if you need to move the utterances instead of deleting them.   

1. On the **Intent** page, click the **Delete Intent** button next to the right of the intent name. 

    ![Delete Intent Button](./media/luis-how-to-add-intents/DeleteIntent.png)

2. Click the "Ok" button on the confirmation dialog box.

<!--
    TBD: waiting for confirmation about which delete dialog is going to be in //BUILD

    ![Delete Intent Dialog](./media/luis-how-to-add-intents/DeleteIntent-Confirmation.png)
-->


## Add an utterance on intent page

On the intent page, enter a relevant utterance you expect from your users, such as `book 2 adult business tickets to Paris tomorrow on Air France` in the text box below the intent name, and then press Enter. 
 
>[!NOTE]
>LUIS converts all utterances to lowercase.

![Screenshot of Intents details page, with utterance highlighted](./media/luis-how-to-add-intents/add-new-utterance-to-intent.png) 

Utterances are added to the utterances list for the current intent. Once an utterance is added, [label any entities](luis-how-to-add-example-utterances.md) within the utterances and [train](luis-how-to-train.md) your app. 

## Create a pattern from an utterance
See [Add pattern from existing utterance on intent or entity page](luis-how-to-model-intent-pattern.md#add-pattern-from-existing-utterance-on-intent-or-entity-page).

## Edit an utterance on intent page

To edit an utterance, select the ellipsis (***...***) button at the right end of the line for that utterance, and then select **Edit**. Modify the text then press Enter on the keyboard.

![Screenshot of Intents details page, with ellipsis button highlighted](./media/luis-how-to-add-intents/edit-utterance.png) 

## Reassign utterances on intent page
You can change the intent of one or more utterances by reassigning them to another intent. 

To reassign a single utterance to a different intent, at the right end of the utterance's row, select the correct intent name under the **Labeled intent** column. The utterance is removed from the current intent's utterance list. 

![Screenshot of BookFlight intent page with an utterance's intent under Labeled intent column selected](./media/luis-how-to-add-intents/reassign-1-utterance.png)

To change the intent of several utterances, select the checkboxes to the left of the utterances, and then select **Reassign intent**. Select the correct intent from the list.

![Screenshot of BookFlight intent page with an utterance checked and the Reassign intent button highlighted](./media/luis-how-to-add-intents/delete-several-utterances.png) 

## Delete utterances on intent page

To delete an utterance, select the ellipsis (***...***) button at the right end of the line for that utterance, and then select **Delete**. The utterance is removed from the list and the LUIS app.

![Screenshot of Intents details page, with Delete option highlighted](./media/luis-how-to-add-intents/delete-utterance-ddl.png)

To delete several utterances:

1. Select the checkboxes to the left of the utterances, and then select **Delete utterances(s)**. 

    ![Screenshot of Intents details page, with utterances checked and Delete utterance(s) button highlighted](./media/luis-how-to-add-intents/delete-several-utterances.png)

2. Select **Done** in the **Delete utterances?** pop-up dialog.

## Search in utterances on intent page
You can search for utterances that contain text (words or phrases) within the intent's utterance list. For example, you might notice an error that involves a particular word, and you want to find all examples that include that particular word. 

1. Select the magnifying glass icon in the toolbar.

    ![Screenshot of Intents page, with search icon of magnifying glass highlighted](./media/luis-how-to-add-intents/magnifying-glass.png)

2. A search textbox appears. Type the word or phrase in the search box at the top right corner of the utterances list. The utterances list updates, to display only the utterances that include your search text. 

    ![Screenshot of Intents page, with search textbox highlighted](./media/luis-how-to-add-intents/search-textbox.png)

    To cancel the search and restore your full list of utterances, delete the search text you've typed. To close the search textbox, select the magnifying glass icon in the toolbar again.

## Prediction discrepancy errors on intent page
An utterance in an intent might have a discrepancy between the selected intent and the prediction score. LUIS indicates this discrepancy with a red box around the score. 

![Screenshot of BookFlight Intent page, with prediction discrepancy score highlighted](./media/luis-how-to-add-intents/score-discrepancy.png) 

## Filter by intent prediction discrepancy errors on intent page
To filter the utterance list to only utterances with an intent prediction discrepancy, toggle from **Show All** to **Errors only** in the toolbar. 

## Filter by entity type on intent page
Use the **Entity filters** drop-down on the toolbar to filter the utterances by entity. 

![Screenshot of Intents page, with entity type filter highlighted](./media/luis-how-to-add-intents/filter-by-entities.png) 

To remove the filter, select the blue filter box with that word or phrase under the toolbar.  
<!-- TBD: waiting for ux fix - bug in ux of prebuit entity number -- when filtering by it, it doesn't show the list -->

## Switch to token view on intent page
Toggle **Tokens View** to view the tokens instead of the entity type names. On the keyboard, you can also use **Control+E** to toggle the view. 

![Screenshot of BookFlight intent, with Token View highlighted](./media/luis-how-to-add-intents/toggle-tokens-view.png)

## Train your app after changing model with intents
After you add, edit, or remove intents, [train](luis-how-to-train.md) and [publish](luis-how-to-publish-app.md) your app for your changes to affect endpoint queries. 

## Next steps

After adding intents to your app, your next task is to start adding [example utterances](luis-how-to-add-example-utterances.md) for the intents you've added. 
