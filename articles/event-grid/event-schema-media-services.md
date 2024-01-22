---
title: Azure Media Services as Event Grid source
description: Describes the properties that are provided for Media Services events with Azure Event Grid
ms.topic: conceptual
ms.date: 12/02/2022
---

# Azure Media Services as an Event Grid source

This article provides the schemas and properties for Media Services events.

## Job-related event types

Media Services emits the **Job-related**  event types described below. There are two categories for the **Job-related** events: "Monitoring Job State Changes" and "Monitoring Job Output State Changes".

You can register for all of the events by subscribing to the JobStateChange event. Or, you can subscribe for specific events only (for example, final states like JobErrored, JobFinished, and JobCanceled).

### Monitoring Job state changes

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Media.JobStateChange| Get an event for all Job State changes. |
| Microsoft.Media.JobScheduled| Get an event when Job transitions to scheduled state. |
| Microsoft.Media.JobProcessing| Get an event when Job transitions to processing state. |
| Microsoft.Media.JobCanceling| Get an event when Job transitions to canceling state. |
| Microsoft.Media.JobFinished| Get an event when Job transitions to finished state. This is a final state that includes Job outputs.|
| Microsoft.Media.JobCanceled| Get an event when Job transitions to canceled state. This is a final state that includes Job outputs.|
| Microsoft.Media.JobErrored| Get an event when Job transitions to error state. This is a final state that includes Job outputs.|

