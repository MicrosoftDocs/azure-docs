---
title: 'Data connection: Data stream inputs from an event stream | Microsoft Docs'
description: Learn about setting up a data connection to Stream Analytics called 'inputs'. Inputs include a data stream from events, and also reference data.
keywords: data stream, data connection, event stream
services: stream-analytics
documentationcenter: ''
author: jeffstokes72
manager: jhubbard
editor: cgronlun

ms.assetid: 8155823c-9dd8-4a6b-8393-34452d299b68
ms.service: stream-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-services
ms.date: 07/05/2017
ms.author: jeffstok

---
# Data connection: Learn about data stream inputs from events to Stream Analytics
The data connection to a Stream Analytics job is a stream of events from a data source, which is referred to as the job's *input*. Stream Analytics has first-class integration with Azure data stream sources, including [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/), [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/), and [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/). These input sources can be from the same Azure subscription as your analytics job, or from a different subscription.

## Data input types: Data stream and reference data
As data is pushed to a data source, it's consumed by the Stream Analytics job and processed in real time. Inputs are divided into two types: data stream inputs and reference data inputs.

### Data stream inputs
A data stream is an unbounded sequence of events over time. Stream Analytics jobs must include at least one data stream input. Event Hubs, IoT Hub, and Blob storage are supported as data stream input sources. Event hubs are used to collect event streams from multiple devices and services. These streams might include social media activity feeds, stock trade information, or data from sensors. IoT hubs are optimized to collect data from connected devices in Internet of Things (IoT) scenarios.  Blob storage can be used as an input source for ingesting bulk data as a stream, such as log files.  

### Reference data
Stream Analytics also supports input known as *reference data*. This is auxiliary data that is either static or that changes slowly. It's typically used for performing correlation and lookups. For example, you might join data in the data stream input to data in the reference data, much as you would perform a SQL join to look up static values. Azure Blob storage is currently the only supported input source for reference data. Reference data source blobs are limited to 100 MB in size.

To learn how to create reference data inputs, see [Use Reference Data](stream-analytics-use-reference-data.md).  

## Create data stream input from Event Hubs

Azure Event Hubs provides highly scalable publish-subscribe event ingestors. An event hub can collect millions of events per second, so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Event Hubs and Stream Analytics together provide you with an end-to-end solution for real-time analytics—Event Hubs let you feed events into Azure in real time, and Stream Analytics jobs can process those events in real time. For example, you can send web clicks, sensor readings, or online log events to Event Hubs. You can then create Stream Analytics jobs to use Event Hubs as the input data streams for real-time filtering, aggregating, and correlation.

