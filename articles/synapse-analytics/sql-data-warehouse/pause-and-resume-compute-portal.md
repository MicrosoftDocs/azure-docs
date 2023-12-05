---
title: "Quickstart: Pause and resume compute in dedicated SQL pool via the Azure portal"
description: Use the Azure portal to pause compute for dedicated SQL pool to save costs. Resume compute when you're ready to use the data warehouse.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.date: 01/05/2023
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: quickstart
ms.custom:
  - seo-lt-2019
  - azure-synapse
  - mode-ui
---
# Quickstart: Pause and resume compute in dedicated SQL pool via the Azure portal

You can use the Azure portal to pause and resume the dedicated SQL pool compute resources.  
If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

> [!NOTE]  
> This article applies to dedicated SQL pools created in Azure Synapse Workspaces and not dedicated SQL pools (formerly SQL DW). There are different PowerShell cmdlets to use for each, for example, use `Suspend-AzSqlDatabase` for a dedicated SQL pool (formerly SQL DW), but `Suspend-AzSynapseSqlPool` for a dedicated SQL pool in an Azure Synapse Workspace. For more on the differences between dedicated SQL pool (formerly SQL DW) and dedicated SQL pools in Azure Synapse Workspaces, read [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Before you begin

Use [Create and Connect - portal](../quickstart-create-sql-pool-portal.md) to create a dedicated SQL pool called `mySampleDataWarehouse`.

## Pause compute

To reduce costs, you can pause and resume compute resources on-demand. For example, if you won't be using the database during the night and on weekends, you can pause it during those times, and resume it during the day.

> [!NOTE]  
> You won't be charged for compute resources while the database is paused. However, you will continue to be charged for storage.

Follow these steps to pause a dedicated SQL pool:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Select **Azure Synapse Analytics** in the menu of the Azure portal, or search for **Azure Synapse Analytics** in the search bar.
1. Navigate to your **Dedicated SQL pool** page to open the SQL pool. 
1. Notice **Status** is **Online**.

    :::image type="content" source="././media/pause-and-resume-compute-portal/compute-online.png" alt-text="Screenshot of the Azure portal indicating that the dedicated SQL pool compute is online.":::

1. To pause the dedicated SQL pool, select the **Pause** button.
1. A confirmation question appears asking if you want to continue. Select **Yes**.
1. Wait a few moments, and then notice the **Status** is **Pausing**.

    :::image type="content" source="./media/pause-and-resume-compute-portal/pausing.png" alt-text="Screenshot shows the Azure portal for a sample data warehouse with a Status value of Pausing.":::

1. When the pause operation is complete, the status is **Paused** and the option button is **Resume**.
1. The compute resources for the dedicated SQL pool are now offline. You won't be charged for compute until you resume the service.

    :::image type="content" source="././media/pause-and-resume-compute-portal/compute-offline.png" alt-text="Compute offline.":::

## Resume compute

Follow these steps to resume a dedicated SQL pool.

1. Navigate to your **Dedicated SQL pool** to open the SQL pool.
1. On the `mySampleDataWarehouse` page, notice **Status** is **Paused**.

    :::image type="content" source="././media/pause-and-resume-compute-portal/compute-offline.png" alt-text="Compute offline.":::

1. To resume SQL pool, select **Resume**.
1. A confirmation question appears asking if you want to start. Select **Yes**.
1. Notice the **Status** is **Resuming**.

    :::image type="content" source="./media/pause-and-resume-compute-portal/resuming.png" alt-text="Screenshot shows the Azure portal for a sample data warehouse with the Start button selected and a Status value of Resuming.":::

1. When the SQL pool is back online, the status is **Online**, and the option button is **Pause**.
1. The compute resources for SQL pool are now online and you can use the service. Charges for compute have resumed.

    :::image type="content" source="././media/pause-and-resume-compute-portal/compute-online.png" alt-text="Compute online.":::

## Clean up resources

You are being charged for data warehouse units and the data stored in your dedicated SQL pool. These compute and storage resources are billed separately.

- If you want to keep the data in storage, pause compute.
- If you want to remove future charges, you can delete the dedicated SQL pool.

Follow these steps to clean up resources as you desire.

1. Sign in to the [Azure portal](https://portal.azure.com), and select your dedicated SQL pool.

    :::image type="content" source="./media/pause-and-resume-compute-portal/clean-up-resources.png" alt-text="Clean up resources.":::

1. To pause compute, select the **Pause** button.

1. To remove the dedicated SQL pool so you are not charged for compute or storage, select **Delete**.


## Next steps

- You have now paused and resumed compute for your dedicated SQL pool. Continue to the next article to learn more about how to [Load data into a dedicated SQL pool](./load-data-from-azure-blob-storage-using-copy.md). For additional information about managing compute capabilities, see the [Manage compute overview](sql-data-warehouse-manage-compute-overview.md) article.

- For more on the differences between dedicated SQL pool (formerly SQL DW) and dedicated SQL pools in Azure Synapse Workspaces, read [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772).
