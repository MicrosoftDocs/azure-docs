---
title: "SQL Server to SQL Managed Instance - Migration overview"
description: Learn about the different tools and options available to migrate your SQL Server databases to Azure SQL Managed Instance.
ms.service: sql-managed-instance
ms.subservice: migration-guide
ms.custom: 
ms.devlang: 
ms.topic: how-to
author: mokabiru
ms.author: mokabiru
ms.reviewer: MashaMSFT
ms.date: 11/06/2020
---
# Migration overview: SQL Server to SQL Managed Instance
[!INCLUDE[appliesto--sqlmi](../../includes/appliesto-sqlmi.md)]

Learn about different migration options and considerations to migrate your SQL Server to Azure SQL Managed Instance. 

You can migrate SQL Server running on-premises or on: 

- SQL Server on Virtual Machines  
- Amazon Web Services (AWS) EC2 
- Amazon Relational Database Service (AWS RDS) 
- Compute Engine (Google Cloud Platform - GCP)  
- Cloud SQL for SQL Server (Google Cloud Platform – GCP) 

For other scenarios, see the [Database Migration Guide](https://datamigration.microsoft.com/). 

## Overview

[Azure SQL Managed Instance](../../managed-instance/sql-managed-instance-paas-overview.md) is a recommended target option for SQL Server workloads that require a fully managed service without having to manage virtual machines or their operating systems. SQL Managed Instance enables you to lift-and-shift your on-premises applications to Azure with minimal application or database changes while having complete isolation of your instances with native virtual network (VNet) support. 

## Considerations 

The key factors to consider when evaluating migration options depend on: 
- Number of servers and databases
- Size of databases
- Acceptable business downtime during the migration process 

One of the key benefits of migrating your SQL Servers to SQL Managed Instance is that you can choose to migrate the entire instance, or just a subset of individual databases. Carefully plan to include the following in your migration process: 
- All databases that need to be colocated to the same instance 
- Instance-level objects required for your application, including logins, credentials, SQL Agent jobs and operators, and server-level triggers. 

> [!NOTE]
> Azure SQL Managed Instance guarantees 99.99% availability even in critical scenarios, so overhead caused by some features in SQL MI cannot be disabled. For more information, see the [root causes that might cause different performance on SQL Server and Azure SQL Managed Instance](https://azure.microsoft.com/en-us/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/) blog. 


## Choose appropriate target

Some general guidelines to help you choose the right service tier and characteristics of SQL Managed Instance to help match your [performance baseline](sql-server-to-managed-instance-performance-baseline.md): 

- Use the CPU usage baseline to provision a managed instance that matches the number of cores your instance of SQL Server uses. It may be necessary to scale resources to match the [hardware generation characteristics](../../managed-instance/resource-limits.md#hardware-generation-characteristics). 
- Use the memory usage baseline to choose a [vCore option](../../managed-instance/resource-limits.md#service-tier-characteristics) that appropriately matches your memory allocation. 
- Use the baseline IO latency of the file subsystem to choose between General Purpose (latency greater than 5 ms) and Business Critical (latency less than 3 ms) service tiers. 
- Use the baseline throughput to preallocate the size of the data and log files to achieve expected IO performance. 

You can choose compute and storage resources during deployment and then change them after using the [Azure portal](../../database/scale-resources.md) without incurring downtime for your application. 

> [!IMPORTANT]
> Any discrepancy in the [managed instance virtual network requirements](/../../managed-instance/connectivity-architecture-overview.md#network-requirements) can prevent you from creating new instances or using existing ones. Learn more about [creating new](/../../managed-instance/virtual-network-subnet-create-arm-template?branch=release-ignite-arc-data) and [configuring existing](/../../managed-instance/vnet-existing-add-subnet?branch=release-ignite-arc-data) networks. 

### SQL Server VM alternative

Your business may have requirements that make SQL Server on Azure VMs a more suitable target than Azure SQL Managed Instance. 

If the following apply to your business, consider moving to a SQL Server VM instead: 

- If you require direct access to the operating system or file system, such as to install third-party or custom agents on the same virtual machine with SQL Server. 
- If you have strict dependency on features that are still not supported, such as FileStream/FileTable, PolyBase, and cross-instance transactions. 
- If you absolutely need to stay at a specific version of SQL Server (2012, for instance). 
- If your compute requirements are much lower than managed instance offers (one vCore, for instance), and database consolidation is not an acceptable option. 


## Migration tools


The recommended tools for migration are the Data Migration Assistant and the Azure Database Migration Service. There are other alternative migration options available as well. 

### Recommended tools

The following table lists the recommended migration tools: 

|Technology | Description|
|---------|---------|
|[Azure Database Migration Service (DMS)](/azure/dms/tutorial-sql-server-to-managed-instance)  | First party Azure service that supports migration in the offline mode for applications that can afford downtime during the migration process. Unlike the continuous migration in online mode, offline mode migration runs a one-time restore of a full database backup from the source to the target. | 
|[Native backup and restore](../../managed-instance/restore-sample-database-quickstart.md) | SQL Managed Instance supports RESTORE of native SQL Server database backups (.bak files), making it the easiest migration option for customers who can provide full database backups to Azure storage. Full and differential backups are also supported and documented in the [migration assets section](#migration-assets) later in this article.| 
| | |

### Alternative tools

The following table lists alternative migration tools: 

|Technology |Description  |
|---------|---------|
|[Transactional replication](../../managed-instance/replication-transactional-overview.md) | Replicate data from source SQL Server database table(s) to SQL Managed Instance by providing a publisher-subscriber type migration option while maintaining transactional consistency. |  |
|[Bulk copy](/sql/relational-databases/import-export/import-and-export-bulk-data-by-using-the-bcp-utility-sql-server)| The [bulk copy program (bcp) utility](/sql/tools/bcp-utility) copies data from an instance of SQL Server into a data file. Use the BCP utility to export the data from your source and import the data file into the target SQL Managed Instance.</br></br> For high-speed bulk copy operations to move data to Azure SQL Database, [Smart Bulk Copy tool](/samples/azure-samples/smartbulkcopy/smart-bulk-copy/) can be used to maximize transfer speeds by leveraging parallel copy tasks. | 
|[Import Export Wizard / BACPAC](/azure/azure-sql/database/database-import?tabs=azure-powershell)| [BACPAC](/sql/relational-databases/data-tier-applications/data-tier-applications#bacpac) is a Windows file with a `.bacpac` extension that encapsulates a database's schema and data. BACPAC can be used to both export data from a source SQL Server and to import the file back into Azure SQL Managed Instance.  |  
|[Azure Data Factory (ADF)](/azure/data-factory/connector-azure-sql-managed-instance)| The [Copy activity](/azure/data-factory/copy-activity-overview) in Azure Data Factory migrates data from source SQL Server database(s) to SQL Managed Instance using built-in connectors and an [Integration Runtime](/azure/data-factory/concepts-integration-runtime).</br> </br> ADF supports a wide range of [connectors](/azure/data-factory/connector-overview) to move data from SQL Server sources to SQL Managed Instance. |
| | |

## Compare migration options

Compare migration options to choose the path appropriate to your business needs. 

### Recommended options

The following table compares the recommended migration options: 

|Migration option  |When to use  |Considerations  |
|---------|---------|---------|
|[Azure Database Migration Service (DMS)](/azure/dms/tutorial-sql-server-to-managed-instance) | - Migrate single databases or multiple databases at scale. </br> - Can accommodate downtime during migration process. </br> </br> Supported sources: </br> - SQL Server (2005 - 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM |  - Migrations at scale can be automated via [PowerShell](/azure/dms/howto-sql-server-to-azure-sql-mi-powershell). </br> - Time to complete migration is dependent on database size and impacted by backup and restore time. </br> - Sufficient downtime may be required. |
|[Native backup and restore](../../managed-instance/restore-sample-database-quickstart.md) | - Migrate individual line-of-business application database(s).  </br> - Quick and easy migration without a separate migration service or tool.  </br> </br> Supported sources: </br> - SQL Server (2005 - 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM | - Database backup uses multiple threads to optimize data transfer to Azure Blob storage but ISV bandwidth and database size can impact transfer rate. </br> - Downtime should accommodate the time required to perform a full backup and restore (which is a size of data operation).| 
| | | |

### Alternative options

The following table compares the alternative migration options: 

|Method / technology |When to use |Considerations  |
|---------|---------|---------|
|[Transactional replication](../../managed-instance/replication-transactional-overview.md) | - Migrate by continuously publishing changes from source database tables to target SQL Managed Instance database tables. </br> - Full or partial database migrations of selected tables (subset of database).  </br> </br> Supported sources: </br> - SQL Server (2012 - 2019) with some limitations </br> - AWS EC2  </br> - GCP Compute SQL Server VM | </br> - Setup is relatively complex compared to other migration options.   </br> - Provides a continuous replication option to migrate data (without taking the databases offline).</br> - Transactional replication has a number of limitations to consider when setting up the Publisher on the source SQL Server. See [Limitations on Publishing Objects](/sql/relational-databases/replication/publish/publish-data-and-database-objects#limitations-on-publishing-objects) to learn more.  </br> - Capability to [monitor replication activity](/sql/relational-databases/replication/monitor/monitoring-replication) is available.    |
|[Bulk copy](/sql/relational-databases/import-export/import-and-export-bulk-data-by-using-the-bcp-utility-sql-server)| - Migrating full or partial data migrations. </br> - Can accommodate downtime. </br> </br> Supported sources: </br> - SQL Server (2005 - 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM   | - Requires downtime for exporting data from source and importing into target. </br> - The file formats and data types used in the export / import need to be consistent with table schemas. |
|[Import Export Wizard / BACPAC](/azure/azure-sql/database/database-import)| - Migrate individual Line-of-business application database(s). </br>- Suited for smaller databases.  </br>  Does not require a separate migration service or tool. </br> </br> Supported sources: </br> - SQL Server (2005 - 2019) on-premises or Azure VM </br> - AWS EC2 </br> - AWS RDS </br> - GCP Compute SQL Server VM  |   </br> - Requires downtime as data needs to be exported at the source and imported at the destination.   </br> - The file formats and data types used in the export / import need to be consistent with table schemas to avoid truncation / data type mismatch errors. </br> - Time taken to export a database with a large number of objects can be significantly higher. |
|[Azure Data Factory (ADF)](/azure/data-factory/connector-azure-sql-managed-instance)| - Migrating and/or transforming data from source SQL Server database(s).</br> - Merging data from multiple sources of data to Azure SQL Managed Instance typically for Business Intelligence (BI) workloads.   </br> - Requires creating data movement pipelines in ADF to move data from source to destination.   </br> - [Cost](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/) is an important consideration and is based on the pipeline triggers, activity runs, duration of data movement, etc. |
| | | |

## Feature interoperability 

There are additional considerations when migrating workloads that rely on other SQL Server features. 

**SQL Server Integration Services

Migrate SQL Server Integration Services (SSIS) packages and projects in SSISDB to Azure SQL Managed Instance using [Azure Database Migration Service (DMS)](/azure/dms/how-to-migrate-ssis-packages-managed-instance). 

Only SSIS packages in SSISDB starting with SQL Server 2012 are supported for migration. Convert legacy SSIS packages before migration. See the [project conversion tutorial](/sql/integration-services/lesson-6-2-converting-the-project-to-the-project-deployment-model) to learn more. 


#### SQL Server Reporting Services

SQL Server Reporting Services (SSRS) reports can be migrated to paginated reports in Power BI. Use the [RDL Migration Tool](https://github.com/microsoft/RdlMigration) to help prepare, and migrate your reports. This tool was developed by Microsoft to help customers migrate RDL reports from their SSRS servers to Power BI. It is available on GitHub, and it documents an end-to-end walkthrough of the migration scenario. 

#### SQL Server Analysis Services

SQL Server Analysis Services Tabular models from SQL Server 2012 and above can be migrated to Azure Analysis Services, which is a PaaS deployment model for Analysis Services Tabular model in Azure. You can learn more about migrating on-prem models to Azure Analysis Services in this [video tutorial](https://azure.microsoft.com/resources/videos/azure-analysis-services-moving-models/).

Alternatively, you can also consider migrating your on-premises Analysis Services Tabular models to [Power BI Premium using the new XMLA read/write endpoints](https://docs.microsoft.com/power-bi/admin/service-premium-connect-tools). 
> [!NOTE]
> Power BI XMLA read/write endpoints functionality is currently in Public Preview and should not be considered for Production workloads until the functionality becomes Generally Available.

#### High availability

The SQL Server high availability features Always On failover cluster instances and Always On availability groups become obsolete on the target Azure SQL Managed Instance as high availability architecture is already built into both [General Purpose (standard availability model)](../../database/high-availability-sla.md#basic-standard-and-general-purpose-service-tier-locally-redundant-availability) and [Business Critical (premium availability model)](../../database/high-availability-sla.md#premium-and-business-critical-service-tier-locally-redundant-availability) SQL Managed Instance. The premium availability model also provides read scale-out that allows connecting into one of the secondary nodes for read-only purposes.     

Beyond the high availability architecture that is included in SQL Managed Instance, there is also the [auto-failover groups](../../database/auto-failover-group-overview.md) feature that allows you to manage the replication and failover of databases in a managed instance to another region. 

#### SQL Agent jobs

Use the offline Azure Database Migration Service (DMS) option to migrate [SQL Agent jobs](/azure/dms/howto-sql-server-to-azure-sql-mi-powershell#offline-migrations). Otherwise, script the jobs in Transact-SQL (T-SQL) using SQL Server Management Studio and then manually recreate them on the target SQL Managed Instance. 

> [!IMPORTANT]
> Currently, Azure DMS only supports jobs with T-SQL subsystem steps. Jobs with SSIS package steps will have to be manually migrated. 

#### Logins and groups

SQL logins from the source SQL Server can be moved to Azure SQL Managed Instance using Database Migration Service (DMS) in offline mode.  Use the **[Select logins](../../../dms/tutorial-sql-server-to-managed-instance.md#select-logins)** blade in the **Migration Wizard** to migrate logins to your target SQL Managed Instance. 

By default, Azure Database Migration Service only supports migrating SQL logins. However, you can enable the ability to migrate Windows logins by:

Ensuring that the target SQL Managed Instance has AAD read access, which can be configured via the Azure portal by a user with the **Company Administrator** or a **Global Administrator**" role.
Configuring your Azure Database Migration Service instance to enable Windows user/group login migrations, which is set up via the Azure portal, on the Configuration page. After enabling this setting, restart the service for the changes to take effect.

After restarting the service, Windows user/group logins appear in the list of logins available for migration. For any Windows user/group logins you migrate, you are prompted to provide the associated domain name. Service user accounts (account with domain name NT AUTHORITY) and virtual user accounts (account name with domain name NT SERVICE) are not supported.

To learn more, see [how to migrate windows users and groups in a SQL Server instance to Azure SQL Managed Instance using T-SQL](../../managed-instance/migrate-sql-server-users-to-instance-transact-sql-tsql-tutorial.md).

Alternatively, you can use the [PowerShell utility tool](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/MoveLogins) specially designed by the Microsoft Data Migration Architects. The utility uses PowerShell to create a T-SQL script to recreate logins and select database users from the source to the target. The tool automatically maps Windows AD accounts to Azure AD accounts, and can do a UPN lookup for each login against the source Active Directory. The tool scripts custom server and database roles, as well as role membership, database role, and user permissions. Contained databases are not yet supported and only a subset of possible SQL Server permissions are scripted. 

#### Encryption

When migrating databases protected by [Transparent Data Encryption](../../database/transparent-data-encryption-tde-overview.md) to a managed instance using native restore option, [migrate the corresponding certificate](../../managed-instance/tde-certificate-migrate.md) from the source SQL Server to the target SQL Managed Instance *before* database restore. 

#### System databases

Restore of system databases is not supported. To migrate instance-level objects (stored in master or msdb databases), script them using Transact-SQL (T-SQL) and then recreate them on the target managed instance. 

## Leverage advanced features 

Be sure to take advantage of the advanced cloud-based features offered by SQL Managed Instance. For example, you no longer need to worry about managing backups as the service does it for you. You can restore to any [point in time within the retention period](../../database/recovery-using-backups.md#point-in-time-restore). Additionally, you do not need to worry about setting up high availability, as [high availability is built in](../../database/high-availability-sla.md). 

To strengthen security, consider using [Azure Active Directory Authentication](../../database/authentication-aad-overview.md), [auditing](../../managed-instance/auditing-configure.md), [threat detection](../../database/advanced-data-security.md), [row-level security](/sql/relational-databases/security/row-level-security), and [dynamic data masking](/sql/relational-databases/security/dynamic-data-masking).

In addition to advanced management and security features, SQL Managed Instance provides a set of advanced tools that can help you [monitor and tune your workload](../../database/monitor-tune-overview.md). [Azure SQL Analytics](../../../azure-monitor/insights/azure-sql.md) allows you to monitor a large set of managed instances in a centralized manner. [Automatic tuning](/sql/relational-databases/automatic-tuning/automatic-tuning#automatic-plan-correction) in managed instances continuously monitors performance of your SQL plan execution statistics and automatically fixes the identified performance issues. 

Some features are only available once the [database compatibility level](/sql/relational-databases/databases/view-or-change-the-compatibility-level-of-a-database) is changed to the latest compatibility level (150). 

## Migration assets 

For additional assistance, see the following resources that were developed for real world migration projects.

|Asset  |Description  |
|---------|---------|
|[Data workload assessment model and tool](https://github.com/Microsoft/DataMigrationTeam/tree/master/Data%20Workload%20Assessment%20Model%20and%20Tool)| This tool provides suggested "best fit" target platforms, cloud readiness, and application/database remediation level for a given workload. It offers simple, one-click calculation and report generation that helps to accelerate large estate assessments by providing and automated and uniform target platform decision process.|
|[DBLoader Utility](https://github.com/microsoft/DataMigrationTeam/tree/master/DBLoader%20Utility)|The DBLoader can be used to load data from delimited text files into SQL Server. This Windows console utility uses the SQL Server native client bulkload interface, which works on all versions of SQL Server, including Azure SQL MI.|
|[Utility to move On-Premises SQL Server Logins to Azure SQL Managed Instance](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/MoveLogins)|A PowerShell script that creates a T-SQL command script to re-create logins and select database users from on-premises SQL Server to Azure SQL Managed Instance. The tool allows automatic mapping of Windows AD accounts to Azure AD accounts as well as optionally migrating SQL Server native logins.|
|[Perfmon data collection automation using Logman](https://github.com/microsoft/DataMigrationTeam/tree/master/IP%20and%20Scripts/Perfmon%20Data%20Collection%20Automation%20Using%20Logman)|A tool that collects Perform data to understand baseline performance that assists in the migration target recommendation. This tool that uses logman.exe to create the command that will create, start, stop, and delete performance counters set on a remote SQL Server.|
|[Whitepaper - Database migration to Azure SQL Managed Instance by restoring full and differential backups](https://github.com/microsoft/DataMigrationTeam/blob/master/Whitepapers/Database%20migrations%20to%20Azure%20SQL%20DB%20Managed%20Instance%20-%20%20Restore%20with%20Full%20and%20Differential%20backups.pdf)|This whitepaper provides guidance and steps to help accelerate migrations from SQL Server to Azure SQL Managed Instance if you only have full and differential backups (and no log backup capability).|

These resources were developed as part of the Data SQL Ninja Program, which is sponsored by the Azure Data Group engineering team. The core charter of the Data SQL Ninja program is to unblock and accelerate complex modernization and compete data platform migration opportunities to Microsoft's Azure Data platform. If you think your organization would be interested in participating in the Data SQL Ninja program, please contact your account team and ask them to submit a nomination.


## Next steps

To start migrating your SQL Server to Azure SQL Managed Instance, see the [SQL Server to SQL Managed Instance migration guide](sql-server-to-managed-instance-guide.md).

- For a matrix of the Microsoft and third-party services and tools that are available to assist you with various database and data migration scenarios as well as specialty tasks, see [Service and tools for data migration](../../../dms/dms-tools-matrix.md).

- To learn more about Azure SQL Managed Instance see:
   - [Service Tiers in Azure SQL Managed Instance](../../managed-instance/sql-managed-instance-paas-overview.md#service-tiers)
   - [Differences between SQL Server and Azure SQL Managed Instance](../../managed-instance/transact-sql-tsql-differences-sql-server.md)
   - [Azure total Cost of Ownership Calculator](https://azure.microsoft.com/pricing/tco/calculator/) 


- To learn more about the framework and adoption cycle for Cloud migrations, see
   -  [Cloud Adoption Framework for Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/contoso-migration-scale)
   -  [Best practices for costing and sizing workloads migrate to Azure](/azure/cloud-adoption-framework/migrate/azure-best-practices/migrate-best-practices-costs) 


- To assess the Application access layer, see [Data Access Migration Toolkit (Preview)](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit)
- For details on how to perform Data Access Layer A/B testing see [Database Experimentation Assistant](/sql/dea/database-experimentation-assistant-overview).
