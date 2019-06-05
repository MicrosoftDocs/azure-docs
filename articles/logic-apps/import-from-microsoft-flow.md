---
title: Migrate from Microsoft Flow to Azure Logic Apps
description: Import your flow into Azure Logic Apps from Microsoft Flow
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: conceptual
ms.date: 06/15/2019
---

# Import flows into Azure Logic Apps from Microsoft Flow

To extend and expand the capabilities for a flow that you created with [Microsoft Flow](https://flow.microsoft.com), export that flow as a Azure Resource Manager template and open that template in Azure Logic Apps.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* 

## Export from Microsoft Flow

1. Sign in to [Microsoft Flow](https://flow.microsoft.com), and select **My flows**. Find and select your flow. On the toolbar, choose the ellipses (**...**) button. Select **Export** > **Logic Apps template (.json)**.

   ![Export flow](./media/import-from-microsoft-flow/export-flow.png)

1. Save your template to the location that you want.

For more information, see [Grow up to Azure Logic Apps](https://flow.microsoft.com/blog/grow-up-to-logic-apps/).

## Import through Azure portal

1. Sign in the [Azure portal](https://portal.azure.com) with your Azure account.

1. On the main Azure menu, select **Create a resource**. In the search box, enter "template deployment". Select **Template deployment (deploy using custom templates)**, and choose **Create**.

   ![Select "Template deployment"](./media/import-from-microsoft-flow/select-template-deployment.png)

1. From the actions list, select **Build your own template in the editor**.

   ![Select "Build your own template in the editor"](./media/import-from-microsoft-flow/build-template-in-editor.png)

1. From the **Edit template** toolbar, choose **Load file**. Find and select the JSON template that you exported from Microsoft Flow, and choose **Open**.

   ![Choose "Load file"](./media/import-from-microsoft-flow/load-file.png)

1. In the template editor, after your template's contents appear, choose **Save**.



1. Now set up these input parameters for the template:

   * Azure subscription
   * Azure resource group
   * Location for creating the logic app resource
   * Name for the logic app resource
   * Each connection that the logic app requires

     If you're creating your first logic app, all connections are created as new. Otherwise, you can reuse previously created connections across multiple logic apps by entering the names for those connections.




