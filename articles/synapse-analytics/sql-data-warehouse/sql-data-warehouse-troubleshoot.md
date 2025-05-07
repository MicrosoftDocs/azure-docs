---
title: Troubleshooting dedicated SQL pool (formerly SQL DW)
description: Troubleshooting dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics.
author: joannapea
ms.author: joanpo
ms.date: 09/02/2022
ms.service: azure-synapse-analytics
ms.subservice: sql-dw
ms.topic: conceptual
ms.custom: azure-synapse
---

# Troubleshoot dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics

This article lists common troubleshooting issues in dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics.

## Connect

| Issue                                                        | Resolution                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| Login failed for user 'NT AUTHORITY\ANONYMOUS LOGON'. (Microsoft SQL Server, Error: 18456) | This error occurs when a Microsoft Entra user tries to connect to the `master` database, but does not have a user in `master`.  To correct this issue, either specify the dedicated SQL pool (formerly SQL DW) you wish to connect to at connection time or add the user to the `master` database.  For more information, see [Security overview](sql-data-warehouse-overview-manage-security.md). |
| The server principal "MyUserName" is not able to access the database `master` under the current security context. Cannot open user default database. Login failed. Login failed for user 'MyUserName'. (Microsoft SQL Server, Error: 916) | This error occurs when a Microsoft Entra user tries to connect to the `master` database, but does not have a user in `master`.  To correct this issue, either specify the dedicated SQL pool (formerly SQL DW) you wish to connect to at connection time or add the user to the `master` database. For more information, see [Security overview](sql-data-warehouse-overview-manage-security.md). |
| CTAIP error                                                  | This error can occur when a login has been created on the SQL Database `master` database, but not in the specific SQL database.  If you encounter this error, take a look at the [Security overview](sql-data-warehouse-overview-manage-security.md) article.  This article explains how to create a login and user in the `master` database, and then how to create a user in a SQL database. |
| Blocked by Firewall                                          | Dedicated SQL pools (formerly SQL DW) are protected by firewalls to ensure only known IP addresses have access to a database. The firewalls are secure by default, which means that you must explicitly enable and IP address or range of addresses before you can connect.  To configure your firewall for access, follow the steps in [Configure server firewall access for your client IP](create-data-warehouse-portal.md) in the [Provisioning instructions](create-data-warehouse-portal.md). |
| Cannot connect with tool or driver                           | Dedicated SQL pool (formerly SQL DW) recommends using [SQL Server Management Studio (SSMS)](/sql/ssms/download-sql-server-management-studio-ssms?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true), [SSDT for Visual Studio](sql-data-warehouse-install-visual-studio.md), or [sqlcmd](sql-data-warehouse-get-started-connect-sqlcmd.md) to query your data. For more information on drivers and connecting to Azure Synapse, see [Drivers for Azure Synapse](sql-data-warehouse-connection-strings.md) and [Connect to Azure Synapse](sql-data-warehouse-connect-overview.md) articles. |

## Tools

| Issue                                                        | Resolution                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| Visual Studio object explorer is missing Microsoft Entra users           | This is a known issue.  As a workaround, view the users in [sys.database_principals](/sql/relational-databases/system-catalog-views/sys-database-principals-transact-sql?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true).  See [Authentication to Azure Synapse](sql-data-warehouse-authentication.md) to learn more about using Microsoft Entra ID with dedicated SQL pool (formerly SQL DW). |
| Manual scripting, using the scripting wizard, or connecting via SSMS is slow, not responding, or producing errors | Ensure that users have been created in the `master` database. In scripting options, also make sure that the engine edition is set as "Microsoft Azure Synapse Analytics Edition" and engine type is "Microsoft Azure SQL Database". |
| Generate scripts fails in SSMS                               | Generating a script for dedicated SQL pool (formerly SQL DW) fails if the option "Generate script for dependent objects" option is set to "True." As a workaround, users must manually go to **Tools -> Options ->SQL Server Object Explorer -> Generate script for dependent options and set to false** |

## Data ingestion and preparation

