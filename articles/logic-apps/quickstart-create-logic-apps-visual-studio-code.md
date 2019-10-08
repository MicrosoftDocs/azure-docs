---
title: Create and manage workflows in Visual Studio Code - Azure Logic Apps
description: Quickstart - Create and manage logic app JSON definitions in Visual Studio Code (VS Code)
services: logic-apps
ms.service: logic-apps
ms.suite: integration
ms.workload: azure-vs
author: ecfan
ms.author: estfan
ms.manager: carmonm
ms.reviewer: klam, deli, LADocs
ms.topic: quickstart
ms.custom: mvc
ms.date: 10/05/2018
---

# Quickstart: Create and manage logic app definitions by using Visual Studio Code

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and Visual Studio Code, you can create and manage logic apps that help you automate tasks, workflows, and processes for integrating apps, data, systems, and services across organizations and enterprises. This quickstart shows how you can create and edit logic app workflow definitions by working with the workflow definition schema in JavaScript Object Notation (JSON) through a code-based experience. You can also work on existing logic apps that are already deployed to Azure.

Although you can perform these same tasks in the [Azure portal](https://portal.azure.com) and in Visual Studio, you can get started faster in Visual Studio Code when you're already familiar with logic app definitions and want to work directly in code. For example, you can disable, enable, delete, and refresh already created logic apps. Also, you can work on logic apps and integration accounts from any development platform where Visual Studio Code runs, such as Linux, Windows, and Mac.

For this article, you can create the same logic app from this [quickstart](../logic-apps/quickstart-create-first-logic-app-workflow.md), which focuses more on the basic concepts. In Visual Studio Code, the logic app looks like this example:

![Example logic app workflow definition](./media/create-logic-apps-visual-studio-code/visual-studio-code-overview.png)

Before you start, make sure you have these items:

* If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* Basic knowledge about [logic app workflow definitions](../logic-apps/logic-apps-workflow-definition-language.md) and their structure, which uses JavaScript Object Notation (JSON)

  If you're new to Logic Apps, try this [quickstart](../logic-apps/quickstart-create-first-logic-app-workflow.md), which creates your first logic apps in the Azure portal and focuses more on the basic concepts.

* Access to the web for signing in to Azure and your Azure subscription

* Download and install these tools, if you don't have them already:

  * [Visual Studio Code version 1.25.1 or later](https://code.visualstudio.com/), which is free

  * Visual Studio Code extension for Azure Logic Apps

    You can download and install this extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-logicapps) or directly from inside Visual Studio Code. Make sure that you reload Visual Studio Code after installing.

    ![Find "Visual Studio Code extension for Azure Logic Apps"](./media/create-logic-apps-visual-studio-code/find-install-logic-apps-extension.png)

    To check that the extension installed correctly, select the Azure icon that appears in your Visual Studio Code toolbar.

    ![Confirm extension correctly installed](./media/create-logic-apps-visual-studio-code/confirm-installed-visual-studio-code-extension.png)

    For more information, see [Extension Marketplace](https://code.visualstudio.com/docs/editor/extension-gallery). To contribute to this extension's open-source version, visit the [Azure Logic Apps extension for Visual Studio Code on GitHub](https://github.com/Microsoft/vscode-azurelogicapps).

<a name="sign-in-azure"></a>

## Sign in to Azure

1. Open Visual Studio Code. On the Visual Studio Code toolbar, select the Azure icon.

   ![Select Azure icon on Visual Studio Code toolbar](./media/create-logic-apps-visual-studio-code/open-extensions-visual-studio-code.png)

1. In the Azure window, under **Logic Apps**, select **Sign in to Azure**.

   ![Select "Sign in to Azure"](./media/create-logic-apps-visual-studio-code/sign-in-azure-visual-studio-code.png)

   You're now prompted to sign in by using the provided authentication code.

1. Copy the authentication code, and then select **Copy & Open**, which opens a new browser window.

   ![Copy authentication code to use for Azure sign-in](./media/create-logic-apps-visual-studio-code/sign-in-prompt-authentication.png)

1. Enter your authentication code. When prompted, select **Continue**.

   ![Enter authentication code for Azure sign-in](./media/create-logic-apps-visual-studio-code/authentication-code-azure-sign-in.png)

1. Select your Azure account. After you sign in, you can close your browser, and return to Visual Studio Code.

   In the Azure window, the Logic Apps pane and Integration Accounts pane now show the Azure subscriptions in your account.

   ![Select your Azure subscription](./media/create-logic-apps-visual-studio-code/select-azure-subscription.png)

   If you don't see the subscriptions that you expect, next to **Logic Apps** label, select the **Select Subscriptions** (filter icon). Find and select the subscriptions that you want.

1. To view any existing logic apps or integration accounts in your Azure subscription, expand your subscription.

   ![View logic apps and integration accounts](./media/create-logic-apps-visual-studio-code/view-existing-logic-apps-azure.png)

<a name="create-logic-app"></a>

## Create logic app

1. If you haven't signed in to your Azure subscription from inside Visual Studio Code, follow the steps in this article to [sign in now](#sign-in-azure).

1. From your subscription's context menu, select **Create**.

   ![Select "Create" from subscription menu](./media/create-logic-apps-visual-studio-code/create-logic-app-visual-studio-code.png)

1. From the list that shows Azure resource groups in your subscription, select an existing resource group or **Create a new resource group**.

   This example creates a new resource group:

   ![Create your new Azure resource group](./media/create-logic-apps-visual-studio-code/select-or-create-azure-resource-group.png)

1. Provide a name for your Azure resource group, and then press ENTER.

   ![Provide name for your Azure resource group](./media/create-logic-apps-visual-studio-code/enter-name-resource-group.png)

1. Select the datacenter location for where to save your logic app's metadata.

   ![Select Azure location for saving logic app metadata](./media/create-logic-apps-visual-studio-code/select-azure-location-new-resources.png)

1. Provide a name for your logic app, and then press ENTER.

   ![Provide name for your logic app](./media/create-logic-apps-visual-studio-code/enter-name-logic-app.png)

   Your new logic app now appears in the Azure window, under your Azure subscription. Now you can start creating your logic app's workflow definition.

1. From your logic app's shortcut menu, select **Open in Editor**.

   ![Open logic app in code view editor](./media/create-logic-apps-visual-studio-code/open-new-logic-app-visual-studio-code.png)

   Visual Studio Code opens a logic app workflow definition template (.logicapp.json file) so that you can start creating your logic app's workflow.

   ![New logic app workflow definition](./media/create-logic-apps-visual-studio-code/blank-logic-app-workflow-definition.png)

1. In the logic app workflow definition template file, start building your logic app's workflow definition.
For technical reference, see the [Workflow Definition Language schema for Azure Logic Apps](../logic-apps/logic-apps-workflow-definition-language.md).

   Here is an example logic definition. Usually, JSON elements appear alphabetically in each section. However, this sample shows these elements roughly in the order that the logic app's steps appear in the designer.

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

1. When you're done, save your logic app definition file. When Visual Studio Code prompts you to confirm uploading your logic app definition to your Azure subscription, select **Upload**.

   ![Upload new logic app to your Azure subscription](./media/create-logic-apps-visual-studio-code/upload-new-logic-app.png)

   After Visual Studio Code publishes your logic app to Azure, you can find your app now live and running in the Azure portal.

   ![Logic app published in Azure portal](./media/create-logic-apps-visual-studio-code/published-logic-app-in-azure.png)

<a name="edit-logic-app"></a>

## Edit logic app

To work on a logic app that's published in Azure, you can open that logic app's definition by using Visual Studio Code.

1. If you haven't signed in to your Azure subscription from inside Visual Studio Code, follow the steps in this article to [sign in now](#sign-in-azure).

1. In the Azure window, under **Logic Apps**, expand your Azure subscription, and select the logic app you want.

1. From your logic app's menu, select **Open in Editor**. Or, next to your logic app's name, select the edit icon.

   ![Open editor for existing logic app](./media/create-logic-apps-visual-studio-code/open-editor-existing-logic-app.png)

   Visual Studio Code opens the .logicapp.json file for your logic app's workflow definition.

   ![Opened logic app workflow definition](./media/create-logic-apps-visual-studio-code/edit-logic-app-workflow-definition-file.png)

1. Make your changes in your logic app's definition.

1. When you're done, save your changes.

1. When Visual Studio Code prompts you to update your logic app definition in your Azure subscription, select **Upload**.

   ![Upload your edits to logic app definition](./media/create-logic-apps-visual-studio-code/upload-logic-app-changes.png)

## Next steps

> [!div class="nextstepaction"]
> * [Create logic apps with Visual Studio](../logic-apps/quickstart-create-logic-apps-with-visual-studio.md)