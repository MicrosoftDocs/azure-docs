---
title: Create an Azure AI Studio project in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article describes how to create an Azure AI Studio project.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
  - build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: deeikele
ms.author: sgilley
author: sdgilley
---

# Create a project in Azure AI Studio

This article describes how to create a project in Azure AI Studio. A project is used to organize your work and save state while building customized AI apps. 

Projects are hosted by an Azure AI Studio hub that provides enterprise-grade security and a collaborative environment. For more information about the projects and resources model, see [Azure AI Studio hubs](../concepts/ai-resources.md).

## Create a project

[!INCLUDE [Create Azure AI Studio project](../includes/create-projects.md)]

## Project settings

On the project **Settings** page you can find information about the project, such as the project name, description, and the hub that hosts the project. You can also find the project ID, which is used to identify the project via SDK or API.

:::image type="content" source="../media/how-to/projects/project-settings.png" alt-text="Screenshot of an AI Studio project settings page." lightbox = "../media/how-to/projects/project-settings.png":::

- Name: The name of the project corresponds to the selected project in the left panel. 
- Hub: The hub that hosts the project. 
- Location: The location of the hub that hosts the project. For supported locations, see [Azure AI Studio regions](../reference/region-support.md).
- Subscription: The subscription that hosts the hub that hosts the project.
- Resource group: The resource group that hosts the hub that hosts the project.

Select **Manage in the Azure portal** to navigate to the project resources in the Azure portal.

## Project resource access

Common configurations on the hub are shared with your project, including connections, compute instances, and network access, so you can start developing right away.

In addition, a number of resources are only accessible by users in your project workspace:

1. Components including datasets, flows, indexes, deployed model API endpoints (open and serverless).
1. Connections created by you under 'project settings'.
1. Azure Storage blob containers, and a fileshare for data upload within your project. Access storage using the following connections:
   
   | Data connection | Storage location | Purpose |
   | --- | --- | --- |
   | workspaceblobstore | {project-GUID}-blobstore | Default container for data upload |
   | workspaceartifactstore | {project-GUID}-blobstore | Stores components and metadata for your project such as model weights |
   | workspacefilestore | {project-GUID}-code | Hosts files created on your compute and using prompt flow |

> [!NOTE]
> Storage connections are not created directly with the project when your storage account has public network access set to disabled. These are created instead when a first user accesses AI studio over a private network connection that is allowed by your storage account configuration.

## Next steps

- [Deploy an enterprise chat web app](../tutorials/deploy-chat-web-app.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about hubs](../concepts/ai-resources.md)
