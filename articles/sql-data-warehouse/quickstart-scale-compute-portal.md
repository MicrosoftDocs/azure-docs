---
title: 'Quickstart: Scale out compute in Azure SQL Data Warehouse - Azure portal | Microsoft Docs'
description: Scale compute in Azure SQL Data Warehouse in the Azure portal. Scale out compute for better performance, or scale back compute to save costs. 
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: quickstart
ms.subservice: implement
ms.date: 04/17/2018
ms.author: kevin
ms.reviewer: jrasnick
---

## Quickstart: Scale compute in Azure SQL Data Warehouse in the Azure portal

Scale compute in Azure SQL Data Warehouse in the Azure portal. [Scale out compute](sql-data-warehouse-manage-compute-overview.md) for better performance, or scale back compute to save costs. 

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Before you begin

You can scale a data warehouse that you already have, or use [Quickstart: create and connect - portal](create-data-warehouse-portal.md) to create a data warehouse named **mySampleDataWarehouse**.  This quickstart scales **mySampleDataWarehouse**.

>[!Note]
>Your data warehouse must be online to scale. 

## Scale compute

SQL Data Warehouse compute resources can be scaled by increasing or decreasing data warehouse units. The [create and connect - portal] quickstart(create-data-warehouse-portal.md) created **mySampleDataWarehouse** and initialized it with 400 DWUs. The following steps adjust the DWUs for **mySampleDataWarehouse**.

To change data warehouse units:

1. Click **SQL data warehouses** in the left page of the Azure portal.
2. Select **mySampleDataWarehouse** from the **SQL data warehouses** page. The data warehouse opens.
3. Click **Scale**.

    ![Click Scale](media/quickstart-scale-compute-portal/click-scale.png)

2. In the Scale panel, move the slider left or right to change the DWU setting.

    ![Move Slider](media/quickstart-scale-compute-portal/scale-dwu.png)

3. Click **Save**. A confirmation message appears. Click **yes** to confirm or **no** to cancel.

    ![Click Save](media/quickstart-scale-compute-portal/confirm-change.png)



## Next steps
You've now learned to scale compute for your data warehouse. To learn more about Azure SQL Data Warehouse, continue to the tutorial for loading data.

> [!div class="nextstepaction"]
>[Load data into a SQL data warehouse](load-data-from-azure-blob-storage-using-polybase.md)
