<properties
   pageTitle="Troubleshooting | Microsoft Azure"
   description="Troubleshooting SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="TwoUnder"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="03/23/2016"
   ms.author="mausher;sonyama;barbkess"/>

# Troubleshooting
The following topic lists some of the more common issues customers run into with Azure SQL Data Warehouse.

## Connectivity
Connecting to Azure SQL Data Warehouse can fail for a couple of common reasons:

- Firewall rules are not set
- Using unsupported tools/protocols

### Firewall Rules
Azure SQL databases are protected by server and database level firewalls to ensure only known IP addresses can access databases. The firewalls are secure by default - meaning you must allow your IP address access before you can connect.

To configure your firewall for access, please follow the steps in the [Configure server firewall access for your client IP](sql-data-warehouse-get-started-provision.md/#step-4-configure-server-firewall-access-for-your-client-ip) section of the [Provision](sql-data-warehouse-get-started-provision.md) page.

### Using unsupported tools/protocols
SQL Data Warehouse supports [Visual Studio 2013/2015](sql-data-warehouse-get-started-connect.md) as development environments and [SQL Server Native Client 10/11 (ODBC)](https://msdn.microsoft.com/library/ms131415.aspx) for client connectivity.   

See our [Connect](sql-data-warehouse-get-started-connect.md) pages to learn more.

## Query Performance
SQL Data Warehouse uses common SQL Server constructs for executing queries including statistics. [Statistics](sql-data-warehouse-develop-statistics.md) are objects that contain information about the range and frequency of values in a database column. The query engine uses these statistics to optimize query execution and improve query performance. You can use the following query determine the last time your statistics where updated.  

```sql
SELECT
	sm.[name]								    AS [schema_name],
	tb.[name]								    AS [table_name],
	co.[name]									AS [stats_column_name],
	st.[name]									AS [stats_name],
	STATS_DATE(st.[object_id],st.[stats_id])	AS [stats_last_updated_date]
FROM
	sys.objects				AS ob
	JOIN sys.stats			AS st	ON	ob.[object_id]		= st.[object_id]
	JOIN sys.stats_columns	AS sc	ON	st.[stats_id]		= sc.[stats_id]
									AND	st.[object_id]		= sc.[object_id]
	JOIN sys.columns		AS co	ON	sc.[column_id]		= co.[column_id]
									AND	sc.[object_id]		= co.[object_id]
	JOIN sys.types           AS ty	ON	co.[user_type_id]	= ty.[user_type_id]
	JOIN sys.tables          AS tb	ON	co.[object_id]		= tb.[object_id]
	JOIN sys.schemas         AS sm	ON	tb.[schema_id]		= sm.[schema_id]
WHERE
	1=1
	AND st.[user_created] = 1;
```

See our [Statistics](sql-data-warehouse-develop-statistics.md) page to learn more.

## Key performance concepts

Please refer to the following articles to help you understand some additional key performance and scale concepts:

- [performance and scale][]
- [concurrency model][]
- [designing tables][]
- [choose a hash distribution key for your table][]
- [statistics to improve performance][]

## Next steps
Please refer to the [development overview][] article to get some guidance on building your SQL Data Warehouse solution.

<!--Image references-->

<!--Article references-->

[performance and scale]: sql-data-warehouse-performance-scale.md
[concurrency model]: sql-data-warehouse-develop-concurrency.md
[designing tables]: sql-data-warehouse-develop-table-design.md
[choose a hash distribution key for your table]: sql-data-warehouse-develop-hash-distribution-key
[statistics to improve performance]: sql-data-warehouse-develop-statistics.md
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other web references-->
