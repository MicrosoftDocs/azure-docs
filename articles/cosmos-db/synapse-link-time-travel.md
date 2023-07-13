---
title: Time travel in Azure Synapse Link (preview)
titleSuffix: Azure Cosmos DB for NoSQL
description: Time travel enables you to access Azure Cosmos DB data in the analytical store, precisely as it appeared at specific points in time.
author: Rodrigossz
ms.author: rosouz
ms.topic: conceptual
ms.service: cosmos-db
ms.subservice: nosql
ms.date: 06/01/2023
---

# Time travel in Azure Synapse Link for Azure Cosmos DB for NoSQL (preview)

[!INCLUDE[NoSQL, MongoDB](includes/appliesto-nosql-mongodb.md)]

Time travel enables you to access Azure Cosmos DB data in the analytical store, precisely as it appeared at specific points in time in history (down to the millisecond level). With time-travel, you can effortlessly query past data that has been updated or deleted, analyze trends, and compare differences between two points of interest.

This article covers how to do time travel analysis on your Azure Cosmos DB data stored in the analytical store. The analytical store is created when you enable Azure Synapse Link in your containers.

> [!IMPORTANT]
> Time Travel feature is currently in public preview. This preview version is provided without a service level agreement and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## How does it work?

To perform time-travel operations on Azure Cosmos DB data, ensure that your Azure Cosmos DB account has been enabled for [Azure Synapse Link](synapse-link.md). Also, ensure that you have enabled Azure Synapse Link in your container. Azure Synapse Link enables the [analytical store](analytical-store-introduction.md) for your container, and is then used for Azure Synapse Link analysis including time travel.

If an Analytical Time-To-Live (ATTL) is defined on the Azure Cosmos DB container, it serves as the maximum retention period for time-travel operations. If ATTL isn't defined or set as -1, you have maximum retention period. In other words, you can travel back to any time since when Azure Synapse Link was enabled.

:::image type="content" source="media/synapse-link-time-travel/example-time-travel.png" lightbox="media/synapse-link-time-travel/example-time-travel.png" alt-text="Screenshot of an example of time-travel with different data at various points in time.":::

## When to use?

Here are some supported time travel scenarios:

- **Data Audit**: Auditing data changes is crucial for data compliance and understanding how data has evolved over time. The time-travel feature empowers you to track changes, access all versions of updates, and perform data analysis at any desired point in time.
- **Trend Analysis**: By specifying the combination of “spark.cosmos.timetravel.startTimestamp” and “spark.cosmos.timetravel.timestampAsOf” configurations, you can compare and analyze differences between two specific points in time. For instance, you can compare the product inventory quantity from three months ago with that from six months ago.
- **Repairing Accidental Data Changes**: The time-travel feature is invaluable for rectifying individual records to their last known good state, making it efficient to perform repairs without resorting to backups and restores. Once you access the desired data as it existed in the last known good state using the “timestampAsOf” value, you can either update the Azure Cosmos DB container with that data or ingest the records into a new container.
- **Azure Cosmos DB Container as a Slowly Changing Dimension**: Slowly changing dimensions are used to keep track of changes in attribute values and to report historical data at any given point of time. Time-travel queries, along with the “fullFidelity” option, provide the functionality of Type 2 slowly changing dimensions by keeping track of attribute value changes represented as separate rows with validity period.

## Using time travel

This code sample demonstrates how to load a Spark DataFrame with records from the product container and can be executed using Azure Synapse Spark Notebook.

### [Scala](#tab/scala)

```scala
import com.microsoft.azure.cosmos.analytics.spark.connector.datasource.CosmosOlapTimeTravel

val configuration = Map(
    "spark.synapse.linkedService" -> "CosmosDBLS",
    "spark.cosmos.container" ->  "product",
    "spark.cosmos.timetravel.timestampAsOf" -> "2022-01-01 00:00:00"
)

val df = CosmosOlapTimeTravel.load(configuration)
display(df)
```

### [Python](#tab/python)

```python
from pyspark.sql import DataFrame, SQLContext
sqlCtx = SQLContext(sc)

configuration = {
  "spark.synapse.linkedService": "CosmosDBLS",
  "spark.cosmos.container": "product",
  "spark.cosmos.timetravel.timestampAsOf": "2022-01-01 00:00:00"
  }
                                                                                           
cosmosOlapTimeTravel = sc._jvm.com.microsoft.azure.cosmos.analytics.spark.connector.datasource.CosmosOlapTimeTravel
df = DataFrame(cosmosOlapTimeTravel.load(configuration), sqlCtx)
display(df)
```

---

## Configuration

| Setting | Default | Description |
| --- | --- | --- |
| `spark.cosmos.timetravel.timestampAsOf` | *current timestamp* | Historical timestamp at millisecond-level precision to travel back in history to. |
| `spark.cosmos.timetravel.startTimestamp` | *from the beginning* | Timestamp to start Time-Travel from. This config can be used in combination with “spark.cosmos.timetravel.timestampAsOf” to compare and analyze differences between two specific points in time for use cases such as trend analysis. |
| `spark.cosmos.timetravel.ignoreTransactionalTTLDeletes` | `FALSE` | Ignore the records that got TTL-ed out from transactional store. Set this setting to `TRUE` if you would like to see the records in the time travel result set that got TTL-ed out from transactional store. |
| `spark.cosmos.timetravel.ignoreTransactionalUserDeletes` | `FALSE` | Ignore the records the user deleted from the transactional store. Set this setting to `TRUE` if you would like to see the records in time travel result set that is deleted from the transactional store. |
| `spark.cosmos.timetravel.fullFidelity` | `FALSE` | Set this setting to `TRUE` if you would like to access all versions of records (including intermediate updates) at a specific point in history. |

> [!IMPORTANT]
> All configuration settings are used in UTC timezone.

## Limitations

- Time Travel is only available for Azure Synapse Spark.
- Time Travel is only available for API for NoSQL and API for MongoDB. APIs for Gremlin and Cassandra aren't supported at this time.
- You aren't able to use time travel before the time Azure Synapse Link was enabled in your container.

## Pricing

There's no extra cost for this feature. The cost for using this feature contains the [Azure Synapse Link pricing](synapse-link.md#pricing), and the [Azure Synapse Apache Synapse Spark pricing](https://azure.microsoft.com/pricing/details/synapse-analytics/#pricing) for running time travel jobs on analytical store.

## Next steps

To learn more, see the following docs:

- [Azure Synapse Link for Azure Cosmos DB](synapse-link.md)
- [Get started with Azure Synapse Link for Azure Cosmos DB](configure-synapse-link.md)
- [Frequently asked questions about Azure Synapse Link for Azure Cosmos DB](synapse-link-frequently-asked-questions.yml)
