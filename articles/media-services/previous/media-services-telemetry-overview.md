---
title: Azure Media Services Telemetry | Microsoft Docs
description: This article gives an overview of Azure Media Services telemetry.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: 95c20ec4-c782-4063-8042-b79f95741d28
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/01/2019
ms.author: juliako

---

# Azure Media Services telemetry  


> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

Azure Media Services (AMS) enables you to access telemetry/metrics data for its services. The current version of AMS lets you collect telemetry data for live **Channel**, **StreamingEndpoint**, and live **Archive** entities. 

Telemetry is written to a storage table in an Azure Storage account that you specify (typically, you would use the storage account associated with your AMS account). 

The telemetry system does not manage data retention. You can remove the old telemetry data by deleting the storage tables.

This topic discusses how to configure and consume the AMS telemetry.

## Configuring telemetry

You can configure telemetry on a component level granularity. There are two detail levels "Normal" and "Verbose". Currently, both levels return the same information. It is recommended to use "Normal. 

The following topics show how to enable telemetry:

[Enabling telemetry with .NET](media-services-dotnet-telemetry.md) 

[Enabling telemetry with REST](media-services-rest-telemetry.md)

## Consuming telemetry information

Telemetry is written to an Azure Storage Table in the storage account that you specified when you configured telemetry for the Media Services account. This section describes the storage tables for the metrics.

You can consume telemetry data in one of the following ways:

