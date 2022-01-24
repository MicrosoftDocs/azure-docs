---
title: Shared database
description: Azure Synapse Analytics provides a shared metadata model where creating a database in serverless Apache Spark pool will make it accessible from its serverless SQL pool and SQL pool engines. 
services: synapse-analytics 
ms.service: synapse-analytics  
ms.topic: overview
ms.subservice: metadata
ms.date: 10/05/2021
author: jasonwhowell
ms.author: jasonh
ms.reviewer: wiassaf
ms.custom: devx-track-csharp
---

# Azure Synapse Analytics shared Lake database

Azure Synapse Analytics allows the different computational workspace engines to share Lake databases and tables. Currently, the Lake databases and the tables (Parquet or CSV backed) that are created on the Apache Spark pools, [Database designer](../database-designer/concepts-lake-database.md) or Datavere are automatically shared with the serverless SQL pool engine.

A Lake database will become visible with that same name to all current and future Spark pools in the workspace, including the serverless SQL pool engine. You cannot add custom SQL objects (external tables, views, procedures, functions, schema, users) directly in a Lake database using the serverless SQL pool.

The Spark default database, called `default`, will also be visible in the serverless SQL pool context as a Lake database called `default`. 
You can't create a Lake database and then create another database with the same name in serverless SQL pool.

The Lake databases are created in the serverless SQL pool asynchronously, there will be a delay until they appear.

## Manage a Spark created database

To manage Spark created Lake databases, you can use Apache Spark pools. For example, create or delete a Lake database through a Spark pool job.

Objects in the Lake databases cannot be modified from a serverless SQL pool.

>[!NOTE]
>You cannot create multiple databases with the same name from different pools. If a SQL database in the serverless SQL pool is created, you won't be able to create a Lake database with the same name. Respectively, if you create a Lake database, you won't be able to create a serverless SQL pool database with the same name.

## Security model

The Lake databases and tables will be secured at the underlying storage level.

The security principal who creates a database is considered the owner of that database, and has all the rights to the database and its objects. `Synapse Administrator` and `Synapse SQL Administrator` will also have all the permissions on synchronized objects in serverless SQL pool by default. Creating custom objects (including users) in synchronized SQL databases is not allowed. 

To give a security principal, such as a user, Azure AD app or a security group, access to the underlying data used for external tables, you need to give them `read (R)` permissions on files (such as the table's underlying data files) and `execute (X)` on folder where the files are stored + on every parent folder up to the root. You can read more about these permissions on [Access control lists(ACLs)](../../storage/blobs/data-lake-storage-access-control.md) page. 

For example, in `https://<storage-name>.dfs.core.windows.net/<fs>/synapse/workspaces/<synapse_ws>/warehouse/mytestdb.db/myparquettable/`, security principals need to have `X` permissions on all the folders starting at the `<fs>` to the `myparquettable` and `R` permissions on `myparquettable` and files inside that folder, to be able to read a table in a database (synchronized or original one).

If a security principal requires the ability to create objects or drop objects in a database, additional `W` permissions are required on the folders and files in the `warehouse` folder. Modifying objects in a database is not possible from serverless SQL pool, only from Spark.

### SQL security model

Synapse workspace provides T-SQL endpoint that enables you to query the shared database using the serverless SQL pool. As a prerequisite, you need to enable a user to access shared databases in serverless SQL pool. There are two ways to allow a user to access the shared databases:
- You can assign a `Synapse SQL Administrator` workspace role or `sysadmin` server-level role in the serverless SQL pool. This role has a full control on all databases (note that the shared databases are still read-only even for the administrator role).
- You can grant `GRANT CONNECT ANY DATABASE` and `GRANT SELECT ALL USER SECURABLES` server-level permissions on serverless SQL pool to a login that will enable the login to access and read any database. This might be a good choice for assigning reader/non-admin access to a user.

Learn more about setting [access control on shared databases](../sql/shared-databases-access-control.md).

## Examples

### Create and connect to Spark database with serverless SQL pool

First create a new Spark database named `mytestdb` using a Spark cluster you have already created in your workspace. You can achieve that, for example, using a Spark C# Notebook with the following .NET for Spark statement:

```csharp
spark.Sql("CREATE DATABASE mytestdb")
```

After a short delay, you can see the database from serverless SQL pool. For example, run the following statement from serverless SQL pool.

```sql
SELECT * FROM sys.databases;
```

Verify that `mytestdb` is included in the results.

## Next steps

- [Learn more about Azure Synapse Analytics' shared metadata](overview.md)
- [Learn more about Azure Synapse Analytics' shared metadata Tables](table.md)
