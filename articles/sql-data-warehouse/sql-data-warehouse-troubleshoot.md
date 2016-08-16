<properties
   pageTitle="Troubleshooting Azure SQL Data Warehouse | Microsoft Azure"
   description="Troubleshooting Azure SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sonyam"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="07/18/2016"
   ms.author="sonyama;barbkess"/>

# Troubleshooting Azure SQL Data Warehouse

This topic lists some of the more common troubleshooting questions we hear from our customers.

## Connecting

| Issue                              | Resolution                                      |
| :----------------------------------| :---------------------------------------------- |
| CTAIP error                        | This error can occur when a login has been created on the SQL server master database, but not in the SQL Data Warehouse database.  If you encounter this error, take a look at the [Security overview][] article.  This article explains how to create create a login on master and then how to create a user in the SQL Data Warehouse database.|
| Blocked by Firewall                |Azure SQL databases are protected by server and database level firewalls to ensure only known IP addresses have access to a database. The firewalls are secure by default, which means that you must explicitly enable and IP address or range of addresses before you can connect.  To configure your firewall for access, follow the steps in [Configure server firewall access for your client IP][] in the [Provisioning instructions][].|
| Cannot connect with tool or driver | SQL Data Warehouse recommends using [Visual Studio 2013 or 2015][] to query your data.  For client connectivity, [SQL Server Native Client 10/11 (ODBC)][] is recommended.|


## Tools

| Issue                              | Resolution                                      |
| :----------------------------------| :---------------------------------------------- |
| Visual Studio object explorer is missing AAD users | This is a known issue.  As a workaround, view the users in [sys.database_principals][].  See [Authentication to Azure SQL Data Warehouse][] to learn more about using Azure Active Directory with SQL Data Warehouse.|

## Performance

|  Issue                             | Resolution                                      |
| :----------------------------------| :---------------------------------------------- |
| Query performance troubleshooting  | If you are trying to troubleshoot a particular query, start with [Learning how to monitor your queries][].|
| Poor query performance and plans often is a result of missing statistics   | The most common cause of poor performance is lack of statistics on your tables.  See [Maintaining table statistics][Statistics] for details on how to create statistics and why they are critical to your performance.|
| Low concurrency / queries queued   | Understanding [Workload management][] is important in order to understand how to balance memory allocation with concurrency.|
| How to implement best practices    | The best place to start to learn ways to improve query performance is [SQL Data Warehouse best practices][] article.|
| How to improve performance with scaling  | Sometimes the solution to improving performance is to simply add more compute power to your queries by [Scaling your SQL Data Warehouse][].|
| Poor query performance as a result of poor index quality | Some times queries can slowdown because of [Poor columnstore index quality][].  See this article for more information and how to [Rebuild indexes to improve segment quality][].|

## System management

|  Issue                             | Resolution                                      |
| :----------------------------------| :---------------------------------------------- |
| Msg 40847: Could not perform the operation because server would exceed the allowed Database Throughput Unit quota of 45000. | Either reduce the [DWU][] of the database you are trying to create or [request a quota increase][].|
| Investigating space utilization    | See [Table sizes][] to understand the space utilization of your system.|
| Help with managing tables          | See the [Table overview][Overview] article for help with managing your tables.  This article also includes links into more detailed topics like [Table data types][Data types], [Distributing a table][Distribute], [Indexing a table][Index],  [Partitioning a table][Partition], [Maintaining table statistics][Statistics] and [Temporary tables][Temporary].|

## Polybase

|  Issue                             | Resolution                                      |
| :----------------------------------| :---------------------------------------------- |
| UTF-8 error                        |  Currently PolyBase only supports loading data files that have been UTF-8 encoded.  See [Working around the PolyBase UTF-8 requirement][] for guidance on how to work around this limitation.|
| Load fails because of large rows   | Currently large row support is not available for Polybase.  This means that if your table contains VARCHAR(MAX), NVARCHAR(MAX) or VARBINARY(MAX), External tables cannot be used to load your data.  Loads for large rows is currently only supported through Azure Data Factory (with BCP), Azure Stream Analytics, SSIS, BCP or the .NET SQLBulkCopy class. PolyBase support for large rows will be added in a future release.|
| bcp load of table with MAX data type is failing | There is a known issue which requires that VARCHAR(MAX), NVARCHAR(MAX) or VARBINARY(MAX) be placed at the end of the table in some scenarios.  Try moving your MAX columns to the end of the table.|

