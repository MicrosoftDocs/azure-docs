<properties
   pageTitle="User-defined schemas in SQL Data Warehouse | Microsoft Azure"
   description="Tips for using Transact-SQL schemas in Azure SQL Data Warehouse for developing solutions."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="jrowlandjones"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/14/2016"
   ms.author="jrj;barbkess;sonyama"/>

# User-defined schemas in SQL Data Warehouse

Traditional data warehouses often use separate databases to create application boundaries based on either workload, domain or security. For example, a traditional SQL Server data warehouse might include a staging database, a data warehouse database, and some data mart databases. In this topology each database operates as a workload and security boundary in the architecture.

By contrast, SQL Data Warehouse runs the entire data warehouse workload within one database. Cross database joins are not permitted. Therefore SQL Data Warehouse expects all tables used by the warehouse to be stored within the one database.

> [AZURE.NOTE] SQL Data Warehouse does not support cross database queries of any kind. Consequently, data warehouse implementations that leverage this pattern will need to be revised.

## Recommendations

These are recommendations for consolidating workloads, security, domain and functional boundaries by using user defined schemas

1. Use one SQL Data Warehouse database to run your entire data warehouse workload
2. Consolidate your existing data warehouse environment to use one SQL Data Warehouse database
3. Leverage **user-defined schemas** to provide the boundary previously implemented using databases.

If user-defined schemas have not been used previously then you have a clean slate. Simply use the old database name as the basis for your user-defined schemas in the SQL Data Warehouse database.

If schemas have already been used then you have a few options:

1. Remove the legacy schema names and start fresh
2. Retain the legacy schema names by pre-pending the legacy schema name to the table name
3. Retain the legacy schema names by implementing views over the table in an extra schema to re-create the old schema structure.

> [AZURE.NOTE] On first inspection option 3 may seem like the most appealing option. However, the devil is in the detail. Views are read only in SQL Data Warehouse. Any data or table modification would need to be performed against the base table. Option 3 also introduces a layer of views into your system. You might want to give this some additional thought if you are using views in your architecture already.


### Examples:

Implement user-defined schemas based on database names

```sql
CREATE SCHEMA [stg]; -- stg previously database name for staging database
GO
CREATE SCHEMA [edw]; -- edw previously database name for the data warehouse
GO
CREATE TABLE [stg].[customer] -- create staging tables in the stg schema
(       CustKey BIGINT NOT NULL
,       ...
);
GO
CREATE TABLE [edw].[customer] -- create data warehouse tables in the edw schema
(       CustKey BIGINT NOT NULL
,       ...
);
```

Retain legacy schema names by pre-pending them to the table name. Use schemas for the workload boundary.

```sql
CREATE SCHEMA [stg]; -- stg defines the staging boundary
GO
CREATE SCHEMA [edw]; -- edw defines the data warehouse boundary
GO
CREATE TABLE [stg].[dim_customer] --pre-pend the old schema name to the table and create in the staging boundary
(       CustKey BIGINT NOT NULL
,       ...
);
GO
CREATE TABLE [edw].[dim_customer] --pre-pend the old schema name to the table and create in the data warehouse boundary
(       CustKey BIGINT NOT NULL
,       ...
);
```

Retain legacy schema names using views

```sql
CREATE SCHEMA [stg]; -- stg defines the staging boundary
GO
CREATE SCHEMA [edw]; -- stg defines the data warehouse boundary
GO
CREATE SCHEMA [dim]; -- edw defines the legacy schema name boundary
GO
CREATE TABLE [stg].[customer] -- create the base staging tables in the staging boundary
(       CustKey	BIGINT NOT NULL
,       ...
)
GO
CREATE TABLE [edw].[customer] -- create the base data warehouse tables in the data warehouse boundary
(       CustKey	BIGINT NOT NULL
,       ...
)
GO
CREATE VIEW [dim].[customer] -- create a view in the legacy schema name boundary for presentation consistency purposes only
AS
SELECT  CustKey
,       ...
FROM	[edw].customer
;
```

> [AZURE.NOTE] Any change in schema strategy needs a review of the security model for the database. In many cases you might be able to simplify the security model by assigning permissions at the schema level. If more granular permissions are required then you can use database roles.

## Next steps
For more development tips, see [development overview][].

<!--Image references-->

<!--Article references-->
[development overview]: sql-data-warehouse-overview-develop.md

<!--MSDN references-->

<!--Other Web references-->
