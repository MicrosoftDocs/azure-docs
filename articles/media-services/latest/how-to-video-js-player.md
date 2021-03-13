---
title: Use the Video.js player with Azure Media Services
description: This article explains how to use the HTML video object and JavaScript with Azure Media Services
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: how-to
ms.date: 08/31/2020
ms.author: inhenkel
ms.custom: devx-track-js
---

# How to use the Video.js player with Azure Media Services

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

## Overview

Video.js is a web video player built for an HTML5 world. It plays adaptive media formats (such as DASH and HLS) in a browser, without using plugins or Flash. Instead, Video.js uses the open web standards MediaSource Extensions and Encrypted Media Extensions. Moreover, it supports video playback on desktops and mobile devices.

Its official documentation can be found at [https://docs.videojs.com/](https://docs.videojs.com/).

## Sample code
Sample code for this article is available at [Azure-Samples/media-services-3rdparty-player-samples](https://github.com/Azure-Samples/media-services-3rdparty-player-samples).

## Implement the player

1. Create an `index.html` file where you'll host the player. Add the following lines of code (you can replace the versions for newer if applicable):

    ```html
    <html>
      <head>
        <link href="https://vjs.zencdn.net/7.8.2/video-js.css" rel="stylesheet" />
      </head>
      <body>
        <video id="video" class="video-js vjs-default-skin vjs-16-9" controls data-setup="{}">
        </video>

        <script src="https://vjs.zencdn.net/7.8.2/video.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/videojs-contrib-eme@3.7.0/dist/videojs-contrib-eme.min.js"></script>
        <script type="module" src="index.js"></script>
      </body>
    <html>
    ```

2. Add an `index.js` file with the following code:

    ```javascript
    var videoJS = videojs("video");
    videoJS.src({
      src: "manifestUrl",
      type: "protocolType",
    });
    ```

3. Replace `manifestUrl` with the HLS or DASH URL from the streaming locator of your asset which can be found on the streaming locator page in the Azure portal.
    ![streaming locator URLs](media/how-to-shaka-player/streaming-urls.png)

4. Replace `protocolType` with the following options:

    - "application/x-mpegURL" for HLS protocols
    - "application/dash+xml" for DASH protocols

### Set up captions

Run the `addRemoteTextTrack` method, and replace:

- `subtitleKind` with either `"captions"`, `"subtitles"`,`"descriptions"`,  or `"metadata"`  
- `caption` with the .vtt file path (vtt file needs to be in the same host to avoid CORS error)
- `subtitleLang` with the BCP 47 code for language, for example, `"eng"` for English or `"es"` Spanish
- `subtitleLabel` with your desired display name of caption

```javascript
videojs.players.video.addRemoteTextTrack({
  kind: subtitleKind,
  src: caption,
  srclang: subtitleLang,
  label: subtitleLabel
});
```

### Set up token authentication

The token must be set in the authorization field of the request's header. In order to avoid problems with CORS, this token must be set only in those requests with `'keydeliver'` in its URL. The following code lines should do the work:

```javascript
setupTokenForDecrypt (options) {
  if (options.uri.includes('keydeliver')) {
    options.headers = options.headers || {}
    options.headers.Authorization = 'Bearer=' + this.getInputToken()
  }

  return options
}
```

Then, the above function must be attached to the `videojs.Hls.xhr.beforeRequest` event.

```javascript
videojs.Hls.xhr.beforeRequest = setupTokenForDecrypt;
```

### Set up AES-128 encryption

Video.js supports AES-128 encryption without any additional configuration. 

> [!NOTE] 
> There's currently an [issue](https://github.com/videojs/video.js/issues/6717) with encryption and HLS/DASH CMAF content, which are not playable.

### Set up DRM protection

In order to support DRM protection, you must add the [videojs-contrib-eme](https://github.com/videojs/videojs-contrib-eme) official extension. A CDN version works as well.

1. In the `index.js` file detailed above, you must initialize the EME extension by adding `videoJS.eme();` *before* adding the source of the video:

   ```javascript
    videoJS.eme();
   ```

2. Now you can define the URLs of the DRM services, and the URLs of the corresponding licenses as follows:

   ```javascript
   videoJS.src({
       keySystems: {
           "com.microsoft.playready": "YOUR PLAYREADY LICENSE URL",
           "com.widevine.alpha": "YOUR WIDEVINE LICENSE URL",
           "com.apple.fps.1_0": {
            certificateUri: "YOUR FAIRPLAY CERTIFICATE URL",
            licenseUri: "YOUR FAIRPLAY LICENSE URL"
           }
         }
       })

   ```

#### Acquiring the license URL

In order to acquire the license URL, you can:

- Consult your DRM provider configuration
- or, if you are using the sample, consult the `output.json` document generated when you ran the *setup-vod.ps1* PowerShell script for VODs, or the *start-live.ps1* script for live streams. You'll also find the KIDs inside this file.

#### Using tokenized DRM

In order to support tokenized DRM protection, you have to add the following line to the `src` property of the player:

```javascript
videoJS.src({
src: ...,
emeHeaders: {'Authorization': "Bearer=" + "YOUR TOKEN"},
keySystems: {...
```

## Next steps

- [Use the Azure Media Player](../azure-media-player/azure-media-player-overview.md)  
- [Quickstart: Encrypt content](encrypt-content-quickstart.md)
