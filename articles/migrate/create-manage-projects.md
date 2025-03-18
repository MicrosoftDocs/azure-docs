---
title: Create and manage projects
description: Find, create, manage, and delete projects in Azure Migrate.
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: how-to
ms.date: 02/03/2025
ms.custom: engagement-fy23
---

# Create and manage projects

This article describes how to create, manage, and delete [projects](migrate-services-overview.md). 

This article shows you how to create, manage, and delete projects. A project is used to store discovery, business case, assessment, and migration metadata collected from the environment you're assessing or migrating. Within a project, you can track discovered assets, create business cases, conduct assessments, and orchestrate migrations to Azure.

## Verify permissions

Ensure you have the correct permissions to create a project using the following steps:

1. In the Azure portal, open the relevant subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and select it and view permissions. You should have *Contributor* or *Owner* permissions. 


## Create a project for the first time

Set up a new project in an Azure subscription.

1. In the Azure portal, search for *Azure Migrate*.
2. In **Services**, select **Azure Migrate**.
3. In **Get started**, select **Discover, assess and migrate**.

    :::image type="content" source="./media/create-manage-projects/create-project.png" alt-text="Screenshot shows how to create project." lightbox="./media/create-manage-projects/create-project.png:::

4. In **Create project**, select the Azure subscription and resource group. Create a resource group if you don't have one.
5. In **Project Details**, specify the project name and the geography in which you want to create the project.
    - The region is only used to store the metadata gathered from on-premises servers. You can assess or migrate servers for any target region regardless of the selected region.
    - Review supported regions for [public](supported-geographies.md#public-cloud) and [government clouds](supported-geographies.md#azure-government). 

    > [!Note]
    > Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity). 

7. Select **Create**.

    :::image type="content" source="./media/create-manage-projects/create-project-subscription.png" alt-text="Image of Azure Migrate page to create project." lightbox="./media/create-manage-projects/create-project-subscription.png":::

Wait for a few minutes for the project to deploy.

## Create additional projects

If you already have a project and you want to create an additional project, do the following:  

1. In the [Azure public portal](https://portal.azure.com) or [Azure Government](https://portal.azure.us), search for **Azure Migrate**.
1. On the Azure Migrate dashboard, select **All Projects** on the upper left.
1. Select a **Create Project**. 

   :::image type="content" source="./media/create-manage-projects/create-a-project.png" alt-text="Screenshot shows how to create a project by selecting the create project button.":::

## Find a project

Follow the steps to find a project:

1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*. 
1. Select **All Projects** from the upper left.
1. Filter and select the project of your choice.

    :::image type="content" source="./media/create-manage-projects/filter-and-select-project.png" alt-text="Screenshot shows to filter and select the project.":::

## Delete a project

Follow the steps to delete a project:

1. In the [Azure public portal](https://portal.azure.com) or [Azure Government](https://portal.azure.us), search for **Azure Migrate**. 
1. Select **All Projects** from the upper left.
1. Find the project you want to delete.
1. Select **More options** and then select **Delete Project**.

    :::image type="content" source="./media/create-manage-projects/delete-a-project.png" alt-text="Screenshot shows on how to delete a project.":::

1. The window appears to **Delete project**.

  :::image type="content" source="./media/create-manage-projects/delete-window.png" alt-text="Window appears to delete a project.":::

> [!Note]
> You can't delete or manage the associated Azure Active Directory (AAD) app from this Azure Migrate project level. To delete this resource, visit the AAD app details or use the Azure Command Line Interface (AzCLI). `az ad app delete --id <aad app id>`

1. When you delete a project, both the project and its metadata about discovered servers are deleted. If you want to keep resources such as **key vaults** or **storage vaults**, you can **deselect them** 
1. After you finalize the list of resources to delete, select **Next**.

:::image type="content" source="./media/create-manage-projects/delete-with-resource.png" alt-text="Window appears to delete a project with selected resource.":::

1. **Review** the list of resources to be deleted.
1. Enter the name of project and then select **Delete**.

:::image type="content" source="./media/create-manage-projects/review-and-delete.png" alt-text="Window appears to review and delete a project.":::

> [!Note]
> When you delete, both the project and the metadata about discovered servers are permanently removed. This action is irreversible and deleted objects can't be restored.

## Next steps

Add [assessment](how-to-assess.md) or [migration](how-to-migrate.md) tools to projects.
