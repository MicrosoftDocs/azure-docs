---
title: Create a new app
titleSuffix: Language Understanding - Azure Cognitive Services
description: Create and manage your applications on the Language Understanding (LUIS) webpage.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 05/07/2019
ms.author: diberry
---

# Create a new LUIS app in the LUIS portal
There are a couple of ways to create a LUIS app. You can create a LUIS app in the [LUIS](https://www.luis.ai) portal, or through the LUIS authoring [APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f).

## Using the LUIS portal
You can create a new app in the LUIS portal in several ways:

* Start with an empty app and create intents, utterances, and entities.
* Start with an empty app and add a [prebuilt domain](luis-how-to-use-prebuilt-domains.md).
* Import a LUIS app from a JSON file that already contains intents, utterances, and entities.

## Using the authoring APIs
You can create a new app with the authoring APIs in a couple of ways:

* [Start](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c2f) with an empty app and create intents, utterances, and entities.
* [Start](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/59104e515aca2f0b48c76be5) with a prebuilt domain.  


<a name="export-app"></a>
<a name="import-new-app"></a>
<a name="delete-app"></a>
 

## Create new app in LUIS

1. On **My Apps** page, select **Create new app**.

    ![LUIS apps list](./media/luis-create-new-app/apps-list.png)


2. In the dialog box, name your application "TravelAgent".

    ![Create new app dialog](./media/luis-create-new-app/create-app.png)

3. Choose your application culture (for TravelAgent app, choose English), and then select **Done**. 

    > [!NOTE]
    > The culture cannot be changed once the application is created. 

## Import an app from file

1. On **My Apps** page, select **Import new app**.
1. In the pop-up dialog, select a valid app JSON file, and then select **Done**.

### Import errors

Possible errors are: 

* An app with that name already exists. To fix this, reimport the app, and set the **Optional Name** to a new name. 

## Export app for backup

1. On **My Apps** page, select **Export**.
1. Select **Export as JSON**. Your browser downloads the active version of the app.
1. Add this file to your backup system to archive the model.

## Export app for containers

1. On **My Apps** page, select **Export**.
1. Select **Export as container** then select which published slot (production or stage) you want to export.
1. Use this file with your [LUIS container](luis-container-howto.md). 

    If you are interested in exporting a trained but not yet published model to use with the LUIS container, go to the **Versions** page and export from there. 

## Delete app

1. On **My Apps** page, select the three dots (...) at the end of the app row.
1. Select **Delete** from the menu.
1. Select **Ok** in the confirmation window.

## Next steps

Your first task in the app is to [add intents](luis-how-to-add-intents.md).
