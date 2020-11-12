---

title: Interact with Azure Cosmos DB using Apache Spark in Azure Synapse Link (preview)
description: How to interact with Azure Cosmos DB using Apache Spark in Azure Synapse Link
services: synapse-analytics 
author: ArnoMicrosoft
ms.service: synapse-analytics 
ms.topic: quickstart
ms.subservice: synapse-link
ms.date: 09/15/2020
ms.author: acomet
ms.reviewer: jrasnick
---

# Interact with Azure Cosmos DB using Apache Spark in Azure Synapse Link (preview)

In this article, you'll learn how to interact with Azure Cosmos DB using Synapse Apache Spark. With its full support for Scala, Python, SparkSQL, and C#, Synapse Apache Spark is central to analytics, data engineering, data science, and data exploration scenarios in [Azure Synapse Link for Azure Cosmos DB](../../cosmos-db/synapse-link.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json).

The following capabilities are supported while interacting with Azure Cosmos DB:
* Synapse Apache Spark allows you to analyze data in your Azure Cosmos DB containers that are enabled with Azure Synapse Link in near real-time without impacting the performance of your transactional workloads. The following two options are available to query the Azure Cosmos DB [analytical store](../../cosmos-db/analytical-store-introduction.md?toc=/azure/synapse-analytics/toc.json&bc=/azure/synapse-analytics/breadcrumb/toc.json) from Spark:
    + Load to Spark DataFrame
    + Create Spark table
* Synapse Apache Spark also allows you to ingest data into Azure Cosmos DB. It is important to note that data is always ingested into Azure Cosmos DB containers through the transactional store. When Synapse Link is enabled, any new inserts, updates, and deletes are then automatically synced to the analytical store.
* Synapse Apache Spark also supports Spark structured streaming with Azure Cosmos DB as a source as well as a sink. 

The following sections walk you through the syntax of above capabilities. Gestures in Azure Synapse Analytics workspace are designed to provide an easy out-of-the-box experience to get started. Gestures are visible when you right-click on an Azure Cosmos DB container in the **Data** tab of the Synapse workspace. With gestures, you can quickly generate code and tailor it to your needs. Gestures are also perfect for discovering data with a single click.

## Query Azure Cosmos DB analytical store

Before you learn about the two possible options to query Azure Cosmos DB analytical store, loading to Spark DataFrame and creating Spark table, it is worth exploring the differences in experience so you can choose the option that works for your needs.

The difference in experience is around whether underlying data changes in the Azure Cosmos DB container should be automatically reflected in the analysis performed in Spark. When either a Spark DataFrame is registered or a Spark table is created against a container's analytical store, metadata around the current snapshot of data in the analytical store is fetched to Spark for efficient pushdown of subsequent analysis. It is important to note that since Spark follows a lazy evaluation policy, unless an action is invoked on the Spark DataFrame or a SparkSQL query is executed against the Spark table, actual data is not fetched from the underlying container's analytical store.

In the case of **loading to Spark DataFrame**, the fetched metadata is cached through the lifetime of the Spark session and hence subsequent actions invoked on the DataFrame are evaluated against the snapshot of the analytical store at the time of DataFrame creation.

On the other hand, in the case of **creating a Spark table**, the metadata of the analytical store state is not cached in Spark and is reloaded on every SparkSQL query execution against the Spark table.

Thus, you can choose between loading to Spark DataFrame and creating a Spark table based on whether you want your Spark analysis to be evaluated against a fixed snapshot of the analytical store or against the latest snapshot of the analytical store respectively.

