---
title: 'Data storage and ingress in Azure Time Series Insights Preview | Microsoft Docs'
description: Understanding data storage and ingress in Azure Time Series Insights Preview.
author: ashannon7
ms.author: dpalled
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 05/20/2019
ms.custom: seodec18
---

# Data storage and ingress in Azure Time Series Insights Preview

This article describes changes to data storage and ingress from Azure Time Series Insights Preview. It covers the underlying storage structure, file format, and Time Series ID property. The article also discusses the underlying ingress process, throughput, and limitations.

## Data storage

When you create a Time Series Insights Preview pay-as-you-go SKU environment, you're creating two resources:

* A Time Series Insights environment.
* An Azure Storage general-purpose V1 account where the data will be stored.

The Time Series Insights Preview uses Azure Blob storage with the Parquet file type. Time Series Insights manages all the data operations including creating blobs, indexing, and partitioning the data in the Azure storage account. You create these blobs by using an Azure storage account.

Like other Azure Storage blobs, Time Series Insights-created blobs let you read and write to them to support various integration scenarios.

> [!TIP]
> Time Series Insights performance can be adversely affected if you read or write to your blobs too frequently.

For an overview of Azure Blob storage, see [Storage blobs introduction](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction).

For more about the Parquet file type, see [Supported file types in Azure Storage](https://docs.microsoft.com/azure/data-factory/supported-file-formats-and-compression-codecs#parquet-format).

## Parquet file format

Parquet is a column-oriented, data file format that was designed for:

* Interoperability
* Space efficiency
* Query efficiency

Time Series Insights chose Parquet because it provides efficient data compression and encoding schemes, with enhanced performance that can handle complex data in bulk.

For a better understanding of the Parquet file format, see [Parquet documentation](https://parquet.apache.org/documentation/latest/).

### Event structure in Parquet

Time Series Insights creates and stores copies of blobs in the following two formats:

1. The first, initial copy is partitioned by arrival time:

    * `V=1/PT=Time/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`
    * Blob creation time for blobs partitioned by arrival time.

1. The second, repartitioned copy is partitioned by a dynamic grouping of Time Series ID:

    * `V=1/PT=TsId/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`
    * Minimum event timestamp in a blob for blobs partitioned by Time Series ID.

> [!NOTE]
> * `<YYYY>` maps to a 4-digit year representation.
> * `<MM>` maps to a 2-digit month representation.
> * `<YYYYMMDDHHMMSSfff>` maps to a timestamp representation with 4-digit year (`YYYY`), 2-digit month (`MM`), 2-digit day (`DD`), 2-digit hour (`HH`), 2-digit minute (`MM`), 2-digit second (`SS`), and 3-digit millisecond (`fff`).

Time Series Insights events are mapped to Parquet file contents as follows:

* Each event maps to a single row.
* Built-in **Timestamp** column with an event timestamp. The Timestamp property is never null. It defaults to **Event Source Enqueued Time** if the Timestamp property isn't specified in the event source. The Timestamp is in UTC. 
* All other properties that are mapped to columns end with `_string` (string), `_bool` (Boolean), `_datetime` (datetime), and `_double` (double), depending on property type.
* That's the mapping scheme for the first version of the file format, which we refer to as **V=1**. As this feature evolves, the name will be incremented to **V=2**, **V=3**, and so on.

## Partitions

Each Time Series Insights Preview environment must have a **Time Series ID** property and a **Timestamp** property that uniquely identify it. Your Time Series ID acts as a logical partition for your data and gives the Time Series Insights Preview environment a natural boundary for distributing data across physical partitions. Physical partition management is managed by Time Series Insights Preview in an Azure storage account.

Time Series Insights uses dynamic partitioning to optimize storage and query performance by dropping and re-creating partitions. The Time Series Insights Preview dynamic partitioning algorithm tries to prevent a single physical partition from having data for multiple, distinct, logical partitions. In other words, the partitioning algorithm keeps all data specific to a single Time Series ID exclusively present in Parquet files without being interleaved with other Time Series IDs. The dynamic partitioning algorithm also tries to preserve the original order of events within a single Time Series ID.

Initially, at ingress time, data is partitioned by the Timestamp so that a single, logical partition within a given time range can be spread across multiple physical partitions. A single physical partition might also contain many or all logical partitions. Because of blob size limitations, even with optimal partitioning, a single logical partition can occupy multiple physical partitions.

> [!NOTE]
> By default, the Timestamp value is the message *Enqueued Time* in your configured event source.

If you're uploading historical data or batch messages, assign the value you want to store with your data to the Timestamp property that maps to the appropriate Timestamp. The Timestamp property is case-sensitive. For more information, see [Time Series Model](./time-series-insights-update-tsm.md).

### Physical partitions

A physical partition is a block blob that's stored in your storage account. The actual size of the blobs can vary because the size depends on the push rate. However, we expect blobs to be approximately 20 MB to 50 MB in size. This expectation led the Time Series Insights team to select 20 MB as the size to optimize query performance. This size could change over time, depending on file size and the velocity of data ingress.

> [!NOTE]
> * Blobs are sized at 20 MB.
> * Azure blobs are occasionally repartitioned for better performance by being dropped and re-created.
> * Also, the same Time Series Insights data can be present in two or more blobs.

### Logical partitions

A logical partition is a partition within a physical partition that stores all the data associated with a single partition key value. The Time Series Insights Preview logically partitions each blob based on two properties:

* **Time Series ID**: The partition key for all Time Series Insights data within the event stream and the model.
* **Timestamp**: The time based on the initial ingress.

The Time Series Insights Preview provides performant queries that are based on these two properties. These two properties also provide the most effective method for delivering Time Series Insights data quickly.

It's important to select an appropriate Time Series ID, because it's an immutable property. For more information, see [Choose Time Series IDs](./time-series-insights-update-how-to-id.md).

## Azure storage

### Your Storage account

When you create a Time Series Insights pay-as-you-go environment, you create two resources: a Time Series Insights environment and an Azure Storage general-purpose V1 account where the data will be stored. We chose to make Azure Storage general-purpose V1 the default resource because of its interoperability, price, and performance. 

Time Series Insights publishes up to two copies of each event in your Azure storage account. The initial copy is always preserved so that you can quickly query it by using other services. You can easily use Spark, Hadoop, and other familiar tools across Time Series IDs over raw Parquet files, because these engines support basic file-name filtering. Grouping blobs by year and month is a useful way to list blobs within a specific time range for a custom job. 

Additionally, Time Series Insights repartitions the Parquet files to optimize for the Time Series Insights APIs. The most recently repartitioned file is also saved.

During public preview, data is stored indefinitely in your Azure storage account.

### Writing and editing Time Series Insights blobs

To ensure query performance and data availability, don't edit or delete any blobs that are created by Time Series Insights.

### Accessing and exporting data from Time Series Insights Preview

You might want to access data stored in the Time Series Insights Preview explorer to use in conjunction with other services. For example, you might want to use your data to report in Power BI, to perform machine learning using Azure Machine Learning Studio, or to use in a notebook application with Jupyter Notebooks.

You can access your data in three general ways:

* From the Time Series Insights Preview explorer: you can export data as a CSV file from the Time Series Insights Preview explorer. For more information, see [Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).
* From the Time Series Insights Preview APIs: the API endpoint can be reached at `/getRecorded`. To learn more about this API, see [Time Series Query](./time-series-insights-update-tsq.md).
* Directly from an Azure storage account (below).

#### From an Azure storage account

* You need read access to whatever account you're using to access your Time Series Insights data. For more information, see [Manage access to your storage account resources](https://docs.microsoft.com/azure/storage/blobs/storage-manage-access-to-resources).
* For more information about direct ways to read data from Azure Blob storage, see [Moving data to and from your storage account](https://docs.microsoft.com/azure/storage/common/storage-moving-data?toc=%2fazure%2fstorage%2fblobs%2ftoc.json).
* To export data from an Azure storage account:
    * First make sure that your account meets the necessary requirements for exporting data. For more information, see [Storage import and export requirements](https://docs.microsoft.com/azure/storage/common/storage-import-export-requirements).
    * To learn about other ways to export data from your Azure storage account, see [Import and export data from blobs](https://docs.microsoft.com/azure/storage/common/storage-import-export-data-from-blobs).

### Data deletion

Don't delete blobs. Not only are they useful for auditing and maintaining a record of your data, the Time Series Insights Preview maintains blob metadata within each blob.

## Time Series Insights data ingress

### Ingress policies

The Time Series Insights Preview supports the same event sources and file types that Time Series Insights currently supports.

Supported event sources include:

- Azure IoT Hub
- Azure Event Hubs
  
  > [!NOTE]
  > Azure Event Hub instances support Kafka.

Supported file types include:

* JSON: For more information about the supported JSON shapes we can handle, see [How to shape JSON](./time-series-insights-send-events.md#json).

### Data availability

The Time Series Insights Preview indexes data by using a blob-size optimization strategy. Data becomes available to query after it’s indexed, which is based on how much data is coming in and at what velocity.

> [!IMPORTANT]
> * The Time Series Insights general availability (GA) release will make data available within 60 seconds of hitting an event source. 
> * During the preview, expect a longer period before the data is made available.
> * If you experience any significant latency, be sure to contact us.

### Scale

The Time Series Insights Preview supports an initial ingress scale of up to 1 Mega Byte per Second (Mbps) per environment. Enhanced scaling support is ongoing. We plan to update our documentation to reflect those improvements.

## Next steps

- Read the [Azure Time Series Insights Preview Storage and Ingress](./time-series-insights-update-storage-ingress.md).

- Read about the new [Data modeling](./time-series-insights-update-tsm.md).

<!-- Images -->
[1]: media/v2-update-storage-ingress/storage-architecture.png
[2]: media/v2-update-storage-ingress/parquet-files.png
[3]: media/v2-update-storage-ingress/blob-storage.png
