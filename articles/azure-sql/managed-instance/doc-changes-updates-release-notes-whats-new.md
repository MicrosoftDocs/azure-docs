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
ms.date: 04/06/2022
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
| [16 TB support in Business Critical](resource-limits.md#service-tier-characteristics) | Support for allocation up to 16 TB of space on SQL Managed Instance in the Business Critical service tier using the new memory optimized premium-series hardware. | 
| [Data virtualization](data-virtualization-overview.md) | Join locally stored relational data with data queried from external data sources, such as Azure Data Lake Storage Gen2 or Azure Blob Storage. |
|[Endpoint policies](../../azure-sql/managed-instance/service-endpoint-policies-configure.md) | Configure which Azure Storage accounts can be accessed from a SQL Managed Instance subnet. Grants an extra layer of protection against inadvertent or malicious data exfiltration.|
| [Instance pools](instance-pools-overview.md) | A convenient and cost-efficient way to migrate smaller SQL Server instances to the cloud. |
| [Managed Instance link](managed-instance-link-feature-overview.md)| Online replication of SQL Server databases hosted anywhere to Azure SQL Managed Instance. |
| [Maintenance window advance notifications](../database/advance-notifications.md)| Advance notifications (preview) for databases configured to use a non-default [maintenance window](../database/maintenance-window.md). Advance notifications are in preview for Azure SQL Managed Instance. |
| [Memory optimized premium-series hardware](resource-limits.md#service-tier-characteristics) | Deploy your SQL Managed Instance to the new memory optimized premium-series hardware to take advantage of the latest Intel Ice Lake CPUs. Memory optimized hardware offers higher memory to vCore ratio. | 
| [Migrate with Log Replay Service](log-replay-service-migrate.md) | Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service. |
| [Premium-series hardware](resource-limits.md#service-tier-characteristics) | Deploy your SQL Managed Instance to the new premium-series hardware to take advantage of the latest Intel Ice Lake CPUs.  | 
| [Query Store hints](/sql/relational-databases/performance/query-store-hints?view=azuresqldb-mi-current&preserve-view=true) | Use query hints to optimize your query execution via the OPTION clause. |
| [Service Broker cross-instance message exchange](/sql/database-engine/configure-windows/sql-server-service-broker) | Support for cross-instance message exchange using Service Broker on Azure SQL Managed Instance. |
| [SQL insights](../../azure-monitor/insights/sql-insights-overview.md) | SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. |
| [Transactional Replication](replication-transactional-overview.md) | Replicate the changes from your tables into other databases in SQL Managed Instance, SQL Database, or SQL Server. Or update your tables when some rows are changed in other instances of SQL Managed Instance or SQL Server. For information, see [Configure replication in Azure SQL Managed Instance](replication-between-two-instances-configure-tutorial.md). |
| [Threat detection](threat-detection-configure.md) | Threat detection notifies you of security threats detected to your database. |
| [Windows Auth for Azure Active Directory principals](winauth-azuread-overview.md) | Kerberos authentication for Azure Active Directory (Azure AD) enables Windows Authentication access to Azure SQL Managed Instance. |

## General availability (GA)

The following table lists the features of Azure SQL Managed Instance that have transitioned from preview to general availability (GA) within the last 12 months: 

| Feature | GA Month | Details |
| ---| --- |--- |
|[Maintenance window](../database/maintenance-window.md)| March 2022 | The maintenance window feature allows you to configure maintenance schedule for your Azure SQL Managed Instance. [Maintenance window advance notifications](../database/advance-notifications.md), however, are in preview for Azure SQL Managed Instance.|
|[16 TB support in General Purpose](resource-limits.md)| November 2021 |  Support for allocation up to 16 TB of space on SQL Managed Instance in the General Purpose service tier. |
[Azure Active Directory-only authentication](../database/authentication-azure-ad-only-authentication.md) | November 2021 |  It's now possible to restrict authentication to your Azure SQL Managed Instance only to Azure Active Directory users. |
|[Distributed transactions](../database/elastic-transactions-overview.md) | November 2021 | Distributed database transactions for Azure SQL Managed Instance allow you to run distributed transactions that span several databases across instances. | 
|[Linked server - managed identity Azure AD authentication](/sql/relational-databases/system-stored-procedures/sp-addlinkedserver-transact-sql#h-create-sql-managed-instance-linked-server-with-managed-identity-azure-ad-authentication) |November 2021 | Create a linked server with managed identity authentication for your Azure SQL Managed Instance.|
|[Linked server - pass-through Azure AD authentication](/sql/relational-databases/system-stored-procedures/sp-addlinkedserver-transact-sql#i-create-sql-managed-instance-linked-server-with-pass-through-azure-ad-authentication) |November 2021 | Create a linked server with pass-through Azure AD authentication for your Azure SQL Managed Instance. |
|[Long-term backup retention](long-term-backup-retention-configure.md) |November 2021 | Store full backups for a specific database with configured redundancy for up to 10 years in Azure Blob storage, restoring the database as a new database. |
|[Move instance to different subnet](vnet-subnet-move-instance.md)| November 2021 | Move SQL Managed Instance to a different subnet using the Azure portal, Azure PowerShell or the Azure CLI.  |

## Documentation changes

Learn about significant changes to the Azure SQL Managed Instance documentation.

### March 2022

| Changes | Details |
| --- | --- |
| **Data virtualization preview** | It's now possible to query data in external sources such as Azure Data Lake Storage Gen2 or Azure Blob Storage, joining it with locally stored relational data. This feature is currently in preview. To learn more, see [Data virtualization](data-virtualization-overview.md). |  
| **Managed Instance link guidance** | We've published a number of guides for using the [Managed Instance link feature](managed-instance-link-feature-overview.md), including how to [prepare your environment](managed-instance-link-preparation.md), [configure replication by using SSMS](managed-instance-link-use-ssms-to-replicate-database.md), [configure replication via scripts](managed-instance-link-use-scripts-to-replicate-database.md),  [fail over your database by using SSMS](managed-instance-link-use-ssms-to-failover-database.md), [fail over your database via scripts](managed-instance-link-use-scripts-to-failover-database.md) and some [best practices](managed-instance-link-best-practices.md) when using the link feature (currently in preview). |
| **Maintenance window GA, advance notifications preview** | The [maintenance window](../database/maintenance-window.md) feature is now generally available, allowing you to configure a maintenance schedule for your Azure SQL Managed Instance. It's also possible to receive advance notifications for planned maintenance events, which is currently in preview. Review [Maintenance window advance notifications (preview)](../database/advance-notifications.md) to learn more. |
| **Windows Auth for Azure Active Directory principals preview** | Windows Authentication for managed instances empowers customers to move existing services to the cloud while maintaining a seamless user experience, and provides the basis for infrastructure modernization. Learn more in [Windows Authentication for Azure Active Directory principals on Azure SQL Managed Instance](winauth-azuread-overview.md). |



### 2021

| Changes | Details |
| --- | --- |
| **16 TB support for Business Critical preview** | The Business Critical service tier of SQL Managed Instance now provides increased maximum instance storage capacity of up to 16 TB with the new premium-series and memory optimized premium-series hardware, which are currently in preview. See [resource limits](resource-limits.md#service-tier-characteristics) to learn more. |
|**16 TB support for General Purpose GA** | Deploying a 16 TB instance to the General Purpose service tier is now generally available.  See [resource limits](resource-limits.md) to learn more. |
| **Azure AD-only authentication GA** |  Restricting authentication to your Azure SQL Managed Instance only to Azure Active Directory users is now generally available. To learn more, see [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md). |
| **Distributed transactions GA** | The ability to execute distributed transactions across managed instances is now generally available. See  [Distributed transactions](../database/elastic-transactions-overview.md) to learn more. |
|**Endpoint policies preview** | It's now possible to configure an endpoint policy to restrict access from a SQL Managed Instance subnet to an Azure Storage account. This grants an extra layer of protection against inadvertent or malicious data exfiltration. See [Endpoint policies](../../azure-sql/managed-instance/service-endpoint-policies-configure.md) to learn more. |
|**Link feature preview** | Use the link feature for SQL Managed Instance to replicate data from your SQL Server hosted anywhere to Azure SQL Managed Instance, leveraging the benefits of Azure without moving your data to Azure, to offload your workloads, for disaster recovery, or to migrate to the cloud. See the [Link feature for SQL Managed Instance](managed-instance-link-feature-overview.md) to learn more. The link feature is currently in limited public preview. |
|**Long-term backup retention GA** | Storing full backups for a specific database with configured redundancy for up to 10 years in Azure Blob storage is now generally available. To learn more, see [Long-term backup retention](long-term-backup-retention-configure.md). |
| **Move instance to different subnet GA** | It's now possible to move your SQL Managed Instance to a different subnet. See [Move instance to different subnet](vnet-subnet-move-instance.md) to learn more. |
|**New hardware preview** | There are now two new hardware configurations for SQL Managed Instance: premium-series, and a memory optimized premium-series. Both offerings take advantage of a new hardware powered by the latest Intel Ice Lake CPUs, and offer a higher memory to vCore ratio to support your most resource demanding database applications. As part of this announcement, the Gen5 hardware has been renamed to standard-series. The two new premium hardware offerings are currently in preview. See [resource limits](resource-limits.md#service-tier-characteristics) to learn more. |
|**Split what's new** | The previously-combined **What's new** article has been split by product - [What's new in SQL Database](../database/doc-changes-updates-release-notes-whats-new.md) and [What's new in SQL Managed Instance](doc-changes-updates-release-notes-whats-new.md), making it easier to identify what features are currently in preview, generally available, and significant documentation changes. Additionally, the [Known Issues in SQL Managed Instance](doc-changes-updates-known-issues.md) content has moved to its own page. | 
|**16 TB support for General Purpose preview** | Support has been added for allocation of up to 16 TB of space for SQL Managed Instance in the General Purpose service tier. See [resource limits](resource-limits.md) to learn more. This instance offer is currently in preview. | 
| **Parallel backup** | It's now possible to take backups in parallel for SQL Managed Instance in the general purpose tier, enabling faster backups. See the [Parallel backup for better performance](https://techcommunity.microsoft.com/t5/azure-sql/parallel-backup-for-better-performance-in-sql-managed-instance/ba-p/2421762) blog entry to learn more. |
| **Azure AD-only authentication preview** | It's now possible to restrict authentication to your Azure SQL Managed Instance only to Azure Active Directory users. This feature is currently in preview. To learn more, see [Azure AD-only authentication](../database/authentication-azure-ad-only-authentication.md). | 
| **Resource Health monitor** | Use Resource Health to  monitor the health status of your Azure SQL Managed Instance. See [Resource health](../database/resource-health-to-troubleshoot-connectivity.md) to learn more. |
| **Granular permissions for data masking GA** | Granular permissions for dynamic data masking for Azure SQL Managed Instance is now generally available (GA). To learn more, see [Dynamic data masking](../database/dynamic-data-masking-overview.md#permissions). | 
| **User-defined routes (UDR) tables** | Service-aided subnet configuration for Azure SQL Managed Instance now makes use of service tags for user-defined routes (UDR) tables. See the [connectivity architecture](connectivity-architecture-overview.md) to learn more. |
| **Audit management operations** | The ability to audit SQL Managed Instance operations is now generally available (GA). | 
| **Log Replay Service** | It's now possible to migrate databases from SQL Server to Azure SQL Managed Instance using the Log Replay Service. To learn more, see [Migrate with Log Replay Service](log-replay-service-migrate.md). This feature is currently in preview. | 
| **Long-term backup retention** | Support for Long-term backup retention up to 10 years on Azure SQL Managed Instance. To learn more, see [Long-term backup retention](long-term-backup-retention-configure.md)|
| **Machine Learning Services GA** | The Machine Learning Services for Azure SQL Managed Instance are now generally available (GA). To learn more, see [Machine Learning Services for SQL Managed Instance](machine-learning-services-overview.md).| 
| **Maintenance window** | The maintenance window feature allows you to configure a maintenance schedule for your Azure SQL Managed Instance. To learn more, see [maintenance window](../database/maintenance-window.md).|
| **Service Broker message exchange** | The Service Broker component of Azure SQL Managed Instance allows you to compose your applications from independent, self-contained services, by providing native support for reliable and secure message exchange between the databases attached to the service. Currently in preview. To learn more, see [Service Broker](/sql/database-engine/configure-windows/sql-server-service-broker).
| **SQL insights** | SQL insights is a comprehensive solution for monitoring any product in the Azure SQL family. SQL insights uses dynamic management views to expose the data you need to monitor health, diagnose problems, and tune performance. To learn more, see [SQL insights](../../azure-monitor/insights/sql-insights-overview.md). | 


### 2020

The following changes were added to SQL Managed Instance and the documentation in 2020: 

| Changes | Details |
| --- | --- |
| **Audit support operations** | The auditing of Microsoft support operations capability enables you to audit Microsoft support operations when you need to access your servers and/or databases during a support request to your audit logs destination (Preview). To learn more, see [Audit support operations](../database/auditing-overview.md#auditing-of-microsoft-support-operations).|
| **Elastic transactions** | Elastic transactions allow for distributed database transactions spanning multiple databases across Azure SQL Database and Azure SQL Managed Instance. Elastic transactions have been added to enable frictionless migration of existing applications, as well as development of modern multi-tenant applications relying on vertically or horizontally partitioned database architecture (Preview). To learn more, see [Distributed transactions](../database/elastic-transactions-overview.md#transactions-for-sql-managed-instance). | 
| **Configurable backup storage redundancy** | It's now possible to configure Locally redundant storage (LRS) and zone-redundant storage (ZRS) options for backup storage redundancy, providing more flexibility and choice. To learn more, see [Configure backup storage redundancy](../database/automated-backups-overview.md?tabs=managed-instance#configure-backup-storage-redundancy).|
| **TDE-encrypted backup performance improvements** | It's now possible to set the point-in-time restore (PITR) backup retention period, and automated compression of backups encrypted with transparent data encryption (TDE) are now 30 percent more efficient in consuming backup storage space, saving costs for the end user. See [Change PITR](../database/automated-backups-overview.md?tabs=managed-instance#change-the-short-term-retention-policy) to learn more. |
| **Azure AD authentication improvements** | Automate user creation using Azure AD applications and create individual Azure AD guest users (preview). To learn more, see [Directory readers in Azure AD](../database/authentication-aad-directory-readers-role.md)|
| **Global VNet peering support** | Global virtual network peering support has been added to SQL Managed Instance, improving the geo-replication experience. See [geo-replication between managed instances](auto-failover-group-configure-sql-mi.md#enabling-geo-replication-between-managed-instances-and-their-vnets). |
| **Hosting SSRS catalog databases** | SQL Managed Instance can now host catalog databases of SQL Server Reporting Services (SSRS) for versions 2017 and newer. | 
| **Major performance improvements** | Introducing improvements to SQL Managed Instance performance, including improved transaction log write throughput, improved data and log IOPS for business critical instances, and improved TempDB performance. See the [improved performance](https://techcommunity.microsoft.com/t5/azure-sql/announcing-major-performance-improvements-for-azure-sql-database/ba-p/1701256) tech community blog to learn more. 
| **Enhanced management experience** | Using the new [OPERATIONS API](/rest/api/sql/2021-02-01-preview/managed-instance-operations), it's now possible to check the progress of long-running instance operations. To learn more, see [Management operations](management-operations-overview.md?tabs=azure-portal).
| **Machine learning support** | Machine Learning Services with support for R and Python languages now include preview support on Azure SQL Managed Instance (Preview). To learn more, see [Machine learning with SQL Managed Instance](machine-learning-services-overview.md). | 
| **User-initiated failover** | User-initiated failover is now generally available, providing you with the capability to manually initiate an automatic failover using PowerShell, CLI commands, and API calls, improving application resiliency. To learn more, see, [testing resiliency](../database/high-availability-sla.md#testing-application-fault-resiliency). 




## Known issues

The known issues content has moved to a dedicated [known issues in SQL Managed Instance](doc-changes-updates-known-issues.md) article. 


## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).