## Differences from SQL Database

|  Issue                             | Resolution                                      |
| :----------------------------------| :---------------------------------------------- |
| Unsupported SQL Database features  | See [Unsupported table features][].|
| Unsupported SQL Database data types  | See [Unsupported data types][].|
| DELETE and UPDATE limitations      | See [UPDATE workarounds][], [DELETE workarounds][] and [Using CTAS to work around unsupported UPDATE and DELETE syntax][].  |
| MERGE statement is not supported   | See [MERGE workarounds][].|
| Stored procedure limitations       | See [Stored procedure limitations][] to understand some of the limitations of stored procedures.|
| UDFs do not support SELECT statements | This is a current limitation of our UDFs.  See [CREATE FUNCTION][] for the syntax we support.   |
'<--LocComment: Page not found "Stored procedure limitations" is broken. I've tried fixing the link in Article References -->'

## Next steps

If you are were unable to find a solution to your issue above, here are some other resources you can try.

- [Blogs]
- [Feature requests]
- [Videos]
- [CAT team blogs]
- [Create support ticket]
- [MSDN forum]
- [Stack Overflow forum]
- [Twitter]

<!--Image references-->

<!--Article references-->
[Security overview]: ./sql-data-warehouse-overview-manage-security.md
[Create support ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[Scaling your SQL Data Warehouse]: ./sql-data-warehouse-manage-compute-overview.md
[DWU]: ./sql-data-warehouse-overview-what-is.md#data-warehouse-units
[request a quota increase]: ./sql-data-warehouse-get-started-create-support-ticket.md#request-quota-change 
[Learning how to monitor your queries]: ./sql-data-warehouse-manage-monitor.md
[Provisioning instructions]: ./sql-data-warehouse-get-started-provision.md
[Configure server firewall access for your client IP]: ./sql-data-warehouse-get-started-provision.md#create-a-new-azure-sql-server-level-firewall
[Visual Studio 2013 or 2015]: ./sql-data-warehouse-get-started-connect.md
[SQL Data Warehouse best practices]: ./sql-data-warehouse-best-practices.md
[Table sizes]: ./sql-data-warehouse-tables-overview.md#table-size-queries
[Unsupported table features]: ./sql-data-warehouse-tables-overview.md#unsupported-table-features
[Unsupported data types]: ./sql-data-warehouse-tables-data-types.md#unsupported-data-types
[Overview]: ./sql-data-warehouse-tables-overview.md
[Data types]: ./sql-data-warehouse-tables-data-types.md
[Distribute]: ./sql-data-warehouse-tables-distribute.md
[Index]: ./sql-data-warehouse-tables-index.md
[Partition]: ./sql-data-warehouse-tables-partition.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md
[Temporary]: ./sql-data-warehouse-tables-temporary.md
[Poor columnstore index quality]: ./sql-data-warehouse-tables-index.md#causes-of-poor-columnstore-index-quality
[Rebuild indexes to improve segment quality]: ./sql-data-warehouse-tables-index.md#rebuilding-indexes-to-improve-segment-quality
[Workload management]: ./sql-data-warehouse-develop-concurrency.md
[Using CTAS to work around unsupported UPDATE and DELETE syntax]: ./sql-data-warehouse-develop-ctas.md#using-ctas-to-work-around-unsupported-features
[UPDATE workarounds]: ./sql-data-warehouse-develop-ctas.md#ansi-join-replacement-for-update-statements
[DELETE workarounds]: ./sql-data-warehouse-develop-ctas.md#ansi-join-replacement-for-delete-statements
[MERGE workarounds]: ./sql-data-warehouse-develop-ctas.md#replace-merge-statements
[Stored procedure limitations]: /sql-data-warehouse-develop-stored-procedures.md#limitations
[Authentication to Azure SQL Data Warehouse]: ./sql-data-warehouse-authentication.md
[Working around the PolyBase UTF-8 requirement]: ./sql-data-warehouse-load-polybase-guide.md#working-around-the-polybase-utf-8-requirement

<!--MSDN references-->
[SQL Server Native Client 10/11 (ODBC)]: https://msdn.microsoft.com/library/ms131415.aspx
[sys.database_principals]: https://msdn.microsoft.com/library/ms187328.aspx
[CREATE FUNCTION]: https://msdn.microsoft.com/library/mt203952.aspx

<!--Other Web references-->
[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[CAT team blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Feature requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[MSDN forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureSQLDataWarehouse
[Stack Overflow forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse

