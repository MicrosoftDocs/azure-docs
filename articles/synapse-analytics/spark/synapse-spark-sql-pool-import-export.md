---
title: Import and Export data between serverless Apache Spark pools and SQL pools
description: This article introduces the Synapse Dedicated SQL Pool Connector API for moving data between dedicated SQL pools and serverless Apache Spark pools.
services: synapse-analytics
author: kevxmsft
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 01/27/2022
ms.author: kevx
ms.reviewer: kalyankadiyala-Microsoft
--- 
# Azure Synapse Dedicated SQL Pool connector for Apache Spark

The Synapse Dedicated SQL Pool Connector is an API that efficiently moves data between [Apache Spark runtime](../../synapse-analytics/spark/apache-spark-overview.md) and [Dedicated SQL pool](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) in Azure Synapse Analytics. This connector is available in `Scala`.

It uses Azure Storage and [PolyBase](/sql/relational-databases/polybase/polybase-guide) to transfer data in parallel and at scale.

## Authentication

Authentication works automatically with the signed in Azure Active Directory user after the following prerequisites.

* Add the user to [db_exporter role](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) using system-stored procedure [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql).
* Add the user to [Storage Blob Data Contributor role](/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) on the storage account.

The connector also supports password-based [SQL authentication](/azure/azure-sql/database/logins-create-manage#authentication-and-authorization) after the following prerequisites.
  * Add the user to [db_exporter role](/sql/relational-databases/security/authentication-access/database-level-roles#special-roles-for--and-azure-synapse) using system-stored procedure [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql).
  * Create an [external data source](/sql/t-sql/statements/create-external-data-source-transact-sql), whose [database scoped credential](/sql/t-sql/statements/create-database-scoped-credential-transact-sql) secret is the access key to an Azure Storage Account. The API requires the name of this external data source.

## API reference

See the [Scala API reference](https://synapsesql.blob.core.windows.net/docs/1.0.0/scaladocs/com/microsoft/spark/sqlanalytics/index.html).

## Example usage

* Create and show a `DataFrame` representing a database table in the dedicated SQL pool.

  ```scala
  import com.microsoft.spark.sqlanalytics.utils.Constants
  import org.apache.spark.sql.SqlAnalyticsConnector._

  val df = spark.read.
    option(Constants.SERVER, "servername.database.windows.net").
    synapsesql("databaseName.schemaName.tablename")

  df.show
  ```

* Save the content of a `DataFrame` to a database table in the dedicated SQL pool. The table type can be internal (i.e. managed) or external.

  ```scala
  import com.microsoft.spark.sqlanalytics.utils.Constants
  import org.apache.spark.sql.SqlAnalyticsConnector._

  val df = spark.sql("select * from tmpview")

  df.write.
    option(Constants.SERVER, "servername.database.windows.net").
    synapsesql("databaseName.schemaName.tablename", Constants.INTERNAL)
  ```

* Use the connector API with SQL authentication with option keys `Constants.USER` and `Constants.PASSWORD`. It also requires option key `Constants.DATA_SOURCE`, specifying an external data source.

  ```scala
  import com.microsoft.spark.sqlanalytics.utils.Constants
  import org.apache.spark.sql.SqlAnalyticsConnector._

  val df = spark.read.
    option(Constants.SERVER, "servername.database.windows.net").
    option(Constants.USER, "username").
    option(Constants.PASSWORD, "password").
    option(Constants.DATA_SOURCE, "datasource").
    synapsesql("databaseName.schemaName.tablename")

  df.show
  ```

* We can use the `Scala` connector API to interact with content from a `DataFrame` in `PySpark` by using [DataFrame.createOrReplaceTempView](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.sql.DataFrame.createOrReplaceTempView.html#pyspark.sql.DataFrame.createOrReplaceTempView) or [DataFrame.createOrReplaceGlobalTempView](https://spark.apache.org/docs/latest/api/python/reference/api/pyspark.sql.DataFrame.createOrReplaceGlobalTempView.html#pyspark.sql.DataFrame.createOrReplaceGlobalTempView).

  ```py
  %%pyspark
  df.createOrReplaceTempView("tempview")
  ```

  ```scala
  %%spark
  import com.microsoft.spark.sqlanalytics.utils.Constants
  import org.apache.spark.sql.SqlAnalyticsConnector._

  val df = spark.sqlContext.sql("select * from tempview")

  df.write.
    option(Constants.SERVER, "servername.database.windows.net").
    synapsesql("databaseName.schemaName.tablename")
  ```

## Next steps

- [Create a dedicated SQL pool using the Azure portal](../../synapse-analytics/quickstart-create-apache-spark-pool-portal.md)
- [Create a new Apache Spark pool using the Azure portal](../../synapse-analytics/quickstart-create-apache-spark-pool-portal.md)
- [Create, develop, and maintain Synapse notebooks in Azure Synapse Analytics](../../synapse-analytics/spark/apache-spark-development-using-notebooks.md)
