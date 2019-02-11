---
title: Database migration scenario status | Microsoft Docs
description: Learn about the status of the migration scenarios supported by the Azure Database Migration Service.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: craigg
ms.reviewer: douglasl
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 02/11/2019
---

# Status of migration scenarios supported by the Azure Database Migration Service
The Azure Database Migration Service is designed to support a variety of migration scenarios (source/target pairs) for both offline (one-time) and online (continuous sync) migrations. The scenario coverage provided by the Azure Database Migration Service is being extended over time. New scenarios are being added on a regular basis. This article identifies the migration scenarios currently supported by the Azure Database Migration Service and the status (Private [or Limited] Preview, Public Preview, or Generally Available) or each scenario.

## Offline versus online migrations
When you migrate databases to Azure by using the Azure Database Migration Service, you can perform an offline or an online migration. With *offline* migrations, application downtime begins at the same time that the migration starts. For *online* migrations, downtime is limited to the time required to cut over to the new environment when the migration completes. It's recommended to test an offline migration to determine whether the downtime is acceptable; if not, perform an online migration.

## Migration scenario status
The status of each migration scenario supported by the Azure Database Migration Service varies with time. Generally, scenarios are first released in **Private Preview**, and taking advantage of the functionality requires a customer to submit a nomination via the [DMS Preview site](https://aka.ms/dms-preview). When Private Preview is completed, the scenario status changes to **Public Preview**. All Azure Database Migration Service users can take advantage of migration scenarios available in Public Preview. However, the migration scenario may not be available in all regions and the functionality may undergo additional changes before final release. When a migration scenario becomes **Generally Available**, the final released status, the functionality is complete and accessible to all Azure Database Migration Service users. 

## Migration scenario support

The following tables show which migration scenarios are supported when using the Azure Database Migration Service.

> [!NOTE]
> If a scenario listed as supported below does not appear within the user interface, please contact the [Data Migration Team](mailto:datamigrationteam@microsoft.com) for additional information.

### Offline (one-time) migration support
The following table shows Azure Database Migration Service support for offline migrations.

| Target  | Source | Support |
| ------------- | ------------- | :-------------: |
| **Azure SQL DB**  | SQL Server | ✔ |
|   | RDS SQL  |  ✔ |
|   | Oracle  |   |
| **Azure SQL DB MI**  | SQL Server  | ✔ |
|   | RDS SQL  | ✔ |
|   | Oracle  | ✔  |
| **Azure SQL VM**  | SQL Server | ✔ |
|   | Oracle  |   |
| **Azure Cosmos DB**  | MongoDB | ✔ |
| **Azure DB for MySQL**  | MySQL |  |
|   | RDS MySQL  |  |
| **Azure DB for PostgreSQL**  | PostgreSQL |  |
|  | RDS PostgreSQL  |  |

### Online (continuous sync) migration support
The following table shows Azure Database Migration Service support for online migrations.

| Target  | Source | Support |
| ------------- | ------------- | :-------------: |
| **Azure SQL DB**  | SQL Server | ✔ |
|   | RDS SQL  |   |
|   | Oracle  |  ✔ |
| **Azure SQL DB MI**  | SQL Server  | ✔ |
|   | RDS SQL  |  |
|   | Oracle  | ✔  |
| **Azure SQL VM**  | SQL Server  |   |
|   | Oracle  | ✔  |
| **Azure Cosmos DB**  | MongoDB  | ✔ |
| **Azure DB for MySQL**  | MySQL | ✔ |
|   | RDS MySQL  | ✔ |
| **Azure DB for PostgreSQL**  | PostgreSQL | ✔ |
|  | RDS PostgreSQL  | ✔ |

## Next steps
For an overview of the Azure Database Migration Service and regional availability, see the article [What is the Azure Database Migration Service](dms-overview.md). 
