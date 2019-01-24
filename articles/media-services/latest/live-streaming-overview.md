---
title: Overview of Live Streaming using Azure Media Services | Microsoft Docs
description: This article gives an overview of live streaming using Azure Media Services v3.
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
ms.date: 01/22/2019
ms.author: juliako

---
# Live streaming with Azure Media Services v3

Azure Media Services enables you to deliver live events to your customers on the Azure cloud. To stream your live events with Media Services, you need the following:  

- A camera that is used to capture the live event.
- A live video encoder that converts signals from the camera (or another device, like a laptop) into a contribution feed that is sent to Media Services. The contribution feed can include signals related to advertising, such as SCTE-35 markers.
- Components in Media Services, which enable you to ingest, preview, package, record, encrypt, and broadcast the live event to your customers, or to a CDN for further distribution.

With Media Services, you can take advantage of **Dynamic Packaging**, which allows you to preview and broadcast your live streams in [MPEG DASH, HLS, and Smooth Streaming formats](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming) from the contribution feed that you send to the service. Your viewers can play back the live stream with any HLS, DASH, or Smooth Streaming compatible players. You can use [Azure Media Player](http://amp.azure.net/libs/amp/latest/docs/index.html) in your web or mobile applications to deliver your stream in any of these protocols.

Media Services enables you to deliver your content encrypted dynamically (**Dynamic Encryption**) with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM licenses to authorized clients. For more information on how to encrypt your content with Media Services, see [Protecting content overview](content-protection-overview.md)

You can also apply Dynamic Filtering, which can be used to control the number of tracks, formats, bitrates, and presentation time windows that are sent out to the players. For more information, see [Filters and dynamic manifests](filters-dynamic-manifest-overview.md).

This article gives an overview and guidance of live streaming with Media Services.

## Live streaming workflow

Here are the steps for a live streaming workflow:

1. Make sure the [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints) is running. See the following article for more details:

    * [Streaming Endpoints concept](streaming-endpoint-concept.md).
1. Create and start **Live Event**. <br/> A [Live Event](https://docs.microsoft.com/rest/api/media/liveevents) can be one of two types: **pass-through** and **live encoding**. <br/>See the following article for more details:

    * [Live Events concept](live-events-outputs-concept.md#live-events).
1. Get the ingest URL(s) and configure your on-premise encoder to use the URL to send the contribution feed. See these articles for more details:

    * [Recommended live encoders](recommended-on-premises-live-encoders.md)
    * [Vanity URLs](live-events-outputs-concept.md#vanity-urls)
1. Get the preview URL and use it to verify that the input from the encoder is actually being received.
1. Create a new [Asset](https://docs.microsoft.com/rest/api/media/asset) object.
1. Create a [Live Output](https://docs.microsoft.com/rest/api/media/liveoutputs) and use the asset name that you created. <br/>The **Live Output** archives the stream into the **Asset**.  See these articles for more details:

    * [Live Outputs concept](live-events-outputs-concept.md#live-outputs)
    * [Using cloud DVR](live-event-cloud-dvr.md)
1. Create a [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocator) with the built-in **Streaming Policy** types.

    If you intend to encrypt your content, review [Content protection overview](content-protection-overview.md).
1. List the paths on the **Streaming Locator** to get back the URLs to use (these are deterministic).
1. Get the hostname for the **Streaming Endpoint** you wish to stream from.
1. Combine the URL from step 8 with the hostname in step 9 to get the full URL.
1. After you have published the **Live Output** asset using a **Streaming Locator**, the **Live Event** (up to the DVR window length) will continue to be viewable until the **Streaming Locator**'s expiry or deletion, whichever comes first.

## Prerequisites

Before starting to implement,  live streaming with Media Services, make sure to review these important topics:

- [Streaming Endpoints concept](streaming-endpoint-concept.md)
- [Live Events and Live Outputs concepts](live-events-outputs-concept.md)
- [Recommended live encoders](recommended-on-premises-live-encoders.md)
- [Using a cloud DVR](live-event-cloud-dvr.md)
- [Live Event types feature comparison](live-event-types-comparison.md)
- [States and billing](live-event-states-billing.md)
- [Latency](live-event-latency.md)

## Next steps

* [Live streaming tutorial](stream-live-tutorial-with-api.md)
* [Migration guidance for moving from Media Services v2 to v3](migrate-from-v2-to-v3.md)