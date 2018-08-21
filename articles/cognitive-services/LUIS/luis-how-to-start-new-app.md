---
title: Create a new app with LUIS | Microsoft Docs
description: Create and manage your applications on the Language Understanding (LUIS) webpage.
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 04/17/2018
ms.author: diberry
---

# Create an app
You create a new app in different ways: 

* [Start](#create-new-app) with an empty app and create intents, utterances, and entities.
* [Start](#create-new-app) with an empty app and add a [prebuilt domain](luis-how-to-use-prebuilt-domains.md).
* [Import a LUIS app](#import-new-app) from a JSON file that already contains intents, utterances, and entities.

## What is an app
The app contains [versions](luis-how-to-manage-versions.md) of your model as well as any [collaborators](luis-how-to-collaborate.md) for the app. When you create the app, you select the culture ([language](luis-supported-languages.md)) which **cannot be changed later**. 

The default version of a new app is "0.1." 

You can create and manage your applications on **My Apps** page. You can always access this page by selecting **My apps** on the top navigation bar of the [LUIS](luis-reference-regions.md) website. 

[![](media/luis-create-new-app/apps-list.png "Screenshot of List of apps")](media/luis-create-new-app/apps-list.png#lightbox)

## Create new app

1. On **My Apps** page, select **Create new app**.
2. In the dialog box, name your application "TravelAgent".

    ![Create new app dialog](./media/luis-create-new-app/create-app.png)

3. Choose your application culture (for TravelAgent app, choose English), and then select **Done**. 

    >[!NOTE]
    >The culture cannot be changed once the application is created. 

## Import new app
You can set the name (50 char max), version (10 char max), and description of an app in the JSON file. Examples of application JSON files are available at [LUIS-Samples](https://github.com/Microsoft/LUIS-Samples/tree/master/documentation-samples/Examples-BookFlight).

1. On **My Apps** page, select **Import new app**.
2. In the **Import new app** dialog, select the JSON file defining the LUIS app.

    ![Import a new app dialog](./media/luis-create-new-app/import-app.png)

## Export app
1. On **My Apps** page, select the ellipsis (***...***) at the end of the app row.

    [![](media/luis-create-new-app/apps-list.png "Screenshot of pop-up dialog of per-app actions")](media/luis-create-new-app/three-dots.png#lightbox)

2. Select **Export app** from the menu. 

## Rename app

1. On **My Apps** page, select the ellipsis (***...***) at the end of the app row. 
2. Select **Rename** from the menu.
3. Enter the new name of the app and select **Done**.

## Delete app

> [!CAUTION]
> You are deleting the app for all collaborators and the owner. [Export](#export-app) the app before deleting it. 

1. On **My Apps** page, select the ellipsis (***...***) at the end of the app row. 
2. Select **Delete** from the menu.
3. Select **Ok** in the confirmation window.

## Export endpoint logs
The logs contain the Query, UTC time, and LUIS JSON response.

1. On **My Apps** page, select the ellipsis (***...***) at the end of the app row. 
2. Select **Export endpoint logs** from the menu.

```
Query,UTC DateTime,Response
text i'm driving and will be 30 minutes late to the meeting,02/13/2018 15:18:43,"{""query"":""text I'm driving and will be 30 minutes late to the meeting"",""intents"":[{""intent"":""None"",""score"":0.111048922},{""intent"":""SendMessage"",""score"":0.987501}],""entities"":[{""entity"":""i ' m driving and will be 30 minutes late to the meeting"",""type"":""Message"",""startIndex"":5,""endIndex"":58,""score"":0.162995353}]}"
```

## Next steps

Your first task in the app is to [add intents](luis-how-to-add-intents.md).