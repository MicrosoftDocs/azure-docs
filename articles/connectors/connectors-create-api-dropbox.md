---
# required metadata
title: Connect to Dropbox - Azure Logic Apps | Microsoft Docs
description: Upload and manage files with Dropbox REST APIs and Azure Logic Apps
author: ecfan
manager: jeconnoc
ms.author: estfan
ms.date: 07/15/2016
ms.topic: article
ms.service: logic-apps
services: logic-apps

# optional metadata
ms.reviewer: klam, LADocs
ms.suite: integration
tags: connectors
---

# Get started with the Dropbox connector
Connect to Dropbox to manage your files. You can perform various actions such as upload, update, get, and delete files in Dropbox.

To use [any connector](apis-list.md), you first need to create a logic app. You can get started by [creating a Logic app now](../logic-apps/quickstart-create-first-logic-app-workflow.md).

## Connect to Dropbox
Before your logic app can access any service, you first need to create a *connection* to the service. A connection provides connectivity between a logic app and another service. For example, in order to connect to Dropbox, you first need a Dropbox *connection*. To create a connection, you would need to provide the credentials you normally use to access the service you wish to connect to. So, in the Dropbox example, you would need the credentials to your Dropbox account in order to create the connection to Dropbox. 

### Create a connection to Dropbox
> [!INCLUDE [Steps to create a connection to Dropbox](../../includes/connectors-create-api-dropbox.md)]
> 
> 

## Use a Dropbox trigger
A trigger is an event that can be used to start the workflow defined in a logic app. [Learn more about triggers](../logic-apps/logic-apps-overview.md#logic-app-concepts).

In this example, we will use the **When a file is created** trigger. When this trigger occurs, we will call the **Get file content using path** Dropbox action. 

1. Enter *dropbox* in the search box on the Logic Apps designer, then select the **Dropbox - When a file is created** trigger.      
   ![](../../includes/media/connectors-create-api-dropbox/using-dropbox-trigger.PNG)  
2. Select the folder in which you want to track file creation. Select ... (identified in the red box) and browse to the folder you wish to select for the trigger's input.  
   ![](../../includes/media/connectors-create-api-dropbox/using-dropbox-trigger-2.PNG)  

## Use a Dropbox action
An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../logic-apps/logic-apps-overview.md#logic-app-concepts).

Now that the trigger has been added, follow these steps to add an action that will get the new file's content.

1. Select **+ New Step** to add the action you would like to take when a new file is created.  
   ![](../../includes/media/connectors-create-api-dropbox/using-dropbox-action.PNG)
2. Select **Add an action**. This opens the search box where you can search for any action you would like to take.  
   ![](../../includes/media/connectors-create-api-dropbox/using-dropbox-action-2.PNG)
3. Enter *dropbox* to search for actions related to Dropbox.  
4. Select **Dropbox - Get file content using path** as the action to take when a new file is created in the selected Dropbox folder. The action control block opens. You will be prompted to authorize your logic app to access your Dropbox account if you have not done so previously.  
   ![](../../includes/media/connectors-create-api-dropbox/using-dropbox-action-3.PNG)  
5. Select ... (located at the right side of the **File Path** control) and browse to the file path you would like to use. Or, use the **file path** token to speed up your logic app creation.  
   ![](../../includes/media/connectors-create-api-dropbox/using-dropbox-action-4.PNG)  
6. Save your work and create a new file in Dropbox to activate your workflow.  

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/dropbox/).

## More connectors
Go back to the [APIs list](apis-list.md).
