---
title: Stream data as input into Azure Stream Analytics
description: Learn about setting up a data connection in Azure Stream Analytics. Inputs include a data stream from events, and also reference data.
author: AliciaLiMicrosoft 
ms.author: ali 
ms.service: stream-analytics
ms.topic: conceptual
ms.date: 01/25/2024
---
# Stream data as input into Stream Analytics

Stream Analytics has first-class integration with Azure data streams as inputs from three kinds of resources:

- [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/)
- [Azure IoT Hub](https://azure.microsoft.com/services/iot-hub/) 
- [Azure Blob storage](https://azure.microsoft.com/services/storage/blobs/) 
- [Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md) 

These input resources can live in the same Azure subscription as your Stream Analytics job or a different subscription.

### Compression

Stream Analytics supports compression for all input sources. Supported compression types are: None, Gzip, and Deflate. The support for compression isn't available for reference data. If the input data is compressed Avro data, Stream Analytics handles it transparently. You don't need to specify the compression type with Avro serialization. 

## Create, edit, or test inputs

You can use the [Azure portal](stream-analytics-quick-create-portal.md), [Visual Studio](stream-analytics-quick-create-vs.md), and [Visual Studio Code](quick-create-visual-studio-code.md) to add and view or edit existing inputs on your streaming job. You can also test input connections and test queries from sample data from the Azure portal, [Visual Studio](stream-analytics-vs-tools-local-run.md), and [Visual Studio Code](visual-studio-code-local-run.md). When you write a query, you list the input in the FROM clause. You can get the list of available inputs from the **Query** page in the portal. If you wish to use multiple inputs, `JOIN` them or write multiple `SELECT` queries.

> [!NOTE] 
> We strongly recommend that you use [**Stream Analytics tools for Visual Studio Code**](./quick-create-visual-studio-code.md) for the best local development experience. There are known feature gaps in Stream Analytics tools for Visual Studio 2019 (version 2.6.3000.0) and it won't be improved going forward.

## Stream data from Event Hubs

Azure Event Hubs is a highly scalable publish-subscribe event ingestor. An event hub can collect millions of events per second so that you can process and analyze the massive amounts of data produced by your connected devices and applications. Together, Event Hubs and Stream Analytics can provide an end-to-end solution for real-time analytics. Event Hubs lets you feed events into Azure in real-time, and Stream Analytics jobs can process those events in real-time. For example, you can send web clicks, sensor readings, or online log events to Event Hubs. You can then create Stream Analytics jobs to use Event Hubs for the input data for real-time filtering, aggregating, and correlation.

`EventEnqueuedUtcTime` is the timestamp of an event's arrival in an event hub and is the default timestamp of events coming from Event Hubs to Stream Analytics. To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](/stream-analytics-query/timestamp-by-azure-stream-analytics) keyword.

### Event Hubs Consumer groups

You should configure each event hub input to have its own consumer group. When a job contains a self-join or has multiple inputs, some inputs might be read by more than one reader downstream. This situation impacts the number of readers in a single consumer group. To avoid exceeding the Event Hubs limit of five readers per consumer group per partition, it's a best practice to designate a consumer group for each Stream Analytics job. There's also a limit of 20 consumer groups for a Standard tier event hub. For more information, see [Troubleshoot Azure Stream Analytics inputs](stream-analytics-troubleshoot-input.md).

### Create an input from Event Hubs

The following table explains each property in the **New input** page in the Azure portal to stream data input from an event hub:

| Property | Description |
| --- | --- |
| **Input alias** | A friendly name that you use in the job's query to reference this input. |
| **Subscription** | Choose the Azure subscription in which the Event hub resource exists. | 
| **Event Hub namespace** | The Event Hubs namespace is a container for event hubs. When you create an event hub, you also create the namespace. |
| **Event Hub name** | The name of the event hub to use as input. |
| **Event Hub consumer group** (recommended) | We recommend that you use a distinct consumer group for each Stream Analytics job. This string identifies the consumer group to use to ingest data from the event hub. If no consumer group is specified, the Stream Analytics job uses the `$Default` consumer group. |
| **Authentication mode** | Specify the type of the authentication you want to use to connect to the event hub. You can use a connection string or a managed identity to authenticate with the event hub. For the managed identity option, you can either create a system-assigned managed identity to the Stream Analytics job or a user-assigned managed identity to authenticate with the event hub. When you use a managed identity, the managed identity must be a member of [Azure Event Hubs Data Receiver or Azure Event Hubs Data Owner roles](../event-hubs/authenticate-application.md#built-in-roles-for-azure-event-hubs). | 
| **Event Hub policy name** | The shared access policy that provides access to the Event Hubs. Each shared access policy has a name, permissions that you set, and access keys. This option is automatically populated, unless you select the option to provide the Event Hubs settings manually.|
| **Partition key** | It's an optional field that is available only if your job is configured to use [compatibility level](./stream-analytics-compatibility-level.md) 1.2 or higher. If your input is partitioned by a property, you can add the name of this property here. It's used for improving the performance of your query if it includes a `PARTITION BY` or `GROUP BY` clause on this property. If this job uses compatibility level 1.2 or higher, this field defaults to `PartitionId.` |
| **Event serialization format** | The serialization format (JSON, CSV, Avro, Parquet, or [Other (Protobuf, XML, proprietary...)](custom-deserializer.md)) of the incoming data stream. Ensure the JSON format aligns with the specification and doesn’t include leading 0 for decimal numbers. |
| **Encoding** | UTF-8 is currently the only supported encoding format. |
| **Event compression type** | The compression type used to read the incoming data stream, such as None (default), Gzip, or Deflate. |
| **Schema registry (preview)** | You can select the schema registry with schemas for event data that's received from the event hub. | 

When your data comes from an Event Hubs stream input, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **EventProcessedUtcTime** |The date and time when Stream Analytics processes the event. |
| **EventEnqueuedUtcTime** |The date and time that when Event Hubs receives the events. |
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
> When using Event Hubs as an endpoint for IoT Hub Routes, you can access to the IoT Hub metadata using the [GetMetadataPropertyValue function](/stream-analytics-query/getmetadatapropertyvalue).
> 

## Stream data from IoT Hub

Azure IoT Hub is a highly scalable publish-subscribe event ingestor optimized for IoT scenarios.

The default timestamp of events coming from an IoT Hub in Stream Analytics is the timestamp that the event arrived in the IoT Hub, which is `EventEnqueuedUtcTime`. To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](/stream-analytics-query/timestamp-by-azure-stream-analytics) keyword.

### Iot Hub Consumer groups

You should configure each Stream Analytics IoT Hub input to have its own consumer group. When a job contains a self-join or when it has multiple inputs, some input might be read by more than one reader downstream. This situation impacts the number of readers in a single consumer group. To avoid exceeding the Azure IoT Hub limit of five readers per consumer group per partition, it's a best practice to designate a consumer group for each Stream Analytics job.

### Configure an IoT Hub as a data stream input

The following table explains each property in the **New input** page in the Azure portal when you configure an IoT Hub as a stream input.

| Property | Description |
| --- | --- |
| **Input alias** | A friendly name that you use in the job's query to reference this input.|
| **Subscription** | Choose the subscription in which the IoT Hub resource exists. | 
| **IoT Hub** | The name of the IoT Hub to use as input. |
| **Consumer group** | We recommend that you use a different consumer group for each Stream Analytics job. The consumer group is used to ingest data from the IoT Hub. Stream Analytics uses the $Default consumer group unless you specify otherwise. |
| **Shared access policy name** | The shared access policy that provides access to the IoT Hub. Each shared access policy has a name, permissions that you set, and access keys. |
| **Shared access policy key** | The shared access key used to authorize access to the IoT Hub. This option is automatically populated in unless you select the option to provide the Iot Hub settings manually. |
| **Endpoint** | The endpoint for the IoT Hub.|
| **Partition key** | It's an optional field that is available only if your job is configured to use [compatibility level](./stream-analytics-compatibility-level.md) 1.2 or higher. If your input is partitioned by a property, you can add the name of this property here. It's used for improving the performance of your query if it includes a PARTITION BY or GROUP BY clause on this property. If this job uses compatibility level 1.2 or higher, this field defaults to "PartitionId." |
| **Event serialization format** | The serialization format (JSON, CSV, Avro, Parquet, or [Other (Protobuf, XML, proprietary...)](custom-deserializer.md)) of the incoming data stream. Ensure the JSON format aligns with the specification and doesn’t include leading 0 for decimal numbers. |
| **Encoding** | UTF-8 is currently the only supported encoding format. |
| **Event compression type** | The compression type used to read the incoming data stream, such as None (default), Gzip, or Deflate. |


When you use stream data from an IoT Hub, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **EventProcessedUtcTime** | The date and time that the event was processed. |
| **EventEnqueuedUtcTime** | The date and time when the IoT Hub receives the event. |
| **PartitionId** | The zero-based partition ID for the input adapter. |
| **IoTHub.MessageId** | An ID that's used to correlate two-way communication in IoT Hub. |
| **IoTHub.CorrelationId** | An ID that's used in message responses and feedback in IoT Hub. |
| **IoTHub.ConnectionDeviceId** | The authentication ID used to send this message. This value is stamped on service-bound messages by the IoT Hub. |
| **IoTHub.ConnectionDeviceGenerationId** | The generation ID of the authenticated device that was used to send this message. This value is stamped on servicebound messages by the IoT Hub. |
| **IoTHub.EnqueuedTime** | The time when the IoT Hub receives the message. |


## Stream data from Blob storage or Data Lake Storage Gen2
For scenarios with large quantities of unstructured data to store in the cloud, Azure Blob storage or Azure Data Lake Storage Gen2 offers a cost-effective and scalable solution. Data in Blob storage or Azure Data Lake Storage Gen2 is considered data at rest. However, this data can be processed as a data stream by Stream Analytics. 

Log processing is a commonly used scenario for using such inputs with Stream Analytics. In this scenario, telemetry data files are captured from a system and need to be parsed and processed to extract meaningful data.

The default timestamp of a Blob storage or Azure Data Lake Storage Gen2 event in Stream Analytics is the timestamp that it was last modified, which is `BlobLastModifiedUtcTime`. If a blob is uploaded to a storage account at 13:00, and the Azure Stream Analytics job is started using the option *Now* at 13:01, it will not be picked up as its modified time falls outside the job run period.

If a blob is uploaded to a storage account container at 13:00, and the Azure Stream Analytics job is started using *Custom Time* at 13:00 or earlier, the blob will be picked up as its modified time falls inside the job run period.

If an Azure Stream Analytics job is started using *Now* at 13:00, and a blob is uploaded to the storage account container at 13:01, Azure Stream Analytics picks up the blob. The timestamp assigned to each blob is based only on `BlobLastModifiedTime`. The folder the blob is in has no relation to the timestamp assigned. For example, if there's a blob `2019/10-01/00/b1.txt` with a `BlobLastModifiedTime` of `2019-11-11`, then the timestamp assigned to this blob is `2019-11-11`.

To process the data as a stream using a timestamp in the event payload, you must use the [TIMESTAMP BY](/stream-analytics-query/stream-analytics-query-language-reference) keyword. A Stream Analytics job pulls data from Azure Blob storage or Azure Data Lake Storage Gen2 input every second if the blob file is available. If the blob file is unavailable, there's an exponential backoff with a maximum time delay of 90 seconds.

> [!NOTE]
> Stream Analytics does not support adding content to an existing blob file. Stream Analytics will view each file only once, and any changes that occur in the file after the job has read the data are not processed. Best practice is to upload all the data for a blob file at once and then add additional newer events to a different, new blob file.

In scenarios where many blobs are continuously added and Stream Analytics is processing the blobs as they're added, it's possible for some blobs to be skipped in rare cases due to the granularity of the `BlobLastModifiedTime`. You can mitigate this case by uploading blobs at least two seconds apart. If this option isn't feasible, you can use Event Hubs to stream large volumes of events.

### Configure Blob storage as a stream input 

The following table explains each property in the **New input** page in the Azure portal when you configure Blob storage as a stream input.

| Property | Description |
| --- | --- |
| **Input alias** | A friendly name that you use in the job's query to reference this input. |
| **Subscription** | Choose the subscription in which the storage resource exists. | 
| **Storage account** | The name of the storage account where the blob files are located. |
| **Storage account key** | The secret key associated with the storage account. This option is automatically populated in unless you select the option to provide the settings manually. |
| **Container** | Containers provide a logical grouping for blobs. You can choose either **Use existing** container or  **Create new** to have a new container created.|
| **Authentication mode** | Specify the type of the authentication you want to use to connect to the storage account. You can use a connection string or a managed identity to authenticate with the storage account. For the managed identity option, you can either create a system-assigned managed identity to the Stream Analytics job or a user-assigned managed identity to authenticate with the storage account. When you use a managed identity, the managed identity must be a member of an [appropriate role](/azure/role-based-access-control/built-in-roles#storage) on the storage account. | 
| **Path pattern** (optional) | The file path used to locate the blobs within the specified container. If you want to read blobs from the root of the container, don't set a path pattern. Within the path, you can specify one or more instances of the following three variables: `{date}`, `{time}`, or `{partition}`<br/><br/>Example 1: `cluster1/logs/{date}/{time}/{partition}`<br/><br/>Example 2: `cluster1/logs/{date}`<br/><br/>The `*` character isn't an allowed value for the path prefix. Only valid <a href="/rest/api/storageservices/Naming-and-Referencing-Containers--Blobs--and-Metadata">Azure blob characters</a> are allowed. Don't include container names or file names. |
| **Date format** (optional) | If you use the date variable in the path, the date format in which the files are organized. Example: `YYYY/MM/DD` <br/><br/> When blob input has `{date}` or `{time}` in its path, the folders are looked at in ascending time order.|
| **Time format** (optional) |  If you use the time variable in the path, the time format in which the files are organized. Currently the only supported value is `HH` for hours. |
| **Partition key** | It's an optional field that is available only if your job is configured to use [compatibility level](./stream-analytics-compatibility-level.md) 1.2 or higher. If your input is partitioned by a property, you can add the name of this property here. It's used for improving the performance of your query if it includes a PARTITION BY or GROUP BY clause on this property. If this job uses compatibility level 1.2 or higher, this field defaults to "PartitionId." |
| **Count of input partitions** | This field is present only when {partition} is present in path pattern. The value of this property is an integer >=1. Wherever {partition} appears in pathPattern, a number between 0 and the value of this field -1 will be used. |
| **Event serialization format** | The serialization format (JSON, CSV, Avro, Parquet, or [Other (Protobuf, XML, proprietary...)](custom-deserializer.md)) of the incoming data stream. Ensure the JSON format aligns with the specification and doesn’t include leading 0 for decimal numbers. |
| **Encoding** | For CSV and JSON, UTF-8 is currently the only supported encoding format. |
| **Compression** | The compression type used to read the incoming data stream, such as None (default), Gzip, or Deflate. |

When your data comes from a Blob storage source, you have access to the following metadata fields in your Stream Analytics query:

| Property | Description |
| --- | --- |
| **BlobName** |The name of the input blob that the event came from. |
| **EventProcessedUtcTime** |The date and time when Stream Analytics processes the event. |
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

## Stream data from Apache Kafka
Azure Stream Analytics lets you connect directly to Apache Kafka clusters to ingest data. The solution is low code and entirely managed by the Azure Stream Analytics team at Microsoft, allowing it to meet business compliance standards. The Kafka input is backward compatible and supports all versions with the latest client release starting from version 0.10. Users can connect to Kafka clusters inside a virtual network and Kafka clusters with a public endpoint, depending on the configurations. The configuration relies on existing Kafka configuration conventions. Supported compression types are None, Gzip, Snappy, LZ4, and Zstd.

For more information, see [Stream data from Kafka into Azure Stream Analytics (Preview)](stream-analytics-define-kafka-input.md).


## Next steps
> [!div class="nextstepaction"]
> [Quickstart: Create a Stream Analytics job by using the Azure portal](stream-analytics-quick-create-portal.md)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-real-time-fraud-detection.md
[stream.analytics.query.language.reference]: /stream-analytics-query/stream-analytics-query-language-reference
[stream.analytics.rest.api.reference]: /rest/api/streamanalytics/
