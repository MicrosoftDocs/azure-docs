---
title: Guide for using PolyBase in SQL Data Warehouse | Microsoft Docs
description: Guidelines and recommendations for using PolyBase in SQL Data Warehouse scenarios.
services: sql-data-warehouse
documentationcenter: NA
author: ckarst
manager: barbkess
editor: ''

ms.assetid: 4757fce1-96b3-48ea-8a51-be1385705f9f
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.date: 6/5/2016
ms.custom: loading
ms.author: cakarst;barbkess


---
# Guide for using PolyBase in SQL Data Warehouse
This guide gives practical information for using PolyBase in SQL Data Warehouse.

To get started, see the [Load data with PolyBase][Load data with PolyBase] tutorial.

## Rotating storage keys
From time to time you will want to change the access key to your blob storage for security reasons.

The most elegant way to perform this task is to follow a process known as "rotating the keys". You may have noticed that you have two storage keys for your blob storage account. This is so that you can transition

Rotating your Azure storage account keys is a simple three step process

1. Create second database scoped credential based on the secondary storage access key
2. Create second external data source based off this new credential
3. Drop and create the external table(s) pointing to the new external data source

When you have migrated all your external tables to the new external data source then you can perform the clean up tasks:

1. Drop first external data source
2. Drop first database scoped credential based on the primary storage access key
3. Log into Azure and regenerate the primary access key ready for the next time

## Query Azure blob storage data
Queries against external tables simply use the table name as though it was a relational table.

```sql
-- Query Azure storage resident data via external table.
SELECT * FROM [ext].[CarSensor_Data]
;
```

> [!NOTE]
> A query on an external table can fail with the error *"Query aborted-- the maximum reject threshold was reached while reading from an external source"*. This indicates that your external data contains *dirty* records. A data record is considered 'dirty' if the actual data types/number of columns do not match the column definitions of the external table or if the data doesn't conform to the specified external file format. To fix this, ensure that your external table and external file format definitions are correct and your external data conforms to these definitions. In case a subset of external data records are dirty, you can choose to reject these records for your queries by using the reject options in CREATE EXTERNAL TABLE DDL.
> 
> 

## Load data from Azure blob storage
This example loads data from Azure blob storage to SQL Data Warehouse database.

Storing data directly removes the data transfer time for queries. Storing data with a columnstore index improves query performance for analysis queries by up to 10x.

This example uses the CREATE TABLE AS SELECT statement to load data. The new table inherits the columns named in the query. It inherits the data types of those columns from the external table definition.

CREATE TABLE AS SELECT is a highly performant Transact-SQL statement that loads the data in parallel to all the compute nodes of your SQL Data Warehouse.  It was originally developed for  the massively parallel processing (MPP) engine in Analytics Platform System and is now in SQL Data Warehouse.

```sql
-- Load data from Azure blob storage to SQL Data Warehouse

CREATE TABLE [dbo].[Customer_Speed]
WITH
(   
    CLUSTERED COLUMNSTORE INDEX
,    DISTRIBUTION = HASH([CarSensor_Data].[CustomerKey])
)
AS
SELECT *
FROM   [ext].[CarSensor_Data]
;
```

See [CREATE TABLE AS SELECT (Transact-SQL)][CREATE TABLE AS SELECT (Transact-SQL)].

## Create Statistics on newly loaded data
Azure SQL Data Warehouse does not yet support auto create or auto update statistics.  In order to get the best performance from your queries, it's important that statistics be created on all columns of all tables after the first load or any substantial changes occur in the data.  For a detailed explanation of statistics, see the [Statistics][Statistics] topic in the Develop group of topics.  Below is a quick example of how to create statistics on the tabled loaded in this example.

```sql
create statistics [SensorKey] on [Customer_Speed] ([SensorKey]);
create statistics [CustomerKey] on [Customer_Speed] ([CustomerKey]);
create statistics [GeographyKey] on [Customer_Speed] ([GeographyKey]);
create statistics [Speed] on [Customer_Speed] ([Speed]);
create statistics [YearMeasured] on [Customer_Speed] ([YearMeasured]);
```

