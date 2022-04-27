---
title: "SQL Server to SQL Server on Azure Virtual Machines: Migration guide"
titleSuffix: SQL Server on Azure VMs
description: In this guide, you learn how to migrate your individual SQL Server databases to SQL Server on Azure Virtual Machines.  
ms.custom: ""
ms.service: virtual-machines-sql
ms.subservice: migration-guide
ms.devlang: 
ms.topic: how-to
author: markjones-msft
ms.author: markjon
ms.reviewer: chadam, mathoma, randolphwest
ms.date: 04/11/2022
---

# Migration guide: SQL Server to SQL Server on Azure Virtual Machines

[!INCLUDE[appliesto--sqlmi](../../includes/appliesto-sqlvm.md)]

In this guide, you learn how to *discover*, *assess*, and *migrate* your user databases from SQL Server to an instance of SQL Server on Azure Virtual Machines by tools and techniques based on your requirements.

You can migrate SQL Server running on-premises or on:

- SQL Server on virtual machines (VMs).
- Amazon Web Services (AWS) EC2.
- Amazon Relational Database Service (AWS RDS).
- Compute Engine (Google Cloud Platform [GCP]).

For information about extra migration strategies, see the [SQL Server VM migration overview](sql-server-to-sql-on-azure-vm-migration-overview.md). For other migration guides, see [Azure Database Migration Guides](/data-migration).

:::image type="content" source="media/sql-server-to-sql-on-azure-vm-migration-overview/migration-process-flow-small.png" alt-text="Diagram that shows a migration process flow.":::

## Prerequisites

Migrating to SQL Server on Azure Virtual Machines requires the following resources:

