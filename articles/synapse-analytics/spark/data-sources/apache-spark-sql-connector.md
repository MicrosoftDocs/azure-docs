---
title: Spark connector for SQL databases
description: Learn how to use Spark Connector to connect to Azure SQL databases from Synapse Spark Runtime
author: eric-urban
ms.author: eur
ms.reviewer: arali
ms.topic: how-to
ms.date: 02/03/2026
---

# Spark connector for SQL databases (Preview)

> [!IMPORTANT]
> This feature is in preview.

The Spark connector for SQL databases is a high-performance library that lets you read from and write to SQL Server, Azure SQL databases, and Fabric SQL databases. The connector offers the following capabilities:

* Use Spark to run large write and read operations on Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM, and Fabric SQL databases.
* When you use a table or a view, the connector supports security models set at the SQL engine level. These models include object-level security (OLS), row-level security (RLS), and column-level security (CLS).

The connector is preinstalled in the Synapse Spark 3.5 runtime, so you don't need to install it separately.

## Authentication

Microsoft Entra authentication is integrated with Azure Synapse. 
- When you sign in to the Synapse workspace and use it in the notebook, your credentials are automatically passed to the SQL engine for authentication and authorization.
- Requires Microsoft Entra ID to be enabled and configured on your SQL database engine.
- No extra configuration is needed in your Spark code if Microsoft Entra ID is set up. The credentials are automatically mapped.

You can also use the SQL authentication method (by specifying a SQL username and password) or a service principal (by providing an Azure access token for app-based authentication).

### Permissions

To use the Spark connector, your identity—whether it's a user or an app—must have the necessary database permissions for the target SQL engine. These permissions are required to read from or write to tables and views.

For Azure SQL Database, Azure SQL Managed Instance, and SQL Server on Azure VM:
- The identity running the operation typically needs `db_datawriter` and `db_datareader` permissions, and optionally `db_owner` for full control.

For Fabric SQL databases:
- The identity typically needs `db_datawriter` and `db_datareader` permissions, and optionally `db_owner`.
- The identity also needs at least read permission on the Fabric SQL database at the item level.

> [!NOTE]
> If you use a service principal, it can run as an app (no user context) or as a user if user impersonation is enabled. The service principal must have the required database permissions for the operations you want to perform.

## Usage and code examples

In this section, we provide code examples to demonstrate how to use the Spark connector for SQL databases effectively. These examples cover various scenarios, including reading from and writing to SQL tables, and configuring the connector options.

### Supported options

The minimal required option is `url` as `"jdbc:sqlserver://<server>:<port>;database=<database>;"` or set `spark.mssql.connector.default.url`.

- When the `url` is provided:
   - Always use `url` as first preference.
   - If `spark.mssql.connector.default.url` isn't set, the connector will set it and reuse it for future usage.

- When the `url` isn't provided:
   - If `spark.mssql.connector.default.url` is set, the connector uses the value from the spark config.
   - If `spark.mssql.connector.default.url` isn't set, an error is thrown because the required details aren't available.

