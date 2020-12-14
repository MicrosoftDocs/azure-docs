---
title: SSIS migration with Azure SQL Managed Instance as the database workload destination 
description: SSIS migration with Azure SQL Managed Instance as the database workload destination.
services: data-factory
documentationcenter: ''
author: chugugrace
ms.author: chugu
ms.reviewer: 
manager: 
ms.service: data-factory
ms.workload: data-services

ms.topic: conceptual
ms.date: 9/12/2019
---
# SSIS migration with Azure SQL Managed Instance as the database workload destination

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

When migrating database workloads from a SQL Server instance to Azure SQL Managed Instance, you should be familiar with [Azure Data Migration Service](../dms/dms-overview.md)(DMS), and the [network topologies for SQL Managed Instance migrations using DMS](../dms/resource-network-topologies.md).

This article focuses on the migration of SQL Server Integration Service (SSIS) packages stored in SSIS catalog (SSISDB) and SQL Server Agent jobs that schedule SSIS package executions.

## Migrate SSIS catalog (SSISDB)

SSISDB migration can be done using DMS, as described in the article:
[Migrate SSIS packages to SQL Managed Instance](../dms/how-to-migrate-ssis-packages-managed-instance.md).

## SSIS jobs to SQL Managed Instance agent

SQL Managed Instance has a native, first-class scheduler just like SQL Server Agent on premises.  You can [run SSIS packages via Azure SQL Managed Instance Agent](how-to-invoke-ssis-package-managed-instance-agent.md).

Since a migration tool for SSIS jobs is not yet available, they have to be migrated from SQL Server Agent on premises to SQL Managed Instance agent via scripts/manual copy.

## Additional resources

- [Azure Data Factory](./introduction.md)
- [Azure-SSIS Integration Runtime](./create-azure-ssis-integration-runtime.md)
- [Azure Database Migration Service](../dms/dms-overview.md)
- [Network topologies for SQL Managed Instance migrations using DMS](../dms/resource-network-topologies.md)
- [Migrate SSIS packages to an SQL Managed Instance](../dms/how-to-migrate-ssis-packages-managed-instance.md)

## Next steps

- [Connect to SSISDB in Azure](/sql/integration-services/lift-shift/ssis-azure-connect-to-catalog-database)
- [Run SSIS packages deployed in Azure](/sql/integration-services/lift-shift/ssis-azure-run-packages)