---
title: Add an assessment/migration tool for the first time in Azure Migrate| Microsoft Docs
description: Describes how to create an Azure Migrate project and add an assessment/migration tool.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 07/09/2019
ms.author: raynew
---



# Add an assessment/migration tool for the first time

This article describes how to add an assessment or migration tool to an [Azure Migrate](migrate-overview.md) project for the first time.  Azure Migrate provides a central hub to track discovery, assessment and migration of your on-premises apps and workloads, and AWS/GCP VM instances, to Azure. The hub provides Azure Migrate tools for assessment and migration, as well as third-party, independent software vendor (ISV) [offerings](migrate-services-overview.md#isv-integration) . 

## Create a project and add a tool

Set up a new Azure Migrate project in an Azure subscription, and add a tool. In a project you can track discovered assets, and orchestrate assessment and migration.

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.

    ![Set up Azure Migrate](./media/tutorial-assess-vmware/azure-migrate.png)

3. In **Overview**, click **Assess and migrate servers**.
4. Under **Discover, assess and migrate servers**, click **Assess and migrate servers**.

    ![Discover and assess servers](./media/tutorial-assess-vmware/assess-migrate.png)

1. In **Discover, assess and migrate servers**, click **Add tools**.
2. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one.
3. In **Project Details**, specify the project name, and geography in which you want to create the project. You can create an Azure Migrate project in Asia, Europe, or the United States geographies.

    - The geography specified for the project is only used to store the metadata gathered from on-premises VMs.
    - You can select any target region for the actual migration.

    ![Create an Azure Migrate project](./media/tutorial-assess-vmware/migrate-project.png)

4. Click **Next**, and add an assessment or migration tool.

    > [!NOTE]
    > When you create a project you need to add at least one assessment or migration tool.
5. In **Select assessment tool**, add an assessment tool. If you don't need an assessment tool, select **Skip adding an assessment tool for now** > **Next**. 
2. In **Select migration tool**, add a migration tool as required. If you don't need a migration tool right now, select **Skip adding a migration tool for now** > **Next**.
3. In **Review + add tools**, review the settings and click **Add tools**.

After creating the project you can select additional tools for assessment and migration of servers and workloads, databases, and web apps.

## Next steps

Learn how to add additional [assessment](how-to-assess.md) and [migration](how-to-migrate.md) tools. 
