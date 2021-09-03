---
title: What's new? 
titleSuffix: Azure SQL Managed Instance
description: Learn about the new features and documentation improvements for Azure SQL Managed Instance.
services: sql-database
author: MashaMSFT
ms.author: mathoma
ms.service: sql-db-mi
ms.subservice: service-overview
ms.custom: sqldbrb=2, references_regions
ms.devlang: 
ms.topic: conceptual
ms.date: 09/01/2021
---
# What's new in Azure SQL Managed Instance?
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqlmi.md)]

This article summarizes the documentation changes associated with new features and improvements in the recent releases of [Azure SQL Managed Instance](https://azure.microsoft.com/updates/?product=sql-database&query=sql%20managed%20instance). To learn more about Azure SQL Managed Instance, see the [overview](sql-managed-instance-paas-overview.md).


For Azure SQL Database, see [What's new](../database/doc-changes-updates-release-notes-whats-new.md).

## Feature availability

The following two sections list the features of Azure SQL Managed Instance that are currently in public preview or in general availability. To provide feedback directly to the product group, see [https://aka.ms/sqlfeedback]. 

### Public preview

The following table lists the features of Azure SQL Managed Instance that are currently in public preview. 


| Feature | Details |
| ---| --- |
| [16 TB support for SQL Managed Instance General Purpose](resource-limits.md)| Support for allocation up to 16 TB of space on SQL Managed Instance General Purpose |
| [Azure Active Directory-only authentication for Azure SQL](../database/authentication-azure-ad-only-authentication.md) |  It's now possible to restrict authentication to your Azure SQL Managed Instance to Azure Active Directory users only. |
| [Elastic transactions](../database/elastic-transactions-overview.md) | Elastic transactions let you execute distributed transactions across cloud databases in Azure SQL Database and Azure SQL Managed Instance. |
| [Instance pools](instance-pools-overview.md) | A convenient and cost-efficient way to migrate smaller SQL Server instances to the cloud. |
| [Migration with Log Replay Service](log-replay-service-migrate.md) | Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service. |
| [Maintenance window](../database/maintenance-window.md)| The maintenance window feature allows you to configure maintenance schedule. |
| [Long-term backup retention](long-term-backup-retention-configure.md) | Support for Long-term backup retention up to 10 years on Azure SQL Managed Instance. |
| [Service Broker cross-instance message exchange](/sql/database-engine/configure-windows/sql-server-service-broker?view=sql-server-ver15) | Support for cross-instance message exchange using Service Broker on Azure SQL Managed Instance. |
| [SQL insights](../../azure-monitor/insights/sql-insights-overview.md) | SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. |
| [Transactional Replication](replication-transactional-overview.md) | Replicate the changes from your tables into other databases in SQL Managed Instance, SQL Database, or SQL Server. Or update your tables when some rows are changed in other instances of SQL Managed Instance or SQL Server. For information, see [Configure replication in Azure SQL Managed Instance](replication-between-two-instances-configure-tutorial.md). |
| [Threat detection](threat-detection-configure.md) | Threat detection notifies you of security threats detected to your database. |
| [Query Store hints](/sql/relational-databases/performance/query-store-hints?view=azuresqldb-mi-current&preserve-view=true) | Use query hints to optimize your query execution via the OPTION clause. |
|||

### General availability (GA)

The following table lists the features of Azure SQL Managed Instance that have gone from public preview to general availability (GA) within the last 12 months. 

| Feature | GA Month | Details |
| ---| --- |--- |
| [AAD service principal](../database/authentication-aad-service-principal.md) |  September 2021 | Azure Active Directory (Azure AD) supports user creation in Azure SQL Managed Instance on behalf of Azure AD applications (service principals). | 
| [AAD directory readers and guest users](../database/authentication-aad-guest-users.md)  | September 2021  | Guest users in Azure Active Directory (Azure AD) are users that have been imported into the current Azure AD from other Azure Active Directories, or outside of it. | 
| [Machine Learning Service](machine-learning-services-overview.md) | March 2021 | Machine Learning Services is a feature of Azure SQL Managed Instance that provides in-database machine learning, supporting both Python and R scripts. The feature includes Microsoft Python and R packages for high-performance predictive analytics and machine learning. |
| [Granular permissions for dynamic data masking](../database/dynamic-data-masking-overview.md)| March 2021 | Dynamic data masking helps prevent unauthorized access to sensitive data by enabling customers to designate how much of the sensitive data to reveal with minimal impact on the application layer. It’s a policy-based security feature that hides the sensitive data in the result set of a query over designated database fields, while the data in the database is not changed. It's now possible to assign granular permissions for data that's been dynamically masked. To learn more, see [Dynamic data masking](../database/dynamic-data-masking-overview.md#permissions). |
| [Audit management operations](../database/auditing-overview.md#auditing-of-microsoft-support-operations) |  March 2021 | Azure SQL audit capabilities enable you  you to audit operations done by Microsoft support engineers when they need to access your SQL assets during a support request, enabling more transparency in your workforce. | 
||| 

## July 2021

| Changes | Details |
| --- | --- |
| **Maintenance window** | The maintenance window feature allows you to configure a maintenance schedule for your Azure SQL Managed Instance, currently in Public Preview. To learn more, see [maintenance window](/database/maintenance-window.md).|
||| 

## June 2021

| Changes | Details |
| --- | --- |
|**16 TB support for General Purpose** | Support has been added for allocation of up to 16 TB of space for SQL Managed Instance General Purpose (Public Preview). See [resource limits](resource-limits.md) to learn more. | 
| **Parallel backup** | It's now possible to take backups in parallel for SQL Managed Instance in the general purpose tier, enabling faster backups. See the [Parallel backup for better performance](https://techcommunity.microsoft.com/t5/azure-sql/parallel-backup-for-better-performance-in-sql-managed-instance/ba-p/2421762) blog entry to learn more. |
| **Azure AD-only authentication** | It's now possible to restrict authentication to your Azure SQL Managed Instance to Azure Active Directory users only. This feature is currently in public preview. To learn more, see [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md). | 
| **Resource Health monitor** | Use Resource Health to  monitor the health status of your Azure SQL Managed Instance. See [Resource health](../database/resource-health-to-troubleshoot-connectivity.md) to learn more. |
| **Granular permissions for data masking GA** | Granular permissions for dynamic data masking for Azure SQL Managed Instance is now generally available (GA). To learn more, see [Dynamic data masking](../database/dynamic-data-masking-overview.md#permissions). | 
|  | |


## April 2021

| Changes | Details |
| --- | --- |
| **User-defined routes (UDR) tables** | Service-aided subnet configuration for Azure SQL Managed Instance now makes use of service tags for user-defined routes (UDR) tables. See the [connectivity architecture](connectivity-architecture-overview.md) to learn more. |
|  |  |


## March 2021

| Changes | Details |
| --- | --- |
| **Log Replay Service** | It's now possible to migrate databases from SQL Server to Azure SQL Managed Instance using the Log Replay Service. To learn more, see [Migrate with Log Replay Service](log-replay-service-migrate.md). Currently in Public Preview. | 
| **Machine Learning Services GA** | The Machine Learning Services for Azure SQL Managed Instance are now generally available (GA). To learn more, see [Machine Learning Services for SQL Managed Instance](machine-learning-services-overview.md).| 
| **Service Broker message exchange** | The Service Broker component of Azure SQL Managed Instance allows you to compose your applications from independent, self-contained services, by providing native support for reliable and secure message exchange between the databases attached to the service. Currently in Public Preview. To learn more, see [Service Broker](/sql/database-engine/configure-windows/sql-server-service-broker).
| **Long-term backup retention** | Support for Long-term backup retention up to 10 years on Azure SQL Managed Instance. To learn more, see [Long-term backup retention](long-term-backup-retention-configure.md)|
| **Audit management operations** | The ability to audit SQL Managed Instance operations is now generally available (GA). | 
| **SQL insights** | SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. To learn more, see [SQL insights](../../azure-monitor/insights/sql-insights-overview.md). | 
||| 

## 2020

The following changes were added to SQL Managed Instance and the documentation in 2020: 

| Changes | Details |
| --- | --- |
| **Audit support operations** | The auditing of Microsoft support operations capability enables you to audit Microsoft support operations when you need to access your servers and/or databases during a support request to your audit logs destination (Public Preview). To learn more, see [Audit support operations](../database/auditing-overview.md#auditing-of-microsoft-support-operations).|
| **Elastic transactions** | Elastic transactions allow for distributed database transactions spanning multiple databases across Azure SQL Database and Azure SQL Managed Instance. Elastic transactions have been added to enable frictionless migration of existing applications, as well as development of modern multi-tenant applications relying on vertically or horizontally partitioned database architecture (Public Preview). To learn more, see [Distributed transactions](../database/elastic-transactions-overview.md#transactions-across-multiple-servers-for-azure-sql-managed-instance). | 
| **Configurable backup storage redundancy** | It's now possible to configure Locally redundant storage (LRS) and zone-redundant storage (ZRS) options for backup storage redundancy, providing more flexibility and choice. To learn more, see [Configure backup storage redundancy](../database/automated-backups-overview.md?tabs=managed-instance#configure-backup-storage-redundancy).|
| **TDE-encrypted backup performance improvements** | It's now possible to set the point-in-time restore (PITR) backup retention period, and automated compression of backups encrypted with transparent data encryption (TDE) are now 30 percent more efficient in consuming backup storage space, saving costs for the end user. See [Change PITR](../database/automated-backups-overview.md?tabs=managed-instance#change-the-pitr-backup-retention-period) to learn more. |
| **Azure AD authentication improvements** | Automate user creation using Azure AD applications and create individual Azure AD guest users (Public preview). To learn more, see [Directory readers in Azure AD](../database/authentication-aad-directory-readers-role.md)|
| **Global VNet peering support** | Global virtual network peering support has been added to SQL Managed Instance, improving the geo-replication experience. See [geo-replication between managed instances](../database/auto-failover-group-overview.md?tabs=azure-powershell#enabling-geo-replication-between-managed-instances-and-their-vnets). |
| **Hosting SSRS catalog databases** | SQL Managed Instance can now host catalog databases for all supported versions of SQL Server Reporting Services (SSRS). | 
| **Major performance improvements** | Introducing improvements to SQL Managed Instance performance, including improved transaction log write throughput, improved data and log IOPS for business critical instances, and improved TempDB performance. See the [improved performance](https://techcommunity.microsoft.com/t5/azure-sql/announcing-major-performance-improvements-for-azure-sql-database/ba-p/1701256) tech community blog to learn more. 
| **Enhanced management experience** | Using the new [OPERATIONS API](/rest/api/sql/2021-02-01-preview/managed-instance-operations), it's now possible to check the progress of long-running instance operations. To learn more, see [Management operations](management-operations-overview.md?tabs=azure-portal).
| **Machine learning support** | Machine Learning Services with support for R and Python languages now include preview support on Azure SQL Managed Instance (Public Preview). To learn more, see [Machine learning with SQL Managed Instance](machine-learning-services-overview.md). | 
| **User-initiated failover** | User-initiated failover is now generally available, providing you with the capability to manually initiate an automatic failover using PowerShell, CLI commands, and API calls, improving application resiliency. To learn more, see, [testing resiliency](../database/high-availability-sla.md#testing-application-fault-resiliency). 
|  |  |

## 2019

The following changes were added to the product and the documentation in 2019: 

| Changes | Details |
| --- | --- |
| **Service-aided subnet configuration** | Using a service-aided subnet configuration is a secure and convenient way to manage subnet configuration where you control data traffic while SQL Managed Instance ensures the uninterrupted flow of management traffic. To learn more, see [service-aided subnet configuration](connectivity-architecture-overview.md#service-aided-subnet-configuration). |
| **Bring your own key (BYOK) to TDE** | It's now possible to bring your own key (BYOK) when encrypting your database with Transparent Data Encryption (TDE) for data protection at rest, allowing organizations to separate management duties for keys and data. To learn more, see [TDE with customer-managed keys](../database/transparent-data-encryption-byok-overview.md). | 
| **Auto-failover groups** | It's now possible to configure an auto-failover group for your managed instances, allowing you to replicate all databases from a primary instance to a secondary instance in another region. To learn more, see [auto-failover groups](../database/auto-failover-group-overview.md).|
| **Global trace flags** | It's now possible to enable global trace flags to configure SQL Managed Instance behavior. To learn more, see [Trace flags](/sql/t-sql/database-console-commands/dbcc-traceon-trace-flags-transact-sql).|
| **Subscriptions with resource limits** | Support for subscriptions with [resource limits](resource-limits.md) Azure monthly credit for Visual Studio subscribers and increased [regional limits](resource-limits.md#regional-resource-limitations).
| **Sharepoint support** | Support has been added for deploying your managed instance with Sharepoint 2016 and Sharepoint 2019. To learn more, see [SQL Managed Instance and Sharepoint](/sharepoint/administration/deploy-azure-sql-managed-instance-with-sharepoint-servers-2016-2019).
| **Dynamics 365 Business Central support** | Support has been added for deploying your managed instance with Dynamics 365 Business Central. To learn more, see [SQL Managed Instance and Dynamics 365 Business central](/business-applications-release-notes/october18/dynamics365-business-central/support-for-azure-sql-database-managed-instance). |
| **Instance level collation & time zone** | It's now possible to create a managed instance with <a href="/azure/azure-sql/managed-instance/scripts/create-powershell-azure-resource-manager-template">instance-level collation</a> and a <a href="https://azure.microsoft.com/updates/managed-instance-time-zone-ga/">time zone</a> of your choice.|
| **Built-in firewall** | You can now protect your SQL Managed Instance with a [built-in firewall](management-endpoint-verify-built-in-firewall.md).|
| **Public endpoint & proxy override** | Configure SQL Managed Instance to use [public endpoints](public-endpoint-configure.md), [Proxy override](../database/connectivity-architecture.md#connection-policy) connection to get better network performance. |
| **Backup improvements** | <a href="/azure/azure-sql/database/automated-backups-overview">Configure backup retention up to 35 days</a> for point-in-time restore. [Long-term backup retention](../database/long-term-retention-overview.md) (up to 10 years) is currently in public preview.  | 
| **Geo-restore** | It's now possible to restore your database to a new region. To learn more, see [geo-restore](../database/recovery-using-backups.md#geo-restore) |
| **Database rename** | It's now possible to rename your database for your SQL Managed Instance. To learn more, see [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-mi-current&preserve-view=true) and [sp_rename](/sql/relational-databases/system-stored-procedures/sp-rename-transact-sql).|
| **Delete virtual cluster** | It's now possible to delete your virtual cluster. To learn more, see [delete virtual cluster](virtual-cluster-delete.md). | 
| **Instance Contributor role** |  New built-in [Instance Contributor role](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) enables separation of duty (SoD) compliance with security principles and compliance with enterprise standards.|
| **Government cloud support** | SQL Managed Instance is available in the following Azure Government regions to GA (US Gov Texas, US Gov Arizona) and in China North 2 and China East 2. It is also available in the following public regions: Australia Central, Australia Central 2, Brazil South, France South, UAE Central, UAE North, South Africa North, South Africa West.| 
|  |  |


## Known issues

The known issues content has moved to a dedicated [known issues in SQL Managed Instance](doc-changes-updates-known-issues.md) article. 


## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).
