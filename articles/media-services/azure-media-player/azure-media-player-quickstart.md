---
title: Azure Media Player Quickstart
description: Learn the basic steps to set up the Azure Media Player.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: quickstart
ms.date: 04/20/2020
---

# Azure Media Player quickstart
Azure Media Player is easy to set up. It only takes a few minutes to get basic playback of media content from your Azure Media Services account. This section shows you the basic steps without going into details. The sections that follow give you specifics on how to set up and configure Azure Media Player.  Simply add the following includes to your document's `<head>`:

```html
    <link href="//amp.azure.net/libs/amp/latest/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
    <script src= "//amp.azure.net/libs/amp/latest/azuremediaplayer.min.js"></script>
```

> [!IMPORTANT]
> You should **NOT** use the `latest` version in production, as this is subject to change on demand. Replace `latest` with a version of Azure Media Player; for example replace `latest` with `1.0.0`. Azure Media Player versions can be queried from [here](azure-media-player-changelog.md).

## Use the video element

Next, simply use the `<video>` element as you normally would, but with an additional `data-setup` attribute containing any options. These options can include any Azure Media Services option in a valid JSON object.

```html
    <video id="vid1" class="azuremediaplayer amp-default-skin" autoplay controls width="640" height="400" poster="poster.jpg" data-setup='{"nativeControlsForTouch": false}'>
        <source src="http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest" type="application/vnd.ms-sstr+xml" />
        <p class="amp-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video
        </p>
    </video>
```

If you don't want to use auto-setup, you can omit the `data-setup` attribute and initialize a video element manually.

```html
    var myPlayer = amp('vid1', { /* Options */
            "nativeControlsForTouch": false,
            autoplay: false,
            controls: true,
            width: "640",
            height: "400",
            poster: ""
        }, function() {
              console.log('Good to go!');
               // add an event listener
              this.addEventListener('ended', function() {
                console.log('Finished!');
            }
          }
    );
    myPlayer.src([{
        src: "http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest",
        type: "application/vnd.ms-sstr+xml"
    }]);
```

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)