This connector supports the options defined here: [SQL DataSource JDBC Options](https://spark.apache.org/docs/latest/sql-data-sources-jdbc.html)

The connector also supports the following options:

| Option | Default value | Description |
| ----- | ----- | ----- |
| `reliabilityLevel` | "BEST_EFFORT" | Controls the reliability of insert operations. Possible values: `BEST_EFFORT` (default, fastest, might result in duplicate rows if an executor restarts), `NO_DUPLICATES` (slower, ensures no duplicate rows are inserted even if an executor restarts). Choose based on your tolerance for duplicates and performance needs. |
| `isolationLevel` | "READ_COMMITTED" | Sets the transaction isolation level for SQL operations. Possible values: `READ_COMMITTED` (default, prevents reading uncommitted data), `READ_UNCOMMITTED`, `REPEATABLE_READ`, `SNAPSHOT`, `SERIALIZABLE`. Higher isolation levels can reduce concurrency but improve data consistency. |
| `tableLock` | "false" | Controls whether the SQL Server TABLOCK table-level lock hint is used during insert operations. Possible values: `true` (enables TABLOCK, which can improve bulk write performance), `false` (default, doesn't use TABLOCK). Setting to `true` might increase throughput for large inserts but can reduce concurrency for other operations on the table. |
| `schemaCheckEnabled` | "true" | Controls whether strict schema validation is enforced between your Spark `DataFrame` and the SQL table. Possible values: `true` (default, enforces strict schema matching), `false` (allows more flexibility and might skip some schema checks). Setting to `false` can help with schema mismatches but might lead to unexpected results if the structures differ significantly. |

Other [Bulk API options](/sql/connect/jdbc/using-bulk-copy-with-the-jdbc-driver?view=azuresqldb-current#sqlserverbulkcopyoptions&preserve-view=true) can be set as options on the `DataFrame` and are passed to bulk copy APIs on write.

### Write and read example

The following code shows how to write and read data by using the `mssql("<schema>.<table>")` method with automatic Microsoft Entra ID authentication.

> [!TIP]
> Data is created inline for demonstration purposes. In a production scenario, you would typically read data from an existing source or create a more complex `DataFrame`.

# [PySpark](#tab/pyspark)

```python
url = "jdbc:sqlserver://<server>:<port>;database=<database>;"
row_data = [("Alice", 1),("Bob", 2),("Charlie", 3)]
column_header = ["Name", "Age"]
df = spark.createDataFrame(row_data, column_header)
df.write.mode("overwrite").option("url", url).mssql("dbo.publicExample")
spark.read.option("url", url).mssql("dbo.publicExample").show()

url = "jdbc:sqlserver://<server>:<port>;database=<database2>;" # different database
df.write.mode("overwrite").option("url", url).mssql("dbo.tableInDatabase2") # default url is updated
spark.read.mssql("dbo.tableInDatabase2").show() # no url option specified and will use database2
```

# [Scala Spark](#tab/scalaspark)

```scala
import com.microsoft.sqlserver.jdbc.spark.SparkSqlImplicits._
import org.apache.spark.sql.Row
import org.apache.spark.sql.types._
val url = "jdbc:sqlserver://<server>:<port>;database=<database>;"
val row_data = Seq(
  Row("Alice", 1),
  Row("Bob", 2),
  Row("Charlie", 3)
)
val schema = List(
  StructField("Name", StringType, nullable = true),
  StructField("Age", IntegerType, nullable = true)
)
val df = spark.createDataFrame(spark.sparkContext.parallelize(row_data), StructType(schema))
df.write.mode("overwrite").option("url", url).mssql("dbo.publicExample")
spark.read.option("url", url).mssql("dbo.publicExample").show

val url = "jdbc:sqlserver://<server>:<port>;database=<database2>;" // different database
df.write.mode("overwrite").option("url", url).mssql("dbo.tableInDatabase2") // default url is updated
spark.read.mssql("dbo.tableInDatabase2").show // no url option specified and will use database2
```

---

You can also select columns, apply filters, and use other options when you read data from the SQL database engine.

### Authentication examples

The following examples show how to use authentication methods other than Microsoft Entra ID, such as service principal (access token) and SQL authentication. 

> [!NOTE]
> As mentioned earlier, Microsoft Entra ID authentication is handled automatically when you sign in to the Synapse workspace, so you only need to use these methods if your scenario requires them.

# [Service Principal or Access Token](#tab/accesstoken)

```python
url = "jdbc:sqlserver://<server>:<port>;database=<database>;"
row_data = [("Alice", 1),("Bob", 2),("Charlie", 3)]
column_header = ["Name", "Age"]
df = spark.createDataFrame(row_data, column_header)

from azure.identity import ClientSecretCredential
credential = ClientSecretCredential(tenant_id="", client_id="", client_secret="") # service principal app
scope = "https://database.windows.net/.default"
token = credential.get_token(scope).token

df.write.mode("overwrite").option("url", url).option("accessToken", token).mssql("dbo.publicExample")
spark.read.option("accessToken", token).mssql("dbo.publicExample").show()
```

# [User/Password](#tab/userandpassword)

```python
url = "jdbc:sqlserver://<server>:<port>;database=<database>;"
row_data = [("Alice", 1),("Bob", 2),("Charlie", 3)]
column_header = ["Name", "Age"]
df = spark.createDataFrame(row_data, column_header)
df.write.mode("overwrite").option("url", url).option("user", "").option("password", "").mssql("dbo.publicExample")
spark.read.option("user", "").option("password", "").mssql("dbo.publicExample").show()
```

---

### Supported DataFrame save modes

When you write data from Spark to SQL databases, you can choose from several save modes. Save modes control how data is written when the destination table already exists, and can affect schema, data, and indexing. Understanding these modes helps you avoid unexpected data loss or changes.

This connector supports the options defined here: [Spark Save functions](https://spark.apache.org/docs/latest/sql-data-sources-load-save-functions.html)

* **ErrorIfExists** (default save mode): If the destination table exists, the write is aborted and an exception is returned. Otherwise, a new table is created with data.
* **Ignore**: If the destination table exists, the write ignores the request and doesn't return an error. Otherwise, a new table is created with data.
* **Overwrite**: If the destination table exists, the table is dropped, recreated, and new data is appended. 
  
    > [!NOTE]
    > When you use `overwrite`, the original table schema (especially MSSQL-exclusive data types) and table indices are lost and replaced by the schema inferred from your Spark DataFrame. To avoid losing schema and indices, additionally add the `.option("truncate", true)`.

* **Append**: If the destination table exists, new data is appended to it. Otherwise, a new table is created with data.

## Troubleshoot

When the process finishes, the output of your Spark read operation appears in the cell's output area. Errors from `com.microsoft.sqlserver.jdbc.SQLServerException` come directly from SQL Server. You can find detailed error information in the Spark application logs.

## Related content

* [Azure SQL Database](https://azure.microsoft.com/products/azure-sql/database)
* [Fabric SQL databases](/fabric/database/sql/overview)
* [Azure SQL Database - Authentication and authorization](/azure/azure-sql/database/logins-create-manage)