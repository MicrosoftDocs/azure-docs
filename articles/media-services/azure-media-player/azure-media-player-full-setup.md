---
title: Azure Media Player Full Setup
description: Learn how to set up the Azure Media Player.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: how-to
ms.date: 04/20/2020
---

# Azure Media Player full setup #

Azure Media Player is easy to set up. It only takes a few moments to get basic playback of media content right from your Azure Media Services account. [Samples](https://github.com/Azure-Samples/azure-media-player-samples) are also provided in the samples directory of the release.


## Step 1: Include the JavaScript and CSS files in the head of your page ##

With Azure Media Player, you can access the scripts from the CDN hosted version. It's often recommended now to put JavaScript before the end body tag `<body>` instead of the `<head>`, but Azure Media Player includes an 'HTML5 Shiv', which needs to be in the head for older IE versions to respect the video tag as a valid element.

> [!NOTE]
> If you're already using an HTML5 shiv like [Modernizr](https://modernizr.com/) you can include the Azure Media Player JavaScript anywhere. However make sure your version of Modernizr includes the shiv for video.

### CDN Version ###
    <link href="//amp.azure.net/libs/amp/latest/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
    <script src= "//amp.azure.net/libs/amp/latest/azuremediaplayer.min.js"></script>

> [!IMPORTANT]
> You should **NOT** use the `latest` version in production, as this is subject to change on demand. Replace `latest` with a version of Azure Media Player. For example, replace `latest` with `2.1.1`. Azure Media Player versions can be queried from [here](azure-media-player-changelog.md).

> [!NOTE]
> Since the `1.2.0` release, it is no longer required to include the location to the fallback techs (it will automatically pick up the location from the relative path of the azuremediaplayer.min.js file). You can modify the location of the fallback techs by adding the following script in the `<head>` after the above scripts.

> [!NOTE]
> Due to the nature of Flash and Silverlight plugins, the swf and xap files should be hosted on a domain without any sensitive information or data - this is automatically taken care of for you with the Azure CDN hosted version.

```javascript
    <script>
      amp.options.flashSS.swf = "//amp.azure.net/libs/amp/latest/techs/StrobeMediaPlayback.2.0.swf"
      amp.options.silverlightSS.xap = "//amp.azure.net/libs/amp/latest/techs/SmoothStreamingPlayer.xap"
    </script>
```

## Step 2: Add an HTML5 video tag to your page ##

With Azure Media Player, you can use an HTML5 video tag to embed a video. Azure Media Player will then read the tag and make it work in all browsers, not just ones that support HTML5 video. Beyond the basic markup, Azure Media Player needs a few extra pieces.

1. The `<data-setup>` attribute on the `<video>` tells Azure Media Player to automatically set up the video when the page is ready, and read any (in JSON format) from the attribute.
1. The `id` attribute: Should be used and unique for every video on the same page.
1. The `class` attribute contains two classes:
    - `azuremediaplayer` applies styles that are required for Azure Media Player UI functionality
    - `amp-default-skin` applies the default skin to the HTML5 controls
1. The `<source>` includes two required attributes
    - `src` attribute can include a **.ism/manifest* file from Azure Media Services is added, Azure Media Player automatically adds the URLs for DASH, SMOOTH, and HLS to the player
    - `type` attribute is the required MIME type of the stream. The MIME type associated with *".ism/manifest"* is *"application/vnd.ms-sstr+xml"*
1. The *optional* `<data-setup>` attribute on the `<source>` tells Azure Media Player if there are any unique delivery policies for the stream from Azure Media Services, including, but not limited to, encryption type (AES or PlayReady, Widevine, or FairPlay) and token.

Include/exclude attributes, settings, sources, and tracks exactly as you would for HTML5 video.

```html
    <video id="vid1" class="azuremediaplayer amp-default-skin" autoplay controls width="640" height="400" poster="poster.jpg" data-setup='{"techOrder": ["azureHtml5JS", "flashSS", "html5FairPlayHLS","silverlightSS", "html5"], "nativeControlsForTouch": false}'>
        <source src="http://amssamples.streaming.mediaservices.windows.net/91492735-c523-432b-ba01-faba6c2206a2/AzureMediaServicesPromo.ism/manifest" type="application/vnd.ms-sstr+xml" />
        <p class="amp-no-js">
            To view this video please enable JavaScript, and consider upgrading to a web browser that supports HTML5 video
        </p>
    </video>
```

By default, the large play button is located in the upper left-hand corner so it doesn't cover up the interesting parts of the poster. If you'd prefer to center the large play button, you can add an additional `amp-big-play-centered` `class` to your `<video>` element.

### Alternative Setup for dynamically loaded HTML ###

If your web page or application loads the video tag dynamically (ajax, appendChild, etc.), so that it may not exist when the page loads, you'll want to manually set up the player instead of relying on the data-setup attribute. To do this, first remove the data-setup attribute from the tag so there's no confusion around when the player is initialized. Next, run the following JavaScript some time after the Azure Media Player JavaScript has loaded, and after the video tag has been loaded into the DOM.

```javascript
    var myPlayer = amp('vid1', { /* Options */
            techOrder: ["azureHtml5JS", "flashSS", "html5FairPlayHLS","silverlightSS", "html5"],
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
        src: "http://samplescdn.origin.mediaservices.windows.net/e0e820ec-f6a2-4ea2-afe3-1eed4e06ab2c/AzureMediaServices_Overview.ism/manifest",
        type: "application/vnd.ms-sstr+xml"
    }]);
```

The first argument in the `amp` function is the ID of your video tag. Replace it with your own.

The second argument is an options object. It allows you to set additional options like you can with the data-setup attribute.

The third argument is a 'ready' callback. Once Azure Media Player has initialized, it will call this function. In the ready callback, 'this' object refers to the player instance.

Instead of using an element ID, you can also pass a reference to the element itself.

```javascript

    amp(document.getElementById('example_video_1'), {/*Options*/}, function() {
        //This is functionally the same as the previous example.
    });
    myPlayer.src([{ src: "//example/path/to/myVideo.ism/manifest", type: "application/vnd.ms-sstr+xml"]);
```

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)