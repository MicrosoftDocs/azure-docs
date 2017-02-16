---
title: Optimize JSON processing with in-memory tables - Azure  | Microsoft Docs
description: Azure SQL Database lets you work with JSON text in memory-optimized tables and natively compiled stored procedures.
services: sql-database
documentationcenter: ''
author: jovanpop-msft
manager: jhubbard
editor: ''

ms.assetid:
ms.service: sql-database
ms.devlang: NA
ms.date: 01/25/2017
ms.author: jovanpop
ms.workload: NA
ms.topic: article
ms.tgt_pltfrm: NA

---
# In-memory OLTP processing with JSON data in Azure SQL Database (public preview)
Azure SQL Database lets you [work with text formatted as JSON](sql-database-json-features). In order to increase performance
of your OLTP queries that process JSON data, you can store JSON documents in memory-optimized tables using standard string columns (NVARCHAR type).

The following example shows a memory-optimized Product table with two JSON columns, Tags and Data:

```
CREATE SCHEMA xtp;
GO
CREATE TABLE xtp.Product(
	ProductID int PRIMARY KEY NONCLUSTERED, --standard column
	Name nvarchar(400) NOT NULL, --standard column
	Price float, --standard column

	Tags nvarchar(400),--json stored in string column
	Data nvarchar(4000) --json stored in string column

) WITH (MEMORY_OPTIMIZED=ON);
```
Storing JSON data in memory-optimized tables increases query performance by leveraging lock-free, in-memory data access.

New features that are available in Azure SQL Database let you fully integrate JSON functionalities with existing in-memory OLTP technologies. For example, you can do the following things:
 - Validate the structure of JSON documents stored in memory-optimized tables using natively compiled check constraints.
 - Expose and strongly type values stored in JSON documents using computed columns.
 - Index values in JSON documents using memory-optimized indexes.
 - Natively compile SQL queries that use values from JSON documents or format results as JSON text.

## Validation of JSON columns
Azure SQL Database lets you add natively compiled check constraints that validate the content of JSON documents stored in a string columns:

```
DROP TABLE IF EXISTS xtp.Product;
GO
CREATE TABLE xtp.Product(
	ProductID int PRIMARY KEY NONCLUSTERED,
	Name nvarchar(400) NOT NULL,
	Price float,

	Tags nvarchar(400)
        	CONSTRAINT [Tags should be formatted as JSON] CHECK (ISJSON(Tags)=1),
	Data nvarchar(4000)

) WITH (MEMORY_OPTIMIZED=ON);
```

The natively compiled check constraint can be added on existing tables that contain JSON columns:

```
ALTER TABLE xtp.Product
ADD CONSTRAINT [Data should be JSON] CHECK (ISJSON(Data)=1)
```

With the natively compiled JSON check constraints, you can ensure that JSON text stored in your memory-optimized tables is properly formatted.

## Exposing JSON values using computed columns
Computed columns let you expose values from JSON text and access those values without re-evaluating the expressions that fetch a value from the JSON text and without re-parsing the JSON structure. Exposed values are strongly typed and physically persisted in the computed columns. Accessing JSON values using persisted computed columns is faster than accessing values in the JSON document.

The following example shows how to expose the country where a product is made and the product manufacturing cost values from the JSON Data column:

```
DROP TABLE IF EXISTS xtp.Product;
GO
CREATE TABLE xtp.Product(
	ProductID int PRIMARY KEY NONCLUSTERED,
	Name nvarchar(400) NOT NULL,
	Price float,

	Data nvarchar(4000),

	MadeIn AS CAST(JSON_VALUE(Data, '$.MadeIn') as NVARCHAR(50)) PERSISTED,
	Cost   AS CAST(JSON_VALUE(Data, '$.ManufacturingCost') as float)

) WITH (MEMORY_OPTIMIZED=ON);
```

The computed columns **MadeIn** and **Cost** are updated every time the JSON document stored in *Data* column changes.

## Indexing values in JSON columns
Azure SQL Database lets you index values in JSON columns using memory optimized indexes. JSON values that are indexed must be exposed and strongly typed using computed columns, as shown in the following example.

```
DROP TABLE IF EXISTS xtp.Product;
GO
CREATE TABLE xtp.Product(
	ProductID int PRIMARY KEY NONCLUSTERED,
	Name nvarchar(400) NOT NULL,
	Price float,

	Data nvarchar(4000),

	MadeIn AS CAST(JSON_VALUE(Data, '$.MadeIn') as NVARCHAR(50)) PERSISTED,
	Cost   AS CAST(JSON_VALUE(Data, '$.ManufacturingCost') as float) PERSISTED,

    INDEX [idx_Product_MadeIn] NONCLUSTERED (MadeIn)

) WITH (MEMORY_OPTIMIZED=ON)

ALTER TABLE Product
       ADD 	INDEX [idx_Product_Cost] NONCLUSTERED HASH(Cost)
                                       WITH (BUCKET_COUNT=20000)
```
Values in JSON columns can be indexed using both standard NONCLUSTERED and HASH indexes.
-   NONCLUSTERED indexes optimize queries that select ranges of rows by some JSON value or sort results by JSON values.
-   HASH indexes give you optimal performance when a single row or a few rows are fetched by specifying the exact value that should be found.

## Native compilation of JSON queries
Finally, native compilation of Transact-SQL procedures, functions, and triggers that contain queries with JSON functions increases performance of queries and reduces CPU cycles required to execute the procedures. The following example shows a natively compiled procedure that uses JSON functions:
```
CREATE PROCEDURE xtp.ProductList(@ProductIds nvarchar(100))
WITH SCHEMABINDING, NATIVE_COMPILATION
as begin
	atomic with (transaction isolation level = snapshot,  language = N'English')

	SELECT ProductID,Name,Price,Data,Tags, JSON_VALUE(data,'$.MadeIn') AS MadeIn
	FROM xtp.Product
		JOIN OPENJSON(@ProductIds)
			ON ProductID = value

end;

CREATE PROCEDURE xtp.UpdateProductData(@ProductId int, @Property nvarchar(100), @Value nvarchar(100))
WITH SCHEMABINDING, NATIVE_COMPILATION
AS BEGIN
	ATOMIC WITH (transaction isolation level = snapshot,  language = N'English')

	UPDATE xtp.Product
	SET Data = JSON_MODIFY(Data, @Property, @Value)
	WHERE ProductID = @ProductId;

END
```

## Next steps
JSON in in-memory OLTP native modules provides a performance improvement for the [built-in JSON functionality that's available in Azure SQL Database](sql-database-json-features).

To learn more about core scenarios for using JSON,
check out some of these resources:

* [TechNet Blog](https://blogs.technet.microsoft.com/dataplatforminsider/2016/01/05/json-in-sql-server-2016-part-1-of-4/)
* [MSDN documentation](https://msdn.microsoft.com/library/dn921897.aspx)
* [Channel 9 video](https://channel9.msdn.com/Shows/Data-Exposed/SQL-Server-2016-and-JSON-Support)

To learn about various scenarios for integrating JSON into your application, see the demos in this
[Channel 9 video](https://channel9.msdn.com/Events/DataDriven/SQLServer2016/JSON-as-a-bridge-betwen-NoSQL-and-relational-worlds)
or find a scenario that matches your use case in [JSON Blog posts](http://blogs.msdn.com/b/sqlserverstorageengine/archive/tags/json/). You can also find a number of examples in our
[GitHub repository](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/json/).
