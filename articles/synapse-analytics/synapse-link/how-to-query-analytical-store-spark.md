---
title: Query Cosmos DB analytical with Synapse Spark
description: How to query Cosmos DB analytical with Synapse Spark
services: synapse-analytics 
author: ArnoMicrosoft
ms.service: synapse-analytics 
ms.topic: quickstart
ms.subservice: 
ms.date: 05/06/2020
ms.author: acomet
ms.reviewer: jrasnick
---

# Query Cosmos DB analytical with Synapse Spark

This article gives some examples on how you can interact with the analytical store from Synapse gestures. Those gestures are visible when you right-click on a container.

When you right click into a container, Synapse will be able to infer which linked service, database and container it refers to. Such gestures are very simple to get quickly code and tweak it to your needs but they are also perfect for discovering data in a single click.

## Load to DataFrame

In this step, you will read from Azure Cosmos DB analytical store into a Spark DataFrame and display 10 rows from the DataFrame called df. Once your data is into dataframe, you can perform additional analysis. This operation does not impact the transactional store.

```python
# To select a preferred list of regions in a multi-region Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

df = spark.read.format("cosmos.olap")\
    .option("spark.synapse.linkedService", "INFERRED")\
    .option("spark.cosmos.container", "INFERRED")\
    .load()

​df.show(10)
```

## Create Spark table

In this gesture, you will create a Spark table pointing to the container you selected. That operation does not incur any data movement. If you decide to delete that table, the underlying container (and corresponding analytical store) won't be impacted. This scenario is very convenient to reuse tables through 3rd party tools and provide accessibility to the data for the run-time.

```sql
%%sql
-- To select a preferred list of regions in a multi-region Cosmos DB account, add spark.cosmos.preferredRegions '<Region1>,<Region2>' in the config options

create table call_center using cosmos.olap options (
    spark.synapse.linkedService 'INFERRED',
    spark.cosmos.container 'INFERRED'
)
```

## Write DataFrame to container
In this gesture, you will write back a dataframe into a container. This operation will impact the transactional performance and consume Request Units. Using Azure Cosmos DB transactional performance will optimize the speed and reliability of those write transactions. Make sure that you replace **YOURDATAFRAME** by the dataframe that you want to write back.

```python
# Write a Spark DataFrame into a Cosmos DB container
# To select a preferred list of regions in a multi-region Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")


YOURDATAFRAME.write.format("cosmos.oltp")\
    .option("spark.synapse.linkedService", "INFERRED")\
    .option("spark.cosmos.container", "INFERRED")\
    .option("spark.cosmos.write.upsertEnabled", "true")\
    .mode('append')\
    .save()
```

## Load streaming DataFrame from container
In this gesture, you will use Spark Streaming capability with change feed support to load data from a container into a dataframe with data being stored into the primary data lake account that you connected to the workspace. If the folder /localReadCheckpointFolder is not created, it will be automatically created. This operation will impact the transactional performance of Cosmos DB.

```python
# To select a preferred list of regions in a multi-region Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

dfStream = spark.readStream\
    .format("cosmos.oltp")\
    .option("spark.synapse.linkedService", "INFERRED")\
    .option("spark.cosmos.container", "INFERRED")\
    .option("spark.cosmos.changeFeed.readEnabled", "true")\
    .option("spark.cosmos.changeFeed.startFromTheBeginning", "true")\
    .option("spark.cosmos.changeFeed.checkpointLocation", "/localReadCheckpointFolder")\
    .option("spark.cosmos.changeFeed.queryName", "streamQuery")\
    .load()
```

## Write streaming DataFrame to container
In this gesture, you will write a streaming dataframe into the Cosmos DB container you selected. If the folder /localReadCheckpointFolder is not created, it will be automatically created. This operation will impact the transactional performance of Cosmos DB.

```python
# To select a preferred list of regions in a multi-region Cosmos DB account, add .option("spark.cosmos.preferredRegions", "<Region1>,<Region2>")

streamQuery = dfStream\
        .writeStream\
        .format("cosmos.oltp")\
        .outputMode("append")\
        .option("checkpointLocation", "/localWriteCheckpointFolder")\
        .option("spark.synapse.linkedService", "INFERRED")\
        .option("spark.cosmos.container", "trafficSourceColl_sink")\
        .option("spark.cosmos.connection.mode", "gateway")\
        .start()

streamQuery.awaitTermination()
```