---
title: 'Quickstart: Scale compute for Synapse SQL pool (Azure portal)'
description: You can scale compute for Synapse SQL pool (data warehouse) using the Azure portal.
services: synapse-analytics
author: Antvgski
ms.author: anvang
manager: craigg
ms.reviewer: jrasnick
ms.date: 04/28/2020
ms.topic: quickstart
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.custom:
  - seo-lt-2019
  - azure-synapse
  - mode-portal
---

# Quickstart: Scale compute for Synapse SQL pool with the Azure portal

You can scale compute for Synapse SQL pool (data warehouse) using the Azure portal. [Scale out compute](sql-data-warehouse-manage-compute-overview.md) for better performance, or scale back compute to save costs. 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Before you begin

You can scale a SQL pool that you already have or use [Quickstart: create and connect - portal](create-data-warehouse-portal.md) to create a SQL pool named **mySampleDataWarehouse**. This quickstart scales **mySampleDataWarehouse**.

>[!IMPORTANT] 
>Your SQL pool must be online to scale. 

## Scale compute

SQL pool compute resources can be scaled by increasing or decreasing data warehouse units. The [Quickstart: create and connect - portal](create-data-warehouse-portal.md) created **mySampleDataWarehouse** and initialized it with 400 DWUs. The following steps adjust the DWUs for **mySampleDataWarehouse**.

To change data warehouse units:

1. Click **Azure Synapse Analytics (formerly SQL DW)** in the left page of the Azure portal.
2. Select **mySampleDataWarehouse** from the **Azure Synapse Analytics (formerly SQL DW)** page. The SQL pool opens.
3. Click **Scale**.

    ![Click Scale](./media/quickstart-scale-compute-portal/click-scale.png)

2. In the Scale panel, move the slider left or right to change the DWU setting. Then select scale.

    ![Move Slider](./media/quickstart-scale-compute-portal/scale-dwu.png)

## Next steps
To learn more about SQL pool, continue to the [Load data into SQL pool](./load-data-from-azure-blob-storage-using-copy.md) tutorial.
