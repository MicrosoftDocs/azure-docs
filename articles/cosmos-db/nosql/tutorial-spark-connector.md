---
title: 'Tutorial: Connect by using Spark'
titleSuffix: Azure Cosmos DB for NoSQL
description: Connect to Azure Cosmos DB for NoSQL by using the Spark 3 OLTP connector. Use the connector to query data in your API for a NoSQL account.
author: seesharprun
ms.author: sidandrews
ms.service: cosmos-db
ms.subservice: nosql
ms.custom: devx-track-python
ms.topic: tutorial
ms.date: 01/17/2024
zone_pivot_groups: programming-languages-spark-all-minus-sql-r-csharp
#CustomerIntent: As a data scientist, I want to connect to Azure Cosmos DB for NoSQL by using Spark so that I can perform analytics on my data in Azure Cosmos DB.
---

# Tutorial: Connect to Azure Cosmos DB for NoSQL by using Spark

[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

In this tutorial, you use the Azure Cosmos DB Spark connector to read or write data from an Azure Cosmos DB for NoSQL account. This tutorial uses Azure Databricks and a Jupyter notebook to illustrate how to integrate with the API for NoSQL from Spark. This tutorial focuses on Python and Scala, although you can use any language or interface supported by Spark.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Connect to an API for NoSQL account by using Spark and a Jupyter notebook.
> - Create database and container resources.
> - Ingest data to the container.
> - Query data in the container.
> - Perform common operations on items in the container.

## Prerequisites

- An existing Azure Cosmos DB for NoSQL account.
  - If you have an existing Azure subscription, [create a new account](how-to-create-account.md?tabs=azure-portal).
  - No Azure subscription? You can [try Azure Cosmos DB free](../try-free.md) with no credit card required.
- An existing Azure Databricks workspace.

## Connect by using Spark and Jupyter

Use your existing Azure Databricks workspace to create a compute cluster ready to use Apache Spark 3.4.x to connect to your Azure Cosmos DB for NoSQL account.

1. Open your Azure Databricks workspace.

1. In the workspace interface, create a new **cluster**. Configure the cluster with these settings, at a minimum:

    | Version  | Value |
    | --- | --- |
    | Runtime version | 13.3 LTS (Scala 2.12, Spark 3.4.1) |

1. Use the workspace interface to search for **Maven** packages from **Maven Central** with a **Group ID** of `com.azure.cosmos.spark`. Install the package specifically for Spark 3.4 with an **Artifact ID** prefixed with `azure-cosmos-spark_3-4` to the cluster.

1. Finally, create a new **notebook**.

    > [!TIP]
    > By default, the notebook is attached to the recently created cluster.

1. Within the notebook, set online transaction processing (OLTP) configuration settings for the NoSQL account endpoint, database name, and container name.

    ::: zone pivot="programming-language-python"

    ```python
    # Set configuration settings
    config = {
      "spark.cosmos.accountEndpoint": "<nosql-account-endpoint>",
      "spark.cosmos.accountKey": "<nosql-account-key>",
      "spark.cosmos.database": "cosmicworks",
      "spark.cosmos.container": "products"
    }
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    # Set configuration settings
    val config = Map(
      "spark.cosmos.accountEndpoint" -> "<nosql-account-endpoint>",
      "spark.cosmos.accountKey" -> "<nosql-account-key>",
      "spark.cosmos.database" -> "cosmicworks",
      "spark.cosmos.container" -> "products"
    )
    ```

    ::: zone-end

## Create a database and a container

Use the Catalog API to manage account resources such as databases and containers. Then, you can use OLTP to manage data within the container resources.

1. Configure the Catalog API to manage API for NoSQL resources by using Spark.

    ::: zone pivot="programming-language-python"

    ```python
    # Configure Catalog Api    
    spark.conf.set("spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", config["spark.cosmos.accountEndpoint"])
    spark.conf.set("spark.sql.catalog.cosmosCatalog.spark.cosmos.accountKey", config["spark.cosmos.accountKey"]) 
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Configure Catalog Api  
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog", "com.azure.cosmos.spark.CosmosCatalog")
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.accountEndpoint", config("spark.cosmos.accountEndpoint"))
    spark.conf.set(s"spark.sql.catalog.cosmosCatalog.spark.cosmos.accountKey", config("spark.cosmos.accountKey"))
    ```

    ::: zone-end

1. Create a new database named `cosmicworks` by using `CREATE DATABASE IF NOT EXISTS`.

    ::: zone pivot="programming-language-python"

    ```python
    # Create a database by using the Catalog API    
    spark.sql(f"CREATE DATABASE IF NOT EXISTS cosmosCatalog.cosmicworks;")
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Create a database by using the Catalog API  
    spark.sql(s"CREATE DATABASE IF NOT EXISTS cosmosCatalog.cosmicworks;")
    ```

    ::: zone-end

1. Create a new container named `products` by using `CREATE TABLE IF NOT EXISTS`. Ensure that you set the partition key path to `/category` and enable autoscale throughput with a maximum throughput of `1000` request units (RUs) per second.

    ::: zone pivot="programming-language-python"

    ```python
    # Create a products container by using the Catalog API
    spark.sql(("CREATE TABLE IF NOT EXISTS cosmosCatalog.cosmicworks.products USING cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/category', autoScaleMaxThroughput = '1000')"))
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Create a products container by using the Catalog API
    spark.sql(("CREATE TABLE IF NOT EXISTS cosmosCatalog.cosmicworks.products USING cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/category', autoScaleMaxThroughput = '1000')"))
    ```

    ::: zone-end

1. Create another container named `employees` by using a hierarchical partition key configuration. Use `/organization`, `/department`, and `/team` as the set of partition key paths. Follow that specific order. Also, set the throughput to a manual amount of `400` RUs.

    ::: zone pivot="programming-language-python"

    ```python
    # Create an employees container by using the Catalog API
    spark.sql(("CREATE TABLE IF NOT EXISTS cosmosCatalog.cosmicworks.employees USING cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/organization,/department,/team', manualThroughput = '400')"))
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Create an employees container by using the Catalog API
    spark.sql(("CREATE TABLE IF NOT EXISTS cosmosCatalog.cosmicworks.employees USING cosmos.oltp TBLPROPERTIES(partitionKeyPath = '/organization,/department,/team', manualThroughput = '400')"))
    ```

    ::: zone-end

1. Run the notebook cells to validate that your database and containers are created within your API for NoSQL account.

## Ingest data

Create a sample dataset. Then use OLTP to ingest that data to the API for NoSQL container.

1. Create a sample dataset.

    ::: zone pivot="programming-language-python"

    ```python
    # Create sample data    
    products = (
      ("68719518391", "gear-surf-surfboards", "Yamba Surfboard", 12, 850.00, False),
      ("68719518371", "gear-surf-surfboards", "Kiama Classic Surfboard", 25, 790.00, True)
    )
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Create sample data
    val products = Seq(
      ("68719518391", "gear-surf-surfboards", "Yamba Surfboard", 12, 850.00, false),
      ("68719518371", "gear-surf-surfboards", "Kiama Classic Surfboard", 25, 790.00, true)
    )
    ```

    ::: zone-end

1. Use `spark.createDataFrame` and the previously saved OLTP configuration to add sample data to the target container.

    ::: zone pivot="programming-language-python"

    ```python
    # Ingest sample data    
    spark.createDataFrame(products) \
      .toDF("id", "category", "name", "quantity", "price", "clearance") \
      .write \
      .format("cosmos.oltp") \
      .options(**config) \
      .mode("APPEND") \
      .save()
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Ingest sample data
    spark.createDataFrame(products)
      .toDF("id", "category", "name", "quantity", "price", "clearance")
      .write
      .format("cosmos.oltp")
      .options(config)
      .mode("APPEND")
      .save()
    ```

    ::: zone-end

## Query data

Load OLTP data into a data frame to perform common queries on the data. You can use various syntaxes to filter or query data.

1. Use `spark.read` to load the OLTP data into a data-frame object. Use the same configuration you used earlier in this tutorial. Also, set `spark.cosmos.read.inferSchema.enabled` to `true` to allow the Spark connector to infer the schema by sampling existing items.

    ::: zone pivot="programming-language-python"

    ```python
    # Load data    
    df = spark.read.format("cosmos.oltp") \
      .options(**config) \
      .option("spark.cosmos.read.inferSchema.enabled", "true") \
      .load()
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Load data
    val df = spark.read.format("cosmos.oltp")
      .options(config)
      .option("spark.cosmos.read.inferSchema.enabled", "true")
      .load()
    ```

    ::: zone-end

1. Render the schema of the data loaded in the data frame by using `printSchema`.

    ::: zone pivot="programming-language-python"

    ```python
    # Render schema    
    df.printSchema()
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Render schema    
    df.printSchema()
    ```

    ::: zone-end

1. Render data rows where the `quantity` column is less than `20`. Use the `where` and `show` functions to perform this query.

    ::: zone pivot="programming-language-python"

    ```python
    # Render filtered data    
    df.where("quantity < 20") \
      .show()
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Render filtered data
    df.where("quantity < 20")
      .show()
    ```

    ::: zone-end

1. Render the first data row where the `clearance` column is `true`. Use the `filter` function to perform this query.

    ::: zone pivot="programming-language-python"

    ```python
    # Render 1 row of flitered data    
    df.filter(df.clearance == True) \
      .show(1)
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Render 1 row of flitered data
    df.filter($"clearance" === true)
      .show(1)
    ```

    ::: zone-end

1. Render five rows of data with no filter or truncation. Use the `show` function to customize the appearance and number of rows that are rendered.

    ::: zone pivot="programming-language-python"

    ```python
    # Render five rows of unfiltered and untruncated data    
    df.show(5, False)
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Render five rows of unfiltered and untruncated data    
    df.show(5, false)
    ```

    ::: zone-end

1. Query your data by using this raw NoSQL query string: `SELECT * FROM cosmosCatalog.cosmicworks.products WHERE price > 800`

    ::: zone pivot="programming-language-python"

    ```python
    # Render results of raw query    
    rawQuery = "SELECT * FROM cosmosCatalog.cosmicworks.products WHERE price > 800"
    rawDf = spark.sql(rawQuery)
    rawDf.show()
    ```

    ::: zone-end

    ::: zone pivot="programming-language-scala"

    ```scala
    // Render results of raw query    
    val rawQuery = s"SELECT * FROM cosmosCatalog.cosmicworks.products WHERE price > 800"
    val rawDf = spark.sql(rawQuery)
    rawDf.show()
    ```

    ::: zone-end

## Perform common operations

When you work with API for NoSQL data in Spark, you can perform partial updates or work with data as raw JSON.

1. To perform a partial update of an item:

    1. Copy the existing `config` configuration variable and modify the properties in the new copy. Specifically, configure the write strategy to `ItemPatch`. Then disable bulk support. Set the columns and mapped operations. Finally, set the default operation type to `Set`.

        ::: zone pivot="programming-language-python"

        ```python
        # Copy and modify configuration
        configPatch = dict(config)
        configPatch["spark.cosmos.write.strategy"] = "ItemPatch"
        configPatch["spark.cosmos.write.bulk.enabled"] = "false"
        configPatch["spark.cosmos.write.patch.defaultOperationType"] = "Set"
        configPatch["spark.cosmos.write.patch.columnConfigs"] = "[col(name).op(set)]"
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Copy and modify configuration
        val configPatch = scala.collection.mutable.Map.empty ++ config
        configPatch ++= Map(
          "spark.cosmos.write.strategy" -> "ItemPatch",
          "spark.cosmos.write.bulk.enabled" -> "false",
          "spark.cosmos.write.patch.defaultOperationType" -> "Set",
          "spark.cosmos.write.patch.columnConfigs" -> "[col(name).op(set)]"
        )
        ```

        ::: zone-end

    1. Create variables for the item partition key and unique identifier that you intend to target as part of this patch operation.

        ::: zone pivot="programming-language-python"

        ```python
        # Specify target item id and partition key
        targetItemId = "68719518391"
        targetItemPartitionKey = "gear-surf-surfboards"
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Specify target item id and partition key
        val targetItemId = "68719518391"
        val targetItemPartitionKey = "gear-surf-surfboards"
        ```

        ::: zone-end

    1. Create a set of patch objects to specify the target item and specify fields that should be modified.

        ::: zone pivot="programming-language-python"

        ```python
        # Create set of patch diffs
        patchProducts = [{ "id": f"{targetItemId}", "category": f"{targetItemPartitionKey}", "name": "Yamba New Surfboard" }]
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Create set of patch diffs
        val patchProducts = Seq(
          (targetItemId, targetItemPartitionKey, "Yamba New Surfboard")
        )
        ```

        ::: zone-end

    1. Create a data frame by using the set of patch objects. Use `write` to perform the patch operation.

        ::: zone pivot="programming-language-python"

        ```python
        # Create data frame
        spark.createDataFrame(patchProducts) \
          .write \
          .format("cosmos.oltp") \
          .options(**configPatch) \
          .mode("APPEND") \
          .save()
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Create data frame
        patchProducts
          .toDF("id", "category", "name")
          .write
          .format("cosmos.oltp")
          .options(configPatch)
          .mode("APPEND")
          .save()
        ```

        ::: zone-end

    1. Run a query to review the results of the patch operation. The item should now be named `Yamba New Surfboard` with no other changes.

        ::: zone pivot="programming-language-python"

        ```python
        # Create and run query
        patchQuery = f"SELECT * FROM cosmosCatalog.cosmicworks.products WHERE id = '{targetItemId}' AND category = '{targetItemPartitionKey}'"
        patchDf = spark.sql(patchQuery)
        patchDf.show(1)
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Create and run query
        val patchQuery = s"SELECT * FROM cosmosCatalog.cosmicworks.products WHERE id = '$targetItemId' AND category = '$targetItemPartitionKey'"
        val patchDf = spark.sql(patchQuery)
        patchDf.show(1)
        ```

        ::: zone-end

1. To work with raw JSON data:

    1. Copy the existing `config` configuration variable and modify the properties in the new copy. Specifically, change the target container to `employees`. Then configure the `contacts` column/field to use raw JSON data.

        ::: zone pivot="programming-language-python"

        ```python
        # Copy and modify configuration
        configRawJson = dict(config)
        configRawJson["spark.cosmos.container"] = "employees"
        configRawJson["spark.cosmos.write.patch.columnConfigs"] = "[col(contacts).path(/contacts).op(set).rawJson]"
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Copy and modify configuration
        val configRawJson = scala.collection.mutable.Map.empty ++ config
        configRawJson ++= Map(
          "spark.cosmos.container" -> "employees",
          "spark.cosmos.write.patch.columnConfigs" -> "[col(contacts).path(/contacts).op(set).rawJson]"
        )
        ```

        ::: zone-end

    1. Create a set of employees to ingest into the container.

        ::: zone pivot="programming-language-python"

        ```python
        # Create employee data
        employees = (
          ("63476388581", "CosmicWorks", "Marketing", "Outside Sales", "Alain Henry",  '[ { "type": "phone", "value": "425-555-0117" }, { "email": "alain@adventure-works.com" } ]'), 
        )
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Create employee data
        val employees = Seq(
          ("63476388581", "CosmicWorks", "Marketing", "Outside Sales", "Alain Henry",  """[ { "type": "phone", "value": "425-555-0117" }, { "email": "alain@adventure-works.com" } ]""")
        )
        ```

        ::: zone-end

    1. Create a data frame and use `write` to ingest the employee data.

        ::: zone pivot="programming-language-python"

        ```python
        # Ingest data
        spark.createDataFrame(employees) \
          .toDF("id", "organization", "department", "team", "name", "contacts") \
          .write \
          .format("cosmos.oltp") \
          .options(**configRawJson) \
          .mode("APPEND") \
          .save()
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Ingest data
        spark.createDataFrame(employees)
          .toDF("id", "organization", "department", "team", "name", "contacts")
          .write
          .format("cosmos.oltp")
          .options(configRawJson)
          .mode("APPEND")
          .save()
        ```

        ::: zone-end

    1. Render the data from the data frame by using `show`. Observe that the `contacts` column is raw JSON in the output.

        ::: zone pivot="programming-language-python"

        ```python
        # Read and render data
        rawJsonDf = spark.read.format("cosmos.oltp") \
          .options(**configRawJson) \
          .load()
        rawJsonDf.show()
        ```

        ::: zone-end

        ::: zone pivot="programming-language-scala"

        ```scala
        // Read and render data
        val rawJsonDf = spark.read.format("cosmos.oltp")
          .options(configRawJson)
          .load()
        rawJsonDf.show()
        ```

        ::: zone-end

## Related content

- [Apache Spark](https://spark.apache.org/)
- [Azure Cosmos DB Catalog API](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/catalog-api.md)
- [Configuration parameter reference](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/configuration-reference.md)
- [Sample "New York City Taxi data" notebook](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples/Python/NYC-Taxi-Data)
- [Migrate from Spark 2.4 to Spark 3.*](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3_2-12/docs/migration.md)
- Version compatibility:
  - [Version compatibility for Spark 3.1](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-1_2-12/README.md#version-compatibility)
  - [Version compatibility for Spark 3.2](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-2_2-12/README.md#version-compatibility)
  - [Version compatibility for Spark 3.3](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-3_2-12/README.md#version-compatibility)
  - [Version compatibility for Spark 3.4](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-4_2-12/README.md#version-compatibility)
- Release notes:
  - [Release notes for Spark 3.1](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-1_2-12/CHANGELOG.md)
  - [Release notes for Spark 3.2](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-2_2-12/CHANGELOG.md)
  - [Release notes for Spark 3.3](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-3_2-12/CHANGELOG.md)
  - [Release notes for Spark 3.4](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-4_2-12/CHANGELOG.md)
- Download links:
  - [Download Azure Cosmos DB Spark connect for Spark 3.1](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-1_2-12/README.md#download)
  - [Download Azure Cosmos DB Spark connect for Spark 3.2](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-2_2-12/README.md#download)
  - [Download Azure Cosmos DB Spark connect for Spark 3.3](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-3_2-12/README.md#download)
  - [Download Azure Cosmos DB Spark connect for Spark 3.4](https://github.com/Azure/azure-sdk-for-java/blob/main/sdk/cosmos/azure-cosmos-spark_3-4_2-12/README.md#download)

## Next step

> [!div class="nextstepaction"]
> [Azure Cosmos DB Spark connector on Maven Central Repository](https://central.sonatype.com/search?q=g:com.azure.cosmos.spark&smo=true)
