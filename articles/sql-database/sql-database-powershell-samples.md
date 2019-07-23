---
title: Azure PowerShell script examples for SQL Database | Microsoft Docs
description: Azure PowerShell script examples to help you create and manage Azure SQL Database servers, elastic pools, databases, and firewalls. 
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom:
ms.devlang: PowerShell
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer:
manager: craigg
ms.date: 03/25/2019
---

# Azure PowerShell samples for Azure SQL Database

Azure SQL Database enables you to configure your databases, instances, and pools using Azure PowerShell.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the PowerShell locally, this tutorial requires AZ PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## Single Database and Elastic pools

The following table includes links to sample Azure PowerShell scripts for Azure SQL Database.

| |  |
|---|---|
|**Create and configure single databases, and elastic pools**||
| [Create a single database and configure a database server firewall rule](scripts/sql-database-create-and-configure-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates a single Azure SQL database and configures a server-level firewall rule. |
| [Create elastic pools and move pooled databases](scripts/sql-database-move-database-between-pools-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates Azure SQL Database elastic pools, and moves pooled databases, and changes compute sizes.|
|**Configure geo-replication and failover**||
| [Configure and failover a single database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures active geo-replication for a single Azure SQL database and fails it over to the secondary replica. |
| [Configure and failover a pooled database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-pool-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures active geo-replication for an Azure SQL database in a SQL elastic pool, and fails it over to the secondary replica. |
|**Scale a single database and an elastic pool**||
| [Scale a single database](scripts/sql-database-monitor-and-scale-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script monitors the performance metrics of an Azure SQL database, scales it to a higher compute size and creates an alert rule on one of the performance metrics. |
| [Scale an elastic pool](scripts/sql-database-monitor-and-scale-pool-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script monitors the performance metrics of an Azure SQL Database elastic pool, scales it to a higher compute size, and creates an alert rule on one of the performance metrics. |
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

Learn more about the [Single Database Azure PowerShell API](sql-database-single-databases-manage.md#powershell-manage-sql-database-servers-and-single-databases).

## Managed Instance

The following table includes links to sample Azure PowerShell scripts for Azure SQL Database - Managed Instance.

| |  |
|---|---|
|**Create and configure managed instances**||
| [Create and manage a Managed Instance](scripts/sql-database-create-configure-managed-instance-powershell.md) | This PowerShell script shows you how to create and manage a Managed Instance using the Azure PowerShell |
| [Create and manage a Managed Instance using Azure Resource Manager template](scripts/sql-managed-instance-create-powershell-azure-resource-manager-template.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script shows you how to create and manage a Managed Instance using the Azure PowerShell and Azure Resource Manager template.|
| [Restore database to a Managed Instance in another Geo-region](scripts/sql-managed-instance-restore-geo-backup.md) | This PowerShell script is taking a backup of one database and restore it to another region. This is known as Geo-Restore disaster recovery scenario. |
| **Configure Transparent Data Encryption (TDE)**||
| [Manage Transparent Data Encryption in a Managed Instance using your own key from Azure Key Vault](scripts/transparent-data-encryption-byok-sql-managed-instance-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures Transparent Data Encryption (TDE) in Bring Your Own Key scenario for Azure SQL Managed Instance, using a key from Azure Key Vault|
|||

Learn more about the [Managed Instance Azure PowerShell API](sql-database-managed-instance-create-manage.md#powershell-create-and-manage-managed-instances).

## Additional resources

The examples listed on this page use the [Azure SQL Database cmdlets](/powershell/module/az.sql/) for creating and managing Azure SQL resources. Additional cmdlets for running queries, and performing many database tasks are located in the [sqlserver](/powershell/module/sqlserver/) module. For more information, see [SQL Server PowerShell](/sql/powershell/sql-server-powershell/).
