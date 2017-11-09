---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Learn about encoders recommended by media services | Microsoft Docs 
description: Learn about encoders recommended by media services
services: media-services
keywords: encoding;encoders;media
author: dbgeorge
manager: jasonsue
ms.author: dwgeo
ms.date: 11/10/2017
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

# Recommended on-prem encoders
When live streaming with Azure Media Services, you can specify how you want your channel to receive the input stream. If you choose to use an on-prem encoder with a live encoding channel, your encoder should push a high-quality single-bitrate stream as output. If you choose to use an on-prem encoder with a pass through channel, your encoder should push a multi-bitrate stream as output with all desired output qualities. For more information, see [Live streaming with on-prem encoders](media-services-live-streaming-with-onprem-encoders.md).

Azure Media Services recommends using one of following live encoders have RTMP as output:
- Adobe Flash Media Live Encoder
- Haivision
- Telestream Wirecast
- Teradek
- TriCaster

Azure Media Services recommends using one of the following live encoders that have multi-bitrate Smooth Streaming as output:
- Ateme
- Cisco
- Elemental
- Envivio
- Imagine Communications
- Media Excel

> [!NOTE]
> A live encoder can also send a single-bitrate stream to a channel that is not enabled for live encoding, but this configuration is not recommended.

# Azure Media Services encoder partners
As an Azure Media Services on-prem encoder partner, Media Services promotes your product by:
- Recommending your encoder to enterprise customers looking for an on-prem live encoder solution
- Add your live encoder to the list of recommended encoders on the [sales marketing page](https://azure.microsoft.com/en-us/services/media-services/)

## How to become an on-prem encoder partner
To become an on-prem encoder partner, you must verify compatibility of your on-prem encoder with Media Services. To do so, complete the following steps:

1. Create an Azure Media Services account
2. Create and start a **pass-through** channel
3. For each of the configuration settings for your on-prem encoder:
    a. Create a published live event
    b. Run your live encoder for approximately 10 minutes
    c. Stop the live event
    d. Record the Asset ID, published streaming URL for the live archive, and the settings used from your live encoder
    e. Reset the channel state after creating each sample
4. Send your recorded settings and live archive parameters to Media Services by emailing amsstreaming@microsoft.com.
5. Upon receipt, Media Services performs verification tests on the samples from your live encoder

Upon successful verification, Media Services can add your encoder to the list of recommendations or marketing materials.