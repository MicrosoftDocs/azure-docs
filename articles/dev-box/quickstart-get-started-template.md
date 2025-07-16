---
title: "Quickstart: Configure Microsoft Dev Box Resources using the Get Started template"
titleSuffix: Microsoft Dev Box
description: Discover how to deploy a dev box environment, including dev centers, projects, and pools, using the Microsoft Dev Box Get Started template.
#customer intent: As platform engineer, I want to configure Microsoft Dev Box resources using the Get Started template so that I can quickly set up a dev box environment in Azure.  
services: dev-box
ms.service: dev-box
ms.custom:
  - build-2025
  - ai-gen-docs-bap
  - ai-gen-title
  - ai-seo-date:05/08/2025
  - ai-gen-description
ms.topic: quickstart
author: RoseHJM
ms.author: rosemalcolm
ms.date: 05/08/2025
---

# Configure Microsoft Dev Box using the Get Started template

This article explains how to use the *Get Started* template to set up Microsoft Dev Box in your Azure subscription. The Get Started template is a preconfigured template that lets you quickly set up a dev box environment with a dev center, project, dev box pool, dev box definition, and related resources.

## Prerequisites
| Requirement | Details |
|-------------|---------|
| **Azure subscription** | If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/). |
| **Role** | Owner or Contributor role on an Azure subscription or resource group. |
| **Microsoft Entra ID** | Your organization must use Microsoft Entra ID for identity and access management. |
| **Microsoft Intune** | Your organization must use Microsoft Intune for device management. |
| **User licenses** | To use Dev Box, each user must be licensed for Windows 11 Enterprise or Windows 10 Enterprise, Microsoft Intune, and Microsoft Entra ID P1. These licenses are available independently and are included in the following subscriptions: </br> - Microsoft 365 F3 </br> - Microsoft 365 E3, Microsoft 365 E5 </br> - Microsoft 365 E3, Microsoft 365 E5 </br> - Microsoft 365 A3, Microsoft 365 A5 </br> - Microsoft 365 Business Premium </br> - Microsoft 365 Education Student Use Benefit |

## Use the Get Started template

1. In the Azure portal, go to **Microsoft Dev Box** and select **Get Started**.
   :::image type="content" source="media/quickstart-get-started-template/dev-box-get-started-page.png" alt-text="Screenshot of the Dev Box Get Started page in the Azure portal, showing options to configure a dev box environment.":::

1. In the **Basics** tab, enter the following values, and then select **Review + create**. The values you enter here is to create the dev center, project, and dev box pool. The dev box definition is created using the default settings:

   | Setting | Value |
   |---|---|
   | **Subscription** | Select the Azure subscription you want to use for the dev box environment. |
   | **Resource group** | Select an existing resource group or create a new one. |
   | **Region** | Select the Azure region where you want to deploy the dev box environment.|
   | **Dev Center Name** | Enter a name for the dev center. The name must be unique within the resource group.|
   | **Project Name** | Enter a name for the project. The name must be unique within the dev center.|
   | **Pool Name** | Enter a name for the dev box pool. The name must be unique within the project.|

   :::image type="content" source="media/quickstart-get-started-template/dev-box-get-started-template-basics.png" alt-text="Screenshot of the Basics tab in the Get Started template, showing fields for subscription, resource group, and region selection.":::
1. In the **Review + Create** tab, review the configuration summary, and select **Create** to deploy the dev box environment.
   :::image type="content" source="media/quickstart-get-started-template/dev-box-get-started-review-create.png" alt-text="Screenshot of the Review + Create tab in the Get Started template, showing a summary of the configuration before deployment.":::
1. Wait for the deployment to complete. Monitor the progress in the **Notifications** pane.
1. After the deployment is complete, select **Go to Resource** to view the created resources.

The following resources are created in your Azure subscription:
- **Dev center**: The central hub for managing dev boxes and resources.
- **Project**: A container for organizing dev boxes and resources within the dev center.
- **Dev box pool**: A collection of dev boxes that share the same configuration and resources.
- **Dev box definition**: A template that defines the configuration and resources for the dev boxes in the pool. The get started template uses the *Visual Studio 2022 Enterprise on Windows 11 Enterprise + Microsoft 365 Apps 24H2* image.

You can go to the [developer portal](https://aka.ms/devbox-portal) to create new dev boxes. The developer portal is a web-based interface that allows users to create, manage, and monitor their dev boxes. 

To learn more about creating dev boxes through the developer portal, see [Quickstart: Create and connect to a dev box by using the Microsoft Dev Box developer portal](quickstart-create-dev-box.md).

## Next steps
In this quickstart, you set up the Microsoft Dev Box resources required for users to create their own dev boxes. To learn how to create and connect to a dev box, go to the next quickstart:

> [!div class="nextstepaction"]
> [Create a dev box](./quickstart-create-dev-box.md)