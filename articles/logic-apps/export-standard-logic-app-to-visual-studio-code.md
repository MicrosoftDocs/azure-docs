---
title: Export Standard logic apps to Visual Studio Code
description: Download your Standard logic app and workflows from the Azure portal into Visual Studio Code.
ms.suite: integration
services: logic-apps
author: wsilveiranz
ms.author: wsilveira
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 02/20/2025
# As an Azure Logic Apps developer, I want to export my Standard logic app and workflows from the Azure portal into Visual Studio Code.
---

# Export Standard logic apps from Azure portal to Visual Studio Code

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

If you work on Standard logic app workflows using the Azure portal, you might find yourself wanting to use Visual Studio Code instead at some point. When you switch to Visual Studio Code and install the Azure Logic Apps (Standard) extension, you get the expanded benefits available only with the extension, for example:

- Better control over your development environment.
- Faster development experience with local debugging and testing.
- Integration with source control repositories.
- Automated parameterization for new and existing connections, which simplifies cross-environment deployment.
- Automated generation for deployment scripts, templates for Azure connectors, and deployment with CI/CD pipelines.

This guide shows how to download your Standard logic app as a zip file package from the portal. This package contains your logic app workflows, connections, host configuration, and app settings. In Visual Studio Code, you can then use this package to create a workspace that contains your logic app project files.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* [Visual Studio Code with the Azure Logic Apps (Standard) extension installed and their prerequisites](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#prerequisites).

* The Standard logic app and workflows that you want to export from the Azure portal.

## Download logic app from the portal

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, select **Overview**. On the **Overview** page toolbar, select **Download app content**.

   :::image type="content" source="media/export-standard-logic-app-to-visual-studio-code/download-app-content.png" alt-text="Screenshot shows Azure portal, Standard logic app, Overview page toolbar, and selected option for Download app content.":::

1. When the confirmation message appears, select **Download**.

   The portal creates a zip file package named **<*logic-app-name*>.zip**.

1. In the **Downloads** message box, select **Save as**, browse to the local folder that you want, and select **Save**.

   > [!NOTE]
   >
   > Leave the package zipped because you don't have to extract the zip file for workspace creation.

## Create your workspace in Visual Studio Code

1. In Visual Studio Code, follow these steps if you're not already set up:

   1. [Set up Visual Studio Code](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#set-up-visual-studio-code).

   1. [Connect to your Azure account](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#connect-to-your-azure-account).

1. In the Azure window, on the **Workspace** toolbar, open the **Azure Logic Apps** menu, and select **Create new logic app workspace from package...**.

   :::image type="content" source="media/export-standard-logic-app-to-visual-studio-code/create-workspace-from-package.png" alt-text="Screenshot shows Visual Studio Code, Azure window, and Workspace toolbar with selected button for Azure Logic Apps, and selected option for Create new logic app workspace from package.":::

   The **Create New Logic App Workspace from Package** prompt window opens so you can select the zip file package that you want to import.

   :::image type="content" source="media/export-standard-logic-app-to-visual-studio-code/select-zip-file-package.png" alt-text="Screenshot shows Visual Studio Code with prompt to select previously downloaded zip file package.":::

1. From the prompt list, select **Browse**. Find and select your zip file package. When you're done, choose **Select package file**.

   You're now prompted to select the folder where you want to create your workspace.

1. From the prompt list, select **Browse**. Find and select the local repository folder where you want to create your workspace. When you're done, choose **Select**. Follow the additional prompts to continue creating your workspace.

1. Enter a name to use for your workspace.

1. Enter a name to use for your logic app project.

   You're now prompted to open your project in the current Visual Studio Code window or a new window.

1. Select **Open in current window** or **Open new window** to choose the window where to open your project.

   If your logic app's workflows don't use any [managed, Azure-hosted connectors](/azure/connectors/managed), you're prompted to include these connectors in the connector gallery where you can find connector operations to add.

1. To include the managed, Azure-hosted connectors in the connector gallery, select **Use connectors from Azure**.

1. Select the Azure subscription to use for logic app project development and deployment.

1. Select the resource group where you want to create any Azure-hosted connections created during local development.

1. When you're prompted to let the Azure Logic Apps extension sign in using Microsoft Entra ID, select **Allow**.

1. Select your Microsoft Entra ID identity.

   When you finish, the Explorer window opens in Visual Studio Code. This window contains your new workspace with your logic app project, which includes all the workflows, connection references, and relevant local app settings.

   The project's **README.md** file automatically opens after workspace creation, for example:

   :::image type="content" source="media/export-standard-logic-app-to-visual-studio-code/workspace-and-project.png" alt-text="Screenshot shows Visual Studio Code, Explorer window, workspace, and logic app project.":::

   The **README.md** file contains important post deployment steps that describe how to update any connections that use a managed identity for authentication.

## After workspace creation

If you have connections that use a managed identity, make sure that you update these connections for local development and debugging by using the steps in the project's **README.md** file.

## Related content

For more information about managing your Standard logic app project in Visual Studio Code, see the following documentation:

- [Create Standard logic app workflow in single-tenant Azure Logic Apps using Visual Studio Code](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code)
