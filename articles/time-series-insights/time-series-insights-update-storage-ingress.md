---
title: 'Data storage and ingress in Preview - Azure Time Series Insights | Microsoft Docs'
description: Learn about data storage and ingress in Azure Time Series Insights Preview.
author: deepakpalled
ms.author: lyhughes
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 11/04/2019
ms.custom: seodec18
---

# Data storage and ingress in Azure Time Series Insights Preview

This article describes updates to data storage and ingress for Azure Time Series Insights Preview. It covers the underlying storage structure, file format, and Time Series ID property. It also discusses the underlying ingress process, best practices, and current preview limitations.

## Data ingress

Your Azure Time Series Insights environment contains an Ingestion Engine to collect, process, and store time-series data. When planning your environment, there are some considerations to take into account in order to ensure that all incoming data is processed, and to achieve high ingress scale and minimize ingestion latency (the time taken by TSI to read and process data from the event source). In Time Series Insights Preview, data ingress policies determine where data can be sourced from and what format the data should have.

### Ingress policies

Time Series Insights Preview supports the following event sources:

- [Azure IoT Hub](../iot-hub/about-iot-hub.md)
- [Azure Event Hubs](../event-hubs/event-hubs-about.md)

Time Series Insights Preview supports a maximum of two event sources per instance.
  
Azure Time Series Insights supports JSON submitted through Azure IoT Hub or Azure Event Hubs.

> [!WARNING] 
> When attaching a new event source to your Time Series Insights Preview environment, depending on the number of events currently in your IoT Hub or Event Hub, you may experience high initial ingestion latency. As data is ingested, you should expect this high latency to subside, but if your experience indicates otherwise please contact us by submitting a support ticket through the Azure portal.

## Ingress best practices

We recommend that you employ the following best practices:

* Configure Time Series Insights and an IoT hub or event hub in the same region. This will reduce ingestion latency incurred due to the network.
* Plan for your scale needs by calculating your anticipated ingestion rate and verifying that it falls within the supported rate listed below
* Understand how to optimize and shape your JSON data, as well as the current limitations in preview, by reading [how to shape JSON for ingress and query](./time-series-insights-update-how-to-shape-events.md).

### Ingress scale and limitations in preview

#### Per environment limitations

The ingestion rate is defined as the rate at which data is received by your TSI environment, and it is a factor of the number of devices in an organization, event emission frequency, and the size of an event. By default, Time Series Insights preview can ingest incoming data at a rate of up to 1 megabyte per second (MBps) **per TSI environment**. Please contact us if this does not meet your requirements, we can support up to 16 MBps for an environment by submitting a support ticket in the Azure portal.
 
Example 1: Contoso Shipping has 100,000 devices that emit an event three times per minute. The size of an event is 200 bytes. They’re using an Event Hub with 4 partitions as the TSI event source.
The ingestion rate for their TSI environment would be: 100,000 devices * 200 bytes/event * (3/60 event/sec) = 1 MBps.
The ingestion rate per partition would be 0.25 MBps.
Contoso Shipping’s ingestion rate would be within the preview scale limitation.
 
Example 2: Contoso Fleet Analytics has 60,000 devices that emit an event every second. They are using an IoT Hub 24 partition count of 4 as the TSI event source. The size of an event is 200 bytes.
The environment ingestion rate would be: 20,000 devices * 200 bytes/event * 1 event/sec = 4 MBps.
The per partition rate would be 1 MBPs.
Contoso Fleet Analytics would need to submit a request to TSI via the Azure portal for a dedicated environment to achieve this scale.

#### Hub Partitions and Per Partition Limits

When planning your TSI environment, it's important to consider the configuration of the event source(s) that you'll be connecting to TSI. Both Azure IoT Hub and Event Hubs utilize partitions to enable horizontal scale for event processing.  A partition is an ordered sequence of events that is held in a hub. The partition count is set during the IoT or Event Hubs’ creation phase, and is not changeable. For more information on determining the partition count, see the Event Hubs' FAQ How many partitions do I need? For TSI environments using IoT Hub, generally most IoT Hubs only need 4 partitions. Whether or not you're creating a new hub for your TSI environment, or using an existing one, you'll need to calculate your per partition ingestion rate to determine if it is within the preview limits. TSI preview currently has a **per partition** limit of 0.5 MB/s. Use the examples below as a reference, and please note the following IoT Hub-specific consideration if you're an IoT Hub user.

#### IoT Hub specific considerations

When a device is created in IoT Hub it is assigned to a partition, and the partition assignment will not change. By doing so, IoT Hub is able to guarantee event ordering. However, this has implications for TSI as a downstream reader in certain scenarios. When messages from multiple devices are forwarded to the hub using the same gateway device ID they will arrive in the same partition, thus potentially exceeding the per partition scale limitation. 

**Impact**:
If a single partition experiences a sustained rate of ingestion over the preview limitation there is the potential that the TSI reader will not ever catch up before the IoT Hub data retention period has been exceeded. This would cause a loss of data.

We recommend the following: 

* Calculate your per environment and per partition ingestion rate before deploying your solution
* Ensure that your IoT Hub devices (and thus partitions) are load-balanced to the furthest extend possible

> [!WARNING]
> For environments using IoT Hub as an event source, calculate the ingestion rate using the number of hub devices in use to be sure that the rate falls below the 0.5 MBps per partition limitation in preview.

  ![IoT Hub Partiton Diagram](media/concepts-ingress-overview/iot-hub-partiton-diagram.png) 


Please refer to the following links for more information on throughput units and partitions:

