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
ms.date: 11/26/2018
ms.author: juliako

---
# Live streaming with Azure Media Services v3

Azure Media Services enables you to deliver live events to your customers on the Azure cloud. To stream your live events with Media Services, you need the following:  

- A camera that is used to capture the live event.
- A live video encoder that converts signals from the camera (or another device, like a laptop) into a contribution feed that is sent to Media Services. The contribution feed can include signals related to advertising, such as SCTE-35 markers.
- Components in Media Services, which enable you to ingest, preview, package, record, encrypt, and broadcast the live event to your customers, or to a CDN for further distribution.

This article gives a detailed overview, guidance, and includes diagrams of the main components involved in live streaming with Media Services.

## Overview of main components

To deliver on-demand or live streams with Media Services, you need to have at least one [StreamingEndpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints). When your Media Services account is created a **default** StreamingEndpoint is added to your account in the **Stopped** state. You need to start the StreamingEndpoint from which you want to stream your content to your viewers. You can use the default **StreamingEndpoint**, or create another customized **StreamingEndpoint** with your desired configuration and CDN settings. You may decide to enable multiple StreamingEndpoints, each one targeting a different CDN, and providing a unique hostname for delivery of content. 

In Media Services, [LiveEvents](https://docs.microsoft.com/rest/api/media/liveevents) are responsible for ingesting and processing the live video feeds. When you create a LiveEvent, an input endpoint is created that you can use to send a live signal from a remote encoder. The remote live encoder sends the contribution feed to that input endpoint using either the [RTMP](https://www.adobe.com/devnet/rtmp.html) or [Smooth Streaming](https://msdn.microsoft.com/library/ff469518.aspx) (fragmented-MP4) protocol.  

Once the **LiveEvent** starts receiving the contribution feed, you can use its preview endpoint (preview URL to preview and validate that you are receiving the live stream before further publishing. After you have checked that the preview stream is good, you can use the LiveEvent to make the live stream available for delivery through one or more (pre-created) **StreamingEndpoints**. To accomplish this, you create a new [LiveOutput](https://docs.microsoft.com/rest/api/media/liveoutputs) on the **LiveEvent**. 

The **LiveOutput** object is like a tape recorder that will catch and record the live stream into an Asset in your Media Services account. The recorded content will be persisted into the Azure Storage account attached to your account, into the container defined by the Asset resource.  The **LiveOuput** also allows you to control some properties of the outgoing live stream, such as how much of the stream is kept in the archive recording (for example, the capacity of the cloud DVR). The archive on disk is a circular archive "window" that only holds the amount of content that is specified in the **archiveWindowLength** property of the **LiveOutput**. Content that falls outside of this window is automatically discarded from the storage container, and is not recoverable. You can create multiple LiveOutputs (up to three maximum) on a LiveEvent with different archive lengths and settings.  

With Media Services you can take advantage of **Dynamic Packaging**, which allows you to preview and broadcast your live streams in [MPEG DASH, HLS, and Smooth Streaming formats](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming) from the contribution feed that you send to the service. Your viewers can play back the live stream with any HLS, DASH, or Smooth Streaming compatible players. You can use [Azure Media Player](http://amp.azure.net/libs/amp/latest/docs/index.html) in your web or mobile applications to deliver your stream in any of these protocols.

Media Services enables you to deliver your content encrypted dynamically (**Dynamic Encryption**) with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM licenses to authorized clients. For more information on how to encrypt your content with Media Services, see [Protecting content overview](content-protection-overview.md)

If desired, you can also apply Dynamic Filtering, which can be used to control the number of tracks, formats, bitrates, and presentation time windows that are sent out to the players. 

### New capabilities for live streaming in v3

With the v3 APIs of Media Services, you benefit from the following new features:

- New low latency mode. For more information, see [latency](live-event-latency.md).
- Improved RTMP support (increased stability and more source encoder support).
- RTMPS secure ingest.<br/>When you create a LiveEvent, you get 4 ingest URLs. The 4 ingest URLs are almost identical, have the same streaming token (AppId), only the port number part is different. Two of the URLs are primary and backup for RTMPS.   
- You can stream live events that are up to 24 hours long when using Media Services for transcoding a single bitrate contribution feed into an output stream that has multiple bitrates. 

## LiveEvent types

A  [LiveEvent](https://docs.microsoft.com/rest/api/media/liveevents) can be one of two types: pass-through and live encoding. 

### Pass-through

![pass-through](./media/live-streaming/pass-through.png)

When using the pass-through LiveEvent, you rely on your on-premises live encoder to generate a multiple bitrate video stream and send that as the contribution feed to the LiveEvent (using RTMP or fragmented-MP4 protocol). The LiveEvent then carries through the incoming video streams without any further processing. Such a pass-through LiveEvent is optimized for long-running live events or 24x365 linear live streaming. When creating this type of LiveEvent, specify None (LiveEventEncodingType.None).

You can send the contribution feed at resolutions up to 4K and at a frame rate of 60 frames/second, with either H.264/AVC or H.265/HEVC video codecs, and AAC (AAC-LC, HE-AACv1, or HE-AACv2) audio codec.  See the [LiveEvent types comparison and limitations](live-event-types-comparison.md) article for more details.

> [!NOTE]
> Using a pass-through method is the most economical way to do live streaming when you are doing multiple events over a long period of time, and you have already invested in on-premises encoders. See [pricing](https://azure.microsoft.com/pricing/details/media-services/) details.
> 

See a live example in [MediaV3LiveApp](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/Live/MediaV3LiveApp/Program.cs#L126).

### Live encoding  

![live encoding](./media/live-streaming/live-encoding.png)

When using live encoding with Media Services, you would configure your on-premises live encoder to send a single bitrate video as the contribution feed to the LiveEvent (using RTMP or Fragmented-Mp4 protocol). The LiveEvent encodes that incoming single bitrate stream to a [multiple bitrate video stream](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming), makes it available for delivery to play back devices via protocols like MPEG-DASH, HLS, and Smooth Streaming. When creating this type of LiveEvent, specify the encoding type as **Basic** (LiveEventEncodingType.Basic).

You can send the contribution feed at up to 1080p resolution at a frame rate of 30 frames/second, with H.264/AVC video codec and AAC (AAC-LC, HE-AACv1, or HE-AACv2) audio codec. See the [LiveEvent types comparison and limitations](live-event-types-comparison.md) article for more details.

## LiveEvent types comparison

The following article contains a table that compares features of the two LiveEvent types: [Comparison](live-event-types-comparison.md).

## LiveOutput

A [LiveOutput](https://docs.microsoft.com/rest/api/media/liveoutputs) enables you to control the properties of the outgoing live stream, such as how much of the stream is recorded (for example, the capacity of the cloud DVR), and whether or not viewers can start watching the live stream. The relationship between a **LiveEvent** and its **LiveOutput**s relationship is similar to traditional television broadcast, whereby a channel (**LiveEvent**) represents a constant stream of video and a recording (**LiveOutput**) is scoped to a specific time segment (for example, evening news from 6:30PM to 7:00PM). You can record television using a Digital Video Recorder (DVR) – the equivalent feature in LiveEvents is managed via the ArchiveWindowLength property. It is an ISO-8601 timespan duration (for example, PTHH:MM:SS), which specifies the capacity of the DVR, and can be set from a minimum of 3 minutes to a maximum of 25 hours.


> [!NOTE]
> **LiveOutput**s start on creation and stop when deleted. When you delete the **LiveOutput**, you are not deleting the underlying **Asset** and content in the Asset.  

For more information, see [Using cloud DVR](live-event-cloud-dvr.md).

## StreamingEndpoint

Once you have the stream flowing into the **LiveEvent**, you can begin the streaming event by creating an **Asset**, **LiveOutput**, and **StreamingLocator**. This will archive the stream and make it available to viewers through the [StreamingEndpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints).

When your Media Services account is created a default streaming endpoint is added to your account in the Stopped state. To start streaming your content and take advantage of dynamic packaging and dynamic encryption, the streaming endpoint from which you want to stream content has to be in the Running state.

## <a id="billing" />LiveEvent states and billing

A LiveEvent begins billing as soon as its state transitions to **Running**. To stop the LiveEvent from billing, you have to stop the LiveEvent.

For detailed information, see [States and billing](live-event-states-billing.md).

## Latency

For detailed information about LiveEvents latency, see [Latency](live-event-latency.md).

## Live streaming workflow

Here are the steps for a live streaming workflow:

1. Create a LiveEvent.
2. Create a new Asset object.
3. Create a LiveOutput and use the asset name that you created.
4. Create a Streaming Policy and Content Key if you intend to encrypt your content with DRM.
5. If not using DRM, create a Streaming Locator with the built-in Streaming Policy types.
6. List the paths on the Streaming Policy to get back the URLs to use (these are deterministic).
7. Get the hostname for the Streaming Endpoint you wish to stream from. 
8. Combine the URL from step 6 with the hostname in step 7 to get your full URL.

For more information, see a [Live streaming tutorial](stream-live-tutorial-with-api.md) that is based on the [Live .NET Core](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/tree/master/NETCore/Live) sample.

## Next steps

- [LiveEvent types comparison](live-event-types-comparison.md)
- [States and billing](live-event-states-billing.md)
- [Latency](live-event-latency.md)
