---
title: Troubleshooting Azure SQL Data Warehouse | Microsoft Docs
description: Troubleshooting Azure SQL Data Warehouse.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 04/17/2018
ms.author: kevin
ms.reviewer: igorstan
---

# Troubleshooting Azure SQL Data Warehouse
This article lists common troubleshooting question.

## Connecting
| Issue | Resolution |
|:--- |:--- |
| Login failed for user 'NT AUTHORITY\ANONYMOUS LOGON'. (Microsoft SQL Server, Error: 18456) |This error occurs when an AAD user tries to connect to the master database, but does not have a user in master.  To correct this issue, either specify the SQL Data Warehouse you wish to connect to at connection time or add the user to the master database.  See [Security overview][Security overview] article for more details. |
| The server principal "MyUserName" is not able to access the database "master" under the current security context. Cannot open user default database. Login failed. Login failed for user 'MyUserName'. (Microsoft SQL Server, Error: 916) |This error occurs when an AAD user tries to connect to the master database, but does not have a user in master.  To correct this issue, either specify the SQL Data Warehouse you wish to connect to at connection time or add the user to the master database.  See [Security overview][Security overview] article for more details. |
| CTAIP error |This error can occur when a login has been created on the SQL server master database, but not in the SQL Data Warehouse database.  If you encounter this error, take a look at the [Security overview][Security overview] article.  This article explains how to create a login and user on master, and then how to create a user in the SQL Data Warehouse database. |
| Blocked by Firewall |Azure SQL databases are protected by server and database level firewalls to ensure only known IP addresses have access to a database. The firewalls are secure by default, which means that you must explicitly enable and IP address or range of addresses before you can connect.  To configure your firewall for access, follow the steps in [Configure server firewall access for your client IP][Configure server firewall access for your client IP] in the [Provisioning instructions][Provisioning instructions]. |
| Cannot connect with tool or driver |SQL Data Warehouse recommends using [SSMS][SSMS], [SSDT for Visual Studio][SSDT for Visual Studio], or [sqlcmd][sqlcmd] to query your data. For more information on drivers and connecting to SQL Data Warehouse, see [Drivers for Azure SQL Data Warehouse][Drivers for Azure SQL Data Warehouse] and [Connect to Azure SQL Data Warehouse][Connect to Azure SQL Data Warehouse] articles. |

## Tools
| Issue | Resolution |
|:--- |:--- |
| Visual Studio object explorer is missing AAD users |This is a known issue.  As a workaround, view the users in [sys.database_principals][sys.database_principals].  See [Authentication to Azure SQL Data Warehouse][Authentication to Azure SQL Data Warehouse] to learn more about using Azure Active Directory with SQL Data Warehouse. |
|Manual scripting, using the scripting wizard, or connecting via SSMS is slow, hung, or producing errors| Ensure that users have been created in the master database. In scripting options, also make sure that the engine edition is set as “Microsoft Azure SQL Data Warehouse Edition” and engine type is “Microsoft Azure SQL Database”.|

## Performance
| Issue | Resolution |
|:--- |:--- |
| Query performance troubleshooting |If you are trying to troubleshoot a particular query, start with [Learning how to monitor your queries][Learning how to monitor your queries]. |
| Poor query performance and plans often is a result of missing statistics |The most common cause of poor performance is lack of statistics on your tables.  See [Maintaining table statistics][Statistics] for details on how to create statistics and why they are critical to your performance. |
| Low concurrency / queries queued |Understanding [Workload management][Workload management] is important in order to understand how to balance memory allocation with concurrency. |
| How to implement best practices |The best place to start to learn ways to improve query performance is [SQL Data Warehouse best practices][SQL Data Warehouse best practices] article. |
| How to improve performance with scaling |Sometimes the solution to improving performance is to simply add more compute power to your queries by [Scaling your SQL Data Warehouse][Scaling your SQL Data Warehouse]. |
| Poor query performance as a result of poor index quality |Some times queries can slow down because of [Poor columnstore index quality][Poor columnstore index quality].  See this article for more information and how to [Rebuild indexes to improve segment quality][Rebuild indexes to improve segment quality]. |

## System management
| Issue | Resolution |
|:--- |:--- |
| Msg 40847: Could not perform the operation because server would exceed the allowed Database Transaction Unit quota of 45000. |Either reduce the [DWU][DWU] of the database you are trying to create or [request a quota increase][request a quota increase]. |
| Investigating space utilization |See [Table sizes][Table sizes] to understand the space utilization of your system. |
| Help with managing tables |See the [Table overview][Overview] article for help with managing your tables.  This article also includes links into more detailed topics like [Table data types][Data types], [Distributing a table][Distribute], [Indexing a table][Index],  [Partitioning a table][Partition], [Maintaining table statistics][Statistics] and [Temporary tables][Temporary]. |
|Transparent data encryption (TDE) progress bar is not updating in the Azure Portal|You can view the state of TDE via [powershell](/powershell/module/azurerm.sql/get-azurermsqldatabasetransparentdataencryption).|