- Read data directly from Azure Table Storage (e.g. using the Storage SDK). For the description of telemetry storage tables, see the **Consuming telemetry information** in [this](https://msdn.microsoft.com/library/mt742089.aspx) topic.

Or

- Use the support in the Media Services .NET SDK for reading storage data, as described in [this](media-services-dotnet-telemetry.md) topic. 


The telemetry schema described below is designed to give good performance within the limits of Azure Table Storage:

- Data is partitioned by account ID and service ID to allow telemetry from each service to be queried independently.
- Partitions contain the date to give a reasonable upper bound on the partition size.
- Row keys are in reverse time order to allow the most recent telemetry items to be queried for a given service.

This should allow many of the common queries to be efficient:

- Parallel, independent downloading of data for separate services.
- Retrieving all data for a given service in a date range.
- Retrieving the most recent data for a service.

### Telemetry table storage output schema

Telemetry data is stored in aggregate in one table, "TelemetryMetrics20160321" where "20160321" is date of the created table. Telemetry system creates a separate table for each new day based at 00:00 UTC. The table is used to store recurring values such as ingest bitrate within a given window of time, bytes sent, etc. 

Property|Value|Examples/notes
---|---|---
PartitionKey|{account ID}_{entity ID}|e49bef329c29495f9b9570989682069d_64435281c50a4dd8ab7011cb0f4cdf66<br/<br/>The account ID is included in the partition key to simplify workflows where multiple Media Services accounts are writing to the same storage account.
RowKey|{seconds to midnight}_{random value}|01688_00199<br/><br/>The row key starts with the number of seconds to midnight to allow top n style queries within a partition. For more information, see [this](../../cosmos-db/table-storage-design-guide.md#log-tail-pattern) article. 
Timestamp|Date/Time|Auto timestamp from the Azure table 2016-09-09T22:43:42.241Z
Type|The type of the entity providing telemetry data|Channel/StreamingEndpoint/Archive<br/><br/>Event type is just a string value.
Name|The name of the telemetry event|ChannelHeartbeat/StreamingEndpointRequestLog
ObservedTime|The time the telemetry event occurred (UTC)|2016-09-09T22:42:36.924Z<br/><br/>The observed time is provided by the entity sending the telemetry (for example a channel). There can be time synchronization issues between components so this value is approximate
ServiceID|{service ID}|f70bd731-691d-41c6-8f2d-671d0bdc9c7e
Entity-specific properties|As defined by the event|StreamName: stream1, Bitrate 10123, …<br/><br/>The remaining properties are defined for the given event type. Azure Table content is key value pairs.  (that is, different rows in the table have different sets of properties).

### Entity-specific schema

There are three types of entity-specific telemetric data entries each pushed with the following frequency:

- Streaming endpoints: Every 30 seconds
- Live channels: Every minute
- Live archive: Every minute

**Streaming Endpoint**

Property|Value|Examples
---|---|---
PartitionKey|PartitionKey|e49bef329c29495f9b9570989682069d_64435281c50a4dd8ab7011cb0f4cdf66
RowKey|RowKey|01688_00199
Timestamp|Timestamp|Auto timestamp from Azure Table 2016-09-09T22:43:42.241Z
Type|Type|StreamingEndpoint
Name|Name|StreamingEndpointRequestLog
ObservedTime|ObservedTime|2016-09-09T22:42:36.924Z
ServiceID|Service ID|f70bd731-691d-41c6-8f2d-671d0bdc9c7e
HostName|Hostname of the endpoint|builddemoserver.origin.mediaservices.windows.net
StatusCode|Records HTTP status|200
ResultCode|Result code detail|S_OK
RequestCount|Total request in the aggregation|3
BytesSent|Aggregated bytes sent|2987358
ServerLatency|Average server latency (including storage)|129
E2ELatency|Average end-to-end latency|250

**Live channel**

Property|Value|Examples/notes
---|---|---
PartitionKey|PartitionKey|e49bef329c29495f9b9570989682069d_64435281c50a4dd8ab7011cb0f4cdf66
RowKey|RowKey|01688_00199
Timestamp|Timestamp|Auto timestamp from the Azure table 2016-09-09T22:43:42.241Z
Type|Type|Channel
Name|Name|ChannelHeartbeat
ObservedTime|ObservedTime|2016-09-09T22:42:36.924Z
ServiceID|Service ID|f70bd731-691d-41c6-8f2d-671d0bdc9c7e
TrackType|Type of track video/audio/text|video/audio
TrackName|Name of the track|video/audio_1
Bitrate|Track bitrate|785000
CustomAttributes||	 
IncomingBitrate|Actual incoming bitrate|784548
OverlapCount|Overlap in the ingest|0
DiscontinuityCount|Discontinuity for track|0
LastTimestamp|Last ingested data timestamp|1800488800
NonincreasingCount|Count of fragments discarded due to non-increasing timestamp|2
UnalignedKeyFrames|Whether we received fragment(s) (across quality levels) where key frames not aligned |True
UnalignedPresentationTime|Whether we received fragment(s) (across quality levels/tracks) where presentation time is not aligned|True
UnexpectedBitrate|True, if calculated/actual bitrate for audio/video track > 40,000 bps and IncomingBitrate == 0 OR IncomingBitrate and actualBitrate differ by 50% |True
Healthy|True, if <br/>overlapCount, <br/>DiscontinuityCount, <br/>NonIncreasingCount, <br/>UnalignedKeyFrames, <br/>UnalignedPresentationTime, <br/>UnexpectedBitrate<br/> are all 0|True<br/><br/>Healthy is a composite function that returns false when any of the following conditions hold:<br/><br/>- OverlapCount > 0<br/>- DiscontinuityCount > 0<br/>- NonincreasingCount > 0<br/>- UnalignedKeyFrames == True<br/>- UnalignedPresentationTime == True<br/>- UnexpectedBitrate == True

**Live archive**

Property|Value|Examples/notes
---|---|---
PartitionKey|PartitionKey|e49bef329c29495f9b9570989682069d_64435281c50a4dd8ab7011cb0f4cdf66
RowKey|RowKey|01688_00199
Timestamp|Timestamp|Auto timestamp from the Azure table 2016-09-09T22:43:42.241Z
Type|Type|Archive
Name|Name|ArchiveHeartbeat
ObservedTime|ObservedTime|2016-09-09T22:42:36.924Z
ServiceID|Service ID|f70bd731-691d-41c6-8f2d-671d0bdc9c7e
ManifestName|Program url|asset-eb149703-ed0a-483c-91c4-e4066e72cce3/a0a5cfbf-71ec-4bd2-8c01-a92a2b38c9ba.ism
TrackName|Name of the track|audio_1
TrackType|Type of the track|Audio/video
CustomAttribute|Hex string that differentiates between different track with same name and bitrate (multi camera angle)|
Bitrate|Track bitrate|785000
Healthy|True, if FragmentDiscardedCount == 0 && ArchiveAcquisitionError == False|True (these two values are not present in the metric but they are present in the source event)<br/><br/>Healthy is a composite function that returns false when any of the following conditions hold:<br/><br/>- FragmentDiscardedCount > 0<br/>- ArchiveAcquisitionError == True

## General Q&A

### How to consume metrics data?

Metrics data is stored as a series of Azure Tables in the customer’s storage account. This data can be consumed using the following tools:

- AMS SDK
- Microsoft Azure Storage Explorer (supports export to comma-separated value format and processed in Excel)
- REST API

### How to find average bandwidth consumption?

The average bandwidth consumption is the average of BytesSent over a span of time.

### How to define streaming unit count?

The streaming unit count can be defined as the peak throughput from the service’s streaming endpoints divided by the peak throughput of one streaming endpoint. The peak usable throughput of one streaming endpoint is 160 Mbps.
For example, suppose the peak throughput from a customer’s service is 40 MBps (the maximum value of BytesSent over a span of time). Then, the streaming unit count is equal to (40 MBps)*(8 bits/byte)/(160 Mbps) = 2 streaming units.

### How to find average requests/second?

To find the average number of requests/second, compute the average number of requests (RequestCount) over a span of time.

### How to define channel health?

Channel health can be defined as a composite Boolean function such that it is false when any of the following conditions hold:

- OverlapCount > 0
- DiscontinuityCount > 0
- NonincreasingCount > 0
- UnalignedKeyFrames == True 
- UnalignedPresentationTime == True 
- UnexpectedBitrate == True


### How to detect discontinuities?

To detect discontinuities, find all Channel data entries where DiscontinuityCount > 0. The corresponding ObservedTime timestamp indicates the times at which the discontinuities occurred.

### How to detect timestamp overlaps?

To detect timestamp overlaps, find all Channel data entries where OverlapCount > 0. The corresponding ObservedTime timestamp indicates the times at which the timestamp overlaps occurred.

### How to find streaming request failures and reasons?

To find streaming request failures and reasons, find all Streaming Endpoint data entries where ResultCode is not equal to S_OK. The corresponding StatusCode field indicates the reason for the request failure.

### How to consume data with external tools?

Telemetric data can be processed and visualized with the following tools:

- PowerBI
- Application Insights
- Azure Monitor (formerly Shoebox)
- AMS Live Dashboard
- Azure Portal (pending release)

### How to manage data retention?

The telemetry system does not provide data retention management or auto deletion of old records. Thus, you need to manage and delete old records manually from the storage table. You can refer to storage SDK for how to do it.

## Next steps

[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback

[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]
