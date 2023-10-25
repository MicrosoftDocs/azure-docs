---
title: Migrate on-premises SQL Server Integration Services (SSIS) workloads to SSIS in Azure Data Factory (ADF)
description: Migrate on-premises SSIS workloads to SSIS in ADF.
author: chugugrace
ms.author: chugu
ms.service: data-factory
ms.subservice: integration-services
ms.topic: conceptual
ms.date: 07/20/2023
---

# Migrate on-premises SSIS workloads to SSIS in ADF or Synapse Pipelines

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

## Overview

When you migrate your database workloads from SQL Server on premises to Azure database services, namely Azure SQL Database or Azure SQL Managed Instance, your ETL workloads on SQL Server Integration Services (SSIS) as one of the primary value-added services will need to be migrated as well.

Azure-SSIS Integration Runtime (IR) in Azure Data Factory (ADF) or Synapse Pipelines supports running SSIS packages. Once Azure-SSIS IR is provisioned, you can then use familiar tools, such as SQL Server Data Tools (SSDT)/SQL Server Management Studio (SSMS), and command-line utilities, such as dtinstall/dtutil/dtexec, to deploy and run your packages in Azure. For more info, see [Azure SSIS lift-and-shift overview](/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview).

This article highlights migration process of your ETL workloads from on-premises SSIS to SSIS in ADF. The migration process consists of two phases: **Assessment** and **Migration**.

## Assessment

To establish a complete migration plan, a thorough assessment will help identify issues with the source SSIS packages that would prevent a successful migration.

Data Migration Assistant (DMA) is a freely downloadable tool for this purpose that can be installed and executed locally. DMA assessment project of type **Integration Services** can be created to assess SSIS packages in batches and identify compatibility issues that are presented in the following categories:

- Migration blockers: compatibility issues that block the migration source packages to run on Azure-SSIS IR. DMA provides guidance to help you address these issues.

- Informative issues: partially supported or deprecated features that are used in source packages. DMA provides a comprehensive set of recommendations, alternative approaches available in Azure, and mitigating steps to resolve.

You get detail list of migration blockers and informative issues here.  

### Four storage types for SSIS packages

- SSIS catalog (SSISDB). Introduced with SQL Server 2012 and contains a set of stored procedures, views, and table-valued functions used for working with SSIS projects/packages.
- File System.
- SQL Server system database (MSDB).
- SSIS Package Store. A package management layer on top of two subtypes:
  - MSDB, which is a system database in SQL Server used to store SSIS packages.
  - Managed file system, which is a specific folder in SQL Server installation path used to store SSIS packages.

DMA currently supports the batch-assessment of packages stored in **File System**, **Package Store**, and **SSIS catalog** since **DMA version v5.0**.

Get [DMA](/sql/dma/dma-overview), and [perform your package assessment with it](/sql/dma/dma-assess-ssis). 

## Migration

Depending on the [storage types](#four-storage-types-for-ssis-packages) of source SSIS packages, the steps to migrate  **SSIS packages** and **SQL Server Agent jobs** that schedule SSIS package executions may vary.

It is also a practical way to use [SSIS DevOps Tools](/sql/integration-services/devops/ssis-devops-overview), to do batch package redeployment to the migration destination.  

| **Package storage type** |How to migrate SSIS packages|How to migrate SSIS jobs|
|-|-|-|
|SSISDB|Redeploy packages via SSDT/SSMS to SSISDB hosted in Azure Managed Instance. For more info, see [Deploying SSIS packages in Azure](/sql/integration-services/lift-shift/ssis-azure-deploy-run-monitor-tutorial). |<li> Migrate from SQL Server Agent on premises to SQL Managed Instance agent via scripts/manual copy. For more info, see [run SSIS packages via Azure SQL Managed Instance Agent](how-to-invoke-ssis-package-managed-instance-agent.md) <li>Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|
|File System|Redeploy them to file shares/Azure Files via dtinstall/dtutil/manual copy, or to keep in file systems to access via VNet/Self-Hosted IR. For more info, see [dtutil utility](/sql/integration-services/dtutil-utility).|<li>Migrate from SQL Server Agent on premises to SQL Managed Instance agent via scripts/manual copy. For more info, see [run SSIS packages via Azure SQL Managed Instance Agent](how-to-invoke-ssis-package-managed-instance-agent.md) <li> Migrate with [SSIS Job Migration Wizard in SSMS](how-to-migrate-ssis-job-ssms.md) <li>Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|
|SQL Server (MSDB)|Export them to file systems/file shares/Azure Files via SSMS/dtutil. For more info, see [Exporting SSIS packages](/sql/integration-services/service/package-management-ssis-service#import-and-export-packages).|Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|
|Package Store|Export them to package store via SSMS/dtutil or redeploy them to package store via dtinstall/dtutil/manual copy. For more info, see [Manage packages with Azure-SSIS Integration Runtime package store](azure-ssis-integration-runtime-package-store.md).|<li>Migrate from SQL Server Agent on premises to SQL Managed Instance agent via scripts/manual copy. For more info, see [run SSIS packages via Azure SQL Managed Instance Agent](how-to-invoke-ssis-package-managed-instance-agent.md) <li> Convert them into ADF pipelines/activities/triggers via scripts/SSMS/ADF portal. For more info, see [SSMS scheduling feature](/sql/integration-services/lift-shift/ssis-azure-schedule-packages-ssms).|

## Additional resources

- [Azure Data Factory](./introduction.md)
- [Database Migration Assistant](/sql/dma/dma-overview)
- [Lift and shift SSIS workloads to the cloud](/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview)
- [SSIS DevOps Tools](/sql/integration-services/devops/ssis-devops-overview)
- [Redeploy packages to Azure SQL Database](../dms/how-to-migrate-ssis-packages.md)

- [On-premises data access from Azure-SSIS Integration Runtime](https://techcommunity.microsoft.com/t5/sql-server-integration-services/vnet-or-no-vnet-secure-data-access-from-ssis-in-azure-data/ba-p/1062056)
- [Customize the setup for an Azure-SSIS Integration Runtime](how-to-configure-azure-ssis-ir-custom-setup.md)
- [Access data stores and file shares with Windows authentication from SSIS packages in Azure](ssis-azure-connect-with-windows-auth.md)
- [Use Managed identity authentication](/sql/integration-services/connection-manager/azure-storage-connection-manager#managed-identities-for-azure-resources-authentication)
- [Use Azure Key Vault](store-credentials-in-key-vault.md)
- [Configure the Azure-SSIS Integration Runtime for high performance](configure-azure-ssis-integration-runtime-performance.md)
- [How to start and stop Azure-SSIS Integration Runtime on a schedule](how-to-schedule-azure-ssis-integration-runtime.md)

## Next steps

- [Validate SSIS packages deployed to Azure](/sql/integration-services/lift-shift/ssis-azure-validate-packages)
- [Run SSIS packages deployed in Azure](/sql/integration-services/lift-shift/ssis-azure-run-packages)
- [Monitor Azure-SSIS Integration Runtime](./monitor-integration-runtime.md#azure-ssis-integration-runtime)
- [Schedule SSIS package executions in Azure](/sql/integration-services/lift-shift/ssis-azure-schedule-packages)