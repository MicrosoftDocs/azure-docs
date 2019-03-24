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
ms.date: 03/05/2019
ms.author: carlrab
---
# SQL Database release notes

This article lists the new features and improvements in the SQL Database service and in the SQL Database documentation. For SQL Database service improvements, see also [SQL Database service updates](https://azure.microsoft.com/updates/?product=sql-database). For improvements to other Azure services, see [Service updates](https://azure.microsoft.com/updates).

## March 2019

### Service improvements

| Service improvements | Details |
| --- | --- |
| Coming soon ||
| &nbsp; |

### Documentation improvements

| Documentation improvements | Details |
| --- | --- |
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
