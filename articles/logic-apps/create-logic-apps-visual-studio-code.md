---
title: Create and edit automated workflows with Visual Studio Code - Azure Logic Apps | Microsoft Docs
description: Create and edit logic app workflow definitions in Visual Studio Code (VS Code)
services: logic-apps
ms.service: logic-apps
ms.workload: azure-vs
author: ecfan
ms.author: estfan
ms.topic: article
ms.reviewer: klam, deli, LADocs
ms.suite: integration
ms.date: 09/24/2018
---

# Create and manage automated logic app workflows in Visual Studio Code

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) 
and Visual Studio Code, you can create and edit logic apps that help 
you automate tasks, workflows, and processes for integrating apps, 
data, systems, and services across organizations and enterprises. 
This article shows how you can build and edit logic app workflow 
definitions by working in a code-based experience. You can also 
view and edit existing logic apps already deployed to 
<a href="https://docs.microsoft.com/azure/guides/developer/azure-developer-guide" target="_blank">Azure</a> 
in the cloud. 

Although you can perform these same tasks in the 
<a href="https://portal.azure.com" target="_blank">Azure portal</a> 
and in Visual Studio, you can get started faster in Visual Studio 
Code when you want to work directly in code. 

For this article, you can create the same logic app as in the 
[quickstart for creating a logic app in the Azure portal](../logic-apps/quickstart-create-first-logic-app-workflow.md), 
which focuses more on the basic concepts. In Visual Studio Code, 
the logic app looks like this example:

![Finished logic app](./media/create-logic-apps-visual-studio-code/overview.png)

## Prerequisites

Before you start, make sure you have these items:

* If you don't have an Azure subscription, 
<a href="https://azure.microsoft.com/free/" target="_blank">sign up for a free Azure account</a>.

* Basic knowledge about logic app 
[workflow definitions](../logic-apps/logic-apps-workflow-definition-language.md) 
and their structure, which uses JavaScript Object Notation (JSON)

* Download and install these tools, if you don't have them already: 

  * <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code version 1.25.1 or later</a>, which is free. 

  * <a href="" target="_blank">Visual Code extension for Azure Logic Apps</a> 
  
    To learn how to download and install extensions 
    directly inside Visual Studio Code, see <a href="https://code.visualstudio.com/docs/editor/extension-gallery" target="_blank">Extension Marketplace</a>. 
    Make sure you reload Visual Studio Code after installing. 
    To check that the extension installed correctly, 
    the Azure icon appears in your Visual Studio Code toolbar.

* Access to the web for signing in to Azure and your Azure subscription

<a name="sign-in-azure"></a>

## Sign in to Azure

1. Open Visual Studio Code. On the Visual Studio Code toolbar, 
select the Azure icon. 

   ![Select Azure icon](./media/create-logic-apps-visual-studio-code/open-extension.png)

1. In the Azure window, under **Logic Apps**, 
select **Sign in to Azure**. 

   ![Select "Sign in to Azure"](./media/create-logic-apps-visual-studio-code/sign-in-azure.png)

   You're now prompted to sign in by using 
   the provided authentication code. 

1. Copy the authentication code, and then choose **Copy & Open**, 
which opens a new browser window.

   ![Sign-in prompt](./media/create-logic-apps-visual-studio-code/sign-in-prompt.png)

1. Enter your authentication code. When prompted, choose **Continue**.

   ![Enter code](./media/create-logic-apps-visual-studio-code/authentication-code.png)

1. Select your Azure account. After you've signed in, 
you can close your browser, and return to Visual Studio Code.

1. In the Azure window, which now shows the Azure subscriptions in your account, 
select the Azure subscription you want to use.

   ![Select subscription](./media/create-logic-apps-visual-studio-code/select-azure-subscription.png)

   After expanding your subscription, you can now find 
   any and all existing logic apps in your subscription.
   If you don't see the subscriptions you expect, 
   next to **Logic Apps** label, choose **Select Subscriptions** (filter icon).
   Find and select the subscriptions you want.

<a name="create-logic-app"></a>

## Create logic app

1. On the **File** menu, select **New File**.

   Visual Studio Code opens an empty plain text file. 

1. In the empty file, start creating your logic app's workflow definition. 
For reference, see the [Workflow Definition Language schema for logic apps](../logic-apps/logic-apps-workflow-definition-language.md).

   For example, here's a sample logic definition. Usually, 
   JSON elements appear alphabetically within each section, 
   but this sample roughly shows these elements in the order 
   that the workflow steps appear on the designer.

   ```json
   {
      "$schema": "https://schema.management.azure.com/providers/Microsoft.Logic/schemas/2016-06-01/workflowdefinition.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {
         "$connections": {
            "defaultValue": {},
            "type": "Object"
         }
      },
      "triggers": {
         "When_a_feed_item_is_published": {
            "recurrence": {
               "frequency": "Minute",
               "interval": 1
            },
            "splitOn": "@triggerBody()?['value']",
            "type": "ApiConnection",
            "inputs": {
               "host": {
                  "connection": {
                     "name": "@parameters('$connections')['rss']['connectionId']"
                  }
               },
               "method": "get",
               "path": "/OnNewFeed",
               "queries": {
                  "feedUrl": "http://feeds.reuters.com/reuters/topNews"
               }
            }
         }
      },
      "actions": {
         "Send_an_email": {
            "runAfter": {},
            "type": "ApiConnection",
            "inputs": {
               "body": {
                  "Body": "Title: @{triggerBody()?['title']}\n\nDate published: @{triggerBody()?['publishDate']}\n\nLink: @{triggerBody()?['primaryLink']}",
                  "Subject": "New RSS item: @{triggerBody()?['title']}",
                  "To": "Sophie.Owen@contoso.com"
               },
               "host": {
                  "connection": {
                     "name": "@parameters('$connections')['outlook']['connectionId']"
                  }
               },
               "method": "post",
               "path": "/Mail"
            }
         }
      },
      "outputs": {}
   }   
   ```

1. When you're done, save your file as a **JSON** (.json) file. 

   Visual Studio Code prompts you to confirm uploading your 
   logic app definition to your Azure subscription in Azure. 

1. When Visual Studio Code prompts you, choose **Upload**.

<a name="edit-logic-app"></a>

## Edit logic app

To work on an existing logic app that's already deployed in Azure, 
you can open the workflow definition file for that app in Visual Studio Code.

1. Open Visual Studio Code, and [sign in to Azure](#sign-in). 

1. In the Azure window, under **Logic Apps**, 
expand your Azure subscription, and select the logic app you want. 

1. Next to your logic app's name, choose the edit icon.

   Visual Studio Code opens the .logicapp.json file 
   for your logic app's workflow definition.

   ![Opened logic app workflow definition](./media/create-logic-apps-visual-studio-code/edit-logic-app-workflow-definition-file.png)

1. Make your changes in your logic app's definition.

1. When you're done, save your changes.

1. When Visual Studio Code prompts you to update your 
logic app definition in your Azure subscription, 
choose **Upload**. 

   ![Upload your edits](./media/create-logic-apps-visual-studio-code/upload-logic-app-changes.png)

## Get support

* For questions, visit the <a href="https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps" target="_blank">Azure Logic Apps forum</a>.
* To submit or vote on feature ideas, visit the <a href="http://aka.ms/logicapps-wish" target="_blank">Logic Apps user feedback site</a>.