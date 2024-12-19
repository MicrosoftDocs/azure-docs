---
title: Export Standard logic apps to Visual Studio Code
description: Download your Standard logic app and workflows from the Azure portal into Visual Studio Code.
ms.suite: integration
services: logic-apps
author: wsilveiranz
ms.author: wsilveira
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 12/19/2024
# As an Azure Logic Apps developer, I want to export my Standard logic app and workflows from the Azure portal into Visual Studio Code.
---

# Export Standard logic app workflows from Azure portal to Visual Studio Code

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

If you currently work on Standard logic app workflows using the Azure portal, you might find yourself wanting to use Visual Studio Code instead. When you switch to Visual Studio Code, you get the following benefits:

- More control over your development environment.
- Expanded debugging and testing capabilities.
- Effectively use version control with your app projects.

This guide shows how to download your Standard logic app as a zip file package from the portal. This package contains your logic app workflows, connections, host configuration, and app settings. In Visual Studio Code, you can then use this package to create a workspace that contains your logic app project files.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* [Visual Studio Code and its prerequisites](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#prerequisites)

* The Standard logic app and workflows that you want to export

## Download logic app from portal

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource.

1. On the logic app menu, select **Overview**. On the **Overview** page toolbar, select **Download app content**.

1. When the confirmation message appears, select **Download**.

   The portal creates a zip file package named **<*logic-app-name*>.zip**.

1. In the **Downloads** message box, select **Save as**, browse to the local folder that you want, and select **Save**.

## Create workspace in Visual Studio Code

1. In Visual Studio Code, follow these steps if you're not already set up:

   1. [Set up Visual Studio Code](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#set-up-visual-studio-code).

   1. [Connect to your Azure account](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code#connect-to-your-azure-account).

1. In the Azure window, on the **Workspace** toolbar, open the **Azure Logic Apps** menu, and select **Create new logic app workspace from package...**.

   The **Create New Logic App Workspace from Package** list opens and shows a prompt to select the zip file package that you want to import.

1. From the opened list, select **Browse**. Find and select your downloaded zip file package.

   You now get a prompt to select the folder where you want to create your workspace.

1. From the opened list, select **Browse**. Find and select the local repository folder where you want to create your workspace.

   You now get a prompt to enter workspace name.

1. Provide a name to use for your workspace.

   You now get a prompt to enter a project name.

1. Provide a name to use for your logic app project.

   You now get a prompt to open your project in the current Visual Studio Code window or a new window.

1. Select the window where you want to open your project.

   If your workflows don't use any managed, Azure-hosted connectors, you get a prompt to choose if you want to include these connectors in the connector gallery when you search for operations to add.

1. To include these Azure-hosted connectors, select **Use connectors from Azure**.

1. At the prompt, select your Azure subscription and the resource group where you want to create any Azure-hosted connections during local development.

   When you finish, the Explorer window opens in Visual Studio Code and shows your created workspace with your logic app project, including all workflows, connection references, and relevant local app settings.

   > [!IMPORTANT]
   >
   > If you have any connections that use a managed identity for authentication, make sure 
   > that you update these connections by following the steps in the created project's 
   > **README.md** file, which automatically opens after workspace creation. These steps 
   > describe how to update these connections for local development, debugging, and testing.

## Related content

- [Create Standard logic app workflow in single-tenant Azure Logic Apps using Visual Studio Code](/azure/logic-apps/create-single-tenant-workflows-visual-studio-code)
