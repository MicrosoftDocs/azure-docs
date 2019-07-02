---
title: Create an Azure Migrate project | Microsoft Docs
description: Describes how to create an Azure Migrate project in the Azure portal.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 06/26/2019
ms.author: raynew
---



# Create an Azure Migrate project

This article describes how to create an [Azure Migrate](migrate-overview.md) project. An Azure Migrate project provides a central location to discover, assess and migrate your on-premises apps and workloads running on VMs and physical servers to Azure. In a project you can track discovered assets, and orchestrate assessment and migration.


## Create a project

Set up a new Azure Migrate project in an Azure subscription. 

1. In the Azure portal > **All services**, search for **Azure Migrate**.
2. Under **Services**, select **Azure Migrate**.

    ![Set up Azure Migrate](./media/tutorial-assess-vmware/azure-migrate.png)

3. In **Overview**, click **Assess and migrate servers**.
4. Under **Discover, assess and migrate servers**, click **Assess and migrate servers**.

    ![Discover and assess servers](./media/tutorial-assess-vmware/assess-migrate.png)

1. In **Discover, assess and migrate servers**, click **Add tools**.
2. In **Migrate project**, select your Azure subscription, and create a resource group if you don't have one. Remember that a new group requires [permissions to work with the Azure Migrate service](tutorial-prepare-vmware.md#assign-role-assignment-permissions).
3. In **Project Details**, specify the project name, and geography in which you want to create the project. You can create an Azure Migrate project in the regions summarized in the table.

    - The region specified for the project is only used to store the metadata gathered from on-premises VMs.
    - You can select any target region for the actual migration.
    
        **Geography** | **Region**
        --- | ---
        Asia | Southeast Asia
        Europe | North Europe or West Europe
        United States | East US or West Central US


    ![Create an Azure Migrate project](./media/tutorial-assess-vmware/migrate-project.png)

6. Click **Next**.
7. In **Select assessment tool**, select **Skip adding a migration tool for now** > **Next**.
8. In **Select migration tool**, select **Skip adding a migration tool for now** > **Next**.
9. In **Review + add tools**, review the settings and click **Add tools**.


After creating the project you can select tools for assessment and migration.

## Next steps

Try out an assessment for [Hyper-V](tutorial-prepare-hyper-v.md) or [VMware](tutorial-prepare-vmware.md) VMs.
