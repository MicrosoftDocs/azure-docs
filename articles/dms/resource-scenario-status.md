---
title: Database migration scenario status
titleSuffix: Azure Database Migration Service
description: Learn about the status of the migration scenarios supported by Azure Database Migration Service.
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

# Status of migration scenarios supported by Azure Database Migration Service

Azure Database Migration Service is designed to support different migration scenarios (source/target pairs) for both offline (one-time) and online (continuous sync) migrations. The scenario coverage provided by Azure Database Migration Service is being extended over time. New scenarios are being added regularly. This article identifies migration scenarios currently supported by Azure Database Migration Service and the status (private preview, public preview, or general availability) for each scenario.

## Offline versus online migrations

With Azure Database Migration Service, you can do an offline or an online migration. With *offline* migrations, application downtime begins at the same time that the migration starts. To limit downtime to the time required to cut over to the new environment when the migration completes, use an *online* migration. It's recommended to test an offline migration to determine whether the downtime is acceptable; if not, do an online migration.

## Migration scenario status

The status of migration scenarios supported by Azure Database Migration Service varies with time. Generally, scenarios are first released in **private preview**. After private preview, the scenario status changes to **public preview**. Azure Database Migration Service users can try out migration scenarios in public preview directly from the user interface. No sign-up is required. However, migration scenarios in public preview may not be available in all regions and may undergo more changes before final release. After public preview, the scenario status changes to **generally availability**. General availability (GA) is the final release status, and the functionality is complete and accessible to all users.

## Migration scenario support

The following tables show which migration scenarios are supported when using Azure Database Migration Service.

> [!NOTE]  
> If a scenario listed as supported below does not appear within the user interface, please contact the [Ask Azure Database Migrations](mailto:AskAzureDatabaseMigrations@service.microsoft.com) alias for additional information.

### Offline (one-time) migration support

The following table shows Azure Database Migration Service support for **offline** migrations.

| Target | Source | Support | Status |
| ------------- | ------------- |:-------------:|:-------------:|
| **Azure SQL DB** | SQL Server <sup>1</sup> | ✔ | PP |
| | Amazon RDS SQL Server | ✔ | PP |
| | Oracle | X | |
| **Azure SQL DB MI** | SQL Server <sup>1</sup> | ✔ | GA |
| | Amazon RDS SQL Server | X | |
| | Oracle | X | |
| **Azure SQL VM** | SQL Server <sup>1</sup> | ✔ | GA |
| | Amazon RDS SQL Server | X | |
| | Oracle | X | |
| **Azure Cosmos DB** | MongoDB | ✔ | GA |
| **Azure DB for MySQL - Single Server** | MySQL | ✔ | GA |
| | Amazon RDS MySQL | ✔ | GA |
| | Azure DB for MySQL <sup>2</sup> | ✔ | GA |
| **Azure DB for MySQL - Flexible Server** | MySQL | ✔ | GA |
| | Amazon RDS MySQL | ✔ | GA |
| | Azure DB for MySQL <sup>2</sup> | ✔ | GA |
| **Azure DB for PostgreSQL - Single server** | PostgreSQL | X |
| | Amazon RDS PostgreSQL | X | |
| **Azure DB for PostgreSQL - Flexible server** | PostgreSQL | X |
| | Amazon RDS PostgreSQL | X | |
| **Azure DB for PostgreSQL - Hyperscale (Citus)** | PostgreSQL | X |
| | Amazon RDS PostgreSQL | X | |


1. Offline migrations using the Azure SQL Migration extension for Azure Data Studio are supported for the following Azure SQL targets: **Azure SQL Managed Instance**, **SQL Server on Azure Virtual Machines** and, **Azure SQL Database (Preview)**. For more information, see [Migrate databases with Azure SQL migration extension for Azure Data Studio](migration-using-azure-data-studio.md).

2. If your source database is already in Azure PaaS (for example, Azure DB for MySQL or Azure DB for PostgreSQL), choose the corresponding engine when creating your migration activity. For example, if you're migrating from Azure DB for MySQL - Single Server to Azure DB for MySQL - Flexible Server, choose MySQL as the source engine during scenario creation. If you're migrating from Azure DB for PostgreSQL - Single Server to Azure DB for PostgreSQL - Flexible Server, choose PostgreSQL as the source engine during scenario creation.

### Online (continuous sync) migration support

The following table shows Azure Database Migration Service support for **online** migrations.

| Target | Source | Support | Status |
| ------------- | ------------- |:-------------:|:-------------:|
| **Azure SQL DB** | SQL Server <sup>1</sup>| X | |
| | Amazon RDS SQL | X | |
| | Oracle | X | |
| **Azure SQL DB MI** | SQL Server <sup>1</sup>| ✔ | GA |
| | Amazon RDS SQL | X | |
| | Oracle | X | |
| **Azure SQL VM** | SQL Server <sup>1</sup>| ✔ | GA |
| | Amazon RDS SQL | X | |
| | Oracle | X | |
| **Azure Cosmos DB** | MongoDB | ✔ | GA |
| **Azure DB for MySQL - Flexible Server** | Azure DB for MySQL - Single Server | ✔ | Preview |
| | MySQL | ✔  | Preview |
| | Amazon RDS MySQL | ✔  | Preview |
| **Azure DB for PostgreSQL - Single server** | PostgreSQL | ✔ | GA |
| | Azure DB for PostgreSQL - Single server <sup>2</sup> | ✔ | GA |
| | Amazon DS PostgreSQL | ✔ | GA |
| **Azure DB for PostgreSQL - Flexible server** | PostgreSQL | ✔ | GA |
| | Azure DB for PostgreSQL - Single server <sup>2</sup> | ✔ | GA |
| | Amazon RDS PostgreSQL | ✔ | GA |
| **Azure DB for PostgreSQL - Hyperscale (Citus)** | PostgreSQL | ✔ | GA |
| | Amazon RDS PostgreSQL | ✔ | GA |

1. Online migrations (minimal downtime) using the Azure SQL Migration extension for Azure Data Studio are supported for the following Azure SQL targets: **Azure SQL Managed Instance** and **SQL Server on Azure Virtual Machines**. For more information, see [Migrate databases with Azure SQL migration extension for Azure Data Studio](migration-using-azure-data-studio.md).

2. If your source database is already in Azure PaaS (for example, Azure DB for MySQL or Azure DB for PostgreSQL), choose the corresponding engine when creating your migration activity. For example, if you're migrating from Azure DB for MySQL - Single Server to Azure DB for MySQL - Flexible Server, choose MySQL as the source engine during scenario creation. If you're migrating from Azure DB for PostgreSQL - Single Server to Azure DB for PostgreSQL - Flexible Server, choose PostgreSQL as the source engine during scenario creation.

## Next steps

For an overview of Azure Database Migration Service and regional availability, see the article [What is the Azure Database Migration Service](dms-overview.md).