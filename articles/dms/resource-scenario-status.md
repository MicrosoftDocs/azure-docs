---
title: Supported database migration scenarios
titleSuffix: Azure Database Migration Service
description: Learn which migration scenarios are currently supported for Azure Database Migration Service and their availability status.
author: croblesm
ms.author: roblescarlos
ms.reviewer: randolphwest
ms.date: 04/27/2022
ms.service: dms
ms.topic: troubleshooting
ms.custom:
  - mvc
  - sql-migration-content
---

# Azure Database Migration Service supported scenarios

Azure Database Migration Service supports a mix of database migration scenarios (source and target pairs) for both offline (one-time) and online (continuous sync) database migrations. New scenarios are added over time to extend Database Migration Service scenario coverage. This article is updated over time to list the migration scenarios that are currently supported by Database Migration Service and their availability status, preview or generally available.

## Offline vs. online migration

In Database Migration Service, you can migrate your databases offline or while they're online. In an *offline* migration, application downtime starts when the migration starts. To limit downtime to the time it takes you to cut over to the new environment after the migration, use an *online* migration. We recommend that you test an offline migration to determine whether the downtime is acceptable. If the expected downtime isn't acceptable, do an online migration.

## Migration scenario status

The status of migration scenarios that are supported by Database Migration Service varies over time. Generally, scenarios are first released in *preview*. In preview, Database Migration Service users can try out migration scenarios directly in the UI. No sign-up is required. Migration scenarios that have a preview release status might not be available in all regions, and they might be revised before final release.

After preview, the scenario status changes to *general availability* (GA). GA is the final release status. Scenarios that have a status of GA have complete functionality and are accessible to all users.

## Supported migration scenarios

The tables in the following sections show the status of specific migration scenarios that are supported in Database Migration Service.

> [!NOTE]  
> If a supported scenario doesn't appear in the UI, contact [Ask Azure Database Migrations](mailto:AskAzureDatabaseMigrations@service.microsoft.com) for information.

### Offline (one-time) migration support

The following table describes the current status of Database Migration Service support for *offline* migrations:

| Target | Source | Support | Status |
| ------------- | ------------- |:-------------:|:-------------:|
| **Azure SQL Database** | SQL Server <sup>1</sup> | Yes | GA |
| | Amazon RDS SQL Server | Yes | GA |
| | Oracle | No | |
| **Azure SQL Database Managed Instance** | SQL Server <sup>1</sup> | Yes | GA |
| | Amazon RDS SQL Server | Yes | GA |
| | Oracle | No | |
| **Azure SQL VM** | SQL Server <sup>1</sup> | Yes | GA |
| | Amazon RDS SQL Server | Yes | GA |
| | Oracle | No | |
| **Azure Cosmos DB** | MongoDB | Yes | GA |
| **Azure Database for MySQL - Single Server** | MySQL | Yes | GA |
| | Amazon RDS MySQL | Yes | GA |
| | Azure Database for MySQL <sup>2</sup> | Yes | GA |
| **Azure Database for MySQL - Flexible Server** | MySQL | Yes | GA |
| | Amazon RDS MySQL | Yes | GA |
| | Azure Database for MySQL <sup>2</sup> | Yes | GA |
| **Azure Database for PostgreSQL - Single Server** | PostgreSQL | No |
| | Amazon RDS PostgreSQL | No | |
| **Azure Database for PostgreSQL - Flexible Server** | PostgreSQL | No |
| | Amazon RDS PostgreSQL | No | |
| **Azure Database for PostgreSQL - Hyperscale (Citus)** | PostgreSQL | No |
| | Amazon RDS PostgreSQL | No | |

<sup>1</sup> Offline migrations through the Azure SQL Migration extension for Azure Data Studio are supported for Azure SQL Managed Instance, SQL Server on Azure Virtual Machines, and Azure SQL Database. For more information, see [Migrate databases by using the Azure SQL Migration extension for Azure Data Studio](migration-using-azure-data-studio.md).

<sup>2</sup> If your source database is already in an Azure platform as a service (PaaS) like Azure Database for MySQL or Azure Database for PostgreSQL, choose the corresponding engine when you create your migration activity. For example, if you're migrating from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server, choose MySQL as the source engine when you create your scenario. If you're migrating from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server, choose PostgreSQL as the source engine when you create your scenario.

### Online (continuous sync) migration support

The following table describes the current status of Database Migration Service support for *online* migrations:

| Target | Source | Support | Status |
| ------------- | ------------- |:-------------:|:-------------:|
| **Azure SQL Database** | SQL Server <sup>1</sup>| No | |
| | Amazon RDS SQL | No | |
| | Oracle | No | |
| **Azure SQL Database MI** | SQL Server <sup>1</sup>| Yes | GA |
| | Amazon RDS SQL | Yes | GA |
| | Oracle | No | |
| **Azure SQL VM** | SQL Server <sup>1</sup>| Yes | GA |
| | Amazon RDS SQL | Yes | GA|
| | Oracle | No | |
| **Azure Cosmos DB** | MongoDB | Yes | GA |
| **Azure Database for MySQL - Flexible Server** | Azure Database for MySQL - Single Server | Yes | GA |
| | MySQL | Yes  | GA |
| | Amazon RDS MySQL | Yes  | GA |
| **Azure Database for PostgreSQL - Single Server** | PostgreSQL | Yes | GA |
| | Azure Database for PostgreSQL - Single Server <sup>2</sup> | Yes | GA |
| | Amazon RDS PostgreSQL | Yes | GA |
| **Azure Database for PostgreSQL - Flexible Server** | PostgreSQL | Yes | GA |
| | Azure Database for PostgreSQL - Single Server <sup>2</sup> | Yes | GA |
| | Amazon RDS PostgreSQL | Yes | GA |
| **Azure Database for PostgreSQL - Hyperscale (Citus)** | PostgreSQL | Yes | GA |
| | Amazon RDS PostgreSQL | Yes | GA |

<sup>1</sup> Online migrations (minimal downtime) through the Azure SQL Migration extension for Azure Data Studio are supported for Azure SQL Managed Instance and SQL Server on Azure Virtual Machines targets. For more information, see [Migrate databases by using the Azure SQL Migration extension for Azure Data Studio](migration-using-azure-data-studio.md).

<sup>2</sup> If your source database is already in an Azure PaaS like Azure Database for MySQL or Azure Database for PostgreSQL, choose the corresponding engine when you create your migration activity. For example, if you're migrating from Azure Database for MySQL - Single Server to Azure Database for MySQL - Flexible Server, choose MySQL as the source engine when you create the scenario. If you're migrating from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server, choose PostgreSQL as the source engine when you create the scenario.

## Next steps

- Learn more about [Azure Database Migration Service](dms-overview.md) and region availability.
