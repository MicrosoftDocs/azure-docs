---
title: Create a new app - LUIS
titleSuffix: Azure Cognitive Services
description: Create and manage your applications on the Language Understanding (LUIS) webpage.
services: cognitive-services

manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 05/18/2020

---

# Create a new LUIS app in the LUIS portal
There are a couple of ways to create a LUIS app. You can create a LUIS app in the LUIS portal, or through the LUIS authoring [APIs](developer-reference-resource.md).

## Using the LUIS portal

You can create a new app in the portal in several ways:

* Start with an empty app and [create intents](luis-how-to-add-intents.md), utterances, and [entities](luis-how-to-add-entities.md).
* Start with an empty app and add a [prebuilt domain](luis-how-to-use-prebuilt-domains.md).
* Import a LUIS app from a `.lu` or `.json` file that already contains intents, utterances, and entities.

## Using the authoring APIs
You can create a new app with the authoring APIs in a couple of ways:

* [Add application](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/5890b47c39e2bb052c5b9c2f) - start with an empty app and create intents, utterances, and entities.
* [Add prebuilt application](https://westeurope.dev.cognitive.microsoft.com/docs/services/luis-programmatic-apis-v3-0-preview/operations/59104e515aca2f0b48c76be5) - start with a prebuilt domain, including intents, utterances, and entities.


<a name="export-app"></a>
<a name="import-new-app"></a>
<a name="delete-app"></a>

## Create new app in LUIS

After [signing in to LUIS](sign-in-luis-portal.md), you will land on My Apps Page where it will host all the apps you built and where you can create new apps at.

1. On **My Apps** page, select your **Subscription**, and  **Authoring resource** then **+ New App**. 

   > ![LUIS my apps page](./media/app-settings/select-sub-and-resource.png)

1. In the dialog box, enter the name of your application, such as 'my app`.

   > ![Create new app dialog](./media/app-settings/create-new-app-luis.png)

It is required to enter a name of an app and choose an application culture. It is optional to write a description for the app and associate it with a prediction resource.  If at any point you wish to associate your application to a prediction resource, you can go to the **Manage** section of you app in the **Azure Resources** tab.  and then select **Done**. 

    > [!NOTE]
    > The culture cannot be changed once the application is created.

After the app is created, the LUIS portal shows the **Intents** list with the `None` intent already created for you. You now have an empty app. Add more [intents](luis-how-to-add-intents.md) to your app.

    
   > ![Intents list with None intent created with no example utterances](media/app-settings/intents-page-none.png)

## Other actions available on My Apps page

The context toolbar provides other actions:

* Rename app
* Import from file using `.lu` or `.json`
* Export app as `.lu` (for [LUDown](https://github.com/microsoft/botbuilder-tools/tree/master/packages/Ludown)), `.json`, or `.zip` (for [LUIS container](luis-container-howto.md))
* Import container endpoint logs, to review endpoint utterances
* Export endpoint logs, as a `.csv`, for offline analysis
* Delete app

## Next steps

If your app design includes intent detection, [create new intents](luis-how-to-add-intents.md), and add example utterances. If your app design is only data extraction, add example utterances to the None intent, then [create entities](luis-how-to-add-example-utterances.md), and label the example utterances with those entities.
