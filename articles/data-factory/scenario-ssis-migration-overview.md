---
title: Migrate on-premises SSIS workloads to SSIS in Azure Data Factory
description: Migrate on-premises SSIS workloads to SSIS in ADF.
services: data-factory
documentationcenter: ""
author: chugugrace
ms.author: chugu
ms.reviewer: ""
manager: ""
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 9/3/2019
---

# Migrate on-premises SSIS workloads to SSIS in ADF

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

## Overview

When you migrate your database workloads from SQL Server on premises to Azure database services, namely Azure SQL Database or Azure SQL Managed Instance, your ETL workloads on SQL Server Integration Services (SSIS) as one of the primary value-added services will need to be migrated as well.

Azure-SSIS Integration Runtime (IR) in Azure Data Factory (ADF) supports running SSIS packages. Once Azure-SSIS IR is provisioned, you can then use familiar tools, such as SQL Server Data Tools (SSDT)/SQL Server Management Studio (SSMS), and command-line utilities, such as dtinstall/dtutil/dtexec, to deploy and run your packages in Azure. For more info, see [Azure SSIS lift-and-shift overview](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview).

This article highlights migration process of your ETL workloads from on-premises SSIS to SSIS in ADF. The migration process consists of two phases: **Assessment** and **Migration**.

## Assessment

To establish a complete migration plan, a thorough assessment will help identify issues with the source SSIS packages that would prevent a successful migration.

Data Migration Assistant (DMA) is a freely downloadable tool for this purpose that can be installed and executed locally. DMA assessment project of type **Integration Services** can be created to assess SSIS packages in batches and identify compatibility issues that are presented in the following categories:

- Migration blockers: These are compatibility issues that block the migration source packages to run on Azure-SSIS IR. DMA provides guidance to help you address these issues.

- Informative issues: These are partially supported or deprecated features that are used in source packages. DMA provides a comprehensive set of recommendations, alternative approaches available in Azure, and mitigating steps to resolve.

### Four storage types for SSIS packages

- SSIS catalog (SSISDB). This was introduced with SQL Server 2012 and contains a set of stored procedures, views, and table-valued functions used for working with SSIS projects/packages.
- File System.
- SQL Server system database (MSDB).
- SSIS Package Store. This is a package management layer on top of two subtypes:
  - MSDB, which is a system database in SQL Server used to store SSIS packages.
  - Managed file system, which is a specific folder in SQL Server installation path used to store SSIS packages.

DMA currently supports the batch-assessment of packages stored in **File System**, **Package Store**, and **SSIS catalog** since **DMA version v5.0**.

Get [DMA](https://docs.microsoft.com/sql/dma/dma-overview), and [perform your package assessment with it](https://docs.microsoft.com/sql/dma/dma-assess-ssis).

## Migration

Depending on the [storage types](#four-storage-types-for-ssis-packages) of source SSIS packages and the migration destination of database workloads, the steps to migrate  **SSIS packages** and **SQL Server Agent jobs** that schedule SSIS package executions may vary. There are two scenarios:

- [**Azure SQL Managed Instance** as database workload destination](#azure-sql-managed-instance-as-database-workload-destination)
- [**Azure SQL Database** as database workload destination](#azure-sql-database-as-database-workload-destination)

### **Azure SQL Managed Instance** as database workload destination

| **Package storage type** |How to batch-migrate SSIS packages|How to batch-migrate SSIS jobs|
|-|-|-|
|SSISDB|[Migrate **SSISDB**](scenario-ssis-migration-ssisdb-mi.md)|[Migrate SSIS jobs to Azure SQL Managed Instance agent](scenario-ssis-migration-ssisdb-mi.md#ssis-jobs-to-sql-managed-instance-agent)|
|File System|Redeploy them to file shares/Azure Files via dtinstall/dtutil/manual copy, or to keep in file systems to access via VNet/Self-Hosted IR. For more info, see [dtutil utility](https://docs.microsoft.com/sql/integration-services/dtutil-utility).|<li> Migrate with [SSIS Job Migration Wizard in SSMS](how-to-migrate-ssis-job-ssms.md) <li>Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|
|SQL Server (MSDB)|Export them to file systems/file shares/Azure Files via SSMS/dtutil. For more info, see [Exporting SSIS packages](https://docs.microsoft.com/sql/integration-services/import-and-export-packages-ssis-service).|Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|
|Package Store|Export them to file systems/file shares/Azure Files via SSMS/dtutil or redeploy them to file shares/Azure Files via dtinstall/dtutil/manual copy or keep them in file systems to access via VNet/Self-Hosted IR. For more info, see dtutil utility. For more info, see [dtutil utility](https://docs.microsoft.com/sql/integration-services/dtutil-utility).|Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|

### **Azure SQL Database** as database workload destination

| **Package storage type** |How to batch-migrate SSIS packages|How to batch-migrate jobs|
|-|-|-|
|SSISDB|Redeploy to Azure-SSISDB via SSDT/SSMS. For more info, see [Deploying SSIS packages in Azure](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial).|Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|
|File System|Redeploy them to file shares/Azure Files via dtinstall/dtutil/manual copy, or to keep in file systems to access via VNet/Self-Hosted IR. For more info, see [dtutil utility](https://docs.microsoft.com/sql/integration-services/dtutil-utility).|<li> Migrate with [SSIS Job Migration Wizard in SSMS](how-to-migrate-ssis-job-ssms.md) <li> Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|
|SQL Server (MSDB)|Export them to file systems/file shares/Azure Files via SSMS/dtutil. For more info, see [Exporting SSIS packages](https://docs.microsoft.com/sql/integration-services/import-and-export-packages-ssis-service).|Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|
|Package Store|Export them to file systems/file shares/Azure Files via SSMS/dtutil or redeploy them to file shares/Azure Files via dtinstall/dtutil/manual copy or keep them in file systems to access via VNet/Self-Hosted IR. For more info, see dtutil utility. For more info, see [dtutil utility](https://docs.microsoft.com/sql/integration-services/dtutil-utility).|Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|

## Additional resources

- [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction)
- [Database Migration Assistant](https://docs.microsoft.com/sql/dma/dma-overview)
- [Lift and shift SSIS workloads to the cloud](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview?view=sql-server-2017)
- [Migrate SSIS packages to Azure SQL Managed Instance](https://docs.microsoft.com/azure/dms/how-to-migrate-ssis-packages-managed-instance)
- [Redeploy packages to Azure SQL Database](https://docs.microsoft.com/azure/dms/how-to-migrate-ssis-packages)

## Next steps

- [Validate SSIS packages deployed to Azure](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-validate-packages)
- [Run SSIS packages deployed in Azure](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-run-packages)
- [Monitor Azure-SSIS Integration Runtime](https://docs.microsoft.com/azure/data-factory/monitor-integration-runtime#azure-ssis-integration-runtime)
- [Schedule SSIS package executions in Azure](https://docs.microsoft.com/sql/integration-services/lift-shift/ssis-azure-schedule-packages)
