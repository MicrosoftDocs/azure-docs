---
title: Azure Media Services Live Event and a cloud DVR | Microsoft Docs
description: This article explains what Live Output is and how to use a cloud DVR.  
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: ne
ms.topic: article
ms.date: 01/14/2019
ms.author: juliako

---

# Using a cloud Digital Video Recorder (DVR)

In Azure Media Services, a [Live Output](https://docs.microsoft.com/rest/api/media/liveoutputs) object is like a tape recorder that will catch and record the live stream into an asset in your Media Services account. The recorded content will be persisted into the container defined by the [Asset](https://docs.microsoft.com/rest/api/media/assets) resource (the container is in the Azure Storage account attached to your account). The Live Output also allows you to control some properties of the outgoing live stream, such as how much of the stream is kept in the archive recording (for example, the capacity of the cloud DVR), and whether or not viewers can start watching the live stream. The archive on disk is a circular archive "window" that only holds the amount of content that is specified in the **archiveWindowLength** property of the Live Output. Content that falls outside of this window is automatically discarded from the storage container, and is not recoverable. The **archiveWindowLength** value represents an ISO-8601 timespan duration (for example, PTHH:MM:SS), which specifies the capacity of the DVR, and can be set from a minimum of 3 minutes to a maximum of 25 hours.

The relationship between a **Live Event** and its **Live Outputs** is similar to traditional television broadcast, whereby a channel (Live Event) represents a constant stream of video and a recording (Live Output) is scoped to a specific time segment (for example, evening news from 6:30PM to 7:00PM). Once you have the stream flowing into the Live Event, you can begin the streaming event by creating an [Asset](https://docs.microsoft.com/rest/api/media/assets), [Live Output](https://docs.microsoft.com/rest/api/media/liveoutputs), and [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators). Live Output will archive the stream and make it available to viewers through the [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints). You can create multiple Live Outputs (up to three maximum) on a Live Event with different archive lengths and settings. For information about the live streaming workflow, see the [General steps](live-streaming-overview.md#general-steps).

## Using a DVR during an event to control what portions of the stream is available for ‘rewind’

The **archiveWindowLength** value determines how far back in time a viewer can seek from the current live position. The **archiveWindowLength** value also determines how long the client manifests can grow.

Suppose you are streaming a football game, and it has an **ArchiveWindowLength** of only 30 minutes. A viewer who starts watching your event 45 minutes after the game started can seek back to at most the 15-minute mark. Your **Live Output**s for the game will continue until the **Live Event** is stopped, but content that falls outside of **ArchiveWindowLength** is continuously discarded from storage and is non-recoverable. In this example, the video between the start of the event and the 15-minute mark would have been purged from your DVR and from the container in blob storage for the [Asset](https://docs.microsoft.com/rest/api/media/assets). The archive is not recoverable and is removed from the container in Azure blob storage.

A **Live Event** supports up to three concurrently running **Live Output**s so you can create at most 3 recordings/archives from one live stream. This allows you to publish and archive different parts of an event as needed. Suppose you need to broadcast a 24x7 live linear feed, and create "recordings" of the different programs throughout the day to offer to customers as on-demand content for catch-up viewing. For this scenario, you first create a primary Live Output, with a short archive window of 1 hour or less – this is the primary live stream that your viewers would tune into. You would create a **Streaming Locator** for this **Live Output** and publish it to your application or web site as the "Live" feed. While the **Live Event** is running, you can programmatically create a second concurrent **Live Output** at the beginning of a program (or 5 minutes early to provide some handles to trim later). This second **Live Output** can be deleted 5 minutes after the program ends. With this second **Asset**, you can create a new **Streaming Locator** to publish this program as an on-demand asset in your application's catalog. You can repeat this process multiple times for other program boundaries or highlights that you wish to share as on-demand videos, all while the "Live" feed from the first **Live Output** continues to broadcast the linear feed. 

## Creating an archive for on-demand playback

Live Event automatically converts events to on-demand content when stopped. Even after you stop and delete the event, the users would be able to stream your archived content as a video on demand, for as long as you do not delete the asset. An asset cannot be deleted if it is used by an event; the event must be deleted first.

If you have published the asset of your Live Output using a Streaming Locator, the Live Event (up to the DVR window length) will continue to be viewable until the Streaming Locator’s expiry or deletion, whichever comes first.

For more information, see:

- [Live streaming overview](live-streaming-overview.md)
- [Live streaming tutorial](stream-live-tutorial-with-api.md)

> [!NOTE]
> When you delete the Live Output, you are not deleting the underlying asset and content in the asset. 

## Next steps

* [Subclip your videos](subclip-video-rest-howto.md).
* [Define filters for your assets](filters-dynamic-manifest-rest-howto.md).
