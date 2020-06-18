---
title: Add an assessment/migration tool in Azure Migrate
description: Describes how to create an Azure Migrate project and add an assessment/migration tool.
ms.topic: how-to
ms.date: 04/16/2020
---


# Add an assessment/migration tool for the first time

This article describes how to add an assessment or migration tool to an [Azure Migrate](migrate-overview.md) project for the first time.  
Azure Migrate provides a central hub to track discovery, assessment and migration of your on-premises apps and workloads, and private/public cloud VMs, to Azure. The hub provides Azure Migrate tools for assessment and migration, as well as other tools and independent software vendor (ISV) [offerings](migrate-services-overview.md#isv-integration) . 

## Check permissions to create project

If you haven't yet created an Azure Migrate project, check you have the right permissions.

1. In the Azure portal, open the subscription, and select **Access control (IAM)**.
2. In Check access, find the relevant account, and click it to view permissions. You should have Contributor or Owner permissions.
    - If you just created a free Azure account, you're the owner of your subscription.
    - If you're not the subscription owner, work with the owner to assign the role.

## Create a project and add a tool

Set up a new Azure Migrate project in an Azure subscription, and add a tool.

- An Azure Migrate project is used to store discovery, assessment, and migration metadata collected from the environment you're assessing or migrating. 
- In a project you can track discovered assets, and orchestrate assessment, and migration.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.

    ![Set up Azure Migrate](./media/how-to-add-tool-first-time/azure-migrate-search.png)

3. In **Overview**, click **Assess and migrate servers**.
4. Under **Discover, assess and migrate servers**, click **Assess and migrate servers**.

    ![Discover and assess servers](./media/how-to-add-tool-first-time/assess-migrate.png)

1. In **Discover, assess and migrate servers**, click **Add tools**.
2. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one.
3. In **Project Details**, specify the project name, and geography in which you want to create the project.  Review supported geographies for [public](migrate-support-matrix.md#supported-geographies-public-cloud) and [government clouds](migrate-support-matrix.md#supported-geographies-azure-government).

    ![Create an Azure Migrate project](./media/how-to-add-tool-first-time/migrate-project.png)

    - The geography specified for the project is only used to store the metadata gathered from on-premises VMs. You can select any target region for the actual migration.
    - If you need to deploy a project within a specific region in a geography, use the following API to create a project. Specify the subscription ID, resource group name, and project name, along with the location. Review the geographies/regions for [public](migrate-support-matrix.md#supported-geographies-public-cloud) and [government clouds](migrate-support-matrix.md#supported-geographies-azure-government).

        `PUT /subscriptions/<subid>/resourceGroups/<rg>/providers/Microsoft.Migrate/MigrateProjects/<mymigrateprojectname>?api-version=2018-09-01-preview "{location: 'centralus', properties: {}}"`   


4. Click **Next**, and add an assessment or migration tool.

    > [!NOTE]
    > When you create a project you need to add at least one assessment or migration tool.

5. In **Select assessment tool**, add an assessment tool. If you don't need an assessment tool, select **Skip adding an assessment tool for now** > **Next**. 
2. In **Select migration tool**, add a migration tool as required. If you don't need a migration tool right now, select **Skip adding a migration tool for now** > **Next**.
3. In **Review + add tools**, review the settings, and click **Add tools**.

After creating the project, you can select additional tools for assessment and migration of servers and workloads, databases, and web apps.

## Create additional projects

In some circumstances, you might need to create additional Azure Migrate projects. For example if you have datacenters in different geographies, or you need to store metadata in a different geography. Create an additional project as follows:

1. In the current Azure Migrate project, click **Servers** or **Databases**.
2. In the top right-hand corner, click **Change** next to the current project name.
3. In **Settings**, select **Click here to create a new project**.
4. Create a new project and add a new tool as described in the previous procedure.

## Next steps

- Get started with [Azure Migrate: Server Assessment](migrate-services-overview.md#azure-migrate-server-assessment-tool), or [Azure Migrate: Server Migration](migrate-services-overview.md#azure-migrate-server-migration-tool).
- If you added an ISV tool, or Movere, [review steps](prepare-isv-movere.md) to prepare for linking the tool to Azure Migrate.
- Learn how to add additional [assessment](how-to-assess.md) and [migration](how-to-migrate.md) tools. 
