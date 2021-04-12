---
title: Database migration scenario status
titleSuffix: Azure Database Migration Service
description: Learn about the status of the migration scenarios supported by Azure Database Migration Service.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: troubleshooting
ms.date: 07/08/2020
---

# Status of migration scenarios supported by Azure Database Migration Service

Azure Database Migration Service is designed to support different migration scenarios (source/target pairs) for both offline (one-time) and online (continuous sync) migrations. The scenario coverage provided by Azure Database Migration Service is being extended over time. New scenarios are being added on a regular basis. This article identifies migration scenarios currently supported by Azure Database Migration Service and the status (private preview, public preview, or general availability) for each scenario.

## Offline versus online migrations

With Azure Database Migration Service, you can do an offline or an online migration. With *offline* migrations, application downtime begins at the same time that the migration starts. To limit downtime to the time required to cut over to the new environment when the migration completes, use an *online* migration. It's recommended to test an offline migration to determine whether the downtime is acceptable; if not, do an online migration.

## Migration scenario support

The following tables show which migration scenarios are supported when using Azure Database Migration Service.

> [!NOTE]
> If a scenario listed as supported below does not appear within the user interface, please contact the [Ask Azure Database Migrations](mailto:AskAzureDatabaseMigrations@service.microsoft.com) alias for additional information.

> [!IMPORTANT]
> To view all scenarios currently supported by Azure Database Migration Service in Private Preview, see the [DMS Preview site](https://aka.ms/dms-preview).

### Offline (one-time) migration support

The following table shows Azure Database Migration Service support for offline migrations.

| Target  | Source | Support | Status |
| ------------- | ------------- |:-------------:|:-------------:|
| **Azure SQL DB** | SQL Server | ✔ | GA |
|   | RDS SQL | X |  |
|   | Oracle | X |  |
| **Azure SQL DB MI** | SQL Server | ✔ | GA |
|   | RDS SQL | X |  |
|   | Oracle | X |   |
| **Azure SQL VM** | SQL Server | ✔ | GA |
|   | Oracle | X |   |
| **Azure Cosmos DB** | MongoDB | ✔ | GA |
| **Azure DB for MySQL** | MySQL | X |   |
|   | RDS MySQL | X |   |
| **Azure DB for PostgreSQL - Single server** | PostgreSQL | X |
|  | RDS PostgreSQL | X |   |
| **Azure DB for PostgreSQL - Hyperscale (Citus)** | PostgreSQL | X |
|  | RDS PostgreSQL | X |   |

### Online (continuous sync) migration support

The following table shows Azure Database Migration Service support for online migrations.

| Target  | Source | Support | Status |
| ------------- | ------------- |:-------------:|:-------------:|
| **Azure SQL DB** | SQL Server | X |  |
|   | RDS SQL | X |  |
|   | Oracle | X |  |
| **Azure SQL DB MI** | SQL Server | ✔ | GA |
|   | RDS SQL | X |  |
|   | Oracle | X |  |
| **Azure SQL VM** | SQL Server | X |   |
|   | Oracle  | X |  |
| **Azure Cosmos DB** | MongoDB | ✔ | GA |
| **Azure DB for MySQL** | MySQL | ✔ | GA |
|   | RDS MySQL | ✔ | GA |
| **Azure DB for PostgreSQL - Single server** | PostgreSQL | ✔ | GA |
|   | Azure DB for PostgreSQL - Single server | ✔ | GA |
|   | RDS PostgreSQL | ✔ | GA |
|   | Oracle | ✔ | Public preview (to be deprecated after May 1, 2021) |
| **Azure DB for PostgreSQL - Hyperscale (Citus)** | PostgreSQL | ✔ | GA |
|   | RDS PostgreSQL | ✔ | GA |

> [!IMPORTANT]
> "Oracle to Azure Database for PostgreSQL" migration scenario (currently in preview) will no longer be available after May 1, 2021. We will continue to provide support via alternative tooling (such as Ora2pg) and provide the best migration experience for Oracle to PostgreSQL migrations. For migration best practices, see [Oracle to Azure Database for PostgreSQL migration guide](https://aka.ms/OracletoPGguide).


## Next steps

For an overview of Azure Database Migration Service and regional availability, see the article [What is the Azure Database Migration Service](dms-overview.md).
