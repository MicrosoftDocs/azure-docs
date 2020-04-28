---
title: Azure PowerShell script examples
description: Azure PowerShell script examples to help you create and manage Azure SQL Database and Azure SQL Managed Instance resources
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom: sqldbrb=2
ms.devlang: PowerShell
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 03/25/2019
---

# Azure PowerShell samples for Azure SQL Database and Azure SQL Managed Instance

Azure SQL Database and Azure SQL Managed Instance enable you to configure your databases, instances, and pools using Azure PowerShell.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the PowerShell locally, this tutorial requires AZ PowerShell 1.4.0 or later. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

## [Azure SQL Database](#tab/single-database)

The following table includes links to sample Azure PowerShell scripts for Azure SQL Database.

| |  |
|---|---|
|**Create and configure single databases, and elastic pools**||
| [Create a single database and configure a database server firewall rule](scripts/sql-database-create-and-configure-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates a single database and configures a server-level ip firewall rule. |
| [Create elastic pools and move pooled databases](scripts/sql-database-move-database-between-pools-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates elastic pools, and moves pooled databases, and changes compute sizes.|
|**Configure geo-replication and failover**||
| [Configure and failover a single database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures active geo-replication for a single database and fails it over to the secondary replica. |
| [Configure and failover a pooled database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-pool-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures active geo-replication for a database in an elastic pool, and fails it over to the secondary replica. |
|**Configure a failover group**||
| [Configure a failover group for a single database](scripts/sql-database-add-single-db-to-failover-group-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates a database, and a failover group, adds the database to the failover group and tests failover to the secondary server. |
| [Configure a failover group for an elastic pool](scripts/sql-database-add-elastic-pool-to-failover-group-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates a database, adds it to an elastic pool, adds the elastic pool to the failover group  and tests failover to the secondary server. |
|**Scale a single database and an elastic pool**||
| [Scale a single database](scripts/sql-database-monitor-and-scale-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script monitors the performance metrics of a single database, scales it to a higher compute size and creates an alert rule on one of the performance metrics. |
| [Scale an elastic pool](scripts/sql-database-monitor-and-scale-pool-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script monitors the performance metrics of an elastic pool, scales it to a higher compute size, and creates an alert rule on one of the performance metrics. |
| **Auditing and threat detection** |
| [Configure auditing and threat-detection](scripts/sql-database-auditing-and-threat-detection-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures auditing and threat detection policies for a database. |
| **Restore, copy, and import a database**||
| [Restore a database](scripts/sql-database-restore-database-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script restores a database from a geo-redundant backup and restores a deleted database to the latest backup. |
| [Copy a database to new server](scripts/sql-database-copy-database-to-new-server-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script creates a copy of an existing database in a new server. |
| [Import a database from a bacpac file](scripts/sql-database-import-from-bacpac-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script imports a database into Azure SQL Database from a bacpac file. |
| **Sync data between databases**||
| [Sync data between SQL databases](scripts/sql-database-sync-data-between-sql-databases.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script configures Data Sync to sync between multiple databases in Azure SQL Database. |
| [Sync data between SQL Database and SQL Server on-premises](scripts/sql-database-sync-data-between-azure-onprem.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script configures Data Sync to sync between a database in Azure SQL Database and a SQL Server on-premises database. |
| [Update the SQL Data Sync sync schema](scripts/sql-database-sync-update-schema.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script adds or removes items from the Data Sync sync schema. |
|||

Learn more about the [Single Database Azure PowerShell API](sql-database-single-databases-manage.md#powershell).

## [Azure SQL Managed Instance](#tab/managed-instance)

The following table includes links to sample Azure PowerShell scripts for Azure SQL Managed Instance.

| |  |
|---|---|
|**Create and configure managed instances**||
| [Create and manage a managed instance](scripts/sql-database-create-configure-managed-instance-powershell.md) | This PowerShell script shows you how to create and manage a managed instance using the Azure PowerShell |
| [Create and manage a managed instance using Azure Resource Manager template](scripts/sql-managed-instance-create-powershell-azure-resource-manager-template.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script shows you how to create and manage a managed instance using the Azure PowerShell and Azure Resource Manager template.|
| [Restore database to a managed instance in another Geo-region](scripts/sql-managed-instance-restore-geo-backup.md) | This PowerShell script is taking a backup of one database and restore it to another region. This is known as Geo-Restore disaster recovery scenario. |
| **Configure Transparent Data Encryption (TDE)**||
| [Manage Transparent Data Encryption in a managed instance using your own key from Azure Key Vault](scripts/transparent-data-encryption-byok-sql-managed-instance-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json)| This PowerShell script configures Transparent Data Encryption (TDE) in Bring Your Own Key scenario for Azure SQL Managed Instance, using a key from Azure Key Vault|
|**Configure a failover group**||
| [Configure a failover group for a managed instance](scripts/sql-database-add-managed-instance-to-failover-group-powershell.md?toc=%2fpowershell%2fmodule%2ftoc.json) | This PowerShell script creates two managed instances, adds them to a failover group, and then tests failover from the primary managed instance to the secondary managed instance. |
|||

Learn more about [PowerShell cmdlets for Azure SQL Managed Instance](sql-database-managed-instance-create-manage.md#powershell-create-and-manage-managed-instances).

---

## Additional resources

The examples listed on this page use the [PowerShell cmdlets](/powershell/module/az.sql/) for creating and managing Azure SQL resources. Additional cmdlets for running queries, and performing many database tasks are located in the [sqlserver](/powershell/module/sqlserver/) module. For more information, see [SQL Server PowerShell](/sql/powershell/sql-server-powershell/).
