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
ms.topic: article
ms.date: 03/19/2018
ms.author: juliako
---

# Azure Event Grid schemas for Media Services events

This article provides the schemas and properties for Media Services events.

## Media Services job state change event

This section provides the properties and schema for Media Services job state change event.  

### Available event types

A Media Services **Job** emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Media.JobStateChange| Raised when a state of the job changes. |

### Example event

The following example shows the schema of a finished job state event: 

```json
event: [
  {
    "topic": "/subscriptions/<subscription id>/resourceGroups/juliakoams_rg/providers/Microsoft.Media/mediaservices/juliakoamsaccountname",
    "subject": "transforms/VideoAnalyzerTransform/jobs/<job id>",
    "eventType": "Microsoft.Media.JobStateChange",
    "eventTime": "2018-04-20T21:26:13.8978772",
    "id": "<id>",
    "data": {
      "previousState": "Processing",
      "state": "Finished"
    },
    "dataVersion": "1.0",
    "metadataVersion": "1"
  }
]
```

### Event properties

An event has the following top-level data:

| Property | Type | Description |
| -------- | ---- | ----------- |
| topic | string | Full resource path to the event source. This field is not writeable. Event Grid provides this value. |
| subject | string | Publisher-defined path to the event subject. |
| eventType | string | One of the registered event types for this event source. For example, "Microsoft.Media.JobStateChange". |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object |  |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| previousState | JobState | The state of the job before the event. |
| state | JobState | The new state of the job being notified in this event. |

Where JobState can be one of the JobState values:

```
enum JobState
{
    Queued = 0,
    Scheduled = 1,
    Processing = 2,
    Finished = 3,
    Error = 4,
    Canceled = 5,
    Canceling = 6
}
```

## Next steps

[Get job state events](job-state-events-cli-how-to.md)
