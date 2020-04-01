---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Live streaming encoders recommended by Media Services -  Azure | Microsoft Docs 
description: Learn about live streaming on-premises encoders recommended by Media Services
services: media-services
keywords: encoding;encoders;media
author: johndeu
manager: johndeu
ms.author: johndeu
ms.date: 02/10/2020
ms.topic: article
# Use only one of the following. Use ms.service for services, ms.prod for on premises. Remove the # before the relevant field.
ms.service: media-services
# product-name-from-white-list

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
# manager: MSFT-alias-manager-or-PM-counterpart
---
 
# Tested on-premises live streaming encoders

In Azure Media Services, a [Live Event](https://docs.microsoft.com/rest/api/media/liveevents) (channel) represents a pipeline for processing live-streaming content. The Live Event receives live input streams in one of two ways.

* An on-premises live encoder sends a multi-bitrate RTMP or Smooth Streaming (fragmented MP4) stream to the Live Event that is not enabled to perform live encoding with Media Services. The ingested streams pass through Live Events without any further processing. This method is called **pass-through**. We recommend for the live encoder to send multi-bitrate streams instead of a single-bitrate stream to a pass-through live event to allow for adaptive bitrate streaming to the client. 

    If you are using multi-bitrates streams for the pass-through live event, the video GOP size and the video fragments on different bitrates must be synchronized to avoid unexpected behavior on the playback side.

  > [!TIP]
  > Using a pass-through method is the most economical way to do live streaming.
 
* An on-premises live encoder sends a single-bitrate stream to the Live Event that is enabled to perform live encoding with Media Services in one of the following formats: RTMP or Smooth Streaming (fragmented MP4). The Live Event then performs live encoding of the incoming single-bitrate stream to a multi-bitrate (adaptive) video stream.

This article discusses tested on-premises live streaming encoders. For instructions on how to verify your on-premises live encoder, see [verify your on-premises encoder](become-on-premises-encoder-partner.md)

For detailed information about live encoding with Media Services, see [Live streaming with Media Services v3](live-streaming-overview.md).

## Encoder requirements

Encoders must support TLS 1.2 when using HTTPS or RTMPS protocols.

## Live encoders that output RTMP

Media Services recommends using one of following live encoders that have RTMP as output. The supported URL schemes are `rtmp://` or `rtmps://`.

When streaming via RTMP, check firewall and/or proxy settings to confirm that outbound TCP ports 1935 and 1936 are open.<br/><br/>
When streaming via RTMPS, check firewall and/or proxy settings to confirm that outbound TCP ports 2935 and 2936 are open.

> [!NOTE]
> Encoders must support TLS 1.2 when using RTMPS protocols.

- Adobe Flash Media Live Encoder 3.2
- [Cambria Live 4.3](https://www.capellasystems.net/products/cambria-live/)
- Elemental Live (version 2.14.15 and higher)
- Haivision KB
- Haivision Makito X HEVC
- OBS Studio
- Switcher Studio (iOS)
- Telestream Wirecast (version 13.0.2 or higher due to the TLS 1.2 requirement)
- Telestream Wirecast S (only RTMP is supported)
- Teradek Slice 756
- TriCaster 8000
- Tricaster Mini HD-4
- VMIX
- xStream
- [Ffmpeg](https://www.ffmpeg.org)
- [GoPro](https://gopro.com/help/articles/block/getting-started-with-live-streaming) Hero 7 and Hero 8
- [Restream.io](https://restream.io/)

## Live encoders that output fragmented MP4

Media Services recommends using one of the following live encoders that have multi-bitrate Smooth Streaming (fragmented MP4) as output. The supported URL schemes are `http://` or `https://`.

> [!NOTE]
> Encoders must support TLS 1.2 when using HTTPS protocols.

- Ateme TITAN Live
- Cisco Digital Media Encoder 2200
- Elemental Live (version 2.14.15 and higher due to the TLS 1.2 requirement)
- Envivio 4Caster C4 Gen III 
- Imagine Communications Selenio MCP3
- Media Excel Hero Live and Hero 4K (UHD/HEVC)
- [Ffmpeg](https://www.ffmpeg.org)

> [!TIP]
>  If you are streaming live events in multiple languages (for example, one English audio track and one Spanish audio track), you can accomplish this with the Media Excel live encoder configured to send the live feed to a pass-through Live Event.

## Configuring on-premises live encoder settings

For information about what settings are valid for your live event type, see [Live Event types comparison](live-event-types-comparison.md).

### Playback requirements

To play back content, both an audio and video stream must be present. Playback of the video-only stream is not supported.

### Configuration tips

- Whenever possible, use a hardwired internet connection.
- When you're determining bandwidth requirements, double the streaming bitrates. Although not mandatory, this simple rule helps to mitigate the impact of network congestion.
- When using software-based encoders, close out any unnecessary programs.
- Changing your encoder configuration after it has started pushing has negative effects on the event. Configuration changes can cause the event to become unstable. 
- Ensure that you give yourself ample time to set up your event. For high-scale events, we recommend starting the setup an hour before your event.
- Use the H.264 video and AAC audio codec output.
- Ensure that there is key frame or GOP temporal alignment across video qualities.
- Make sure there is a unique stream name for each video quality.
- Use strict CBR encoding recommended for optimum adaptive bitrate performance.

> [!IMPORTANT]
> Watch the physical condition of the machine (CPU / Memory / etc) as uploading fragments to cloud involves CPU and IO operations. If you change any settings in the encoder, be certain reset the channels / live event for the change to take effect.

## See also

[Live streaming with Media Services v3](live-streaming-overview.md)

## Next steps

[How to verify your encoder](become-on-premises-encoder-partner.md)
