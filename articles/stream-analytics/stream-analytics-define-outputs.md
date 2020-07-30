---
title: Outputs from Azure Stream Analytics
description: This article describes data output options available for Azure Stream Analytics.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 07/15/2020
---

# Outputs from Azure Stream Analytics

An Azure Stream Analytics job consists of an input, query, and an output. There are several output types to which you can send transformed data. This article lists the supported Stream Analytics outputs. When you design your Stream Analytics query, refer to the name of the output by using the [INTO clause](https://docs.microsoft.com/stream-analytics-query/into-azure-stream-analytics). You can use a single output per job, or multiple outputs per streaming job (if you need them) by adding multiple INTO clauses to the query.

To create, edit, and test Stream Analytics job outputs, you can use the [Azure portal](stream-analytics-quick-create-portal.md#configure-job-output), [Azure PowerShell](stream-analytics-quick-create-powershell.md#configure-output-to-the-job), [.NET API](https://docs.microsoft.com/dotnet/api/microsoft.azure.management.streamanalytics.ioutputsoperations?view=azure-dotnet), [REST API](https://docs.microsoft.com/rest/api/streamanalytics/stream-analytics-output), and [Visual Studio](stream-analytics-quick-create-vs.md).

Some outputs types support [partitioning](#partitioning), and [output batch sizes](#output-batch-size) vary to optimize throughput. The following table shows features that are supported for each output type:

| Output type | Partitioning | Security | 
|-------------|--------------|----------|
|[Azure Data Lake Storage Gen 1](azure-data-lake-storage-gen1-output.md)|Yes|Access key|
|[Azure SQL Database](sql-database-output.md)|Yes, needs to enabled.|SQL user auth <\br> MSI (Preview)|
|[Azure Synapse Analytics (Preview)](azure-synapse-analytics-output.md)|No|SQL user auth|
|[Blob storage and Azure Data Lake Gen 2](blob-storage-azure-data-lake-gen2-output.md)|Yes|MSI|
|[Azure Event Hubs](event-hubs-output.md)|Yes|Access key|
|[Power BI](power-bi-output.md)|No|MSI|
|[Azure Table storage](table-storage-output.md)|Yes|Account key|
|[Azure Service Bus queues](service-bus-queues-output.md)|Yes|Access key|
|[Azure Service Bus topics](service-bus-topics-output.md)|Yes|Access key|
|[Azure Cosmos DB](azure-cosmos-db-output.md)|Yes|Access key|
|[Azure Functions](azure-functions-output.md)|Yes|Access key|

## Partitioning

The number of output writers can be controlled using an `INTO <partition count>` (see [INTO](https://docs.microsoft.com/stream-analytics-query/into-azure-stream-analytics#into-shard-count)) clause in your query, which can be helpful in achieving a desired job topology. If your output adapter is not partitioned, lack of data in one input partition causes a delay up to the late arrival amount of time. In such cases, the output is merged to a single writer, which might cause bottlenecks in your pipeline. To learn more about late arrival policy, see [Azure Stream Analytics event order considerations](stream-analytics-out-of-order-and-late-events.md).

## Output batch size

All outputs support batching, but only some support batch size explicitly. Azure Stream Analytics uses variable-size batches to process events and write to outputs. Typically the Stream Analytics engine doesn't write one message at a time, and uses batches for efficiency. When the rate of both the incoming and outgoing events is high, Stream Analytics uses larger batches. When the egress rate is low, it uses smaller batches to keep latency low.

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
