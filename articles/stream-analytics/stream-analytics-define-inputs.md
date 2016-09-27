<properties
	pageTitle="Data connection: Data stream inputs from an event stream | Microsoft Azure"
	description="Learn about setting up a data connection to Stream Analytics called 'inputs'. Inputs include a data stream from events, and also reference data."
	keywords="data stream, data connection, event stream"
	services="stream-analytics"
	documentationCenter=""
	authors="jeffstokes72"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="stream-analytics"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="data-services"
	ms.date="07/27/2016"
	ms.author="jeffstok"/>

# Data connection: Learn about data stream inputs from events to Stream Analytics

The data connection to Stream Analytics is a data stream of events from a data source. This is called an "input." Stream Analytics has first-class integration with Azure data stream sources Event Hub, IoT Hub, and Blob storage that can be from the same or different Azure subscription as your analytics job.

## Data input types: Data stream and reference data
As data is pushed to a data source, it is consumed by the Stream Analytics job and processed in real time. Inputs are divided into two distinct types: data stream inputs and reference data inputs.

### Data stream inputs
A data stream is unbounded sequence of events coming over time. Stream Analytics jobs must include at least one data stream input to be consumed and transformed by the job. Blob storage, Event Hubs, and IoT Hubs are supported as data stream input sources. Event Hubs are used to collect event streams from multiple devices and services, such as social media activity feeds, stock trade information or data from sensors. IoT Hubs are optimized to collect data from connected devices in Internet of Things (IoT) scenarios.  Blob storage can be used as an input source for ingesting bulk data as a stream.  

### Reference data
Stream Analytics supports a second type of input known as reference data. This is auxiliary data which is either static or slowly changing over time and is typically used for performing correlation and look-ups. Azure Blob storage is currently the only supported input source for reference data. Reference data source blobs are limited to 100MB in size.
	To learn how to create reference data inputs, see [Use Reference Data](stream-analytics-use-reference-data.md)  

## Create a data stream input with an Event Hub

[Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/) are highly scalable publish-subscribe event ingestor. It can collect millions of events per second, so that you can process and analyze the massive amounts of data produced by your connected devices and applications. It is one of the most commonly used inputs for Stream Analytics. Event Hubs and Stream Analytics together provide customers an end to end solution for real time analytics. Event Hubs allow customers to feed events into Azure in real time, and Stream Analytics jobs can process them in real time. For example, customers can send web clicks, sensor readings, online log events to Event Hubs, and create Stream Analytics jobs to use Event Hubs as the input data streams for real time filtering, aggregating and correlation.

