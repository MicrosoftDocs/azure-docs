---
title: Azure Synapse Analytics shared database 
description: Azure Synapse Analytics provides a shared metadata model where creating a database in Apache Spark will make it accessible from its SQL on-demand (preview) and SQL pool engines. 
services: synapse-analytics 
author: MikeRys
ms.service: synapse-analytics  
ms.topic: overview
ms.subservice: 
ms.date: 04/15/2020
ms.author: mrys 
ms.reviewer: jrasnick
---

# Azure Synapse Analytics shared database

Azure Synapse Analytics allows the different computational workspace engines to share databases and tables between its Spark pools (preview), SQL on-demand (preview) engine, and SQL pools.

[!INCLUDE [synapse-analytics-preview-terms](../../../includes/synapse-analytics-preview-terms.md)]

A database created with a Spark job will become visible with that same name to all current and future Spark pools (preview) in the workspace as well as the SQL on-demand engine.

If there are SQL pools in the workspace that have metadata synchronization enabled, or if you create a new SQL pool with the metadata synchronization enabled, these Spark created databases are automatically mapped into special schemas in the SQL pool database. 

Each schema is named after the Spark database name with an additional `$` prefix. Both the external and managed tables in the Spark-generated database are exposed as external tables in the corresponding special schema.

The Spark default database, called `default`, will also be visible in the SQL on-demand context as a database called `default`, and in any of the SQL pool databases with metadata synchronization turned on as the schema `$default`.

Since the databases are synchronized to SQL on-demand and the SQL pools asynchronously, there will be a delay until they appear.

## Manage a Spark created database

[!INCLUDE [synapse-analytics-preview-features](../../../includes/synapse-analytics-preview-features.md)]

Use Spark to manage Spark created databases. For example, delete it through a Spark pool job, and create tables in it from Spark.

If you create objects in a Spark created database using SQL on-demand, or try to drop the database, the operation will succeed. But, the original Spark database won't be changed.

If you try to drop the synchronized schema in a SQL pool, or try to create a table in it, Azure returns an error.

## Handling of name conflicts

[!INCLUDE [synapse-analytics-preview-features](../../../includes/synapse-analytics-preview-features.md)]

If the name of a Spark database conflicts with the name of an existing SQL on-demand database, a suffix is appended in SQL on-demand to the Spark database. The suffix in SQL on-demand is `_<workspace name>-ondemand-DefaultSparkConnector`.

For example, if a Spark database called `mydb` gets created in the Azure Synapse workspace `myws` and a SQL on-demand database with that name already exists, then the Spark database in SQL on-demand will have to be referenced using the name `mydb_myws-ondemand-DefaultSparkConnector`.

> [!CAUTION]
> Caution: You should not take a dependency on this behavior.

## Security model

[!INCLUDE [synapse-analytics-preview-features](../../../includes/synapse-analytics-preview-features.md)]

The Spark databases and tables, along with their synchronized representations in the SQL engines will be secured at the underlying storage level.

The security principal who creates a database is considered the owner of that database, and has all the rights to the database and its objects.

To give a security principal, such as a user or a security group, access to a database, provide the appropriate POSIX folder and file permissions to the underlying folders and files in the `warehouse` directory. 

For example, in order for a security principal to read a table in a database, all the folders starting at the database folder in the `warehouse` directory need to have `X` and `R` permissions assigned to that security principal. Additionally, files (such as the table's underlying data files) require `R` permissions. 

If a security principal requires the ability to create objects or drop objects in a database, additional `W` permissions are required on the folders and files in the `warehouse` folder.

## Examples

### Create & connect to Spark database - SQL on-demand

[!INCLUDE [synapse-analytics-preview-features](../../../includes/synapse-analytics-preview-features.md)]

First create a new Spark database named `mytestdb` using a Spark cluster you have already created in your workspace. You can achieve that, for example,  using a Spark C# Notebook with the following .NET for Spark statement:

```csharp
spark.Sql("CREATE DATABASE mytestdb")
```

After a short delay, you can see the database from SQL on-demand. For example, run the following statement from SQL on-demand.

```sql
SELECT * FROM sys.databases;
```

Verify that `mytestdb` is included in the results.

### Exposing a Spark database in a SQL pool

[!INCLUDE [synapse-analytics-preview-features](../../../includes/synapse-analytics-preview-features.md)]

With the database created in the previous example, now create a SQL pool in your workspace named `mysqlpool` that enables metadata synchronization.

Run the following statement against the `mysqlpool` SQL pool:

```sql
SELECT * FROM sys.schema;
```

Verify the schema for the newly created database in the results.

## Next steps

- [Learn more about Azure Synapse Analytics' shared metadata](overview.md)
- [Learn more about Azure Synapse Analytics' shared metadata Tables](table.md)

<!-- - [Learn more about the Synchronization with SQL Analytics on-demand](overview.md)
- [Learn more about the Synchronization with SQL Analytics pools](overview.md)-->
