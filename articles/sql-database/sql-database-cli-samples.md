---
title: Azure CLI script examples
description: Azure CLI script examples to create and manage Azure SQL Database servers, elastic pools, databases, and firewalls. 
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: overview-samples, mvc
ms.devlang: azurecli
ms.topic: sample
author: stevestein
ms.author: sstein
ms.reviewer:
ms.date: 02/03/2019
---

# Azure CLI samples for Azure SQL Database

Azure SQL Database can be configured using <a href="/cli/azure">Azure CLI</a>.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this topic requires that you are running the Azure CLI version 2.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## [Single database & Elastic pools](#tab/single-database)

The following table includes links to Azure CLI script examples for Azure SQL Database.

| | |
|---|---|
|**Create a single database and an elastic pool**||
| [Create a single database and configure a firewall rule](scripts/sql-database-create-and-configure-database-cli.md) | This CLI script creates a single Azure SQL database and configures a server-level firewall rule. |
| [Create elastic pools and move pooled databases](scripts/sql-database-move-database-between-pools-cli.md) | This CLI script creates SQL elastic pools,moves pooled Azure SQL databases, and changes compute sizes. |
|**Scale a single database and an elastic pool**||
| [Scale a single database](scripts/sql-database-monitor-and-scale-database-cli.md) | This CLI script scales a single Azure SQL database to a different compute size after querying the size information for the database. |
| [Scale an elastic pool](scripts/sql-database-scale-pool-cli.md) | This CLI script scales a SQL elastic pool to a different compute size. |
|**Configure geo-replication and failover**||
| [Add single database to failover group](scripts/sql-database-add-single-db-to-failover-group-cli.md)| This CLI script creates a database, and a failover group, adds the database to the failover group and tests failover to the secondary server. |
| [Configure a failover group for an elastic pool](scripts/sql-database-add-elastic-pool-to-failover-group-cli.md) | This CLI script creates a database, adds it to an elastic pool, adds the elastic pool to the failover group and tests failover to the secondary server. |
| [Configure and failover a single database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-database-cli.md)| This CLI script configures active geo-replication for a single Azure SQL database and fails it over to the secondary replica. |
| [Configure and failover a pooled database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-pool-cli.md)| This CLI script configures active geo-replication for an Azure SQL database in a SQL elastic pool, and fails it over to the secondary replica. |
| **Auditing and threat detection** |
| [Configure auditing and threat-detection](scripts/sql-database-auditing-and-threat-detection-cli.md)| This CLI script configures auditing and threat detection policies for an Azure SQL database. |
| **Backup, restore, copy, and import a database**||
| [Backup a database](scripts/sql-database-backup-database-cli.md)| This CLI script backs up an Azure SQL database to an Azure storage backup. |
| [Restore a database](scripts/sql-database-restore-database-cli.md)| This CLI script restores an Azure SQL database from a geo-redundant backup and restores a deleted Azure SQL database to the latest backup. |
| [Copy a database to new server](scripts/sql-database-copy-database-to-new-server-cli.md) | This CLI script creates a copy of an existing Azure SQL database in a new Azure SQL server. |
| [Import a database from a bacpac file](scripts/sql-database-import-from-bacpac-cli.md)| This CLI script imports a database to an Azure SQL server from a bacpac file. |
|||

Learn more about the [Single Database Azure CLI API](sql-database-single-databases-manage.md#azure-cli-manage-sql-database-servers-and-single-databases).

## [Managed Instance](#tab/managed-instance)

The following table includes links to Azure CLI script examples for Azure SQL Database - Managed Instance.

| | |
|---|---|
| **Create a Managed Instance**||
| [Create a Managed Instance](scripts/sql-database-create-configure-managed-instance-cli.md)| This CLI script shows how to create a Managed Instance. |
| **Configure Transparent Data Encryption (TDE)**||
| [Manage Transparent Data Encryption in a Managed Instance using your own key from Azure Key Vault](scripts/transparent-data-encryption-byok-sql-managed-instance-cli.md)| This CLI script configures Transparent Data Encryption (TDE) in Bring Your Own Key scenario for Azure SQL Managed Instance, using a key from Azure Key Vault|
|**Configure a failover group**||
| [Configure a failover group for a managed instance](scripts/sql-database-add-managed-instance-to-failover-group-cli.md) | This CLI script creates two managed instances, adds them to a failover group, and then tests failover from the primary managed instance to the secondary managed instance. |
|||

For alternative ways to create a managed instance with the Azure CLI, see [Create a Managed Instance](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../create-azure-sql-managed-instance-using-azure-cli/), [Update a Managed Instance](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../modify-azure-sql-database-managed-instance-using-azure-cli/), and [Move a database to another Managed Instance](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../cross-instance-point-in-time-restore-in-azure-sql-database-managed-instance/).

Learn more about the [Managed Instance Azure CLI API](sql-database-managed-instance-create-manage.md#azure-cli-create-and-manage-managed-instances) and find [additional examples here](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44).

---
