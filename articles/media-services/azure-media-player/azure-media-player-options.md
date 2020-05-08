---
title: Azure Media Player Options
description: The Azure Media Player embed code is simply an HTML5 video tag, so for many of the options you can use the standard tag attributes to set the options.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: reference
ms.date: 04/20/2020
---
# Options #

## Setting options ##

The Azure Media Player embed code is simply an HTML5 video tag, so for many of the options you can use the standard tag attributes to set the options.

`<video controls autoplay ...>`

Alternatively, you can use the data-setup attribute to provide options in the [JSON](http://json.org/example.html) format. This is also how you would set options that aren't standard to the video tag.

`<video data-setup='{ "controls": true, "autoplay": false }'...>`

Finally, if you're not using the data-setup attribute to trigger the player setup, you can pass in an object with the player options as the second argument in the JavaScript setup function.

`amp("vid1", { "controls": true, "autoplay": false });`

> [!NOTE]
> Options in the constructor are only set on the first initialization before the source is set.  If you wish to modify the options on the same initialized Azure Media Player element, you must update the options before changing the source. You can update the options in JavaScript by using `myPlayer.options({/*updated options*/});`. Note that only changed options will be affected, all other previously set options will persist.

## Individual options ##

> [!NOTE]
>Video Tag Attributes can only be true or false (boolean), you simply include the attribute (no equals sign) to turn it on, or exclude it to turn it off. For example, to turn controls on:
> WRONG `<video controls="true" ...>`
> RIGHT `<video controls ...>`
> The biggest issue people run into is trying to set these values to false using false as the value (e.g. controls="false") which actually does the opposite and sets the value to true because the attribute is still included.

### controls ###

The controls option sets whether or not the player has controls that the user can interact with. Without controls the only way to start the video playing is with the autoplay attribute or through the API.

`<video controls ...>`
or
`{ "controls": true }`

### autoplay ###

If autoplay is true, the video will start playing as soon as page is loaded (without any interaction from the user).

> [!NOTE]
> This option is not supported by mobile devices such as Windows Phone, Apple iOS and Android. Mobile devices block the autoplay functionality to prevent over usage of consumer's monthly data plans (often expensive). A user touch/click is required to start the video in this case.

`<video autoplay ...>`or `{ "autoplay": true }`

### poster ###
The poster attribute sets the image that displays before the video begins playing. This is often a frame of the video or a custom title screen. As soon as the user clicks play the image will go away.

`<video poster="myPoster.jpg" ...>` or `{ "poster": "myPoster.jpg" }`

### width ###

The width attribute sets the display width of the video.

`<video width="640" ...>` or `{ "width": 640 }`

### height ###

The height attribute sets the display height of the video.

`<video height="480" ...>` or `{ "height": 480 }`

### plugins ###

The plugins JSON determines which plugins get loaded with that instance of AMP lets you configure any options that plugin may have.

   `<video... data-setup='{plugins: { "contentTitle": {"name": "Azure Medi Services Overview"}}}'...>`

For more information on plugin development and usage, see [writing plugins](azure-media-player-writing-plugins.md)

### other options ###

Other options can be set on the `<video>` tag by using the `data-setup` parameter that takes a JSON.
`<video ... data-setup='{"nativeControlsForTouch": false}'>`

#### nativeControlsForTouch ####

This is explicitly set to false. By setting to false, it will allow the Azure Media Player skin to be rendered the same across platforms.  Furthermore, contrary to the name, touch will still be enabled.

### fluid ###

By setting this option to true video element will take full width of the parent container and height will be adjusted to fit a video with a standard 16:9 aspect ratio.

`<video ... data-setup='{"fluid": true}'>`

`fluid` option overrides explicit `width` and `height` settings. This option is only available in Azure Media Player version `2.0.0` and later.

### playbackSpeed ###

`playbackSpeed` option controls playbackSpeed control and set of playback speed settings available for the user. `playbackSpeed` takes an object. In order to enable playback speed control on the control bar, property `enabled` of the object needs to be set to true. An example of enabling playback speed in markup:

`<video ... data-setup='{"playbackSpeed": {"enabled": true}}'>`


Other properties of the `playbackSpeed` setting are given by [PlaybackSpeedOptions](https://docs.microsoft.com/javascript/api/azuremediaplayer/amp.player.playbackspeedoptions) object.

Example of setting playback speed options in JavaScript:

```javascript
    var myPlayer = amp('vid1', {
        fluid: true,
        playbackSpeed: {
            enabled: true,
            initialSpeed: 1.0,
            speedLevels: [
                { name: "x4.0", value: 4.0 },
                { name: "x3.0", value: 3.0 },
                { name: "x2.0", value: 2.0 },
                { name: "x1.75", value: 1.75 },
                { name: "x1.5", value: 1.5 },
                { name: "x1.25", value: 1.25 },
                { name: "normal", value: 1.0 },
                { name: "x0.75", value: 0.75 },
                { name: "x0.5", value: 0.5 },
            ]
        }
    });
```

This option is only available in Azure Media Player version 2.0.0 and later.

### staleDataTimeLimitInSec ###

The `staleDataTimeLimitInSec` option is an optimization that lets you configure how many seconds worth of stale data you'd like to keep in the mediaSource buffers. This is disabled by default.

### cea708CaptionsSettings ###

Setting enabled to true allows you to display live CEA captioning in your live streams and live archives. The label attribute is not required, if not included the player will fall back to a default label.

```javascript
     cea708CaptionsSettings: {
                enabled: true,
                srclang: 'en',
                label: 'Live CC'
            }
```

This option is only available in Azure Media Player version 2.1.1 and later.

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)