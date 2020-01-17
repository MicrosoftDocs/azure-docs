---
title: Azure Synapse Analytics shared database 
description: Azure Synapse Analytics provides a shared metadata model where creating a database in Spark will make it accessible from its SQL on-demand and SQL pool engines. 
services: sql-data-warehouse 
author: MikeRys
ms.service: sql-data-warehouse 
ms.topic: overview
ms.subservice: design
ms.date: 01/16/2020
ms.author: mrys 
ms.reviewer: jrasnick
---

# Azure Synapse Analytics shared database

Azure Synapse Analytics allows the different computational engines of a workspace to share databases and tables between its Apache Spark pools, SQL on-demand engine and SQL pools. 

Once a database has been created with a Spark job, that database will become visible as a database with that same name to all current and future Spark pools in the workspace as well as the SQL on-demand engine. 

If there are SQL pools in the workspace that have their metadata synchronization enabled or if a new SQL pool is being created with the metadata synchronization enabled, these Spark created databases will be mapped automatically into the SQL pool's database to special schemas inside the SQL pool's database. Each such schema is named after the Spark database name with an additional `$` prefix. Both the external and managed tables in the Spark generated database are exposed as external tables in the corresponding special schema. 

The Spark's default database, called `default`, will also be visible in the SQL on-demand context as a database called `default`, and in any of the SQL pool databases with metadata synchronization turned on as the schema `$default`.

Since the databases are synchronized to SQL on-demand and the SQL pools asynchronously, there will be a delay until they appear.

## Managing a created Azure Synapse database

We strongly advise you to use Spark to manage such a database. You should only delete it through a Spark pool job and should only create tables in it from Spark. 

If you create objects in such a database from SQL on-demand or try to drop the database, the operation will succeed, but the original Spark database will not be changed.

If you try to drop the synchronized schema in a SQL Pool or try to create a table in it, an error will be raised.

Note that this behavior may change in a future release by restricting any operation beyond reading to the original computational engine only.

## Handling of name conflicts

During public preview, it can happen that the name of a Spark database can conflict with the name of an existing SQL on-demand database. In this case, the Spark database will be exposed in SQL on-demand with a different name, that got created by adding a post-fix of the form `_<workspace name>-ondemand-DefaultSparkConnector` to the Spark database name. 

For example, if a Spark database called `mydb` gets created in the Azure Synapse workspace `myws` and a SQL on-demand database with that name already exists, then the Spark database in SQL on-demand will have to be referenced using the name `mydb_myws-ondemand-DefaultSparkConnector`.

Note that this behavior may change in a future release by raising an error during creation of a database with a conflicting name. 

## Security model

In the current public preview, the Spark databases and tables, as well as their synchronized representations in the SQL engines will be secured at the underlying storage level. 

The security principal who creates a database, is considered the owner of that database and has all the rights to the database and its object.

In order to give a security principal, e.g., a user or a security group, access to a database, you want to provide the appropriate POSIX folder and file permissions to the underlying folders and files in the `warehouse` directory. For example, in order for a security principal to be able to read a table in a database, all the folders starting at the database folder in the `warehouse` directory need to have X and R permissions assigned to that security principal and files (such as the table's underlying data files) require R permissions. If a security principal requires the ability to create objects or drop objects in a database, additional W permissions are required on the folders and files in the `warehouse` folder.

## Examples

### Creating a Spark database and seeing it in SQL on-demand

First create a new Spark database named `mytestdb` using a Spark cluster you have already created in your workspace. You can achieve that for example using a Spark C# Notebook with the following .NET for Spark statement:

	spark.Sql("CREATE DATABASE mytestdb")

This will create the Spark database and, after a short delay, will allow you to see the database from SQL on-demand. For example, run the following statement from SQL on-demand

	SELECT * FROM sys.databases;

and you should see the database `mytestdb` in its result.

### Exposing a Spark database in a SQL pool

With the database created in the previous example, now create a SQL pool in your workspace named `mysqlpool` that enables metadata synchronization.

If you now run the following statement against the `mysqlpool` SQL pool 

	SELECT * FROM sys.schema;

you should see a newly created 

## Next steps
- [Learn more about Azure Synapse Analytics' shared metadata](metadata-overview.md)
- [Learn more about Azure Synapse Analytics' shared metadata Tables](metadata-table.md)
- [Learn more about the Synchronization with SQL Analytics on-demand](metadata-overview.md)
- [Learn more about the Synchronization with SQL Analytics pools](metadata-overview.md)