See [Schema examples](#event-schema-examples) that follow.

### Monitoring job output state changes

A job may contain multiple job outputs (if you configured the transform to have multiple job outputs.) If you want to track the details of the individual job output, listen for a job output change event.

Each **Job** is going to be at a higher level than **JobOutput**, thus job output events get fired inside of a corresponding job.

The error messages in `JobFinished`, `JobCanceled`, `JobError` output the aggregated results for each job output – when all of them are finished. Whereas the job output events fire as each task finishes. For example, if you have an encoding output, followed by a Video Analytics output, you would get two events firing as job output events before the final JobFinished event fires with the aggregated data.

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Media.JobOutputStateChange| Get an event for all Job output State changes. |
| Microsoft.Media.JobOutputScheduled| Get an event when Job output transitions to scheduled state. |
| Microsoft.Media.JobOutputProcessing| Get an event when Job output transitions to processing state. |
| Microsoft.Media.JobOutputCanceling| Get an event when Job output transitions to canceling state.|
| Microsoft.Media.JobOutputFinished| Get an event when Job output transitions to finished state.|
| Microsoft.Media.JobOutputCanceled| Get an event when Job output transitions to canceled state.|
| Microsoft.Media.JobOutputErrored| Get an event when Job output transitions to error state.|

See [Schema examples](#event-schema-examples) that follow.

### Monitoring job output progress

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Media.JobOutputProgress| This event reflects the job processing progress, from 0% to 100%. The service attempts to send an event if there has been 5% or greater increase in the progress value or it has been more than 30 seconds since the last event (heartbeat). The progress value isn't guaranteed to start at 0%, or to reach 100%, nor is it guaranteed to increase at a constant rate over time. This event shouldn't be used to determine that the processing has been completed – you should instead use the state change events.|

See [Schema examples](#event-schema-examples) that follow.

## Live event types

Media Services also emits the **Live** event types described below. There are two categories for the **Live** events: stream-level events and track-level events.

### Stream-level events

Stream-level events are raised per stream or connection. Each event has a `StreamId` parameter that identifies the connection or stream. Each stream or connection has one or more tracks of different types. For example, one connection from an encoder may have one audio track and four video tracks. The stream event types are:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Media.LiveEventConnectionRejected | Encoder's connection attempt is rejected. |
| Microsoft.Media.LiveEventEncoderConnected | Encoder establishes connection with live event. |
| Microsoft.Media.LiveEventEncoderDisconnected | Encoder disconnects. |

See [Schema examples](#event-schema-examples) that follow.

### Track-level events

Track-level events are raised per track.

> [!NOTE]
> All track-level events are raised after a live encoder is connected.

The track-level event types are:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Media.LiveEventIncomingDataChunkDropped | Media server drops data chunk because it's too late or has an overlapping timestamp (timestamp of new data chunk is less than the end time of the previous data chunk). |
| Microsoft.Media.LiveEventIncomingStreamReceived | Media server receives first data chunk for each track in the stream or connection. |
| Microsoft.Media.LiveEventIncomingStreamsOutOfSync | Media server detects audio and video streams are out of sync. Use as a warning because user experience may not be impacted. |
| Microsoft.Media.LiveEventIncomingVideoStreamsOutOfSync | Media server detects any of the two video streams coming from external encoder are out of sync. Use as a warning because user experience may not be impacted. |
| Microsoft.Media.LiveEventIngestHeartbeat | Published every 20 seconds for each track when live event is running. Provides ingest health summary.<br/><br/>After the encoder was initially connected, the heartbeat event continues to emit every 20 sec whether the encoder is still connected or not. |
| Microsoft.Media.LiveEventTrackDiscontinuityDetected | Media server detects discontinuity in the incoming track. |

See [Schema examples](#event-schema-examples) that follow.

## Event schema examples

### JobStateChange

# [Event Grid event schema](#tab/event-grid-event-schema)

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

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of the **JobStateChange** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "transforms/VideoAnalyzerTransform/jobs/<job-id>",
    "type": "Microsoft.Media.JobStateChange",
    "time": "2018-04-20T21:26:13.8978772",
    "id": "b9d38923-9210-4c2b-958f-0054467d4dd7",
    "data": {
      "previousState": "Processing",
      "state": "Finished"
    },
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `previousState` | string | The state of the job before the event. |
| `state` | string | The new state of the job being notified in this event. For example, "Scheduled: The job is ready to start" or "Finished: The job is finished".|

Where the Job state can be one of the values: *Queued*, *Scheduled*, *Processing*, *Finished*, *Error*, *Canceled*, *Canceling*

> [!NOTE]
> *Queued* is only going to be present in the **previousState** property but not in the **state** property.

### JobScheduled, JobProcessing, JobCanceling

# [Event Grid event schema](#tab/event-grid-event-schema)

For each non-final Job state change (such as JobScheduled, JobProcessing, JobCanceling), the example schema looks similar to the following:

```json
[{
  "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
  "subject": "transforms/VideoAnalyzerTransform/jobs/<job-id>",
  "eventType": "Microsoft.Media.JobProcessing",
  "eventTime": "2018-10-12T16:12:18.0839935",
  "id": "a0a6efc8-f647-4fc2-be73-861fa25ba2db",
  "data": {
    "previousState": "Scheduled",
    "state": "Processing",
    "correlationData": {
      "testKey1": "testValue1",
      "testKey2": "testValue2"
    }
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```

### JobFinished, JobCanceled, JobErrored

For each final Job state change (such as JobFinished, JobCanceled, JobErrored), the example schema looks similar to the following:

```json
[{
  "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
  "subject": "transforms/VideoAnalyzerTransform/jobs/<job-id>",
  "eventType": "Microsoft.Media.JobFinished",
  "eventTime": "2018-10-12T16:25:56.4115495",
  "id": "9e07e83a-dd6e-466b-a62f-27521b216f2a",
  "data": {
    "outputs": [
      {
        "@odata.type": "#Microsoft.Media.JobOutputAsset",
        "assetName": "output-7640689F",
        "error": null,
        "label": "VideoAnalyzerPreset_0",
        "progress": 100,
        "state": "Finished"
      }
    ],
    "previousState": "Processing",
    "state": "Finished",
    "correlationData": {
      "testKey1": "testValue1",
      "testKey2": "testValue2"
    }
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```

# [Cloud event schema](#tab/cloud-event-schema)

For each non-final Job state change (such as JobScheduled, JobProcessing, JobCanceling), the example schema looks similar to the following:

```json
[{
  "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
  "subject": "transforms/VideoAnalyzerTransform/jobs/<job-id>",
  "type": "Microsoft.Media.JobProcessing",
  "time": "2018-10-12T16:12:18.0839935",
  "id": "a0a6efc8-f647-4fc2-be73-861fa25ba2db",
  "data": {
    "previousState": "Scheduled",
    "state": "Processing",
    "correlationData": {
      "testKey1": "testValue1",
      "testKey2": "testValue2"
    }
  },
  "specversion": "1.0"
}]
```

### JobFinished, JobCanceled, JobErrored

For each final Job state change (such as JobFinished, JobCanceled, JobErrored), the example schema looks similar to the following:

```json
[{
  "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
  "subject": "transforms/VideoAnalyzerTransform/jobs/<job-id>",
  "type": "Microsoft.Media.JobFinished",
  "time": "2018-10-12T16:25:56.4115495",
  "id": "9e07e83a-dd6e-466b-a62f-27521b216f2a",
  "data": {
    "outputs": [
      {
        "@odata.type": "#Microsoft.Media.JobOutputAsset",
        "assetName": "output-7640689F",
        "error": null,
        "label": "VideoAnalyzerPreset_0",
        "progress": 100,
        "state": "Finished"
      }
    ],
    "previousState": "Processing",
    "state": "Finished",
    "correlationData": {
      "testKey1": "testValue1",
      "testKey2": "testValue2"
    }
  },
  "specversion": "1.0"
}]
```

---


The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `outputs` | Array | Gets the Job outputs.|

### JobOutputStateChange

The following example shows the schema of the **JobOutputStateChange** event:

```json
[{
  "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
  "subject": "transforms/VideoAnalyzerTransform/jobs/<job-id>",
  "eventType": "Microsoft.Media.JobOutputStateChange",
  "eventTime": "2018-10-12T16:25:56.0242854",
  "id": "dde85f46-b459-4775-b5c7-befe8e32cf90",
  "data": {
    "previousState": "Processing",
    "output": {
      "@odata.type": "#Microsoft.Media.JobOutputAsset",
      "assetName": "output-7640689F",
      "error": null,
      "label": "VideoAnalyzerPreset_0",
      "progress": 100,
      "state": "Finished"
    },
    "jobCorrelationData": {
      "testKey1": "testValue1",
      "testKey2": "testValue2"
    }
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```

### JobOutputScheduled, JobOutputProcessing, JobOutputFinished, JobOutputCanceling, JobOutputCanceled, JobOutputErrored

For each JobOutput state change, the example schema looks similar to the following:

```json
[{
  "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
  "subject": "transforms/VideoAnalyzerTransform/jobs/<job-id>",
  "eventType": "Microsoft.Media.JobOutputProcessing",
  "eventTime": "2018-10-12T16:12:18.0061141",
  "id": "f1fd5338-1b6c-4e31-83c9-cd7c88d2aedb",
  "data": {
    "previousState": "Scheduled",
    "output": {
      "@odata.type": "#Microsoft.Media.JobOutputAsset",
      "assetName": "output-7640689F",
      "error": null,
      "label": "VideoAnalyzerPreset_0",
      "progress": 0,
      "state": "Processing"
    },
    "jobCorrelationData": {
      "testKey1": "testValue1",
      "testKey2": "testValue2"
    }
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```
### JobOutputProgress

The example schema looks similar to the following:

```json
[{
  "topic": "/subscriptions/<subscription-id>/resourceGroups/belohGroup/providers/Microsoft.Media/mediaservices/<account-name>",
  "subject": "transforms/VideoAnalyzerTransform/jobs/job-5AB6DE32",
  "eventType": "Microsoft.Media.JobOutputProgress",
  "eventTime": "2018-12-10T18:20:12.1514867",
  "id": "00000000-0000-0000-0000-000000000000",
  "data": {
    "jobCorrelationData": {
      "TestKey1": "TestValue1",
      "testKey2": "testValue2"
    },
    "label": "VideoAnalyzerPreset_0",
    "progress": 86
  },
  "dataVersion": "1.0",
  "metadataVersion": "1"
}]
```

### LiveEventConnectionRejected

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
      "streamId":"Mystream1",
      "ingestUrl": "http://abc.ingest.isml",
      "encoderIp": "118.238.251.xxx",
      "encoderPort": 52859,
      "resultCode": "MPE_INGEST_CODEC_NOT_SUPPORTED"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `streamId` | string | Identifier of the stream or connection. Encoder or customer is responsible to add this ID in the ingest URL. |
| `ingestUrl` | string | Ingest URL provided by the live event. |
| `encoderIp` | string | IP of the encoder. |
| `encoderPort` | string | Port of the encoder from where this stream is coming. |
| `resultCode` | string | The reason the connection was rejected. The result codes are listed in the following table. |

You can find the error result codes in [live Event error codes](/azure/media-services/latest/live-event-error-codes-reference).

### LiveEventEncoderConnected

# [Event Grid event schema](#tab/event-grid-event-schema)

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

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of the **LiveEventEncoderConnected** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "type": "Microsoft.Media.LiveEventEncoderConnected",
    "time": "2018-08-07T23:08:09.1710643",
    "id": "<id>",
    "data": {
      "ingestUrl": "http://mle1-amsts03mediaacctgndos-ts031.channel.media.azure-test.net:80/ingest.isml",
      "streamId": "15864-stream0",
      "encoderIp": "131.107.147.xxx",
      "encoderPort": "27485"
    },
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `streamId` | string | Identifier of the stream or connection. Encoder or customer is responsible for providing this ID in the ingest URL. |
| `ingestUrl` | string | Ingest URL provided by the live event. |
| `encoderIp` | string | IP of the encoder. |
| `encoderPort` | string | Port of the encoder from where this stream is coming. |

### LiveEventEncoderDisconnected

# [Event Grid event schema](#tab/event-grid-event-schema)

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

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of the **LiveEventEncoderDisconnected** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "type": "Microsoft.Media.LiveEventEncoderDisconnected",
    "time": "2018-08-07T23:08:09.1710872",
    "id": "<id>",
    "data": {
      "ingestUrl": "http://mle1-amsts03mediaacctgndos-ts031.channel.media.azure-test.net:80/ingest.isml",
      "streamId": "15864-stream0",
      "encoderIp": "131.107.147.xxx",
      "encoderPort": "27485",
      "resultCode": "S_OK"
    },
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `streamId` | string | Identifier of the stream or connection. Encoder or customer is responsible to add this ID in the ingest URL. |
| `ingestUrl` | string | Ingest URL provided by the live event. |
| `encoderIp` | string | IP of the encoder. |
| `encoderPort` | string | Port of the encoder from where this stream is coming. |
| `resultCode` | string | The reason for the encoder disconnecting. It could be graceful disconnect or from an error. The result codes are listed in the following table. |

You can find the error result codes in [live Event error codes](/azure/media-services/latest/live-event-error-codes-reference).

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

### LiveEventIncomingDataChunkDropped

# [Event Grid event schema](#tab/event-grid-event-schema)

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
      "trackType": "Video",
      "trackName": "Video",
      "bitrate": 300000,
      "timestamp": 36656620000,
      "timescale": 10000000,
      "resultCode": "FragmentDrop_OverlapTimestamp"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of the **LiveEventIncomingDataChunkDropped** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaServices/<account-name>",
    "subject": "/LiveEvents/MyLiveEvent1",
    "type": "Microsoft.Media.LiveEventIncomingDataChunkDropped",
    "time": "2018-01-16T01:57:26.005121Z",
    "id": "03da9c10-fde7-48e1-80d8-49936f2c3e7d",
    "data": {
      "trackType": "Video",
      "trackName": "Video",
      "bitrate": 300000,
      "timestamp": 36656620000,
      "timescale": 10000000,
      "resultCode": "FragmentDrop_OverlapTimestamp"
    },
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `trackType` | string | Type of the track (Audio / Video). |
| `trackName` | string | Name of the track. |
| `bitrate` | integer | Bitrate of the track. |
| `timestamp` | string | Timestamp of the data chunk dropped. |
| `timescale` | string | Timescale of the timestamp. |
| `resultCode` | string | Reason of the data chunk drop. **FragmentDrop_OverlapTimestamp** or **FragmentDrop_NonIncreasingTimestamp**. |

### LiveEventIncomingStreamReceived

# [Event Grid event schema](#tab/event-grid-event-schema)

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

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of the **LiveEventIncomingStreamReceived** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "type": "Microsoft.Media.LiveEventIncomingStreamReceived",
    "time": "2018-08-07T23:08:10.5069288Z",
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
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `trackType` | string | Type of the track (Audio / Video). |
| `trackName` | string | Name of the track (either provided by the encoder or, in case of RTMP, server generates in *TrackType_Bitrate* format). |
| `bitrate` | integer | Bitrate of the track. |
| `ingestUrl` | string | Ingest URL provided by the live event. |
| `encoderIp` | string  | IP of the encoder. |
| `encoderPort` | string | Port of the encoder from where this stream is coming. |
| `timestamp` | string | First timestamp of the data chunk received. |
| `timescale` | string | Timescale in which timestamp is represented. |

### LiveEventIncomingStreamsOutOfSync

# [Event Grid event schema](#tab/event-grid-event-schema)

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
      "typeOfStreamWithMaxLastTimestamp": "Video",
      "timescaleOfMinLastTimestamp": "10000000",
      "timescaleOfMaxLastTimestamp": "10000000"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of the **LiveEventIncomingStreamsOutOfSync** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "type": "Microsoft.Media.LiveEventIncomingStreamsOutOfSync",
    "time": "2018-08-10T02:26:20.6269183Z",
    "id": "b9d38923-9210-4c2b-958f-0054467d4dd7",
    "data": {
      "minLastTimestamp": "319996",
      "typeOfStreamWithMinLastTimestamp": "Audio",
      "maxLastTimestamp": "366000",
      "typeOfStreamWithMaxLastTimestamp": "Video",
      "timescaleOfMinLastTimestamp": "10000000",
      "timescaleOfMaxLastTimestamp": "10000000"
    },
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `minLastTimestamp` | string | Minimum of last timestamps among all the tracks (audio or video). |
| `typeOfTrackWithMinLastTimestamp` | string | Type of the track (audio or video) with minimum last timestamp. |
| `maxLastTimestamp` | string | Maximum of all the timestamps among all the tracks (audio or video). |
| `typeOfTrackWithMaxLastTimestamp` | string | Type of the track (audio or video) with maximum last timestamp. |
| `timescaleOfMinLastTimestamp`| string | Gets the timescale in which "MinLastTimestamp" is represented.|
| `timescaleOfMaxLastTimestamp`| string | Gets the timescale in which "MaxLastTimestamp" is represented.|

### LiveEventIncomingVideoStreamsOutOfSync

# [Event Grid event schema](#tab/event-grid-event-schema)

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
      "firstTimestamp": "2162058216",
      "firstDuration": "2000",
      "secondTimestamp": "2162057216",
      "secondDuration": "2000",
      "timescale": "10000000"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of the **LiveEventIncomingVideoStreamsOutOfSync** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaServices/<account-name>",
    "subject": "/LiveEvents/LiveEvent1",
    "type": "Microsoft.Media.LiveEventIncomingVideoStreamsOutOfSync",
    "time": "2018-01-16T01:57:26.005121Z",
    "id": "6dd4d862-d442-40a0-b9f3-fc14bcf6d750",
    "data": {
      "firstTimestamp": "2162058216",
      "firstDuration": "2000",
      "secondTimestamp": "2162057216",
      "secondDuration": "2000",
      "timescale": "10000000"
    },
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `firstTimestamp` | string | Timestamp received for one of the tracks/quality levels of type video. |
| `firstDuration` | string | Duration of the data chunk with first timestamp. |
| `secondTimestamp` | string  | Timestamp received for some other track/quality level of the type video. |
| `secondDuration` | string | Duration of the data chunk with second timestamp. |
| `timescale` | string | Timescale of timestamps and duration.|

### LiveEventIngestHeartbeat

# [Event Grid event schema](#tab/event-grid-event-schema)

The following example shows the schema of the **LiveEventIngestHeartbeat** event:

```json
[
  {
    "topic": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "eventType": "Microsoft.Media.LiveEventIngestHeartbeat",
    "eventTime": "2021-05-14T23:50:00.324",
    "id": "7f450938-491f-41e1-b06f-c6cd3965d786",
    "data": {
      "trackType":"video",
      "trackName":"video",
      "bitrate":2500000,
      "incomingBitrate":2462597,
      "lastTimestamp":"106999",
      "timescale":"1000",
      "overlapCount":0,
      "discontinuityCount":0,
      "nonincreasingCount":0,
      "unexpectedBitrate":false,
      "state":"Running",
      "healthy":true,
      "lastFragmentArrivalTime":"2021-05-14T23:50:00.324",
      "ingestDriftValue":"0",
      "transcriptionState":"",
      "transcriptionLanguage":""
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

# [Cloud event schema](#tab/cloud-event-schema)


The following example shows the schema of the **LiveEventIngestHeartbeat** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "type": "Microsoft.Media.LiveEventIngestHeartbeat",
    "time": "2018-08-07T23:17:57.4610506",
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
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `trackType` | string | Type of the track (Audio / Video). |
| `trackName` | string | Name of the track (either provided by the encoder or, in case of RTMP, server generates in *TrackType_Bitrate* format). |
| `bitrate` | integer | Bitrate of the track. |
| `incomingBitrate` | integer | Calculated bitrate based on data chunks coming from encoder. |
| `lastTimestamp` | string | Latest timestamp received for a track in last 20 seconds. |
| `timescale` | string | Timescale in which timestamps are expressed. |
| `overlapCount` | integer | Number of data chunks had overlapped timestamps in last 20 seconds. |
| `discontinuityCount` | integer | Number of discontinuities observed in last 20 seconds. |
| `nonIncreasingCount` | integer | Number of data chunks with timestamps in the past were received in last 20 seconds. |
| `unexpectedBitrate` | bool | If expected and actual bitrates differ by more than allowed limit in last 20 seconds. It's true if and only if, incomingBitrate >= 2* bitrate OR incomingBitrate <= bitrate/2 OR IncomingBitrate = 0. |
| `state` | string | State of the live event. |
| `healthy` | bool | Indicates whether ingest is healthy, based on the counts and flags. Healthy is true if overlapCount = 0 && discontinuityCount = 0 && nonIncreasingCount = 0 && unexpectedBitrate = false. |
| `lastFragmentArrivalTime` | string |The last time stamp in UTC that a fragment arrived at the ingest endpoint. Example date format is "2020-11-11 12:12:12:888999" |
| `ingestDriftValue` | string | Indicates the speed of delay, in seconds-per-minute, of the incoming audio or video data during the last minute. The value is greater than zero if data is arriving to the live event slower than expected in the last minute; zero if data arrived with no delay; and "n/a" if no audio or video data was received. For example, if you have a contribution encoder sending in live content, and it is slowing down due to processing issues, or network latency, it may be only able to deliver a total of 58 seconds of audio or video in a one minute period. This would be reported as 2 seconds-per-minute of drift. If the encoder is able to catch up and send all 60 seconds or more of data every minute you'll see this value reported as 0. If there was a disconnection, or discontinuity from the encoder, this value may still display as 0, as it doesn't account for breaks in the data - only data that is delayed in timestamps.|
| `transcriptionState` | string | This value is "On" for audio track heartbeats if live transcription is turned on, otherwise you'll see an empty string. This state is only applicable to`tracktype` of `audio` for Live transcription. All other tracks will have an empty value.|
| `transcriptionLanguage` | string  | The language code (in BCP-47 format) of the transcription language. For example “de-de” indicates German (Germany). The value is empty for the video track heartbeats, or when live transcription is turned off. |


### LiveEventTrackDiscontinuityDetected

# [Event Grid event schema](#tab/event-grid-event-schema)

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

# [Cloud event schema](#tab/cloud-event-schema)

The following example shows the schema of the **LiveEventTrackDiscontinuityDetected** event:

```json
[
  {
    "source": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.Media/mediaservices/<account-name>",
    "subject": "liveEvent/mle1",
    "type": "Microsoft.Media.LiveEventTrackDiscontinuityDetected",
    "time": "2018-08-07T23:18:06.1270405Z",
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
    "specversion": "1.0"
  }
]
```

---

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `trackType` | string | Type of the track (Audio / Video). |
| `trackName` | string | Name of the track (either provided by the encoder or, in case of RTMP, server generates in *TrackType_Bitrate* format). |
| `bitrate` | integer | Bitrate of the track. |
| `previousTimestamp` | string | Timestamp of the previous fragment. |
| `newTimestamp` | string | Timestamp of the current fragment. |
| `discontinuityGap` | string | Gap between above two timestamps. |
| `timescale` | string | Timescale in which both timestamp and discontinuity gap are represented. |

### Common event properties

# [Event Grid event schema](#tab/event-grid-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `topic` | string | The Event Grid topic. This property has the resource ID for the Media Services account. |
| `subject` | string | The resource path for the Media Services channel under the Media Services account. Concatenating the topic and subject give you the resource ID for the job. |
| `eventType` | string | One of the registered event types for this event source. For example, "Microsoft.Media.JobStateChange". |
| `eventTime` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Media Services event data. |
| `dataVersion` | string | The schema version of the data object. The publisher defines the schema version. |
| `metadataVersion` | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

# [Cloud event schema](#tab/cloud-event-schema)

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| `source` | string | The Event Grid topic. This property has the resource ID for the Media Services account. |
| `subject` | string | The resource path for the Media Services channel under the Media Services account. Concatenating the topic and subject give you the resource ID for the job. |
| `type` | string | One of the registered event types for this event source. For example, "Microsoft.Media.JobStateChange". |
| `time` | string | The time the event is generated based on the provider's UTC time. |
| `id` | string | Unique identifier for the event. |
| `data` | object | Media Services event data. |
| `specversion` | string | CloudEvents schema specification version. |


---

## Next steps
See [Register for job state change events](/azure/media-services/latest/monitoring/job-state-events-cli-how-to)

## See also

- [Event Grid .NET SDK that includes Media Service events](https://www.nuget.org/packages/Microsoft.Azure.EventGrid/)
- [Definitions of Media Services events](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/eventgrid/data-plane/Microsoft.Media/stable/2018-01-01/MediaServices.json)
- [Live Event error codes](/azure/media-services/latest/live-event-error-codes-reference)
