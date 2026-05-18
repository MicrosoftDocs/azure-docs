---
title: Quickstart to create an Azure Migrate project using Portal
description: In this quickstart, you'll learn how to create an Azure Migrate project.
author: ankitsurkar06
ms.author: v-uhabiba
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.topic: how-to
ms.date: 05/18/2026
ms.custom: engagement-fy23
# Customer intent: "As a cloud architect, I want to create a new Azure Migrate project via the portal, so that I can manage the migration of on-premises assets to Azure effectively."
---

# Quickstart: Create an Azure Migrate project using portal

In this quickstart, you'll learn how to create, manage, and delete [projects](migrate-services-overview.md). 

A project is used to store discovery, assessment, and migration metadata collected from the environment you're assessing or migrating. In a project, you can track discovered assets, create assessments, and orchestrate migrations to Azure.  

## Verify permissions

Ensure you have the correct permissions to create a project using the following steps:

1. In the Azure portal, open the relevant subscription, and select **Access control (IAM)**.
2.  In **Check access**, find the relevant account, and select it and view permissions. You should have *Azure Migrate Owner* or a role with higher permissions. [Learn more](prepare-azure-accounts.md).

> [!NOTE]
> Starting November 2025, only users assigned the **Azure Migrate Owner** or a higher privileged role will be able to create Azure Migrate projects. Users without these role assignments will no longer have the required permissions to create new projects.

## Create a project for the first time

Follow these steps to create an Azure Migrate project for the first time: 

1. Set up a new project in an Azure subscription. 
1. In the Azure portal, search for *Azure Migrate*.
1. In **Services**, select **Azure Migrate**.
1. In **Get started**, select **Create project**.

   :::image type="content" source="./media/quickstart-create-project/assess-migrate-servers-inline.png" alt-text="Screenshot displays the options in Overview." lightbox="./media/quickstart-create-project/assess-migrate-servers-expanded.png":::

1. In **Create project**, select the **Subscription** and **Resource group**. 
1. Select **Create new** to create a new **Resource group** if you don't have one.   

    :::image type="content" source="./media/quickstart-create-project/create-project.png" alt-text="Screenshot shows how to create a new resource group and Azure Migrate page to input project settings." lightbox="./media/quickstart-create-project/create-project.png":::

1. In **Project Details**, specify the project name and the geography in which you want to create the project.
    - The geography is only used to store the metadata gathered from on-premises servers. You can assess or migrate servers for any target region regardless of the selected geography. 
    - Review supported geographies for [public] [public](supported-geographies.md#public-cloud) and [government clouds](supported-geographies.md#azure-government). 


    > [!NOTE]
    > Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity). 

1. Select **Create**.

     :::image type="content" source="./media/quickstart-create-project/project-details.png" alt-text="Image of Azure Migrate page to input project settings." lightbox="./media/quickstart-create-project/project-details.png":::


Wait for a few minutes for the project to deploy.

## Create a project in a specific region

In the portal, you can select the geography in which you want to create the project. If you want to create the project within a specific Azure region, use the following API command to create the  project.

```rest
PUT /subscriptions/<subid>/resourceGroups/<rg>/providers/Microsoft.Migrate/MigrateProjects/<mymigrateprojectname>?api-version=2018-09-01-preview "{location: 'centralus', properties: {}}"
```
After you create the project, perform the following steps to try out the new agentless dependency analysis enhancements: 

Ensure that you install Az CLI to execute the required commands by following the steps provided in the documentation [here](/cli/azure/install-azure-cli).

After you install the Az CLI (in PowerShell), go to PowerShell on your system as an Administrator and execute the following commands:

1. Log in to the Azure tenant and set the Subscription.  
   - az log in --tenant <TENANT_ID>
   - az account set --subscription <SUBSCRIPTION_ID> 
   - Output contains - **"state": "Registered"**
1. Register the new Dependency Map resource provider.  
   - **az provider register --namespace Microsoft.DependencyMap**
1. Ensure that the provider is in registered state. 
    - **az provider show -n Microsoft.DependencyMap**
    - Output contains - **"registrationState": "Registered"**
 
## Create additional projects

You can create additional projects to manage separate migration scenarios. To create another Azure Migrate project, follow these steps:  

1. In the [Azure public portal](https://portal.azure.com) or [Azure Government](https://portal.azure.us), search for **Azure Migrate**.   
1. On the Azure Migrate dashboard, select All Projects on the upper left.
1. Select a **Create project**.

    :::image type="content" source="./media/quickstart-create-project/create-additional-project.png" alt-text="Screenshot shows how to create an additional project." lightbox="./media/quickstart-create-project/create-additional-project.png":::

## Find a project

Follow these steps to find an existing Azure Migrate project:

1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*.
1. In the Azure Migrate dashboard, select **All projects** from the left pane.
1. Enter the project name in the **Search to filter items** to find the required project.


    :::image type="content" source="./media/quickstart-create-project/current-project.png" alt-text="Screenshot to select the current project." lightbox="./media/quickstart-create-project/current-project.png":::

1. Select the appropriate subscription and project.


## Delete a project

Follow these steps to delete an existing Azure Migrate project:

1. In the Azure Migrate dashboard, select **All projects** from the left pane.
1. Select the project that you want to delete and then select **Delete project**.


    :::image type="content" source="./media/quickstart-create-project/delete-project.png" alt-text="Screenshot shows how to delete a project." lightbox="./media/quickstart-create-project/delete-project.png":::

1. Select the associated resources.
    - The resource type is **Microsoft.Migrate/migrateprojects**.
    - If the resource group is exclusively used by the project, you can delete the entire resource group.

    :::image type="content" source="./media/quickstart-create-project/associated-resource-group.png" alt-text="Screenshot shows how to select associated resource group to delete a project." lightbox="./media/quickstart-create-project/associated-resource-group.png":::

1. Select the **Associated resource type** checkbox. 
1. Select **Next** to delete the project.

> [!NOTE]
> - When you delete, both the project and the metadata about discovered servers are deleted.
> - If you're using the older version of Azure Migrate, go to the Azure resource group in which the project was created. Select the project you want to delete (the resource type is **Migration project**).
> - Project deletion is irreversible. Deleted objects can't be recovered.

## Next steps

Add [assessment](how-to-assess.md) or [migration](how-to-migrate.md) tools to projects.
