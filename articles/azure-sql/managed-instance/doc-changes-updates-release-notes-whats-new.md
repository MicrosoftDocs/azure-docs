---
title: What's new? 
titleSuffix: Azure SQL Managed Instance
description: Learn about the new features and documentation improvements for Azure SQL Managed Instance.
services: sql-database
author: MashaMSFT
ms.author: mathoma
ms.service: sql-managed-instance
ms.subservice: service-overview
ms.custom:  references_regions
ms.devlang: 
ms.topic: conceptual
ms.date: 09/21/2021
---
# What's new in Azure SQL Managed Instance?
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqlmi.md)]

This article summarizes the documentation changes associated with new features and improvements in the recent releases of [Azure SQL Managed Instance](https://azure.microsoft.com/updates/?product=sql-database&query=sql%20managed%20instance). To learn more about Azure SQL Managed Instance, see the [overview](sql-managed-instance-paas-overview.md).


For Azure SQL Database, see [What's new](../database/doc-changes-updates-release-notes-whats-new.md).


## Preview

The following table lists the features of Azure SQL Managed Instance that are currently in preview:


| Feature | Details |
| ---| --- |
| [16 TB support for SQL Managed Instance General Purpose](resource-limits.md)| Support for allocation up to 16 TB of space on SQL Managed Instance General Purpose |
| [Azure Active Directory-only authentication for Azure SQL](../database/authentication-azure-ad-only-authentication.md) |  It's now possible to restrict authentication to your Azure SQL Managed Instance to Azure Active Directory users only. |
| [Elastic transactions](../database/elastic-transactions-overview.md) | Elastic transactions let you execute distributed transactions across cloud databases in Azure SQL Database and Azure SQL Managed Instance. |
| [Instance pools](instance-pools-overview.md) | A convenient and cost-efficient way to migrate smaller SQL Server instances to the cloud. |
| [Migration with Log Replay Service](log-replay-service-migrate.md) | Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service. |
| [Maintenance window](../database/maintenance-window.md)| The maintenance window feature allows you to configure maintenance schedule for your Azure SQL Managed Instance. |
| [Long-term backup retention](long-term-backup-retention-configure.md) | Support for Long-term backup retention up to 10 years on Azure SQL Managed Instance. |
| [Service Broker cross-instance message exchange](/sql/database-engine/configure-windows/sql-server-service-broker) | Support for cross-instance message exchange using Service Broker on Azure SQL Managed Instance. |
| [SQL insights](../../azure-monitor/insights/sql-insights-overview.md) | SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. |
| [Transactional Replication](replication-transactional-overview.md) | Replicate the changes from your tables into other databases in SQL Managed Instance, SQL Database, or SQL Server. Or update your tables when some rows are changed in other instances of SQL Managed Instance or SQL Server. For information, see [Configure replication in Azure SQL Managed Instance](replication-between-two-instances-configure-tutorial.md). |
| [Threat detection](threat-detection-configure.md) | Threat detection notifies you of security threats detected to your database. |
| [Query Store hints](/sql/relational-databases/performance/query-store-hints?view=azuresqldb-mi-current&preserve-view=true) | Use query hints to optimize your query execution via the OPTION clause. |
|||

## General availability (GA)

The following table lists the features of Azure SQL Managed Instance that have transitioned from preview to general availability (GA) within the last 12 months: 

| Feature | GA Month | Details |
| ---| --- |--- |
| [Machine Learning Service](machine-learning-services-overview.md) | March 2021 | Machine Learning Services is a feature of Azure SQL Managed Instance that provides in-database machine learning, supporting both Python and R scripts. The feature includes Microsoft Python and R packages for high-performance predictive analytics and machine learning. |
| [Granular permissions for dynamic data masking](../database/dynamic-data-masking-overview.md)| March 2021 | Dynamic data masking helps prevent unauthorized access to sensitive data by enabling customers to designate how much of the sensitive data to reveal with minimal impact on the application layer. It’s a policy-based security feature that hides the sensitive data in the result set of a query over designated database fields, while the data in the database is not changed. It's now possible to assign granular permissions for data that's been dynamically masked. To learn more, see [Dynamic data masking](../database/dynamic-data-masking-overview.md#permissions). |
| [Audit management operations](../database/auditing-overview.md#auditing-of-microsoft-support-operations) |  March 2021 | Azure SQL audit capabilities enable you  you to audit operations done by Microsoft support engineers when they need to access your SQL assets during a support request, enabling more transparency in your workforce. | 
||| 

## Documentation changes

Learn about significant changes to the Azure SQL Managed Instance documentation.


### June 2021

| Changes | Details |
| --- | --- |
|**16 TB support for General Purpose** | Support has been added for allocation of up to 16 TB of space for SQL Managed Instance General Purpose. See [resource limits](resource-limits.md) to learn more. This instance offer is currently in preview. | 
| **Parallel backup** | It's now possible to take backups in parallel for SQL Managed Instance in the general purpose tier, enabling faster backups. See the [Parallel backup for better performance](https://techcommunity.microsoft.com/t5/azure-sql/parallel-backup-for-better-performance-in-sql-managed-instance/ba-p/2421762) blog entry to learn more. |
| **Azure AD-only authentication** | It's now possible to restrict authentication to your Azure SQL Managed Instance to Azure Active Directory users only. This feature is currently in preview. To learn more, see [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md). | 
| **Resource Health monitor** | Use Resource Health to  monitor the health status of your Azure SQL Managed Instance. See [Resource health](../database/resource-health-to-troubleshoot-connectivity.md) to learn more. |
| **Granular permissions for data masking GA** | Granular permissions for dynamic data masking for Azure SQL Managed Instance is now generally available (GA). To learn more, see [Dynamic data masking](../database/dynamic-data-masking-overview.md#permissions). | 
|  | |


### April 2021

| Changes | Details |
| --- | --- |
| **User-defined routes (UDR) tables** | Service-aided subnet configuration for Azure SQL Managed Instance now makes use of service tags for user-defined routes (UDR) tables. See the [connectivity architecture](connectivity-architecture-overview.md) to learn more. |
|  |  |


### March 2021

| Changes | Details |
| --- | --- |
| **Audit management operations** | The ability to audit SQL Managed Instance operations is now generally available (GA). | 
| **Log Replay Service** | It's now possible to migrate databases from SQL Server to Azure SQL Managed Instance using the Log Replay Service. To learn more, see [Migrate with Log Replay Service](log-replay-service-migrate.md). This feature is currently in preview. | 
| **Long-term backup retention** | Support for Long-term backup retention up to 10 years on Azure SQL Managed Instance. To learn more, see [Long-term backup retention](long-term-backup-retention-configure.md)|
| **Machine Learning Services GA** | The Machine Learning Services for Azure SQL Managed Instance are now generally available (GA). To learn more, see [Machine Learning Services for SQL Managed Instance](machine-learning-services-overview.md).| 
| **Maintenance window** | The maintenance window feature allows you to configure a maintenance schedule for your Azure SQL Managed Instance, currently in preview. To learn more, see [maintenance window](/database/maintenance-window.md).|
| **Service Broker message exchange** | The Service Broker component of Azure SQL Managed Instance allows you to compose your applications from independent, self-contained services, by providing native support for reliable and secure message exchange between the databases attached to the service. Currently in preview. To learn more, see [Service Broker](/sql/database-engine/configure-windows/sql-server-service-broker).
| **SQL insights** | SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. To learn more, see [SQL insights](../../azure-monitor/insights/sql-insights-overview.md). | 
||| 

### 2020

The following changes were added to SQL Managed Instance and the documentation in 2020: 

| Changes | Details |
| --- | --- |
| **Audit support operations** | The auditing of Microsoft support operations capability enables you to audit Microsoft support operations when you need to access your servers and/or databases during a support request to your audit logs destination (Preview). To learn more, see [Audit support operations](../database/auditing-overview.md#auditing-of-microsoft-support-operations).|
| **Elastic transactions** | Elastic transactions allow for distributed database transactions spanning multiple databases across Azure SQL Database and Azure SQL Managed Instance. Elastic transactions have been added to enable frictionless migration of existing applications, as well as development of modern multi-tenant applications relying on vertically or horizontally partitioned database architecture (Preview). To learn more, see [Distributed transactions](../database/elastic-transactions-overview.md#transactions-across-multiple-servers-for-azure-sql-managed-instance). | 
| **Configurable backup storage redundancy** | It's now possible to configure Locally redundant storage (LRS) and zone-redundant storage (ZRS) options for backup storage redundancy, providing more flexibility and choice. To learn more, see [Configure backup storage redundancy](../database/automated-backups-overview.md?tabs=managed-instance#configure-backup-storage-redundancy).|
| **TDE-encrypted backup performance improvements** | It's now possible to set the point-in-time restore (PITR) backup retention period, and automated compression of backups encrypted with transparent data encryption (TDE) are now 30 percent more efficient in consuming backup storage space, saving costs for the end user. See [Change PITR](../database/automated-backups-overview.md?tabs=managed-instance#change-the-short-term-retention-policy) to learn more. |
| **Azure AD authentication improvements** | Automate user creation using Azure AD applications and create individual Azure AD guest users (preview). To learn more, see [Directory readers in Azure AD](../database/authentication-aad-directory-readers-role.md)|
| **Global VNet peering support** | Global virtual network peering support has been added to SQL Managed Instance, improving the geo-replication experience. See [geo-replication between managed instances](../database/auto-failover-group-overview.md?tabs=azure-powershell#enabling-geo-replication-between-managed-instances-and-their-vnets). |
| **Hosting SSRS catalog databases** | SQL Managed Instance can now host catalog databases for all supported versions of SQL Server Reporting Services (SSRS). | 
| **Major performance improvements** | Introducing improvements to SQL Managed Instance performance, including improved transaction log write throughput, improved data and log IOPS for business critical instances, and improved TempDB performance. See the [improved performance](https://techcommunity.microsoft.com/t5/azure-sql/announcing-major-performance-improvements-for-azure-sql-database/ba-p/1701256) tech community blog to learn more. 
| **Enhanced management experience** | Using the new [OPERATIONS API](/rest/api/sql/2021-02-01-preview/managed-instance-operations), it's now possible to check the progress of long-running instance operations. To learn more, see [Management operations](management-operations-overview.md?tabs=azure-portal).
| **Machine learning support** | Machine Learning Services with support for R and Python languages now include preview support on Azure SQL Managed Instance (Preview). To learn more, see [Machine learning with SQL Managed Instance](machine-learning-services-overview.md). | 
| **User-initiated failover** | User-initiated failover is now generally available, providing you with the capability to manually initiate an automatic failover using PowerShell, CLI commands, and API calls, improving application resiliency. To learn more, see, [testing resiliency](../database/high-availability-sla.md#testing-application-fault-resiliency). 
|  |  |



## Known issues

The known issues content has moved to a dedicated [known issues in SQL Managed Instance](doc-changes-updates-known-issues.md) article. 


## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).
