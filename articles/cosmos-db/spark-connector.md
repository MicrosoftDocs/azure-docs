---
title: Connect Apache Spark to Azure Cosmos DB
description: Learn about the Azure Cosmos DB Spark connector that enables you to connect Apache Spark to Azure Cosmos DB.
author: tknandu
ms.service: cosmos-db
ms.topic: conceptual
ms.date: 05/21/2019
ms.author: ramkris

---

# Accelerate big data analytics by using the Apache Spark to Azure Cosmos DB connector

You can run [Spark](https://spark.apache.org/) jobs with data stored in Azure Cosmos DB using the Cosmos DB Spark connector. Cosmos can be used for batch  and stream processing, and as a serving layer for low latency access.

You can use the connector with [Azure Databricks](https://azure.microsoft.com/services/databricks) or [Azure HDInsight](https://azure.microsoft.com/services/hdinsight/), which provide managed Spark clusters on Azure. The following table shows supported Spark versions.

| Component | Version |
|---------|-------|
| Apache Spark | 2.4.x, 2.3.x, 2.2.x, and 2.1.x |
| Scala | 2.11 |
| Azure Databricks runtime version | > 3.4 |

> [!WARNING]
> This connector supports the core (SQL) API of Azure Cosmos DB.
> For Cosmos DB for MongoDB API, use the [MongoDB Spark connector](https://docs.mongodb.com/spark-connector/master/).
> For Cosmos DB Cassandra API, use the [Cassandra Spark connector](https://github.com/datastax/spark-cassandra-connector).
>

## Quickstart

* Follow the steps at [Get started with the Java SDK](sql-api-async-java-get-started.md) to set up a Cosmos DB account, and populate some data.
* Follow the steps at [Azure Databricks getting started](/azure/azure-databricks/quickstart-create-databricks-workspace-portal) to set up an Azure Databricks workspace and cluster.
* You can now create new Notebooks, and import the Cosmos DB connector library. Jump to [Working with the Cosmos DB connector](#bk_working_with_connector) for details on how to set up your workspace.
* The following section has snippets on how to read and write using the connector.

### Batch reads from Cosmos DB

The following snippet shows how to create a Spark DataFrame to read from Cosmos DB in PySpark.

```python
# Read Configuration
readConfig = {
    "Endpoint": "https://doctorwho.documents.azure.com:443/",
    "Masterkey": "YOUR-KEY-HERE",
    "Database": "DepartureDelays",
    "Collection": "flights_pcoll",
    "query_custom": "SELECT c.date, c.delay, c.distance, c.origin, c.destination FROM c WHERE c.origin = 'SEA'" // Optional
}

# Connect via azure-cosmosdb-spark to create Spark DataFrame
flights = spark.read.format(
    "com.microsoft.azure.cosmosdb.spark").options(**readConfig).load()
flights.count()
```

And the same code snippet in Scala:

```scala
// Import Necessary Libraries
import com.microsoft.azure.cosmosdb.spark.schema._
import com.microsoft.azure.cosmosdb.spark._
import com.microsoft.azure.cosmosdb.spark.config.Config

// Read Configuration
val readConfig = Config(Map(
  "Endpoint" -> "https://doctorwho.documents.azure.com:443/",
  "Masterkey" -> "YOUR-KEY-HERE",
  "Database" -> "DepartureDelays",
  "Collection" -> "flights_pcoll",
  "query_custom" -> "SELECT c.date, c.delay, c.distance, c.origin, c.destination FROM c WHERE c.origin = 'SEA'" // Optional
))

// Connect via azure-cosmosdb-spark to create Spark DataFrame
val flights = spark.read.cosmosDB(readConfig)
flights.count()
```

### Batch writes to Cosmos DB

The following snippet shows how to write a data frame to Cosmos DB in PySpark.

```python
# Write configuration
writeConfig = {
    "Endpoint": "https://doctorwho.documents.azure.com:443/",
    "Masterkey": "YOUR-KEY-HERE",
    "Database": "DepartureDelays",
    "Collection": "flights_fromsea",
    "Upsert": "true"
}

# Write to Cosmos DB from the flights DataFrame
flights.write.format("com.microsoft.azure.cosmosdb.spark").options(
    **writeConfig).save()
```

And the same code snippet in Scala:

```scala
// Write configuration

val writeConfig = Config(Map(
  "Endpoint" -> "https://doctorwho.documents.azure.com:443/",
  "Masterkey" -> "YOUR-KEY-HERE",
  "Database" -> "DepartureDelays",
  "Collection" -> "flights_fromsea",
  "Upsert" -> "true"
))

// Write to Cosmos DB from the flights DataFrame
import org.apache.spark.sql.SaveMode
flights.write.mode(SaveMode.Overwrite).cosmosDB(writeConfig)
```

### Streaming reads from Cosmos DB

The following snippet shows how to connect to and read from Azure Cosmos DB Change Feed.

```python
# Read Configuration
readConfig = {
    "Endpoint": "https://doctorwho.documents.azure.com:443/",
    "Masterkey": "YOUR-KEY-HERE",
    "Database": "DepartureDelays",
    "Collection": "flights_pcoll",
    "ReadChangeFeed": "true",
    "ChangeFeedQueryName": "Departure-Delays",
    "ChangeFeedStartFromTheBeginning": "false",
    "InferStreamSchema": "true",
    "ChangeFeedCheckpointLocation": "dbfs:/Departure-Delays"
}


# Open a read stream to the Cosmos DB Change Feed via azure-cosmosdb-spark to create Spark DataFrame
changes = (spark
           .readStream
           .format("com.microsoft.azure.cosmosdb.spark.streaming.CosmosDBSourceProvider")
           .options(**readConfig)
           .load())
```
And the same code snippet in Scala:

```scala
// Import Necessary Libraries
import com.microsoft.azure.cosmosdb.spark.schema._
import com.microsoft.azure.cosmosdb.spark._
import com.microsoft.azure.cosmosdb.spark.config.Config

// Read Configuration
val readConfig = Config(Map(
  "Endpoint" -> "https://doctorwho.documents.azure.com:443/",
  "Masterkey" -> "YOUR-KEY-HERE",
  "Database" -> "DepartureDelays",
  "Collection" -> "flights_pcoll",
  "ReadChangeFeed" -> "true",
  "ChangeFeedQueryName" -> "Departure-Delays",
  "ChangeFeedStartFromTheBeginning" -> "false",
  "InferStreamSchema" -> "true",
  "ChangeFeedCheckpointLocation" -> "dbfs:/Departure-Delays"
))

// Open a read stream to the Cosmos DB Change Feed via azure-cosmosdb-spark to create Spark DataFrame
val df = spark.readStream.format(classOf[CosmosDBSourceProvider].getName).options(readConfig).load()
```

### Streaming writes to Cosmos DB

The following snippet shows how to write a data frame to Cosmos DB in PySpark.

```python
# Write configuration
writeConfig = {
    "Endpoint": "https://doctorwho.documents.azure.com:443/",
    "Masterkey": "YOUR-KEY-HERE",
    "Database": "DepartureDelays",
    "Collection": "flights_fromsea",
    "Upsert": "true",
    "WritingBatchSize": "500",
    "CheckpointLocation": "/checkpointlocation_write1"
}

# Write to Cosmos DB from the flights DataFrame
changeFeed = (changes
              .writeStream
              .format("com.microsoft.azure.cosmosdb.spark.streaming.CosmosDBSinkProvider")
              .outputMode("append")
              .options(**writeconfig)
              .start())
```

And the same code snippet in Scala:

```scala
// Write configuration

val writeConfig = Config(Map(
  "Endpoint" -> "https://doctorwho.documents.azure.com:443/",
  "Masterkey" -> "YOUR-KEY-HERE",
  "Database" -> "DepartureDelays",
  "Collection" -> "flights_fromsea",
  "Upsert" -> "true",
  "WritingBatchSize" -> "500",
  "CheckpointLocation" -> "/checkpointlocation_write1"
))

// Write to Cosmos DB from the flights DataFrame
df
.writeStream
.format(classOf[CosmosDBSinkProvider].getName)
.options(writeConfig)
.start()
```
More more snippets and end to end samples, see [Jupyter](https://github.com/Azure/azure-cosmosdb-spark/tree/master/samples/notebooks).

## <a name="bk_working_with_connector"></a> Working with the connector

You can build the connector from source in GitHub, or download the uber jars from Maven in the links below.

| Spark | Scala | Latest version |
|---|---|---|
| 2.4.0 | 2.11 | [azure-cosmosdb-spark_lkg_version](https://aka.ms/CosmosDB_OLTP_Spark_2.4_LKG)
| 2.3.0 | 2.11 | [azure-cosmosdb-spark_2.3.0_2.11_1.3.3](https://search.maven.org/artifact/com.microsoft.azure/azure-cosmosdb-spark_2.3.0_2.11/1.3.3/jar)
| 2.2.0 | 2.11 | [azure-cosmosdb-spark_2.2.0_2.11_1.1.1](https://search.maven.org/#artifactdetails%7Ccom.microsoft.azure%7Cazure-cosmosdb-spark_2.2.0_2.11%7C1.1.1%7Cjar)
| 2.1.0 | 2.11 | [azure-cosmosdb-spark_2.1.0_2.11_1.2.2](https://search.maven.org/artifact/com.microsoft.azure/azure-cosmosdb-spark_2.1.0_2.11/1.2.2/jar)

### Using Databricks notebooks

Create a library using your Databricks workspace by following the guidance in the Azure Databricks Guide > [Use the Azure Cosmos DB Spark connector](https://docs.azuredatabricks.net/spark/latest/data-sources/azure/cosmosdb-connector.html)

> [!NOTE]
> Note, the **Use the Azure Cosmos DB Spark Connector** page is currently not up-to-date. Instead of downloading the six separate jars into six different libraries, you can download the uber jar from maven at https://search.maven.org/artifact/com.microsoft.azure/azure-cosmosdb-spark_2.4.0_2.11/1.4.0/jar) and install this one jar/library.
> 

### Using spark-cli

To work with the connector using the spark-cli (that is, `spark-shell`, `pyspark`, `spark-submit`), you can use the `--packages` parameter with the connector's [maven coordinates](https://mvnrepository.com/artifact/com.microsoft.azure/azure-cosmosdb-spark_2.4.0_2.11).

```sh
spark-shell --master yarn --packages "com.microsoft.azure:azure-cosmosdb-spark_2.4.0_2.11:1.4.0"

```

### Using Jupyter notebooks

If you're using Jupyter notebooks within HDInsight, you can use spark-magic `%%configure` cell to specify the connector's maven coordinates.

```python
{ "name":"Spark-to-Cosmos_DB_Connector",
  "conf": {
    "spark.jars.packages": "com.microsoft.azure:azure-cosmosdb-spark_2.4.0_2.11:1.4.0",
    "spark.jars.excludes": "org.scala-lang:scala-reflect"
   }
   ...
}
```

> Note, the inclusion of the `spark.jars.excludes` is specific to remove potential conflicts between the connector, Apache Spark, and Livy.

### Build the connector

Currently, this connector project uses `maven` so to build without dependencies, you can run:

```sh
mvn clean package
```

## Working with our samples

The [Cosmos DB Spark GitHub repository](https://github.com/Azure/azure-cosmosdb-spark) has the following sample notebooks and scripts that you can try.

* **On-Time Flight Performance with Spark and Cosmos DB (Seattle)** [ipynb](https://github.com/Azure/azure-cosmosdb-spark/blob/master/samples/notebooks/On-Time%20Flight%20Performance%20with%20Spark%20and%20Cosmos%20DB%20-%20Seattle.ipynb) | [html](https://github.com/Azure/azure-cosmosdb-spark/blob/master/samples/notebooks/On-Time%20Flight%20Performance%20with%20Spark%20and%20Cosmos%20DB%20-%20Seattle.html): Connect Spark to Cosmos DB using HDInsight Jupyter notebook service to showcase Spark SQL, GraphFrames, and predicting flight delays using ML pipelines.
* **Twitter Source with Apache Spark and Azure Cosmos DB Change Feed**: [ipynb](https://github.com/Azure/azure-cosmosdb-spark/blob/master/samples/notebooks/Twitter%20with%20Spark%20and%20Azure%20Cosmos%20DB%20Change%20Feed.ipynb) | [html](https://github.com/Azure/azure-cosmosdb-spark/blob/master/samples/notebooks/Twitter%20with%20Spark%20and%20Azure%20Cosmos%20DB%20Change%20Feed.html)
* **Using Apache Spark to query Cosmos DB Graphs**: [ipynb](https://github.com/Azure/azure-cosmosdb-spark/blob/master/samples/notebooks/Using%20Apache%20Spark%20to%20query%20Cosmos%20DB%20Graphs.ipynb) | [html](https://github.com/Azure/azure-cosmosdb-spark/blob/master/samples/notebooks/Using%20Apache%20Spark%20to%20query%20Cosmos%20DB%20Graphs.html)
* **[Connecting Azure Databricks to Azure Cosmos DB](https://docs.databricks.com/spark/latest/data-sources/azure/cosmosdb-connector.html)** using `azure-cosmosdb-spark`.  Linked here is also an Azure Databricks version of the [On-Time Flight Performance notebook](https://github.com/dennyglee/databricks/tree/master/notebooks/Users/denny%40databricks.com/azure-databricks).
* **[Lambda Architecture with Azure Cosmos DB and HDInsight (Apache Spark)](https://github.com/Azure/azure-cosmosdb-spark/blob/master/samples/lambda/readme.md)**: You can reduce the operational overhead of maintaining big data pipelines using Cosmos DB and Spark.

## More Information

We have more information in the `azure-cosmosdb-spark` [wiki](https://github.com/Azure/azure-cosmosdb-spark/wiki) including:

* [Azure Cosmos DB Spark Connector User Guide](https://github.com/Azure/azure-documentdb-spark/wiki/Azure-Cosmos-DB-Spark-Connector-User-Guide)
* [Aggregations Examples](https://github.com/Azure/azure-documentdb-spark/wiki/Aggregations-Examples)

### Configuration and Setup

* [Spark Connector Configuration](https://github.com/Azure/azure-cosmosdb-spark/wiki/Configuration-references)
* [Spark to Cosmos DB Connector Setup](https://github.com/Azure/azure-documentdb-spark/wiki/Spark-to-Cosmos-DB-Connector-Setup) (In progress)
* [Configuring Power BI Direct Query to Azure Cosmos DB via Apache Spark (HDI)](https://github.com/Azure/azure-cosmosdb-spark/wiki/Configuring-Power-BI-Direct-Query-to-Azure-Cosmos-DB-via-Apache-Spark-(HDI))

### Troubleshooting

* [Using Cosmos DB Aggregates](https://github.com/Azure/azure-documentdb-spark/wiki/Troubleshooting:-Using-Cosmos-DB-Aggregates)
* [Known Issues](https://github.com/Azure/azure-cosmosdb-spark/wiki/Known-Issues)

### Performance

* [Performance Tips](https://github.com/Azure/azure-cosmosdb-spark/wiki/Performance-tips)
* [Query Test Runs](https://github.com/Azure/azure-documentdb-spark/wiki/Query-Test-Runs)
* [Writing Test Runs](https://github.com/Azure/azure-cosmosdb-spark/wiki/Writing-Test-Runs)

### Change Feed

* [Stream Processing Changes using Azure Cosmos DB Change Feed and Apache Spark](https://github.com/Azure/azure-cosmosdb-spark/wiki/Stream-Processing-Changes-using-Azure-Cosmos-DB-Change-Feed-and-Apache-Spark)
* [Change Feed Demos](https://github.com/Azure/azure-cosmosdb-spark/wiki/Change-Feed-demos)
* [Structured Stream Demos](https://github.com/Azure/azure-cosmosdb-spark/wiki/Structured-Stream-demos)

### Monitoring

* [Monitoring Spark jobs with application insights](https://github.com/Azure/azure-cosmosdb-spark/tree/2.3/samples/monitoring)

## Next steps

If you haven't already, download the Spark to Azure Cosmos DB connector from the [azure-cosmosdb-spark](https://github.com/Azure/azure-cosmosdb-spark) GitHub repository. Explore the following additional resources in the repo:

* [Aggregations examples](https://github.com/Azure/azure-cosmosdb-spark/wiki/Aggregations-Examples)
* [Sample scripts and notebooks](https://github.com/Azure/azure-cosmosdb-spark/tree/master/samples)

You might also want to review the [Apache Spark SQL, DataFrames, and Datasets Guide](https://spark.apache.org/docs/latest/sql-programming-guide.html), and the [Apache Spark on Azure HDInsight](../hdinsight/spark/apache-spark-jupyter-spark-sql.md) article.
