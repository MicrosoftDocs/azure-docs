---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Live streaming encoders recommended by Media Services -  Azure | Microsoft Docs 
description: Learn about live streaming on-premises encoders recommended by Media Services
services: media-services
keywords: encoding;encoders;media
author: johndeu
manager: johndeu
ms.author: johndeu
ms.date: 06/12/2019
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

# Recommended live streaming encoders

In Azure Media Services, a [Live Event](https://docs.microsoft.com/rest/api/media/liveevents) (channel) represents a pipeline for processing live-streaming content. The Live Event receives live input streams in one of two ways.

* An on-premises live encoder sends a multi-bitrate RTMP or Smooth Streaming (fragmented MP4) stream to the Live Event that is not enabled to perform live encoding with Media Services. The ingested streams pass through Live Events without any further processing. This method is called **pass-through**. A live encoder can send a single-bitrate stream to a pass-through channel. We don't recommend this configuration because it doesn't allow for adaptive bitrate streaming to the client.

  > [!NOTE]
  > Using a pass-through method is the most economical way to do live streaming.
 
* An on-premises live encoder sends a single-bitrate stream to the Live Event that is enabled to perform live encoding with Media Services in one of the following formats: RTMP or Smooth Streaming (fragmented MP4). The Live Event then performs live encoding of the incoming single-bitrate stream to a multi-bitrate (adaptive) video stream.

For detailed information about live encoding with Media Services, see [Live streaming with Media Services v3](live-streaming-overview.md).

## Live encoders that output RTMP

Media Services recommends using one of following live encoders that have RTMP as output. The supported URL schemes are `rtmp://` or `rtmps://`.

> [!NOTE]
> When streaming via RTMP, check firewall and/or proxy settings to confirm that outbound TCP ports 1935 and 1936 are open.

- Adobe Flash Media Live Encoder 3.2
- Haivision KB
- Haivision Makito X HEVC
- OBS Studio
- Switcher Studio (iOS)
- Telestream Wirecast 8.1+
- Telestream Wirecast S
- Teradek Slice 756
- TriCaster 8000
- Tricaster Mini HD-4
- VMIX
- xStream

## Live encoders that output fragmented MP4

Media Services recommends using one of the following live encoders that have multi-bitrate Smooth Streaming (fragmented MP4) as output. The supported URL schemes are `http://` or `https://`.

- Ateme TITAN Live
- Cisco Digital Media Encoder 2200
- Elemental Live
- Envivio 4Caster C4 Gen III
- Imagine Communications Selenio MCP3
- Media Excel Hero Live and Hero 4K (UHD/HEVC)

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

## Becoming an on-premises encoder partner

As an Azure Media Services on-premises encoder partner, Media Services promotes your product by recommending your encoder to enterprise customers. To become an on-premises encoder partner, you must verify compatibility of your on-premises encoder with Media Services. To do so, complete the following verifications.

### Pass-through Live Event verification

1. In your Media Services account, make sure that the **Streaming Endpoint** is running. 
2. Create and start the **pass-through** Live Event. <br/> For more information, see [Live Event states and billing](live-event-states-billing.md).
3. Get the ingest URLs and configure your on-premises encoder to use the URL to send a multi-bitrate live stream to Media Services.
4. Get the preview URL and use it to verify that the input from the encoder is actually being received.
5. Create a new **Asset** object.
6. Create a **Live Output** and use the asset name that you created.
7. Create a **Streaming Locator** with the built-in **Streaming Policy** types.
8. List the paths on the **Streaming Locator** to get back the URLs to use.
9. Get the host name for the **Streaming Endpoint** that you want to stream from.
10. Combine the URL from step 8 with the host name in step 9 to get the full URL.
11. Run your live encoder for approximately 10 minutes.
12. Stop the Live Event. 
13. Use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the archived asset to ensure that playback has no visible glitches at all quality levels. Or, watch and validate via the preview URL during the live session.
14. Record the asset ID, the published streaming URL for the live archive, and the settings and version used from your live encoder.
15. Reset the Live Event state after creating each sample.
16. Repeat steps 5 through 15 for all configurations supported by your encoder (with and without ad signaling, captions, or different encoding speeds).

### Live encoding Live Event verification

1. In your Media Services account, make sure that the **Streaming Endpoint** is running. 
2. Create and start the **live encoding** Live Event. <br/> For more information, see [Live Event states and billing](live-event-states-billing.md).
3. Get the ingest URLs and configure your encoder to push a single-bitrate live stream to Media Services.
4. Get the preview URL and use it to verify that the input from the encoder is actually being received.
5. Create a new **Asset** object.
6. Create a **Live Output** and use the asset name that you created.
7. Create a **Streaming Locator** with the built-in **Streaming Policy** types.
8. List the paths on the **Streaming Locator** to get back the URLs to use.
9. Get the host name for the **Streaming Endpoint** that you want to stream from.
10. Combine the URL from step 8 with the host name in step 9 to get the full URL.
11. Run your live encoder for approximately 10 minutes.
12. Stop the Live Event.
13. Use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the archived asset to ensure that playback has no visible glitches for all quality levels. Or, watch and validate via the preview URL during the live session.
14. Record the asset ID, the published streaming URL for the live archive, and the settings and version used from your live encoder.
15. Reset the Live Event state after creating each sample.
16. Repeat steps 5 through 15 for all configurations supported by your encoder (with and without ad signaling, captions, or different encoding speeds).

### Longevity verification

Follow the same steps as in [Pass-through Live Event verification](#pass-through-live-event-verification) except for step 11. <br/>Instead of 10 minutes, run your live encoder for one week or longer. Use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the live streaming from time to time (or an archived asset) to ensure that playback has no visible glitches.

### Email your recorded settings

Finally, email your recorded settings and live archive parameters to Azure Media Services at amslived@microsoft.com as a notification that all self-verification checks have passed. Also, include your contact information for any follow-ups. You can contact the Azure Media Services team with any questions about this process.

## Next steps

[Live streaming with Media Services v3](live-streaming-overview.md)
