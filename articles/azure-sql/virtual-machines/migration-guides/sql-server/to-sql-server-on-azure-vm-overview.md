---
title: SQL Server to SQL Server on Azure VM (Migration overview)
description: Learn about the different migration strategies when you want to migrate your SQL Server to SQL Server on Azure VMs. 
services: database-migration
author: mark jones
ms.author: markjon
ms.reviewer: mathoma
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 7/20/2020
---

# Migration overview: SQL Server to SQL Server on Azure VMs

Learn about the different migration strategies to migrate your SQL Server to SQL Server on Azure Virtual Machines (VMs). 

You can migrate SQL Server running on-premises or on:

- SQL Server on Virtual Machines
- Amazon Web Services (AWS) EC2
- Compute Engine (GCP)
- AWS RDS

## Overview

When you plan to migrate SQL Server services and databases, there are three migration strategies to migrate your user databases to an instance of SQL Server on Azure VMs: **migrate only**, **migrate and upgrade**, and **lift and shift**. 

The appropriate approach for your business typically depends on the following factors: 


- Size and scale of migration
- Speed of migration
- Application support for code change
- Need to change SQL Server Version, Operating System, or both.

The following table describes the three migration strategies in detail: 


| **Migration Strategy** | **Description** | **When to consider using** | **Can Operating System Change?** | **Can SQL Server Version Change?** |
| --- | --- | --- | --- | --- |
|**Migrate only**<br />Database Migration Service| Use the migrate only strategy when you require the destination SQL Server to be the same version, or there is a need to change the underlying operating system. <br /> <br /> Select an Azure VM from Azure Marketplace or a prepared SQL Server image that matches the source SQL Server version. Back up user databases, move them, and then restore to them to the destination SQL Server. | Use when the lift and shift migration strategy is not available, or there is a requirement to change the underlying operating system. <br /><br /> The SQL Server version remains the same as the source, reducing the need for database or application code changes, speeding migrations. <br /><br /> There may be additional considerations for migration SQL Server Integration Services (SSIS), SQL Server Reporting Services (SSRS) and SQL Server Analysis Services (SSAS) if in the scope of migration. | Yes | No |
|**Migrate & upgrade**<br />Database Migration Service | Use the migrate and upgrade strategy when you want to upgrade the target SQL Server and operating system version. <br /> <br /> Select an Azure VM from Azure Marketplace or a prepared SQL Server image that matches the source SQL Server version. Back up user databases, move them, and then restore to them to the destination SQL Server.| Use when there is a requirement or desire to use features available in newer versions of SQL Server, or if there is a requirement to upgrade legacy SQL Server and/or OS versions which are no longer in support.  <br /> <br /> May require some application or user database changes to support the SQL Server upgrade. <br /><br />There may be additional considerations for migration SQL Server Integration Services (SSIS), SQL Server Reporting Services (SSRS) and SQL Server Analysis Services (SSAS) if in the scope of migration. | Yes | Yes | 
| **Lift & shift**<br />[Azure Migrate](../../../migrate/migrate-services-overview.md) | Use the lift and shift migration strategy to move the entire physical or virtual SQL Server from its current location onto an instance of SQL Server on Azure VM without any changes to the operating system, or SQL Server version. To complete a lift and shift migration, see [Azure Migrate](../../../migrate/migrate-services-overview.md). <br /><br /> The source server remains online and services requests while the source and destination server synchronize data allowing for an almost seamless migration. | Use for single to very large-scale migrations, even applicable to scenarios such as data center exit. <br /><br /> Minimal to no code changes required to user SQL databases or applications, allowing for faster overall migrations. <br /><br />No additional steps required for migrating SQL Server Integration Services (SSIS), SQL Server Reporting Services (SSRS), SQL Server Analysis Services (SSAS). | No | No| 


## Migrate strategies 

The following table details available methods for both **migrate only** and **migrate and upgrade** migration strategies to migrate your SQL Server to SQL Server on Azure VMs: 

