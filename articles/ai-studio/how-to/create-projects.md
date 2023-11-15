---
title: Create an Azure AI project in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article describes how to create an Azure AI Studio project.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# Create an Azure AI project in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

This article describes how to create an Azure AI project in Azure AI studio. A project is used to organize your work and save state while building customized AI apps. 

Projects are hosted by an Azure AI resource which provides enterprise-grade security and a collaborative environment. For more information about the Azure AI projects and resources model, see [Azure AI resources](../concepts/ai-resources.md).

You can create a project in Azure AI Studio more than one way. The most direct way is from the **Build** tab.
1. Select the **Build** tab at the top of the page.
1. Select **+ New project**.

    :::image type="content" source="../media/how-to/projects-create-new.png" alt-text="Screenshot of the Build tab of the Azure AI Studio with the option to create a new project visible." lightbox="../media/how-to/projects-create-new.png":::

1. Enter a name for the project.
1. Select **Create a new resource** from the **Azure AI resource** dropdown and then select **Next**. This option creates a new Azure AI resource to host the project. Alternatively you can select an existing Azure AI resource from the dropdown.

    > [!NOTE]
    > To create an Azure AI resource, you must have **Owner** permissions. 

    :::image type="content" source="../media/how-to/projects-create-details.png" alt-text="Screenshot of the project details page within the create project dialog." lightbox="../media/how-to/projects-create-details.png":::

1. Enter a name for the Azure AI resource. 

    :::image type="content" source="../media/how-to/projects-create-resource.png" alt-text="Screenshot of the create resource page within the create project dialog." lightbox="../media/how-to/projects-create-resource.png":::

1. Select your **Azure subscription** from the dropdown. Choose a specific Azure subscription for your project for billing, access, or administrative reasons. For example, this grants users and service principals with subscription-level access to your project.

1. Leave the **Resource group** as the default to create a new resource group. Alternatively, you can select an existing resource group from the dropdown.

    > [!TIP]
    > Especially for getting started it's recommended to create a new resource group for your project. This allows you to easily manage the project and all of its resources together. When you create a project, several resources are created in the resource group, including an Azure AI resource, a container registry, and a storage account.


1. Enter the **Location** for the Azure AI resource and then select **Next**. The location is the region where the Azure AI resource is hosted. The location of the Azure AI resource is also the location of the project. 
1. Review the project details and then select **Create a project**.

    :::image type="content" source="../media/how-to/projects-create-review-finish.png" alt-text="Screenshot of the review and finish page within the create project dialog." lightbox="../media/how-to/projects-create-review-finish.png":::


Once a project is created, you can access the **Tools**, **Components**, and **Settings** assets in the left navigation panel. Tools and assets listed under each of those subheadings can vary depending on the type of project you've selected. For example, if you've selected a project that uses Azure OpenAI, you'll see the **Playground** navigation option under **Tools**. 

## Project details

In the project details page (select **Build** > **Settings**), you can find information about the project, such as the project name, description, and the Azure AI resource that hosts the project. You can also find the project ID, which is used to identify the project in the Azure AI Studio API.

- Project name: The name of the project corresponds to the selected project in the left panel. The project name is also referenced in the *Welcome to the YOUR-PROJECT-NAME project* message on the main page. You can change the name of the project by selecting the edit icon next to the project name.
- Project description: The project description (if set) is shown directly below the *Welcome to the YOUR-PROJECT-NAME project* message on the main page. You can change the description of the project by selecting the edit icon next to the project description.
- Azure AI resource: The Azure AI resource that hosts the project. 
- Location: The location of the Azure AI resource that hosts the project. Azure AI resources are supported in the same regions as Azure OpenAI. 
- Subscription: The subscription that hosts the Azure AI resource that hosts the project.
- Resource group: The resource group that hosts the Azure AI resource that hosts the project.
- Container registry: The container for project files. Container registry allows you to build, store, and manage container images and artifacts in a private registry for all types of container deployments.
- Storage account: The storage account for the project.

Select the Azure AI resource, subscription, resource group, container registry, or storage account to navigate to the corresponding resource in the Azure portal.

## Next steps

- [Quickstart: Generate product name ideas in the Azure AI Studio playground](../quickstarts/playground-completions.md)
- [Learn more about Azure AI Studio](../what-is-ai-studio.md)
- [Learn more about Azure AI resources](../concepts/ai-resources.md)
