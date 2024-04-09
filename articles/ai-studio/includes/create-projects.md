---
 title: include file
 description: include file
 author: eur
 ms.reviewer: eur
ms.author: eric-urban
 ms.service: azure-ai-studio
 ms.topic: include
ms.date: 2/22/2024
 ms.custom: include
---

To create an Azure AI project in [Azure AI Studio](https://ai.azure.com), follow these steps:

1. Select the **Build** tab at the top of the page.
1. Select **+ New AI project**.

    :::image type="content" source="../media/how-to/projects/projects-create-new.png" alt-text="Screenshot of the Build tab of the Azure AI Studio with the option to create a new project visible." lightbox="../media/how-to/projects/projects-create-new.png":::

1. Enter a name for the project.
1. Select an Azure AI hub resource from the dropdown to host your project. If you don't have access to an Azure AI hub resource yet, select **Create a new resource**.

    :::image type="content" source="../media/how-to/projects/projects-create-details.png" alt-text="Screenshot of the project details page within the create project dialog." lightbox="../media/how-to/projects/projects-create-details.png":::

    > [!NOTE]
    > To create an Azure AI hub resource, you must have **Owner** or **Contributor** permissions on the selected resource group. It's recommended to share an Azure AI hub resource with your team. This lets you share configurations like data connections with all projects, and centrally manage security settings and spend.

1. If you're creating a new Azure AI hub resource, enter a name.

1. Select your **Azure subscription** from the dropdown. Choose a specific Azure subscription for your project for billing, access, or administrative reasons. For example, this grants users and service principals with subscription-level access to your project.

1. Leave the **Resource group** as the default to create a new resource group. Alternatively, you can select an existing resource group from the dropdown.

    > [!TIP]
    > Especially for getting started it's recommended to create a new resource group for your project. This allows you to easily manage the project and all of its resources together. When you create a project, several resources are created in the resource group, including an Azure AI hub resource, a container registry, and a storage account.

1. Enter the **Location** for the Azure AI hub resource and then select **Next**. The location is the region where the Azure AI hub resource is hosted. The location of the Azure AI hub resource is also the location of the project. Azure AI services availability differs per region. For example, certain models might not be available in certain regions.
1. Select an existing Azure OpenAI resource from the dropdown or create a new one. 

    :::image type="content" source="../media/how-to/projects/projects-create-resource.png" alt-text="Screenshot of the create resource page within the create project dialog." lightbox="../media/how-to/projects/projects-create-resource.png":::

1. On the **Review and finish** page, you see the Azure OpenAI Service resource name and other settings to review.

    :::image type="content" source="../media/how-to/projects/projects-create-review-finish.png" alt-text="Screenshot of the review and finish page within the create project dialog." lightbox="../media/how-to/projects/projects-create-review-finish.png":::

1. Review the project details and then select **Create an AI project**. You see progress of resource creation and the project is created when the process is complete.

    :::image type="content" source="../media/how-to/projects/projects-create-review-finish-progress.png" alt-text="Screenshot of the resource creation progress within the create project dialog." lightbox="../media/how-to/projects/projects-create-review-finish-progress.png":::

Once a project is created, you can access the **Tools**, **Components**, and **AI project settings** assets in the left navigation panel. For a project that uses an Azure AI hub with support for Azure OpenAI, you see the **Playground** navigation option under **Tools**. 
