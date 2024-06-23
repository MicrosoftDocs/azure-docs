---
title: 'Azure Cosmos DB Spark connector: Throughput control'
description: Learn how you can control throughput for bulk data movements in the Azure Cosmos DB Spark connector.
author: TheovanKraay
ms.service: cosmos-db
ms.subservice: nosql
ms.topic: how-to
ms.date: 06/22/2022
ms.author: thvankra

---

# Azure Cosmos DB Spark connector: Throughput control
[!INCLUDE[NoSQL](../includes/appliesto-nosql.md)]

The [Spark connector](quickstart-spark.md) allows you to communicate with Azure Cosmos DB by using [Apache Spark](https://spark.apache.org/). This article describes how the throughput control feature works. Check out our [Spark samples in GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples) to get started using throughput control.

This article documents the use of global throughput control groups in the Azure Cosmos DB Spark connector, but the functionality is also available in the [Java SDK](./sdk-java-v4.md). In the SDK, you can use global and local throughput control groups to limit the request unit (RU) consumption in the context of a single client connection instance. For example, you can apply this approach to different operations within a single microservice, or maybe to a single data loading program. For more information, see how to [use throughput control](quickstart-java.md) in the Java SDK.

> [!WARNING]
> Throughput control isn't supported for gateway mode. Currently, for [serverless Azure Cosmos DB accounts](../serverless.md), attempting to use `targetThroughputThreshold` to define a percentage results in failure. You can only provide an absolute value for target throughput/RU by using `spark.cosmos.throughputControl.targetThroughput`.

## Why is throughput control important?

 Throughput control helps to isolate the performance needs of applications that run against a container. Throughput control limits the amount of [RUs](../request-units.md) that a specific Spark client can consume.

Several advanced scenarios benefit from client-side throughput control:

- **Different operations and tasks have different priorities:** There can be a need to prevent normal transactions from being throttled because of data ingestion or copy activities. Some operations or tasks aren't sensitive to latency and are more tolerant to being throttled than others.
- **Provide fairness/isolation to different users or tenants:** An application usually has many users. Some users might send too many requests, which consume all available throughput and cause others to get throttled.
- **Load balancing of throughput between different Azure Cosmos DB clients:** In some use cases, it's important to make sure all the clients get a fair (equal) share of the throughput.

Throughput control enables the capability for more granular-level RU rate limiting, as needed.

## How does throughput control work?

To configure throughput control for the Spark connector, you first create a container that defines throughput control metadata. The partition key is `groupId` and `ttl` is enabled. Here, you create this container by using Spark SQL and call it `ThroughputControl`:

```sql
    %sql
    CREATE TABLE IF NOT EXISTS cosmosCatalog.`database-v4`.ThroughputControl 
    USING cosmos.oltp
    OPTIONS(spark.cosmos.database = 'database-v4')
    TBLPROPERTIES(partitionKeyPath = '/groupId', autoScaleMaxThroughput = '4000', indexingPolicy = 'AllProperties', defaultTtlInSeconds = '-1');
```

The preceding example creates a container with [autoscale](../provision-throughput-autoscale.md). If you prefer standard provisioning, you can replace `autoScaleMaxThroughput` with `manualThroughput`.

> [!IMPORTANT]
> The partition key must be defined as `/groupId` and `ttl` must be enabled for the throughput control feature to work.

Within the Spark configuration of a specific application, you can then specify parameters for the workload. The following example sets throughput control as `enabled`. The example defines a throughput control group `name` parameter and a `targetThroughputThreshold` parameter. You also define the `database` and `container` parameters in which the throughput control group is maintained:

```scala
    "spark.cosmos.throughputControl.enabled" -> "true",
    "spark.cosmos.throughputControl.name" -> "SourceContainerThroughputControl",
    "spark.cosmos.throughputControl.targetThroughputThreshold" -> "0.95", 
    "spark.cosmos.throughputControl.globalControl.database" -> "database-v4", 
    "spark.cosmos.throughputControl.globalControl.container" -> "ThroughputControl"
```

In the preceding example, the `targetThroughputThreshold` parameter is defined as **0.95**. Rate limiting occurs (and requests are retried) when clients consume more than 95 percent (+/- 5-10 percent) of the throughput allocated to the container. This configuration is stored as a document in the throughput container, which looks like this example:

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

Throughput control doesn't do RU precalculation of each operation. Instead, it tracks the RU usages *after* the operation based on the response header. As such, throughput control is based on an approximation and *doesn't guarantee* that amount of throughput is available for the group at any certain time.

For this reason, if the configured RU is so low that a single operation can use it all, throughput control can't avoid the RU exceeding the configured limit. Throughput control works best when the configured limit is higher than any single operation that a client in the specific control group can execute.

When you read via query or change feed, you should configure the page size in `spark.cosmos.read.maxItemCount` (default 1000) to be a modest amount. In this way, the client throughput control can be recalculated with higher frequency and reflected more accurately at any specific time. When you use throughput control for a write job using bulk, the number of documents executed in a single request is automatically tuned based on the throttling rate to allow the throughput control to begin as early as possible.

> [!WARNING]
> The `targetThroughputThreshold` parameter is *immutable*. If you change the target throughput threshold value, a new throughput control group is created. (If you use version 4.10.0 or later, it can have the same name.) You need to restart all Spark jobs that are using the group if you want to ensure that they all consume the new threshold immediately. Otherwise, they pick up the new threshold after the next restart.

For each Spark client that uses the throughput control group, a record is created in the `ThroughputControl` container, with a `ttl` of a few seconds. As a result, the documents vanish quickly if a Spark client isn't actively running anymore. Here's an example:

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

In each client record, the `loadFactor` attribute represents the load on the specific client, relative to other clients in the throughput control group. The `allocatedThroughput` attribute shows how many RUs are currently allocated to this client. The Spark connector adjusts allocated throughput for each client based on its load. In this way, each client gets a share of the throughput available that's proportional to its load. All clients together don't consume more than the total allocated for the throughput control group to which they belong.

## Related content

* See [Spark samples in GitHub](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/cosmos/azure-cosmos-spark_3_2-12/Samples).
* Learn how to [manage data with Azure Cosmos DB Spark 3 OLTP connector for API for NoSQL](quickstart-spark.md).
* Learn more about [Apache Spark](https://spark.apache.org/).
