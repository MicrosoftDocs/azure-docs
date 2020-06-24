---
title: Overview of Live streaming with Azure Media Services v3 | Microsoft Docs
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
ms.date: 03/18/2020
ms.author: juliako

---
# Live streaming with Azure Media Services v3

Azure Media Services enables you to deliver live events to your customers on the Azure cloud. To stream your live events with Media Services, you need the following:  

- A camera that is used to capture the live event.<br/>For setup ideas, check out [Simple and portable event video gear setup]( https://link.medium.com/KNTtiN6IeT).

    If you do not have access to a camera, tools such as [Telestream Wirecast](https://www.telestream.net/wirecast/overview.htm) can be used to generate a live feed from a video file.
- A live video encoder that converts signals from a camera (or another device, like a laptop) into a contribution feed that is sent to Media Services. The contribution feed can include signals related to advertising, such as SCTE-35 markers.<br/>For a list of recommended live streaming encoders, see [live streaming encoders](recommended-on-premises-live-encoders.md). Also, check out this blog: [Live streaming production with OBS](https://link.medium.com/ttuwHpaJeT).
- Components in Media Services, which enable you to ingest, preview, package, record, encrypt, and broadcast the live event to your customers, or to a CDN for further distribution.

For customers looking to deliver content to large internet audiences, we recommend that you enable CDN on the [streaming endpoint](streaming-endpoint-concept.md).

This article gives an overview and guidance of live streaming with Media Services and links to other relevant articles.
 
> [!NOTE]
> You can use the [Azure portal](https://portal.azure.com/) to manage v3 [Live Events](live-events-outputs-concept.md), view v3 [assets](assets-concept.md), get info about accessing APIs. For all other management tasks (for example, Transforms and Jobs), use the [REST API](https://docs.microsoft.com/rest/api/media/), [CLI](https://aka.ms/ams-v3-cli-ref), or one of the supported [SDKs](media-services-apis-overview.md#sdks).

## Dynamic packaging and delivery

With Media Services, you can take advantage of [dynamic packaging](dynamic-packaging-overview.md), which allows you to preview and broadcast your live streams in [MPEG DASH, HLS, and Smooth Streaming formats](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming) from the contribution feed that is being sent to the service. Your viewers can play back the live stream with any HLS, DASH, or Smooth Streaming compatible players. You can use [Azure Media Player](https://amp.azure.net/libs/amp/latest/docs/index.html) in your web or mobile applications to deliver your stream in any of these protocols.

## Dynamic encryption

Dynamic encryption enables you to dynamically encrypt your live or on-demand content with AES-128 or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients. For more information, see [dynamic encryption](content-protection-overview.md).

> [!NOTE]
> Widevine is a service provided by Google Inc. and subject to the terms of service and Privacy Policy of Google, Inc.

## Dynamic filtering

Dynamic filtering is used to control the number of tracks, formats, bitrates, and presentation time windows that are sent out to the players. For more information, see [filters and dynamic manifests](filters-dynamic-manifest-overview.md).

## Live event types

[Live events](https://docs.microsoft.com/rest/api/media/liveevents) are responsible for ingesting and processing the live video feeds. A live event can be set to either a *pass-through* (an on-premises live encoder sends a multiple bitrate stream) or *live encoding* (an on-premises live encoder sends a single bitrate stream). For details about live streaming in Media Services v3, see [Live events and live outputs](live-events-outputs-concept.md).

### Pass-through

![pass-through](./media/live-streaming/pass-through.svg)

When using the pass-through **Live Event**, you rely on your on-premises live encoder to generate a multiple bitrate video stream and send that as the contribution feed to the Live Event (using RTMP or fragmented-MP4 input protocol). The Live Event then carries through the incoming video streams  to the dynamic packager (Streaming Endpoint) without any further transcoding. Such a pass-through Live Event is optimized for long-running live events or 24x365 linear live streaming. 

### Live encoding  

![live encoding](./media/live-streaming/live-encoding.svg)

When using cloud encoding with Media Services, you would configure your on-premises live encoder to send a single bitrate video as the contribution feed (up to 32Mbps aggregate) to the Live Event (using RTMP or fragmented-MP4 input protocol). The Live Event transcodes the incoming single bitrate stream into [multiple bitrate video streams](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming) at varying resolutions to improve delivery and makes it available for delivery to playback devices via industry standard protocols like MPEG-DASH, Apple HTTP Live Streaming (HLS), and Microsoft Smooth Streaming. 

### Live transcription (preview)

Live transcription is a feature you can use with live events that are either pass-through or live encoding. For more information, see [live transcription](live-transcription.md). When this feature is enabled, the service uses the [Speech-To-Text](../../cognitive-services/speech-service/speech-to-text.md) feature of Cognitive Services to transcribe the spoken words in the incoming audio into text. This text is then made available for delivery along with video and audio in MPEG-DASH and HLS protocols.

> [!NOTE]
> Currently, live transcription is available as a preview feature in West US 2.

## Live streaming workflow

To understand the live streaming workflow in Media Services v3, you have to first review and understand the following concepts: 

- [Streaming endpoints](streaming-endpoint-concept.md)
- [Live events and live outputs](live-events-outputs-concept.md)
- [Streaming locators](streaming-locators-concept.md)

### General steps

1. In your Media Services account, make sure the **streaming endpoint** (origin) is running. 
2. Create a [live event](live-events-outputs-concept.md). <br/>When creating the event, you can specify to autostart it. Alternatively, you can start the event when you are ready to start streaming.<br/> When autostart is set to true, the Live Event will be started right after creation. The billing starts as soon as the Live Event starts running. You must explicitly call Stop on the live event resource to halt further billing. For more information, see [live event states and billing](live-event-states-billing.md).
3. Get the ingest URL(s) and configure your on-premises encoder to use the URL to send the contribution feed.<br/>See [recommended live encoders](recommended-on-premises-live-encoders.md).
4. Get the preview URL and use it to verify that the input from the encoder is actually being received.
5. Create a new **asset** object. 

    Each live output is associated with an asset, which it uses to record the video into the associated Azure blob storage container. 
6. Create a **live output** and use the asset name that you created so that the stream can be archived into the asset.

    Live Outputs start on creation and stop when deleted. When you delete the Live Output, you are not deleting the underlying asset and content in the asset.
7. Create a **streaming locator** with the [built-in streaming policy types](streaming-policy-concept.md).

    To publish the live output, you must create a streaming locator for the associated asset. 
8. List the paths on the **streaming locator** to get back the URLs to use (these are deterministic).
9. Get the hostname for the **streaming endpoint** (Origin) you wish to stream from.
10. Combine the URL from step 8 with the hostname in step 9 to get the full URL.
11. If you wish to stop making your **live event** viewable, you need to stop streaming the event and delete the **streaming locator**.
12. If you are done streaming events and want to clean up the resources provisioned earlier, follow the following procedure.

    * Stop pushing the stream from the encoder.
    * Stop the live event. Once the live event is stopped, it will not incur any charges. When you need to start it again, it will have the same ingest URL so you won't need to reconfigure your encoder.
    * You can stop your streaming endpoint, unless you want to continue to provide the archive of your live event as an on-demand stream. If the live event is in stopped state, it will not incur any charges.

The asset that the live output is archiving to, automatically becomes an on-demand asset when the live output is deleted. You must delete all live outputs before a live event can be stopped. You can use an optional flag [removeOutputsOnStop](https://docs.microsoft.com/rest/api/media/liveevents/stop#request-body) to automatically remove live outputs on stop. 

> [!TIP]
> See [Live streaming tutorial](stream-live-tutorial-with-api.md), the article examines the code that implements the steps described above.

## Other important articles

- [Recommended live encoders](recommended-on-premises-live-encoders.md)
- [Using a cloud DVR](live-event-cloud-dvr.md)
- [Live event types feature comparison](live-event-types-comparison.md)
- [States and billing](live-event-states-billing.md)
- [Latency](live-event-latency.md)

## Frequently asked questions

See the [Frequently asked questions](frequently-asked-questions.md#live-streaming) article.

## Ask questions, give feedback, get updates

Check out the [Azure Media Services community](media-services-community.md) article to see different ways you can ask questions, give feedback, and get updates about Media Services.

## Next steps

* [Live streaming quickstart](live-events-wirecast-quickstart.md)
* [Live streaming tutorial](stream-live-tutorial-with-api.md)
* [Migration guidance for moving from Media Services v2 to v3](migrate-from-v2-to-v3.md)
