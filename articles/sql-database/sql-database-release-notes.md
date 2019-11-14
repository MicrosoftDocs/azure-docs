---
title: Azure SQL Database Release Notes| Microsoft Docs
description: Learn about the new features and improvements in the Azure SQL Database service and in the Azure SQL Database documentation
services: sql-database
author: stevestein
ms.service: sql-database
ms.subservice: service
ms.devlang: 
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: sstein
---
# SQL Database release notes

This article lists SQL Database features that are currently in public preview. For SQL Database updates and improvements, see [SQL Database service updates](https://azure.microsoft.com/updates/?product=sql-database). For updates and improvements to other Azure services, see [Service updates](https://azure.microsoft.com/updates).

## Features in public preview

### [Single database](#tab/single-database)

| Feature | Details |
| ---| --- |
| New Fsv2-series and M-series hardware generations| For information, see [Hardware generations](sql-database-service-tiers-vcore.md#hardware-generations).|
| [Azure private link](https://azure.microsoft.com/updates/private-link-now-available-in-preview/)| Private Link simplifies the network architecture and secures the connection between endpoints in Azure by keeping data on the Azure network, thus eliminating exposure to the internet. Private Link also enables you to create and render your own services on Azure. |
| Accelerated database recovery with single databases and elastic pools | For information, see [Accelerated Database Recovery](sql-database-accelerated-database-recovery.md).|
|Approximate Count Distinct|For information, see [Approximate Count Distinct](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#approximate-query-processing).|
|Batch Mode on Rowstore (under compatibility level 150)|For information, see [Batch Mode on Rowstore](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#batch-mode-on-rowstore).|
| Data discovery & classification  |For information, see [Azure SQL Database and SQL Data Warehouse data discovery & classification](sql-database-data-discovery-and-classification.md).|
| Elastic database jobs | For information, see [Create, configure, and manage elastic jobs](elastic-jobs-overview.md). |
| Elastic queries | For information, see [Elastic query overview](sql-database-elastic-query-overview.md). |
| Elastic transactions | [Distributed transactions across cloud databases](sql-database-elastic-transactions-overview.md). |
|Memory Grant Feedback (Row Mode) (under compatibility level 150)|For information, see [Memory Grant Feedback (Row Mode)](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#row-mode-memory-grant-feedback).|
| Query editor in the Azure portal |For information, see [Use the Azure portal's SQL query editor to connect and query data](sql-database-connect-query-portal.md).|
| R services / machine learning with single databases and elastic pools |For information, see [Machine Learning Services in Azure SQL Database](https://docs.microsoft.com/sql/advanced-analytics/what-s-new-in-sql-server-machine-learning-services?view=sql-server-2017#machine-learning-services-in-azure-sql-database).|
|SQL Analytics|For information, see [Azure SQL Analytics](../azure-monitor/insights/azure-sql.md).|
|Table Variable Deferred Compilation (under compatibility level 150)|For information, see [Table Variable Deferred Compilation](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#table-variable-deferred-compilation).|
| &nbsp; |

### [Managed Instance](#tab/managed-instance)

| Feature | Details |
| ---| --- |
| <a href="/azure/sql-database/sql-database-managed-instance-connectivity-architecture#service-aided-subnet-configuration-public-preview-in-east-us-and-west-us">Service-aided subnet configuration</a> | A secure and convenient way to manage subnet configuration. |
| <a href="/azure/sql-database/sql-database-instance-pools">Instance pools</a> | A convenient and cost-efficient way to migrate smaller SQL instances to the cloud. |
| <a href="https://aka.ms/managed-instance-tde-byok">Transparent data encryption (TDE) with Bring Your Own Key (BYOK)</a> |For information, see [Azure SQL Transparent Data Encryption with customer-managed keys in Azure Key Vault: Bring Your Own Key support](transparent-data-encryption-byok-azure-sql.md).|
| <a href="https://aka.ms/managed-instance-aadlogins">Instance-level Azure AD server principals (logins)</a> | Create server-level logins using <a href="https://docs.microsoft.com/sql/t-sql/statements/create-login-transact-sql?view=azuresqldb-mi-current">CREATE LOGIN FROM EXTERNAL PROVIDER</a> statement. |
| [Transactional Replication](sql-database-managed-instance-transactional-replication.md) | Replicate the changes from your tables into other databases placed on Managed Instances, Single Databases, or SQL Server instances, or update your tables when some rows are changed in other Managed Instances or SQL Server instance. For information, see [Configure replication in an Azure SQL Database managed instance database](replication-with-sql-database-managed-instance.md). |
| Threat detection |For information, see [Configure threat detection in Azure SQL Database managed instance](sql-database-managed-instance-threat-detection.md).|
| Recreate dropped databases with managed instances |For information, see [Re-create dropped databases in Azure SQL Managed Instance](https://medium.com/azure-sqldb-managed-instance/re-create-dropped-databases-in-azure-sql-managed-instance-dc369ed60266).|
| &nbsp; |

---

## New features

### Managed instance H2 2019 updates

- [Auto-failover groups](https://azure.microsoft.com/updates/azure-sql-database-auto-failover-groups-feature-now-available-in-all-regions/) enable you to replicate all databases from the primary instance to a secondary instance in another region.
- Configure your Managed instance behavior with [Global trace flags](https://azure.microsoft.com/updates/global-trace-flags-are-now-available-in-azure-sql-database-managed-instance/).

### Managed instance H1 2019 updates

The following features are enabled in Managed instance deployment model in H1 2019:
  - Support for subscriptions with <a href="https://aka.ms/sql-mi-visual-studio-subscribers"> Azure monthly credit for Visual Studio subscribers </a> and increased [regional limits](sql-database-managed-instance-resource-limits.md#regional-resource-limitations).
  - Support for <a href="https://docs.microsoft.com/sharepoint/administration/deploy-azure-sql-managed-instance-with-sharepoint-servers-2016-2019"> SharePoint 2016 and SharePoint 2019 </a> and <a href="https://docs.microsoft.com/business-applications-release-notes/october18/dynamics365-business-central/support-for-azure-sql-database-managed-instance"> Dynamics 365 Business Central </a>
  - Create instances with <a href="https://aka.ms/managed-instance-collation">server-level collation</a> and <a href="https://azure.microsoft.com/updates/managed-instance-time-zone-ga/">time-zone</a> of your choice.
  - Managed instances are now protected with <a href="sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md">built-in firewall</a>.
  - Configure instances to use [public endpoints](sql-database-managed-instance-public-endpoint-configure.md), [Proxy override](sql-database-connectivity-architecture.md#connection-policy) connection to get better network performance, <a href="https://aka.ms/four-cores-sql-mi-update"> 4 vCores on Gen5 hardware generation</a> or <a href="https://aka.ms/managed-instance-configurable-backup-retention">Configure backup retention up to 35 days</a> for Point-in-time restore. Long-term backup retention (up to 10 years) is still not enabled so you can use <a href="https://docs.microsoft.com/sql/relational-databases/backup-restore/copy-only-backups-sql-server">Copy-only backups</a> as an alternative.
  - New functionalities enable you to <a href="https://medium.com/@jocapc/geo-restore-your-databases-on-azure-sql-instances-1451480e90fa">geo-restore your database to another data center using PowerShell</a>, [rename database](https://azure.microsoft.com/updates/azure-sql-database-managed-instance-database-rename-is-supported/), [delete virtual cluster](sql-database-managed-instance-delete-virtual-cluster.md).
  - New built-in [Instance Contributor role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#sql-managed-instance-contributor) enables separation of duty (SoD) compliance with security principles and compliance with enterprise standards.
  - Managed instance is available in the following Azure Government regions to GA (US Gov Texas, US Gov Arizona) as well as in China North 2 and China East 2. It is also available in the following public regions: Australia Central, Australia Central 2, Brazil South, France South, UAE Central, UAE North, South Africa North, South Africa West.

## Fixed known issues

- **Aug 2019** - Contained databases are fully supported in managed instance.

## Updates

For a list of SQL Database updates and improvements, see [SQL Database service updates](https://azure.microsoft.com/updates/?product=sql-database).

For updates and improvements to all Azure services, see [Service updates](https://azure.microsoft.com/updates).

## Contribute to content

To contribute to the Azure SQL Database documentation, see the [Docs Contributor Guide](https://docs.microsoft.com/contribute/).
