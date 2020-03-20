---
title: Sync data from Azure SQL Database Edge by using SQL Data Sync | Microsoft Docs
description: Learn about syncing data from Azure SQL Database Edge by using Azure SQL Data Sync
keywords: sql database edge,sync data from sql database edge, sql database edge data sync
services: sql-database-edge
ms.service: sql-database-edge
ms.topic: tutorial
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 11/04/2019
---

# Tutorial: Sync data from SQL Database Edge to Azure SQL Database by using SQL Data Sync

In this tutorial, you'll learn how to use an Azure SQL Data Sync *sync group* to incrementally sync data from Azure SQL Database Edge to Azure SQL Database. SQL Data Sync is a service built on Azure SQL Database that lets you synchronize the data you select bi-directionally across multiple SQL databases and SQL Server instances. For more information on SQL Data Sync, see [Azure SQL Data Sync](../sql-database/sql-database-sync-data.md).

Because SQL Database Edge is built on the latest versions of the [SQL Server Database Engine](/sql/sql-server/sql-server-technical-documentation/), any data synchronization mechanism that's applicable to an on-premises SQL Server instance can also be used to sync data to or from a SQL Database Edge instance running on an edge device.

## Prerequisites

This tutorial requires a Windows computer configured with the [Data Sync Agent for Azure SQL Data Sync](../sql-database/sql-database-data-sync-agent.md).

## Before you begin

* Create an Azure SQL database. For information on how to create an Azure SQL database by using the Azure portal, see [Create a single database in Azure SQL Database](../sql-database/sql-database-single-database-get-started.md?tabs=azure-portal).

* Create the tables and other necessary objects in your Azure SQL Database deployment.

* Create the necessary tables and objects in your Azure SQL Database Edge deployment. For more information, see [Using SQL Database DAC packages with SQL Database Edge](stream-analytics.md).

* Register the Azure SQL Database Edge instance with the Data Sync Agent for Azure SQL Data Sync. For more information, see [Add an on-premises SQL Server database](../sql-database/sql-database-get-started-sql-data-sync.md#add-on-prem).

## Sync data between an Azure SQL database and SQL Database Edge

Setting up synchronization between an Azure SQL database and a SQL Database Edge instance by using SQL Data Sync involves three key steps:  

1. Use the Azure portal to create a sync group. For more information, see [Create a sync group](../sql-database/sql-database-get-started-sql-data-sync.md#create-sync-group). You can use a single *hub* database to create multiple sync groups to synchronize data from various SQL Database Edge instances to one or more SQL databases in Azure.

2. Add sync members to the sync group. For more information, see [Add sync members](../sql-database/sql-database-get-started-sql-data-sync.md#add-sync-members).

3. Set up the sync group to select the tables that will be part of the synchronization. For more information, see [Configure a sync group](../sql-database/sql-database-get-started-sql-data-sync.md#add-sync-members).

After you complete the preceding steps, you'll have a sync group that includes an Azure SQL database and a SQL Database Edge instance.

For more info about SQL Data Sync, see these articles:

* [Data Sync Agent for Azure SQL Data Sync](../sql-database/sql-database-data-sync-agent.md)

* [Best practices](../sql-database/sql-database-best-practices-data-sync.md) and [How to troubleshoot issues with Azure SQL Data Sync](../sql-database/sql-database-troubleshoot-data-sync.md)

* [Monitor SQL Data Sync with Azure Monitor logs](../sql-database/sql-database-sync-monitor-oms.md)

* [Update the sync schema with Transact-SQL](../sql-database/sql-database-update-sync-schema.md) or [PowerShell](../sql-database/scripts/sql-database-sync-update-schema.md)

## Next steps

* [Use PowerShell to sync between Azure SQL Database and Azure SQL Database Edge](../sql-database/scripts/sql-database-sync-data-between-azure-onprem.md). In this tutorial, replace the `OnPremiseServer` database details with the Azure SQL Database Edge details.
