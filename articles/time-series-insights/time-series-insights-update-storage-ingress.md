---
title: 'Data storage and ingress in Azure Time Series Insights Preview | Microsoft Docs'
description: Understanding data storage and ingress in Azure Time Series Insights Preview.
author: deepakpalled
ms.author: elsung
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 08/26/2019
ms.custom: seodec18
---

# Data storage and ingress in Azure Time Series Insights Preview

This article describes changes to data storage and ingress from Azure Time Series Insights Preview. It covers the underlying storage structure, file format, and Time Series ID property. The article also discusses the underlying ingress process, throughput, and limitations.

## Data ingress

In Time Series Insights, data ingress policies determine where data can be sourced from and what format the data should have.

[![Time Series Model overview](media/v2-update-storage-ingress/tsi-data-ingress.png)](media/v2-update-storage-ingress/tsi-data-ingress.png#lightbox)

### Ingress policies

Time Series Insights Preview supports the same event sources and file types that Time Series Insights currently supports:

- [Azure IoT Hub](../iot-hub/about-iot-hub.md)
- [Azure Event Hubs](../event-hubs/event-hubs-about.md)
  
Azure Time Series Insights supports JSON submitted through Azure IoT Hub or Azure Event Hubs. To optimize your IoT JSON data, learn [how to shape JSON](./time-series-insights-send-events.md#supported-json-shapes).

### Data storage

When you create a Time Series Insights Preview pay-as-you-go SKU environment, you create two resources:

* A Time Series Insights environment.
* An Azure Storage general-purpose V1 account where the data will be stored.

Time Series Insights Preview uses Azure Blob storage with the Parquet file type. Time Series Insights manages all the data operations, including creating blobs, indexing, and partitioning the data in the Azure storage account.

Like other Azure Storage blobs, Time Series Insights-created blobs let you read and write to them to support various integration scenarios.

### Data availability

Time Series Insights Preview indexes data by using a blob-size optimization strategy. Data becomes available to query after it’s indexed, which is based on how much data is coming in and at what velocity.

> [!IMPORTANT]
> * The Time Series Insights general availability (GA) release will make data available within 60 seconds after it arrives at an event source.
> * During the preview, expect a longer period before the data is made available.
> * If you experience any significant latency, be sure to contact us.

### Scale

Time Series Insights Preview supports an initial ingress scale of up to 1 megabyte per second (MBps) per environment. Enhanced scaling support is ongoing.

## Parquet file format

Parquet is a column-oriented data file format that was designed for:

* Interoperability
* Space efficiency
* Query efficiency

Time Series Insights uses Parquet because it provides efficient data compression and encoding schemes. The enhanced performance in Parquet can handle complex data in bulk.

For more about the Parquet file type, consult the [Parquet documentation](https://parquet.apache.org/documentation/latest/).

For more information about the Parquet file format in Azure, see [Supported file types in Azure Storage](https://docs.microsoft.com/azure/data-factory/supported-file-formats-and-compression-codecs#parquet-format).

### Event structure in Parquet

Time Series Insights creates and stores copies of blobs in the following two formats:

1. The initial copy is partitioned by arrival time:

    * `V=1/PT=Time/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`
    * Blob creation time for blobs partitioned by arrival time

1. The repartitioned copy is partitioned by a dynamic grouping of Time Series IDs:

    * `V=1/PT=TsId/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`
    * Minimum event time stamp in a blob for blobs partitioned by Time Series ID

> [!NOTE]
> * `<YYYY>` maps to a four-digit year representation.
> * `<MM>` maps to a two-digit month representation.
> * `<YYYYMMDDHHMMSSfff>` maps to a time-stamp representation with four-digit year (`YYYY`), two-digit month (`MM`), two-digit day (`DD`), two-digit hour (`HH`), two-digit minute (`MM`), two-digit second (`SS`), and three-digit millisecond (`fff`).

Time Series Insights events are mapped to Parquet file contents as follows:

* Each event maps to a single row.
* A built-in **Timestamp** column has an event time stamp. The **Timestamp** property is never null. It defaults to **Event Source Enqueued Time** if the **Timestamp** property isn't specified in the event source. The time stamp is in UTC. 
* All other properties that are mapped to columns end with `_string` (string), `_bool` (Boolean), `_datetime` (datetime), and `_double` (double), depending on property type.
* That's the mapping scheme for the first version of the file format, which we refer to as **V=1**.

## Azure Storage

This section describes Azure Storage details relevant to Azure Time Series Insights.

For a thorough description of Azure Blob storage, read the [Storage blobs introduction](../storage/blobs/storage-blobs-introduction.md).

### Your storage account

When you create a Time Series Insights pay-as-you-go environment, you create two resources: a Time Series Insights environment and an Azure Storage general-purpose V1 account where the data will be stored. We chose to make Azure Storage general-purpose V1 the default resource because of its interoperability, price, and performance.

Time Series Insights publishes up to two copies of each event in your Azure storage account. The initial copy is always preserved so that you can quickly query it by using other services. You can easily use Spark, Hadoop, and other familiar tools across Time Series IDs over raw Parquet files, because these engines support basic file-name filtering. Grouping blobs by year and month is a useful way to list blobs within a specific time range for a custom job.

Additionally, Time Series Insights repartitions the Parquet files to optimize for the Time Series Insights APIs. The most recently repartitioned file is also saved.

During public preview, data is stored indefinitely in your Azure storage account.

### Writing and editing Time Series Insights blobs

To ensure query performance and data availability, don't edit or delete any blobs that Time Series Insights creates.

> [!TIP]
> Time Series Insights performance can be adversely affected if you read or write to your blobs too often.

### Accessing and exporting data from Time Series Insights Preview

You might want to access data stored in the Time Series Insights Preview explorer to use in conjunction with other services. For example, you might want to use your data to report in Power BI, to perform machine learning by using Azure Machine Learning Studio, or to use in a notebook application with Jupyter Notebooks.

You can access your data in three general ways:

* From the Time Series Insights Preview explorer. You can export data as a CSV file from the Time Series Insights Preview explorer. For more information, see [Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).
* From the Time Series Insights Preview APIs. You can reach the API endpoint at `/getRecorded`. To learn more about this API, see [Time Series Query](./time-series-insights-update-tsq.md).
* Directly from an Azure storage account.

If you use an Azure storage account, you need read access to whatever account you're using to access your Time Series Insights data. For more information, see [Manage access to your storage account resources](../storage/blobs/storage-manage-access-to-resources.md).

For more information about direct ways to read data from Azure Blob storage, see [Choose an Azure solution for data transfer](../storage/common/storage-choose-data-transfer-solution.md).

To export data from an Azure storage account, first make sure that your account meets the necessary requirements for exporting data. For more information, see [Storage import and export requirements](../storage/common/storage-import-export-requirements.md).

To learn about other ways to export data from your Azure storage account, see [Import and export data from blobs](../storage/common/storage-import-export-data-from-blobs.md).

### Data deletion

Don't delete blobs. They're useful for auditing and maintaining a record of your data. Time Series Insights Preview maintains blob metadata within each blob.

## Partitions

Each Time Series Insights Preview environment must have a **Time Series ID** property and a **Timestamp** property that uniquely identify it. Your Time Series ID acts as a logical partition for your data and gives the Time Series Insights Preview environment a natural boundary for distributing data across physical partitions. Time Series Insights Preview manages physical partitions in an Azure storage account.

Time Series Insights uses dynamic partitioning to optimize storage and query performance by dropping and re-creating partitions. The Time Series Insights Preview dynamic partitioning algorithm tries to prevent a single physical partition from having data for multiple, distinct, logical partitions. 

In other words, the partitioning algorithm keeps all data specific to a single Time Series ID exclusively present in Parquet files without being interleaved with other Time Series IDs. The dynamic partitioning algorithm also tries to preserve the original order of events within a single Time Series ID.

Initially, at ingress time, data is partitioned by the **Timestamp** property so that a single, logical partition within a time range can be spread across multiple physical partitions. A single physical partition might also contain many or all logical partitions. Because of blob size limitations, even with optimal partitioning, a single logical partition can occupy multiple physical partitions.

> [!NOTE]
> By default, the **Timestamp** value is the message **Enqueued Time** in your configured event source.

If you're uploading historical data or batch messages, assign the value that you want to store with your data to the **Timestamp** property that maps to the appropriate time stamp. The **Timestamp** property is case-sensitive. For more information, see [Time Series Model](./time-series-insights-update-tsm.md).

### Physical partitions

A physical partition is a block blob that's stored in your storage account. The actual size of the blobs can vary because the size depends on the push rate. However, we expect blobs to be approximately 20 MB to 50 MB in size. This expectation led the Time Series Insights team to select 20 MB as the size to optimize query performance. This size might change over time, depending on file size and the velocity of data ingress.

> [!NOTE]
> * Azure blobs are occasionally repartitioned for better performance by being dropped and re-created.
> * The same Time Series Insights data can be present in two or more blobs.

### Logical partitions

A logical partition is a partition within a physical partition that stores all the data associated with a single partition key value. Time Series Insights Preview logically partitions each blob based on two properties:

* **Time Series ID**: The partition key for all Time Series Insights data within the event stream and the model.
* **Timestamp**: The time based on the initial ingress.

Time Series Insights Preview provides performant queries that are based on these two properties. These properties also provide the most effective method for delivering Time Series Insights data quickly.

It's important to select an appropriate Time Series ID, because it's an immutable property. For more information, see [Choose Time Series IDs](./time-series-insights-update-how-to-id.md).

## Next steps

- Read [Azure Time Series Insights Preview storage and ingress](./time-series-insights-update-storage-ingress.md).

- Read about the new [data modeling](./time-series-insights-update-tsm.md).
