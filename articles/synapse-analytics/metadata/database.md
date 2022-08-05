---
title: Lake database in serverless SQL pools
description: Azure Synapse Analytics provides a shared metadata model where creating a Lake database in an Apache Spark pool will make it accessible from its serverless SQL pool engine. 
services: synapse-analytics 
ms.service: synapse-analytics  
ms.topic: overview
ms.subservice: metadata
ms.date: 10/05/2021
author: juluczni
ms.author: juluczni
ms.reviewer: wiassaf
ms.custom: devx-track-csharp
---

# Accessing Lake database using serverless SQL pool

Azure synapse analytics workspace enables you to create two types of databases on top of Data Lake: 
- **Lake databases** where you can define your tables on top of lake data using Apache Spark notebooks, Database templates, or Data Verse. These tables will be available for querying using T-SQL (Transact-SQL) language using the serverless SQL pool. 
-	**SQL databases** where you can define your own databases and tables directly using the serverless SQL pools. You can use T-SQL CREATE DATABASE, CREATE EXTERNAL TABLE to define the objects and add additional SQL views, procedures, and inline-table-value functions on top of the tables. 

Azure Synapse Analytics allows you to create [Lake databases](../database-designer/concepts-lake-database.md) and tables using Spark or Database designer, and then analyze data in the Lake databases using the serverless SQL pool. The Lake databases and the tables (Parquet or CSV backed) that are created on the Apache Spark pools, [Database templates](../database-designer/concepts-database-templates.md) or Data verse are automatically available for querying with the serverless SQL pool engine. The Lake databases and tables that are modified will be available in serverless SQL pool after some time. There will be a delay until the changes made in Spark or Database designed appear in serverless.

## Manage Lake database

To manage Spark created Lake databases, you can use Apache Spark pools or [Database designer](../database-designer/create-empty-lake-database.md). For example, create or delete a Lake database through a Spark pool job.

The Spark default database, called `default`, is available in the serverless SQL pool context as a Lake database called `default`. 
You can't create a Lake database and or the objects in the Lake databases using the serverless SQL pool.

Objects in the Lake databases cannot be modified from a serverless SQL pool. Use [Database designer](../database-designer/modify-lake-database.md) or Apache Spark pools to modify the Lake databases.

>[!NOTE]
> You cannot create Lake and SQL databases with the same name. If a SQL database in the serverless SQL pool is created, you won't be able to create a Lake database with the same name. Respectively, if you create a Lake database, you won't be able to create a serverless SQL pool database with the same name.

## Security model

The Lake databases and tables are secured at two levels:
- The underlying storage layer by assigning RBAC/ABAC role or ACL permissions to the Azure AD users.
- The SQL layer where you can define could an Azure AD user select data from the tables that are referencing the lake data.

## Lake security model

Access to Lake database files is controlled using the Lake permissions on storage layer. Only Azure AD users can use tables in the Lake databases, and they can access the data in the lake using their own identities.

To give a security principal, such as a user, Azure AD app, or a security group, access to the underlying data used for external tables, you need to give them `read (R)` permissions on files (such as the table's underlying data files) and `execute (X)` on the folder where the files are stored + on every parent folder up to the root. You can read more about these permissions on [Access control lists(ACLs)](../../storage/blobs/data-lake-storage-access-control.md) page. 

For example, in `https://<storage-name>.dfs.core.windows.net/<fs>/synapse/workspaces/<synapse_ws>/warehouse/mytestdb.db/myparquettable/`, security principals need to have `X` permissions on all the folders starting at the `<fs>` to the `myparquettable` and `R` permissions on `myparquettable` and files inside that folder, to be able to read a table in a database (synchronized or original one).

If a security principal requires the ability to create objects or drop objects in a database, additional `W` permissions are required on the folders and files in the `warehouse` folder. Modifying objects in a database is not possible from serverless SQL pool, only from Spark pools and [database designer](../database-designer/modify-lake-database.md).

### SQL security model

Synapse workspace provides a T-SQL endpoint that enables you to query the Lake database using the serverless SQL pool. In addition to the data access, SQL interface enables you to control who can access the tables. You need to enable a user to access the shared Lake databases using the serverless SQL pool. There are two types of users who can access the Lake databases:
- **Administrators** - You can assign a `Synapse SQL Administrator` workspace role or `sysadmin` server-level role in the serverless SQL pool. This role has full control over all databases. `Synapse Administrator` and `Synapse SQL Administrator` will also have all the permissions on all objects in a serverless SQL pool by default. 
- **Readers** - you can grant `GRANT CONNECT ANY DATABASE` and `GRANT SELECT ALL USER SECURABLES` server-level permissions on serverless SQL pool to a login that will enable the login to access and read any database. This might be a good choice for assigning reader/non-admin access to a user.
  - 
Learn more about [setting access control on shared databases here](../sql/shared-databases-access-control.md).

## Custom SQL objects in Lake databases

Lake databases allow creation of custom T-SQL objects, such as schemas, procedures, views, and the inline table-value functions (iTVFs). In order to create custom SQL objects, you **MUST** create a schema where you will place the objects. Custom SQL objects cannot be placed in `dbo` schema because it is reserved for the lake tables that are defined in Spark, Database designer, or Data Verse.

The following example shows how to create custom view, procedure, and iTVF in the report schema:

```sql
CREATE SCHEMA reports
GO

CREATE OR ALTER VIEW reports.GreenReport
AS SELECT puYear, puMonth,
			fareAmount = SUM(fareAmount),
			tipAmount = SUM(tipAmount),
			mtaTax = SUM(mtaTax)
FROM dbo.green
GROUP BY puYear, puMonth
GO

CREATE OR ALTER PROCEDURE reports.GreenReportSummary
AS BEGIN
SELECT puYear, puMonth,
			fareAmount = SUM(fareAmount),
			tipAmount = SUM(tipAmount),
			mtaTax = SUM(mtaTax)
FROM dbo.green
GROUP BY puYear, puMonth
END
GO

CREATE OR ALTER FUNCTION reports.GreenDataReportMonthly(@year int)
RETURNS TABLE
RETURN ( SELECT puYear = @year, puMonth,
				fareAmount = SUM(fareAmount),
				tipAmount = SUM(tipAmount),
				mtaTax = SUM(mtaTax)
		FROM dbo.green
		WHERE puYear = @year
		GROUP BY puMonth )
GO
```

>[!IMPORTANT]
> You must create custom SQL schema where you will place your SQL objects. The custom SQL objects cannot be placed in the `dbo` schema. The `dbo` schema is reserved for the lake tables that are originally created in Spark or database designer.

## Examples

### Create and connect to Spark database with serverless SQL pool

First create a new Spark database named `mytestdb` using a Spark cluster you have already created in your workspace. You can achieve that, for example, using a Spark C# Notebook with the following .NET for Spark statement:

```csharp
spark.Sql("CREATE DATABASE mytestlakedb")
```

After a short delay, you can see the Lake database from serverless SQL pool. For example, run the following statement from serverless SQL pool.

```sql
SELECT * FROM sys.databases;
```

Verify that `mytestlakedb` is included in the results.

## Next steps

- [Learn more about Azure Synapse Analytics' shared metadata](overview.md)
- [Learn more about Azure Synapse Analytics' shared metadata Tables](table.md)