* [IoT Hub Scale](https://docs.microsoft.com/azure/iot-hub/iot-hub-scaling)
* [Event Hub Scale](https://docs.microsoft.com/azure/event-hubs/event-hubs-scalability#throughput-units)
* [Event Hub Partitions](https://docs.microsoft.com/azure/event-hubs/event-hubs-features#partitions)

### Data storage

When you create a Time Series Insights Preview pay-as-you-go SKU environment, you create two Azure resources:

* A Time Series Insights Preview environment that can optionally include warm store capabilities.
* An Azure Storage general-purpose V1 blob account for cold data storage.

Data in your warm store is available only via [Time Series Query](./time-series-insights-update-tsq.md) and the [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md). 

Time Series Insights Preview saves your cold store data to Azure Blob storage in the [Parquet file format](#parquet-file-format-and-folder-structure). Time Series Insights Preview manages this cold store data exclusively, but it's available for you to read directly as standard Parquet files.

> [!WARNING]
> As the owner of the Azure Blob storage account where cold store data resides, you have full access to all data in the account. This access includes write and delete permissions. Don't edit or delete the data that Time Series Insights Preview writes, because that can cause data loss.

### Data availability

Time Series Insights Preview partitions and indexes data for optimum query performance. Data becomes available to query after it’s indexed. The amount of data that's being ingested can affect this availability.

> [!IMPORTANT]
> The upcoming general availability (GA) release of Time Series Insights will make data available in 60 seconds after it's read from the event source. During the preview, you might experience a longer period before data becomes available. If you experience significant latency beyond 60 seconds, please submit a support ticket through the Azure portal.

## Azure Storage

This section describes Azure Storage details relevant to Azure Time Series Insights Preview.

For a thorough description of Azure Blob storage, read the [Storage blobs introduction](../storage/blobs/storage-blobs-introduction.md).

### Your storage account

When you create a Time Series Insights Preview pay-as-you-go environment, an Azure Storage general-purpose V1 blob account is created as your long-term cold store.  

Time Series Insights Preview publishes up to two copies of each event in your Azure storage account. The initial copy has events ordered by ingestion time and is always preserved, so you can use other services to access it. You can use Spark, Hadoop, and other familiar tools to process the raw Parquet files. 

Time Series Insights Preview repartitions the Parquet files to optimize for the Time Series Insights query. This repartitioned copy of the data is also saved.

During public preview, data is stored indefinitely in your Azure storage account.

### Writing and editing Time Series Insights blobs

To ensure query performance and data availability, don't edit or delete any blobs that Time Series Insights Preview creates.

### Accessing and exporting data from Time Series Insights Preview

You might want to access data viewed in the Time Series Insights Preview explorer to use in conjunction with other services. For example, you can use your data to build a report in Power BI or to train a machine learning model by using Azure Machine Learning Studio. Or, you can use your data to transform, visualize, and model in your Jupyter Notebooks.

You can access your data in three general ways:

* From the Time Series Insights Preview explorer. You can export data as a CSV file from the explorer. For more information, see [Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).
* From the Time Series Insights Preview API. You can reach the API endpoint at `/getRecorded`. To learn more about this API, see [Time Series Query](./time-series-insights-update-tsq.md).
* Directly from an Azure storage account. You need read access to whatever account you're using to access your Time Series Insights Preview data. For more information, see [Manage access to your storage account resources](../storage/blobs/storage-manage-access-to-resources.md).

### Data deletion

Don't delete your Time Series Insights Preview files. You should manage related data from within Time Series Insights Preview only.

## Parquet file format and folder structure

Parquet is an open-source columnar file format that was designed for efficient storage and performance. Time Series Insights Preview uses Parquet for these reasons. It partitions data by Time Series ID for query performance at scale.  

For more information about the Parquet file type, see the [Parquet documentation](https://parquet.apache.org/documentation/latest/).

Time Series Insights Preview stores copies of your data as follows:

* The first, initial copy is partitioned by ingestion time and stores data roughly in order of arrival. The data resides in the `PT=Time` folder:

  `V=1/PT=Time/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`

* The second, repartitioned copy is partitioned by a grouping of Time Series IDs and resides in the `PT=TsId` folder:

  `V=1/PT=TsId/Y=<YYYY>/M=<MM>/<YYYYMMDDHHMMSSfff>_<TSI_INTERNAL_SUFFIX>.parquet`

In both cases, the time values correspond to blob creation time. Data in the `PT=Time` folder is preserved. Data in the `PT=TsId` folder will be optimized for query over time and will not remain static.

> [!NOTE]
> * `<YYYY>` maps to a four-digit year representation.
> * `<MM>` maps to a two-digit month representation.
> * `<YYYYMMDDHHMMSSfff>` maps to a time-stamp representation with four-digit year (`YYYY`), two-digit month (`MM`), two-digit day (`DD`), two-digit hour (`HH`), two-digit minute (`MM`), two-digit second (`SS`), and three-digit millisecond (`fff`).

Time Series Insights Preview events are mapped to Parquet file contents as follows:

* Each event maps to a single row.
* Every row includes the **timestamp** column with an event time stamp. The time-stamp property is never null. It defaults to **event enqueued time** if the time-stamp property isn't specified in the event source. The time stamp is always in UTC.
* Every row includes the Time Series ID column as defined when the Time Series Insights environment is created. The property name includes the `_string` suffix.
* All other properties sent as telemetry data are mapped to column names that end with `_string` (string), `_bool` (Boolean), `_datetime` (datetime), or `_double` (double), depending on the property type.
* This mapping scheme applies to the first version of the file format, referenced as **V=1**. As this feature evolves, the name might be incremented.

## Next steps

- Read [Azure Time Series Insights Preview storage and ingress](./time-series-insights-update-storage-ingress.md).

- Read about the new [data modeling](./time-series-insights-update-tsm.md).
