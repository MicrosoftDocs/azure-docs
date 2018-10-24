---
title: Add intents in LUIS applications
titleSuffix: Azure Cognitive Services
description: Add intents to your LUIS app to identify groups of questions or commands that have the same intentions. 
services: cognitive-services
author: diberry
manager: cgronlun
ms.component: language-understanding
ms.topic: article
ms.date: 10/23/2018
ms.author: diberry
ms.service: cognitive-services
---

# Add intents 

Add [intents](luis-concept-intent.md) to your LUIS app to identify groups of questions or commands that have the same intention. 

Intents are managed from **Build**, found in the top toolbar. Manage your intents from **Intents**, available in the left panel. 

The following procedure demonstrates how to add an intent to prediction if a user wants to book a flight for travel.

## Create an app

1. In the [LUIS](https://www.luis.ai) portal, sign in.

1. Select **Create new app**. 

1. Name the new app `MyHumanResourcesApp`. Select the **English** culture. The description is optional. 

1. Select **Done**. 

## Add intent

1. The app opens to the **Intents** list.

1. On the **Intents** page, select **Create new intent**.

1. In the **Create new intent** dialog box, enter the intent name, `GetEmployeeInformation`, and click **Done**.

    ![Add Intent](./media/luis-how-to-add-intents/Addintent-dialogbox.png)

## Add an example utterance

An example utterance is an example of text you expect LUIS to receive from the client application. 

1. On the **GetEmployeeInformation** intent details page, enter a relevant utterance you expect from your users, such as `Does John Smith work in Seattle?` in the text box below the intent name, and then press Enter.
 
    ![Screenshot of Intents details page, with utterance highlighted](./media/luis-how-to-add-intents/add-new-utterance-to-intent.png) 

    LUIS converts all utterances to lowercase and adds spaces around tokens such as hyphens.

1. In the top navigation, select **Train**. The red outline around the labeled intent is removed.

## Intent prediction discrepancy errors 

An utterance in an intent might have a discrepancy between the selected intent and the prediction score. LUIS indicates this discrepancy with a red box around the **Labeled intent** on the row of the example utterance. 

## Add a custom entity

Once an utterance is added to an intent, you can select text from within the utterance to create a custom entity. 

1. Select the word, `Seattle`, in the utterance. Square brackets are drawn around the text and a drop-down menu appears. 

    ![Screenshot of Intents details page, creating custom entity](./media/luis-how-to-add-intents/create-custom-entity.png) 

    This example select a single word to mark as an entity. You can mark single works and phrases as entities.

1. In the top text-box of the menu, enter `Location`, then select **Create new entity**. 

    ![Screenshot of Intents details page, creating custom entity name](./media/luis-how-to-add-intents/create-custom-entity-name.png) 

1. In the pop-up window, validate that the **entity name** is _Location_, and the **entity type** is _Simple_. Select **Done**.

    ![Screenshot of Intents details page, custom entity name highlighted in blue](./media/luis-how-to-add-intents/create-custom-entity-name-blue-highlight.png) 

    The entity is underlined in red to indication a [prediction discrepancy](luis-how-to-add-example-utterances.md#entity-status-predictions). Because this is the first occurrence of an entity, there are not enough examples for LUIS to have a high-confidence that this text is marked with the correct entity.

    The text is highlighted in blue, indicating an entity.  

## Add a prebuilt entity

For information, see [Prebuilt entity](luis-how-to-add-entities.md#add-prebuilt-entity).

## Using the contextual toolbar

When one or more utterances is selected in the list, by checking the box to the left of an utterance, the toolbar above the utterance list allows you to perform the following actions:

* Reassign intent: move utterance(s) to different intent
* Delete utterance(s)
* Entity filters: only show utterances containing filtered entities
* Show all/Errors only: show utterances with prediction errors or show all utterances
* Entities/Tokens view: show entities view with entity names or show raw text of utterance
* Magnifying glass: search for utterances containing specific text

## Working with an individual utterance

The following actions can be performed on an individual utterance from the ellipsis menu to the right of the utterance:

* Edit: change the text of the utterance
* Delete: remove the utterance from the intent. If you still want the utterance, a better method is to move it to the **None** intent. 
* Add a pattern: A pattern allows you to take a common utterance and mark replaceable text and ignorable text, thereby reducing the need for more utterances in the intent. 

The **Labeled intent** column allows you to change the intent of the utterance.

## Train your app after changing model with intents

After you add, edit, or remove intents, [train](luis-how-to-train.md) and [publish](luis-how-to-publish-app.md) your app so that your changes are applied to endpoint queries. 

## Next steps

Learn more about adding [example utterances](luis-how-to-add-example-utterances.md) with entities. 
