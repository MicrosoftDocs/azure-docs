---
title: Automate tasks and workflows with Visual Studio Code
description: Create or edit logic app workflow definitions by using Visual Studio Code (VS Code)
services: logic-apps
ms.suite: integration
ms.reviewer: jonfan, deli, logicappspm
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/24/2021

# Customer intent: As a developer, I want to create my first automated workflow by using Azure Logic Apps while working in Visual Studio Code
---

# Quickstart: Create and manage logic app workflow definitions by using Visual Studio Code

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and Visual Studio Code, you can create and manage logic apps that help you automate tasks, workflows, and processes for integrating apps, data, systems, and services across organizations and enterprises. This quickstart shows how you can create and edit the underlying workflow definitions, which use JavaScript Object Notation (JSON), for logic apps through a code-based experience. You can also work on existing logic apps that are already deployed to Azure.

Although you can perform these same tasks in the [Azure portal](https://portal.azure.com) and in Visual Studio, you can get started faster in Visual Studio Code when you're already familiar with logic app definitions and want to work directly in code. For example, you can disable, enable, delete, and refresh already created logic apps. Also, you can work on logic apps and integration accounts from any development platform where Visual Studio Code runs, such as Linux, Windows, and Mac.

For this article, you can create the same logic app from this [quickstart](../logic-apps/quickstart-create-first-logic-app-workflow.md), which focuses more on the basic concepts. You can also [learn to create the example app in Visual Studio](quickstart-create-logic-apps-with-visual-studio.md), and [learn to create and manage apps through the Azure Command-Line Interface (Azure CLI)](quickstart-logic-apps-azure-cli.md). In Visual Studio Code, the logic app looks like this example:

![Example logic app workflow definition](./media/quickstart-create-logic-apps-visual-studio-code/visual-studio-code-overview.png)

## Prerequisites

Before you start, make sure that you have these items:

* If you don't have an Azure account and subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* Basic knowledge about [logic app workflow definitions](../logic-apps/logic-apps-workflow-definition-language.md) and their structure as described with JSON

  If you're new to Logic Apps, try this [quickstart](../logic-apps/quickstart-create-first-logic-app-workflow.md), which creates your first logic apps in the Azure portal and focuses more on the basic concepts.

* Access to the web for signing in to Azure and your Azure subscription

* Download and install these tools, if you don't have them already:

  * [Visual Studio Code version 1.25.1 or later](https://code.visualstudio.com/), which is free

  * Visual Studio Code extension for Azure Logic Apps

    You can download and install this extension from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-logicapps) or directly from inside Visual Studio Code. Make sure that you reload Visual Studio Code after installing.

    ![Find "Visual Studio Code extension for Azure Logic Apps"](./media/quickstart-create-logic-apps-visual-studio-code/find-install-logic-apps-extension.png)

    To check that the extension installed correctly, select the Azure icon that appears in your Visual Studio Code toolbar.

    ![Confirm extension correctly installed](./media/quickstart-create-logic-apps-visual-studio-code/confirm-installed-visual-studio-code-extension.png)

    For more information, see [Extension Marketplace](https://code.visualstudio.com/docs/editor/extension-gallery). To contribute to this extension's open-source version, visit the [Azure Logic Apps extension for Visual Studio Code on GitHub](https://github.com/Microsoft/vscode-azurelogicapps).

* If your logic app needs to communicate through a firewall that limits traffic to specific IP addresses, that firewall needs to allow access for *both* the [inbound](logic-apps-limits-and-config.md#inbound) and [outbound](logic-apps-limits-and-config.md#outbound) IP addresses used by the Logic Apps service or runtime in the Azure region where your logic app exists. If your logic app also uses [managed connectors](../connectors/managed.md), such as the Office 365 Outlook connector or SQL connector, or uses [custom connectors](/connectors/custom-connectors/), the firewall also needs to allow access for *all* the [managed connector outbound IP addresses](logic-apps-limits-and-config.md#outbound) in your logic app's Azure region.

<a name="access-azure"></a>

## Access Azure from Visual Studio

1. Open Visual Studio Code. On the Visual Studio Code toolbar, select the Azure icon.

   ![Select Azure icon on Visual Studio Code toolbar](./media/quickstart-create-logic-apps-visual-studio-code/open-extensions-visual-studio-code.png)

1. In the Azure window, under **Logic Apps**, select **Sign in to Azure**. When the Microsoft sign-in page prompts you, sign in with your Azure account.

   ![Select "Sign in to Azure"](./media/quickstart-create-logic-apps-visual-studio-code/sign-in-azure-visual-studio-code.png)

   1. If sign in takes longer than usual, Visual Studio Code prompts you to sign in through a Microsoft authentication website by providing you a device code. To sign in with the code instead, select **Use Device Code**.

      ![Continue with device code instead](./media/quickstart-create-logic-apps-visual-studio-code/use-device-code-prompt.png)

   1. To copy the code, select **Copy & Open**.

      ![Copy code for Azure sign in](./media/quickstart-create-logic-apps-visual-studio-code/sign-in-prompt-authentication.png)

   1. To open a new browser window and continue to the authentication website, select **Open Link**.

      ![Confirm opening a browser and going to authentication website](./media/quickstart-create-logic-apps-visual-studio-code/confirm-open-link.png)

   1. On the **Sign in to your account** page, enter your authentication code, and select **Next**.

      ![Enter authentication code for Azure sign in](./media/quickstart-create-logic-apps-visual-studio-code/authentication-code-azure-sign-in.png)

1. Select your Azure account. After you sign in, you can close your browser, and return to Visual Studio Code.

   In the Azure pane, the **Logic Apps** and **Integration Accounts** sections now show the Azure subscriptions that are associated with your account. However, if you don't see the subscriptions that you expect, or if the sections show too many subscriptions, follow these steps:

   1. Move your pointer over the **Logic Apps** label. When the toolbar appears, select **Select Subscriptions** (filter icon).

      ![Find or filter Azure subscriptions](./media/quickstart-create-logic-apps-visual-studio-code/find-or-filter-subscriptions.png)

   1. From the list that appears, select the subscriptions that you want to appear.

1. Under **Logic Apps**, select the subscription that you want. The subscription node expands and shows any logic apps that exist in that subscription.

   ![Select your Azure subscription](./media/quickstart-create-logic-apps-visual-studio-code/select-azure-subscription.png)

   > [!TIP]
   > Under **Integration Accounts**, selecting your subscription shows any integration accounts that exist in that subscription.

<a name="create-logic-app"></a>

## Create new logic app

1. If you haven't signed in to your Azure account and subscription yet from inside Visual Studio Code, follow the [previous steps to sign in now](#access-azure).

1. In Visual Studio Code, under **Logic Apps**, open your subscription's shortcut menu, and select **Create Logic App**.

   ![From subscription menu, select "Create Logic App"](./media/quickstart-create-logic-apps-visual-studio-code/create-logic-app-visual-studio-code.png)

   A list appears and shows any Azure resource groups in your subscription.

1. From resource group list, select either **Create a new resource group** or an existing resource group. For this example, create a new resource group.

   ![Create a new Azure resource group](./media/quickstart-create-logic-apps-visual-studio-code/select-or-create-azure-resource-group.png)

1. Provide a name for your Azure resource group, and press ENTER.

   ![Provide name for your Azure resource group](./media/quickstart-create-logic-apps-visual-studio-code/enter-name-resource-group.png)

1. Select the Azure region where you want to save your logic app's metadata.

   ![Select Azure location for saving logic app metadata](./media/quickstart-create-logic-apps-visual-studio-code/select-azure-location-new-resources.png)

1. Provide a name for your logic app, and press Enter.

   ![Provide name for your logic app](./media/quickstart-create-logic-apps-visual-studio-code/enter-name-logic-app.png)

   In the Azure window, under your Azure subscription, your new and blank logic app appears. Visual Studio Code also opens a JSON (.logicapp.json) file, which includes a skeleton workflow definition for your logic app. Now you can start manually authoring your logic app's workflow definition in this JSON file. For technical reference about the structure and syntax for a workflow definition, see the [Workflow Definition Language schema for Azure Logic Apps](../logic-apps/logic-apps-workflow-definition-language.md).

   ![Empty logic app workflow definition JSON file](./media/quickstart-create-logic-apps-visual-studio-code/empty-logic-app-workflow-definition.png)

   For example, here is a sample logic app workflow definition, which starts with an RSS trigger and an Office 365 Outlook action. Usually, JSON elements appear alphabetically in each section. However, this sample shows these elements roughly in the order that the logic app's steps appear in the designer.

   > [!IMPORTANT]
   > If you want to reuse this sample logic app definition, you need an organizational account, 
   > for example, @fabrikam.com. Make sure that you replace the fictitious email address with your own 
   > email address. To use a different email connector, such as Outlook.com or Gmail, replace the 
   > `Send_an_email_action` action with a similar action available from an 
   > [email connector that's supported by Azure Logic Apps](../connectors/apis-list.md).
   >
   > If you want to use the Gmail connector, only G-Suite business accounts can use this connector without restriction in logic apps. 
   > If you have a Gmail consumer account, you can use this connector with only specific Google-approved services, or you can 
   > [create a Google client app to use for authentication with your Gmail connector](/connectors/gmail/#authentication-and-bring-your-own-application). 
   > For more information, see [Data security and privacy policies for Google connectors in Azure Logic Apps](../connectors/connectors-google-data-security-privacy-policy.md).

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
         "Send_an_email_(V2)": {
            "runAfter": {},
            "type": "ApiConnection",
            "inputs": {
               "body": {
                  "Body": "<p>Title: @{triggerBody()?['title']}<br>\n<br>\nDate published: @{triggerBody()?['updatedOn']}<br>\n<br>\nLink: @{triggerBody()?['primaryLink']}</p>",
                  "Subject": "RSS item: @{triggerBody()?['title']}",
                  "To": "sophia-owen@fabrikam.com"
               },
               "host": {
                  "connection": {
                     "name": "@parameters('$connections')['office365']['connectionId']"
                  }
               },
               "method": "post",
               "path": "/v2/Mail"
            }
         }
      },
      "outputs": {}
   }
   ```

1. When you're done, save your logic app's workflow definition. (File menu > Save, or press Ctrl+S)

1. When you're prompted to upload your logic app to your Azure subscription, select **Upload**.

   This step publishes your logic app to the [Azure portal](https://portal.azure.com), which and makes your logic live and running in Azure.

   ![Upload new logic app to your Azure subscription](./media/quickstart-create-logic-apps-visual-studio-code/upload-new-logic-app.png)

## View logic app in designer

In Visual Studio Code, you can open your logic app in read-only design view. Although you can't edit your logic app in the designer, you can visually check your logic app's workflow by using the designer view.

In the Azure window, under **Logic Apps**, open your logic app's shortcut menu, and select **Open in Designer**.

The read-only designer opens in a separate window and shows your logic app's workflow, for example:

![View logic app in read-only designer](./media/quickstart-create-logic-apps-visual-studio-code/logic-app-designer-view.png)

## View in Azure portal

To review your logic app in Azure portal, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) by using the same Azure account and subscription that's associated with your logic app.

1. In the Azure portal's search box, enter your logic apps' name. From the results list, select your logic app.

   ![Your new logic app in Azure portal](./media/quickstart-create-logic-apps-visual-studio-code/published-logic-app-in-azure.png)

<a name="disable-enable-logic-app"></a>

## Disable or enable logic app

In Visual Studio Code, if you edit a published logic app and save your changes, you *overwrite* your already deployed app. To avoid breaking your logic app in production and minimize disruption, deactivate your logic app first. You can then reactive your logic app after you've confirmed that your logic app still works.

1. If you haven't signed in to your Azure account and subscription yet from inside Visual Studio Code, follow the [previous steps to sign in now](#access-azure).

1. In the Azure window, under **Logic Apps**, expand your Azure subscription so that you can view all the logic apps in that subscription.

   1. To disable the logic app that you want, open the logic app's menu, and select **Disable**.

      ![Disable your logic app](./media/quickstart-create-logic-apps-visual-studio-code/disable-published-logic-app.png)

   1. When you're ready to reactivate your logic app, open the logic app's menu, and select **Enable**.

      ![Enable your logic app](./media/quickstart-create-logic-apps-visual-studio-code/enable-published-logic-app.png)

<a name="edit-logic-app"></a>

## Edit deployed logic app

In Visual Studio Code, you can open and edit the workflow definition for an already deployed logic app in Azure.

> [!IMPORTANT] 
> Before you edit an actively running logic app in production, 
> avoid the risk in breaking that logic app and minimize disruption by 
> [disabling your logic app first](#disable-enable-logic-app).

1. If you haven't signed in to your Azure account and subscription yet from inside Visual Studio Code, follow the [previous steps to sign in now](#access-azure).

1. In the Azure window, under **Logic Apps**, expand your Azure subscription, and select the logic app you want.

1. Open your logic app's menu, and select **Open in Editor**. Or, next to your logic app's name, select the edit icon.

   ![Open editor for existing logic app](./media/quickstart-create-logic-apps-visual-studio-code/open-editor-existing-logic-app.png)

   Visual Studio Code opens the .logicapp.json file in your local temporary folder so that you can view your logic app's workflow definition.

   ![View workflow definition for published logic app](./media/quickstart-create-logic-apps-visual-studio-code/edit-published-logic-app-workflow-definition.png)

1. Make your changes in the logic app's workflow definition.

1. When you're done, save your changes. (File menu > Save, or press Ctrl+S)

1. When you're prompted to upload your changes and *overwrite* your existing logic app in the Azure portal, select **Upload**.

   This step publishes your updates to your logic app in the [Azure portal](https://portal.azure.com).

   ![Upload edits to logic app definition in Azure](./media/quickstart-create-logic-apps-visual-studio-code/upload-logic-app-changes.png)

## View or promote other versions

In Visual Studio Code, you can open and review the earlier versions for your logic app. You can also promote an earlier version to the current version.

> [!IMPORTANT] 
> Before you change an actively running logic app in production, 
> avoid the risk in breaking that logic app and minimize disruption by 
> [disabling your logic app first](#disable-enable-logic-app).

1. In the Azure window, under **Logic Apps**, expand your Azure subscription so that you can view all the logic apps in that subscription.

1. Under your subscription, expand your logic app, and expand **Versions**.

   The **Versions** list shows your logic app's earlier versions, if any exist.

   ![Your logic app's previous versions](./media/quickstart-create-logic-apps-visual-studio-code/view-previous-versions.png)

1. To view an earlier version, select either step:

   * To view the JSON definition, under **Versions**, select the version number for that definition. Or, open that version's shortcut menu, and select **Open in Editor**.

     A new file opens on your local computer and shows that version's JSON definition.

   * To view the version in the read-only designer view, open that version's shortcut menu, and select **Open in Designer**.

1. To promote an earlier version to the current version, follow these steps:

   1. Under **Versions**, open the earlier version's shortcut menu, and select **Promote**.

      ![Promote earlier version](./media/quickstart-create-logic-apps-visual-studio-code/promote-earlier-version.png)

   1. To continue after Visual Studio Code prompts you for confirmation, select **Yes**.

      ![Confirm promoting earlier version](./media/quickstart-create-logic-apps-visual-studio-code/confirm-promote-version.png)

      Visual Studio Code promotes the selected version to the current version and assigns a new number to the promoted version. The previously current version now appears under the promoted version.

## Next steps

> [!div class="nextstepaction"]
> [Create stateful and stateless logic apps in Visual Studio Code (Preview)](../logic-apps/create-stateful-stateless-workflows-visual-studio-code.md)
