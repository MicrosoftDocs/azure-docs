---
title: Azure Media Player URL Rewriter
description: Azure Media Player will rewrite a given URL from Azure Media Services to provide streams for SMOOTH, DASH, HLS v3, and HLS v4.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: overview
ms.date: 04/20/2020
---

# URL rewriter #

By default, Azure Media Player will rewrite a given URL from Azure Media Services to provide streams for SMOOTH, DASH, HLS v3, and HLS v4. For example, if the source is given as follows, Azure Media Player will ensure that it attempts to play all of the above protocols:

```html
    <video id="vid1" class="azuremediaplayer amp-default-skin">
        <source src="//example/path/to/myVideo.ism/manifest" type="application/vnd.ms-sstr+xml" />
    </video>
```

However, if you wish to not use the URL rewriter, you can do so by adding the `disableUrlRewriter` property to the parameter. This means all the information that is passed to the sources are directly passed to the player without modification.  Here is an example of adding two sources to the player, on DASH and one SMOOTH Streaming.

```html
    <video id="vid1" class="azuremediaplayer amp-default-skin">
        <source src="//example/path/to/myVideo.ism/manifest(format=mpd-time-csf)" type="application/dash+xml" data-setup='{"disableUrlRewriter": true}'/>
        <source src="//example/path/to/myVideo.ism/manifest" type="application/vnd.ms-sstr+xml" data-setup='{"disableUrlRewriter": true}'/>
    </video>
```

or

```javascript
    myPlayer.src([
        { src: "//example/path/to/myVideo.ism/manifest(format=mpd-time-csf)", type: "application/dash+xml", disableUrlRewriter: true },
        { src: "//example/path/to/myVideo.ism/manifest", type: "application/vnd.ms-sstr+xml", disableUrlRewriter: true }
    ]);
```

Also, if you want, you can specify the specific streaming formats you would like Azure Media Player to rewrite to using the `streamingFormats` parameter. Options include `DASH`, `SMOOTH`, `HLSv3`, `HLSv4`, `HLS`. The difference between HLS and HLSv3 & v4 is that the HLS format supports playback of FairPlay content. v3 and v4 do not support FairPlay. This is useful if you do not have a delivery policy for a particular protocol available.  Here is an example of when a DASH protocol is not enabled with your asset.

```html
    <video id="vid1" class="azuremediaplayer amp-default-skin">
        <source src="//example/path/to/myVideo.ism/manifest" type="application/vnd.ms-sstr+xml" data-setup='{"streamingFormats": ["SMOOTH", "HLS","HLS-V3", "HLS-V4"] }'/>
    </video>
```

or

```javascript
    myPlayer.src([
        { src: "//example/path/to/myVideo.ism/manifest", type: "application/vnd.ms-sstr+xml", streamingFormats: ["SMOOTH", "HLS","HLS-V3", "HLS-V4"]},
    ]);
```

The above two can be used in combination with each other for multiple circumstances based on your particular asset.

> [!NOTE]
> Widevine protection information only persists on the DASH protocol.

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)