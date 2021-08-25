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
ms.date: 06/22/2021
---
# What's new in Azure SQL Managed Instance?
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqlmi.md)]

This article summarizes the documentation changes associated with new features and improvements in the recent releases of [Azure SQL Managed Instance](https://azure.microsoft.com/updates/?product=sql-database&query=sql%20managed%20instance). To learn more about Azure SQL Managed Instance, see the [overview](sql-managed-instance-paas-overview.md).


## Feature availability

The following two sections list the features of Azure SQL Managed Instance that are currently in public preview or in general availability. To provide feedback directly to the product group, see [https://aka.ms/sqlfeedback]. 

### Public preview

The following table lists the features of Azure SQL Managed Instance that are currently in public preview. 


| Feature | Details |
| ---| --- |
| [16 TB support for SQL Managed Instance General Purpose](https://techcommunity.microsoft.com/t5/azure-sql/increased-storage-limit-to-16-tb-for-sql-managed-instance/ba-p/2421443) | Support for allocation up to 16 TB of space on SQL Managed Instance General Purpose |
| [Azure Active Directory only authentication for Azure SQL](https://techcommunity.microsoft.com/t5/azure-sql/azure-active-directory-only-authentication-for-azure-sql/ba-p/2417673) | Public Preview for Azure Active Directory only authentication on Azure SQL Managed Instance. |
| [Elastic transactions](./elastic-transactions-overview.md) | Elastic transactions let you execute distributed transcations across cloud databases in Azure SQL Database and Azure SQL Managed Instance. |
| [Instance pools](../managed-instance/instance-pools-overview.md) | A convenient and cost-efficient way to migrate smaller SQL instances to the cloud. |
| [Migration with Log Replay Service](../managed-instance/log-replay-service-migrate.md) | Migrate databases from SQL Server to SQL Managed Instance by using Log Replay Service. |
| [Maintenance window](./maintenance-window.md)| The maintenance window feature allows you to configure maintenance schedule. |
| [Long-term backup retention](https://azure.microsoft.com/updates/longterm-backup-retention-ltr-for-azure-sql-managed-instance-in-public-preview/) | Support for Long-term backup retention up to 10 years on Azure SQL Managed Instance. |
| [Service Broker cross-instance message exchange](https://azure.microsoft.com/updates/service-broker-message-exchange-for-azure-sql-managed-instance-in-public-preview/) | Support for cross-instance message exchange on Azure SQL Managed Instance. |
| [SQL insights](https://azure.microsoft.com/updates/azure-monitor-sql-insights-for-azure-sql-in-public-preview/) | Azure Monitor SQL insights for Azure SQL Managed Instance in public preview |
| [Transactional Replication](../managed-instance/replication-transactional-overview.md) | Replicate the changes from your tables into other databases in SQL Managed Instance, SQL Database, or SQL Server. Or update your tables when some rows are changed in other instances of SQL Managed Instance or SQL Server. For information, see [Configure replication in Azure SQL Managed Instance](../managed-instance/replication-between-two-instances-configure-tutorial.md). |
| [Threat detection](../managed-instance/threat-detection-configure.md) | Threat detection notifies you of security threats detected to your database. |
| [Query Store hints](/sql/relational-databases/performance/query-store-hints?view=azuresqldb-mi-current&preserve-view=true) | Use query hints to optimize your query execution via the OPTION clause. |
| ---| --- |

### General availability (GA)

The following table lists the features of Azure SQL Managed Instance that have gone from public preview to general availability (GA) within the last 12 months. 

| Feature | GA Month | Details |
| ---| --- |--- |
| AAD service principal |  September 2021 | Azure Active Directory (Azure AD) supports user creation in Azure SQL Database on behalf of Azure AD applications (service principals)| 
| AAD directory readers and guest users  | September 2021  | Guest users in Azure Active Directory (Azure AD) are users that have been imported into the current Azure AD from other Azure Active Directories, or outside of it. | 
| ---| --- | --- | 




## New features

### SQL Managed Instance H1 2021 updates

- [Public Preview for Support 16 TB for SQL Managed Instance General Purpose](https://techcommunity.microsoft.com/t5/azure-sql/increased-storage-limit-to-16-tb-for-sql-managed-instance/ba-p/2421443) - support for allocation of up to 16 TB of space for SQL Managed Instance General Purpose (Public Preview).
- [Parallel backup for better performance in SQL Managed Instance General Purpose](https://techcommunity.microsoft.com/t5/azure-sql/parallel-backup-for-better-performance-in-sql-managed-instance/ba-p/2421762) - support for faster backups for SQL Managed Instance General Purpose.
- [Azure Active Directory only authentication for Azure SQL](https://techcommunity.microsoft.com/t5/azure-sql/azure-active-directory-only-authentication-for-azure-sql/ba-p/2417673) - Public Preview for Azure Active Directory only authentication on Azure SQL Managed Instance.
- [Use Resource Health to monitor health status of your Azure SQL Managed Instance](resource-health-to-troubleshoot-connectivity.md) - support for Resource Health monitoring on Azure SQL Managed Instance.
- [Service-aided subnet configuration for Azure SQL Managed Instance now makes use of service tags for user-defined routes](../managed-instance/connectivity-architecture-overview.md) - support for User defined route (UDR) table.
- [Migrate to Managed Instance with Log Replay Service](../managed-instance/log-replay-service-migrate.md) - allows migrating databases from SQL Server to SQL Managed Instance by using Log Replay Service (Public Preview).
- [Maintenance window](./maintenance-window.md) - the maintenance window feature allows you to configure maintenance schedule, see [Maintenance window announcement](https://techcommunity.microsoft.com/t5/azure-sql/maintenance-window-for-azure-sql-database-and-managed-instance/ba-p/2174835) (Public Preview).
- [Machine Learning Services on Azure SQL Managed Instance now generally available](https://azure.microsoft.com/updates/machine-learning-services-on-azure-sql-managed-instance-now-generally-available/) - General availability for Machine Learning Services on Azure SQL Managed Instance.
- [Service Broker cross-instance message exchange for Azure SQL Managed Instance](https://azure.microsoft.com/updates/service-broker-message-exchange-for-azure-sql-managed-instance-in-public-preview/) - support for cross-instance message exchange.
- [Long-term backup retention for Azure SQL Managed Instance](https://azure.microsoft.com/updates/longterm-backup-retention-ltr-for-azure-sql-managed-instance-in-public-preview/) - Support for Long-term backup retention up to 10 years on Azure SQL Managed Instance.
- [Dynamic data masking granular permissions for Azure SQL Managed Instance](dynamic-data-masking-overview.md) - general availability for Dynamic data masking granular permissions for Azure SQL Managed Instance. 
- [Azure SQL Managed Instance auditing of Microsoft operations](https://azure.microsoft.com/updates/azure-sql-auditing-of-microsoft-operations-is-now-generally-available/) - general availability for Azure SQL Managed Instance auditing of Microsoft operations.
- [Azure Monitor SQL insights for Azure SQL Managed Instance](https://azure.microsoft.com/updates/azure-monitor-sql-insights-for-azure-sql-in-public-preview/) - Azure Monitor SQL insights for Azure SQL Managed Instance in public preview.


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
| --- | --- |

## 2019

The following changes were added to the product and the documentation in 2019: 

| Changes | Details |
| --- | --- |
| **Service-aided subnet configuration** | Using a service-aided subnet configuration is a secure and convenient way to manage subnet configuration where you control data traffic while SQL Managed Instance ensures the uninterrupted flow of management traffic. To learn more, see [service-aided subnet configuration](connectivity-architecture-overview.md#service-aided-subnet-configuration). |
| **Bring your own key (BYOK) to TDE** | It's now possible to bring your own key (BYOK) when encrypting your database with Transparent Data Encryption (TDE) for data protection at rest, and allowing organizations to separate management duties for keys and data. To learn more, see [TDE with customer-managed keys](../database/transparent-data-encryption-byok-overview.md). | 
| **Auto-failover groups** | It's now possible to configure an auto-failover group for your managed instances, allowing you to replicate all databases from a primary instance to a secondary instance in another region. To learn more, see 
| 
| --- | --- |


### SQL Managed Instance H2 2019 updates

- [Service-aided subnet configuration](https://azure.microsoft.com/updates/service-aided-subnet-configuration-for-managed-instance-in-azure-sql-database-available/) is a secure and convenient way to manage subnet configuration where you control data traffic while SQL Managed Instance ensures the uninterrupted flow of management traffic.
- [Transparent Data Encryption (TDE) with Bring Your Own Key (BYOK)](https://azure.microsoft.com/updates/general-avilability-transparent-data-encryption-with-customer-managed-keys-for-azure-sql-database-managed-instance/) enables a bring-your-own-key (BYOK) scenario for data protection at rest and allows organizations to separate management duties for keys and data.
- [Auto-failover groups](https://azure.microsoft.com/updates/azure-sql-database-auto-failover-groups-feature-now-available-in-all-regions/) enable you to replicate all databases from the primary instance to a secondary instance in another region.
- [Global trace flags](https://azure.microsoft.com/updates/global-trace-flags-are-now-available-in-azure-sql-database-managed-instance/) allow you to configure SQL Managed Instance behavior.

### SQL Managed Instance H1 2019 updates

The following features are enabled in the SQL Managed Instance deployment model in H1 2019:
  - Support for subscriptions with <a href="/azure/azure-sql/managed-instance/resource-limits"> Azure monthly credit for Visual Studio subscribers </a> and increased [regional limits](../managed-instance/resource-limits.md#regional-resource-limitations).
  - Support for <a href="/sharepoint/administration/deploy-azure-sql-managed-instance-with-sharepoint-servers-2016-2019"> SharePoint 2016 and SharePoint 2019 </a> and <a href="/business-applications-release-notes/october18/dynamics365-business-central/support-for-azure-sql-database-managed-instance"> Dynamics 365 Business Central. </a>
  - Create a managed instance with <a href="/azure/azure-sql/managed-instance/scripts/create-powershell-azure-resource-manager-template">instance-level collation</a> and a <a href="https://azure.microsoft.com/updates/managed-instance-time-zone-ga/">time zone</a> of your choice.
  - Managed instances are now protected with [built-in firewall](../managed-instance/management-endpoint-verify-built-in-firewall.md).
  - Configure SQL Managed Instance to use [public endpoints](../managed-instance/public-endpoint-configure.md), [Proxy override](connectivity-architecture.md#connection-policy) connection to get better network performance, <a href="https://aka.ms/four-cores-sql-mi-update"> 4 vCores on Gen5 hardware generation</a> or <a href="/azure/azure-sql/database/automated-backups-overview">Configure backup retention up to 35 days</a> for point-in-time restore. [Long-term backup retention](long-term-retention-overview.md) (up to 10 years) is currently in public preview.  
  - New functionalities enable you to <a href="https://medium.com/@jocapc/geo-restore-your-databases-on-azure-sql-instances-1451480e90fa">geo-restore your database to another data center using PowerShell</a>, [rename database](https://azure.microsoft.com/updates/azure-sql-database-managed-instance-database-rename-is-supported/), [delete virtual cluster](../managed-instance/virtual-cluster-delete.md).
  - New built-in [Instance Contributor role](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) enables separation of duty (SoD) compliance with security principles and compliance with enterprise standards.
  - SQL Managed Instance is available in the following Azure Government regions to GA (US Gov Texas, US Gov Arizona) and in China North 2 and China East 2. It is also available in the following public regions: Australia Central, Australia Central 2, Brazil South, France South, UAE Central, UAE North, South Africa North, South Africa West.

## Contribute to content

To contribute to the Azure SQL documentation, see the [Docs contributor guide](/contribute/).
