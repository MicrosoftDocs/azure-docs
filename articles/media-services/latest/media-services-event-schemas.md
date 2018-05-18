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

## Media Services Job state change event

This section provides the properties and schema for Media Services Job state change event.  

### Available event types

A Media Services **Job** emits the following event types:

| Event type | Description |
| ---------- | ----------- |
| Microsoft.Media.JobStateChange| Raised when a state of the Job changes. |

### Example event

The following example shows the schema of a finished Job state event: 

```json
[
  {
    "topic": "/subscriptions/{subscription id}/resourceGroups/amsResourceGroup/providers/Microsoft.Media/mediaservices/amsaccount",
    "subject": "transforms/VideoAnalyzerTransform/jobs/{job id}",
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
| topic | string | Event Grid provides this value. |
| subject | string | The resource path under the Media Services account resource. |
| eventType | string | One of the registered event types for this event source. For example, "Microsoft.Media.JobStateChange". |
| eventTime | string | The time the event is generated based on the provider's UTC time. |
| id | string | Unique identifier for the event. |
| data | object | Media Services event data. |
| dataVersion | string | The schema version of the data object. The publisher defines the schema version. |
| metadataVersion | string | The schema version of the event metadata. Event Grid defines the schema of the top-level properties. Event Grid provides this value. |

The data object has the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| previousState | string | The state of the job before the event. |
| state | string | The new state of the job being notified in this event. For example, "Queued: The Job is awaiting resources" or “Scheduled: The job is ready to start" .|

Where the Job state can be one of the values: *Queued*, *Scheduled*, *Processing*, *Finished*, *Error*, *Canceled*, *Canceling*

## Next steps

[Register for job state change events](job-state-events-cli-how-to.md)