|**Method** | **Source Database version** | **Destination database version** | **Source database backup size constraint** | **Automation and Scripting** | **Notes** |
| --- | --- | --- | --- | --- | --- |
| [Database Migration Assistant](https://docs.microsoft.com/en-us/sql/dma/dma-migrateonpremsql?view=sql-server-2017) | SQL Server 2005 | SQL Server 2008 R2 SP3 or greater | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) | [Automated through Command line interface](https://docs.microsoft.com/en-us/sql/dma/dma-commandline?view=sql-server-2017) | The Data Migration Assistant (DMA) provides seamless assessments of SQL Server on-premises and upgrades to later versions of SQL Server or migrations to SQL Server on Azure VMs or Azure SQL Database. <br /><br /> Should not be used on File Stream enabled User databases.<br /><br /> The Data Migration Assistant (DMA) also includes capability to migrate [SQL and Windows Logins](https://docs.microsoft.com/en-us/sql/dma/dma-migrateserverlogins?view=sql-server-ver15) and assess [SSIS Packages](https://docs.microsoft.com/en-us/sql/dma/dma-assess-ssis?view=sql-server-ver15). |
| [Backup to a file](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/migrate-to-vm-from-sql-server#back-up-and-restore) | SQL Server 2008 R2 SP3 or greater | SQL Server 2008 R2 SP3 or greater | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) | Script backups with [TSQL](https://docs.microsoft.com/en-us/sql/t-sql/statements/backup-transact-sql?view=sql-server-ver15) and copy using [AzCopy](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10) to Blob storage | This is a very simple and well-tested technique for moving databases across machines. Use compression to minimize backup size for transfer. <br /><br /> Can be used for File Stream enabled User databases. |
| [Backup to URL](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/migrate-to-vm-from-sql-server#backup-to-url-and-restore-from-url) | SQL Server 2012 SP1 CU2 or greater | SQL Server 2012 SP1 CU2 or greater | 12.8 TB for SQL Server 2016, otherwise 1 TB | [Scripted with TSQL or maintenance plan](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/sql-server-backup-to-url?view=sql-server-ver15) | This method is another way to move the backup file to the VM using Azure storage. Use compression to minimize backup size for transfer. <br /><br /> Can be used for File Stream enabled User databases. |
| [Detach and copy](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/migrate-to-vm-from-sql-server#detach-and-attach-from-a-url) | SQL Server 2008 R2 SP3 or greater | SQL Server 2014 or greater | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) | Script detach with [TSQL](https://docs.microsoft.com/en-us/sql/relational-databases/databases/detach-a-database?view=sql-server-ver15#TsqlProcedure) and copy using [AzCopy](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy-v10) to Blob storage | Use this method when you plan to [store these files using the Azure Blob storage service](https://msdn.microsoft.com/library/dn385720.aspx) and attach them to an instance of SQL Server on an Azure VM, particularly useful with very large databases or time taken for backup and restore is too long. <br /><br /> Can be used for File Stream enabled User databases. |
| [Log ship database](https://docs.microsoft.com/en-us/sql/database-engine/log-shipping/about-log-shipping-sql-server?view=sql-server-ver15) | SQL Server 2008 R2 SP3 or greater(Windows Only) | SQL Server 2008 R2 SP3 or greater(Windows Only) | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) | Script with [TSQL](https://docs.microsoft.com/en-us/sql/database-engine/log-shipping/log-shipping-tables-and-stored-procedures?view=sql-server-ver15) | Log shipping replicates transactional log files from on premise onto an instance of SQL Server on an Azure VM. <br /><br /> Can be used for File Stream enabled User databases. <br /><br /> This provides minimal downtime fail-over and has less configuration overhead than setting up an Always On, or you do not have an Always On on-premises deployment. |
| [Distributed availability group](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/business-continuity-high-availability-disaster-recovery-hadr-overview#hybrid-it-disaster-recovery-solutions) | SQL Server 2016 or greater | SQL Server 2016 or greater | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) | Script with [TSQL](https://docs.microsoft.com/en-us/sql/t-sql/statements/alter-availability-group-transact-sql?view=sql-server-ver15) | A [Distributed availability group](https://docs.microsoft.com/en-us/sql/database-engine/availability-groups/windows/distributed-availability-groups?view=sql-server-ver15) is a special type of availability group that spans two separate availability groups. The availability groups that participate in a distributed availability group do not need to be in the same location and include cross domain support. <br /><br /> This method minimizes downtime, use when you have an Always On on-premises deployment. |

> [!TIP]
> For large data transfers or for limited to no network options see [Data transfer for large datasets with low or network bandwidth](https://docs.microsoft.com/en-us/azure/storage/common/storage-solution-large-dataset-low-network)
>

## Lift and shift strategies 

|**Method** | **Source Database version** | **Destination database version** | **Source database backup size constraint** | **Automation and Scripting** | **Notes** |
| --- | --- | --- | --- | --- | --- |
 [Assess and Migrate VMWare VMs](https://docs.microsoft.com/en-us/azure/migrate/tutorial-prepare-vmware) <br /><br /> [Assess and Migrate Hyper V VMs](https://docs.microsoft.com/en-us/azure/migrate/tutorial-prepare-hyper-v) <br /><br /> [Assess and Migrate Physical Servers](https://docs.microsoft.com/en-us/azure/migrate/tutorial-prepare-physical) | SQL Server 2008 R2 SP3 or greater | SQL Server 2008 R2 SP3 or greater | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) | [Azure Site Recovery Scripts](https://docs.microsoft.com/en-us/azure/migrate/how-to-migrate-at-scale) <br /><br /> [See example of scaled migration and planning for Azure](https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale) | Existing SQL Server to be moved as-is to Instance of SQL Server on an Azure VM. Can scale migration workloads of up to 35,000 VMs. <br /><br /> Source server(s) remain online and servicing requests during synchronization of server data, minimizing downtime. |

## Business intelligence 

Consideration may also be required for SQL Server bsuiness intelligence services that are outside of the scope of a user database migration. These services include:

- **SQL Server Integration Services**: To migrate Integration Services please see [here](https://docs.microsoft.com/en-us/sql/integration-services/install-windows/upgrade-integration-services?view=sql-server-ver15).
- **SQL Server Reporting Services**: To migrate Reporting Services please see [here](https://docs.microsoft.com/en-us/sql/reporting-services/install-windows/upgrade-and-migrate-reporting-services?view=sql-server-ver15)..
- **SQL Server Analysis Services**: To migrate Analysis Services please see [here](https://docs.microsoft.com/en-us/sql/database-engine/install-windows/upgrade-analysis-services)..

## Supported versions

As you prepare for migrating SQL Server databases to SQL Server on Azure VMs, be sure to consider the versions of SQL Server that are supported. For a list of current supported SQL Server versions on Azure VMs please see [SQL Server on Azure VMs](../../../azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md#get-started-with-sql-server-vms).


#### Additional resources



## Next steps

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see the article [Service and tools for data migration.](../../dms-tools-matrix.md)
- For detail on alternatives for migrating to Azure, see the white paper [Choosing your database migration path to Azure](https://review.docs.microsoft.com/en-us/azure/dms/migration-guides/sql-server/azure-sql-database?branch=pr-en-us-118415).

- To learn more about Azure SQL see:
   - [Deployment options](../../../azure-sql/azure-sql-iaas-vs-paas-what-is-overview.md)
   - [SQL Server on Azure VMs](../../../azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migration, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale).
   -  [Best practices for costing and sizing](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) workloads migrate to Azure


- (Preview) to assess the Application access layer see [Data Access Migration Toolkit](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit).
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
