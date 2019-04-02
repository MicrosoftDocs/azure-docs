---
title: Database migration scenario status | Microsoft Docs
description: Learn about the status of the migration scenarios supported by Azure Database Migration Service.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 04/03/2019
---

# Status of migration scenarios supported by Azure Database Migration Service
Azure Database Migration Service is designed to support different migration scenarios (source/target pairs) for both offline (one-time) and online (continuous sync) migrations. The scenario coverage provided by the Azure Database Migration Service is being extended over time. New scenarios are being added on a regular basis. This article identifies migration scenarios currently supported by Azure Database Migration Service and the status (Private Preview, Public Preview, or Generally Available) for each scenario.

## Offline versus online migrations
With Azure Database Migration Service, you can do an offline or an online migration. With *offline* migrations, application downtime begins at the same time that the migration starts. To limit downtime to the time required to cut over to the new environment when the migration completes, use an *online* migration. It's recommended to test an offline migration to determine whether the downtime is acceptable; if not, do an online migration.

## Migration scenario status
The status of migration scenarios supported by Azure Database Migration Service varies with time. Generally, scenarios are first released in **Private Preview**. Participating in Private Preview requires customers to submit a nomination via the [DMS Preview site](https://aka.ms/dms-preview). After Private Preview, the scenario status changes to **Public Preview**. Azure Database Migration Service users can try out migration scenarios in Public Preview directly from the user interface. No sign-up is required.  However, migration scenarios in Public Preview may not be available in all regions and may undergo additional changes before final release. After Public Preview, the scenario status changes to **Generally Available**. Generally Available (GA) is the final release status, and the functionality is complete and accessible to all users. 

## Migration scenario support
The following tables show which migration scenarios are supported when using Azure Database Migration Service.

> [!NOTE]
> If a scenario listed as supported below does not appear within the user interface, please contact the [Data Migration Team](mailto:datamigrationteam@microsoft.com) for additional information.

> [!IMPORTANT]
> To view scenarios currently supported by Azure Database Migration Service in Private Preview, see the [DMS Preview site](https://aka.ms/dms-preview).

### Offline (one-time) migration support
The following table shows Azure Database Migration Service support, for offline migrations.

| Target  | Source | Support | Status |
| ------------- | ------------- | :-------------: | :-------------: |
| **Azure SQL DB** | SQL Server | ✔ | GA |
|   | RDS SQL |  |  |
|   | Oracle |  |  |
| **Azure SQL DB MI** | SQL Server | ✔ | GA |
|   | RDS SQL |  |  |
|   | Oracle |  |   |
| **Azure SQL VM** | SQL Server | ✔ | GA  |
|   | Oracle |   |   |
| **Azure Cosmos DB** | MongoDB | ✔ | Public Preview |
| **Azure DB for MySQL** | MySQL |   |   |
|   | RDS MySQL |   |   |
| **Azure DB for PostgreSQL** | PostgreSQL |  |
|  | RDS PostgreSQL |   |   |

### Online (continuous sync) migration support
The following table shows Azure Database Migration Service support, either Public Preview or Generally Available, for online migrations.

| Target  | Source | Support | Status |
| ------------- | ------------- | :-------------: | :-------------: |
| **Azure SQL DB** | SQL Server | ✔ | GA |
|   | RDS SQL | ✔ | GA   |
|   | Oracle |  |  |
| **Azure SQL DB MI** | SQL Server | ✔ | GA |
|   | RDS SQL | ✔ | GA |
|   | Oracle | ✔ | Private Preview |
| **Azure SQL VM** | SQL Server |   |   |
|   | Oracle  |  |  |
| **Azure Cosmos DB** | MongoDB | ✔ | Public Preview |
| **Azure DB for MySQL** | MySQL | ✔ | GA |
|   | RDS MySQL | ✔ | GA |
| **Azure DB for PostgreSQL** | PostgreSQL | ✔ | GA |
|   | RDS PostgreSQL | ✔ | GA |
|   | Oracle | ✔ | Private Preview |

## Next steps
For an overview of Azure Database Migration Service and regional availability, see the article [What is the Azure Database Migration Service](dms-overview.md).
