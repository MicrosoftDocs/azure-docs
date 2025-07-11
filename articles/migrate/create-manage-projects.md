---
title: Create and manage projects
description: Find, create, manage, and delete projects in Azure Migrate.
author: ankitsurkar06
ms.author: ankitsurkar
ms.service: azure-migrate
ms.topic: how-to
ms.date: 03/20/2025
ms.custom: engagement-fy23
# Customer intent: "As a cloud operations manager, I want to create and manage migration projects in Azure, so that I can efficiently track and orchestrate the discovery, assessment, and migration of assets into the cloud."
---

# Create and manage projects

::: moniker range="migrate"

This article shows you how to create, manage, and delete projects. A project is used to store discovery, business case, assessment, and migration metadata collected from the environment you're assessing or migrating. Within a project, you can track discovered assets, create business cases, conduct assessments, and orchestrate migrations to Azure.
::: moniker-end

::: moniker range="migrate-classic"

Classic Azure Migrate is retiring in Feb 2024. After Feb 2024, the classic version of Azure Migrate will no longer be supported and the inventory metadata in the classic project will be deleted. If you're using classic projects, delete those projects and follow the steps to create a new project. You can't upgrade classic projects or components to Azure Migrate. View [FAQ](./resources-faq.md#i-have-a-project-with-the-previous-classic-experience-of-azure-migrate-how-do-i-start-using-the-new-version) before you start the creation process.

A project is used to store discovery, assessment, and migration metadata collected from the environment you're assessing or migrating. In a project, you can track discovered assets, create assessments, and orchestrate migrations to Azure.  
::: moniker-end

## Verify permissions

Ensure you have the correct permissions to create a project using the following steps:

1. In the Azure portal, open the relevant subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and select it and view permissions. You should have *Contributor* or *Owner* permissions. 

## Create a project for the first time

::: moniker range="migrate"

Set up a new project in an Azure subscription.

1. In the Azure portal, search for *Azure Migrate*.
1. In **Services**, select **Azure Migrate**.
1. In **Get started**, select **Discover, assess and migrate**.

    :::image type="content" source="./media/create-manage-projects/create-project.png" alt-text="Screenshot shows how to create project." lightbox="./media/create-manage-projects/create-project.png" :::

1. In Servers, databases and web apps, select **Create project**.
   :::image type="content" source="./media/create-manage-projects/create-project-inline.png" alt-text="Screenshot of button to start creating a project." lightbox="./media/create-manage-projects/create-project-expanded.png":::
1. In **Create project**, select the Azure subscription and resource group. Create a resource group if you don't have one.
1. In **Project Details**, specify the project name and the geography in which you want to create the project.
    - The region is only used to store the metadata gathered from on-premises servers. You can assess or migrate servers for any target region regardless of the selected region.
    - Review supported regions for [public](supported-geographies.md#public-cloud) and [government clouds](supported-geographies.md#azure-government). 

    > [!Note]
    > Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity). 

6. Select **Create**.

    :::image type="content" source="./media/create-manage-projects/create-project-subscription.png" alt-text="Image of Azure Migrate page to create project." lightbox="./media/create-manage-projects/create-project-subscription.png":::

Wait for a few minutes for the project to deploy.
::: moniker-end

::: moniker range="migrate-classic"

Set up a new project in an Azure subscription.

1. In the Azure portal, search for *Azure Migrate*.
2. In **Services**, select **Azure Migrate**.
3. In **Get started**, select **Discover, assess and migrate**.

    :::image type="content" source="./media/create-manage-projects/assess-migrate-servers-inline.png" alt-text="Screenshot displays the options in Overview." lightbox="./media/create-manage-projects/assess-migrate-servers-expanded.png":::

4. In **Servers, databases and web apps**, select **Create project**.

    :::image type="content" source="./media/create-manage-projects/create-project-inline.png" alt-text="Screenshot of button to start creating a project." lightbox="./media/create-manage-projects/create-project-expanded.png":::

5. In **Create project**, select the Azure subscription and resource group. Create a resource group if you don't have one.
6. In **Project Details**, specify the project name and the geography in which you want to create the project.
    - The geography is only used to store the metadata gathered from on-premises servers. You can assess or migrate servers for any target region regardless of the selected geography.
    - Review supported geographies for [public](migrate-support-matrix.md#public-cloud) and [government clouds](migrate-support-matrix.md#azure-government).

    > [!Note]
    > Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity).

7. Select **Create**.

     :::image type="content" source="./media/create-manage-projects/project-details.png" alt-text="Image of Azure Migrate page to input project settings.":::

Wait for a few minutes for the project to deploy.
::: moniker-end

## Create a project in a specific region

In the portal, you can select the geography in which you want to create the project. If you want to create the project within a specific Azure region, use the following API command to create the  project.

```rest
PUT /subscriptions/<subid>/resourceGroups/<rg>/providers/Microsoft.Migrate/MigrateProjects/<mymigrateprojectname>?api-version=2018-09-01-preview "{location: 'centralus', properties: {}}"
```

::: moniker range="migrate"

After you have created the project, perform the following steps to try out the new agentless dependency analysis enhancements:

Ensure that you have installed Az CLI to execute the required commands by following the steps provided in the documentation [here](/cli/azure/install-azure-cli).

After you install the Az CLI (in PowerShell), open PowerShell on your system as an Administrator and execute the following commands:

1. Log in to the Azure tenant and set the Subscription.
    - az login --tenant <TENANT_ID>
    - az account set --subscription <SUBSCRIPTION_ID>
1. Register the Dependency Map private preview feature on the Subscription.
    - az feature registration create --name PrivatePreview --namespace Microsoft.DependencyMap
1. Ensure that the feature is in registered state. 
-    az feature registration show --name PrivatePreview     --provider-namespace Microsoft.DependencyMap
    - Output contains - "state": "Registered"
1. Register the new Dependency Map resource provider. 
    - az provider register --namespace Microsoft.DependencyMap
1. Ensure that the provider is in registered state.
    - az provider show -n Microsoft.DependencyMap
    - Output contains - "registrationState": "Registered"
::: moniker-end

## Create additional projects

If you already have a project and you want to create an additional project, do the following:  

::: moniker range="migrate-classic"
1. In the [Azure public portal](https://portal.azure.com) or [Azure Government](https://portal.azure.us), search for **Azure Migrate**.
1. On the Azure Migrate dashboard, select **All Projects** on the upper left.
1. Select a **Create Project**. 

   :::image type="content" source="./media/create-manage-projects/create-a-project.png" alt-text="Screenshot shows how to create a project by selecting the create project button." lightbox="./media/create-manage-projects/create-a-project.png" :::
::: moniker-end

::: moniker range="migrate"
1. In the [Azure public portal](https://portal.azure.com) or [Azure Government](https://portal.azure.us), search for **Azure Migrate**.
1. On the Azure Migrate dashboard, select **Servers, databases and web apps** > **Create project** on the upper left
   :::image type="content" source="./media/create-manage-projects/switch-project.png" alt-text="Screenshot that contains information on how to create a project." lightbox="./media/create-manage-projects/switch-project.png" :::
1. To create a new project, select **Click here**.
::: moniker-end

## Find a project

Follow the steps to find a project:

::: moniker range="migrate-classic"
1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*. 
1. Select **All Projects** from the upper left.
1. Filter and select the project of your choice.

    :::image type="content" source="./media/create-manage-projects/filter-and-select-project.png" alt-text="Screenshot shows how to filter and select the project." lightbox="./media/create-manage-projects/filter-and-select-project.png" :::
::: moniker-end

1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*. 
1. In Azure Migrate dashboard, select **Servers, databases and webapps** > **Current project** from the upper right corner.
 
   :::image type="content" source="./media/create-manage-projects/current-project.png" alt-text="Screenshot to select the current project." lightbox="./media/create-manage-projects/current-project.png" :::
1. Select the appropriate subscription and project.

## Find a classic project

If you created the project in the [previous version](migrate-services-overview.md) of Azure Migrate, find it as follows:

1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*. 
1. In the Azure Migrate dashboard, if you've created a project in the previous version, a banner referencing older projects appears. Select the banner.

   :::image type="content" source="./media/create-manage-projects/access-existing-projects.png" alt-text="Screenshot to access already existing projects.":::

1. Review the list of old projects.
::: moniker-end

## Delete a project

::: moniker range="migrate-classic"

Follow the steps to delete a project:

1. In the [Azure public portal](https://portal.azure.com) or [Azure Government](https://portal.azure.us), search for **Azure Migrate**. 
1. Select **All Projects** from the upper left.
1. Find the project you want to delete.
1. Select **More options** and then select **Delete Project**.

   :::image type="content" source="./media/create-manage-projects/delete-a-project.png" alt-text="Screenshot shows how to delete a project." lightbox="./media/create-manage-projects/delete-a-project.png" :::

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

::: moniker-end

::: moniker range="migrate"

To delete a project, follow these steps:

1. Open the Azure resource group in which the project was created.
2. In the Resource Groups page, select **Show hidden types**.
3. Select the project that you want to delete and its associated resources.
    - The resource type is **Microsoft.Migrate/migrateprojects**.
    - If the resource group is exclusively used by the project, you can delete the entire resource group.
        
    >[!NOTE]
    > - When you delete, both the project and the metadata about discovered servers are deleted.
    > - If you're using the older version of Azure Migrate, open the Azure resource group in which the project was created. Select the project you want to delete (the resource type is **Migration project**).
    > - If you're using dependency analysis with an Azure Log Analytics workspace:
    > - If you've attached a Log Analytics workspace to the Server Assessment tool, the workspace isn't automatically deleted. The same Log Analytics workspace can be used for multiple scenarios.
    > - If you want to delete the Log Analytics workspace, do that manually.
    > - Project deletion is irreversible. Deleted objects can't be recovered.

### Delete a workspace manually

1. Browse to the Log Analytics workspace attached to the project.

    - If you haven't deleted the project, you can find the link to the workspace in **Essentials** > **Server Assessment**.
    :::image type="content" source="./media/create-manage-projects/loganalytics-workspace.png" alt-text="Screenshot of the Log Analytics Workspace.":::

    - If you've already deleted the project, select **Resource Groups** in the left pane of the Azure portal and find the workspace.

2. [Follow the instructions](/azure/azure-monitor/logs/delete-workspace) to delete the workspace.

::: moniker-end

## Next steps

Add [assessment](how-to-assess.md) or [migration](how-to-migrate.md) tools to projects.
