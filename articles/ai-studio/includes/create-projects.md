---
title: include file
description: include file
author: eur
ms.reviewer: eur
ms.author: eric-urban
ms.service: azure-ai-studio
ms.topic: include
ms.date: 5/21/2024
ms.custom: include, build-2024
---

To create a project in [Azure AI Studio](https://ai.azure.com), follow these steps:

1. Go to the **Home** page of [Azure AI Studio](https://ai.azure.com). 
1. Select **+ New project**.
1. Enter a name for the project.
1. Select a hub from the dropdown to host your project. If you don't have access to a hub yet, select **Create a new hub**.

    :::image type="content" source="../media/how-to/projects/projects-create-details.png" alt-text="Screenshot of the project details page within the create project dialog." lightbox="../media/how-to/projects/projects-create-details.png":::

    > [!NOTE]
    > To create a hub, you must have **Owner** or **Contributor** permissions on the selected resource group. It's recommended to share a hub with your team. This lets you share configurations like data connections with all projects, and centrally manage security settings and spend. For more options to create a hub, see [how to create and manage an Azure AI Studio hub](../how-to/create-azure-ai-resource.md). A project name must be unique between projects that share the same hub.

1. If you're creating a new hub, enter a name.

1. Select your Azure subscription from the **Subscription** dropdown. Choose a specific Azure subscription for your project for billing, access, or administrative reasons. For example, this grants users and service principals with subscription-level access to your project.

1. Leave the **Resource group** as the default to create a new resource group. Alternatively, you can select an existing resource group from the dropdown.

    > [!TIP]
    > Especially for getting started it's recommended to create a new resource group for your project. This allows you to easily manage the project and all of its resources together. When you create a project, several resources are created in the resource group, including a hub, a container registry, and a storage account.

1. Enter the **Location** for the hub and then select **Next**. The location is the region where the hub is hosted. The location of the hub is also the location of the project. Azure AI services availability differs per region. For example, certain models might not be available in certain regions.
1. Select an existing Azure AI services resource (including Azure OpenAI) from the dropdown or create a new one. 

    :::image type="content" source="../media/how-to/projects/projects-create-resource.png" alt-text="Screenshot of the create resource page within the create project dialog." lightbox="../media/how-to/projects/projects-create-resource.png":::

1. On the **Review and finish** page, you see the Azure AI services resource name and other settings to review.

    :::image type="content" source="../media/how-to/projects/projects-create-review-finish.png" alt-text="Screenshot of the review and finish page within the create project dialog." lightbox="../media/how-to/projects/projects-create-review-finish.png":::

1. Review the project details and then select **Create a project**. You see progress of resource creation and the project is created when the process is complete.

    :::image type="content" source="../media/how-to/projects/projects-create-review-finish-progress.png" alt-text="Screenshot of the resource creation progress within the create project dialog." lightbox="../media/how-to/projects/projects-create-review-finish-progress.png":::

Once a project is created, you can access the playground, tools, and other assets in the left navigation panel.
