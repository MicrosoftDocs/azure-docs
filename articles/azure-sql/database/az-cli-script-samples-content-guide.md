---
title: Azure CLI samples for Azure SQL Database & Managed Instances | Microsoft Docs
titleSuffix: Azure SQL Database & SQL Managed Instance 
description: Find Azure CLI script samples to create and manage Azure SQL Database and Azure SQL Managed Instance.
services: sql-database
ms.service: sql-db-mi
ms.subservice: deployment-configuration
ms.custom: overview-samples, mvc, sqldbrb=2, devx-track-azurecli, seo-azure-cli
ms.devlang: azurecli
ms.topic: sample
author: LitKnd
ms.author: kendralittle
ms.reviewer: mathoma
ms.date: 12/22/2021
keywords: sql database, managed instance, azure cli samples, azure cli examples, azure cli code samples, azure cli script examples
---

# Azure CLI samples for Azure SQL Database and SQL Managed Instance

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

You can configure Azure SQL Database and SQL Managed Instance by using the <a href="/cli/azure">Azure CLI</a>.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](../../../includes/azure-cli-prepare-your-environment.md)]

## Samples

## [Azure SQL Database](#tab/single-database)

The following table includes links to Azure CLI script examples to manage single and pooled databases in Azure SQL Database.

|Area|Description|
|---|---|
|**Create databases**||
| [Create a single database](scripts/create-and-configure-database-cli.md) | Creates an SQL Database and configures a server-level firewall rule. |
| [Create pooled databases](scripts/move-database-between-elastic-pools-cli.md) | Creates elastic pools, moves pooled databases, and changes compute sizes. |
|**Scale databases**||
| [Scale a single database](scripts/monitor-and-scale-database-cli.md) | Scales single database. |
| [Scale pooled database](scripts/scale-pool-cli.md) | Scales a SQL elastic pool to a different compute size. |
|**Configure geo-replication**||
| [Single database](scripts/setup-geodr-failover-database-cli.md)| Configures active geo-replication for a database in Azure SQL Database and fails it over to the secondary replica. |
| [Pooled database](scripts/setup-geodr-failover-pool-cli.md)| Configures active geo-replication for a database in an elastic pool, then fails it over to the secondary replica. |
|**Configure failover group**||
| [Configure failover group](scripts/setup-geodr-failover-group-cli.md) | Configures a failover group for a group of databases and failover over databases to the secondary server. |
| [Single database](scripts/add-database-to-failover-group-cli.md)| Creates a database and a failover group, adds the database to the failover group, then tests failover to the secondary server. |
| [Pooled database](scripts/add-elastic-pool-to-failover-group-cli.md) | Creates a database, adds it to an elastic pool, adds the elastic pool to the failover group, then tests failover to the secondary server. |
| **Auditing and threat detection** |
| [Configure auditing and threat-detection](scripts/auditing-threat-detection-cli.md)| Configures auditing and threat detection policies for a database in Azure SQL Database. |
| **Back up, restore, copy, and import a database**||
| [Back up a database](scripts/backup-database-cli.md)| Backs up a database in SQL Database to an Azure storage backup. |
| [Restore a database](scripts/restore-database-cli.md)| Restores a database in SQL Database to a specific point in time. |
| [Copy a database to a new server](scripts/copy-database-to-new-server-cli.md) | Creates a copy of an existing database in SQL Database in a new server. |
| [Import a database from a BACPAC file](scripts/import-from-bacpac-cli.md)| Imports a database to SQL Database from a BACPAC file. |


Learn more about the [single-database Azure CLI API](single-database-manage.md#azure-cli).

## [Azure SQL Managed Instance](#tab/managed-instance)

The following table includes links to Azure CLI script examples for Azure SQL Managed Instance.

|Area|Description|
|---|---|
| [Create SQL Managed Instance](../managed-instance/scripts/create-configure-managed-instance-cli.md)| Creates a SQL Managed Instance. |
| [Configure Transparent Data Encryption (TDE)](../managed-instance/scripts/transparent-data-encryption-byok-sql-managed-instance-cli.md)| Configures Transparent Data Encryption (TDE) in SQL Managed Instance by using Azure Key Vault with various key scenarios. |
| [Restore geo-backup](../managed-instance/scripts/restore-geo-backup-cli.md) | Performs a geo-restore between two instanced of SQL Managed Instance to a specific point in time. |


For additional SQL Managed Instance examples, see the [create](/archive/blogs/sqlserverstorageengine/create-azure-sql-managed-instance-using-azure-cli), [update](/archive/blogs/sqlserverstorageengine/modify-azure-sql-database-managed-instance-using-azure-cli), [move a database](/archive/blogs/sqlserverstorageengine/cross-instance-point-in-time-restore-in-azure-sql-database-managed-instance), and [working with](https://medium.com/azure-sqldb-managed-instance/working-with-sql-managed-instance-using-azure-cli-611795fe0b44) scripts.

Learn more about the [SQL Managed Instance Azure CLI API](../managed-instance/api-references-create-manage-instance.md#azure-cli-create-and-configure-managed-instances).

---
