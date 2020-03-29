---
title: Stream data as input into Azure Stream Analytics
description: Learn about setting up a data connection in Azure Stream Analytics. Inputs include a data stream from events, and also reference data.
author: mamccrea
ms.author: mamccrea
ms.reviewer: mamccrea
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 01/17/2020
---
# Stream data as input into Stream Analytics

Stream Analytics has first-class integration with Azure data streams as inputs from three kinds of resources:

- [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/)
- [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) 
- [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) 

These input resources can live in the same Azure subscription as your Stream Analytics job or a different subscription.

### Compression

Stream Analytics supports compression across all data stream input sources. Supported compression types are: None, GZip, and Deflate compression. Support for compression is not available for reference data. If the input format is Avro data that is compressed, it's handled transparently. You don't need to specify compression type with Avro serialization. 

## Create, edit, or test inputs

You can use the [Azure portal](stream-analytics-quick-create-portal.md), [Visual Studio](stream-analytics-quick-create-vs.md), and [Visual Studio Code](quick-create-vs-code.md) to add and view or edit existing inputs on your streaming job. You can also test input connections and [test queries](stream-analytics-manage-job.md#test-your-query) from sample data from the Azure portal, [Visual Studio](stream-analytics-vs-tools-local-run.md), and [Visual Studio Code](visual-studio-code-local-run.md). When you write a query, you list the input in the FROM clause. You can get the list of available inputs from the **Query** page in the portal. If you wish to use multiple inputs, you can `JOIN` them or write multiple `SELECT` queries.


## Stream data from Event Hubs

Azure Event Hubs provides highly scalable publish-subscribe event ingestors. An event hub can collect millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Together, Event Hubs and Stream Analytics provide an end-to-end solution for real-time analytics. Event Hubs lets you feed events into Azure in real-time, and Stream Analytics jobs can process those events in real-time. For example, you can send web clicks, sensor readings, or online log events to Event Hubs. You can then create Stream Analytics jobs to use Event Hubs as the input data streams for real-time filtering, aggregating, and correlation.

`EventEnqueuedUtcTime` is the timestamp of an event's arrival in an event hub and is the default timestamp of events coming from Event Hubs to Stream Analytics. To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](https://docs.microsoft.com/stream-analytics-query/timestamp-by-azure-stream-analytics) keyword.

### Event Hubs Consumer groups

You should configure each Stream Analytics event hub input to have its own consumer group. When a job contains a self-join or has multiple inputs, some inputs might be read by more than one reader downstream. This situation impacts the number of readers in a single consumer group. To avoid exceeding the Event Hubs limit of five readers per consumer group per partition, it's a best practice to designate a consumer group for each Stream Analytics job. There is also a limit of 20 consumer groups for a Standard tier event hub. For more information, see [Troubleshoot Azure Stream Analytics inputs](stream-analytics-troubleshoot-input.md).

### Create an input from Event Hubs

The following table explains each property in the **New input** page in the Azure portal to stream data input from an event hub:

| Property | Description |
| --- | --- |
| **Input alias** |A friendly name that you use in the job's query to reference this input. |
| **Subscription** | Choose the subscription in which the Event hub resource exists. | 
| **Event Hub namespace** | The Event Hub namespace is a container for a set of messaging entities. When you create a new event hub, you also create the namespace. |
| **Event Hub name** | The name of the event hub to use as input. |
| **Event Hub policy name** | The shared access policy that provides access to the Event Hub. Each shared access policy has a name, permissions that you set, and access keys. This option is automatically populated, unless you select the option to provide the Event Hub settings manually.|
| **Event Hub consumer group** (recommended) | It is highly recommended to use a distinct consumer group for each Stream Analytics job. This string identifies the consumer group to use to ingest data from the event hub. If no consumer group is specified, the Stream Analytics job uses the $Default consumer group.  |
| **Partition key** | If your input is partitioned by a property, you can add the name of this property. Partition keys are optional and is used to improve the performance of your query if it includes a PARTITION BY or GROUP BY clause on this property. |
| **Event serialization format** | The serialization format (JSON, CSV, Avro, or [Other (Protobuf, XML, proprietary...)](custom-deserializer.md)) of the incoming data stream.  Ensure the JSON format aligns with the specification and doesn’t include leading 0 for decimal numbers. |
| **Encoding** | UTF-8 is currently the only supported encoding format. |
| **Event compression type** | The compression type used to read the incoming data stream, such as None (default), GZip, or Deflate. |

When your data comes from an Event Hub stream input, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **EventProcessedUtcTime** |The date and time that the event was processed by Stream Analytics. |
| **EventEnqueuedUtcTime** |The date and time that the event was received by Event Hubs. |
| **PartitionId** |The zero-based partition ID for the input adapter. |

For example, using these fields, you can write a query like the following example:

```sql
SELECT
    EventProcessedUtcTime,
    EventEnqueuedUtcTime,
    PartitionId
FROM Input
```

> [!NOTE]
> When using Event Hub as an endpoint for IoT Hub Routes, you can access to the IoT Hub metadata using the [GetMetadataPropertyValue function](https://docs.microsoft.com/stream-analytics-query/getmetadatapropertyvalue).
> 

## Stream data from IoT Hub

Azure IoT Hub is a highly scalable publish-subscribe event ingestor optimized for IoT scenarios.

The default timestamp of events coming from an IoT Hub in Stream Analytics is the timestamp that the event arrived in the IoT Hub, which is `EventEnqueuedUtcTime`. To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](https://docs.microsoft.com/stream-analytics-query/timestamp-by-azure-stream-analytics) keyword.

### Iot Hub Consumer groups

You should configure each Stream Analytics IoT Hub input to have its own consumer group. When a job contains a self-join or when it has multiple inputs, some input might be read by more than one reader downstream. This situation impacts the number of readers in a single consumer group. To avoid exceeding the Azure IoT Hub limit of five readers per consumer group per partition, it's a best practice to designate a consumer group for each Stream Analytics job.

### Configure an IoT Hub as a data stream input

The following table explains each property in the **New input** page in the Azure portal when you configure an IoT Hub as a stream input.

| Property | Description |
| --- | --- |
| **Input alias** | A friendly name that you use in the job's query to reference this input.|
| **Subscription** | Choose the subscription in which the IoT Hub resource exists. | 
| **IoT Hub** | The name of the IoT Hub to use as input. |
| **Endpoint** | The endpoint for the IoT Hub.|
| **Shared access policy name** | The shared access policy that provides access to the IoT Hub. Each shared access policy has a name, permissions that you set, and access keys. |
| **Shared access policy key** | The shared access key used to authorize access to the IoT Hub.  This option is automatically populated in unless you select the option to provide the Iot Hub settings manually. |
| **Consumer group** | It is highly recommended that you use a different consumer group for each Stream Analytics job. The consumer group is used to ingest data from the IoT Hub. Stream Analytics uses the $Default consumer group unless you specify otherwise.  |
| **Partition key** | If your input is partitioned by a property, you can add the name of this property. Partition keys are optional and is used to improve the performance of your query if it includes a PARTITION BY or GROUP BY clause on this property. |
| **Event serialization format** | The serialization format (JSON, CSV, Avro, or [Other (Protobuf, XML, proprietary...)](custom-deserializer.md)) of the incoming data stream.  Ensure the JSON format aligns with the specification and doesn’t include leading 0 for decimal numbers. |
| **Encoding** | UTF-8 is currently the only supported encoding format. |
| **Event compression type** | The compression type used to read the incoming data stream, such as None (default), GZip, or Deflate. |


When you use stream data from an IoT Hub, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **EventProcessedUtcTime** | The date and time that the event was processed. |
| **EventEnqueuedUtcTime** | The date and time that the event was received by the IoT Hub. |
| **PartitionId** | The zero-based partition ID for the input adapter. |
| **IoTHub.MessageId** | An ID that's used to correlate two-way communication in IoT Hub. |
| **IoTHub.CorrelationId** | An ID that's used in message responses and feedback in IoT Hub. |
| **IoTHub.ConnectionDeviceId** | The authentication ID used to send this message. This value is stamped on servicebound messages by the IoT Hub. |
| **IoTHub.ConnectionDeviceGenerationId** | The generation ID of the authenticated device that was used to send this message. This value is stamped on servicebound messages by the IoT Hub. |
| **IoTHub.EnqueuedTime** | The time when the message was received by the IoT Hub. |


## Stream data from Blob storage
For scenarios with large quantities of unstructured data to store in the cloud, Azure Blob storage offers a cost-effective and scalable solution. Data in Blob storage is usually considered data at rest; however, blob data can be processed as a data stream by Stream Analytics. 

Log processing is a commonly used scenario for using Blob storage inputs with Stream Analytics. In this scenario, telemetry data files have been captured from a system and need to be parsed and processed to extract meaningful data.

The default timestamp of Blob storage events in Stream Analytics is the timestamp that the blob was last modified, which is `BlobLastModifiedUtcTime`. If a blob is uploaded to a storage account at 13:00, and the Azure Stream Analytics job is started using the option *Now* at 13:01, the blob will not be picked up as its modified time falls outside the job run period.

If a blob is uploaded to a storage account container at 13:00, and the Azure Stream Analytics job is started using *Custom Time* at 13:00 or earlier, the blob will be picked up as its modified time falls inside the job run period.

If an Azure Stream Analytics job is started using *Now* at 13:00, and a blob is uploaded to the storage account container at 13:01, Azure Stream Analytics will pick up the blob.

To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](https://docs.microsoft.com/stream-analytics-query/stream-analytics-query-language-reference) keyword. A Stream Analytics job pulls data from Azure Blob storage input every second if the blob file is available. If the blob file is unavailable, there is an exponential backoff with a maximum time delay of 90 seconds.

CSV-formatted inputs require a header row to define fields for the data set, and all header row fields must be unique.

> [!NOTE]
> Stream Analytics does not support adding content to an existing blob file. Stream Analytics will view each file only once, and any changes that occur in the file after the job has read the data are not processed. Best practice is to upload all the data for a blob file at once and then add additional newer events to a different, new blob file.

Uploading a very large number of blobs at once might cause Stream Analytics to skip reading few blobs in rare cases. It is recommended to upload blobs at least 2 seconds apart to Blob storage. If this option is not feasible, you can use Event Hubs to stream large volumes of events. 

### Configure Blob storage as a stream input 

The following table explains each property in the **New input** page in the Azure portal when you configure Blob storage as a stream input.

| Property | Description |
| --- | --- |
| **Input alias** | A friendly name that you use in the job's query to reference this input. |
| **Subscription** | Choose the subscription in which the IoT Hub resource exists. | 
| **Storage account** | The name of the storage account where the blob files are located. |
| **Storage account key** | The secret key associated with the storage account. This option is automatically populated in unless you select the option to provide the Blob storage settings manually. |
| **Container** | The container for the blob input. Containers provide a logical grouping for blobs stored in the Microsoft Azure Blob service. When you upload a blob to the Azure Blob storage service, you must specify a container for that blob. You can choose either **Use existing** container or  **Create new** to have a new container created.|
| **Path pattern** (optional) | The file path used to locate the blobs within the specified container. If you want to read blobs from the root of the container, do not set a path pattern. Within the path, you can specify one or more instances of the following three variables: `{date}`, `{time}`, or `{partition}`<br/><br/>Example 1: `cluster1/logs/{date}/{time}/{partition}`<br/><br/>Example 2: `cluster1/logs/{date}`<br/><br/>The `*` character is not an allowed value for the path prefix. Only valid <a HREF="https://msdn.microsoft.com/library/azure/dd135715.aspx">Azure blob characters</a> are allowed. Do not include container names or file names. |
| **Date format** (optional) | If you use the date variable in the path, the date format in which the files are organized. Example: `YYYY/MM/DD` |
| **Time format** (optional) |  If you use the time variable in the path, the time format in which the files are organized. Currently the only supported value is `HH` for hours. |
| **Partition key** | If your input is partitioned by a property, you can add the name of this property. Partition keys are optional and is used to improve the performance of your query if it includes a PARTITION BY or GROUP BY clause on this property. |
| **Event serialization format** | The serialization format (JSON, CSV, Avro, or [Other (Protobuf, XML, proprietary...)](custom-deserializer.md)) of the incoming data stream.  Ensure the JSON format aligns with the specification and doesn’t include leading 0 for decimal numbers. |
| **Encoding** | For CSV and JSON, UTF-8 is currently the only supported encoding format. |
| **Compression** | The compression type used to read the incoming data stream, such as None (default), GZip, or Deflate. |

When your data comes from a Blob storage source, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **BlobName** |The name of the input blob that the event came from. |
| **EventProcessedUtcTime** |The date and time that the event was processed by Stream Analytics. |
| **BlobLastModifiedUtcTime** |The date and time that the blob was last modified. |
| **PartitionId** |The zero-based partition ID for the input adapter. |

For example, using these fields, you can write a query like the following example:

```sql
SELECT
    BlobName,
    EventProcessedUtcTime,
    BlobLastModifiedUtcTime
FROM Input
```

## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: https://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: https://go.microsoft.com/fwlink/?LinkId=517301