## Export data to Azure blob storage
This section shows how to export data from SQL Data Warehouse to Azure blob storage. This example uses CREATE EXTERNAL TABLE AS SELECT which is a highly performant Transact-SQL statement to export the data in parallel from all the compute nodes.

The following example creates an external table Weblogs2014 using column definitions and data from dbo.Weblogs table. The external table definition is stored in SQL Data Warehouse and the results of the SELECT statement are exported to the "/archive/log2014/" directory under the blob container specified by the data source. The data is exported in the specified text file format.

```sql
CREATE EXTERNAL TABLE Weblogs2014 WITH
(
    LOCATION='/archive/log2014/',
    DATA_SOURCE=azure_storage,
    FILE_FORMAT=text_file_format
)
AS
SELECT
    Uri,
    DateRequested
FROM
    dbo.Weblogs
WHERE
    1=1
    AND DateRequested > '12/31/2013'
    AND DateRequested < '01/01/2015';
```
## Isolate Loading Users
There is often a need to have multiple users that can load data into a SQL DW. Because the [CREATE TABLE AS SELECT (Transact-SQL)][CREATE TABLE AS SELECT (Transact-SQL)] requires CONTROL permissions of the database, you will end up with multiple users with control access over all schemas. To limit this, you can use the DENY CONTROL statement.

Example:
Consider database schemas schema_A for dept A, and schema_B for dept B 
Let database users user_A and user_B be users for PolyBase loading in dept A and B, respectively. They both have been granted CONTROL database permissions.
The creators of schema A and B now lock down their schemas using DENY:

```sql
   DENY CONTROL ON SCHEMA :: schema_A TO user_B;
   DENY CONTROL ON SCHEMA :: schema_B TO user_A;
```   
 With this, user_A and user_B should now be locked out from the other dept’s schema.
 


## Next steps
To learn more about moving data to SQL Data Warehouse, see the [data migration overview][data migration overview].

<!--Image references-->

<!--Article references-->
[Load data with bcp]: ./sql-data-warehouse-load-with-bcp.md
[Load data with PolyBase]: ./sql-data-warehouse-get-started-load-with-polybase.md
[Statistics]: ./sql-data-warehouse-tables-statistics.md
[data migration overview]: ./sql-data-warehouse-overview-migrate.md

<!--MSDN references-->
[supported source/sink]: https://msdn.microsoft.com/library/dn894007.aspx
[copy activity]: https://msdn.microsoft.com/library/dn835035.aspx
[SQL Server destination adapter]: https://msdn.microsoft.com/library/ms141095.aspx
[SSIS]: https://msdn.microsoft.com/library/ms141026.aspx

[CREATE EXTERNAL DATA SOURCE (Transact-SQL)]: https://msdn.microsoft.com/library/dn935022.aspx
[CREATE EXTERNAL FILE FORMAT (Transact-SQL)]: https://msdn.microsoft.com/library/dn935026.aspx
[CREATE EXTERNAL TABLE (Transact-SQL)]: https://msdn.microsoft.com/library/dn935021.aspx

[DROP EXTERNAL DATA SOURCE (Transact-SQL)]: https://msdn.microsoft.com/library/mt146367.aspx
[DROP EXTERNAL FILE FORMAT (Transact-SQL)]: https://msdn.microsoft.com/library/mt146379.aspx
[DROP EXTERNAL TABLE (Transact-SQL)]: https://msdn.microsoft.com/library/mt130698.aspx

[CREATE TABLE AS SELECT (Transact-SQL)]: https://msdn.microsoft.com/library/mt204041.aspx
[INSERT...SELECT (Transact-SQL)]: https://msdn.microsoft.com/library/ms174335.aspx
[CREATE MASTER KEY (Transact-SQL)]: https://msdn.microsoft.com/library/ms174382.aspx
[CREATE CREDENTIAL (Transact-SQL)]: https://msdn.microsoft.com/library/ms189522.aspx
[CREATE DATABASE SCOPED CREDENTIAL (Transact-SQL)]: https://msdn.microsoft.com/library/mt270260.aspx
[DROP CREDENTIAL (Transact-SQL)]: https://msdn.microsoft.com/library/ms189450.aspx

<!-- External Links -->
