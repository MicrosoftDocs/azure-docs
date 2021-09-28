---
title: Monitor and debug with insights in Azure Cosmos DB
description: Use metrics in Azure Cosmos DB to debug common issues and monitor the database.
ms.author: esarroyo
author: StefArroyo 
ms.reviewer: sngun
ms.service: cosmos-db
ms.subservice: cosmosdb-sql
ms.topic: how-to
ms.date: 07/14/2021
ms.custom: devx-track-csharp
---
# Monitor and debug with insights in Azure Cosmos DB
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

Azure Cosmos DB provides insights for throughput, storage, consistency, availability, and latency. The Azure portal provides an aggregated view of these metrics. You can also view Azure Cosmos DB metrics from Azure Monitor API. The dimension values for the metrics such as container name are case-insensitive. So you need to use case-insensitive comparison when doing string comparisons on these dimension values. To learn about how to view metrics from Azure monitor, see the [Get metrics from Azure Monitor](./monitor-cosmos-db.md) article.

This article walks through common use cases and how Azure Cosmos DB insights can be used to analyze and debug these issues. By default, the metric insights are collected every five minutes and are kept for seven days.

## View insights from Azure portal

1. Sign into [Azure portal](https://portal.azure.com/) and navigate to your Azure Cosmos DB account.

1. You can view your account metrics either from the **Metrics** pane or the **Insights (Preview)** pane.

   * **Metrics:** This pane provides numerical metrics that are collected at regular intervals and describe some aspect of a system at a particular time. For example, you can view and monitor the [server side latency metric](monitor-server-side-latency.md), [normalized request unit usage metric](monitor-normalized-request-units.md) etc.

   * **Insights (Preview):** This pane provides a customized monitoring experience for Azure Cosmos DB. They use the same metrics and logs that are collected in Azure Monitor and shows an aggregated view for your account.

1. Open the **Insights (Preview)** pane. By default, the Insights pane shows the throughput, requests, storage, availability, latency, system, and account management metrics for ever container in your account. You can select the **Time Range**, **Database**, and **Container** for which you want to view insights. The **Overview** tab shows RU/s usage, data usage, index usage, throttled requests, and normalized RU/s consumption for the selected database and container.

   :::image type="content" source="./media/use-metrics/performance-metrics.png" alt-text="Cosmos DB performance metrics in Azure portal" lightbox="./media/use-metrics/performance-metrics.png" :::

1. The following metrics are available from the **Insights** pane:

   * **Throughput** - This tab shows the total number of request units consumed or failed (429 response code) because the throughput or storage capacity provisioned for the container has exceeded.

   * **Requests** - This tab shows the total number of requests processed  by status code, by operation type, and the count of failed requests (429 response code). Requests fail when the throughput or storage capacity provisioned for the container exceeds.

   * **Storage** - This tab shows the size of data and index usage over the selected time period.

   * **Availability** - This tab shows the percentage of successful requests over the total requests per hour. The success rate is defined by the Azure Cosmos DB SLAs.

   * **Latency** - This tab shows the read and write latency observed by Azure Cosmos DB in the region where your account is operating. You can visualize latency across regions for a geo-replicated account. You can also server-side latency by different operations. This metric doesn't represent the end-to-end request latency.

   * **System** - This tab shows how many metadata requests are served by the primary partition. It also helps to identify the throttled requests.

   * **Account management** - This tab shows the metrics for account management activities such as account creation, deletion, key updates, network and replication settings.

The following sections explain common scenarios where you can use Azure Cosmos DB metrics.

## Understand how many requests are succeeding or causing errors

To get started, head to the [Azure portal](https://portal.azure.com) and navigate to the **Insights** blade. From this blade, open the **Requests** tab, it shows a chart with the total requests segmented by the status code and operation type. For more information about HTTP status codes, see [HTTP status codes for Azure Cosmos DB](/rest/api/cosmos-db/http-status-codes-for-cosmosdb).

The most common error status code is 429 (rate limiting/throttling). This error means that requests to Azure Cosmos DB are more than the provisioned throughput. The most common solution to this problem is to [scale up the RUs](./set-throughput.md) for the given collection.

:::image type="content" source="media/use-metrics/request-count.png" alt-text="Number of requests per minute" lightbox= "media/use-metrics/request-count.png":::

## Determine the throughput consumption by a partition key range

Having a good cardinality of your partition keys is essential for any scalable application. To determine the throughput distribution of any partitioned container broken down by partition key range IDs, navigate to the **Insights (Preview)** pane. Open the **Throughput** tab, the normalized RU/s consumption across different partition key ranges is shown in the chart.

:::image type="content" source="media/use-metrics/throughput-consumption-partition-key-range.png" alt-text="Normalized throughput consumption by partition key range IDs" lightbox="media/use-metrics/throughput-consumption-partition-key-range.png":::

With the help of this chart, you can identify if there is a hot partition. An uneven throughput distribution may cause *hot* partitions, which can result in throttled requests and may require repartitioning. After identifying which partition key is causing the skew in distribution, you may have to repartition your container with a more distributed partition key. For more information about partitioning in Azure Cosmos DB, see [Partition and scale in Azure Cosmos DB](./partitioning-overview.md).

## Determine the data and index usage

It's important to determine the storage distribution of any partitioned container by data usage, index usage, and document usage. You can minimize the index usage, maximize the data usage and optimize your queries. To get this data, navigate to the **Insights (Preview)** pane and open the **Storage** tab:

:::image type="content" source="media/use-metrics/data-index-consumption.png" alt-text="Data, index, and document consumption" lightbox="media/use-metrics/data-index-consumption.png" :::

## Compare data size against index size

In Azure Cosmos DB, the total consumed storage is the combination of both the Data size and Index size. Typically, the index size is a fraction of the data size. To learn more, see the [Index size](index-policy.md#index-size) article. In the Metrics blade in the [Azure portal](https://portal.azure.com), the Storage tab showcases the breakdown of storage consumption based on data and index.

```csharp
// Measure the document size usage (which includes the index size)  
ResourceResponse<DocumentCollection> collectionInfo = await client.ReadDocumentCollectionAsync(UriFactory.CreateDocumentCollectionUri("db", "coll"));
 Console.WriteLine("Document size quota: {0}, usage: {1}", collectionInfo.DocumentQuota, collectionInfo.DocumentUsage);
```

If you would like to conserve index space, you can adjust the [indexing policy](index-policy.md).

## Debug why queries are running slow

In the SQL API SDKs, Azure Cosmos DB provides query execution statistics.

```csharp
IDocumentQuery<dynamic> query = client.CreateDocumentQuery(
 UriFactory.CreateDocumentCollectionUri(DatabaseName, CollectionName),
 "SELECT * FROM c WHERE c.city = 'Seattle'",
 new FeedOptions
 {
 PopulateQueryMetrics = true,
 MaxItemCount = -1,
 MaxDegreeOfParallelism = -1,
 EnableCrossPartitionQuery = true
 }).AsDocumentQuery();
FeedResponse<dynamic> result = await query.ExecuteNextAsync();

// Returns metrics by partition key range Id
IReadOnlyDictionary<string, QueryMetrics> metrics = result.QueryMetrics;
```

*QueryMetrics* provides details on how long each component of the query took to execution. The most common root cause for long running queries is scans, meaning the query was unable to leverage the indexes. This problem can be resolved with a better filter condition.

## Next steps

You've now learned how to monitor and debug issues using the metrics provided in the Azure portal. You may want to learn more about improving database performance by reading the following articles:

* To learn about how to view metrics from Azure monitor, see the [Get metrics from Azure Monitor](./monitor-cosmos-db.md) article. 
* [Performance and scale testing with Azure Cosmos DB](performance-testing.md)
* [Performance tips for Azure Cosmos DB](performance-tips.md)