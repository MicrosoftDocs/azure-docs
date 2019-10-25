---
title: 'Data storage and ingress in Azure Time Series Insights Preview | Microsoft Docs'
description: Understanding data storage and ingress in Azure Time Series Insights Preview.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 10/23/2019
ms.custom: seodec18
---

# Data storage and ingress in Azure Time Series Insights Preview

This article describes updates to data storage and ingress for the Azure Time Series Insights Preview. It covers the underlying storage structure, file format, and Time Series ID property. The article also discusses the underlying ingress process, throughput, and limitations.

## Data ingress

Azure Time Series Insights Preview data ingress policies determine where data can be sourced from and in what format.

[![Time Series Model overview](media/v2-update-storage-ingress/tsi-data-ingress.png)](media/v2-update-storage-ingress/tsi-data-ingress.png#lightbox)

### Ingress policies

The Time Series Insights Preview supports the same event sources that Time Series Insights currently supports:

- [Azure IoT Hub](../iot-hub/about-iot-hub.md)
- [Azure Event Hubs](../event-hubs/event-hubs-about.md)

A maximum of two event sources per instance is supported.
  
Azure Time Series Insights supports JSON submitted through Azure IoT Hub or Azure Event Hubs. To optimize your IoT JSON data, learn [How to shape JSON](./time-series-insights-send-events.md#supported-json-shapes).

### Data storage

When you create a Time Series Insights Preview pay-as-you-go SKU environment, you create two Azure resources:

* A Time Series Insights Preview environment that can optionally include warm store capabilities.
* An Azure Storage general-purpose V1 Blob account for cold data storage.

Data in your warm store is available only via [Time Series Query](./time-series-insights-update-tsq.md) and the [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md). 

The Time Series Insights Preview saves your cold store data to Azure Blob storage in the [Parquet file format](#parquet-file-format-and-folder-structure). Time Series Insights Preview manages this cold store data exclusively, but it is available for you to read directly as standard Parquet files.

> [!WARNING]
> As the owner of the Azure Blob storage account where cold store data resides, you have full access to all data in the account including write and delete permissions. It is important you don't edit or delete the data written by Time Series Insights Preview as this can cause data loss.

### Data availability

The Time Series Insights Preview partitions and indexes data for optimum query performance. Data becomes available to query after it’s indexed, which can be impacted by how much data is being ingested.

> [!IMPORTANT]
> * The Time Series Insights general availability (GA) release will make data available in 60 seconds after being read from the event source.
> * During the preview, you may experience a longer period before the data is made available.
> * If you experience significant latency beyond 60 seconds, please contact us.

### Scale

By default, the Time Series Insights Preview supports an initial ingress scale of up to 1 megabyte per second (MB/s) per environment. Up to 16 MB/s throughput is available if required. 

> [!IMPORTANT]
> Enhanced scaling support is available. Please contact us if 16 MB/s throughput is needed.

Additional event source ingress and scaling capabilities are obtained below:

* [IoT Hub](../iot-hub/iot-hub-scaling.md)
* [Event Hub](../event-hubs/event-hubs-scalability.md)

## Azure Storage

This section describes Azure Storage details relevant to Azure Time Series Insights Preview.

For a thorough Azure Blob storage service description, read the [Storage blobs introduction](../storage/blobs/storage-blobs-introduction.md).

### Your Storage account

When you create a Time Series Insights Preview pay-as-you-go environment, an Azure Storage general-purpose V1 Blob account is created as your long-term cold store.  

Time Series Insights Preview publishes up to two copies of each event in your Azure storage account. The initial copy has events ordered by ingestion time and is always preserved so you can access it using other services. You can use Spark, Hadoop, and other familiar tools to process the raw Parquet files. 

Additionally, Time Series Insights Preview repartitions the Parquet files to optimize for the Time Series Insights query. This repartitioned copy of the data is also saved.

During public preview, data is stored indefinitely in your Azure storage account.

### Writing and editing Time Series Insights Preview blobs

To ensure query performance and data availability, don't edit or delete any blobs that are created by Time Series Insights Preview.

### Accessing and exporting data from Time Series Insights Preview

You might want to access data viewed in the Time Series Insights Preview explorer to use in conjunction with other services. For example, you might want to use your data to build a report in Power BI, to train an ML model using Azure Machine Learning Studio, or to transform, visualize, and model in your Jupyter Notebooks.

You can access your data in three general ways:

* From the Time Series Insights Preview explorer: you can export data as a CSV file from the Time Series Insights Preview explorer. For more information, see [Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).
* From the Time Series Insights Preview APIs: the API endpoint can be reached at `/getRecorded`. To learn more about this API, see [Time Series Query](./time-series-insights-update-tsq.md).
* Directly from an Azure storage account: you need read access to whatever account you're using to access your Time Series Insights Preview data. For more information, see [Manage access to your storage account resources](../storage/blobs/storage-manage-access-to-resources.md).

### Data deletion

Don't delete your Time Series Insights Preview files. Management of related data should be from within the Time Series Insights Preview only.

## Parquet file format and folder structure

Parquet is an open source columnar file format that was designed for efficient storage and performance. Time Series Insights Preview uses Parquet for these reasons and additionally partitions data by Time Series ID for query performance at scale.  

For more about the Parquet file type, consult the [Parquet documentation](https://parquet.apache.org/documentation/latest/).

The Time Series Insights Preview stores copies of your data as follows:

* The first, initial copy is partitioned by ingestion time and stores data roughly in order of arrival. The data resides in the `PT=Time` folder:

    * `V=1/PT=Time/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`

* The second, repartitioned copy is partitioned by a grouping of Time Series IDs and resides in the `PT=TsId` folder:

    * `V=1/PT=TsId/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`

In both cases, the time values correspond to blob creation time. Data in the `PT=Time` folder is preserved.  Data in the `PT=TsId` folder will be optimized for query over time and will not remain static.

> [!NOTE]
> * `<YYYY>` maps to a 4-digit year representation.
> * `<MM>` maps to a 2-digit month representation.
> * `<YYYYMMDDHHMMSSfff>` maps to a timestamp representation with 4-digit year (`YYYY`), 2-digit month (`MM`), 2-digit day (`DD`), 2-digit hour (`HH`), 2-digit minute (`MM`), 2-digit second (`SS`), and 3-digit millisecond (`fff`).

Time Series Insights Preview events are mapped to Parquet file contents as follows:

* Each event maps to a single row.
* Every row includes the **timestamp** column with an event timestamp. The timestamp property is never null. It defaults to the **event enqueued time** if the timestamp property isn't specified in the event source. The timestamp is always in UTC.
* Every row includes the Time Series ID column as defined when the Time Series Insights environment is created.  The property name includes the `_string` suffix.
* All other properties sent as telemetry data are mapped to column names ending with `_string` (string), `_bool` (Boolean), `_datetime` (datetime), or `_double` (double), depending on property type.
* This mapping scheme applies to the first version of the file format, referenced as **V=1**. As this feature evolves, the name may be incremented.

## Next steps

- Read the [Azure Time Series Insights Preview Storage and Ingress](./time-series-insights-update-storage-ingress.md).

- Read about the new [Data modeling](./time-series-insights-update-tsm.md).
