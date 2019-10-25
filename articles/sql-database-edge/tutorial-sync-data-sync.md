---
title: Sync data from Azure SQL Database Edge using SQL Data Sync | Microsoft Docs
description: Learn about syncing data between Azure SQL Database Edge with Azure SQL Data Sync
keywords: sql database edge,sync data from sql database edge, sql database edge data sync
services: sql-database-edge
ms.service: sql-database-edge
ms.topic: tutorial
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 11/04/2019
---

# Tutorial: Sync data from SQL Database Edge to Azure SQL Database using SQL Data Sync

In this tutorial, you will learn how to use SQL Data Sync *sync group* to incrementally sync data from Azure SQL Database Edge to Azure SQL Database. SQL Data Sync is a service built on Azure SQL Database that lets you synchronize the data you select bi-directionally across multiple SQL databases and SQL Server instances. For more information on Azure SQL Data Sync, see [Azure SQL Data Sync](../sql-database/sql-database-sync-data.md).

Since Azure SQL Database Edge is build on the latest versions of the [Microsoft SQL Server Database Engine](/sql/sql-server/sql-server-technical-documentation/), any data synchronization mechanism that is applicable to an on-premises SQL Server instance can also be used to sync data to or from an SQL Database Edge instance running on an edge device.

## Prerequisites

This tutorial requires a Windows computer configured with the [Azure SQL Data Sync Agent](../sql-database/sql-database-data-sync-agent.md).

## Before you begin

* Create an Azure SQL Database. For information on how to create an Azure SQL Database using Azure portal, see [Create a single database in Azure SQL Database](../sql-database/sql-database-single-database-get-started.md?tabs=azure-portal).

* Create the tables and other necessary objects in your Azure SQL Database deployment.

* Create the necessary tables and objects in your Azure SQL Database Edge deployment. For more information, see [Using SQL Database DAC packages with SQL Database Edge](stream-analytics.md).

* Register the Azure SQL Database Edge instance with the Azure SQL Data Sync agent. For more information, see [Add an on-premises SQL Server database](../sql-database/sql-database-get-started-sql-data-sync.md#add-on-prem).

## Sync Data between an Azure SQL Database and SQL Database Edge

Setting up synchronization between an Azure SQL Database and a SQL Database Edge instance using SQL Data Sync involves three key steps.  

1. Use Azure portal to create a sync group. To create the Sync Group, see [Create Sync Group using Azure portal](../sql-database/sql-database-get-started-sql-data-sync.md#create-sync-group). The same *Hub* database can be used to create multiple different sync groups to synchronize data from different SQL Database Edge instances to one or more SQL Databases in Azure.

2. Add Sync members to the sync group. To add members to the Sync Group refer [Add members to SQL Data Sync Group](../sql-database/sql-database-get-started-sql-data-sync.md#add-sync-members).

3. Configure the sync group to select the tables that will be part of this synchronization. To configure the sync group, see [Configure Sync Group](../sql-database/sql-database-get-started-sql-data-sync.md#add-sync-members).

After completing the above steps, you have a sync group that includes an Azure SQL Database and a SQL Database Edge instance.

For more info about SQL Data Sync, seen the following articles:

* [Data Sync Agent for Azure SQL Data Sync](../sql-database/sql-database-data-sync-agent.md)

* [Best practices](../sql-database/sql-database-best-practices-data-sync.md) and [How to troubleshoot issues with Azure SQL Data Sync](../sql-database/sql-database-troubleshoot-data-sync.md)

* [Monitor SQL Data Sync with Azure Monitor logs](../sql-database/sql-database-sync-monitor-oms.md)

* [Update the sync schema with Transact-SQL](../sql-database/sql-database-update-sync-schema.md) or [PowerShell](../sql-database/scripts/sql-database-sync-update-schema.md)

## Next steps

* [Use Powershell to sync between Azure SQL Database and Azure SQL Database Edge](../sql-database/scripts/sql-database-sync-data-between-azure-onprem.md). In the tutorial, replace the *OnPremiseServer* database details with the Azure SQL Database Edge details.