| Issue                                                        | Resolution                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| Exporting empty strings using CETAS will result in NULL values in Parquet and ORC files. Note if you are exporting empty strings from columns with NOT NULL constraints, CETAS will result in rejected records and the export can potentially fail. | Remove empty strings or the offending column in the SELECT statement of your CETAS. |
| Loading a value outside the range of 0-127 into a tinyint column for Parquet and ORC file format is not supported. | Specify a larger data type  for the target column.           |
|Msg 105208, Level 16, State 1, Line 1 COPY statement failed with the following error when validating value of option 'FROM': '105200;COPY statement failed because the value for option 'FROM' is invalid.'|Currently, ingesting data using the COPY command into an Azure Storage account that is using the new DNS partitioning feature results in an error. DNS partition feature enables customers to create up to 5000 storage accounts per subscription. To resolve, provision a storage account in a subscription that does not use the new [Azure Storage DNS partition feature](https://techcommunity.microsoft.com/t5/azure-storage-blog/public-preview-create-additional-5000-azure-storage-accounts/ba-p/3465466) (currently in Public Preview).|

## Performance

| Issue                                                        | Resolution                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| Query performance troubleshooting                            | If you are trying to troubleshoot a particular query, start with [Learning how to monitor your queries](sql-data-warehouse-manage-monitor.md#monitor-query-execution). |
| `tempdb` space issues | [Monitor TempDB](sql-data-warehouse-manage-monitor.md#monitor-tempdb) space usage.  Common causes for running out of `tempdb` space are:<br>- Not enough resources allocated to the query causing data to spill to `tempdb`.  See [Workload management](resource-classes-for-workload-management.md) <br>- Statistics are missing or out of date causing excessive data movement.  See [Maintaining table statistics](sql-data-warehouse-tables-statistics.md) for details on how to create statistics<br>- `tempdb` space is allocated per service level.  [Scaling your dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-manage-compute-overview.md#scaling-compute) to a higher DWU setting allocates more `tempdb` space.|
| Poor query performance and plans often is a result of missing statistics | The most common cause of poor performance is lack of statistics on your tables.  See [Maintaining table statistics](sql-data-warehouse-tables-statistics.md) for details on how to create statistics and why they are critical to your performance. |
| Low concurrency / queries queued                             | Understanding [Workload management](resource-classes-for-workload-management.md) is important in order to understand how to balance memory allocation with concurrency. |
| How to implement best practices                              | The best place to start to learn ways to improve query performance is [dedicated SQL pool (formerly SQL DW) best practices](../sql/best-practices-dedicated-sql-pool.md) article. |
| How to improve performance with scaling                      | Sometimes the solution to improving performance is to simply add more compute power to your queries by [Scaling your dedicated SQL pool (formerly SQL DW)](sql-data-warehouse-manage-compute-overview.md). |
| Poor query performance as a result of poor index quality     | Some times queries can slow down because of [Poor columnstore index quality](sql-data-warehouse-tables-index.md#causes-of-poor-columnstore-index-quality).  For more information, see [Rebuild indexes to improve segment quality](sql-data-warehouse-tables-index.md#rebuild-indexes-to-improve-segment-quality). |

## System management

| Issue                                                        | Resolution                                                   |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| Msg 40847: Could not perform the operation because server would exceed the allowed Database Transaction Unit quota of 45000. | Either reduce the [DWU](what-is-a-data-warehouse-unit-dwu-cdwu.md) of the database you are trying to create or [request a quota increase](sql-data-warehouse-get-started-create-support-ticket.md). |
| Investigating space utilization                              | See [Table sizes](sql-data-warehouse-tables-overview.md#table-size-queries) to understand the space utilization of your system. |
| Help with managing tables                                    | See the [Table overview](sql-data-warehouse-tables-overview.md) article for help with managing your tables. For more information, see [Table data types](sql-data-warehouse-tables-data-types.md), [Distributing a table](sql-data-warehouse-tables-distribute.md), [Indexing a table](sql-data-warehouse-tables-index.md), [Partitioning a table](sql-data-warehouse-tables-partition.md), [Maintaining table statistics](sql-data-warehouse-tables-statistics.md) and [Temporary tables](sql-data-warehouse-tables-temporary.md). |
| Transparent data encryption (TDE) progress bar is not updating in the Azure portal | You can view the state of TDE via [PowerShell](/powershell/module/az.sql/get-azsqldatabasetransparentdataencryption?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json). |

## Differences from SQL Database

| Issue                                 | Resolution                                                   |
| :------------------------------------ | :----------------------------------------------------------- |
| Unsupported SQL Database features     | See [Unsupported table features](sql-data-warehouse-tables-overview.md#unsupported-table-features). |
| Unsupported SQL Database data types   | See [Unsupported data types](sql-data-warehouse-tables-data-types.md#identify-unsupported-data-types).        |
| Stored procedure limitations          | See [Stored procedure limitations](sql-data-warehouse-develop-stored-procedures.md#limitations) to understand some of the limitations of stored procedures. |
| UDFs do not support SELECT statements | This is a current limitation of our UDFs.  See [CREATE FUNCTION](/sql/t-sql/statements/create-function-sql-data-warehouse?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json&view=azure-sqldw-latest&preserve-view=true) for the syntax we support. |

## Next steps

For more help in finding solution to your issue, here are some other resources you can try.

 - [Blogs](https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/)
 - [Feature requests](https://feedback.azure.com/forums/307516-sql-data-warehouse)
 - [Videos](https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse)
 - [Create support ticket](sql-data-warehouse-get-started-create-support-ticket.md)
 - [Microsoft Q&A question page](/answers/topics/azure-synapse-analytics.html)
 - [Stack Overflow forum](https://stackoverflow.com/questions/tagged/azure-sqldw)
- [X](https://x.com/hashtag/SQLDW)
