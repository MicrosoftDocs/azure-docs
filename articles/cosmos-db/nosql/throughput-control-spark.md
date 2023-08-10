---
title: Azure Cosmos DB Spark Connector - Throughput Control
description: Learn about controlling throughput for bulk data movements in the Azure Cosmos DB Spark Connector
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 06/22/2022
ms.author: thvankra

---

# Azure Cosmos DB Spark Connector - throughput control
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The [Spark Connector](quickstart-spark.md) allows you to communicate with Azure Cosmos DB using [Apache Spark](https://spark.apache.org/). This article describes how the throughput control feature works. Check out our [Spark samples in GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples) to get started using throughput control.

> [!TIP]
> This article documents the use of global throughput control groups in the Azure Cosmos DB Spark Connector, but the functionality is also available in the [Java SDK](./sdk-java-v4.md). In the SDK, you can also use both global and local Throughput Control groups to limit the RU consumption in the context of a single client connection instance. For example, you can apply this to different operations within a single microservice, or maybe to a single data loading program. Take a look at documentation on how to [use throughput control](quickstart-java.md#use-throughput-control) in the Java SDK.

> [!WARNING]
> Please note that throughput control is not yet supported for gateway mode. 
> Currently, for [serverless Azure Cosmos DB accounts](../serverless.md), attempting to use `targetThroughputThreshold` to define a percentage will result in failure. You can only provide an absolute value for target throughput/RU using `spark.cosmos.throughputControl.targetThroughput`.  

## Why is throughput control important?

 Having throughput control helps to isolate the performance needs of applications running against a container, by limiting the amount of [request units](../request-units.md) that can be consumed by a given Spark client. 

There are several advanced scenarios that benefit from client-side throughput control:

- **Different operations and tasks have different priorities** - there can be a need to prevent normal transactions from being throttled due to data ingestion or copy activities. Some operations and/or tasks aren't sensitive to latency, and are more tolerant to being throttled than others.

- **Provide fairness/isolation to different end users/tenants** - An application will usually have many end users. Some users may send too many requests, which consume all available throughput, causing others to get throttled.

- **Load balancing of throughput between different Azure Cosmos DB clients** - in some use cases, it's important to make sure all the clients get a fair (equal) share of the throughput


Throughput control enables the capability for more granular level RU rate limiting as needed.

## How does throughput control work?

Throughput control for the Spark Connector is configured by first creating a container that will define throughput control metadata, with a partition key of `groupId`, and `ttl` enabled. Here we create this container using Spark SQL, and call it `ThroughputControl`:


```sql
    %sql
    CREATE TABLE IF NOT EXISTS cosmosCatalog.`database-v4`.ThroughputControl 
    USING cosmos.oltp
    OPTIONS(spark.cosmos.database = 'database-v4')
    TBLPROPERTIES(partitionKeyPath = '/groupId', autoScaleMaxThroughput = '4000', indexingPolicy = 'AllProperties', defaultTtlInSeconds = '-1');
```

> [!NOTE]
> The above example creates a container with [autoscale](../provision-throughput-autoscale.md). If you prefer standard provisioning, you can replace `autoScaleMaxThroughput` with `manualThroughput` instead. 

> [!IMPORTANT]
> The partition key must be defined as `/groupId`, and `ttl` must be enabled, for the throughput control feature to work. 

Within the Spark config of a given application, we can then specify parameters for our workload. The below example sets throughput control as `enabled`, as well as defining a throughput control group `name` and a `targetThroughputThreshold`. We also define the `database` and `container` in which through control group is maintained:  

```scala
    "spark.cosmos.throughputControl.enabled" -> "true",
    "spark.cosmos.throughputControl.name" -> "SourceContainerThroughputControl",
    "spark.cosmos.throughputControl.targetThroughputThreshold" -> "0.95", 
    "spark.cosmos.throughputControl.globalControl.database" -> "database-v4", 
    "spark.cosmos.throughputControl.globalControl.container" -> "ThroughputControl"
```

In the above example, the `targetThroughputThreshold` is defined as **0.95**, so rate limiting will occur (and requests will be retried) when clients consume more than 95% (+/- 5-10 percent) of the throughput that is allocated to the container. This configuration is stored as a document in the throughput container that looks like the below:

```json
    {
        "id": "ZGF0YWJhc2UtdjQvY3VzdG9tZXIvU291cmNlQ29udGFpbmVyVGhyb3VnaHB1dENvbnRyb2w.info",
        "groupId": "database-v4/customer/SourceContainerThroughputControl.config",
        "targetThroughput": "",
        "targetThroughputThreshold": "0.95",
        "isDefault": true,
        "_rid": "EHcYAPolTiABAAAAAAAAAA==",
        "_self": "dbs/EHcYAA==/colls/EHcYAPolTiA=/docs/EHcYAPolTiABAAAAAAAAAA==/",
        "_etag": "\"2101ea83-0000-1100-0000-627503dd0000\"",
        "_attachments": "attachments/",
        "_ts": 1651835869
    }
```
> [!NOTE]
> Throughput control does not do RU pre-calculation of each operation. Instead, it tracks the RU usages *after* the operation based on the response header. As such, throughput control is based on an approximation - and **does not guarantee** that amount of throughput will be available for the group at any given time. This means that if the configured RU is so low that a single operation can use it all, then throughput control cannot avoid the RU exceeding the configured limit. Therefore, throughput control works best when the configured limit is higher than any single operation that can be executed by a client in the given control group. With that in mind, when reading via query or change feed, you should configure the page size in `spark.cosmos.read.maxItemCount` (default 1000) to be a modest amount, so that client throughput control can be re-calculated with higher frequency, and therefore reflected more accurately at any given time. However, when using throughput control for a write-job using bulk, the number of documents executed in a single request will automatically be tuned based on the throttling rate to allow the throughput control to kick-in as early as possible.

> [!WARNING]
> The `targetThroughputThreshold` is **immutable**. If you change the target throughput threshold value, this will create a new throughput control group (but as long as you use Version 4.10.0 or later it can have the same name). You need to restart all Spark jobs that are using the group if you want to ensure they all consume the new threshold immediately (otherwise they will pick-up the new threshold after the next restart).

For each Spark client that uses the throughput control group, a record will be created in the `ThroughputControl` container - with a ttl of a few seconds - so the documents will vanish pretty quickly if a Spark client isn't actively running anymore -  which looks like the below:

```json
    {
        "id": "Zhjdieidjojdook3osk3okso3ksp3ospojsp92939j3299p3oj93pjp93jsps939pkp9ks39kp9339skp",
        "groupId": "database-v4/customer/SourceContainerThroughputControl.config",
        "_etag": "\"1782728-w98999w-ww9998w9-99990000\"",
        "ttl": 10,
        "initializeTime": "2022-06-26T02:24:40.054Z",
        "loadFactor": 0.97636377638898,
        "allocatedThroughput": 484.89444487847,
        "_rid": "EHcYAPolTiABAAAAAAAAAA==",
        "_self": "dbs/EHcYAA==/colls/EHcYAPolTiA=/docs/EHcYAPolTiABAAAAAAAAAA==/",
        "_etag": "\"2101ea83-0000-1100-0000-627503dd0000\"",
        "_attachments": "attachments/",
        "_ts": 1651835869
    }
```

In each client record, the `loadFactor` attribute represents the load on the given client, relative to other clients in the throughput control group. The `allocatedThroughput` attribute shows how many RUs are currently allocated to this client. The Spark Connector will adjust allocated throughput for each client based on its load. This will ensure that each client gets a share of the throughput available that is proportional to its load, and all clients together don't consume more than the total allocated for the throughput control group to which they belong. 


## Next steps

* [Spark samples in GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples).
* [Manage data with Azure Cosmos DB Spark 3 OLTP Connector for API for NoSQL](quickstart-spark.md).
* Learn more about [Apache Spark](https://spark.apache.org/).