The default timestamp of events coming from Event Hubs in Stream Analytics is the timestamp that the event arrived in the event hub, which is `EventEnqueuedUtcTime`. To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](https://msdn.microsoft.com/library/azure/dn834998.aspx) keyword.

### Consumer groups
You should configure each Stream Analytics event hub input to have its own consumer group. When a job contains a self-join or when it has multiple inputs, some input might be read by more than one reader downstream. This situation impacts the number of readers in a single consumer group. To avoid exceeding the Event Hubs limit of five readers per consumer group per partition, it's a best practice to designate a consumer group for each Stream Analytics job. There is also a limit of 20 consumer groups per event hub. For more information, see [Event Hubs Programming Guide](../event-hubs/event-hubs-programming-guide.md).

### Configure an event hub as a data stream input
The following table explains each property in the **New input** blade in the Azure portal when you configure an event hub as input.

| Property | Description |
| --- | --- |
| **Input alias** |A friendly name that you use in the job's query to reference this input. |
| **Service bus namespace** |An Azure Service Bus namespace, which is a container for a set of messaging entities. When you create a new event hub, you also create a Service Bus namespace. |
| **Event hub name** |The name of the event hub to use as input. |
| **Event hub policy name** |The shared access policy that provides access to the event hub. Each shared access policy has a name, permissions that you set, and access keys. |
| **Event hub consumer group** (optional) |The consumer group to use to ingest data from the event hub. If no consumer group is specified, the Stream Analytics job uses the default consumer group. We recommend that you use a distinct consumer group for each Stream Analytics job. |
| **Event serialization format** |The serialization format (JSON, CSV, or Avro) of the incoming data stream. |
| **Encoding** | UTF-8 is currently the only supported encoding format. |

When your data comes from an event hub, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **EventProcessedUtcTime** |The date and time that the event was processed by Stream Analytics. |
| **EventEnqueuedUtcTime** |The date and time that the event was received by Event Hubs. |
| **PartitionId** |The zero-based partition ID for the input adapter. |

For example, using these fields, you can write a query like the following example:

````
SELECT
    EventProcessedUtcTime,
    EventEnqueuedUtcTime,
    PartitionId
FROM Input
````

## Create data stream input from IoT Hub
Azure Iot Hub is a highly scalable publish-subscribe event ingestor optimized for IoT scenarios.

The default timestamp of events coming from an IoT hub in Stream Analytics is the timestamp that the event arrived in the IoT hub, which is `EventEnqueuedUtcTime`. To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](https://msdn.microsoft.com/library/azure/dn834998.aspx) keyword.

> [!NOTE]
> Only messages sent with a `DeviceClient` property can be processed.
> 
> 

### Consumer groups
You should configure each Stream Analytics IoT hub input to have its own consumer group. When a job contains a self-join or when it has multiple inputs, some input might be read by more than one reader downstream. This situation impacts the number of readers in a single consumer group. To avoid exceeding the Azure IoT Hub limit of five readers per consumer group per partition, it's a best practice to designate a consumer group for each Stream Analytics job.

### Configure an IoT hub as a data stream input
The following table explains each property in the **New input** blade in the Azure portal when you configure an IoT hub as input.

| Property | Description |
| --- | --- |
| **Input alias** |A friendly name that you use in the job's query to reference this input.|
| **IoT hub** |The name of the IoT hub to use as input. |
| **Endpoint** |The endpoint for the IoT hub.|
| **Shared access policy name** |The shared access policy that provides access to the IoT hub. Each shared access policy has a name, permissions that you set, and access keys. |
| **Shared access policy key** |The shared access key used to authorize access to the IoT hub. |
| **Consumer group** (optional) |The consumer group to use to ingest data from the IoT hub. If no consumer group is specified, a Stream Analytics job uses the default consumer group. We recommend that you use a different consumer group for each Stream Analytics job. |
| **Event serialization format** |The serialization format (JSON, CSV, or Avro) of the incoming data stream. |
| **Encoding** |UTF-8 is currently the only supported encoding format. |

When your data comes from an IoT hub, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **EventProcessedUtcTime** |The date and time that the event was processed. |
| **EventEnqueuedUtcTime** |The date and time that the event was received by the IoT hub. |
| **PartitionId** |The zero-based partition ID for the input adapter. |
| **IoTHub.MessageId** | An ID that's used to correlate two-way communication in IoT hub. |
| **IoTHub.CorrelationId** |An ID that's used in message responses and feedback in IoT hub. |
| **IoTHub.ConnectionDeviceId** |The authentication ID used to send this message. This value is stamped on servicebound messages by the IoT hub. |
| **IoTHub.ConnectionDeviceGenerationId** |The generation ID of the authenticated device that was used to send this message. This value is stamped on servicebound messages by the IoT hub. |
| **IoTHub.EnqueuedTime** |The time when the message was received by the IoT hub. |
| **IoTHub.StreamId** |A custom event property added by the sender device. |


## Create data stream input from Blob storage
For scenarios with large quantities of unstructured data to store in the cloud, Azure Blob storage offers a cost-effective and scalable solution. Data in Blob storage is usually considered data at rest. However, it can be processed as a data stream by Stream Analytics. A typical scenario for Blob storage inputs with Stream Analytics is log processing. In this scenario, telemetry data has been captured from a system and needs to be parsed and processed to extract meaningful data.

The default timestamp of Blob storage events in Stream Analytics is the timestamp that the blob was last modified, which is `BlobLastModifiedUtcTime`. To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](https://msdn.microsoft.com/library/azure/dn834998.aspx) keyword.

CSV-formatted inputs *require* a header row to define fields for the data set. In addition, all header row fields must be unique.

> [!NOTE]
> Stream Analytics does not support adding content to an existing blob. Stream Analytics will view a blob only once, and any changes that occur in the blob after the job has read the data are not processed. A best practice is to upload all the data once and then not add events to that blob store.
> 

### Configure Blob storage as a data stream input

The following table explains each property in the **New input** blade in the Azure portal when you configure Blob storage as input.

| Property | Description |
| --- | --- |
| **Input alias** | A friendly name that you use in the job's query to reference this input. |
| **Storage account** | The name of the storage account where the blob files are located. |
| **Storage account key** | The secret key associated with the storage account. |
| **Container** | The container for the blob input. Containers provide a logical grouping for blobs stored in the Microsoft Azure Blob service. When you upload a blob to the Azure Blob storage service, you must specify a container for that blob. |
| **Path pattern** (optional) | The file path used to locate the blobs within the specified container. Within the path, you can specify one or more instances of the following three variables: `{date}`, `{time}`, or `{partition}`<br/><br/>Example 1: `cluster1/logs/{date}/{time}/{partition}`<br/><br/>Example 2: `cluster1/logs/{date}`<br/><br/>The `*` character is not an allowed value for the path prefix. Only valid <a HREF="https://msdn.microsoft.com/library/azure/dd135715.aspx">Azure blob characters</a> are allowed. |
| **Date format** (optional) | If you use the date variable in the path, the date format in which the files are organized. Example: `YYYY/MM/DD` |
| **Time format** (optional) |  If you use the time variable in the path, the time format in which the files are organized. Currently the only supported value is `HH`. |
| **Event serialization format** | The serialization format (JSON, CSV, or Avro) for incoming data streams. |
| **Encoding** | For CSV and JSON, UTF-8 is currently the only supported encoding format. |

When your data comes from a Blob storage source, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **BlobName** |The name of the input blob that the event came from. |
| **EventProcessedUtcTime** |The date and time that the event was processed by Stream Analytics. |
| **BlobLastModifiedUtcTime** |The date and time that the blob was last modified. |
| **PartitionId** |The zero-based partition ID for the input adapter. |

For example, using these fields, you can write a query like the following example:

````
SELECT
    BlobName,
    EventProcessedUtcTime,
    BlobLastModifiedUtcTime
FROM Input
````

## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/home?forum=AzureStreamAnalytics).

## Next steps
You've learned about data connection options in Azure for your Stream Analytics jobs. To learn more about Stream Analytics, see:

* [Get started using Azure Stream Analytics](stream-analytics-real-time-fraud-detection.md)
* [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
* [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
* [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
