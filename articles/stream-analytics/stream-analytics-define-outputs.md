---
title: Outputs from Azure Stream Analytics
description: This article describes data output options available in Azure Stream Analytics.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 07/15/2020
---

# Outputs from Azure Stream Analytics

This article describes the types of outputs available for an Azure Stream Analytics job. Outputs let you store and save the results of the Stream Analytics job. By using the output data, you can do further business analytics and data warehousing of your data.

When you design your Stream Analytics query, refer to the name of the output by using the [INTO clause](https://docs.microsoft.com/stream-analytics-query/into-azure-stream-analytics). You can use a single output per job, or multiple outputs per streaming job (if you need them) by providing multiple INTO clauses in the query.

To create, edit, and test Stream Analytics job outputs, you can use the [Azure portal](stream-analytics-quick-create-portal.md#configure-job-output), [Azure PowerShell](stream-analytics-quick-create-powershell.md#configure-output-to-the-job), [.NET API](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.streamanalytics.ioutputsoperations?view=azure-dotnet), [REST API](https://docs.microsoft.com/rest/api/streamanalytics/stream-analytics-output), and [Visual Studio](stream-analytics-quick-create-vs.md).

Some outputs types support [partitioning](#partitioning). [Output batch sizes](#output-batch-size) vary to optimize throughput.


The following table..

| Output type | Partitioning | Batching | Managed Identity | 
|-------------|--------------|----------|------------------|
|Azure Data Lake Storage Gen 1|
|SQL Database|
|Azure Synaspe Analytics (Preview)|
|Blob storage and Azure Data Lake Gen 2|
|Event Hubs|
|Power BI|
|Table storage|
|Service Bus queues|
|Service Bus topics|
|Azure Cosmos DB|
|Azure Functions|





## Partitioning

The following table summarizes the partition support and the number of output writers for each output type:

| Output type | Partitioning support | Partition key  | Number of output writers |
| --- | --- | --- | --- |
| Azure Data Lake Store | Yes | Use {date} and {time} tokens in the path prefix pattern. Choose the date format, such as YYYY/MM/DD, DD/MM/YYYY, or MM-DD-YYYY. HH is used for the time format. | Follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). |
| Azure SQL Database | Yes, needs to enabled. | Based on the PARTITION BY clause in the query. | When Inherit Partitioning option is enabled, follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). To learn more about achieving better write throughput performance when you're loading data into Azure SQL Database, see [Azure Stream Analytics output to Azure SQL Database](stream-analytics-sql-output-perf.md). |
| Azure Blob storage | Yes | Use {date} and {time} tokens from your event fields in the path pattern. Choose the date format, such as YYYY/MM/DD, DD/MM/YYYY, or MM-DD-YYYY. HH is used for the time format. Blob output can be partitioned by a single custom event attribute {fieldname} or {datetime:\<specifier>}. | Follows the input partitioning for [fully parallelizable queries](stream-analytics-scale-jobs.md). |
| Azure Event Hubs | Yes | Yes | Varies depending on partition alignment.<br /> When the partition key for event hub output is equally aligned with the upstream (previous) query step, the number of writers is the same as the number of partitions in event hub output. Each writer uses the [EventHubSender class](/dotnet/api/microsoft.servicebus.messaging.eventhubsender?view=azure-dotnet) to send events to the specific partition. <br /> When the partition key for event hub output is not aligned with the upstream (previous) query step, the number of writers is the same as the number of partitions in that prior step. Each writer uses the [SendBatchAsync class](/dotnet/api/microsoft.servicebus.messaging.eventhubclient.sendasync?view=azure-dotnet) in **EventHubClient** to send events to all the output partitions. |
| Power BI | No | None | Not applicable. |
| Azure Table storage | Yes | Any output column.  | Follows the input partitioning for [fully parallelized queries](stream-analytics-scale-jobs.md). |
| Azure Service Bus topic | Yes | Automatically chosen. The number of partitions is based on the [Service Bus SKU and size](../service-bus-messaging/service-bus-partitioning.md). The partition key is a unique integer value for each partition.| Same as the number of partitions in the output topic.  |
| Azure Service Bus queue | Yes | Automatically chosen. The number of partitions is based on the [Service Bus SKU and size](../service-bus-messaging/service-bus-partitioning.md). The partition key is a unique integer value for each partition.| Same as the number of partitions in the output queue. |
| Azure Cosmos DB | Yes | Based on the PARTITION BY clause in the query. | Follows the input partitioning for [fully parallelized queries](stream-analytics-scale-jobs.md). |
| Azure Functions | Yes | Based on the PARTITION BY clause in the query. | Follows the input partitioning for [fully parallelized queries](stream-analytics-scale-jobs.md). |

The number of output writers can also be controlled using `INTO <partition count>` (see [INTO](https://docs.microsoft.com/stream-analytics-query/into-azure-stream-analytics#into-shard-count)) clause in your query, which can be helpful in achieving a desired job topology. If your output adapter is not partitioned, lack of data in one input partition will cause a delay up to the late arrival amount of time. In such cases, the output is merged to a single writer, which might cause bottlenecks in your pipeline. To learn more about late arrival policy, see [Azure Stream Analytics event order considerations](stream-analytics-out-of-order-and-late-events.md).

## Output batch size
Azure Stream Analytics uses variable-size batches to process events and write to outputs. Typically the Stream Analytics engine doesn't write one message at a time, and uses batches for efficiency. When the rate of both the incoming and outgoing events is high, Stream Analytics uses larger batches. When the egress rate is low, it uses smaller batches to keep latency low.

The following table explains some of the considerations for output batching:

| Output type |    Max message size | Batch size optimization |
| :--- | :--- | :--- |
| Azure Data Lake Store | See [Data Lake Storage limits](../azure-resource-manager/management/azure-subscription-service-limits.md#data-lake-store-limits). | Use up to 4 MB per write operation. |
| Azure SQL Database | Configurable using Max batch count. 10,000 maximum and 100 minimum rows per single bulk insert by default.<br />See [Azure SQL limits](../sql-database/sql-database-resource-limits.md). |  Every batch is initially bulk inserted with maximum batch count. Batch is split in half (until minimum batch count) based on retryable errors from SQL. |
| Azure Blob storage | See [Azure Storage limits](../azure-resource-manager/management/azure-subscription-service-limits.md#storage-limits). | The maximum blob block size is 4 MB.<br />The maximum blob bock count is 50,000. |
| Azure Event Hubs    | 256 KB or 1 MB per message. <br />See [Event Hubs limits](../event-hubs/event-hubs-quotas.md). |    When input/output partitioning isn't aligned, each event is packed individually in `EventData` and sent in a batch of up to the maximum message size. This also happens if [custom metadata properties](#custom-metadata-properties-for-output) are used. <br /><br />  When input/output partitioning is aligned, multiple events are packed into a single `EventData` instance, up to the maximum message size, and sent.    |
| Power BI | See [Power BI Rest API limits](https://msdn.microsoft.com/library/dn950053.aspx). |
| Azure Table storage | See [Azure Storage limits](../azure-resource-manager/management/azure-subscription-service-limits.md#storage-limits). | The default is 100 entities per single transaction. You can configure it to a smaller value as needed. |
| Azure Service Bus queue    | 256 KB per message for Standard tier, 1MB for Premium tier.<br /> See [Service Bus limits](../service-bus-messaging/service-bus-quotas.md). | Use a single event per message. |
| Azure Service Bus topic | 256 KB per message for Standard tier, 1MB for Premium tier.<br /> See [Service Bus limits](../service-bus-messaging/service-bus-quotas.md). | Use a single event per message. |
| Azure Cosmos DB    | See [Azure Cosmos DB limits](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-cosmos-db-limits). | Batch size and write frequency are adjusted dynamically based on Azure Cosmos DB responses. <br /> There are no predetermined limitations from Stream Analytics. |
| Azure Functions    | | The default batch size is 262,144 bytes (256 KB). <br /> The default event count per batch is 100. <br /> The batch size is configurable and can be increased or decreased in the Stream Analytics [output options](#azure-functions).

## Next steps
> [!div class="nextstepaction"]
> 
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: https://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: https://go.microsoft.com/fwlink/?LinkId=517301
