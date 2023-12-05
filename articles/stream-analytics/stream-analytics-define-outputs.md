---
title: Outputs from Azure Stream Analytics
description: This article describes data output options available for Azure Stream Analytics.
author: enkrumah
ms.author: ebnkruma
ms.service: stream-analytics
ms.topic: conceptual
ms.custom: contperf-fy21q1
ms.date: 01/18/2023
---

# Outputs from Azure Stream Analytics

An Azure Stream Analytics job consists of an input, query, and an output. There are several output types to which you can send transformed data. This article lists the supported Stream Analytics outputs. When you design your Stream Analytics query, refer to the name of the output by using the [INTO clause](/stream-analytics-query/into-azure-stream-analytics). You can use a single output per job, or multiple outputs per streaming job (if you need them) by adding multiple INTO clauses to the query.

To create, edit, and test Stream Analytics job outputs, you can use the [Azure portal](stream-analytics-quick-create-portal.md#configure-job-output), [Azure PowerShell](stream-analytics-quick-create-powershell.md#configure-output-to-the-job), [.NET API](/dotnet/api/microsoft.azure.management.streamanalytics.ioutputsoperations), [REST API](/rest/api/streamanalytics/), [Visual Studio](stream-analytics-quick-create-vs.md), and [Visual Studio Code](./quick-create-visual-studio-code.md).

> [!NOTE] 
> We strongly recommend using [**Stream Analytics tools for Visual Studio Code**](./quick-create-visual-studio-code.md) for best local development experience. There are known feature gaps in Stream Analytics tools for Visual Studio 2019 (version 2.6.3000.0) and it won't be improved going forward.

Some outputs types support [partitioning](#partitioning), and [output batch sizes](#output-batch-size) vary to optimize throughput. The following table shows features that are supported for each output type:

| Output type | Partitioning | Security | 
|-------------|--------------|----------|
|[Azure Data Lake Storage Gen 1](azure-data-lake-storage-gen1-output.md)|Yes|Microsoft Entra user </br> , Managed Identity|
|[Azure Data Explorer](azure-database-explorer-output.md)|Yes|Managed Identity|
|[Azure Database for PostgreSQL](postgresql-database-output.md)|Yes|Username and password auth|
|[Azure SQL Database](sql-database-output.md)|Yes, optional.|SQL user auth, </br> Managed Identity|
|[Azure Synapse Analytics](azure-synapse-analytics-output.md)|Yes|SQL user auth, </br> Managed Identity|
|[Blob storage and Azure Data Lake Gen 2](blob-storage-azure-data-lake-gen2-output.md)|Yes|Access key, </br> Managed Identity|
|[Azure Event Hubs](event-hubs-output.md)|Yes, need to set the partition key column in output configuration.|Access key, </br> Managed Identity|
|[Power BI](power-bi-output.md)|No|Microsoft Entra user, </br> Managed Identity|
|[Azure Table storage](table-storage-output.md)|Yes|Account key|
|[Azure Service Bus queues](service-bus-queues-output.md)|Yes|Access key, </br> Managed Identity|
|[Azure Service Bus topics](service-bus-topics-output.md)|Yes|Access key, </br> Managed Identity|
|[Azure Cosmos DB](azure-cosmos-db-output.md)|Yes|Access key, </br> Managed Identity|
|[Azure Functions](azure-functions-output.md)|Yes|Access key|

> [!IMPORTANT] 
> Azure Stream Analytics uses Insert or Replace API by design. This operation replaces an existing entity or inserts a new entity if it does not exist in the table.

## Partitioning

Stream Analytics supports partitions for all outputs except for Power BI. For more information on partition keys and the number of output writers, see the article for the specific output type you're interested in. All output articles are linked in the previous section.  

Additionally, for more advanced tuning of the partitions, the number of output writers can be controlled using an `INTO <partition count>` (see [INTO](/stream-analytics-query/into-azure-stream-analytics#into-shard-count)) clause in your query, which can be helpful in achieving a desired job topology. If your output adapter is not partitioned, lack of data in one input partition causes a delay up to the late arrival amount of time. In such cases, the output is merged to a single writer, which might cause bottlenecks in your pipeline. To learn more about late arrival policy, see [Azure Stream Analytics event order considerations](./stream-analytics-time-handling.md).

## Output batch size

All outputs support batching, but only some support batch size explicitly. Azure Stream Analytics uses variable-size batches to process events and write to outputs. Typically the Stream Analytics engine doesn't write one message at a time, and uses batches for efficiency. When the rate of both the incoming and outgoing events is high, Stream Analytics uses larger batches. When the egress rate is low, it uses smaller batches to keep latency low.

## Avro and Parquet file splitting behavior

A Stream Analytics query can generate multiple schemas for a given output. The list of columns projected, and their type, can change on a row-by-row basis.
By design, the Avro and Parquet formats do not support variable schemas in a single file.

The following behaviors may occur when directing a stream with variable schemas to an output using these formats:

- If the schema change can be detected, the current output file will be closed, and a new one initialized on the new schema. Splitting files as such will severely slow down the output when schema changes happen frequently. With back pressure this will in turn severely impact the overall performance of the job
- If the schema change cannot be detected, the row will most likely be rejected, and the job become stuck as the row can't be output. Nested columns, or multi-type arrays, are situations that won't be discovered and be rejected.

It is highly recommended to consider outputs using the Avro or Parquet format to be strongly typed, or schema-on-write, and queries targeting them to be written as such (explicit conversions and projections for a uniform schema).

If multiple schemas need to be generated, consider creating multiple outputs and splitting records into each destination by using a `WHERE` clause.

## Parquet output batching window properties

When using Azure Resource Manager template deployment or the REST API, the two batching window properties are:

1. *timeWindow*

   The maximum wait time per batch. The value should be a string of Timespan. For example, "00:02:00" for two minutes. After this time, the batch is written to the output even if the minimum rows requirement is not met. The default value is 1 minute and the allowed maximum is 2 hours. If your blob output has path pattern frequency, the wait time cannot be higher than the partition time range.

2. *sizeWindow*

   The number of minimum rows per batch. For Parquet, every batch creates a new file. The current default value is 2,000 rows and the allowed maximum is 10,000 rows.

These batching window properties are only supported by API version **2017-04-01-preview**. Below is an example of the JSON payload for a REST API call:

```json
"type": "stream",
      "serialization": {
        "type": "Parquet",
        "properties": {}
      },
      "timeWindow": "00:02:00",
      "sizeWindow": "2000",
      "datasource": {
        "type": "Microsoft.Storage/Blob",
        "properties": {
          "storageAccounts" : [
          {
            "accountName": "{accountName}",
            "accountKey": "{accountKey}",
          }
          ],
```

## Next steps

> [!div class="nextstepaction"]
>
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: /stream-analytics-query/stream-analytics-query-language-reference
[stream.analytics.rest.api.reference]: /rest/api/streamanalytics/
