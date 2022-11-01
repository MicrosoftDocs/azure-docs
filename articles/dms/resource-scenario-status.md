---
title: Supported database migration scenarios
titleSuffix: Azure Database Migration Service
description: Learn which migration scenarios are supported for Azure Database Migration Service and their availability.
author: croblesm
ms.author: roblescarlos
manager: craigg
ms.reviewer: craigg, randolphwest
ms.date: 06/13/2022
ms.service: dms
ms.topic: troubleshooting
ms.custom: mvc
services: database-migration
---

# Migration scenarios supported by Azure Database Migration Service

Azure Database Migration Service supports a mix of migration scenarios (source and target pairs) for both offline (one-time) and online (continuous sync) database migrations. New scenarios are added over time to extend Database Migration Service scenario coverage. In this article, you can learn which migration scenarios are currently supported by Database Migration Service and get the availability status, preview or generally available, for each scenario.

## Offline vs. online migration

With Azure Database Migration Service, you can do an offline or an online migration. With *offline* migrations, application downtime begins at the same time that the migration starts. To limit downtime to the time required to cut over to the new environment when the migration completes, use an *online* migration. It's recommended to test an offline migration to determine whether the downtime is acceptable; if not, do an online migration.

## Migration scenario status

The status of migration scenarios supported by Database Migration Service varies with time. Generally, scenarios are first released in *private preview*. After private preview, the scenario status changes to *public preview*. In public preview, Database Migration Service users can try out migration scenarios in directly in the UI. No sign-up is required. Migration scenarios in public preview might not be available in all regions, and they might be revised before final release.

After public preview, the scenario status changes to *general availability* (GA). GA is the final release status. Scenarios that have a status of GA have complete functionality and are accessible to all users.

## Migration scenario support

The tables in this section show the status of specific migration scenarios that are supported in Database Migration Service.

> [!NOTE]  
> If a supported scenario doesn't appear in the UI, please contact [Ask Azure Database Migrations](mailto:AskAzureDatabaseMigrations@service.microsoft.com) for information.

### Offline (one-time) migration support

The following table describes the current status of Database Migration Service support for *offline* migrations:

| Target | Source | Support | Status |
| ------------- | ------------- |:-------------:|:-------------:|
| **Azure SQL Database** | SQL Server <sup>1</sup> | ✔ | Preview |
| | Amazon RDS SQL Server | ✔ | Preview |
| | Oracle | X | |
| **Azure SQL Database Managed Instance** | SQL Server <sup>1</sup> | ✔ | GA |
| | Amazon RDS SQL Server | X | |
| | Oracle | X | |
| **Azure SQL VM** | SQL Server <sup>1</sup> | ✔ | GA |
| | Amazon RDS SQL Server | X | |
| | Oracle | X | |
| **Azure Cosmos DB** | MongoDB | ✔ | GA |
| **Azure Database for MySQL - Single Server** | MySQL | ✔ | GA |
| | Amazon RDS MySQL | ✔ | GA |
| | Azure Database for MySQL <sup>2</sup> | ✔ | GA |
| **Azure Database for MySQL - Flexible Server** | MySQL | ✔ | GA |
| | Amazon RDS MySQL | ✔ | GA |
| | Azure Database for MySQL <sup>2</sup> | ✔ | GA |
| **Azure Database for PostgreSQL - Single Server** | PostgreSQL | X |
| | Amazon RDS PostgreSQL | X | |
| **Azure Database for PostgreSQL - Flexible Server** | PostgreSQL | X |
| | Amazon RDS PostgreSQL | X | |
| **Azure Database for PostgreSQL - Hyperscale (Citus)** | PostgreSQL | X |
| | Amazon RDS PostgreSQL | X | |

<sup>1</sup> Offline migrations by using the Azure SQL Migration extension for Azure Data Studio are supported for Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, and Azure SQL Database. For more information, see [Migrate databases by using the Azure SQL Migration extension for Azure Data Studio](migration-using-azure-data-studio.md).

<sup>2</sup> If your source database is already in an Azure platform as a service (PaaS) like Azure Database for MySQL or Azure Database for PostgreSQL, choose the corresponding engine when you create your migration activity. For example, if you're migrating from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server, choose MySQL as the source engine when you create your scenario. If you're migrating from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server, choose PostgreSQL as the source engine when you create your scenario.

### Online (continuous sync) migration support

The following table describes the current status of Database Migration Service support for *online* migrations:

| Target | Source | Support | Status |
| ------------- | ------------- |:-------------:|:-------------:|
| **Azure SQL Database** | SQL Server <sup>1</sup>| X | |
| | Amazon RDS SQL | X | |
| | Oracle | X | |
| **Azure SQL Database MI** | SQL Server <sup>1</sup>| ✔ | GA |
| | Amazon RDS SQL | X | |
| | Oracle | X | |
| **Azure SQL VM** | SQL Server <sup>1</sup>| ✔ | GA |
| | Amazon RDS SQL | X | |
| | Oracle | X | |
| **Azure Cosmos DB** | MongoDB | ✔ | GA |
| **Azure Database for MySQL - Flexible Server** | Azure Database for MySQL - Single Server | ✔ | Preview |
| | MySQL | ✔  | Preview |
| | Amazon RDS MySQL | ✔  | Preview |
| **Azure Database for PostgreSQL - Single Server** | PostgreSQL | ✔ | GA |
| | Azure Database for PostgreSQL - Single Server <sup>2</sup> | ✔ | GA |
| | Amazon RDS PostgreSQL | ✔ | GA |
| **Azure Database for PostgreSQL - Flexible Server** | PostgreSQL | ✔ | GA |
| | Azure Database for PostgreSQL - Single Server <sup>2</sup> | ✔ | GA |
| | Amazon RDS PostgreSQL | ✔ | GA |
| **Azure Database for PostgreSQL - Hyperscale (Citus)** | PostgreSQL | ✔ | GA |
| | Amazon RDS PostgreSQL | ✔ | GA |

<sup>1</sup> Online migrations (minimal downtime) that use the Azure SQL Migration extension for Azure Data Studio are supported for Azure SQL Managed Instance and SQL Server on Azure Virtual Machines targets. For more information, see [Migrate databases by using the Azure SQL Migration extension for Azure Data Studio](migration-using-azure-data-studio.md).

<sup>2</sup> If your source database is already in an Azure PaaS like Azure Database for MySQL or Azure Database for PostgreSQL, choose the corresponding engine when you create your migration activity. For example, if you're migrating from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server, choose MySQL as the source engine when you create the scenario. If you're migrating from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server, choose PostgreSQL as the source engine when you create the scenario.

## Next steps

For an overview of Database Migration Service and regional availability, see [What is Azure Database Migration Service?](dms-overview.md)