## Polybase
| Issue | Resolution |
|:--- |:--- |
| Load fails because of large rows |Currently large row support is not available for Polybase.  This means that if your table contains VARCHAR(MAX), NVARCHAR(MAX) or VARBINARY(MAX), External tables cannot be used to load your data.  Loading large rows is currently only supported through Azure Data Factory (with BCP), Azure Stream Analytics, SSIS, BCP, or the .NET SQLBulkCopy class. PolyBase support for large rows will be added in a future release. |
| bcp load of table with MAX data type is failing |There is a known issue which requires that VARCHAR(MAX), NVARCHAR(MAX) or VARBINARY(MAX) be placed at the end of the table in some scenarios.  Try moving your MAX columns to the end of the table. |

## Differences from SQL Database
| Issue | Resolution |
|:--- |:--- |
| Unsupported SQL Database features |See [Unsupported table features][Unsupported table features]. |
| Unsupported SQL Database data types |See [Unsupported data types][Unsupported data types]. |
| DELETE and UPDATE limitations |See [UPDATE workarounds][UPDATE workarounds], [DELETE workarounds][DELETE workarounds] and [Using CTAS to work around unsupported UPDATE and DELETE syntax][Using CTAS to work around unsupported UPDATE and DELETE syntax]. |
| MERGE statement is not supported |See [MERGE workarounds][MERGE workarounds]. |
| Stored procedure limitations |See [Stored procedure limitations][Stored procedure limitations] to understand some of the limitations of stored procedures. |
| UDFs do not support SELECT statements |This is a current limitation of our UDFs.  See [CREATE FUNCTION][CREATE FUNCTION] for the syntax we support. |

## Next steps
For more help in finding solution to your issue, here are some other resources you can try.

* [Blogs]
* [Feature requests]
* [Videos]
* [CAT team blogs]
* [Create support ticket]
* [MSDN forum]
* [Stack Overflow forum]
* [Twitter]

<!--Image references-->

<!--Article references-->
[Security overview]: sql-data-warehouse-overview-manage-security.md
[SSMS]: /sql/ssms/download-sql-server-management-studio-ssms
[SSDT for Visual Studio]: sql-data-warehouse-install-visual-studio.md
[Drivers for Azure SQL Data Warehouse]: sql-data-warehouse-connection-strings.md
[Connect to Azure SQL Data Warehouse]: sql-data-warehouse-connect-overview.md
[Create support ticket]: sql-data-warehouse-get-started-create-support-ticket.md
[Scaling your SQL Data Warehouse]: sql-data-warehouse-manage-compute-overview.md
[DWU]: sql-data-warehouse-overview-what-is.md
[request a quota increase]: sql-data-warehouse-get-started-create-support-ticket.md
[Learning how to monitor your queries]: sql-data-warehouse-manage-monitor.md
[Provisioning instructions]: sql-data-warehouse-get-started-provision.md
[Configure server firewall access for your client IP]: sql-data-warehouse-get-started-provision.md
[SQL Data Warehouse best practices]: sql-data-warehouse-best-practices.md
[Table sizes]: sql-data-warehouse-tables-overview.md#table-size-queries
[Unsupported table features]: sql-data-warehouse-tables-overview.md#unsupported-table-features
[Unsupported data types]: sql-data-warehouse-tables-data-types.md#unsupported-data-types
[Overview]: sql-data-warehouse-tables-overview.md
[Data types]: sql-data-warehouse-tables-data-types.md
[Distribute]: sql-data-warehouse-tables-distribute.md
[Index]: sql-data-warehouse-tables-index.md
[Partition]: sql-data-warehouse-tables-partition.md
[Statistics]: sql-data-warehouse-tables-statistics.md
[Temporary]: sql-data-warehouse-tables-temporary.md
[Poor columnstore index quality]: sql-data-warehouse-tables-index.md#causes-of-poor-columnstore-index-quality
[Rebuild indexes to improve segment quality]: sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality
[Workload management]: resource-classes-for-workload-management.md
[Using CTAS to work around unsupported UPDATE and DELETE syntax]: sql-data-warehouse-develop-ctas.md#using-ctas-to-work-around-unsupported-features
[UPDATE workarounds]: sql-data-warehouse-develop-ctas.md#ansi-join-replacement-for-update-statements
[DELETE workarounds]: sql-data-warehouse-develop-ctas.md#ansi-join-replacement-for-delete-statements
[MERGE workarounds]: sql-data-warehouse-develop-ctas.md#replace-merge-statements
[Stored procedure limitations]: sql-data-warehouse-develop-stored-procedures.md#limitations
[Authentication to Azure SQL Data Warehouse]: sql-data-warehouse-authentication.md


<!--MSDN references-->
[sys.database_principals]: /sql/relational-databases/system-catalog-views/sys-database-principals-transact-sql
[CREATE FUNCTION]: /sql/t-sql/statements/create-function-sql-data-warehouse
[sqlcmd]: sql-data-warehouse-get-started-connect-sqlcmd.md

<!--Other Web references-->
[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[CAT team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[MSDN forum]: https://social.msdn.microsoft.com/Forums/home?forum=AzureSQLDataWarehouse
[Stack Overflow forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse
