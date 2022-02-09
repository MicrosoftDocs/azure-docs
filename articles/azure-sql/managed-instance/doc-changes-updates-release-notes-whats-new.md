---
title: What's new?
titleSuffix: Azure SQL Managed Instance
description: Learn about the new features and documentation improvements for Azure SQL Managed Instance.
services: sql-database
author: MashaMSFT
ms.author: mathoma
ms.service: sql-managed-instance
ms.subservice: service-overview
ms.custom: references_regions, ignite-fall-2021
ms.devlang: 
ms.topic: conceptual
ms.date: 01/05/2022
---
# What's new in Azure SQL Managed Instance?
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqlmi.md)]

> [!div class="op_single_selector"]
> * [Azure SQL Database](../database/doc-changes-updates-release-notes-whats-new.md)
> * [Azure SQL Managed Instance](../managed-instance/doc-changes-updates-release-notes-whats-new.md)

This article summarizes the documentation changes associated with new features and improvements in the recent releases of [Azure SQL Managed Instance](https://azure.microsoft.com/updates/?product=sql-database&query=sql%20managed%20instance). To learn more about Azure SQL Managed Instance, see the [overview](sql-managed-instance-paas-overview.md).


## Preview

The following table lists the features of Azure SQL Managed Instance that are currently in preview:

| Feature | Details |
| ---| --- |
| [16 TB support in Business Critical](resource-limits.md#service-tier-characteristics) | Support for allocation up to 16 TB of space on SQL Managed Instance in the Business Critical service tier using the new memory optimized premium-series hardware generation. | 
|[Endpoint policies](../../azure-sql/managed-instance/service-endpoint-policies-configure.md) | Configure which Azure Storage accounts can be accessed from a SQL Managed Instance subnet. Grants an extra layer of protection against inadvertent or malicious data exfiltration.
| [Instance pools](instance-pools-overview.md) | A convenient and cost-efficient way to migrate smaller SQL Server instances to the cloud. |
| [Link feature](link-feature.md)| Online replication of SQL Server databases hosted anywhere to Azure SQL Managed Instance. |
| [Maintenance window](../database/maintenance-window.md)| The maintenance window feature allows you to configure maintenance schedule for your Azure SQL Managed Instance. |
| [Memory optimized premium-series hardware generation](resource-limits.md#service-tier-characteristics) | Deploy your SQL Managed Instance to the new memory optimized premium-series hardware generation to take advantage of the latest Intel Ice Lake CPUs. The memory optimized hardware generation offers higher memory to vCore ratios. | 
| [Migration with Log Replay Service](log-replay-service-migrate.md) | Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service. |
| [Premium-series hardware generation](resource-limits.md#service-tier-characteristics) | Deploy your SQL Managed Instance to the new premium-series hardware generation to take advantage of the latest Intel Ice Lake CPUs.  | 
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
|[16 TB support in General Purpose](resource-limits.md)| November 2021 |  Support for allocation up to 16 TB of space on SQL Managed Instance in the General Purpose service tier. |
[Azure Active Directory-only authentication](../database/authentication-azure-ad-only-authentication.md) | November 2021 |  It's now possible to restrict authentication to your Azure SQL Managed Instance only to Azure Active Directory users. |
| [Distributed transactions](../database/elastic-transactions-overview.md) | November 2021 | Distributed database transactions for Azure SQL Managed Instance allow you to run distributed transactions that span several databases across instances. | 
|[Linked server - managed identity Azure AD authentication](/sql/relational-databases/system-stored-procedures/sp-addlinkedserver-transact-sql#h-create-sql-managed-instance-linked-server-with-managed-identity-azure-ad-authentication) |November 2021 | Create a linked server with managed identity authentication for your Azure SQL Managed Instance.|
|[Linked server - pass-through Azure AD authentication](/sql/relational-databases/system-stored-procedures/sp-addlinkedserver-transact-sql#i-create-sql-managed-instance-linked-server-with-pass-through-azure-ad-authentication) |November 2021 | Create a linked server with pass-through Azure AD authentication for your Azure SQL Managed Instance. |
|[Long-term backup retention](long-term-backup-retention-configure.md) |November 2021 | Store full backups for a specific database with configured redundancy for up to 10 years in Azure Blob storage, restoring the database as a new database. |
|[Move instance to different subnet](vnet-subnet-move-instance.md)| November 2021 | Move SQL Managed Instance to a different subnet using the Azure portal, Azure PowerShell or the Azure CLI.  |
|[Audit management operations](../database/auditing-overview.md#auditing-of-microsoft-support-operations) |  March 2021 | Azure SQL audit capabilities enable you to audit operations done by Microsoft support engineers when they need to access your SQL assets during a support request, enabling more transparency in your workforce. |
|[Granular permissions for dynamic data masking](../database/dynamic-data-masking-overview.md)| March 2021 | Dynamic data masking helps prevent unauthorized access to sensitive data by enabling customers to designate how much of the sensitive data to reveal with minimal impact on the application layer. It's a policy-based security feature that hides the sensitive data in the result set of a query over designated database fields, while the data in the database is not changed. It's now possible to assign granular permissions for data that's been dynamically masked. To learn more, see [Dynamic data masking](../database/dynamic-data-masking-overview.md#permissions). |
|[Machine Learning Service](machine-learning-services-overview.md) | March 2021 | Machine Learning Services is a feature of Azure SQL Managed Instance that provides in-database machine learning, supporting both Python and R scripts. The feature includes Microsoft Python and R packages for high-performance predictive analytics and machine learning. |
||| 

## Documentation changes

Learn about significant changes to the Azure SQL Managed Instance documentation.

### November 2021

| Changes | Details |
| --- | --- |
| **16 TB support for Business Critical preview** | The Business Critical service tier of SQL Managed Instance now provides increased maximum instance storage capacity of up to 16 TB with the new premium-series and memory optimized premium-series hardware generations, which are currently in preview. See [resource limits](resource-limits.md#service-tier-characteristics) to learn more. |
|**16 TB support for General Purpose GA** | Deploying a 16 TB instance to the General Purpose service tier is now generally available.  See [resource limits](resource-limits.md) to learn more. |
| **Azure AD-only authentication GA** |  Restricting authentication to your Azure SQL Managed Instance only to Azure Active Directory users is now generally available. To learn more, see [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md). |
| **Distributed transactions GA** | The ability to execute distributed transactions across managed instances is now generally available. See  [Distributed transactions](../database/elastic-transactions-overview.md) to learn more. |
|**Endpoint policies preview** | It's now possible to configure an endpoint policy to restrict access from a SQL Managed Instance subnet to an Azure Storage account. This grants an extra layer of protection against inadvertent or malicious data exfiltration. See [Endpoint policies](../../azure-sql/managed-instance/service-endpoint-policies-configure.md) to learn more. |
|**Link feature preview** | Use the link feature for SQL Managed Instance to replicate data from your SQL Server hosted anywhere to Azure SQL Managed Instance, leveraging the benefits of Azure without moving your data to Azure, to offload your workloads, for disaster recovery, or to migrate to the cloud. See the [Link feature for SQL Managed Instance](link-feature.md) to learn more. The link feature is currently in limited public preview. |
|**Long-term backup retention GA** | Storing full backups for a specific database with configured redundancy for up to 10 years in Azure Blob storage is now generally available. To learn more, see [Long-term backup retention](long-term-backup-retention-configure.md). |
| **Move instance to different subnet GA** | It's now possible to move your SQL Managed Instance to a different subnet. See [Move instance to different subnet](vnet-subnet-move-instance.md) to learn more. |
|**New hardware generation preview** | There are now two new hardware generations for SQL Managed Instance: premium-series, and a memory optimized premium-series. Both offerings take advantage of a new generation of hardware powered by the latest Intel Ice Lake CPUs, and offer a higher memory to vCore ratio to support your most resource demanding database applications. As part of this announcement, the Gen5 hardware generation has been renamed to standard-series. The two new premium hardware generations are currently in preview. See [resource limits](resource-limits.md#service-tier-characteristics) to learn more. |
| | | 


### October 2021

| Changes | Details |
| --- | --- |
|**Split what's new** | The previously-combined **What's new** article has been split by product - [What's new in SQL Database](../database/doc-changes-updates-release-notes-whats-new.md) and [What's new in SQL Managed Instance](doc-changes-updates-release-notes-whats-new.md), making it easier to identify what features are currently in preview, generally available, and significant documentation changes. Additionally, the [Known Issues in SQL Managed Instance](doc-changes-updates-known-issues.md) content has moved to its own page. | 
|  | | 


### June 2021

| Changes | Details |
| --- | --- |
|**16 TB support for General Purpose preview** | Support has been added for allocation of up to 16 TB of space for SQL Managed Instance in the General Purpose service tier. See [resource limits](resource-limits.md) to learn more. This instance offer is currently in preview. | 
| **Parallel backup** | It's now possible to take backups in parallel for SQL Managed Instance in the general purpose tier, enabling faster backups. See the [Parallel backup for better performance](https://techcommunity.microsoft.com/t5/azure-sql/parallel-backup-for-better-performance-in-sql-managed-instance/ba-p/2421762) blog entry to learn more. |
| **Azure AD-only authentication preview** | It's now possible to restrict authentication to your Azure SQL Managed Instance only to Azure Active Directory users. This feature is currently in preview. To learn more, see [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md). | 
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
| **Maintenance window** | The maintenance window feature allows you to configure a maintenance schedule for your Azure SQL Managed Instance, currently in preview. To learn more, see [maintenance window](../database/maintenance-window.md).|
| **Service Broker message exchange** | The Service Broker component of Azure SQL Managed Instance allows you to compose your applications from independent, self-contained services, by providing native support for reliable and secure message exchange between the databases attached to the service. Currently in preview. To learn more, see [Service Broker](/sql/database-engine/configure-windows/sql-server-service-broker).
| **SQL insights** | SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. To learn more, see [SQL insights](../../azure-monitor/insights/sql-insights-overview.md). | 
||| 

### 2020

The following changes were added to SQL Managed Instance and the documentation in 2020: 

| Changes | Details |
| --- | --- |
| **Audit support operations** | The auditing of Microsoft support operations capability enables you to audit Microsoft support operations when you need to access your servers and/or databases during a support request to your audit logs destination (Preview). To learn more, see [Audit support operations](../database/auditing-overview.md#auditing-of-microsoft-support-operations).|
| **Elastic transactions** | Elastic transactions allow for distributed database transactions spanning multiple databases across Azure SQL Database and Azure SQL Managed Instance. Elastic transactions have been added to enable frictionless migration of existing applications, as well as development of modern multi-tenant applications relying on vertically or horizontally partitioned database architecture (Preview). To learn more, see [Distributed transactions](../database/elastic-transactions-overview.md#transactions-for-sql-managed-instance). | 
| **Configurable backup storage redundancy** | It's now possible to configure Locally redundant storage (LRS) and zone-redundant storage (ZRS) options for backup storage redundancy, providing more flexibility and choice. To learn more, see [Configure backup storage redundancy](../database/automated-backups-overview.md?tabs=managed-instance#configure-backup-storage-redundancy).|
| **TDE-encrypted backup performance improvements** | It's now possible to set the point-in-time restore (PITR) backup retention period, and automated compression of backups encrypted with transparent data encryption (TDE) are now 30 percent more efficient in consuming backup storage space, saving costs for the end user. See [Change PITR](../database/automated-backups-overview.md?tabs=managed-instance#change-the-short-term-retention-policy) to learn more. |
| **Azure AD authentication improvements** | Automate user creation using Azure AD applications and create individual Azure AD guest users (preview). To learn more, see [Directory readers in Azure AD](../database/authentication-aad-directory-readers-role.md)|
| **Global VNet peering support** | Global virtual network peering support has been added to SQL Managed Instance, improving the geo-replication experience. See [geo-replication between managed instances](../database/auto-failover-group-overview.md?tabs=azure-powershell#enabling-geo-replication-between-managed-instances-and-their-vnets). |
| **Hosting SSRS catalog databases** | SQL Managed Instance can now host catalog databases of SQL Server Reporting Services (SSRS) for versions 2017 and newer. | 
| **Major performance improvements** | Introducing improvements to SQL Managed Instance performance, including improved transaction log write throughput, improved data and log IOPS for business critical instances, and improved TempDB performance. See the [improved performance](https://techcommunity.microsoft.com/t5/azure-sql/announcing-major-performance-improvements-for-azure-sql-database/ba-p/1701256) tech community blog to learn more. 
| **Enhanced management experience** | Using the new [OPERATIONS API](/rest/api/sql/2021-02-01-preview/managed-instance-operations), it's now possible to check the progress of long-running instance operations. To learn more, see [Management operations](management-operations-overview.md?tabs=azure-portal).
| **Machine learning support** | Machine Learning Services with support for R and Python languages now include preview support on Azure SQL Managed Instance (Preview). To learn more, see [Machine learning with SQL Managed Instance](machine-learning-services-overview.md). | 
| **User-initiated failover** | User-initiated failover is now generally available, providing you with the capability to manually initiate an automatic failover using PowerShell, CLI commands, and API calls, improving application resiliency. To learn more, see, [testing resiliency](../database/high-availability-sla.md#testing-application-fault-resiliency). 
|  |  |



## Known issues

The known issues content has moved to a dedicated [known issues in SQL Managed Instance](doc-changes-updates-known-issues.md) article. 


## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).