- [Azure SQL migration extension for Azure Data Studio](/sql/azure-data-studio/extensions/azure-sql-migration-extension).
- An [Azure Migrate project](../../../migrate/create-manage-projects.md) (only required for SQL Server discovery in your data estate).
- A prepared target [SQL Server on Azure Virtual Machines](../../virtual-machines/windows/create-sql-vm-portal.md) instance that's the same or greater version than the SQL Server source.
- [Connectivity between Azure and on-premises](/azure/architecture/reference-architectures/hybrid-networking).
- [Choosing an appropriate migration strategy](sql-server-to-sql-on-azure-vm-migration-overview.md#migrate).

## Pre-migration

Before you begin your migration, you need to discover the topology of your SQL environment and assess the feasibility of your intended migration.

### Discover

Azure Migrate assesses migration suitability of on-premises computers, performs performance-based sizing, and provides cost estimations for running on-premises. To plan for the migration, use Azure Migrate to [identify existing data sources and details about the features](../../../migrate/concepts-assessment-calculation.md) your SQL Server instances use. This process involves scanning the network to identify all of your SQL Server instances in your organization with the version and features in use.

> [!IMPORTANT]
> When you choose a target Azure virtual machine for your SQL Server instance, be sure to consider the [Performance guidelines for SQL Server on Azure Virtual Machines](../../virtual-machines/windows/performance-guidelines-best-practices-checklist.md).

For more discovery tools, see the [services and tools](../../../dms/dms-tools-matrix.md#business-justification-phase) available for data migration scenarios.

### Assess

When migrating from SQL Server on-premises to SQL Server on Azure Virtual Machines, it is unlikely that you'll have any compatibility or feature parity issues if the source and target SQL Server versions are the same. If you're *not* upgrading the version of SQL Server, skip this step and move to the [Migrate](#migrate) section.

Before migration, it's still a good practice to run an assessment of your SQL Server databases to identify migration blockers (if any) and the [Azure SQL migration extension for Azure Data Studio](../../../dms/migration-using-azure-data-studio.md) does that before migration.

[!INCLUDE [assess-estate-with-azure-migrate](../../../../includes/azure-migrate-to-assess-sql-data-estate.md)]

#### Assess user databases

The [Azure SQL migration extension for Azure Data Studio](../../../dms/migration-using-azure-data-studio.md) provides a seamless wizard based experience to assess, get Azure recommendations and migrate your SQL Server databases on-premises to SQL Server on Azure Virtual Machines. Besides, highlighting any migration blockers or warnings, the extension also includes an option for Azure recommendations to collect your databases' performance data to recommend a right-sized SQL Server on Azure Virtual Machines to meet the performance needs of your workload (with the least price).

To learn more about Azure recommendations, see [Get right-sized Azure recommendation for your on-premises SQL Server database(s)](../../../dms/ads-sku-recommend.md).

> [!IMPORTANT]
>To assess databases using the Azure SQL migration extension, ensure that the logins used to connect the source SQL Server are members of the sysadmin server role or have CONTROL SERVER permission.

For a version upgrade, use [Data Migration Assistant](/sql/dma/dma-overview) to assess on-premises SQL Server instances if you are upgrading to an instance of SQL Server on Azure Virtual Machines with a higher version to understand the gaps between the source and target versions.

#### Assess the applications

Typically, an application layer accesses user databases to persist and modify data. Data Migration Assistant can assess the data access layer of an application in two ways:

- By using captured [extended events](/sql/relational-databases/extended-events/extended-events) or [SQL Server Profiler traces](/sql/tools/sql-server-profiler/create-a-trace-sql-server-profiler) of your user databases. You can also use the [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-capture-trace) to create a trace log that can also be used for A/B testing.
- By using the [Data Access Migration Toolkit (preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit), which provides discovery and assessment of SQL queries within the code and is used to migrate application source code from one database platform to another. This tool supports popular file types like C#, Java, XML, and plain text. For a guide on how to perform a Data Access Migration Toolkit assessment, see the [Use Data Migration Assistant](https://techcommunity.microsoft.com/t5/microsoft-data-migration/using-data-migration-assistant-to-assess-an-application-s-data/ba-p/990430) blog post.

During the assessment of user databases, use Data Migration Assistant to [import](/sql/dma/dma-assesssqlonprem#add-databases-and-extended-events-trace-to-assess) captured trace files or Data Access Migration Toolkit files.

#### Assessments at scale

If you have multiple servers that require Azure readiness assessment, you can automate the process by using scripts using one of the following options. To learn more about using scripting see [Migrate databases at scale using automation](../../../dms/migration-dms-powershell-cli.md).
- [Az.DataMigration PowerShell module](/powershell/module/az.datamigration)
- [az datamigration CLI extension](/cli/azure/datamigration)
- [Data Migration Assistant command-line interface](/sql/dma/dma-commandline)

For summary reporting across large estates, Data Migration Assistant assessments can also be [consolidated into Azure Migrate](/sql/dma/dma-assess-sql-data-estate-to-sqldb).

#### Upgrade databases with Data Migration Assistant

For upgrade scenario, you might have a series of recommendations to ensure your user databases perform and function correctly after upgrade. Data Migration Assistant provides details on the impacted objects and resources for how to resolve each issue. Make sure to resolve all breaking changes and behavior changes before you start production upgrade.

For deprecated features, you can choose to run your user databases in their original [compatibility](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level) mode if you want to avoid making these changes and speed up migration. This action will prevent [upgrading your database compatibility](/sql/database-engine/install-windows/compatibility-certification#compatibility-levels-and-database-engine-upgrades) until the deprecated items have been resolved.

> [!CAUTION]
> Not all SQL Server versions support all compatibility modes. Check that your [target SQL Server version](/sql/t-sql/statements/alter-database-transact-sql-compatibility-level) supports your chosen database compatibility. For example, SQL Server 2019 doesn't support databases with level 90 compatibility (which is SQL Server 2005). These databases would require, at least, an upgrade to compatibility level 100.
>

## Migrate

After you've completed the pre-migration steps, you're ready to migrate the user databases and components. Migrate your databases by using your preferred [migration method](sql-server-to-sql-on-azure-vm-migration-overview.md#migrate).

The following sections provide steps for performing either a migration by using backup and restore or a minimal downtime migration by using backup and restore along with log shipping.

### Migrate using the Azure SQL migration extension for Azure Data Studio (minimal downtime)

To perform a minimal downtime migration using Azure Data Studio, follow the high level steps below. For a detailed step-by-step tutorial, see [Migrate SQL Server to SQL Server on Azure Virtual Machine online using Azure Data Studio](../../../dms/tutorial-sql-server-to-virtual-machine-online-ads.md):

1. Download and install [Azure Data Studio](/sql/azure-data-studio/download-azure-data-studio) and the [Azure SQL migration extension](/sql/azure-data-studio/extensions/azure-sql-migration-extension).
1. Launch the Migrate to Azure SQL wizard in the extension in Azure Data Studio.
1. Select databases for assessment and view migration readiness or issues (if any). Additionally, collect performance data and get right-sized Azure recommendation.
1. Select your Azure account and your target SQL Server on Azure Machine from your subscription.
1. Select the location of your database backups. Your database backups can either be located on an on-premises network share or in an Azure storage blob container.
1. Create a new Azure Database Migration Service using the wizard in Azure Data Studio. If you have previously created a Azure Database Migration Service using Azure Data Studio, you can reuse the same if desired.
1. *Optional*: If your backups are on an on-premises network share, download and install [self-hosted integration runtime](https://www.microsoft.com/download/details.aspx?id=39717) on a machine that can connect to source SQL Server and the location containing the backup files.
1. Start the database migration and monitor the progress in Azure Data Studio. You can also monitor the progress under the Azure Database Migration Service resource in Azure portal.
1. Complete the cutover.
   1. Stop all incoming transactions to the source database.
   1. Make application configuration changes to point to the target database in SQL Server on Azure Virtual Machine.
   1. Take any tail log backups for the source database in the backup location specified.
   1. Ensure all database backups have the status Restored in the monitoring details page.
   1. Select Complete cutover in the monitoring details page.

### Backup and restore

To perform a standard migration by using backup and restore:

1. Set up connectivity to SQL Server on Azure Virtual Machines based on your requirements. For more information, see [Connect to a SQL Server virtual machine on Azure (Resource Manager)](../../virtual-machines/windows/ways-to-connect-to-sql.md).
1. Pause or stop any applications that are using databases intended for migration.
1. Ensure user databases are inactive by using [single user mode](/sql/relational-databases/databases/set-a-database-to-single-user-mode).
1. Perform a full database backup to an on-premises location.
1. Copy your on-premises backup files to your VM by using a remote desktop, [Azure Data Explorer](/azure/data-explorer/data-explorer-overview), or the [AzCopy command-line utility](../../../storage/common/storage-use-azcopy-v10.md). (Greater than 2-TB backups are recommended.)
1. Restore full database backups to the SQL Server on Azure Virtual Machines.

### Migrate objects outside user databases

More SQL Server objects might be required for the seamless operation of your user databases post migration.

The following table provides a list of components and recommended migration methods that can be completed before or after migration of your user databases.

| **Feature** | **Component** | **Migration methods** |
| --- | --- | --- |
| **Databases** | Model | Script with SQL Server Management Studio. |
|| TempDB | Plan to move tempDB onto [Azure VM temporary disk (SSD)](../../virtual-machines/windows/performance-guidelines-best-practices-checklist.md#storage)) for best performance. Be sure to pick a VM size that has a sufficient local SSD to accommodate your tempDB. |
|| User databases with FileStream | Use the [Backup and restore](../../virtual-machines/windows/migrate-to-vm-from-sql-server.md#back-up-and-restore) methods for migration. Data Migration Assistant doesn't support databases with FileStream. |
| **Security** | SQL Server and Windows logins | Use Data Migration Assistant to [migrate user logins](/sql/dma/dma-migrateserverlogins). |
|| SQL Server roles | Script with SQL Server Management Studio. |
|| Cryptographic providers | Recommend [converting to use Azure Key Vault](../../virtual-machines/windows/azure-key-vault-integration-configure.md). This procedure uses the [SQL VM resource provider](../../virtual-machines/windows/sql-agent-extension-manually-register-single-vm.md). |
| **Server objects** | Backup devices | Replace with database backup by using [Azure Backup](../../../backup/backup-sql-server-database-azure-vms.md), or write backups to [Azure Storage](../../virtual-machines/windows/azure-storage-sql-server-backup-restore-use.md) (SQL Server 2012 SP1 CU2 +). This procedure uses the [SQL VM resource provider](../../virtual-machines/windows/sql-agent-extension-manually-register-single-vm.md).|
|| Linked servers | Script with SQL Server Management Studio. |
|| Server triggers | Script with SQL Server Management Studio. |
| **Replication** | Local publications | Script with SQL Server Management Studio. |
|| Local subscribers | Script with SQL Server Management Studio. |
| **PolyBase** | PolyBase | Script with SQL Server Management Studio. |
| **Management** | Database mail | Script with SQL Server Management Studio. |
| **SQL Server Agent** | Jobs | Script with SQL Server Management Studio. |
|| Alerts | Script with SQL Server Management Studio. |
|| Operators | Script with SQL Server Management Studio. |
|| Proxies | Script with SQL Server Management Studio. |
| **Operating system** | Files, file shares | Make a note of any other files or file shares that are used by your SQL servers and replicate on the Azure Virtual Machines target. |

## Post-migration

After you've successfully completed the migration stage, you need to complete a series of post-migration tasks to ensure that everything is functioning as smoothly and efficiently as possible.

### Remediate applications

After the data is migrated to the target environment, all the applications that formerly consumed the source need to start consuming the target. Accomplishing this task might require changes to the applications in some cases.

Apply any fixes recommended by Data Migration Assistant to user databases. You need to script these fixes to ensure consistency and allow for automation.

### Perform tests

The test approach to database migration consists of the following activities:

1. **Develop validation tests**: To test the database migration, you need to use SQL queries. Create validation queries to run against both the source and target databases. Your validation queries should cover the scope you've defined.
1. **Set up a test environment**: The test environment should contain a copy of the source database and the target database. Be sure to isolate the test environment.
1. **Run validation tests**: Run validation tests against the source and the target, and then analyze the results.
1. **Run performance tests**: Run performance tests against the source and target, and then analyze and compare the results.

> [!TIP]
> Use the [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview) to assist with evaluating the target SQL Server performance.

### Optimize

The post-migration phase is crucial for reconciling any data accuracy issues, verifying completeness, and addressing potential performance issues with the workload.

For more information about these issues and the steps to mitigate them, see:

- [Post-migration validation and optimization guide](/sql/relational-databases/post-migration-validation-and-optimization-guide)
- [Tuning performance in Azure SQL virtual machines](../../virtual-machines/windows/performance-guidelines-best-practices-checklist.md)
- [Azure cost optimization center](https://azure.microsoft.com/overview/cost-optimization/)

## Next steps

- To check the availability of services that apply to SQL Server, see the [Azure global infrastructure center](https://azure.microsoft.com/global-infrastructure/services/?regions=all&amp;products=synapse-analytics,virtual-machines,sql-database).
- For a matrix of Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios and specialty tasks, see [Services and tools for data migration](../../../dms/dms-tools-matrix.md).
- To learn more about Azure SQL, see:
   - [Deployment options](../../azure-sql-iaas-vs-paas-what-is-overview.md)
   - [SQL Server on Azure Virtual Machines](../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md)
   - [Azure Total Cost of Ownership (TCO) Calculator](https://azure.microsoft.com/pricing/tco/calculator/)

- To learn more about the framework and adoption cycle for cloud migrations, see:
   - [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   - [Best practices for costing and sizing workloads for migration to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs)

- For information about licensing, see:
   - [Bring your own license with the Azure Hybrid Benefit](../../virtual-machines/windows/licensing-model-azure-hybrid-benefit-ahb-change.md)
   - [Get free extended support for SQL Server 2008 and SQL Server 2008 R2](../../virtual-machines/windows/sql-server-2008-extend-end-of-support.md)

- To assess the application access layer, see [Data Access Migration Toolkit (preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit).
- For information about how to perform A/B testing for the data access layer, see [Overview of Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
