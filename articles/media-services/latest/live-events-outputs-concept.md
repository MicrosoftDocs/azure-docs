---
title: Live streaming concepts in Azure Media Services - Live Events and Live Outputs | Microsoft Docs
description: This article gives an overview of live streaming concepts in Azure Media Services v3.
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
ms.date: 03/30/2019
ms.author: juliako

---
# Live Events and Live Outputs

Azure Media Services enables you to deliver live events to your customers on the Azure cloud. To configure your live streaming events in Media Services v3, you need to understand concepts discussed in this article. <br/>The list of sections is listed on the right of the page.

## Live Events

[Live Events](https://docs.microsoft.com/rest/api/media/liveevents) are responsible for ingesting and processing the live video feeds. When you create a Live Event, an input endpoint is created that you can use to send a live signal from a remote encoder. The remote live encoder sends the contribution feed to that input endpoint using either the [RTMP](https://www.adobe.com/devnet/rtmp.html) or [Smooth Streaming](https://msdn.microsoft.com/library/ff469518.aspx) (fragmented-MP4) protocol. For the Smooth Streaming ingest protocol, the supported URL schemes are `http://` or `https://`. For the RTMP ingest protocol, the supported URL schemes are `rtmp://` or `rtmps://`. 

## Live Event types

A [Live Event](https://docs.microsoft.com/rest/api/media/liveevents) can be one of two types: pass-through and live encoding. 

### Pass-through

![pass-through](./media/live-streaming/pass-through.svg)

When using the pass-through **Live Event**, you rely on your on-premises live encoder to generate a multiple bitrate video stream and send that as the contribution feed to the Live Event (using RTMP or fragmented-MP4 protocol). The Live Event then carries through the incoming video streams without any further processing. Such a pass-through LiveEvent is optimized for long-running live events or 24x365 linear live streaming. When creating this type of Live Event, specify None (LiveEventEncodingType.None).

You can send the contribution feed at resolutions up to 4K and at a frame rate of 60 frames/second, with either H.264/AVC or H.265/HEVC video codecs, and AAC (AAC-LC, HE-AACv1, or HE-AACv2) audio codec.  See the [Live Event types comparison](live-event-types-comparison.md) article for more details.

> [!NOTE]
> Using a pass-through method is the most economical way to do live streaming when you are doing multiple events over a long period of time, and you have already invested in on-premises encoders. See [pricing](https://azure.microsoft.com/pricing/details/media-services/) details.
> 

See a .NET code example in [MediaV3LiveApp](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials/blob/master/NETCore/Live/MediaV3LiveApp/Program.cs#L126).

### Live encoding  

![live encoding](./media/live-streaming/live-encoding.svg)

When using live encoding with Media Services, you would configure your on-premises live encoder to send a single bitrate video as the contribution feed to the Live Event (using RTMP or Fragmented-Mp4 protocol). The Live Event encodes that incoming single bitrate stream to a [multiple bitrate video stream](https://en.wikipedia.org/wiki/Adaptive_bitrate_streaming), makes it available for delivery to play back devices via protocols like MPEG-DASH, HLS, and Smooth Streaming. When creating this type of Live Event, specify the encoding type as **Standard** (LiveEventEncodingType.Standard).

You can send the contribution feed at up to 1080p resolution at a frame rate of 30 frames/second, with H.264/AVC video codec and AAC (AAC-LC, HE-AACv1, or HE-AACv2) audio codec. See the [Live Event types comparison](live-event-types-comparison.md) article for more details.

When using live encoding (Live Event set to **Standard**), the encoding preset defines how the incoming stream is encoded into multiple bitrates or layers. For information, see [System presets](live-event-types-comparison.md#system-presets).

> [!NOTE]
> Currently, the only allowed preset value for the Standard type of Live Event is *Default720p*. If you need to use a custom live encoding preset, please contact amshelp@microsoft.com. You should specify the desired table of resolution and bitrates. Do verify that there is only one layer at 720p, and at most 6 layers.

## Live Event creation options

When creating a Live Event, you can specify the following options:

* The streaming protocol for the Live Event (currently, the RTMP and Smooth Streaming protocols are supported).<br/>You cannot change the protocol option while the Live Event or its associated Live Outputs are running. If you require different protocols, you should create separate Live Event for each streaming protocol.  
* IP restrictions on the ingest and preview. You can define the IP addresses that are allowed to ingest a video to this Live Event. Allowed IP addresses can be specified as either a single IP address (for example '10.0.0.1'), an IP range using an IP address and a CIDR subnet mask (for example, '10.0.0.1/22'), or an IP range using an IP address and a dotted decimal subnet mask (for example, '10.0.0.1(255.255.252.0)').<br/>If no IP addresses are specified and there is no rule definition, then no IP address will be allowed. To allow any IP address, create a rule and set 0.0.0.0/0.<br/>The IP addresses have to be in one of the following formats: IpV4 address with 4 numbers, CIDR address range.
* When creating the event, you can specify to auto start it. <br/>When autostart is set to true, the Live Event will be started after creation. The billing starts as soon as the Live Event starts running. You must explicitly call Stop on the Live Event resource to halt further billing. Alternatively, you can start the event when you are ready to start streaming. 

    For more information, see [Live Event states and billing](live-event-states-billing.md).

## Live Event ingest URLs

Once the Live Event is created, you can get ingest URLs that you will provide to the live on-premises encoder. The live encoder uses these URLs to input a live stream. For more information, see [Recommended on-premises live encoders](recommended-on-premises-live-encoders.md). 

You can either use non-vanity URLs or vanity URLs. 

* Non-vanity URL

    Non-vanity URL is the default mode in AMS v3. You potentially get the Live Event quickly but ingest URL is known only when the live event is started. The URL will change if you do stop/start the Live Event. <br/>Non-Vanity is useful in scenarios when an end user wants to stream using an app where the app wants to get a live event ASAP and having a dynamic ingest URL is not a problem.
* Vanity URL

    Vanity mode is preferred by large media broadcasters who use hardware broadcast encoders and don't want to re-configure their encoders when they start the Live Event. They want a predictive ingest URL, which does not change over time.

> [!NOTE] 
> For an ingest URL to be predictive, you need to use "vanity" mode and pass your own access token (to avoid a random token in the URL).

### Live ingest URL naming rules

The *random* string below is a 128-bit hex number (which is composed of 32 characters of 0-9 a-f).<br/>
The *access token* below is what you need to specify for fixed URL. It is also 128 bit hex number.

#### Non-vanity URL

##### RTMP

`rtmp://<random 128bit hex string>.channel.media.azure.net:1935/<access token>`
`rtmp://<random 128bit hex string>.channel.media.azure.net:1936/<access token>`
`rtmps://<random 128bit hex string>.channel.media.azure.net:2935/<access token>`
`rtmps://<random 128bit hex string>.channel.media.azure.net:2936/<access token>`

##### Smooth Streaming

`http://<random 128bit hex string>.channel.media.azure.net/<access token>/ingest.isml`
`https://<random 128bit hex string>.channel.media.azure.net/<access token>/ingest.isml`

#### Vanity URL

##### RTMP

`rtmp://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net:1935/<access token>`
`rtmp://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net:1936/<access token>`
`rtmps://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net:2935/<access token>`
`rtmps://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net:2936/<access token>`

##### Smooth Streaming

`http://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net/<access token>/ingest.isml`
`https://<live event name>-<ams account name>-<region abbrev name>.channel.media.azure.net/<access token>/ingest.isml`

## Live Event preview URL

Once the **Live Event** starts receiving the contribution feed, you can use its preview endpoint to preview and validate that you are receiving the live stream before further publishing. After you have checked that the preview stream is good, you can use the LiveEvent to make the live stream available for delivery through one or more (pre-created) **Streaming Endpoints**. To accomplish this, you create a new [Live Output](https://docs.microsoft.com/rest/api/media/liveoutputs) on the **Live Event**. 

> [!IMPORTANT]
> Make sure that the video is flowing to the preview URL before continuing!

## Live Event long-running operations

For details, see [long-running operations](media-services-apis-overview.md#long-running-operations)

## Live Outputs

Once you have the stream flowing into the Live Event, you can begin the streaming event by creating an [Asset](https://docs.microsoft.com/rest/api/media/assets), [Live Output](https://docs.microsoft.com/rest/api/media/liveoutputs), and [Streaming Locator](https://docs.microsoft.com/rest/api/media/streaminglocators). Live Output will archive the stream and make it available to viewers through the [Streaming Endpoint](https://docs.microsoft.com/rest/api/media/streamingendpoints).  

> [!NOTE]
> Live Outputs start on creation and stop when deleted. When you delete the Live Output, you are not deleting the underlying Asset and content in the asset. 

The relationship between a **Live Event** and its **Live Outputs** is similar to traditional television broadcast, whereby a channel (**Live Event**) represents a constant stream of video and a recording (**Live Output**) is scoped to a specific time segment (for example, evening news from 6:30PM to 7:00PM). You can record television using a Digital Video Recorder (DVR) – the equivalent feature in Live Events is managed via the **ArchiveWindowLength** property. It is an ISO-8601 timespan duration (for example, PTHH:MM:SS), which specifies the capacity of the DVR, and can be set from a minimum of 3 minutes to a maximum of 25 hours.

The **Live Output** object is like a tape recorder that will catch and record the live stream into an Asset in your Media Services account. The recorded content will be persisted into the Azure Storage account attached to your account, into the container defined by the Asset resource. The **Live Output** also allows you to control some properties of the outgoing live stream, such as how much of the stream is kept in the archive recording (for example, the capacity of the cloud DVR), and whether or not viewers can start watching the live stream. The archive on disk is a circular archive "window" that only holds the amount of content that is specified in the **archiveWindowLength** property of the **Live Output**. Content that falls outside of this window is automatically discarded from the storage container, and is not recoverable. You can create multiple **Live Outputs** (up to three maximum) on a **Live Event** with different archive lengths and settings.  

If you have published the **Live Output**'s **Asset** using a **Streaming Locator**, the **Live Event** (up to the DVR window length) will continue to be viewable until the Streaming Locator's expiry or deletion, whichever comes first.

For more information, see [Using a cloud DVR](live-event-cloud-dvr.md).

## Next steps

[Live streaming tutorial](stream-live-tutorial-with-api.md)
