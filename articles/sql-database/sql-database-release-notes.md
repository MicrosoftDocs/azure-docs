---
title: Azure SQL Database Release Notes| Microsoft Docs
description: Learn about the new features and improvements in the Azure SQL Database service and in the Azure SQL Database documentation
services: sql-database
author: CarlRabeler
manager: craigg
ms.service: sql-database
ms.subservice: service
ms.devlang: 
ms.topic: conceptual
ms.date: 04/10/2019
ms.author: carlrab
---
# SQL Database release notes

This article lists the new features and improvements in the SQL Database service and in the SQL Database documentation. For SQL Database service improvements, see also [SQL Database service updates](https://azure.microsoft.com/updates/?product=sql-database). For improvements to other Azure services, see [Service updates](https://azure.microsoft.com/updates).

## Features in public preview

| Feature | Details |
| ---| --- |
| Elastic database jobs | For information, see [Create, configure, and manage elastic jobs](elastic-jobs-overview.md) |
| Elastic transactions | [Distributed transactions across cloud databases](sql-database-elastic-transactions-overview.md) |
| Elastic queries | For information, see [Elastic query overview](sql-database-elastic-query-overview.md) |
| Replication with managed instances |For information, see [Configure replication in an Azure SQL Database managed instance database](replication-with-sql-database-managed-instance.md)|
| Instance collation with managed instances |For information, see [Use PowerShell with Azure Resource Manager template to create a managed instance in Azure SQL Database](./scripts/sql-managed-instance-create-powershell-azure-resource-manager-template.md)|
| R services / machine learning with single databases and elastic pools |For information, see [Machine Learning Services in Azure SQL Database](https://docs.microsoft.com/sql/advanced-analytics/what-s-new-in-sql-server-machine-learning-services?view=sql-server-2017#machine-learning-services-in-azure-sql-database)|
| Accelerated database recovery with single databases and elastic pools | For information, see [Accelerated Database Recovery](sql-database-accelerated-database-recovery.md)|
| Data discovery & classification  |For information, see [Azure SQL Database and SQL Data Warehouse data discovery & classification](sql-database-data-discovery-and-classification.md)|
| Transparent data encryption (TDE) with Bring Your Own Key (BYOK) with managed instances |For information, see [Azure SQL Transparent Data Encryption with customer-managed keys in Azure Key Vault: Bring Your Own Key support](transparent-data-encryption-byok-azure-sql.md)|
| Recreate dropped databases with managed instances |For information, see [Re-create dropped databases in Azure SQL Managed Instance](https://medium.com/azure-sqldb-managed-instance/re-create-dropped-databases-in-azure-sql-managed-instance-dc369ed60266)|
| Threat detection with managed instances |For information, see [Configure threat detection in Azure SQL Database managed instance](sql-database-managed-instance-threat-detection.md)|
| Hyperscale service tiers with single databases |For information, see [Hyperscale service tier for up to 100 TB](sql-database-service-tier-hyperscale.md)|
| Query editor in the Azure portal |For information, see [Use the Azure portal's SQL query editor to connect and query data](sql-database-connect-query-portal.md)|
|Approximate Count Distinct|For information, see [Approximate Count Distinct](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#approximate-query-processing)|
|Batch Mode on Rowstore (under compatibility level 150)|For information, see [Batch Mode on Rowstore](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#batch-mode-on-rowstore)|
|Memory Grant Feedback (Row Mode) (under compatibility level 150)|For information, see [Memory Grant Feedback (Row Mode)](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#row-mode-memory-grant-feedback)|
|Table Variable Deferred Compilation (under compatibility level 150)|For information, see [Table Variable Deferred Compilation](https://docs.microsoft.com/sql/relational-databases/performance/intelligent-query-processing#table-variable-deferred-compilation)|
|SQL Analytics|For information, see [Azure SQL Analytics](../azure-monitor/insights/azure-sql.md)|
| Time zone support for managed instances|For more information, see [Time Zone in Azure SQL Database Managed Instance](sql-database-managed-instance-timezone.md)|
|||

## March 2019

### Service improvements

| Service improvements | Details |
| --- | --- |
| General availability: Read scale-out support for Azure SQL Database | For more information, see [Read scale-out](sql-database-read-scale-out.md)|
| &nbsp; |

### Documentation improvements

| Documentation improvements | Details |
| --- | --- |
| Time zone support for managed instances|For more information, see [Time Zone in Azure SQL Database Managed Instance](sql-database-managed-instance-timezone.md)|
| Added log limits for single databases|For more information, see [Single database vCore resource limits](sql-database-vcore-resource-limits-single-databases.md).|
| Added log limits for elastic pools and pooled databases|For more information, see [Elastic pools vCore resource limits](sql-database-vcore-resource-limits-elastic-pools.md).|
| Added Transaction log rate governance| Added new content for [Transaction log rate governance](sql-database-resource-limits-database-server.md#transaction-log-rate-governance).|
| Updated PowerShell samples for single databases and elastic pools to use az.sql module | For more information, see [PowerShell samples for single databases and elastic pools](sql-database-powershell-samples.md#single-database-and-elastic-pools).|
| &nbsp; |

## February 2019

### Service improvements

| Service improvements | Details |
| --- | --- |
|Creating a resumable online index is now generally available| For more information, see [Create Index](https://docs.microsoft.com/sql/t-sql/statements/create-index-transact-sql).|
|Managed instance support for route tables improved| For more information, see [Network requirements](sql-database-managed-instance-connectivity-architecture.md#network-requirements).|
|Database rename supported in managed instance | For more details, see the [ALTER DATABASE](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql?view=azuresqldb-mi-current) and [sp_rename](https://docs.microsoft.com/sql/relational-databases/system-stored-procedures/sp-rename-transact-sql) syntax.|
|SQL Database as a source of reference data for Stream Analytics. | For more information, see [Stream Analytics](https://azure.microsoft.com/services/stream-analytics/).|
|Data Migration Assistance adds support for managed instance. |For more information, see [What's new in DMA](https://docs.microsoft.com/sql/dma/dma-whatsnew).|
|SQL Server Migration Assistant adds support for target readiness assessment for managed instance. | For more information, see [SQL Server Migration Assistant](https://docs.microsoft.com/sql/ssma/sql-server-migration-assistant).
|Data migration service supports migrating from Amazon RDS to managed instance | For more information, see [Tutorial: Migrate RDS SQL Server to Azure SQL Database or an Azure SQL Database managed instance online using DMS](../dms/tutorial-rds-sql-server-azure-sql-and-managed-instance-online.md).|
| &nbsp; |

### Documentation improvements

| Documentation improvements | Details |
| --- | --- |
|Adding managed instance deployment option clarifications|Updated many articles to clarify applicability to single database, elastic pool, and managed instance deployment options. |
|Updated tempdb sizes for DTU-based purchasing model | For more information, see [Tempdb database in SQL Database](https://docs.microsoft.com/sql/relational-databases/databases/tempdb-database#tempdb-database-in-sql-database).|
|Updated import and export with bacpac file for managed instance support| For more information, see [Import from BACPAC](sql-database-import.md) and [Export to BACPAC](sql-database-export.md). |
| &nbsp; |


## January 2019

### Service improvements

| Service improvements | Details |
| --- | --- |
| Additional granularity options for compute resources | The general purpose and business critical service tiers for [single databases](sql-database-vcore-resource-limits-single-databases.md) and [elastic pools](sql-database-vcore-resource-limits-elastic-pools.md) now have more fine-grained compute options.|
| Viewing audit records for managed instance in the Azure portal | Viewing [audit records for managed instances](sql-database-managed-instance-auditing.md) in the Azure portal is now supported.|
| Advance threat detection feature renamed to Advanced Data Security | Advance threat detection feature renamed to [Advanced Data Security](sql-advanced-threat-protection.md) for single databases, elastic pools, and managed instances. |
| &nbsp; |

### Documentation improvements

| Documentation improvements | Details |
| --- | --- |
| Managed instances and transactional replication | Added article about using [transactional replication with managed instances](replication-with-sql-database-managed-instance.md) |
| Added Azure AD with managed instance tutorial | This [Azure AD with managed instance](sql-database-managed-instance-aad-security-tutorial.md) tutorial shows you have to configure and test managed instance security using Azure AD logins. |
| Updated content for job automation using Transact-SQL scripts | Updated and clarified content for using [job automation using Transact-SQL scripts](sql-database-job-automation-overview.md) for single databases, elastic pools, and managed instances |
| Security content for managed instances updated | Updated and clarified content for the [security model for managed instances](sql-database-security-overview.md), and contrasted in with the security model for single databases and elastic pools |
| Refreshed all quickstarts and tutorials | All of the quickstarts and tutorials in the [documentation](https://docs.microsoft.com/azure/sql-database) have been updated and refreshed to match changes in the Azure portal |
| Added quickstart overview guides | Added a quickstart overview guide for [single databases](sql-database-quickstart-guide.md) and for [managed instances](sql-database-managed-instance-quickstart-guide.md) |
| Added SQL Database glossary of terms | This [terms glossary](sql-database-glossary-terms.md) article provides a definitive list of SQL Database terms and links to the primary conceptual page that explains the term in context. |
| &nbsp; |

## Contribute to content improvement

The Azure SQL documentation set is open source. Working in the open provides several advantages:

- Open source repos plan in the open to get feedback on what docs are most needed.
- Open source repos review in the open to publish the most helpful content on our first release.
- Open source repos update in the open to make it easier to continuously improve the content.

To contribute to Azure SQL Database documentation content, see the [Microsoft Docs contributor guide overview](https://docs.microsoft.com/contribute/). The user experience on [docs.microsoft.com](https://docs.microsoft.com/) integrates [GitHub](https://github.com/) workflows directly to make it even easier. Start by [editing the document you are viewing](https://docs.microsoft.com/contribute/#quick-edits-to-existing-documents). Or, help by [reviewing new topics](https://docs.microsoft.com/contribute/#review-open-prs), or [create quality issues](https://docs.microsoft.com/contribute/#create-quality-issues).
