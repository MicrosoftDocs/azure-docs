---
title: "SQL Server to SQL Database: Migration overview"
description: Learn about the tools and options available to migrate your SQL Server databases to Azure SQL Database.
ms.service: sql-database
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: mokabiru
ms.author: mokabiru
ms.reviewer: MashaMSFT
ms.date: 11/06/2020
---
# Migration overview: SQL Server to SQL Database
[!INCLUDE[appliesto--sqldb](../../includes/appliesto-sqldb.md)]

Learn about the options and considerations for migrating your SQL Server databases to Azure SQL Database. 

You can migrate SQL Server databases running on-premises or on: 

- SQL Server on Azure Virtual Machines  
- Amazon Web Services (AWS) EC2 
- Amazon Relational Database Service (AWS RDS) 
- Compute Engine in Google Cloud Platform (GCP)  
- Cloud SQL for SQL Server in GCP 

For other scenarios, see the [Database Migration Guide](https://datamigration.microsoft.com/). 

## Overview

[Azure SQL Database](../../database/sql-database-paas-overview.md) is a recommended target option for SQL Server workloads that require a fully managed platform as a service (PaaS). SQL Database handles most database management functions. It also has built-in high availability, intelligent query processing, scalability, and performance capabilities to suit many application types. 

SQL Database provides flexibility with multiple [deployment models](../../database/sql-database-paas-overview.md#deployment-models) and [service tiers](../../database/service-tiers-vcore.md#service-tiers) that cater to different types of applications or workloads.

One of the key benefits of migrating to SQL Database is that you can modernize your application by using the PaaS capabilities. You can then eliminate any dependency on technical components that are scoped at the instance level such as SQL Agent jobs.

You can also save on cost by migrating your SQL Server on-premises licenses to Azure SQL Database by using the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) for SQL Server. This option is available if you choose the [vCore-based purchasing model](../../database/service-tiers-vcore.md).

## Considerations 

The key factors to consider when you're evaluating migration options are: 

- Number of servers and databases
- Size of databases
- Acceptable business downtime during the migration process 

The migration options listed in this guide take these factors into account. For logical data migration to Azure SQL Database, the time to migrate can depend on both the number of objects in a database and the size of the database. 

Tools are available for various workloads and user preferences. Some tools can be used to perform a quick migration of a single database through a UI-based tool. Other tools can migrate multiple databases that can be automated to handle migrations at scale. 

## Choose an appropriate target

Consider general guidelines to help you choose the right deployment model and service tier of Azure SQL Database. You can choose compute and storage resources during deployment and then change them afterward by using the [Azure portal](../../database/scale-resources.md) without incurring downtime for your application.


**Deployment models**: Understand your application workload and the usage pattern to decide between a single database or an elastic pool. 

- A [single database](../../database/single-database-overview.md) represents a fully managed database that's suitable for most modern cloud applications and microservices.
- An [elastic pool](../../database/elastic-pool-overview.md) is a collection of single databases with a shared set of resources, such as CPU or memory. It's suitable for combining databases in a pool with predictable usage patterns that can effectively share the same set of resources.

**Purchasing models**: Choose between the vCore, DTU, or serverless purchasing models. 

- The [vCore model](../../database/service-tiers-vcore.md) lets you choose the number of vCores for Azure SQL Database, so it's the easiest choice when translating from on-premises SQL Server. This is the only option that supports saving on license cost with the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/). 
- The [DTU model](../../database/service-tiers-dtu.md) abstracts the underlying compute, memory, and I/O resources to provide a blended DTU. 
- The [serverless model](../../database/serverless-tier-overview.md) is for workloads that require automatic on-demand scaling with compute resources billed per second of usage. The serverless compute tier automatically pauses databases during inactive periods (where only storage is billed). It automatically resumes databases when activity returns. 

**Service tiers**: Choose between three service tiers designed for different types of applications.

- [General Purpose/standard service tier](../../database/service-tier-general-purpose.md) offers a balanced budget-oriented option with compute and storage suitable to deliver applications in the middle and lower tiers. Redundancy is built in at the storage layer to recover from failures. It's designed for most database workloads. 
- [Business Critical/premium service tier](../../database/service-tier-business-critical.md) is for high-tier applications that require high transaction rates, low-latency I/O, and a high level of resiliency. Secondary replicas are available for failover and to offload read workloads.
- [Hyperscale service tier](../../database/service-tier-hyperscale.md) is for databases that have growing data volumes and need to automatically scale up to 100 TB in database size. It's designed for very large databases. 

> [!IMPORTANT]
> [Transaction log rate is governed](../../database/resource-limits-logical-server.md#transaction-log-rate-governance) in Azure SQL Database to limit high ingestion rates. As such, during migration, you might have to scale target database resources (vCores/DTUs) to ease pressure on CPU or throughput. Choose the appropriately sized target database, but plan to scale resources up for the migration if necessary. 


### SQL Server on Azure Virtual Machines alternative

Your business might have requirements that make [SQL Server on Azure Virtual Machines](../../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md) a more suitable target than Azure SQL Database. 

If the following conditions apply to your business, consider moving to SQL Server on Azure Virtual Machines instead: 

- You require direct access to the operating system or file system, such as to install third-party or custom agents on the same virtual machine with SQL Server. 
- You have strict dependency on features that are still not supported, such as FileStream/FileTable, PolyBase, and cross-instance transactions. 
- You absolutely need to stay at a specific version of SQL Server (2012, for example). 
- Your compute requirements are much lower than a managed instance offers (one vCore, for example), and database consolidation is not an acceptable option. 


## Migration tools 

The tools that we recommend for migration are Data Migration Assistant and Azure Database Migration Service. Alternative migration options are also available. 

### Recommended tools

The following table lists the recommended migration tools: 

|Technology | Description|
|---------|---------|
| [Azure Migrate](/azure/migrate/how-to-create-azure-sql-assessment) | Azure Migrate for Azure SQL helps you to discover and assess your SQL data estate at scale on VMware. It provides Azure SQL deployment recommendations, target sizing, and monthly estimates. | 
|[Data Migration Assistant](/sql/dma/dma-migrateonpremsqltosqldb)|Data Migration Assistant is a desktop tool that provides seamless assessments of SQL Server and single-database migrations to Azure SQL Database (both schema and data). </br></br>The tool can be installed on a server on-premises or on your local machine that has connectivity to your source databases. The migration process is a logical data movement between objects in the source and target databases.|
|[Azure Database Migration Service](../../../dms/tutorial-sql-server-to-azure-sql.md)|An Azure service that can migrate SQL Server databases to Azure SQL Database through the Azure portal or automatically through PowerShell. Database Migration Service requires you to select a preferred Azure virtual network during provisioning to ensure connectivity to your source SQL Server databases. You can migrate single databases or at scale. |
| | |


### Alternative tools

The following table lists alternative migration tools: 

|Technology |Description  |
|---------|---------|
|[Transactional replication](../../database/replication-to-sql-database.md)|Replicate data from source SQL Server database tables to SQL Database by providing a publisher-subscriber type migration option while maintaining transactional consistency. Incremental data changes are propagated to subscribers as they occur on the publishers.|
|[Import Export Service/BACPAC](../../database/database-import.md)|[BACPAC](/sql/relational-databases/data-tier-applications/data-tier-applications#bacpac) is a Windows file with a .bacpac extension that encapsulates a database's schema and data. You can use BACPAC to both export data from a SQL Server source and import the data into Azure SQL Database. A BACPAC file can be imported to a new SQL database through the Azure portal. </br></br> For scale and performance with large databases sizes or a large number of databases, consider using the [SqlPackage](../../database/database-import.md#using-sqlpackage) command-line tool to export and import databases.|
|[Bulk copy](/sql/relational-databases/import-export/import-and-export-bulk-data-by-using-the-bcp-utility-sql-server)|The [bulk copy program (bcp) utility](/sql/tools/bcp-utility) copies data from an instance of SQL Server into a data file. Use the BCP utility to export the data from your source and import the data file into the target SQL database. </br></br> For high-speed bulk copy operations to move data to Azure SQL Database, you can use the [Smart Bulk Copy tool](/samples/azure-samples/smartbulkcopy/smart-bulk-copy/) to maximize transfer speed by taking advantage of parallel copy tasks.|
|[Azure Data Factory](../../../data-factory/connector-azure-sql-database.md)|The [Copy activity](../../../data-factory/copy-activity-overview.md) in Azure Data Factory migrates data from source SQL Server databases to Azure SQL Database by using built-in connectors and an [integration runtime](../../../data-factory/concepts-integration-runtime.md).</br> </br> Data Factory supports a wide range of [connectors](../../../data-factory/connector-overview.md) to move data from SQL Server sources to Azure SQL Database.|
|[SQL Data Sync](../../database/sql-data-sync-data-sql-server-sql-database.md)|SQL Data Sync is a service built on Azure SQL Database that lets you synchronize selected data bidirectionally across multiple databases, both on-premises and in the cloud.</br>Data Sync is useful in cases where data needs to be kept updated across several databases in Azure SQL Database or SQL Server.|
| | |

## Compare migration options

Compare migration options to choose the path that's appropriate to your business needs. 

### Recommended options

The following table compares the recommended migration options: 

|Migration option  |When to use  |Considerations  |
|---------|---------|---------|
|[Data Migration Assistant](/sql/dma/dma-migrateonpremsqltosqldb) | - Migrate single databases (both schema and data).  </br> - Can accommodate downtime during the data migration process. </br> </br> Supported sources: </br> - SQL Server (2005 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM | - Migration activity performs data movement between database objects (from source to target), so we recommend that you run it during off-peak times. </br> - DMA reports the status of migration per database object, including the number of rows migrated.  </br> - For large migrations (number of databases or size of database), use Azure Database Migration Service.|
|[Azure Database Migration Service](../../../dms/tutorial-sql-server-to-azure-sql.md)| - Migrate single databases or at scale. </br> - Can accommodate downtime during the migration process. </br> </br> Supported sources: </br> - SQL Server (2005 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM | - Migrations at scale can be automated via [PowerShell](../../../dms/howto-sql-server-to-azure-sql-powershell.md). </br> - Time to complete migration depends on database size and the number of objects in the database. </br> - Requires the source database to be set as read-only. |
| | | |

### Alternative options

The following table compares the alternative migration options: 

|Method or technology |When to use    |Considerations  |
|---------|---------|---------|
|[Transactional replication](../../database/replication-to-sql-database.md)| - Migrate by continuously publishing changes from source database tables to target SQL Database tables. </br> - Full or partial database migrations of selected tables (subset of database).  </br> </br> Supported sources: </br> - [SQL Server (2016 to 2019) with some limitations](/sql/relational-databases/replication/replication-backward-compatibility) </br> - AWS EC2  </br> - GCP Compute SQL Server VM  | - Setup is relatively complex compared to other migration options.   </br> - Provides a continuous replication option to migrate data (without taking the databases offline).  </br> - Transactional replication has limitations to consider when you're setting up the publisher on the source SQL Server instance. See [Limitations on publishing objects](/sql/relational-databases/replication/publish/publish-data-and-database-objects#limitations-on-publishing-objects) to learn more. </br>- It's possible to [monitor replication activity](/sql/relational-databases/replication/monitor/monitoring-replication).    |
|[Import Export Service/BACPAC](../../database/database-import.md)| - Migrate individual line-of-business application databases. </br>- Suited for smaller databases.  </br>  - Does not require a separate migration service or tool. </br> </br> Supported sources: </br> - SQL Server (2005 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM  |  - Requires downtime because data needs to be exported at the source and imported at the destination.   </br> - The file formats and data types used in the export or import need to be consistent with table schemas to avoid truncation or data-type mismatch errors.  </br> - Time taken to export a database with a large number of objects can be significantly higher.       |
|[Bulk copy](/sql/relational-databases/import-export/import-and-export-bulk-data-by-using-the-bcp-utility-sql-server)| - Migrate full or partial data migrations. </br> - Can accommodate downtime. </br> </br> Supported sources: </br> - SQL Server (2005 to 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM   | - Requires downtime for exporting data from source and importing into target. </br> - The file formats and data types used in the export or import need to be consistent with table schemas. |
|[Azure Data Factory](../../../data-factory/connector-azure-sql-database.md)| - Migrate and/or transform data from source SQL Server databases. </br> - Merging data from multiple sources of data to Azure SQL Database typically for business intelligence (BI) workloads.  |  - Requires creating data movement pipelines in Data Factory to move data from source to destination.   </br> - [Cost](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/) is an important consideration and is based on factors like pipeline triggers, activity runs, and duration of data movement. |
|[SQL Data Sync](../../database/sql-data-sync-data-sql-server-sql-database.md)| - Synchronize data between source and target databases.</br> - Suitable to run continuous sync between Azure SQL Database and on-premises SQL Server in a bidirectional flow. | - Azure SQL Database must be the hub database for sync with an on-premises SQL Server database as a member database.</br> - Compared to transactional replication, SQL Data Sync supports bidirectional data sync between on-premises and Azure SQL Database. </br> - Can have a higher performance impact, depending on the workload.|
| | | |

## Feature interoperability 

There are additional considerations when you're migrating workloads that rely on other SQL Server features.

### SQL Server Integration Services
Migrate SQL Server Integration Services (SSIS) packages to Azure by redeploying the packages to the Azure-SSIS runtime in [Azure Data Factory](../../../data-factory/introduction.md). Azure Data Factory [supports migration of SSIS packages](../../../data-factory/scenario-ssis-migration-overview.md#azure-sql-database-as-database-workload-destination) by providing a runtime built to run SSIS packages in Azure. Alternatively, you can rewrite the SSIS ETL logic natively in Azure Data Factory by using [data flows](../../../data-factory/concepts-data-flow-overview.md).


### SQL Server Reporting Services
Migrate SQL Server Reporting Services (SSRS) reports to paginated reports in Power BI. Use the [RDL Migration Tool](https://github.com/microsoft/RdlMigration) to help prepare and migrate your reports. Microsoft developed this tool to help customers migrate RDL reports from their SSRS servers to Power BI. It's available on GitHub, and it documents an end-to-end walkthrough of the migration scenario. 

### High availability
Manual setup of SQL Server high-availability features like Always On failover cluster instances and Always On availability groups become obsolete on the target Azure SQL Database. High-availability architecture is already built into both [General Purpose (standard availability model)](../../database/high-availability-sla.md#basic-standard-and-general-purpose-service-tier-locally-redundant-availability) and [Business Critical (premium availability model)](../../database/high-availability-sla.md#premium-and-business-critical-service-tier-locally-redundant-availability) SQL Database service tiers. The Business Critical/premium service tier also provides read scale-out that allows connecting into one of the secondary nodes for read-only purposes. 

Beyond the high-availability architecture that's included in SQL Database, the [auto-failover groups](../../database/auto-failover-group-overview.md) feature allows you to manage the replication and failover of databases in a managed instance to another region. 

### SQL Agent jobs
SQL Agent jobs are not directly supported in Azure SQL Database and need to be deployed to [elastic database jobs (preview)](../../database/job-automation-overview.md).

### Logins and groups
Move SQL logins from the SQL Server source to Azure SQL Database by using Database Migration Service in offline mode.  Use the **Selected logins** pane in the Migration Wizard to migrate logins to your target SQL database. 

You can also migrate Windows users and groups via Database Migration Service by enabling the corresponding toggle on the Database Migration Service **Configuration** page. 

Alternatively, you can use the [PowerShell utility](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/MoveLogins) specially designed by the Microsoft Data Migration architects. The utility uses PowerShell to create a Transact-SQL (T-SQL) script to re-create logins and select database users from the source to the target. 

The PowerShell utility automatically maps Windows Active Directory accounts to Azure AD accounts, and can do a UPN lookup for each login against the source Active Directory instance. The utility scripts custom server and database roles, along with role membership and user permissions. Contained databases are not yet supported, and only a subset of possible SQL Server permissions are scripted. 


### System databases
For Azure SQL Database, the only applicable system databases are [master](/sql/relational-databases/databases/master-database) and tempdb. To learn more, see [Tempdb in Azure SQL Database](/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database).

## Advanced features 

Be sure to take advantage of the advanced cloud-based features in SQL Database. For example, you don't need to worry about managing backups because the service does it for you. You can restore to any [point in time within the retention period](../../database/recovery-using-backups.md#point-in-time-restore). 

To strengthen security, consider using [Azure Active Directory authentication](../../database/authentication-aad-overview.md), [auditing](../../database/auditing-overview.md), [threat detection](../../database/azure-defender-for-sql.md), [row-level security](/sql/relational-databases/security/row-level-security), and [dynamic data masking](/sql/relational-databases/security/dynamic-data-masking).

In addition to advanced management and security features, SQL Database provides advanced tools that can help you [monitor and tune your workload](../../database/monitor-tune-overview.md). [Azure SQL Analytics (Preview)](../../../azure-monitor/insights/azure-sql.md) is an advanced solution for monitoring the performance of all of your databases in Azure SQL Database at scale and across multiple subscriptions in a single view. Azure SQL Analytics collects and visualizes key performance metrics with built-in intelligence for performance troubleshooting.

[Automatic tuning](/sql/relational-databases/automatic-tuning/automatic-tuning#automatic-plan-correction) continuously monitors performance of your SQL execution plan and automatically fixes identified performance issues. 


## Migration assets 

For more assistance, see the following resources that were developed for real world migration projects.

|Asset  |Description  |
|---------|---------|
|[Data workload assessment model and tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/Data%20Workload%20Assessment%20Model%20and%20Tool)| This tool provides suggested "best fit" target platforms, cloud readiness, and application/database remediation level for a given workload. It offers simple, one-click calculation and report generation that helps to accelerate large estate assessments by providing an automated and uniform target platform decision process.|
|[DBLoader Utility](https://github.com/microsoft/DataMigrationTeam/tree/master/DBLoader%20Utility)|The DBLoader can be used to load data from delimited text files into SQL Server. This Windows console utility uses the SQL Server native client bulkload interface, which works on all versions of SQL Server, including Azure SQL Database.|
|[Bulk database creation with PowerShell](https://github.com/Microsoft/DataMigrationTeam/tree/master/Bulk%20Database%20Creation%20with%20PowerShell)|This includes a set of three PowerShell scripts that create a resource group (create_rg.ps1), the [logical server in Azure](../../database/logical-servers.md) (create_sqlserver.ps1), and Azure SQL Database (create_sqldb.ps1). The scripts include loop capabilities so you can iterate and create as many servers and databases as necessary.|
|[Bulk schema deployment with MSSQL-Scripter & PowerShell](https://github.com/Microsoft/DataMigrationTeam/tree/master/Bulk%20Schema%20Deployment%20with%20MSSQL-Scripter%20&%20PowerShell)|This asset creates a resource group, one or multiple [logical servers in Azure](../../database/logical-servers.md) to host Azure SQL Database, exports every schema from an on-premises SQL Server (or multiple SQL Servers (2005+) and imports it to Azure SQL Database.|
|[Convert SQL Server Agent jobs into Elastic Database Jobs](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/Convert%20SQL%20Server%20Agent%20Jobs%20into%20Elastic%20Database%20Jobs)|This script migrates your source SQL Server Agent jobs to Elastic Database Jobs.|
|[Send mails from Azure SQL Database](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/AF%20SendMail)|This provides a solution as an alternative to SendMail capability that is available in on-premises SQL Server. The solution uses Azure Functions and the Azure SendGrid service to send emails from Azure SQL Database.|
|[Utility to move on-premises SQL Server logins to Azure SQL Database](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/MoveLogins)|A PowerShell script that creates a T-SQL command script to re-create logins and select database users from on-premises SQL Server to Azure SQL Database. The tool allows automatic mapping of Windows AD accounts to Azure AD accounts as well as optionally migrating SQL Server native logins.|
|[PerfMon data collection automation using Logman](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/Perfmon%20Data%20Collection%20Automation%20Using%20Logman)|A tool that collects PerMon data to understand baseline performance and assists in migration target recommendations. This tool uses logman.exe to create the command that will create, start, stop, and delete performance counters set on a remote SQL Server|
|[Whitepaper - Database migration to Azure SQL DB using BACPAC](https://github.com/microsoft/DataMigrationTeam/blob/master/Whitepapers/Database%20migrations%20-%20Benchmarks%20and%20Steps%20to%20Import%20to%20Azure%20SQL%20DB%20Single%20Database%20from%20BACPAC.pdf)|This whitepaper provides guidance and steps to help accelerate migrations from SQL Server to Azure SQL Database using BACPAC files.|

These resources were developed as part of the Data SQL Ninja Program, which is sponsored by the Azure Data Group engineering team. The core charter of the Data SQL Ninja program is to unblock and accelerate complex modernization and compete data platform migration opportunities to Microsoft's Azure Data platform. If you think your organization would be interested in participating in the Data SQL Ninja program, please contact your account team and ask them to submit a nomination.


## Next steps

To start migrating your SQL Server to Azure SQL Database, see the [SQL Server to SQL Database migration guide](sql-server-to-sql-database-guide.md).

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about SQL Database see:
   - [Overview of Azure SQL Database](../../database/sql-database-paas-overview.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 

- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 


- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).