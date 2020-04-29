---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Learn about encoders recommended by Azure Media Services | Microsoft Docs 
description: This article lists on premises encoders recommended by Azure Media Services.
services: media-services
keywords: encoding;encoders;media
author: dbgeorge
manager: johndeu
ms.author: johndeu
ms.date: 03/20/2019
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

# Recommended on-premises encoders

When live streaming with Azure Media Services, you can specify how you want your channel to receive the input stream. If you choose to use an on premises encoder with a live encoding channel, your encoder should push a high-quality single-bitrate stream as output. If you choose to use an on premises encoder with a pass through channel, your encoder should push a multi-bitrate stream as output with all desired output qualities. For more information, see [Live streaming with on premises encoders](media-services-live-streaming-with-onprem-encoders.md).

## Encoder requirements

Encoders must support TLS 1.2 when using HTTPS or RTMPS protocols.

## Live encoders that output RTMP 

Azure Media Services recommends using one of following live encoders that have RTMP as output:

- Adobe Flash Media Live Encoder 3.2
- Haivision Makito X HEVC
- Haivision KB
- Telestream Wirecast (version 13.0.2 or higher due to the TLS 1.2 requirement)

  Encoders must support TLS 1.2 when using RTMPS protocols.
- Teradek Slice 756
- OBS Studio
- VMIX
- xStream
- Switcher Studio (iOS)

## Live encoders that output fragmented MP4 

Azure Media Services recommends using one of the following live encoders that have multi-bitrate fragmented-MP4 (Smooth Streaming) as output:

- Media Excel Hero Live and Hero 4K (UHD/HEVC)
- Ateme TITAN Live
- Cisco Digital Media Encoder 2200
- Elemental Live (version 2.14.15 and higher due to the TLS 1.2 requirement)

  Encoders must support TLS 1.2 when using HTTPS protocols.
- Envivio 4Caster C4 Gen III
- Imagine Communications Selenio MCP3

> [!NOTE]
> A live encoder can send a single-bitrate stream to a pass through channel, but this configuration is not recommended because it does not allow for adaptive bitrate streaming to the client.

## How to become an on premises encoder partner

As an Azure Media Services on premises encoder partner, Media Services promotes your product by recommending your encoder to enterprise customers. To become an on premises encoder partner, you must verify compatibility of your on premises encoder with Media Services. To do so, complete the following verifications:

Pass through channel verification
1. Create or visit your Azure Media Services account
2. Create and start a **pass-through** channel
3. Configure your encoder to push a multi-bitrate live stream.
4. Create a published live event
5. Run your live encoder for approximately 10 minutes
6. Stop the live event
7. Create, start a Streaming endpoint, use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the archived asset to ensure that playback has no visible glitches for all quality levels (Or alternatively watch and validate via the Preview URL during the live session before step 6)
8. Record the Asset ID, published streaming URL for the live archive, and the settings and version used from your live encoder
9. Reset the channel state after creating each sample
10. Repeat steps 3 through 9 for all configurations supported by your encoder (with and without ad signaling/captions/different encoding speeds)

Live encoding channel verification
1. Create or visit your Azure Media Services account
2. Create and start a **live encoding** channel
3. Configure your encoder to push a single-bitrate live stream.
4. Create a published live event
5. Run your live encoder for approximately 10 minutes
6. Stop the live event
7. Create, start a Streaming endpoint, use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the archived asset to ensure that playback has no visible glitches for all quality levels (Or alternatively watch and validate via the Preview URL during the live session before step 6)
8. Record the Asset ID, published streaming URL for the live archive, and the settings and version used from your live encoder
9. Reset the channel state after creating each sample
10. Repeat steps 3 through 9 for all configurations supported by your encoder (with and without ad signaling/captions/various encoding speeds)

Longevity verification
1. Create or visit your Azure Media Services account
2. Create and start a **pass-through** channel
3. Configure your encoder to push a multi-bitrate live stream.
4. Create a published live event
5. Run your live encoder for one week or longer
6. Use a player such as [Azure Media Player](https://aka.ms/azuremediaplayer) to watch the live streaming from time to time (or archived asset) to ensure that playback has no visible glitches
7. Stop the live event
8. Record the Asset ID, published streaming URL for the live archive, and the settings and version used from your live encoder

Lastly, send your recorded settings and live archive parameters to Media Services by emailing amsstreaming@microsoft.com. Upon receipt, Media Services performs verification tests on the samples from your live encoder. You can contact the Media Services with any questions regarding this process.
