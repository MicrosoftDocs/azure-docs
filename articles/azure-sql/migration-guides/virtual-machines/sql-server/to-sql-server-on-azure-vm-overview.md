---
title: SQL Server to SQL Server on Azure VM (Migration overview)
description: Learn about the different migration strategies when you want to migrate your SQL Server to SQL Server on Azure VMs. 
services: database-migration
author: markjones-msft
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
- Amazon Relational Database Service (AWS RDS) 
- Compute Engine (Google Cloud Platform - GCP)

For other scenarios, see the [Database Migration Guide](https://datamigration.microsoft.com/). 

## Overview

Migrate to [SQL Server on Azure Virtual Machines (VMs)](https://docs.microsoft.com/azure/azure-sql/virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview) when you want to use the familiar SQL Server environment with OS control, and want to take advantage of cloud-provided features such as built-in VM high availability, [automated backups](../../../virtual-machines/windows/automated-backup.md), and [automated patching](../../../virtual-machines/windows/automated-patching.md). 

Save on costs by bringing your own license with the [Azure Hybrid Benefit licensing model](../../../virtual-machines/windows/licensing-model-azure-hybrid-benefit-ahb-change.md) or extend support for SQL Server 2008 and SQL Server 2008 R2 by getting [free security updates](../../../virtual-machines/windows/sql-server-2008-extend-end-of-support.md). 


## Choosing appropriate target

Azure Virtual Machines run in many different regions of Azure and also offer a variety of [machine sizes](https://docs.microsoft.com/azure/virtual-machines/windows/sizes) and [Storage options](https://docs.microsoft.com/azure/virtual-machines/disks-types). 
When determining the correct size of VM and Storage for your SQL Server workload, refer to the [Performance Guidelines for SQL Server on Azure Virtual Machines.](https://docs.microsoft.com/azure/azure-sql/virtual-machines/windows/performance-guidelines-best-practices#vm-size-guidance). To determine the VM size and storage requirements for your workload. it is recommended that these are sized through an Performance-Based [Azure Migrate Assessment](https://docs.microsoft.com/azure/migrate/concepts-assessment-calculation#types-of-assessments). If this is not an available option, see the following article on creating your own [baseline for performance](https://azure.microsoft.com/services/virtual-machines/sql-server/).

Consideration should also be made on the correct installation and configuration of SQL Server on a VM. It is recommended to use the [Azure SQL virtual machine image gallery](https://docs.microsoft.com/azure/azure-sql/virtual-machines/windows/create-sql-vm-portal) as this allows you to create a SQL Server VM with the right version, edition, and operating system. This will also register the Azure VM with the SQL Server [Resource Provider](https://docs.microsoft.com/azure/azure-sql/virtual-machines/windows/create-sql-vm-portal) automatically, enabling features such as Automated Backups and Automated Patching.

## Migration strategies

There are two migration strategies to migrate your user databases to an instance of SQL Server on Azure VMs: 
**migrate**, and **lift and shift**. 

The appropriate approach for your business typically depends on the following factors: 

- Size and scale of migration
- Speed of migration
- Application support for code change
- Need to change SQL Server Version, Operating System, or both.
- Supportability life cycle of your existing products
- Window for application downtime during migration

The following table describes differences in the two migration strategies: 
<br />

| **Migration strategy** | **Description** | **When to use** |
| --- | --- | --- |
| **Lift & shift** | Use the lift and shift migration strategy to move the entire physical or virtual SQL Server from its current location onto an instance of SQL Server on Azure VM without any changes to the operating system, or SQL Server version. To complete a lift and shift migration, see [Azure Migrate](../../../../migrate/migrate-services-overview.md). <br /><br /> The source server remains online and services requests while the source and destination server synchronize data allowing for an almost seamless migration. | Use for single to very large-scale migrations, even applicable to scenarios such as data center exit. <br /><br /> Minimal to no code changes required to user SQL databases or applications, allowing for faster overall migrations. <br /><br />No additional steps required for migrating the Business Intelligence services such as  [SSIS](/sql/integration-services/sql-server-integration-services), [SSRS](/sql/reporting-services/create-deploy-and-manage-mobile-and-paginated-reports), and [SSAS](/analysis-services/analysis-services-overview). |
|**Migrate** | Use a migrate strategy when you want to upgrade the target SQL Server and/or operating system version. <br /> <br /> Select an Azure VM from Azure Marketplace or a prepared SQL Server image that matches the source SQL Server version. | Use when there is a requirement or desire to use features available in newer versions of SQL Server, or if there is a requirement to upgrade legacy SQL Server and/or OS versions that are no longer in support.  <br /> <br /> May require some application or user database changes to support the SQL Server upgrade. <br /><br />There may be additional considerations for migrating [Business Intelligence](#business-intelligence) services if in the scope of migration. |


## Lift and shift  

The following table details the available method for the **lift and shift** migration strategy to migrate your SQL Server database to SQL Server on Azure VMs: 
<br />

|**Method** | **Minimum source version** | **Minimum target version** | **Source backup size constraint** |  **Notes** |
| --- | --- | --- | --- | --- |
| [Azure Migrate](../../../../migrate/index.yml) | SQL Server 2008 SP4| SQL Server 2008 SP4| [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) |  Existing SQL Server to be moved as-is to instance of SQL Server on an Azure VM. Can scale migration workloads of up to 35,000 VMs. <br /><br /> Source server(s) remain online and servicing requests during synchronization of server data, minimizing downtime. <br /><br /> **Automation & scripting**: [Azure Site Recovery Scripts](../../../../migrate/how-to-migrate-at-scale.md) and [Example of scaled migration and planning for Azure](/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)|

## Migrate  

Due to the ease of setup, the recommended migration approach is to take a native SQL Server [backup](/sql/t-sql/statements/backup-transact-sql) locally and then copy the file to Azure. This method supports larger databases (>1TB) for all versions of SQL Server starting from 2008 and larger database backups (>1TB). However, for databases starting in SQL Server 2014, that are smaller than 1TB, and that have good connectivity to Azure, then [SQL Server backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url) is the better approach. 

:::image type="content" source="../media/VM-migration-downtime.png" alt-text="Migration downtime":::

When migrating SQL Server databases to an instance of SQL Server on Azure VMs, it is important to choose an approach that suits when you need to cutover to the target server as this affects the application downtime window.

The following table details all available methods to migrate your SQL Server database to SQL Server on Azure VMs: 
<br />

|**Method** | **Minimum source version** | **Minimum target version** | **Source backup size constraint** | **Notes** |
| --- | --- | --- | --- | --- |
| **[Backup to a file](/windows/migrate-to-vm-from-sql-server.md#back-up-and-restore)** | SQL Server 2008 SP4 | SQL Server 2008 SP4| [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) |  This is a simple and well-tested technique for moving databases across machines. Use compression to minimize backup size for transfer. <br /><br /> **Automation & scripting**: [Transact-SQL (T-SQL)](/sql/t-sql/statements/backup-transact-sql) and [AzCopy to Blob storage](../../../../storage/common/storage-use-azcopy-v10.md)  |
| **[Backup to URL](/windows/migrate-to-vm-from-sql-server.md#backup-to-url-and-restore-from-url)** | SQL Server 2012 SP1 CU2 | SQL Server 2012 SP1 CU2| 12.8 TB for SQL Server 2016, otherwise 1 TB | An alternative way to move the backup file to the VM using Azure storage. Use compression to minimize backup size for transfer. <br /><br /> **Automation & scripting**:  [T-SQL or maintenance plan](/sql/relational-databases/backup-restore/sql-server-backup-to-url) |
| **[Database Migration Assistant (DMA)](/sql/dma/dma-overview)** | SQL Server 2005| SQL Server 2008 SP4| [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) |  The [DMA](/sql/dma/dma-overview) assesses SQL Server on-premises and then seamlessly upgrades to later versions of SQL Server or migrates to SQL Server on Azure VMs, Azure SQL Database or Azure SQL Managed Instance. <br /><br /> Should not be used on Filestream-enabled user databases.<br /><br /> DMA also includes capability to migrate [SQL and Windows logins](/sql/dma/dma-migrateserverlogins) and assess [SSIS Packages](/sql/dma/dma-assess-ssis). <br /><br /> **Automation & scripting**: [Command line interface](/sql/dma/dma-commandline) |
| **[Detach and attach](/windows/migrate-to-vm-from-sql-server.md#detach-and-attach-from-a-url)** | SQL Server 2008 SP4 | SQL Server 2014 | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) | Use this method when you plan to [store these files using the Azure Blob storage service](/sql/relational-databases/databases/sql-server-data-files-in-microsoft-azure) and attach them to an instance of SQL Server on an Azure VM, particularly useful with very large databases or when the time to backup and restore is too long. <br /><br /> **Automation & scripting**:  [T-SQL](/sql/relational-databases/databases/detach-a-database#TsqlProcedure) and [AzCopy to Blob storage](../../../../storage/common/storage-use-azcopy-v10.md)|
|**[Log shipping](/sql/database-engine/log-shipping/about-log-shipping-sql-server)** | SQL Server 2008 SP4 (Windows Only) | SQL Server 2008 SP4 (Windows Only) | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) | Log shipping replicates transactional log files from on-premises on to an instance of SQL Server on an Azure VM. <br /><br /> This provides minimal downtime during failover and has less configuration overhead than setting up an Always On availability group. <br /><br /> **Automation & scripting**: [T-SQL](/sql/database-engine/log-shipping/log-shipping-tables-and-stored-procedures)  |
| **[Distributed availability group](/windows/business-continuity-high-availability-disaster-recovery-hadr-overview.md#hybrid-it-disaster-recovery-solutions)** | SQL Server 2016| SQL Server 2016 | [Azure VM storage limit](https://azure.microsoft.com/documentation/articles/azure-resource-manager/management/azure-subscription-service-limits/) |  A [distributed availability group](/sql/database-engine/availability-groups/windows/distributed-availability-groups) is a special type of availability group that spans two separate availability groups. The availability groups that participate in a distributed availability group do not need to be in the same location and include cross-domain support. <br /><br /> This method minimizes downtime, use when you have an availability group configured on-premises. <br /><br /> **Automation & scripting**: [T-SQL](/sql/t-sql/statements/alter-availability-group-transact-sql)  |
| | | | | |

&nbsp;
&nbsp;
&nbsp;&nbsp;
&nbsp;
&nbsp;
 
> [!TIP]
> For large data transfers with limited to no network options, see [Large data transfers with limited connectivity](../../../../storage/common/storage-solution-large-dataset-low-network.md).
> 

### Considerations

The following is a list of key points to consider when reviewing migration methods:

- For optimum data transfer performance, migrate databases and files onto an instance of SQL Server on Azure VM using a compressed backup file. For larger databases, in addition to compression, [split the backup file into smaller files](/sql/relational-databases/backup-restore/back-up-files-and-filegroups-sql-server) for increased performance during backup and transfer. 
- If migrating from SQL Server 2014 or higher, consider [encrypting the backups](/sql/relational-databases/backup-restore/backup-encryption) to protect data during network transfer.
- To minimize downtime during database migration, use the Always On availability group option. 
- To minimize downtime without the overhead of configuring an availability group, use the log shipping option. 
- For limited to no network options, use offline migration methods such as backup and restore, or [disk transfer services](../../../../storage/common/storage-solution-large-dataset-low-network.md) available in Azure.
- To also change the version of SQL Server on a SQL Server on Azure VM, see [change SQL Server edition](../../../virtual-machines/windows/change-sql-server-edition.md).

## Business Intelligence 

There may be additional considerations when migrating SQL Server Business Intelligence services outside the scope of user database migrations. 

These services include:

- [**SQL Server Integration Services (SSIS)**](/sql/integration-services/install-windows/upgrade-integration-services)
- [**SQL Server Reporting Services (SSRS)**](/sql/reporting-services/install-windows/upgrade-and-migrate-reporting-services)
- [**SQL Server Analysis Services (SSAS)**](/sql/database-engine/install-windows/upgrade-analysis-services)

## Supported versions

As you prepare for migrating SQL Server databases to SQL Server on Azure VMs, be sure to consider the versions of SQL Server that are supported. For a list of current supported SQL Server versions on Azure VMs, please see [SQL Server on Azure VMs](../../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md#get-started-with-sql-server-vms).


## Next steps

To start migrating your SQL Server on SQL Server on Azure VMs, see the [Individual database migration guide](individual-databases-migration-guide.md). 

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see the article [Service and tools for data migration.](../../../../dms/dms-tools-matrix.md)

- To learn more about Azure SQL see:
   - [Deployment options](../../../azure-sql-iaas-vs-paas-what-is-overview.md)
   - [SQL Server on Azure VMs](../../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- For information about licensing, see
   - [Bring your own license with the Azure Hybrid Benefit](../../../virtual-machines/windows/licensing-model-azure-hybrid-benefit-ahb-change.md)
   - [Get free extended support for SQL Server 2008 and SQL Server 2008 R2](../../../virtual-machines/windows/sql-server-2008-extend-end-of-support.md)


- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
