---
title: Create an Azure AI Studio project in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article describes how to create an Azure AI Studio project.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 2/5/2024
ms.reviewer: deeikele
ms.author: sgilley
author: sdgilley
---

# Create a project in Azure AI Studio

This article describes how to create a project in Azure AI Studio. A project is used to organize your work and save state while building customized AI apps. 

Projects are hosted by an Azure AI Studio hub that provides enterprise-grade security and a collaborative environment. For more information about the projects and resources model, see [Azure AI Studio hubs](../concepts/ai-resources.md).

## Create a project

[!INCLUDE [Create Azure AI Studio project](../includes/create-projects.md)]

## Project details

In the project details page (select **Build** > **Project settings**), you can find information about the project, such as the project name, description, and the hub that hosts the project. You can also find the project ID, which is used to identify the project in the Azure AI Studio API.

- Name: The name of the project corresponds to the selected project in the left panel. 
- AI Studio hub: The hub that hosts the project. 
- Location: The location of the hub that hosts the project. For supported locations, see [Azure AI Studio regions](../reference/region-support.md).
- Subscription: The subscription that hosts the hub that hosts the project.
- Resource group: The resource group that hosts the hub that hosts the project.
- Permissions: The users that have access to the project. For more information, see [Role-based access control in Azure AI Studio](../concepts/rbac-ai-studio.md).

Select **View in the Azure portal** to navigate to the project resources in the Azure portal.

## Next steps

- [Deploy a web app for chat on your data](../tutorials/deploy-chat-web-app.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about hubs](../concepts/ai-resources.md)
