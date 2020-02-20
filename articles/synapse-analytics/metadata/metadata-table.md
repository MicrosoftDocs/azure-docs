---
title: Azure Synapse Analytics' shared metadata tables 
description: Azure Synapse Analytics provides a shared metadata model where creating a table in Spark will make it accessible from its SQL on-demand and SQL pool engines without duplicating the data. 
services: sql-data-warehouse 
author: MikeRys 
ms.service: sql-data-warehouse 
ms.topic: overview 
ms.subservice: 
ms.date: 02/20/2020 
ms.author: mrys 
ms.reviewer: jrasnick
---

# Azure Synapse Analytics shared metadata tables

[!INCLUDE [synapse-analytics-preview-terms](../../includes/synapse-analytics-preview-terms.md)]

Azure Synapse Analytics allows the different computational engines of a workspace to share databases and tables between its Apache Spark pools, SQL on-demand engine, and SQL pools. 

Once a database has been created by a Spark job, you can create tables in it with Spark. These tables will immediately become available to be queried by any of the Azure Synapse workspace Spark pools and can be used from any of the Spark jobs subject to permissions. 

The Spark created managed and external tables are also made available as external tables with the same name in the corresponding synchronized database in SQL on-demand and in the corresponding `$`-prefixed schemas in the SQL pools that have their metadata synchronization enabled. [Exposing a Spark table in SQL](#Exposing-a-Spark-table-in-SQL) provides more detail on the table synchronization.

Since the tables are synchronized to SQL on-demand and the SQL pools asynchronously, there will be a delay until they appear.

Mapping of tables to external tables, data sources and file formats.

## Manage a Spark created table

[!INCLUDE [synapse-analytics-preview-features](../../includes/synapse-analytics-preview-features.md)]

Use Spark to manage Spark created databases. For example, delete it through a Spark pool job, and create tables in it from Spark. 

If you create objects in such a database from SQL on-demand or try to drop the database, the operation will succeed, but the original Spark database will not be changed.

If you try to drop the synchronized schema in a SQL pool, or try to create a table in it, Azure returns an error.

## Exposing a Spark table in SQL

[!INCLUDE [synapse-analytics-preview-features](../../includes/synapse-analytics-preview-features.md)]

### Which Spark tables are shared?

Spark provides two types of tables that Azure Synapse exposes in SQL automatically:

* Managed tables
  
    Spark provides many options for how to store data in managed tables, such as TEXT, CSV, JSON, JDBC, PARQUET, ORC, HIVE, DELTA, and LIBSVM. These files are normally stored in the `warehouse` directory where managed table data is stored.

* External tables

    Spark also provides ways to create external tables over existing data, either by providing the `LOCATION` option or using the Hive format. Such external tables can be over a variety of data formats, including Parquet.

Azure Synapse currently only shares managed and external Spark tables that store their data in Parquet format with the SQL engines. Tables backed by other formats are not automatically synced. You may have the ability to sync such tables explicitly yourself in your own SQL databases if the SQL engine supports the format.

### How are Spark tables shared?

The shareable managed and external Spark tables exposed in the SQL engines as external tables with the following properties:

* The SQL external table's data source is the data source representing the Spark table's location folder.
* The SQL external table's file format is Parquet.
* The SQL external table's access credential is pass-through.

Since all Spark table names are valid SQL table names and all Spark column names are valid SQL column names, the Spark table and column names will be used for the SQL external table.

Spark tables are providing different data types than the Synapse SQL engines. Thus the Spark table data types are mapped to the SQL types as follows:

|---|---|---|
| Spark data type | SQL data type | Comments |
|---|---|---|
| | |
|---|---|---|

[TODO: finish above table]

## Security model

[!INCLUDE [synapse-analytics-preview-features](../../includes/synapse-analytics-preview-features.md)]

The Spark databases and tables, as well as their synchronized representations in the SQL engines will be secured at the underlying storage level. Since they do not currently have permissions on the objects themselves, the objects can be seen in the object explorer.

The security principal who creates a managed table, is considered the owner of that table and has all the rights to the table as well as the underlying folders and files. In addition, the owner of the database will automatically become co-owner of the table.

If you create a Spark external table or a SQL external table with authentication pass-through, the data is only secured at the folder and file level. If someone queries such an external table, the security identity of the query submitter is passed down to the file system which will check for access rights. 

For more details on how to set permissions on the folders and files, see [Azure Synapse Analytics shared database](metadata-database.md).


## Examples

[TODO: replace database with table examples showing

- Managed Parquet and non-parquet table
- Managed partitioned Parquet table
- external table with parquet and csv
- Major data types
- Into SQL OD and into a SQL Pool
]

### Creating a Spark database and seeing it in SQL on-demand

[!INCLUDE [synapse-analytics-preview-features](../../includes/synapse-analytics-preview-features.md)]

First create a new Spark database named `mytestdb` using a Spark cluster you have already created in your workspace. You can achieve that for example using a Spark C# Notebook with the following .NET for Spark statement:

```csharp
	spark.Sql("CREATE DATABASE mytestdb")
```

This creates the Spark database. After a short delay, you can see the database from SQL on-demand. For example, run the following statement from SQL on-demand.

```sql
	SELECT * FROM sys.databases;
```

Verify that `mytestdb` is included in the results.

### Exposing a Spark database in a SQL pool

[!INCLUDE [synapse-analytics-preview-features](../../includes/synapse-analytics-preview-features.md)]

With the database created in the previous example, now create a SQL pool in your workspace named `mysqlpool` that enables metadata synchronization.

Run the following statement against the `mysqlpool` SQL pool:

```sql
	SELECT * FROM sys.schema;
```

Verify the schema for the newly created database in the results.

## Next steps
- [Learn more about Azure Synapse Analytics' shared metadata](metadata-overview.md)
- [Learn more about Azure Synapse Analytics' shared metadata Tables](metadata-table.md)
- [Learn more about the Synchronization with SQL Analytics on-demand](metadata-overview.md)
- [Learn more about the Synchronization with SQL Analytics pools](metadata-overview.md)
