---
title: Azure SQL Database JSON In-memory OLTP | Microsoft Docs
description: Azure SQL Database enables you to work with JSON text in memory-optimized tables and natively compiled stored procedures. 
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
Azure SQL Database enables you to [work with the text formatted as JSON](sql-database-json-features). In order to increase performance
of your OLTP queries that process JSON data, you can store JSON documents in memory-optimized tables using standard string columns (NVARCHAR type).
In the following example is shown a memory-optimized Product table with two JSON columns (Tags and Data):

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
Storing JSON data in memory-optimized tables enables you to increase query performance by leveraging lock-free, in-memory data access.
New features that are available in Azure SQL Database enable you to fully integrate JSON functionalities with the existing in-memory OLTP technology, such as:
 - Validate the structure of JSON documents stored in memory-optimized tables using natively compiled check constraints,
 - Expose and strongly type values stored in JSON documents using computed columns,
 - Index values in JSON documents using memory-optimized indexes,
 - Natively compile SQL queries that use values from JSON documents or format results as JSON text.

## Validation of JSON columns
Azure SQL Database enables you to add natively compiled check constraints that validates the content of JSON documents stored in the string columns:

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

Natively compiled check constraint may be added on the existing tables that contain JSON columns:

```
ALTER TABLE xtp.Product
ADD CONSTRAINT [Data should be JSON] CHECK (ISJSON(Data)=1)
```

With the natively compiled JSON check constraints you can ensure that JSON text stored in your memory-optimized tables is properly formatted.

## Exposing JSON values using computed columns
Computed columns enable you to expose values from the JSON text and access these values without re-evaluating expressions that fetch a value from the JSON text and re-parsing JSON structure. Exposed values are strongly typed and physically persisted in the computed columns. The following example shows how to expose the country where product is made and the product manufacturing cost values from the JSON Data column: 

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

Computed columns **MadeIn** and **Cost** will be updated on every change of JSON document stored in *Data* column. Accessing JSON values using persisted computed columns is faster than accessing values in JSON document.

## Indexing values in JSON columns
Azure SQL Database enables you to index values in JSON columns using memory optimized indexes. JSON values that are indexed must be exposed and strongly typed using computed columns:

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
Values in JSON columns can be indexed using both standard NONCLUSTERED and HASH indexes. NONCLUSTERED will optimize queries that select ranges of rows by some JSON values or sort results by JSON values, while HASH indexes give you optimal performance when a single or a few rows should be fetched by specifying the exact value that should be found.

## Native compilation of JSON queries
Finally, a native compilation of T-SQL procedures, functions, and triggers that contain queries with JSON functions increases performance of queries and reduces CPU cycles required to execute procedure. An example of the natively compiled procedures that use JSON functions is shown in the following example:
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
JSON in in-memory OLTP native modules is performance improvement of standard JSON functionalities that are 
[available in Azure SQL Database](sql-database-json-features). If you are interested about core scenarios when to use JSON,
check out some of these resources:

* [TechNet Blog](https://blogs.technet.microsoft.com/dataplatforminsider/2016/01/05/json-in-sql-server-2016-part-1-of-4/)
* [MSDN documentation](https://msdn.microsoft.com/library/dn921897.aspx)
* [Channel 9 video](https://channel9.msdn.com/Shows/Data-Exposed/SQL-Server-2016-and-JSON-Support)

To learn about various scenarios for integrating JSON into your application, see the demos in this
[Channel 9 video](https://channel9.msdn.com/Events/DataDriven/SQLServer2016/JSON-as-a-bridge-betwen-NoSQL-and-relational-worlds)
or find a scenario that matches your use case in [JSON Blog posts](http://blogs.msdn.com/b/sqlserverstorageengine/archive/tags/json/).
Also, you can find a number of examples in our
[GitHub repository](https://github.com/Microsoft/sql-server-samples/tree/master/samples/features/json/).