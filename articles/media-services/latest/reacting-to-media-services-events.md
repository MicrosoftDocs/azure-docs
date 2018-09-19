---
title: Reacting to Azure Media Services events | Microsoft Docs
description: Use Azure Event Grid to subscribe to Media Services events. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 09/19/2018
ms.author: juliako
---

# Reacting to Media Services events

Media Services events allow applications to react to different events (for example, the job state change event) using modern serverless architectures. It does so without the need for complicated code or expensive and inefficient polling services. Instead, events are pushed through [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to event handlers such as [Azure Functions](https://azure.microsoft.com/services/functions/), [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/), or even to your own Webhook, and you only pay for what you use. For information about pricing, see [Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/).

Availability for Media Services events is tied to Event Grid [availability](../../event-grid/overview.md) and will become available in other regions as Event Grid does.  

## Available Media Services events

Event grid uses [event subscriptions](../../event-grid/concepts.md#event-subscriptions) to route event messages to subscribers.  Currently, Media Services event subscriptions can include the following events:  

|Event Name|Description|
|----------|-----------|
| Microsoft.Media.JobStateChange| Raised when a state of the job changes. |
| Microsoft.Media.LiveEventConnectionRejected | Encoder's connection attempt is rejected. |
| Microsoft.Media.LiveEventEncoderConnected | Encoder establishes connection with live event. |
| Microsoft.Media.LiveEventEncoderDisconnected | Encoder disconnects. |
| Microsoft.Media.LiveEventIncomingDataChunkDropped | Media server drops data chunk because it's too late or has an overlapping timestamp (timestamp of new data chunk is less than the end time of the previous data chunk). |
| Microsoft.Media.LiveEventIncomingStreamReceived | Media server receives first data chunk for each track in the stream or connection. |
| Microsoft.Media.LiveEventIncomingStreamsOutOfSync | Media server detects audio and video streams are out of sync. Use as a warning because user experience may not be impacted. |
| Microsoft.Media.LiveEventIncomingVideoStreamsOutOfSync | Media server detects any of the two video streams coming from external encoder are out of sync. Use as a warning because user experience may not be impacted. |
| Microsoft.Media.LiveEventIngestHeartbeat | Published every 20 seconds for each track when live event is running. Provides ingest health summary. |
| Microsoft.Media.LiveEventTrackDiscontinuityDetected | Media server detects discontinuity in the incoming track. |

## Event Schema

Media Services events contain all the information you need to respond to changes in your data.  You can identify a  Media Services event because the eventType property starts with "Microsoft.Media.".

For more information, see [Media Services event schemas](media-services-event-schemas.md).

## Practices for consuming events

Applications that handle Media Services events should follow a few recommended practices:

* As multiple subscriptions can be configured to route events to the same event handler, it is important not to assume events are from a particular source, but to check the topic of the message to ensure that it comes from the storage account you are expecting.
* Similarly, check that the eventType is one you are prepared to process, and do not assume that all events you receive will be the types you expect.
* Ignore fields you don’t understand.  This practice will help keep you resilient to new features that might be added in the future.
* Use the "subject" prefix and suffix matches to limit events to a particular event.

## Next steps

[Get job state events](job-state-events-cli-how-to.md)
