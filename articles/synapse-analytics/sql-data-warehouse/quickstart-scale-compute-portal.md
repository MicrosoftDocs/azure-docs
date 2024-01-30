---
title: "Quickstart: Scale compute for an Azure Synapse dedicated SQL pool (formerly SQL DW) with the Azure portal"
description: You can scale compute for an Azure Synapse dedicated SQL pool (formerly SQL DW) with the Azure portal.
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

# Quickstart: Scale compute for an Azure Synapse dedicated SQL pool (formerly SQL DW) with the Azure portal

You can scale compute for an Azure Synapse dedicated SQL pool (formerly SQL DW) with the Azure portal. [Scale out compute](sql-data-warehouse-manage-compute-overview.md) for better performance, or scale back compute to save costs.

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

> [!NOTE]  
> This article applies to dedicated SQL pools (formerly SQL DW). This content does not apply to dedicated SQL pools in an Azure Synapse Analytics workspace. For similar instructions for dedicated SQL pools (formerly SQL DW), see [Quickstart: Scale compute for an Azure Synapse dedicated SQL pool in a Synapse workspace with the Azure portal](quickstart-scale-compute-workspace-portal.md).
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

1. Select **Azure Synapse Analytics (formerly SQL DW)** in the left page of the Azure portal.
1. Select `mySampleDataWarehouse` from the **Azure Synapse Analytics (formerly SQL DW)** page. The SQL pool opens.
1. Select **Scale**.

    :::image type="content" source="./media/quickstart-scale-compute-portal/scale-dedicated-sql-pool-azure-portal.png" alt-text="A screenshot of the Azure portal showing the Scale button on the Overview page of a dedicated sql pool (formerly SQL DW)." lightbox="./media/quickstart-scale-compute-portal/scale-dedicated-sql-pool-azure-portal.png":::

1. In the Scale panel, move the slider left or right to change the DWU setting. Then select scale.

    :::image type="content" source="./media/quickstart-scale-compute-portal/scale-dwu.png" alt-text="A screenshot of the Azure portal showing the scale slider.":::

## Next steps

- To learn more about SQL pool, continue to the [Load data into SQL pool](./load-data-from-azure-blob-storage-using-copy.md) tutorial.
