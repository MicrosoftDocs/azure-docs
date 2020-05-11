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

# [Single database & elastic pools](#tab/single-database)

| | |
|---|---|
|**Create a single database and an elastic pool**||
| [Create a single database and configure a firewall rule](scripts/sql-database-create-and-configure-database-cli.md) | Creates an Azure SQL database and configures a server-level firewall rule. |
| [Create elastic pools and move pooled databases](scripts/sql-database-move-database-between-pools-cli.md) | Creates SQL elastic pools, moves pooled Azure SQL databases, and changes compute sizes. |
|**Scale a single database and an elastic pool**||
| [Scale a single database](scripts/sql-database-monitor-and-scale-database-cli.md) | Scales an Azure SQL database to a different compute size after querying the size information for the database. |
| [Scale an elastic pool](scripts/sql-database-scale-pool-cli.md) | Scales a SQL elastic pool to a different compute size. |
|**Configure geo-replication and failover**||
| [Add single database to failover group](scripts/sql-database-add-single-db-to-failover-group-cli.md)| Creates a database and a failover group, adds the database to the failover group, then tests failover to the secondary server. |
| [Configure a failover group for an elastic pool](scripts/sql-database-add-elastic-pool-to-failover-group-cli.md) | Creates a database, adds it to an elastic pool, adds the elastic pool to the failover group, then tests failover to the secondary server. |
| [Configure and failover a single database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-database-cli.md)| Configures active geo-replication for an Azure SQL database and fails it over to the secondary replica. |
| [Configure and failover a pooled database using active geo-replication](scripts/sql-database-setup-geodr-and-failover-pool-cli.md)| Configures active geo-replication for an Azure SQL database in a SQL elastic pool, then fails it over to the secondary replica. |
| **Auditing and threat detection** |
| [Configure auditing and threat-detection](scripts/sql-database-auditing-and-threat-detection-cli.md)| Configures auditing and threat detection policies for an Azure SQL database. |
| **Backup, restore, copy, and import a database**||
| [Backup a database](scripts/sql-database-backup-database-cli.md)| Backs up an Azure SQL database to an Azure storage backup. |
| [Restore a database](scripts/sql-database-restore-database-cli.md)| Restores an Azure SQL database from a geo-redundant backup and restores a deleted Azure SQL database to the latest backup. |
| [Copy a database to new server](scripts/sql-database-copy-database-to-new-server-cli.md) | Creates a copy of an existing Azure SQL database in a new Azure SQL server. |
| [Import a database from a bacpac file](scripts/sql-database-import-from-bacpac-cli.md)| Imports a database to an Azure SQL server from a *.bacpac* file. |
|||

Learn more about the [single database Azure CLI API](sql-database-single-databases-manage.md#azure-cli-manage-sql-database-servers-and-single-databases).

# [Managed Instance](#tab/managed-instance)

The following table includes links to Azure CLI script examples for Azure SQL Database - Managed Instance.

| | |
|---|---|
| **Create a Managed Instance**||
| [Create a managed instance](scripts/sql-database-create-configure-managed-instance-cli.md)| Creates a managed instance. |
| **Configure Transparent Data Encryption (TDE)**||
| [Manage Transparent Data Encryption in a Managed Instance using Azure Key Vault](scripts/transparent-data-encryption-byok-sql-managed-instance-cli.md)| Configures Transparent Data Encryption (TDE) in Azure SQL Managed Instance using Azure Key Vault with various key scenarios. |
|**Configure a failover group**||
| [Configure a failover group for a managed instance](scripts/sql-database-add-managed-instance-to-failover-group-cli.md) | Creates two managed instances, adds them to a failover group, then tests failover from the primary managed instance to the secondary managed instance. |
|||

For additional Managed Instance examples, see the [create](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../create-azure-sql-managed-instance-using-azure-cli/), [update](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../modify-azure-sql-database-managed-instance-using-azure-cli/), [move a database](https://blogs.msdn.microsoft.com/sqlserverstorageengine/20../../cross-instance-point-in-time-restore-in-azure-sql-database-managed-instance/), [working with](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44) scripts.

Learn more about the [managed instance Azure CLI API](sql-database-managed-instance-create-manage.md#azure-cli-create-and-manage-managed-instances).

---
