---
title: Shared database
description: Azure Synapse Analytics provides a shared metadata model where creating a database in serverless Apache Spark pool will make it accessible from its serverless SQL pool and SQL pool engines. 
services: synapse-analytics 
author: MikeRys
ms.service: synapse-analytics  
ms.topic: overview
ms.subservice: metadata
ms.date: 05/01/2020
ms.author: mrys 
ms.reviewer: jrasnick
ms.custom: devx-track-csharp
---

# Azure Synapse Analytics shared database

Azure Synapse Analytics allows the different computational workspace engines to share databases and tables. Currently, the databases and the tables (Parquet or CSV backed) that are created on the Apache Spark pools are automatically shared with the serverless SQL pool engine.

A database created with a Spark job will become visible with that same name to all current and future Spark pools in the workspace, including the serverless SQL pool engine. You cannot add custom objects (external tables, views, procedures) directly in this replicated database using the serverless SQL pool.

The Spark default database, called `default`, will also be visible in the serverless SQL pool context as a database called `default`. 
You can't create a database in Spark and then create another database with the same name in serverless. Eligible objects will get synced.

Since the databases are synchronized to serverless SQL pool asynchronously, there will be a delay until they appear.

## Manage a Spark created database

Use Spark to manage Spark created databases. For example, delete it through a Spark pool job, and create tables in it from Spark.

If you create objects in a Spark created database using serverless SQL pool, or try to drop the database, the operation will succeed. But, the original Spark database won't be changed.

## Security model

The Spark databases and tables, along with their synchronized representations in the SQL engine will be secured at the underlying storage level.

The security principal who creates a database is considered the owner of that database, and has all the rights to the database and its objects. Synapse Administrator and Synapse SQL Administrator will also have all the permissions on synchronized objects in serverless SQL pool by default. Creating custom objects (including users) in replicated SQL databases is not allowed. 

To give a security principal, such as a user, Azure AD app or a security group, access to the underlying data used for external tables, you need to give them `read (R)` permissions on files (such as the table's underlying data files) and `execute (X)` on folder where the files are stored + on every parent folder up to the root. You can read more about these permissions on [Access control lists(ACLs)](/azure/storage/blobs/data-lake-storage-access-control) page. 

For example, in `https://<storage-name>.dfs.core.windows.net/<fs>/synapse/workspaces/<synapse_ws>/warehouse/mytestdb.db/myparquettable/`, security principals need to have `X` permissions on all the folders starting at the `<fs>` to the `myparquettable` and `R` permissions on `myparquettable` and files inside that folder, to be able to read a table in a database (synchronized or original one).

If a security principal requires the ability to create objects or drop objects in a database, additional `W` permissions are required on the folders and files in the `warehouse` folder. Modifying objects in a database is not possible from serverless SQL pool, only from Spark.

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
