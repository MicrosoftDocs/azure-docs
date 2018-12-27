---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Learn about live streaming on-premises encoders recommended by Media Services -  Azure | Microsoft Docs 
description: Learn about live streaming on-premises encoders recommended by Media Services
services: media-services
keywords: encoding;encoders;media
author: johndeu
manager: johndeu
ms.author: johndeu
ms.date: 12/26/2018
ms.topic: article
# Use only one of the following. Use ms.service for services, ms.prod for on-prem. Remove the # before the relevant field.
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

In Media Services, a [LiveEvent](https://docs.microsoft.com/rest/api/media/liveevents) (channel) represents a pipeline for processing live-streaming content. A LiveEvent receives live input streams in one of two ways:

* An on-premises live encoder sends a multi-bitrate RTMP or Smooth Streaming (fragmented MP4) stream to the LiveEvent that is not enabled to perform live encoding with Media Services. The ingested streams pass through LiveEvents without any further processing. This method is called **pass-through**. A live encoder can send a single-bitrate stream to a pass through channel, but this configuration is not recommended because it does not allow for adaptive bitrate streaming to the client.

  > [!NOTE]
  > Using a pass-through method is the most economical way to do live streaming.

* An on-premises live encoder sends a single-bitrate stream to the LiveEvent that is enabled to perform live encoding with Media Services in one of the following formats: RTMP or Smooth Streaming (fragmented MP4). The LiveEvent then performs live encoding of the incoming single-bitrate stream to a multi-bitrate (adaptive) video stream.

For detailed information about live encoding with Media Services, see [Live streaming with Media Services v3](live-streaming-overview.md).

## Live encoders that output RTMP

Media Services recommends using one of following live encoders that have RTMP as output:

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

## Live encoders that output fragmented-MP4

Media Services recommends using one of the following live encoders that have multi-bitrate fragmented-MP4 (Smooth Streaming) as output:

- Ateme TITAN Live
- Cisco Digital Media Encoder 2200
- Elemental Live
- Envivio 4Caster C4 Gen III
- Imagine Communications Selenio MCP3
- Media Excel Hero Live and Hero 4K (UHD/HEVC)

## Recommended encoder settings

### Ingest protocols

- Single bitrate RTMP or RTMPS

### Video format

- Codec: H.264
- Profile: High (Level 4.0)
- Bitrate: Up to 5Mbps (5000 kbps)
- Strict Constant Bitrate (CBR)
- Keyframe/GOP: 2 seconds
  - There must be an IDR frame at the beginning of each GOP
  - Frame Rate: 29.97 or 30fps
  - Resolution: 1280 x 720 (720P)
  - Interlace Mode: Progressive
- Pixel Aspect Ratio (PAR): Square

### Audio format

- Codec: AAC (LC)
- Bitrate: 192 kbps
- Sample Rate: 48 kHz or 44.1 kHz (recommend 48 kHz)

### Configuration tips

- Whenever possible, use a hardwired internet connection.
- A good rule of thumb when determining bandwidth requirements is to double the streaming bitrates. While this is not a mandatory requirement, it will help mitigate the impact of network congestion.
- When using software based encoders, close out any unnecessary programs
- Do not change your encoder configuration once it has started pushing. It has negative effects on the event and can cause the event to be unstable. 
- Ensure to give yourself ample time to setup your event. For high scale events, its recommended to start the setup an hour before your event.

## How to become an on-premises encoder partner

As an Azure Media Services on-premises encoder partner, Media Services promotes your product by recommending your encoder to enterprise customers. To become an on-premises encoder partner, you must verify compatibility of your on-premises encoder with Media Services. To do so, complete the following verifications:

### Pass-through LiveEvent verification

1. Create or visit your Azure Media Services account.
2. Create and start a **pass-through** LiveEvent.
3. Configure your encoder to push a multi-bitrate live stream.
4. Create a published live event.
5. Run your live encoder for approximately 10 minutes.
6. Stop the live event.
7. Create, start a Streaming endpoint, use a player such as [Azure Media Player](https://ampdemo.azureedge.net/azuremediaplayer.html) to watch the archived asset to ensure that playback has no visible glitches for all quality levels (Or alternatively watch and validate via the Preview URL during the live session before step 6).
8. Record the Asset ID, published streaming URL for the live archive, and the settings and version used from your live encoder.
9. Reset the LiveEvent state after creating each sample.
10. Repeat steps 3 through 9 for all configurations supported by your encoder (with and without ad signaling/captions/different encoding speeds).

### Live encoding LiveEvent verification

1. Create or visit your Azure Media Services account.
2. Create and start a **live encoding** LiveEvent.
3. Configure your encoder to push a single-bitrate live stream.
4. Create a published live event.
5. Run your live encoder for approximately 10 minutes.
6. Stop the live event.
7. Create, start a Streaming endpoint, use a player such as [Azure Media Player](https://ampdemo.azureedge.net/azuremediaplayer.html) to watch the archived asset to ensure that playback has no visible glitches for all quality levels (Or alternatively watch and validate via the Preview URL during the live session before step 6).
8. Record the Asset ID, published streaming URL for the live archive, and the settings and version used from your live encoder.
9. Reset the LiveEvent state after creating each sample.
10. Repeat steps 3 through 9 for all configurations supported by your encoder (with and without ad signaling/captions/various encoding speeds).

### Longevity verification

1. Create or visit your Azure Media Services account.
2. Create and start a **pass-through** channel.
3. Configure your encoder to push a multi-bitrate live stream.
4. Create a published live event.
5. Run your live encoder for one week or longer.
6. Use a player such as [Azure Media Player](https://ampdemo.azureedge.net/azuremediaplayer.html) to watch the live streaming from time to time (or archived asset) to ensure that playback has no visible glitches.
7. Stop the live event.
8. Record the Asset ID, published streaming URL for the live archive, and the settings and version used from your live encoder.

Lastly, email your recorded settings and live archive parameters to Azure Media Services at amsstreaming@microsoft.com as a notification that all self-verification checks have passed. Also, include your contact information for any follow ups. You can contact the Azure Media Services team with any questions regarding this process.

## Next steps

[Live streaming with Media Services v3](live-streaming-overview.md)
