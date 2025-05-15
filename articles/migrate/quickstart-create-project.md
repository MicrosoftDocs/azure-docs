---
title: Quickstart to create an Azure Migrate project using Portal
description: In this quickstart, you'll learn how to create an Azure Migrate project.
author: ankitsurkar06
ms.author: v-uhabiba
ms.service: azure-migrate
ms.topic: how-to
ms.date: 05/08/2025
ms.custom: engagement-fy23
---

# Quickstart: Create an Azure Migrate project using portal

This article describes how to create, manage, and delete [projects](migrate-services-overview.md). 

Classic Azure Migrate is retiring in Feb 2024. After Feb 2024, the classic version of Azure Migrate will no longer be supported and the inventory metadata in the classic project will be deleted. If you're using classic projects, delete those projects and follow the steps to create a new project. You can't upgrade classic projects or components to Azure Migrate. View [FAQ](./resources-faq.md#i-have-a-project-with-the-previous-classic-experience-of-azure-migrate-how-do-i-start-using-the-new-version) before you start the creation process.

A project is used to store discovery, assessment, and migration metadata collected from the environment you're assessing or migrating. In a project, you can track discovered assets, create assessments, and orchestrate migrations to Azure.  

## Verify permissions

Ensure you have the correct permissions to create a project using the following steps:

1. In the Azure portal, open the relevant subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and select it and view permissions. You should have *Contributor* or *Owner* permissions. 

## Create a project for the first time

Set up a new project in an Azure subscription.

1. In the Azure portal, search for *Azure Migrate*.
2. In **Services**, select **Azure Migrate**.
3. In **Get started**, select **Discover, assess and migrate**.

    :::image type="content" source="./media/quickstart-create-project/assess-migrate-servers-inline.png" alt-text="Screenshot displays the options in Overview." lightbox="./media/quickstart-create-project/assess-migrate-servers-expanded.png":::

4. In **Servers, databases and web apps**, select **Create project**.

    :::image type="content" source="./media/quickstart-create-project/create-project-inline.png" alt-text="Screenshot of button to start creating a project." lightbox="./media/quickstart-create-project/create-project-inline.png":::

5. In **Create project**, select the Azure subscription and resource group. Create a resource group if you don't have one.
6. In **Project Details**, specify the project name and the geography in which you want to create the project.
    - The geography is only used to store the metadata gathered from on-premises servers. You can assess or migrate servers for any target region regardless of the selected geography. 
    - Review supported geographies for [public](supported-geographies.md#public-cloud) and [government clouds](supported-geographies.md#azure-government). 


    > [!Note]
    > Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](discover-and-assess-using-private-endpoints.md#create-a-project-with-private-endpoint-connectivity). 

7. Select **Create**.

     :::image type="content" source="./media/quickstart-create-project/project-details.png" alt-text="Image of Azure Migrate page to input project settings." lightbox="./media/quickstart-create-project/project-details.png":::


Wait for a few minutes for the project to deploy.

## Create a project in a specific region

In the portal, you can select the geography in which you want to create the project. If you want to create the project within a specific Azure region, use the following API command to create the  project.

```rest
PUT /subscriptions/<subid>/resourceGroups/<rg>/providers/Microsoft.Migrate/MigrateProjects/<mymigrateprojectname>?api-version=2018-09-01-preview "{location: 'centralus', properties: {}}"
```
After you create the project, perform the following steps to try out the new agentless dependency analysis enhancements: 

Ensure that you install Az CLI to execute the required commands by following the steps provided in the documentation [here](/cli/azure/install-azure-cli).

After you install the Az CLI (in PowerShell), open PowerShell on your system as an Administrator and execute the following commands:

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

If you already have a project and you want to create an additional project, do the following:  

1. In the [Azure public portal](https://portal.azure.com) or [Azure Government](https://portal.azure.us), search for **Azure Migrate**.
   
1. On the Azure Migrate dashboard, elect **All Projects** on the upper left.
1. Select a **Create Project**. 

    :::image type="content" source="./media/quickstart-create-project/switch-project.png" alt-text="Screenshot containing Create Project button." lightbox="./media/quickstart-create-project/switch-project.png"::::::

## Find a project

Find a project as follows:

1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*.
2. In the Azure Migrate dashboard, select **Servers, databases and web apps** > **Current project** in the upper-right corner.

    :::image type="content" source="./media/quickstart-create-project/current-project.png" alt-text="Screenshot to select the current project." lightbox="./media/quickstart-create-project/current-project.png":::

3. Select the appropriate subscription and project.


### Find a classic project

If you created the project in the [previous version](migrate-services-overview.md) of Azure Migrate, find it as follows:

1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*.
2. In the Azure Migrate dashboard, if you've created a project in the previous version, a banner referencing older projects appears. Select the banner.

    :::image type="content" source="./media/quickstart-create-project/access-existing-projects.png" alt-text="Screenshot to access already existing projects." lightbox="./media/quickstart-create-project/access-existing-projects.png":::

3. Review the list of old projects.


## Delete a project

To delete a project, follow these steps: 

1. Open the Azure resource group in which the project was created.
2. In the Resource Groups page, select **Show hidden types**.
3. Select the project that you want to delete and its associated resources.
    - The resource type is **Microsoft.Migrate/migrateprojects**.
    - If the resource group is exclusively used by the project, you can delete the entire resource group.

> [!NOTE]
> - When you delete, both the project and the metadata about discovered servers are deleted.
> - If you're using the older version of Azure Migrate, open the Azure resource group in which the project was created. Select the project you want to delete (the resource type is **Migration project**).
> - If you're using dependency analysis with an Azure Log Analytics workspace:
    > - If you've attached a Log Analytics workspace to the Server Assessment tool, the workspace isn't automatically deleted. The same Log Analytics workspace can be used for multiple scenarios.
    > - If you want to delete the Log Analytics workspace, do that manually.
> - Project deletion is irreversible. Deleted objects can't be recovered.

### Delete a workspace manually

1. Browse to the Log Analytics workspace attached to the project.

    - If you haven't deleted the project, you can find the link to the workspace in **Essentials** > **Server Assessment**.
    :::image type="content" source="./media/quickstart-create-project/loganalytics-workspace.png" alt-text="Screenshot of the Log Analytics Workspace." lightbox="./media/quickstart-create-project/loganalytics-workspace.png"::::::
       
    - If you've already deleted the project, select **Resource Groups** in the left pane of the Azure portal and find the workspace.
       
2. [Follow the instructions](/azure/azure-monitor/logs/delete-workspace) to delete the workspace.

## Next steps

Add [assessment](how-to-assess.md) or [migration](how-to-migrate.md) tools to projects.