It is important to note that the default timestamp of events coming from Event Hubs in Stream Analytics is the timestamp that the event arrived in Event Hub which is EventEnqueuedUtcTime. To process the data as a stream using a timestamp in the event payload, the [TIMESTAMP BY](https://msdn.microsoft.com/library/azure/dn834998.aspx) keyword must be used.

### Consumer groups

Each Stream Analytics Event Hub input should be configured to have its own consumer group. When a job contains a self-join or multiple inputs, some input may be read by more than one reader downstream, which impacts the number of readers in a single consumer group. To avoid exceeding Event Hub limit of 5 readers per consumer group per partition, it is a best practice to designate a consumer group for each Stream Analytics job. Note that there is also a limit of 20 consumer groups per Event Hub. For details, see the [Event Hubs Programming Guide](../event-hubs/event-hubs-programming-guide.md).

### Configure Event Hub as an input data stream

The table below explains each property in the Event Hub input tab with its description:

| PROPERTY NAME | DESCRIPTION |
|------|------|
| Input Alias | A friendly name that will be used in the job query to reference this input |
| Service Bus Namespace | A Service Bus namespace is a container for a set of messaging entities. When you created a new Event Hub, you also created a Service Bus namespace. |
| Event Hub | The name of your Event Hub input. |
| Event Hub Policy Name | The shared access policy, which can be created on the Event Hub Configure tab. Each shared access policy will have a name, permissions that you set, and access keys. |
| Event Hub Policy Key | The Shared Access key used to authenticate access to the Service Bus namespace. |
| Event Hub Consumer Group (Optional) | The Consumer Group to ingest data from the Event Hub. If not specified, Stream Analytics jobs will use the Default Consumer Group to ingest data from the Event Hub. It is recommended to use a distinct consumer Group for each Stream Analytics job. |
| Event Serialization Format | To make sure your queries work the way you expect, Stream Analytics needs to know which serialization format (JSON, CSV, or Avro) you're using for incoming data streams. |
| Encoding | UTF-8 is the only supported encoding format at this time. |

When your data is coming from an Event Hub source, you can access to few metadata fields in your Stream Analytics query. The table below lists the fields and their description.

| PROPERTY | DESCRIPTION |
|------|------|
| EventProcessedUtcTime | The date and time that the event was processed by Stream Analytics. |
| EventEnqueuedUtcTime | The date and time that the event was received by Event Hubs. |
| PartitionId | The zero-based partition ID for the input adapter. |

For example, you may write a query like the following:

````
SELECT
	EventProcessedUtcTime,
	EventEnqueuedUtcTime,
	PartitionId
FROM Input
````

## Create an IoT Hub data stream input

Azure Iot Hub is a highly scalable publish-subscribe event ingestor optimized for IoT scenarios.
It is important to note that the default timestamp of events coming from IoT Hubs in Stream Analytics is the timestamp that the event arrived in IoT Hub which is EventEnqueuedUtcTime. To process the data as a stream using a timestamp in the event payload, the [TIMESTAMP BY](https://msdn.microsoft.com/library/azure/dn834998.aspx) keyword must be used.

> [AZURE.NOTE] Only messages sent with a DeviceClient property can be processed.

### Consumer groups

Each Stream Analytics IoT Hub input should be configured to have its own consumer group. When a job contains a self-join or multiple inputs, some input may be read by more than one reader downstream, which impacts the number of readers in a single consumer group. To avoid exceeding IoT Hub limit of 5 readers per consumer group per partition, it is a best practice to designate a consumer group for each Stream Analytics job.

### Configure IoT Hub as an data stream input

The table below explains each property in the IoT Hub input tab with its description:

| PROPERTY NAME | DESCRIPTION |
|------|------|
| Input Alias | A friendly name that will be used in the job query to reference this input. |
| IoT Hub | An IoT Hub is a container for a set of messaging entities. |
| Endpoint | The name of your IoT Hub endpoint. |
| Shared Access Policy Name | The shared access policy to give access to the IoT Hub. Each shared access policy will have a name, permissions that you set, and access keys. |
| Shared Access Policy Key | The Shared Access key used to authenticate access to the IoT Hub. |
| Consumer Group (Optional) | The Consumer Group to ingest data from the IoT Hub. If not specified, Stream Analytics jobs will use the Default Consumer Group to ingest data from the IoT Hub. It is recommended to use a distinct consumer Group for each Stream Analytics job. |
| Event Serialization Format | To make sure your queries work the way you expect, Stream Analytics needs to know which serialization format (JSON, CSV, or Avro) you're using for incoming data streams. |
| Encoding | UTF-8 is the only supported encoding format at this time. |

When your data is coming from an IoT Hub source, you can access to few metadata fields in your Stream Analytics query. The table below lists the fields and their description.

| PROPERTY | DESCRIPTION |
|------|------|
| EventProcessedUtcTime | The date and time that the event was processed. |
| EventEnqueuedUtcTime | The date and time that the event was received by the IoT Hub. |
| PartitionId | The zero-based partition ID for the input adapter. |
| IoTHub.MessageId | Used to correlate two-way communication in IoT Hub. |
| IoTHub.CorrelationId | Used in message responses and feedback in IoT Hub. |
| IoTHub.ConnectionDeviceId | The authenticated id used to send this message, stamped on servicebound messages by IoT Hub. |
| IoTHub.ConnectionDeviceGenerationId | The generationId of the authenticated device used to send this message, Stamped on servicebound messages by IoT Hub. |
| IoTHub.EnqueuedTime | Time when the message was received by IoT Hub. |
| IoTHub.StreamId | Custom event property added by the sender device. |

## Create a Blob storage data stream input

For scenarios with large amounts of unstructured data to store in the cloud, Blob storage offers a cost-effective and scalable solution. Data in [Blob storage](https://azure.microsoft.com/services/storage/blobs/) is generally considered data “at rest” but it can be processed as a data stream by Stream Analytics. One common scenario for Blob storage inputs with Stream Analytics is log processing, where telemetry is captured from a system and needs to be parsed and processed to extract meaningful data.

It is important to note that the default timestamp of Blob storage events in Stream Analytics is the timestamp that the blob was last modified which *isBlobLastModifiedUtcTime*. To process the data as a stream using a timestamp in the event payload, the [TIMESTAMP BY](https://msdn.microsoft.com/library/azure/dn834998.aspx) keyword must be used.

Also note that CSV formatted inputs **require** a header row to define fields for the data set. Further header row fields must all be **unique**.

> [AZURE.NOTE] Stream Analytics does not support adding content to an existing blob. Stream Analytics will only view a blob once and any changes done after this read will not be processed. The best practice is to upload all the data once and not add any additional events to the blob store.

The table below explains each property in the Blob storage input tab with its description:

<table>
<tbody>
<tr>
<td>PROPERTY NAME</td>
<td>DESCRIPTION</td>
</tr>
<tr>
<td>Input Alias</td>
<td>A friendly name that will be used in the job query to reference this input.</td>
</tr>
<tr>
<td>Storage Account</td>
<td>The name of the storage account where your blob files are located.</td>
</tr>
<tr>
<td>Storage Account Key</td>
<td>The secret key associated with the storage account.</td>
</tr>
<tr>
<td>Storage Container
</td>
<td>Containers provide a logical grouping for blobs stored in the Microsoft Azure Blob service. When you upload a blob to the Blob service, you must specify a container for that blob.</td>
</tr>
<tr>
<td>Path Prefix Pattern [optional]</td>
<td>The file path used to locate your blobs within the specified container.
Within the path, you may choose to specify one or more instances of the following 3 variables:<BR>{date}, {time},<BR>{partition}<BR>Example 1: cluster1/logs/{date}/{time}/{partition}<BR>Example 2: cluster1/logs/{date}<P>Note that "*" is not an allowed value for pathprefix. Only valid <a HREF="https://msdn.microsoft.com/library/azure/dd135715.aspx">Azure blob characters</a> are allowed.</td>
</tr>
<tr>
<td>Date Format [optional]</td>
<td>If the date token is used in the prefix path, you can select the date format in which your files are organized. Example: YYYY/MM/DD</td>
</tr>
<tr>
<td>Time Format [optional]</td>
<td>If the time token is used in the prefix path, specify the time format in which your files are organized. Currently the only supported value is HH.</td>
</tr>
<tr>
<td>Event Serialization Format</td>
<td>To make sure your queries work the way you expect, Stream Analytics needs to know which serialization format (JSON, CSV, or Avro) you're using for incoming data streams.</td>
</tr>
<tr>
<td>Encoding</td>
<td>For CSV and JSON, UTF-8 is the only supported encoding format at this time.</td>
</tr>
<tr>
<td>Delimiter</td>
<td>Stream Analytics supports a number of common delimiters for serializing data in CSV format. Supported values are comma, semicolon, space, tab and vertical bar.</td>
</tr>
</tbody>
</table>

When your data is coming from a Blob storage source, you can access a few metadata fields in your Stream Analytics query. The table below lists the fields and their description.

| PROPERTY | DESCRIPTION |
|------|------|
| BlobName | The name of the input blob that the event came from. |
| EventProcessedUtcTime | The date and time that the event was processed by Stream Analytics. |
| BlobLastModifiedUtcTime | The date and time that the blob was last modified. |
| PartitionId | The zero-based partition ID for the input adapter. |

For example, you may write a query like the following:

````
SELECT
	BlobName,
	EventProcessedUtcTime,
	BlobLastModifiedUtcTime
FROM Input
````


## Get help
For further assistance, try our [Azure Stream Analytics forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=AzureStreamAnalytics)

## Next steps
You've learned about data connection options in Azure for your Stream Analytics jobs. To learn more about Stream Analytics, see:

- [Get started using Azure Stream Analytics](stream-analytics-get-started.md)
- [Scale Azure Stream Analytics jobs](stream-analytics-scale-jobs.md)
- [Azure Stream Analytics Query Language Reference](https://msdn.microsoft.com/library/azure/dn834998.aspx)
- [Azure Stream Analytics Management REST API Reference](https://msdn.microsoft.com/library/azure/dn835031.aspx)

<!--Link references-->
[stream.analytics.developer.guide]: ../stream-analytics-developer-guide.md
[stream.analytics.scale.jobs]: stream-analytics-scale-jobs.md
[stream.analytics.introduction]: stream-analytics-introduction.md
[stream.analytics.get.started]: stream-analytics-get-started.md
[stream.analytics.query.language.reference]: http://go.microsoft.com/fwlink/?LinkID=513299
[stream.analytics.rest.api.reference]: http://go.microsoft.com/fwlink/?LinkId=517301
