---
title: Create and manage projects
description: Find, create, manage, and delete projects in Azure Migrate.
author: vineetvikram
ms.author: vivikram
ms.manager: abhemraj
ms.topic: how-to
ms.date: 11/23/2020
---

# Create and manage projects

This article describes how to create, manage, and delete [projects](migrate-services-overview.md). 

Classic Azure Migrate is retiring in Feb 2024. After Feb 2024, classic version of Azure Migrate will no longer be supported and the inventory metadata in the classic project will be deleted. If you're using classic projects, delete those projects and follow the steps to create a new project. You can't upgrade classic projects or components to the Azure Migrate. View [FAQ](./resources-faq.md#i-have-a-project-with-the-previous-classic-experience-of-azure-migrate-how-do-i-start-using-the-new-version) before you start the creation process.

Project is used to store discovery, assessment, and migration metadata collected from the environment you're assessing or migrating. In a project you can track discovered assets, create assessments, and orchestrate migrations to Azure.  

## Verify permissions

Check you have the correct permissions to create a project:

1. In the Azure portal, open the relevant subscription, and select **Access control (IAM)**.
2. In **Check access**, find the relevant account, and select it view permissions. You should have *Contributor* or *Owner* permissions. 


## Create a project for the first time

Set up a new project in an Azure subscription.

1. In the Azure portal, search for *Azure Migrate*.
2. In **Services**, select **Azure Migrate**.
3. In **Overview**, select **Assess and migrate servers**.

    :::image type="content" source="./media/create-manage-projects/assess-migrate-servers.png" alt-text="Option in Overview to assess and migrate servers":::

4. In **Servers**, select **Create project**.

    :::image type="content" source="./media/create-manage-projects/create-project.png" alt-text="Button to start creating project":::

5. In **Create project**, select the Azure subscription and resource group. Create a resource group if you don't have one.
6. In **Project Details**, specify the project name and the geography in which you want to create the project.
    - The geography is only used to store the metadata gathered from on-premises servers. You can select any target region for migration. 
    - Review supported geographies for [public](migrate-support-matrix.md#supported-geographies-public-cloud) and [government clouds](migrate-support-matrix.md#supported-geographies-azure-government). 


    > [!Note]
    > Use the **Advanced** configuration section to create an Azure Migrate project with private endpoint connectivity. [Learn more](how-to-use-azure-migrate-with-private-endpoints.md#create-a-project-with-private-endpoint-connectivity) 

7. Select **Create**.

     :::image type="content" source="./media/create-manage-projects/project-details.png" alt-text="Page to input project settings":::


Wait a few minutes for the project to deploy.

## Create a project in a specific region

In the portal, you can select the geography in which you want to create the project. If you want to create the project within a specific Azure region, using the following API command to create the  project.

```rest
PUT /subscriptions/<subid>/resourceGroups/<rg>/providers/Microsoft.Migrate/MigrateProjects/<mymigrateprojectname>?api-version=2018-09-01-preview "{location: 'centralus', properties: {}}"
```

## Create additional projects

If you already have a project and you want to create an additional project, do the following:  

1. In the [Azure public portal](https://portal.azure.com) or [Azure Government](https://portal.azure.us), search for **Azure Migrate**.
2. On the Azure Migrate dashboard > **Servers**, select **change** in the upper-right corner.

    :::image type="content" source="./media/create-manage-projects/switch-project.png" alt-text="Change project":::

3. To create a new project, select **click here**.


## Find a project

Find a project as follows:

1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*.
2. In the Azure Migrate dashboard > **Servers**, select **change** in the upper-right corner.

    :::image type="content" source="./media/create-manage-projects/switch-project.png" alt-text="Switch to an existing project":::

3. Select the appropriate subscription and project.


### Find a classic project

If you created the project in the [previous version](migrate-services-overview.md#azure-migrate-versions) of Azure Migrate, find it as follows:

1. In the [Azure portal](https://portal.azure.com), search for *Azure Migrate*.
2. In the Azure Migrate dashboard, if you've created a project in the previous version, a banner referencing older projects appears. Select the banner.

    :::image type="content" source="./media/create-manage-projects/access-existing-projects.png" alt-text="Access existing projects":::

3. Review the list of old projects.


## Delete a project

Delete as follows:

1. Open the Azure resource group in which the project was created.
2. In the resource group page, select **Show hidden types**.
3. Select the project you want to delete, and its associated resources.
    - The resource type is **Microsoft.Migrate/migrateprojects**.
    - If the resource group is exclusively used by the project, you can delete the entire resource group.

Note that:

- When you delete, both the project and the metadata about discovered servers are deleted.
- If you're using the older version of Azure Migrate, open the Azure resource group in which the project was created. Select the project you want to delete (the resource type is **Migration project**).
- If you're using dependency analysis with an Azure Log Analytics workspace:
    - If you've attached a Log Analytics workspace to the Server Assessment tool, the workspace isn't automatically deleted. The same Log Analytics workspace can be used for multiple scenarios.
    - If you want to delete the Log Analytics workspace, do that manually.
- Project deletion is irreversible. Deleted objects can't be recovered.

### Delete a workspace manually

1. Browse to the Log Analytics workspace attached to the project.

    - If you haven't deleted the project, you can find the link to the workspace in **Essentials** > **Server Assessment**.
    :::image type="content" source="./media/create-manage-projects/loganalytics-workspace.png" alt-text="LA Workspace":::
       
    - If you've already deleted the project, select **Resource Groups** in the left pane of the Azure portal and find the workspace.
       
2. [Follow the instructions](../azure-monitor/logs/delete-workspace.md) to delete the workspace.

## Next steps

Add [assessment](how-to-assess.md) or [migration](how-to-migrate.md) tools to projects.