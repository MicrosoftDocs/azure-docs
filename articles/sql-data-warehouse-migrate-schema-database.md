<properties
   pageTitle="Schema migration tutorial | Microsoft Azure"
   description="Steps for migrating your SQL Server schema to SQL Data Warehouse."
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="05/09/2015"
   ms.author="JRJ@BigBangData.co.uk;barbkess"/>

# Schema migration tutorial
As part of your data migration you will probably need to consolidate multiple databases into a single database with multiple schemas. This tutorial steps through migrating your SQL Server database schemas to SQL Data Warehouse.

## Read this first

Traditional data warehouses often use separate databases to create application boundaries based on either workload, domain or security. For example, a traditional SQL Server data warehouse might include a staging database, a data warehouse database, and some data mart databases. In this topology each database operates as a workload and security boundary in the architecture.

By contrast, SQLDW runs the entire data warehouse workload within one service. Each service contains one user database. Therefore SQLDW expects all tables used by the warehouse to be stored within the service, which means all user tables are stored within one database.

SQLDW does not support cross database queries of any kind. Consequently, data warehouse implementations that leverage this pattern will need to be revised.

### Recommendations ###

1. Consolidate databases that you plan to join together into one SQL Data Warehouse database.
2. Leverage **user-defined schemas** to provide the boundaries that your existing system defines by using databases. 

> [AZURE.NOTE] Your total solution will most likely include multiple SQL Data Warehouse databases. For example, you could use separate SQL Data Warehouse databases for test and development, production, and data marts. 

## Step 1: Retrieve the source schema

To retrieve the schema for your existing SQL Server database:

1. Open SQL Server Management Studio (SSMS)
2. Right-click your database
3. Choose View DDL
4. Copy the DDL into a new query window.


## Step 2: Modify database schema names

To consolidate multiple databases into one database, you will need to define each database as one of the schemas within a SQL Data Warehouse user database. These examples show you some options for how to do this. 

### Example A. A simple database schema that requires no modifications.

If you just want to migrate one user database into one SQL Data Warehouse database, you don't need to modify the database schema. This example shows a database schema for SQL Server that does not require any modifications. You could create these schemas as is.

```

```

### Example B. Use the existing database name to define schema names in SQL Data Warehouse
 
This example creates two user-defined schemas, stg and edw, to consolidate a staging database and an edw database into one SQL Data Warehouse database. Each database is represented by one schema.

```
CREATE SCHEMA [stg];
GO
CREATE SCHEMA [edw];
GO
CREATE TABLE [stg].[dim_customer]
(       CustKey BIGINT NOT NULL
,       ...
);
GO
CREATE TABLE [edw].[dim_customer]
(       CustKey BIGINT NOT NULL
,       ...
);
```

This approach works if neither database has more than one schema. For example, if the staging database only has the dbo schema, everything that was in the dbo schema needs to migrate to the stg schema.


### Example C. Pre-pend the database name to the schema name.

Typically, the source database has more than one schema. You can keep them as distinct schemas in the migration by pre-pending the database name to the schema.

```
CREATE SCHEMA [stg_dbo];
CREATE SCHEMA [stg_cus];
GO
CREATE SCHEMA [edw_dbo];
CREATE SCHEMA [edw_cus];
GO
CREATE TABLE [stg_dbo].[fact_internet_sales]
(       CustKey BIGINT NOT NULL
,       ...
);
GO

CREATE TABLE [stg_cus].[dim_customer]
(       CustKey BIGINT NOT NULL
,       ...
);
GO
CREATE TABLE [edw_dbo].[fact_internet_sales]
(       CustKey BIGINT NOT NULL
,       ...
);
GO

CREATE TABLE [edw_cus].[dim_customer]
(       CustKey BIGINT NOT NULL
,       ...
);
GO
```

### Example D: Start fresh with new schema names

You can always start fresh with new names that are shorter or are more descriptive of your data warehouse design. This example creates new names for all the schemas.

```
CREATE TABLE [stg1].[fact_internet_sales]
(       CustKey BIGINT NOT NULL
,       ...
);
GO

CREATE TABLE [stg2].[dim_customer]
(       CustKey BIGINT NOT NULL
,       ...
);
GO

CREATE TABLE [edw1].[fact_internet_sales]
(       CustKey BIGINT NOT NULL
,       ...
);
GO

CREATE TABLE [edw2].[dim_customer]
(       CustKey BIGINT NOT NULL
,       ...
);
GO

```

## Step 3: Create the new schema in SQL Data Warehouse

Now that you have identified the new schemas, you are ready to create them in your SQL Data Warehouse database. 

### Example A. Create schemas with SQL Server Data Tools


### Example B. Create schemas with sqlcmd


### Example C. Create schemas with PowerShell


## Step 4: Update scripts to use the new schema names
Your existing SQL Server system probably has scripts and processes that use the source database and schema name. You need to update those scripts to use the new schema names so they will work with SQL Data Warehouse.

You can do that now, or wait until you also have created the table definitions since those might change too.  

> [AZURE.NOTE] Any change in schema strategy needs a review of the security model for the database. In many cases you might be able to simplify the security model by assigning permissions at the schema level. If more granular permissions are required then you can use database roles.


## Next steps

Create your table definitions.






