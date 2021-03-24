---
title: "SQL Server to SQL Managed Instance: Migration overview"
description: Learn about the tools and options available to migrate your SQL Server databases to Azure SQL Managed Instance.
ms.service: sql-managed-instance
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: mokabiru
ms.author: mokabiru
ms.reviewer: MashaMSFT
ms.date: 02/18/2020
---
# Migration overview: SQL Server to Azure SQL Managed Instance
[!INCLUDE[appliesto--sqlmi](../../includes/appliesto-sqlmi.md)]

Learn about the options and considerations for migrating your SQL Server databases to Azure SQL Managed Instance. 

You can migrate SQL Server databases running on-premises or on: 

- SQL Server on Azure Virtual Machines  
- Amazon Web Services (AWS) Elastic Compute Cloud (EC2) 
- AWS Relational Database Service (RDS) 
- Compute Engine in Google Cloud Platform (GCP)  
- Cloud SQL for SQL Server in GCP 

For other migration guides, see [Database Migration](https://docs.microsoft.com/data-migration). 

## Overview

[Azure SQL Managed Instance](../../managed-instance/sql-managed-instance-paas-overview.md) is a recommended target option for SQL Server workloads that require a fully managed service without having to manage virtual machines or their operating systems. SQL Managed Instance enables you to move your on-premises applications to Azure with minimal application or database changes. It offers complete isolation of your instances with native virtual network support. 

## Considerations 

The key factors to consider when you're evaluating migration options are: 
- Number of servers and databases
- Size of databases
- Acceptable business downtime during the migration process 

One of the key benefits of migrating your SQL Server databases to SQL Managed Instance is that you can choose to migrate the entire instance or just a subset of individual databases. Carefully plan to include the following in your migration process: 
- All databases that need to be colocated to the same instance 
- Instance-level objects required for your application, including logins, credentials, SQL Agent jobs and operators, and server-level triggers 

> [!NOTE]
> Azure SQL Managed Instance guarantees 99.99 percent availability, even in critical scenarios. Overhead caused by some features in SQL Managed Instance can't be disabled. For more information, see the [Key causes of performance differences between SQL Managed Instance and SQL Server](https://azure.microsoft.com/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/) blog entry. 


## Choose an appropriate target

The following general guidelines can help you choose the right service tier and characteristics of SQL Managed Instance to help match your [performance baseline](sql-server-to-managed-instance-performance-baseline.md): 

- Use the CPU usage baseline to provision a managed instance that matches the number of cores that your instance of SQL Server uses. It might be necessary to scale resources to match the [hardware generation characteristics](../../managed-instance/resource-limits.md#hardware-generation-characteristics). 
- Use the memory usage baseline to choose a [vCore option](../../managed-instance/resource-limits.md#service-tier-characteristics) that appropriately matches your memory allocation. 
- Use the baseline I/O latency of the file subsystem to choose between the General Purpose (latency greater than 5 ms) and Business Critical (latency less than 3 ms) service tiers. 
- Use the baseline throughput to preallocate the size of the data and log files to achieve expected I/O performance. 

You can choose compute and storage resources during deployment and then [change them afterward by using the Azure portal](../../database/scale-resources.md), without incurring downtime for your application. 

> [!IMPORTANT]
> Any discrepancy in the [virtual network requirements for managed instances](../../managed-instance/connectivity-architecture-overview.md#network-requirements) can prevent you from creating new instances or using existing ones. Learn more about [creating new](../../managed-instance/virtual-network-subnet-create-arm-template.md) and [configuring existing](../../managed-instance/vnet-existing-add-subnet.md) networks. 

Another key consideration in the selection of the target service tier in Azure SQL Managed Instance (General Purpose versus Business Critical) is the availability of certain features, like In-Memory OLTP, that are available only in the Business Critical tier. 

### SQL Server VM alternative

Your business might have requirements that make [SQL Server on Azure Virtual Machines](../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md) a more suitable target than Azure SQL Managed Instance. 

If one of the following conditions applies to your business, consider moving to a SQL Server virtual machine (VM) instead: 

- You require direct access to the operating system or file system, such as to install third-party or custom agents on the same virtual machine with SQL Server. 
- You have strict dependency on features that are still not supported, such as FileStream/FileTable, PolyBase, and cross-instance transactions. 
- You need to stay at a specific version of SQL Server (2012, for example). 
- Your compute requirements are much lower than a managed instance offers (one vCore, for example), and database consolidation is not an acceptable option. 

## Migration tools

We recommend the following migration tools: 

|Technology | Description|
|---------|---------|
| [Azure Migrate](/azure/migrate/how-to-create-azure-sql-assessment) | This Azure service helps you to discover and assess your SQL data estate at scale on VMware. It provides Azure SQL deployment recommendations, target sizing, and monthly estimates. | 
|[Azure Database Migration Service](../../../dms/tutorial-sql-server-to-managed-instance.md)  | This Azure service supports migration in the offline mode for applications that can afford downtime during the migration process. Unlike the continuous migration in online mode, offline mode migration runs a one-time restore of a full database backup from the source to the target. | 
|[Native backup and restore](../../managed-instance/restore-sample-database-quickstart.md) | SQL Managed Instance supports restore of native SQL Server database backups (.bak files). That makes it the easiest migration option for customers who can provide full database backups to Azure Storage. Full and differential backups are also supported and documented in the [section about migration assets](#migration-assets) later in this article.| 
|[Log Replay Service](../../managed-instance/log-replay-service-migrate.md) | This cloud service is enabled for SQL Managed Instance based on SQL Server log-shipping technology. It's a migration option for customers who can provide full, differential, and log database backups to Azure Storage. Log Replay Service is used to restore backup files from Azure Blob Storage to SQL Managed Instance.| 
| | |

The following table lists alternative migration tools: 

|**Technology** |**Description**  |
|---------|---------|
|[Transactional replication](../../managed-instance/replication-transactional-overview.md) | Replicate data from source SQL Server database tables to SQL Managed Instance by providing a publisher-subscriber type migration option while maintaining transactional consistency. |  |
|[Bulk copy](/sql/relational-databases/import-export/import-and-export-bulk-data-by-using-the-bcp-utility-sql-server)| The [bulk copy program (bcp) tool](/sql/tools/bcp-utility) copies data from an instance of SQL Server into a data file. Use the tool to export the data from your source and import the data file into the target SQL managed instance. </br></br> For high-speed bulk copy operations to move data to Azure SQL Managed Instance, you can use the [Smart Bulk Copy tool](/samples/azure-samples/smartbulkcopy/smart-bulk-copy/) to maximize transfer speed by taking advantage of parallel copy tasks. | 
|[Import Export Wizard/BACPAC](../../database/database-import.md?tabs=azure-powershell)| [BACPAC](/sql/relational-databases/data-tier-applications/data-tier-applications#bacpac) is a Windows file with a .bacpac extension that encapsulates a database's schema and data. You can use BACPAC to both export data from a SQL Server source and import the data back into Azure SQL Managed Instance. |  
|[Azure Data Factory](../../../data-factory/connector-azure-sql-managed-instance.md)|  The [Copy activity](../../../data-factory/copy-activity-overview.md) in Azure Data Factory migrates data from source SQL Server databases to SQL Managed Instance by using built-in connectors and an [integration runtime](../../../data-factory/concepts-integration-runtime.md).</br> </br> Data Factory supports a wide range of [connectors](../../../data-factory/connector-overview.md) to move data from SQL Server sources to SQL Managed Instance. |

## Compare migration options

Compare migration options to choose the path that's appropriate to your business needs. 

The following table compares the migration options that we recommend: 

|Migration option  |When to use  |Considerations  |
|---------|---------|---------|
|[Azure Database Migration Service](../../../dms/tutorial-sql-server-to-managed-instance.md) | - Migrate single databases or multiple databases at scale. </br> - Can accommodate downtime during the migration process. </br> </br> Supported sources: </br> - SQL Server (2005 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM |  - Migrations at scale can be automated via [PowerShell](../../../dms/howto-sql-server-to-azure-sql-managed-instance-powershell-offline.md). </br> - Time to complete migration depends on database size and is affected by backup and restore time. </br> - Sufficient downtime might be required. |
|[Native backup and restore](../../managed-instance/restore-sample-database-quickstart.md) | - Migrate individual line-of-business application databases.  </br> - Quick and easy migration without a separate migration service or tool.  </br> </br> Supported sources: </br> - SQL Server (2005 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM | - Database backup uses multiple threads to optimize data transfer to Azure Blob Storage, but partner bandwidth and database size can affect transfer rate. </br> - Downtime should accommodate the time required to perform a full backup and restore (which is a size of data operation).| 
|[Log Replay Service](../../managed-instance/log-replay-service-migrate.md) | - Migrate individual line-of-business application databases.  </br> - More control is needed for database migrations.  </br> </br> Supported sources: </br> - SQL Server (2008 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM | - The migration entails making full database backups on SQL Server and copying backup files to Azure Blob Storage. Log Replay Service is used to restore backup files from Azure Blob Storage to SQL Managed Instance. </br> - Databases being restored during the migration process will be in a restoring mode and can't be used to read or write until the process has finished.| 
| | | |

The following table compares the alternative migration options: 

|Method or technology |When to use |Considerations  |
|---------|---------|---------|
|[Transactional replication](../../managed-instance/replication-transactional-overview.md) | - Migrate by continuously publishing changes from source database tables to target SQL Managed Instance database tables. </br> - Full or partial database migrations of selected tables (subset of a database).  </br> </br> Supported sources: </br> - SQL Server (2012 to 2019) with some limitations </br> - AWS EC2  </br> - GCP Compute SQL Server VM | </br> - Setup is relatively complex compared to other migration options.   </br> - Provides a continuous replication option to migrate data (without taking the databases offline).</br> - Transactional replication has a number of limitations to consider when you're setting up the publisher on the source SQL Server instance. See [Limitations on publishing objects](/sql/relational-databases/replication/publish/publish-data-and-database-objects#limitations-on-publishing-objects) to learn more.  </br> - Capability to [monitor replication activity](/sql/relational-databases/replication/monitor/monitoring-replication) is available.    |
|[Bulk copy](/sql/relational-databases/import-export/import-and-export-bulk-data-by-using-the-bcp-utility-sql-server)| - Migrate full or partial data migrations. </br> - Can accommodate downtime. </br> </br> Supported sources: </br> - SQL Server (2005 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM   | - Requires downtime for exporting data from the source and importing into the target. </br> - The file formats and data types used in the export or import need to be consistent with table schemas. |
|[Import Export Wizard/BACPAC](../../database/database-import.md)| - Migrate individual line-of-business application databases. </br>- Suited for smaller databases.  </br>  Does not require a separate migration service or tool. </br> </br> Supported sources: </br> - SQL Server (2005 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM  |   </br> - Requires downtime because data needs to be exported at the source and imported at the destination.   </br> - The file formats and data types used in the export or import need to be consistent with table schemas to avoid truncation or data-type mismatch errors. </br> - Time taken to export a database with a large number of objects can be significantly higher. |
|[Azure Data Factory](../../../data-factory/connector-azure-sql-managed-instance.md)| - Migrate and/or transform data from source SQL Server databases.</br> - Merging data from multiple sources of data to Azure SQL Managed Instance is typically for business intelligence (BI) workloads.   </br> - Requires creating data movement pipelines in Data Factory to move data from source to destination.   </br> - [Cost](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/) is an important consideration and is based on factors like pipeline triggers, activity runs, and duration of data movement. |
| | | |

## Feature interoperability 

There are additional considerations when you're migrating workloads that rely on other SQL Server features. 

### SQL Server Integration Services

Migrate SQL Server Integration Services (SSIS) packages and projects in SSISDB to Azure SQL Managed Instance by using [Azure Database Migration Service](../../../dms/how-to-migrate-ssis-packages-managed-instance.md). 

Only SSIS packages in SSISDB starting with SQL Server 2012 are supported for migration. Convert older SSIS packages before migration. See the [project conversion tutorial](/sql/integration-services/lesson-6-2-converting-the-project-to-the-project-deployment-model) to learn more. 


### SQL Server Reporting Services

You can migrate SQL Server Reporting Services (SSRS) reports to paginated reports in Power BI. Use the [RDL Migration Tool](https://github.com/microsoft/RdlMigration) to help prepare and migrate your reports. Microsoft developed this tool to help customers migrate Report Definition Language (RDL) reports from their SSRS servers to Power BI. It's available on GitHub, and it documents an end-to-end walkthrough of the migration scenario. 

### SQL Server Analysis Services

SQL Server Analysis Services tabular models from SQL Server 2012 and later can be migrated to Azure Analysis Services, which is a platform as a service (PaaS) deployment model for the Analysis Services tabular model in Azure. You can learn more about migrating on-premises models to Azure Analysis Services in [this video tutorial](https://azure.microsoft.com/resources/videos/azure-analysis-services-moving-models/).

Alternatively, you can consider migrating your on-premises Analysis Services tabular models to [Power BI Premium by using the new XMLA read/write endpoints](/power-bi/admin/service-premium-connect-tools). 

> [!NOTE]
> Power BI XMLA read/write endpoint functionality is currently in public preview. Don't consider it for production workloads until it becomes generally available.

### High availability

The SQL Server high-availability features Always On failover cluster instances and Always On availability groups become obsolete on the target SQL managed instance. High-availability architecture is already built into both [General Purpose (standard availability model)](../../database/high-availability-sla.md#basic-standard-and-general-purpose-service-tier-locally-redundant-availability) and [Business Critical (premium availability model)](../../database/high-availability-sla.md#premium-and-business-critical-service-tier-locally-redundant-availability) SQL Managed Instance service tiers. The premium availability model also provides read scale-out that allows connecting into one of the secondary nodes for read-only purposes.     

Beyond the high-availability architecture that's included in SQL Managed Instance, the [auto-failover groups](../../database/auto-failover-group-overview.md) feature allows you to manage the replication and failover of databases in a managed instance to another region. 

### SQL Agent jobs

Use the offline Azure Database Migration Service option to migrate [SQL Agent jobs](../../../dms/howto-sql-server-to-azure-sql-managed-instance-powershell-offline.md). Otherwise, script the jobs in Transact-SQL (T-SQL) by using SQL Server Management Studio and then manually re-create them on the target SQL managed instance. 

> [!IMPORTANT]
> Currently, Azure Database Migration Service supports only jobs with T-SQL subsystem steps. Jobs with SSIS package steps have to be manually migrated. 

### Logins and groups

Move SQL logins from the SQL Server source to Azure SQL Managed Instance by using Database Migration Service in offline mode.  Use the [Select logins](../../../dms/tutorial-sql-server-to-managed-instance.md#select-logins) pane in the Migration Wizard to migrate logins to your target SQL managed instance. 

By default, Azure Database Migration Service supports migrating only SQL logins. However, you can enable the migration of Windows logins by:

- Ensuring that the target SQL managed instance has Azure Active Directory (Azure AD) read access. A user who has the Global Administrator role can configure that access via the Azure portal.
- Configuring Azure Database Migration Service to enable Windows user or group login migrations. You set this up via the Azure portal, on the **Configuration** page. After you enable this setting, restart the service for the changes to take effect.

After you restart the service, Windows user or group logins appear in the list of logins available for migration. For any Windows user or group logins that you migrate, you're prompted to provide the associated domain name. Service user accounts (accounts with the domain name NT AUTHORITY) and virtual user accounts (accounts with the domain name NT SERVICE) are not supported. To learn more, see [How to migrate Windows users and groups in a SQL Server instance to Azure SQL Managed Instance using T-SQL](../../managed-instance/migrate-sql-server-users-to-instance-transact-sql-tsql-tutorial.md).

Alternatively, you can use the [PowerShell utility](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/MoveLogins) specially designed by Microsoft data migration architects. The utility uses PowerShell to create a Transact-SQL (T-SQL) script to re-create logins and select database users from the source to the target. 

The PowerShell utility automatically maps Windows Server Active Directory accounts to Azure AD accounts, and it can do a UPN lookup for each login against the source Active Directory instance. The utility scripts custom server and database roles, along with role membership and user permissions. Contained databases are not yet supported, and only a subset of possible SQL Server permissions are scripted. 

### Encryption

When you're migrating databases protected by [Transparent Data Encryption](../../database/transparent-data-encryption-tde-overview.md) to a managed instance by using the native restore option, [migrate the corresponding certificate](../../managed-instance/tde-certificate-migrate.md) from the source SQL Server instance to the target SQL managed instance *before* database restore. 

### System databases

Restore of system databases is not supported. To migrate instance-level objects (stored in master or msdb databases), script them by using Transact-SQL (T-SQL) and then re-create them on the target managed instance. 

### In-Memory OLTP (memory-optimized tables)

SQL Server provides In-Memory OLTP capability that allows usage of memory-optimized tables, memory-optimized table types, and natively compiled SQL modules to run workloads that have high-throughput and low-latency transactional processing requirements. 

> [!IMPORTANT]
> In-Memory OLTP is supported only in the Business Critical tier in Azure SQL Managed Instance (and not supported in the General Purpose tier).

If you have memory-optimized tables or memory-optimized table types in your on-premises SQL Server instance and you want to migrate to Azure SQL Managed Instance, you should either:

- Choose the Business Critical tier for your target SQL managed instance that supports In-Memory OLTP
- If you want to migrate to the General Purpose tier in Azure SQL Managed Instance, remove memory-optimized tables, memory-optimized table types, and natively compiled SQL modules that interact with memory-optimized objects before migrating your databases. You can use the following T-SQL query to identify all objects that need to be removed before migration to the General Purpose tier:

   ```tsql
   SELECT * FROM sys.tables WHERE is_memory_optimized=1
   SELECT * FROM sys.table_types WHERE is_memory_optimized=1
   SELECT * FROM sys.sql_modules WHERE uses_native_compilation=1
   ```

To learn more about in-memory technologies, see [Optimize performance by using in-memory technologies in Azure SQL Database and Azure SQL Managed Instance](https://docs.microsoft.com/azure/azure-sql/in-memory-oltp-overview).

## Advanced features 

Be sure to take advantage of the advanced cloud-based features in SQL Managed Instance. For example, you don't need to worry about managing backups because the service does it for you. You can restore to any [point in time within the retention period](../../database/recovery-using-backups.md#point-in-time-restore). Additionally, you don't need to worry about setting up high availability, because [high availability is built in](../../database/high-availability-sla.md). 

To strengthen security, consider using [Azure AD authentication](../../database/authentication-aad-overview.md), [auditing](../../managed-instance/auditing-configure.md), [threat detection](../../database/azure-defender-for-sql.md), [row-level security](/sql/relational-databases/security/row-level-security), and [dynamic data masking](/sql/relational-databases/security/dynamic-data-masking).

In addition to advanced management and security features, SQL Managed Instance provides advanced tools that can help you [monitor and tune your workload](../../database/monitor-tune-overview.md). [Azure SQL Analytics](../../../azure-monitor/insights/azure-sql.md) allows you to monitor a large set of managed instances in a centralized way. [Automatic tuning](/sql/relational-databases/automatic-tuning/automatic-tuning#automatic-plan-correction) in managed instances continuously monitors performance of your SQL plan execution and automatically fixes the identified performance problems. 

Some features are available only after the [database compatibility level](/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database) is changed to the latest compatibility level (150). 

## Migration assets 

For more assistance, see the following resources that were developed for real-world migration projects.

|Asset  |Description  |
|---------|---------|
|[Data workload assessment model and tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/Data%20Workload%20Assessment%20Model%20and%20Tool)| This tool provides suggested "best fit" target platforms, cloud readiness, and an application/database remediation level for a workload. It offers simple, one-click calculation and report generation that helps to accelerate large estate assessments by providing an automated and uniform decision process for target platforms.|
|[DBLoader utility](https://github.com/microsoft/DataMigrationTeam/tree/master/DBLoader%20Utility)|You can use DBLoader to load data from delimited text files into SQL Server. This Windows console utility uses the SQL Server native client bulk-load interface. The interface works on all versions of SQL Server, along with Azure SQL Managed Instance.|
|[Utility to move on-premises SQL Server logins to Azure SQL Managed Instance](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/MoveLogins)|A PowerShell script can create a T-SQL command script to re-create logins and select database users from on-premises SQL Server to Azure SQL Managed Instance. The tool allows automatic mapping of Windows Server Active Directory accounts to Azure AD accounts, along with optionally migrating SQL Server native logins.|
|[Perfmon data collection automation by using Logman](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/Perfmon%20Data%20Collection%20Automation%20Using%20Logman)|You can use a tool that collects Perfmon data (to help you understand baseline performance) and assists in migration target recommendations. This tool uses logman.exe to create the command that will create, start, stop, and delete performance counters set on a remote SQL Server instance.|
|[Database migration to Azure SQL Managed Instance by restoring full and differential backups](https://github.com/microsoft/DataMigrationTeam/blob/master/Whitepapers/Database%20migrations%20to%20Azure%20SQL%20DB%20Managed%20Instance%20-%20%20Restore%20with%20Full%20and%20Differential%20backups.pdf)|This white paper provides guidance and steps to help accelerate migrations from SQL Server to Azure SQL Managed Instance if you have only full and differential backups (and no log backup capability).|

These resources were developed as part of the Data SQL Ninja Program, which is sponsored by the Azure Data Group engineering team. The core charter of the Data SQL Ninja program is to unblock and accelerate complex modernization and compete data platform migration opportunities to Microsoft's Azure data platform. If you think your organization would be interested in participating in the Data SQL Ninja program, ask your account team to submit a nomination.


## Next steps

- To start migrating your SQL Server databases to Azure SQL Managed Instance, see the [SQL Server to Azure SQL Managed Instance migration guide](sql-server-to-managed-instance-guide.md).

- For a matrix of services and tools that can help you with database and data migration scenarios as well as specialty tasks, see [Services and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Managed Instance, see:
   - [Service tiers in Azure SQL Managed Instance](../../managed-instance/sql-managed-instance-paas-overview.md#service-tiers)
   - [Differences between SQL Server and Azure SQL Managed Instance](../../managed-instance/transact-sql-tsql-differences-sql-server.md)
   - [Azure Total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 

- To learn more about the framework and adoption cycle for cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrated to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 

- To assess the application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit).

- For details on how to perform A/B testing for the data access layer, see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
