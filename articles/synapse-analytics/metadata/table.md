---
title: Shared metadata tables
description: Azure Synapse Analytics provides a shared metadata model where creating a table in serverless Apache Spark pool will make it accessible from serverless SQL pool and dedicated SQL pool without duplicating the data. 
services: sql-data-warehouse 
ms.service:  synapse-analytics 
ms.topic: overview 
ms.subservice: metadata
ms.date: 10/13/2021
author: juluczni
ms.author: juluczni
ms.reviewer: wiassaf
ms.custom: devx-track-csharp
---

# Azure Synapse Analytics shared metadata tables


Azure Synapse Analytics allows the different workspace computational engines to share databases and tables between its Apache Spark pools and serverless SQL pool.

Once a database has been created by a Spark job, you can create tables in it with Spark that use Parquet, Delta, or CSV as the storage format. Table names will be converted to lower case and need to be queried using the lower case name. These tables will immediately become available for querying by any of the Azure Synapse workspace Spark pools. They can also be used from any of the Spark jobs subject to permissions.

The Spark created, managed, and external tables are also made available as external tables with the same name in the corresponding synchronized database in serverless SQL pool. [Exposing a Spark table in SQL](#expose-a-spark-table-in-sql) provides more detail on the table synchronization.

Since the tables are synchronized to serverless SQL pool asynchronously, there will be a small delay until they appear.

## Manage a Spark created table

Use Spark to manage Spark created databases. For example, delete it through a serverless Apache Spark pool job, and create tables in it from Spark.

Objects in synchronized databases cannot be modified from serverless SQL pool.

## Expose a Spark table in SQL

### Shared Spark tables

Spark provides two types of tables that Azure Synapse exposes in SQL automatically:

- Managed tables

  Spark provides many options for how to store data in managed tables, such as TEXT, CSV, JSON, JDBC, PARQUET, ORC, HIVE, DELTA, and LIBSVM. These files are normally stored in the `warehouse` directory where managed table data is stored.

- External tables

  Spark also provides ways to create external tables over existing data, either by providing the `LOCATION` option or using the Hive format. Such external tables can be over a variety of data formats, including Parquet.

Azure Synapse currently only shares managed and external Spark tables that store their data in Parquet, DELTA, or CSV format with the SQL engines. Tables backed by other formats are not automatically synced. You may be able to sync such tables explicitly yourself as an external table in your own SQL database if the SQL engine supports the table's underlying format.

> [!NOTE] 
> Currently, only Parquet and CSV formats are fully supported in serverless SQL pool. Spark Delta tables are also available in the serverless SQL pool, but this feature is in **public preview**. External tables created in Spark are not available in dedicated SQL pool databases.

### Share Spark tables

The shareable managed and external Spark tables exposed in the SQL engine as external tables with the following properties:

- The SQL external table's data source is the data source representing the Spark table's location folder.
- The SQL external table's file format is Parquet, Delta, or CSV.
- The SQL external table's access credential is pass-through.

Since all Spark table names are valid SQL table names and all Spark column names are valid SQL column names, the Spark table and column names will be used for the SQL external table.

Spark tables provide different data types than the Synapse SQL engines. The following table maps Spark table data types map to the SQL types:

| Spark data type | SQL data type | Comments |
|---|---|---|
| `LongType`, `long`, `bigint`                | `bigint`              | **Spark**: *LongType* represents 8-byte signed integer numbers.<BR>**SQL**: See [int, bigint, smallint, and tinyint](/sql/t-sql/data-types/int-bigint-smallint-and-tinyint-transact-sql).|
| `BooleanType`, `boolean`                    | `bit` (Parquet), `varchar(6)` (CSV)  | **Spark**: Boolean.<BR>**SQL**: See [/sql/t-sql/data-types/bit-transact-sql).|
| `DecimalType`, `decimal`, `dec`, `numeric`  | `decimal`             | **Spark**: *DecimalType* represents arbitrary-precision signed decimal numbers. Backed internally by java.math.BigDecimal. A BigDecimal consists of an arbitrary precision integer unscaled value and a 32-bit integer scale. <br> **SQL**: Fixed precision and scale numbers. When maximum precision is used, valid values are from - 10^38 +1 through 10^38 - 1. The ISO synonyms for decimal are dec and dec(p, s). numeric is functionally identical to decimal. See [decimal and numeric](/sql/t-sql/data-types/decimal-and-numeric-transact-sql). |
| `IntegerType`, `Integer`, `int`             | `int`                 | **Spark** *IntegerType* represents 4-byte signed integer numbers. <BR>**SQL**: See [int, bigint, smallint, and tinyint](/sql/t-sql/data-types/int-bigint-smallint-and-tinyint-transact-sql).|
| `ByteType`, `Byte`, `tinyint`               | `smallint`            | **Spark**: *ByteType* represents 1-byte signed integer numbers [-128 to 127] and ShortType represents 2-byte signed integer numbers [-32768 to 32767]. <br> **SQL**: Tinyint represents 1-byte signed integer numbers [0, 255] and smallint represents 2-byte signed integer numbers [-32768, 32767]. See [int, bigint, smallint, and tinyint](/sql/t-sql/data-types/int-bigint-smallint-and-tinyint-transact-sql).|
| `ShortType`, `Short`, `smallint`            | `smallint`            | Same as above. |
| `DoubleType`, `Double`                      | `float`               | **Spark**: *DoubleType* represents 8-byte double-precision floating point numbers. **SQL**: See [float and real](/sql/t-sql/data-types/float-and-real-transact-sql).|
| `FloatType`, `float`, `real`                | `real`                | **Spark**: *FloatType* represents 4-byte double-precision floating point numbers. **SQL**: See [float and real](/sql/t-sql/data-types/float-and-real-transact-sql).|
| `DateType`, `date`                          | `date`                | **Spark**: *DateType* represents values comprising values of fields year, month and day, without a time-zone.<BR>**SQL**: See [date](/sql/t-sql/data-types/date-transact-sql).|
| `TimestampType`, `timestamp`                | `datetime2`           | **Spark**: *TimestampType* represents values comprising values of fields year, month, day, hour, minute, and second, with the session local time-zone. The timestamp value represents an absolute point in time.<BR>**SQL**: See [datetime2](/sql/t-sql/data-types/datetime2-transact-sql). |
| `char`                                      | `char`                |
| `StringType`, `String`, `varchar`           | `Varchar(n)`          | **Spark**: *StringType* represents character string values. *VarcharType(n)* is a variant of StringType which has a length limitation. Data writing will fail if the input string exceeds the length limitation. This type can only be used in table schema, not functions/operators.<br> *CharType(n)* is a variant of *VarcharType(n)* which is fixed length. Reading column of type *CharType(n)* always returns string values of length n. *CharType(n)* column comparison will pad the short one to the longer length. <br> **SQL**: If there's a length provided from Spark, n in *varchar(n)* will be set to that length. If it is partitioned column, n can be max 2048. Otherwise, it will be *varchar(max)*. See [char and varchar](/sql/t-sql/data-types/char-and-varchar-transact-sql).<br> Use it with collation `Latin1_General_100_BIN2_UTF8`. |
| `BinaryType`, `binary`                      | `varbinary(n)`        | **SQL**: If there's a length provided from Spark, `n` in *Varbinary(n)* will be set to that length. If it is partitioned column, n can be max 2048. Otherwise, it will be *Varbinary(max)*.  See [binary and varbinary](/sql/t-sql/data-types/binary-and-varbinary-transact-sql).|
| `array`, `map`, `struct`                    | `varchar(max)`        | **SQL**: Serializes into JSON with collation `Latin1_General_100_BIN2_UTF8`. See [JSON Data](/sql/relational-databases/json/json-data-sql-server).|

>[!NOTE]
> Database level collation is `Latin1_General_100_CI_AS_SC_UTF8`.

## Security model

The Spark databases and tables, as well as their synchronized representations in the SQL engine will be secured at the underlying storage level. Since they do not currently have permissions on the objects themselves, the objects can be seen in the object explorer.

The security principal who creates a managed table is considered the owner of that table and has all the rights to the table as well as the underlying folders and files. In addition, the owner of the database will automatically become co-owner of the table.

If you create a Spark or SQL external table with authentication pass-through, the data is only secured at the folder and file levels. If someone queries this type of external table, the security identity of the query submitter is passed down to the file system, which will check for access rights.

For more information on how to set permissions on the folders and files, see [Azure Synapse Analytics shared database](database.md).

## Examples

### Create a managed table in Spark and query from serverless SQL pool

In this scenario, you have a Spark database named `mytestdb`. See [Create and connect to a Spark database with serverless SQL pool](database.md#create-and-connect-to-spark-database-with-serverless-sql-pool).

Create a managed Spark table with SparkSQL by running the following command:

```sql
    CREATE TABLE mytestdb.myparquettable(id int, name string, birthdate date) USING Parquet
```

This command creates the table `myparquettable` in the database `mytestdb`. Table names will be converted to lowercase. After a short delay, you can see the table in your serverless SQL pool. For example, run the following statement from your serverless SQL pool.

```sql
    USE mytestdb;
    SELECT * FROM sys.tables;
```

Verify that `myparquettable` is included in the results.

>[!NOTE]
> A table that is not using Delta, Parquet or CSV as its storage format will not be synchronized.

Next, insert some values into the table from Spark, for example with the following C# Spark statements in a C# notebook:

```csharp
using Microsoft.Spark.Sql.Types;

var data = new List<GenericRow>();

data.Add(new GenericRow(new object[] { 1, "Alice", new Date(2010, 1, 1)}));
data.Add(new GenericRow(new object[] { 2, "Bob", new Date(1990, 1, 1)}));

var schema = new StructType
    (new List<StructField>()
        {
            new StructField("id", new IntegerType()),
            new StructField("name", new StringType()),
            new StructField("birthdate", new DateType())
        }
    );

var df = spark.CreateDataFrame(data, schema);
df.Write().Mode(SaveMode.Append).InsertInto("mytestdb.myparquettable");
```

Now you can read the data from your serverless SQL pool as follows:

```sql
SELECT * FROM mytestdb.dbo.myparquettable WHERE name = 'Alice';
```

You should get the following row as result:

```
id | name | birthdate
---+-------+-----------
1 | Alice | 2010-01-01
```

### Create an external table in Spark and query from serverless SQL pool

In this example, we will create an external Spark table over the Parquet data files that got created in the previous example for the managed table.

For example, with SparkSQL run:

```sql
CREATE TABLE mytestdb.myexternalparquettable
    USING Parquet
    LOCATION "abfss://<storage-name>.dfs.core.windows.net/<fs>/synapse/workspaces/<synapse_ws>/warehouse/mytestdb.db/myparquettable/"
```

Replace the placeholder `<storage-name>` with the ADLS Gen2 storage account name that you are using, `<fs>` with the file system name you're using and the placeholder `<synapse_ws>` with the name of the Azure Synapse workspace you're using to run this example.

The previous example creates the table `myextneralparquettable` in the database `mytestdb`. After a short delay, you can see the table in your serverless SQL pool. For example, run the following statement from your serverless SQL pool.

```sql
USE mytestdb;
SELECT * FROM sys.tables;
```

Verify that `myexternalparquettable` is included in the results.

Now you can read the data from your serverless SQL pool as follows:

```sql
SELECT * FROM mytestdb.dbo.myexternalparquettable WHERE name = 'Alice';
```

You should get the following row as result:

```
id | name | birthdate
---+-------+-----------
1 | Alice | 2010-01-01
```

## Next steps

- [Learn more about Azure Synapse Analytics' shared metadata](overview.md)
- [Learn more about Azure Synapse Analytics' shared metadata database](database.md)
