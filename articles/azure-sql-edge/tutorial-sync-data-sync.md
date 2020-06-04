---
title: Sync data from Azure SQL Edge (Preview) by using SQL Data Sync
description: Learn about syncing data from Azure SQL Edge (Preview) by using Azure SQL Data Sync
keywords: SQL Edge,sync data from SQL Edge, SQL Edge data sync
services: sql-edge
ms.service: sql-edge
ms.topic: tutorial
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 05/19/2020
---

# Tutorial: Sync data from SQL Edge to Azure SQL Database by using SQL Data Sync


In this tutorial, you'll learn how to use an Azure SQL Data Sync *sync group* to incrementally sync data from Azure SQL Edge to Azure SQL Database. SQL Data Sync is a service built on Azure SQL Database that lets you synchronize the data you select bi-directionally across multiple databases in Azure SQL Database and SQL Server instances. For more information on SQL Data Sync, see [Azure SQL Data Sync](../azure-sql/database/sql-data-sync-data-sql-server-sql-database.md).

Because SQL Edge is built on the latest versions of the [SQL Server Database Engine](/sql/sql-server/sql-server-technical-documentation/), any data synchronization mechanism that's applicable to a SQL Server instance can also be used to sync data to or from a SQL Edge instance running on an edge device.

## Prerequisites

This tutorial requires a Windows computer configured with the [Data Sync Agent for Azure SQL Data Sync](../azure-sql/database/sql-data-sync-agent-overview.md).

## Before you begin

* Create an Azure SQL database. For information on how to create an Azure SQL database by using the Azure portal, see [Create a single database in Azure SQL Database](../azure-sql/database/single-database-create-quickstart.md?tabs=azure-portal).

* Create the tables and other necessary objects in your Azure SQL Database deployment.

* Create the necessary tables and objects in your Azure SQL Edge deployment. For more information, see [Using SQL Database DAC packages with SQL Edge](deploy-dacpac.md).

* Register the Azure SQL Edge instance with the Data Sync Agent for Azure SQL Data Sync. For more information, see [Add a SQL Server database](../azure-sql/database/sql-data-sync-sql-server-configure.md#add-on-prem).

## Sync data between an Azure SQL database and SQL Edge

Setting up synchronization between an Azure SQL database and a SQL Edge instance by using SQL Data Sync involves three key steps:  


1. Use the Azure portal to create a sync group. For more information, see [Create a sync group](../azure-sql/database/sql-data-sync-sql-server-configure.md#create-sync-group). You can use a single *hub* database to create multiple sync groups to synchronize data from various SQL Edge instances to one or more databases in Azure SQL Database. 

2. Add sync members to the sync group. For more information, see [Add sync members](../azure-sql/database/sql-data-sync-sql-server-configure.md#add-sync-members).

3. Set up the sync group to select the tables that will be part of the synchronization. For more information, see [Configure a sync group](../azure-sql/database/sql-data-sync-sql-server-configure.md#add-sync-members).

After you complete the preceding steps, you'll have a sync group that includes an Azure SQL database and a SQL Edge instance.

For more info about SQL Data Sync, see these articles:

* [Data Sync Agent for Azure SQL Data Sync](../azure-sql/database/sql-data-sync-agent-overview.md)

* [Best practices](../azure-sql/database/sql-data-sync-best-practices.md) and [How to troubleshoot issues with Azure SQL Data Sync](../azure-sql/database/sql-data-sync-troubleshoot.md)

* [Monitor SQL Data Sync with Azure Monitor logs](../azure-sql/database/sql-data-sync-monitor-sync.md)

* [Update the sync schema with Transact-SQL](../azure-sql/database/sql-data-sync-update-sync-schema.md) or [PowerShell](../azure-sql/database/scripts/update-sync-schema-in-sync-group.md)

## Next steps


* [Use PowerShell to sync between Azure SQL Database and Azure SQL Edge](../azure-sql/database/scripts/sql-data-sync-sync-data-between-azure-onprem.md). In this tutorial, replace the `OnPremiseServer` database details with the Azure SQL Edge details.
