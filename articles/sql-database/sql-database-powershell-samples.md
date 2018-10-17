---
title: Azure PowerShell script examples for SQL Database | Microsoft Docs
description: Azure PowerShell script examples to help you create and manage Azure SQL Database servers, elastic pools, databases, and firewalls. 
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom:
ms.devlang: PowerShell
ms.topic: sample
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 09/14/2018
---

# Azure PowerShell samples for Azure SQL Database

The following table includes links to sample Azure PowerShell scripts for Azure SQL Database.

| |  |
|---|---|
|**Create a single database and an elastic pool**||
| [Create a single database and configure a firewall rule](scripts/sql-database-create-and-configure-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates a single Azure SQL database and configures a server-level firewall rule. |
| [Create elastic pools and move pooled databases](scripts/sql-database-move-database-between-pools-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates Azure SQL Database elastic pools, and moves pooled databases, and changes compute sizes.|
| [Create and manage a Managed Instance](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/06/27/quick-start-script-create-azure-sql-managed-instance-using-powershell/) | These CLI scripts show you have to create and manage a Managed Instance using the Azure PowerShell |
|**Configure geo-replication and failover**||
| [Configure and failover a single database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures active geo-replication for a single Azure SQL database and fails it over to the secondary replica. |
| [Configure and failover a pooled database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-pool-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures active geo-replication for an Azure SQL database in a SQL elastic pool, and fails it over to the secondary replica. |
| [Configure and failover a failover group for a single database](scripts/sql-database-setup-geodr-failover-database-failover-group-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script configures a failover group for an Azure SQL Database server instance, adds a database to the failover group, and fails it over to the secondary server |
|**Scale a single databases and an elastic pool**||
| [Scale a single database](scripts/sql-database-monitor-and-scale-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script monitors the performance metrics of an Azure SQL database, scales it to a higher compute size and creates an alert rule on one of the performance metrics. |
| [Scale an elastic pool](scripts/sql-database-monitor-and-scale-pool-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script monitors the performance metrics of an Azure SQL Database elastic pool, scales it to a higher compute size, and creates an alert rule on one of the performance metrics.  |
| **Auditing and threat detection** |
| [Configure auditing and threat-detection](scripts/sql-database-auditing-and-threat-detection-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures auditing and threat detection policies for an Azure SQL database. |
| **Restore, copy, and import a database**||
| [Restore a database](scripts/sql-database-restore-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script restores an Azure SQL database from a geo-redundant backup and restores a deleted Azure SQL database to the latest backup. |
| [Copy a database to new server](scripts/sql-database-copy-database-to-new-server-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script creates a copy of an existing Azure SQL database in a new Azure SQL server. |
| [Import a database from a bacpac file](scripts/sql-database-import-from-bacpac-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script imports a database to an Azure SQL server from a bacpac file. |
| **Sync data between databases**||
| [Sync data between SQL databases](scripts/sql-database-sync-data-between-sql-databases.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script configures Data Sync to sync between multiple Azure SQL databases. |
| [Sync data between SQL Database and SQL Server on-premises](scripts/sql-database-sync-data-between-azure-onprem.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script configures Data Sync to sync between an Azure SQL database and a SQL Server on-premises database. |
| [Update the SQL Data Sync sync schema](scripts/sql-database-sync-update-schema.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script adds or removes items from the Data Sync sync schema. |
|||