> [!NOTE]
> To query the Azure Cosmos DB API of Mongo DB accounts, learn more about the [full fidelity schema representation](../../cosmos-db/analytical-store-introduction.md#analytical-schema) in the analytical store and the extended property names to be used.

### Load to Spark DataFrame

In this example, you'll create a Spark DataFrame that points to the Azure Cosmos DB analytical store. You can then perform additional analysis by invoking Spark actions against the DataFrame. This operation doesn't impact the transactional store.

The syntax in **Python** would be the following:
```python
# To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

df = spark.read.format("cosmos.olap")\
    .option("spark.synapse.linkedService", "<enter linked service name>")\
    .option("spark.cosmos.container", "<enter container name>")\
    .load()
```

The equivalent syntax in **Scala** would be the following:
```java
// To select a preferred list of regions in a multi-region Azure Cosmos DB account, add option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

val df_olap = spark.read.format("cosmos.olap").
    option("spark.synapse.linkedService", "<enter linked service name>").
    option("spark.cosmos.container", "<enter container name>").
    load()
```

### Create Spark table

In this example, you'll create a Spark table that points the Azure Cosmos DB analytical store. You can then perform additional analysis by invoking SparkSQL queries against the table. This operation neither impacts the transactional store nor does it incur any data movement. If you decide to delete this Spark table, the underlying Azure Cosmos DB container and the corresponding analytical store will not be affected. 

This scenario is convenient to reuse Spark tables through third-party tools and provide accessibility to the underlying data for the run-time.

The syntax to create a Spark table is as follows:
```sql
%%sql
-- To select a preferred list of regions in a multi-region Azure Cosmos DB account, add spark.cosmos.preferredRegions '<Region1>,<Region2>' in the config options

create table call_center using cosmos.olap options (
    spark.synapse.linkedService '<enter linked service name>',
    spark.cosmos.container '<enter container name>'
)
```

> [!NOTE]
> If you have scenarios where the schema of the underlying Azure Cosmos DB container changes over time; and if you want the updated schema to automatically reflect in the queries against the Spark table, you can achieve this by setting the `spark.cosmos.autoSchemaMerge`  option to `true` in the Spark table options.


## Write Spark DataFrame to Azure Cosmos DB container

In this example, you'll write a Spark DataFrame into an Azure Cosmos DB container. This operation will impact the performance of transactional workloads and consume request units provisioned on the Azure Cosmos DB container or the shared database.

The syntax in **Python** would be the following:
```python
# Write a Spark DataFrame into an Azure Cosmos DB container
# To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

YOURDATAFRAME.write.format("cosmos.oltp")\
    .option("spark.synapse.linkedService", "<enter linked service name>")\
    .option("spark.cosmos.container", "<enter container name>")\
    .option("spark.cosmos.write.upsertEnabled", "true")\
    .mode('append')\
    .save()
```

The equivalent syntax in **Scala** would be the following:
```java
// To select a preferred list of regions in a multi-region Azure Cosmos DB account, add option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

import org.apache.spark.sql.SaveMode

df.write.format("cosmos.oltp").
    option("spark.synapse.linkedService", "<enter linked service name>").
    option("spark.cosmos.container", "<enter container name>"). 
    option("spark.cosmos.write.upsertEnabled", "true").
    mode(SaveMode.Overwrite).
    save()
```

## Load streaming DataFrame from container
In this gesture, you'll use Spark Streaming capability to load data from a container into a dataframe. The data will be stored in the primary data lake account (and file system) you connected to the workspace. 
> [!NOTE]
> If you are looking to reference external libraries in Synapse Apache Spark, learn more [here](#external-library-management). For instance, if you are looking to ingest a Spark DataFrame to a container of Cosmos DB API for Mongo DB, you can leverage the Mongo DB connector for Spark [here](https://docs.mongodb.com/spark-connector/master/).

## Load streaming DataFrame from Azure Cosmos DB container
In this example, you'll use Spark's structured streaming capability to load data from an Azure Cosmos DB container into a Spark streaming DataFrame using the change feed functionality in Azure Cosmos DB. The checkpoint data used by Spark will be stored in the primary data lake account (and file system) that you connected to the workspace.

If the folder */localReadCheckpointFolder* isn't created (in the example below), it will be automatically created. This operation will impact the performance of transactional workloads and consume Request Units provisioned on the Azure Cosmos DB container or shared database.

The syntax in **Python** would be the following:
```python
# To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

dfStream = spark.readStream\
    .format("cosmos.oltp")\
    .option("spark.synapse.linkedService", "<enter linked service name>")\
    .option("spark.cosmos.container", "<enter container name>")\
    .option("spark.cosmos.changeFeed.readEnabled", "true")\
    .option("spark.cosmos.changeFeed.startFromTheBeginning", "true")\
    .option("spark.cosmos.changeFeed.checkpointLocation", "/localReadCheckpointFolder")\
    .option("spark.cosmos.changeFeed.queryName", "streamQuery")\
    .load()
```

The equivalent syntax in **Scala** would be the following:
```java
// To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

val dfStream = spark.readStream.
    format("cosmos.oltp").
    option("spark.synapse.linkedService", "<enter linked service name>").
    option("spark.cosmos.container", "<enter container name>").
    option("spark.cosmos.changeFeed.readEnabled", "true").
    option("spark.cosmos.changeFeed.startFromTheBeginning", "true").
    option("spark.cosmos.changeFeed.checkpointLocation", "/localReadCheckpointFolder").
    option("spark.cosmos.changeFeed.queryName", "streamQuery").
    load()
```

## Write streaming DataFrame to Azure Cosmos DB container
In this example, you'll write a streaming DataFrame into an Azure Cosmos DB container. This operation will impact the performance of transactional workloads and consume Request Units provisioned on the Azure Cosmos DB container or shared database. If the folder */localWriteCheckpointFolder* isn't created (in the example below), it will be automatically created. 

The syntax in **Python** would be the following:
```python
# To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

streamQuery = dfStream\
        .writeStream\
        .format("cosmos.oltp")\
        .outputMode("append")\
        .option("checkpointLocation", "/localWriteCheckpointFolder")\
        .option("spark.synapse.linkedService", "<enter linked service name>")\
        .option("spark.cosmos.container", "<enter container name>")\
        .option("spark.cosmos.connection.mode", "gateway")\
        .start()

streamQuery.awaitTermination()
```

The equivalent syntax in **Scala** would be the following:
```java
// To select a preferred list of regions in a multi-region Azure Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

val query = dfStream.
            writeStream.
            format("cosmos.oltp").
            outputMode("append").
            option("checkpointLocation", "/localWriteCheckpointFolder").
            option("spark.synapse.linkedService", "<enter linked service name>").
            option("spark.cosmos.container", "<enter container name>").
            option("spark.cosmos.connection.mode", "gateway").
            start()

query.awaitTermination()
```

## External library management

In this example, you'll learn how to reference external libraries from JAR files when using Spark notebooks in Synpase Apache Spark workspaces. You can place the JAR files in a container in the primary data lake account that you connected to the workspace and then add the following `%configure` statement in your Spark notebook:

```cmd
%%configure -f
{
    "jars": [
        "abfss://<storage container name>@<data lake account name>.dfs.core.windows.net/<path to jar>"
    ]
}
```
If you are looking to submit remote Spark job definitions to a serverless Apache Spark pool, you can learn how to reference external libraries by following this [tutorial](../spark/apache-spark-job-definitions.md).

## Next steps

* [Samples to get started with Azure Synapse Link on GitHub](https://aka.ms/cosmosdb-synapselink-samples)
* [Learn what is supported in Azure Synapse Link for Azure Cosmos DB](./concept-synapse-link-cosmos-db-support.md)
* [Connect to Synapse Link for Azure Cosmos DB](../quickstart-connect-synapse-link-cosmos-db.md)
