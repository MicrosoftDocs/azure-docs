---
title: Media players for Media Services overview
description: Which media players can I use with Azure Media Services? Azure Media Player, Shaka, and Video.js so far.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: overview
ms.date: 3/08/2021
---

# Media players for Media Services

You can use several media players with Media Services.

## Azure Media Player

Azure Media Player is a video player for a wide variety of browsers and devices. Azure Media Player uses industry standards, such as HTML5, Media Source Extensions (MSE), and Encrypted Media Extensions (EME) to provide an enriched adaptive streaming experience. When these standards aren't available on a device or in a browser, Azure Media Player uses Flash and Silverlight as fallback technology. Whatever of the playback technology used, developers have a unified JavaScript interface to access APIs. Content served by Azure Media Services can be played across a wide range of devices and browsers without any extra effort.

See the [Azure Media Player documentation](https://docs.microsoft.com/azure/media-services/azure-media-player/azure-media-player-overview).

## Shaka

Shaka Player is an open-source JavaScript library for adaptive media. It plays adaptive media formats (such as DASH and HLS) in a browser, without using plugins or Flash. Instead, the Shaka Player uses the open web standards Media Source Extensions and Encrypted Media Extensions.

See [How to use the Shaka player with Azure Media Services](how-to-shaka-player.md).

## Video.js

Video.js is a video player that plays adaptive media formats (such as DASH and HLS) in a browser. Video.js uses the open web standards MediaSource Extensions and Encrypted Media Extensions. It supports video playback on desktops and mobile devices. Its official documentation can be found at https://docs.videojs.com/.

See [How to use the Video.js player with Azure Media Services](how-to-video-js-player.md).


## Next steps ##

- [Azure Media Player Quickstart](../azure-media-player/azure-media-player-quickstart.md)
