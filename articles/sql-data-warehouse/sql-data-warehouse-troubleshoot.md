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
   ms.date="06/30/2016"
   ms.author="sonyama;barbkess"/>

# Troubleshooting Azure SQL Data Warehouse

This topic lists some of the more common issues you might run into with Azure SQL Data Warehouse as well as links to some of our most useful articles.

## Connection failures

If you are having trouble connecting, below are some of the more common issues reported by customers.

- **CTAIP error:** This error can occur when a login has been created on the SQL server master database, but not in the SQL Data Warehouse database.  If you encounter this error, take a look at the [Security Overview][] article.  This article explains how to create create a login on master and then how to create a user in the SQL Data Warehouse database.
- **Firewall rules: **Azure SQL databases are protected by server and database level firewalls to ensure only known IP addresses have access to a database. The firewalls are secure by default, which means that you must explicitly enable and IP address or range of addresses before you can connect.  To configure your firewall for access, follow the steps in [configure server firewall access for your client IP][] in the [provisioning instructions][].
- **Unsupported tools/protocols:** SQL Data Warehouse recommends using [Visual Studio 2013 or 2015][] to query your data.  For client connectivity, [SQL Server Native Client 10/11 (ODBC)][] are recommended.  SQL Server Management Studio (SSMS) is not yet supported and while it partially works, the object explorer tree does not work with SQL Data Warehouse and the query may work after you ignore some error messages.

## Performance

- **Query Performance:** If you are trying to troubleshoot a particular query, start with [learning how to monitor your queries][].
- **Workload Management:** Understanding [Workload management][] is important in order to understand how to balance memory allocation with concurrency.
- **Best Practices:** The best place to start to learn ways to improve query performance is [SQL Data Warehouse Best Practices][] article.   
- **Pause and Scale**  Sometimes the solution to improving performance is to simply add more compute power to your queries by [scaling your SQL Data Warehouse][].
- **Improve Clustered Columnstore Index Quality:** Some times queries can slowdown because of [Poor columnstore index quality][].  See this article for more information and how to [Rebuild indexes to improve segment quality][].

## System management

- **Space Utilization:** See [Table Sizes][] to understand the space utilization of your system.
- **Managing Tables:** See the [Table Overview][Overview] article for help with managing your tables.  This article also includes links into more detailed topics like [Table Data Types][Data Types], [Distributing a Table][Distribute], [Indexing a Table][Index],  [Partitioning a Table][Partition], [Maintaining Table Statistics][Statistics] and [Temporary Tables][Temporary].

## Unsupported features and limitations

SQL Data Warehouse supports a subset of the features offered by SQL Database.  See these articles for more details on which features are unsupported as well as workarounds.

- **Table features:**  See [Unsupported Table Features][].
- **Data types:** See [Unsupported Data Types][].
- **DELETE and UPDATE limitations: ** See [UPDATE workarounds][], [DELETE workarounds][] and [Using CTAS to work around unsupported UPDATE and DELETE syntax][].
- **MERGE**: See [MERGE workarounds][].
- **Stored procedure limitations:**  See [Stored procedure limitations][] to understand some of the limitations of stored procedures.

## Tools

- **Azure Active Directory users are not shown in SSDT Object Explorer:** This is a known issue.  As a workaround, view the users in [sys.database_principals][].  See [Authentication to Azure SQL Data Warehouse] to learn more about using Azure Active Directory with SQL Data Warehouse.

## Next steps

If you are were unable to find a solution to your issue above, here are some other resources you can try.

- [Blogs]
- [Feature Requests]
- [Videos]
- [CAT Team Blogs]
- [Create Support Ticket]
- [MSDN Forum]
- [Stack Overflow Forum]
- [Twitter]

<!--Image references-->

<!--Article references-->
[Security Overview]: ./sql-data-warehouse-overview-manage-security.md
[Create Support Ticket]: ./sql-data-warehouse-get-started-create-support-ticket.md
[scaling your SQL Data Warehouse]: ./sql-data-warehouse-manage-compute-overview.md
[learning how to monitor your queries]: ./sql-data-warehouse-manage-monitor.md
[provisioning instructions]: ./sql-data-warehouse-get-started-provision.md
[configure server firewall access for your client IP]: ./sql-data-warehouse-get-started-provision.md#create-a-new-azure-sql-server-level-firewall
[Visual Studio 2013 or 2015]: ./sql-data-warehouse-get-started-connect.md
[SQL Data Warehouse Best Practices]: ./sql-data-warehouse-best-practices.md
[Table Sizes]: ./sql-data-warehouse-tables-overview.md#table-size-queries
[Unsupported Table Features]: ./sql-data-warehouse-tables-overview.md#unsupported-table-features
[Unsupported Data Types]: ./sql-data-warehouse-tables-data-types.md#unsupported-data-types
[Overview]: ./sql-data-warehouse-tables-overview.md
[Data Types]: ./sql-data-warehouse-tables-data-types.md
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
[Stored procedure limitations]: /sql-data-warehouse-develop-stored-procedures/#limitations
[Authentication to Azure SQL Data Warehouse]: ./sql-data-warehouse-authentication.md

<!--MSDN references-->
[SQL Server Native Client 10/11 (ODBC)]: https://msdn.microsoft.com/library/ms131415.aspx
[sys.database_principals]: https://msdn.microsoft.com/library/ms187328.aspx

<!--Other Web references-->
[Blogs]: https://azure.microsoft.com/blog/tag/azure-sql-data-warehouse/
[CAT Team Blogs]: https://blogs.msdn.microsoft.com/sqlcat/tag/sql-dw/
[Feature Requests]: https://feedback.azure.com/forums/307516-sql-data-warehouse
[MSDN Forum]: https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureSQLDataWarehouse
[Stack Overflow Forum]: http://stackoverflow.com/questions/tagged/azure-sqldw
[Twitter]: https://twitter.com/hashtag/SQLDW
[Videos]: https://azure.microsoft.com/documentation/videos/index/?services=sql-data-warehouse

