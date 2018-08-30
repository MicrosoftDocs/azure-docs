---
title: Azure Event Grid schemas for Media Services events
description: Describes the properties that are provided for Media Services events with Azure Event Grid
services: media-services
documentationcenter: ''
author: Juliako
manager: cfowler
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: reference
ms.date: 08/17/2018
ms.author: juliako
---

# Azure Event Grid schemas for Media Services events

This article provides the schemas and properties for Media Services events.

For a list of sample scripts and tutorials, see [Media Services event source](../../event-grid/event-sources.md#azure-subscriptions).

## Available event types

Media Services emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Media.JobStateChange| State of the Job changes. |
| Microsoft.Media.LiveEventConnectionRejected | Encoder's connection attempt is rejected. |
| Microsoft.Media.LiveEventEncoderConnected | Encoder establishes connection with live event. |
| Microsoft.Media.LiveEventEncoderDisconnected | Encoder disconnects. |
| Microsoft.Media.LiveEventIncomingDataChunkDropped | Media server drops data chunk because it's too late or has an overlapping timestamp (timestamp of new data chunk is less than the end time of the previous data chunk). |
| Microsoft.Media.LiveEventIncomingStreamReceived | Media server receives first data chunk for each track in the stream or connection. |
| Microsoft.Media.LiveEventIncomingStreamsOutOfSync | Media server detects audio and video streams are out of sync. Use as a warning because user experience may not be impacted. |
| Microsoft.Media.LiveEventIncomingVideoStreamsOutOfSync | Media server detects any of the two video streams coming from external encoder are out of sync. Use as a warning because user experience may not be impacted. |
| Microsoft.Media.LiveEventIngestHeartbeat | Published every 20 seconds for each track when live event is running. Provides ingest health summary. |
| Microsoft.Media.LiveEventTrackDiscontinuityDetected | Media server detects discontinuity in the incoming track. |

There are two categories for the **Live** events: stream-level events and track-level events. 

Stream-level events are raised per stream or connection. Each event has a `StreamId` parameter that identifies the connection or stream. Each stream or connection has one or more tracks of different types. For example, one connection from an encoder may have one audio track and four video tracks. The stream event types are:

* LiveEventConnectionRejected
* LiveEventEncoderConnected
* LiveEventEncoderDisconnected

Track-level events are raised per track. The track event types are:

* LiveEventIncomingDataChunkDropped
* LiveEventIncomingStreamReceived
* LiveEventIncomingStreamsOutOfSync
* LiveEventIncomingVideoStreamsOutOfSync
* LiveEventIngestHeartbeat
* LiveEventTrackDiscontinuityDetected

## JobStateChange

The following example shows the schema of the **JobStateChange** event: 

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "transforms/VideoAnalyzerTransform/jobs/<job-id>",
    "eventType": "Microsoft.Media.JobStateChange",
    "eventTime": "2018-04-20T21:26:13.8978772",
    "id": "b9d38923-9210-4c2b-958f-0054467d4dd7",
    "data": {
      "previousState": "Processing",
      "state": "Finished"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| previousState | string | The state of the job before the event. |
| state | string | The new state of the job being notified in this event. For example, "Queued: The Job is awaiting resources" or "Scheduled: The job is ready to start".|

Where the Job state can be one of the values: *Queued*, *Scheduled*, *Processing*, *Finished*, *Error*, *Canceled*, *Canceling*

## LiveEventConnectionRejected

The following example shows the schema of the **LiveEventConnectionRejected** event: 

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaServices/<account-name>",
    "subject": "/LiveEvents/MyLiveEvent1",
    "eventType": "Microsoft.Media.LiveEventConnectionRejected",
    "eventTime": "2018-01-16T01:57:26.005121Z",
    "id": "b303db59-d5c1-47eb-927a-3650875fded1",
    "data": { 
      "StreamId":"Mystream1",
      "IngestUrl": "http://abc.ingest.isml",
      "EncoderIp": "118.238.251.xxx",
      "EncoderPort": 52859,
      "ResultCode": "MPE_INGEST_CODEC_NOT_SUPPORTED"
    },
    "dataVersion": "1.0"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| StreamId | string | Identifier of the stream or connection. Encoder or customer is responsible to add this ID in the ingest URL. |  
| IngestUrl | string | Ingest URL provided by the live event. |  
| EncoderIp | string | IP of the encoder. |
| EncoderPort | string | Port of the encoder from where this stream is coming. |
| ResultCode | string | The reason the connection was rejected. The result codes are listed in the following table. |

The result codes are:

| Result code | Description |
| ----------- | ----------- |
| MPE_RTMP_APPID_AUTH_FAILURE | Incorrect ingest URL |
| MPE_INGEST_ENCODER_CONNECTION_DENIED | Encoder IP isn't present in IP allow list configured |
| MPE_INGEST_RTMP_SETDATAFRAME_NOT_RECEIVED | Encoder didn't send metadata about the stream. |
| MPE_INGEST_CODEC_NOT_SUPPORTED | Codec specified isn't supported. |
| MPE_INGEST_DESCRIPTION_INFO_NOT_RECEIVED | Received a fragment before receiving and header for that stream. |
| MPE_INGEST_MEDIA_QUALITIES_EXCEEDED | Number of qualities specified exceeds allowed max limit. |
| MPE_INGEST_BITRATE_AGGREGATED_EXCEEDED | Aggregated bitrate exceeds max allowed limit. |
| MPE_RTMP_FLV_TAG_TIMESTAMP_INVALID | The timestamp for video or audio FLVTag is invalid from RTMP encoder. |

## LiveEventEncoderConnected

The following example shows the schema of the **LiveEventEncoderConnected** event: 

```json
[
  { 
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "eventType": "Microsoft.Media.LiveEventEncoderConnected",
    "eventTime": "2018-08-07T23:08:09.1710643",
    "id": "<id>",
    "data": {
      "ingestUrl": "http://mle1-amsts03mediaacctgndos-ts031.channel.media.azure-test.net:80/ingest.isml",
      "streamId": "15864-stream0",
      "encoderIp": "131.107.147.xxx",
      "encoderPort": "27485"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| StreamId | string | Identifier of the stream or connection. Encoder or customer is responsible for providing this ID in the ingest URL. |
| IngestUrl | string | Ingest URL provided by the live event. |
| EncoderIp | string | IP of the encoder. |
| EncoderPort | string | Port of the encoder from where this stream is coming. |

## LiveEventEncoderDisconnected

The following example shows the schema of the **LiveEventEncoderDisconnected** event: 

```json
[
  { 
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "eventType": "Microsoft.Media.LiveEventEncoderDisconnected",
    "eventTime": "2018-08-07T23:08:09.1710872",
    "id": "<id>",
    "data": {
      "ingestUrl": "http://mle1-amsts03mediaacctgndos-ts031.channel.media.azure-test.net:80/ingest.isml",
      "streamId": "15864-stream0",
      "encoderIp": "131.107.147.xxx",
      "encoderPort": "27485",
      "resultCode": "S_OK"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| StreamId | string | Identifier of the stream or connection. Encoder or customer is responsible to add this ID in the ingest URL. |  
| IngestUrl | string | Ingest URL provided by the live event. |  
| EncoderIp | string | IP of the encoder. |
| EncoderPort | string | Port of the encoder from where this stream is coming. |
| ResultCode | string | The reason for the encoder disconnecting. It could be graceful disconnect or from an error. The result codes are listed in the following table. |

The error result codes are:

| Result code | Description |
| ----------- | ----------- |
| MPE_RTMP_SESSION_IDLE_TIMEOUT | RTMP session timed out after being idle for allowed time limit. |
| MPE_RTMP_FLV_TAG_TIMESTAMP_INVALID | The timestamp for video or audio FLVTag is invalid from RTMP encoder. |
| MPE_CAPACITY_LIMIT_REACHED | Encoder sending data too fast. |
| Unknown Error Codes | These error codes can range from memory error to duplicate entries in hash map. |

The graceful disconnect result codes are:

| Result code | Description |
| ----------- | ----------- |
| S_OK | Encoder disconnected successfully. |
| MPE_CLIENT_TERMINATED_SESSION | Encoder disconnected (RTMP). |
| MPE_CLIENT_DISCONNECTED | Encoder disconnected (FMP4). |
| MPI_REST_API_CHANNEL_RESET | Channel reset command is received. |
| MPI_REST_API_CHANNEL_STOP | Channel stop command received. |
| MPI_REST_API_CHANNEL_STOP | Channel undergoing maintenance. |
| MPI_STREAM_HIT_EOF | EOF stream is sent by the encoder. |

## LiveEventIncomingDataChunkDropped

The following example shows the schema of the **LiveEventIncomingDataChunkDropped** event: 

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaServices/<account-name>",
    "subject": "/LiveEvents/MyLiveEvent1",
    "eventType": "Microsoft.Media.LiveEventIncomingDataChunkDropped",
    "eventTime": "2018-01-16T01:57:26.005121Z",
    "id": "03da9c10-fde7-48e1-80d8-49936f2c3e7d",
    "data": { 
      "TrackType": "Video",
      "TrackName": "Video",
      "Bitrate": 300000,
      "Timestamp": 36656620000,
      "Timescale": 10000000,
      "ResultCode": "FragmentDrop_OverlapTimestamp"
    },
    "dataVersion": "1.0"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| TrackType | string | Type of the track (Audio / Video). |
| TrackName | string | Name of the track. |
| Bitrate | integer | Bitrate of the track. |
| Timestamp | string | Timestamp of the data chunk dropped. |
| Timescale | string | Timescale of the timestamp. |
| ResultCode | string | Reason of the data chunk drop. **FragmentDrop_OverlapTimestamp** or **FragmentDrop_NonIncreasingTimestamp**. |

## LiveEventIncomingStreamReceived

The following example shows the schema of the **LiveEventIncomingStreamReceived** event: 

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "eventType": "Microsoft.Media.LiveEventIncomingStreamReceived",
    "eventTime": "2018-08-07T23:08:10.5069288Z",
    "id": "7f939a08-320c-47e7-8250-43dcfc04ab4d",
    "data": {
      "ingestUrl": "http://mle1-amsts03mediaacctgndos-ts031.channel.media.azure-test.net:80/ingest.isml/Streams(15864-stream0)15864-stream0",
      "trackType": "video",
      "trackName": "video",
      "bitrate": 2962000,
      "encoderIp": "131.107.147.xxx",
      "encoderPort": "27485",
      "timestamp": "15336831655032322",
      "duration": "20000000",
      "timescale": "10000000"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| TrackType | string | Type of the track (Audio / Video). |
| TrackName | string | Name of the track (either provided by the encoder or, in case of RTMP, server generates in *TrackType_Bitrate* format). |
| Bitrate | integer | Bitrate of the track. |
| IngestUrl | string | Ingest URL provided by the live event. |
| EncoderIp | string  | IP of the encoder. |
| EncoderPort | string | Port of the encoder from where this stream is coming. |
| Timestamp | string | First timestamp of the data chunk received. |
| Timescale | string | Timescale in which timestamp is represented. |

## LiveEventIncomingStreamsOutOfSync

The following example shows the schema of the **LiveEventIncomingStreamsOutOfSync** event: 

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "eventType": "Microsoft.Media.LiveEventIncomingStreamsOutOfSync",
    "eventTime": "2018-08-10T02:26:20.6269183Z",
    "id": "b9d38923-9210-4c2b-958f-0054467d4dd7",
    "data": {
      "minLastTimestamp": "319996",
      "typeOfStreamWithMinLastTimestamp": "Audio",
      "maxLastTimestamp": "366000",
      "typeOfStreamWithMaxLastTimestamp": "Video"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| MinLastTimestamp | string | Minimum of last timestamps among all the tracks (audio or video). |
| TypeOfTrackWithMinLastTimestamp | string | Type of the track (audio or video) with minimum last timestamp. |
| MaxLastTimestamp | string | Maximum of all the timestamps among all the tracks (audio or video). |
| TypeOfTrackWithMaxLastTimestamp | string | Type of the track (audio or video) with maximum last timestamp. |

## LiveEventIncomingVideoStreamsOutOfSync

The following example shows the schema of the **LiveEventIncomingVideoStreamsOutOfSync** event: 

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaServices/<account-name>",
    "subject": "/LiveEvents/LiveEvent1",
    "eventType": "Microsoft.Media.LiveEventIncomingVideoStreamsOutOfSync",
    "eventTime": "2018-01-16T01:57:26.005121Z",
    "id": "6dd4d862-d442-40a0-b9f3-fc14bcf6d750",
    "data": {
      "FirstTimestamp": "2162058216",
      "FirstDuration": "2000",
      "SecondTimestamp": "2162057216",
      "SecondDuration": "2000"
    },
    "dataVersion": "1.0"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| FirstTimestamp | string | Timestamp received for one of the tracks/quality levels of type video. |
| FirstDuration | string | Duration of the data chunk with first timestamp. |
| SecondTimestamp | string  | Timestamp received for some other track/quality level of the type video. |
| SecondDuration | string | Duration of the data chunk with second timestamp. |

## LiveEventIngestHeartbeat

The following example shows the schema of the **LiveEventIngestHeartbeat** event: 

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "eventType": "Microsoft.Media.LiveEventIngestHeartbeat",
    "eventTime": "2018-08-07T23:17:57.4610506",
    "id": "7f450938-491f-41e1-b06f-c6cd3965d786",
    "data": {
      "trackType": "audio",
      "trackName": "audio",
      "bitrate": 160000,
      "incomingBitrate": 155903,
      "lastTimestamp": "15336837535253637",
      "timescale": "10000000",
      "overlapCount": 0,
      "discontinuityCount": 0,
      "nonincreasingCount": 0,
      "unexpectedBitrate": false,
      "state": "Running",
      "healthy": true
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| TrackType | string | Type of the track (Audio / Video). |
| TrackName | string | Name of the track (either provided by the encoder or, in case of RTMP, server generates in *TrackType_Bitrate* format). |
| Bitrate | integer | Bitrate of the track. |
| IncomingBitrate | integer | Calculated bitrate based on data chunks coming from encoder. |
| LastTimestamp | string | Latest timestamp received for a track in last 20 seconds. |
| Timescale | string | Timescale in which timestamps are expressed. |
| OverlapCount | integer | Number of data chunks had overlapped timestamps in last 20 seconds. |
| DiscontinuityCount | integer | Number of discontinuities observed in last 20 seconds. |
| NonIncreasingCount | integer | Number of data chunks with timestamps in the past were received in last 20 seconds. |
| UnexpectedBitrate | bool | If expected and actual bitrates differ by more than allowed limit in last 20 seconds. It's true if and only if, IncomingBitrate >= 2* bitrate OR IncomingBitrate <= bitrate/2 OR IncomingBitrate = 0. |
| State | string | State of the live event. |
| Healthy | bool | Indicates whether ingest is healthy based on the counts and flags. Healthy is true if OverlapCount = 0 && DiscontinuityCount = 0 && NonIncreasingCount = 0 && UnexpectedBitrate = false. |

## LiveEventTrackDiscontinuityDetected

The following example shows the schema of the **LiveEventTrackDiscontinuityDetected** event: 

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "eventType": "Microsoft.Media.LiveEventTrackDiscontinuityDetected",
    "eventTime": "2018-08-07T23:18:06.1270405Z",
    "id": "5f4c510d-5be7-4bef-baf0-64b828be9c9b",
    "data": {
      "trackName": "video",
      "previousTimestamp": "15336837615032322",
      "trackType": "video",
      "bitrate": 2962000,
      "newTimestamp": "15336837619774273",
      "discontinuityGap": "575284",
      "timescale": "10000000"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| TrackType | string | Type of the track (Audio / Video). |
| TrackName | string | Name of the track (either provided by the encoder or, in case of RTMP, server generates in *TrackType_Bitrate* format). |
| Bitrate | integer | Bitrate of the track. |
| PreviousTimestamp | string | Timestamp of the previous fragment. |
| NewTimestamp | string | Timestamp of the current fragment. |
| DiscontinuityGap | string | Gap between above two timestamps. |
| Timescale | string | Timescale in which both timestamp and discontinuity gap are represented. |

## Common event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | The EventGrid topic. This property has the resource ID for the Media Services account. |
| subject | string | The resource path for the Media Services channel under the Media Services account. Concatenating the topic and subject give you the resource ID for the job. |
| eventType | string | One of the registered event types for this event source. For example, "Microsoft.Media.JobStateChange". |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Media Services event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

## Next steps

[Register for job state change events](job-state-events-cli-how-to.md)