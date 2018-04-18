---
title: Upgrade to the latest generation of Azure SQL Data Warehouse | Microsoft Docs
description: Steps to upgrade Azure SQL Data Warehouse to latest generation of Azure hardware and storage architecture.
services: sql-data-warehouse
author: kevinvngo
manager: craigg-msft
ms.services: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 04/02/2018
ms.author: kevin
ms.reviewer: igorstan
---

# Upgrade to latest generation of Azure SQL Data Warehouse in the Azure portal

Use the Azure portal to upgrade your Azure SQL Data Warehouse to use the latest generation of Azure hardware and storage architecture. By upgrading, you can take advantage of faster performance, greater scalability, and unlimited storage for columnstore indexes.  

## Applies to
This upgrade applies to data warehouses in the Optimized for Elasticity performance tier.  The instructions upgrade a data warehouse from the Optimized for Elasticity performance tier to the Optimized for Compute performance tier. 

## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Before you begin

1. If the Optimized for Elasticity data warehouse to be upgraded is paused, [resume the data warehouse](pause-and-resume-compute-portal.md).
2. Be prepared for a few minutes of downtime. 
3. The upgrade process kills all sessions and drops all connections. Before upgrading, ensure your queries have completed. If you start an upgrade with transactions in progress, the rollback time can be extensive. 

## Start the upgrade

1. Open your data warehouse in the Azure portal, and click **Upgrade to Optimized for Compute**.
2. Notice the Optimized for Compute performance tier choices. The default selection is comparable to the current level before the upgrade.
3. Choose a performance tier. The price of the Optimized for Compute performance tier is currently half-off during the preview period.
4. Click **Upgrade**.
5. Check the status in the Azure portal.
6. Wait for the data warehouse to change to Online.

## Rebuild columnstore indexes

Once your data warehouse is online, you can load data and run queries. However, performance can be slow at first because a background process is migrating the data to the new hardware. 

To force the data to migrate as quickly as possible, we recommend rebuilding the columnstore indexes. To do this, see guidance for [Rebuilding columnstore indexes to improve segment quality](sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality). 

## Next steps
Your data warehouse is online. To use the new performance features, see [Resource classes for Workload Management](resource-classes-for-workload-management.md).
 