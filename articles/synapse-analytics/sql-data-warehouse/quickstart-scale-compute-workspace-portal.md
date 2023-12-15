---
title: "Quickstart: Scale compute for an Azure Synapse dedicated SQL pool in a Synapse workspace with the Azure portal"
description: Learn how to scale compute for an Azure Synapse dedicated SQL pool in a Synapse workspace with the Azure portal.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: sngun
ms.date: 02/22/2023
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: quickstart
ms.custom:
  - azure-synapse
  - mode-ui
---

# Quickstart: Scale compute for an Azure Synapse dedicated SQL pool in a Synapse workspace with the Azure portal

You can scale compute for an Azure Synapse dedicated SQL pool in a Synapse workspace using the Azure portal. [Scale out compute](sql-data-warehouse-manage-compute-overview.md) for better performance, or scale back compute to save costs.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

> [!NOTE]  
> This article applies to dedicated SQL pools created in Azure Synapse Analytics workspaces. This content does not apply to dedicated SQL pools (formerly SQL DW) or dedicated SQL pools (formerly SQL DW) in connected workspaces. For similar instructions for dedicated SQL pools (formerly SQL DW), see [Quickstart: Scale compute for an Azure Synapse dedicated SQL pool (formerly SQL DW) with the Azure portal](quickstart-scale-compute-portal.md).
> For more on the differences between dedicated SQL pools (formerly SQL DW) and dedicated SQL pools in Azure Synapse Workspaces, read [What's the difference between Azure Synapse (formerly SQL DW) and Azure Synapse Analytics Workspace](https://techcommunity.microsoft.com/t5/azure-synapse-analytics-blog/what-s-the-difference-between-azure-synapse-formerly-sql-dw-and/ba-p/3597772).

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Before you begin

You can scale a SQL pool that you already have or use [Quickstart: create and connect - portal](create-data-warehouse-portal.md) to create a SQL pool named `mySampleDataWarehouse`. This quickstart scales `mySampleDataWarehouse`.

> [!IMPORTANT]  
> Your SQL pool must be online to scale.

## Scale compute

SQL pool compute resources can be scaled by increasing or decreasing data warehouse units. The [Quickstart: create and connect - portal](create-data-warehouse-portal.md) created `mySampleDataWarehouse` and initialized it with 400 DWUs. The following steps adjust the DWUs for `mySampleDataWarehouse`.

To change data warehouse units:

1. Select **Azure Synapse Analytics** in the left page of the Azure portal.
1. Under **Analytical pools**, select **SQL pools** from the main menu.
1. Select `mySampleDataWarehouse` from the list of pools. The SQL pool opens.
1. Select **Scale** from the navigation menu.

    :::image type="content" source="./media/quickstart-scale-compute-workspace-portal/scale-dedicated-sql-pool-azure-portal.png" alt-text="A screenshot of the Azure portal showing the Scale button on the Overview page of a dedicated SQL pool." lightbox="./media/quickstart-scale-compute-workspace-portal/scale-dedicated-sql-pool-azure-portal.png":::

1. In the **Scale** panel, move the slider left or right to change the DWU setting. Then select **Save**.

    :::image type="content" source="./media/quickstart-scale-compute-workspace-portal/dedicated-sql-pool-scale-slider-azure-portal.png" alt-text="A screenshot of the Azure portal showing the Scale slider on the Scale page of a dedicated SQL pool in an Azure Synapse workspace." lightbox="./media/quickstart-scale-compute-workspace-portal/dedicated-sql-pool-scale-slider-azure-portal.png":::

## Next steps

- To learn more about SQL pool, continue to the [Load data into SQL pool](./load-data-from-azure-blob-storage-using-copy.md) tutorial.
- [Quickstart: Scale compute for dedicated SQL pools in Azure Synapse Workspaces with Azure PowerShell](quickstart-scale-compute-workspace-powershell.md)
