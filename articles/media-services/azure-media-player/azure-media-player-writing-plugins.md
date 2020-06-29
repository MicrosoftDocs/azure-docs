---
title: Writing plugins for Azure Media Player 
description: Learn how to write a plugin with Azure Media Player with JavaScript
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: how-to
ms.date: 04/20/2020
---

# Writing plugins for Azure Media Player #

A plugin is JavaScript written to extend or enhance the player. You can write plugins that change Azure Media Player's appearance, its functionality or even have it interface with other services. You can do this in two easy steps:

## Step 1 ##

Write your JavaScript in a function like so:

```javascript

    (function () {
        amp.plugin('yourPluginName', function (options) {
        var myPlayer = this;
           myPlayer.addEventListener(amp.eventName.ready, function () {
        console.log("player is ready!");
            });
        });
    }).call(this);
```

You can write your code  directly in your HTML page within `<script>` tags or in an external JavaScript file. If you do the latter, be sure to include the JavaScript file in the `<head>` of your HTML page *after* the AMP script.

Example:

```javascript
    <!--*****START OF Azure Media Player Scripts*****-->
    <script src="//amp.azure.net/libs/amp/latest/azuremediaplayer.min.js"></script>
    <link href="//amp.azure.net/libs/amp/latest/skins/amp-default/azuremediaplayer.min.css" rel="stylesheet">
    <!--*****END OF Azure Media Player Scripts*****-->
    <!--Add Plugins-->
    <script src="yourPluginName.js"></script>
```

## Step 2 ##
Initialize the plugin with JavaScript in one of two ways:

Method 1:

```javascript
    var myOptions = {
        autoplay: true,
        controls: true,
        width: "640",
        height: "400",
        poster: "",
        plugins: {
            yourPluginName: {
                [your plugin options]: [example options]
           }
        }
    };     
    var myPlayer = amp([videotag id], myOptions);
```

Method 2:

```javascript
    var video = amp([videotag id]);
    video.yourPluginName({[your plugins option]: [example option]});
```

Plugin options are not required, including them just allows the developers using your plugin to configure its behavior without having to change the source code.

For inspiration and more examples on creating a plugin take a look at our [gallery](azure-media-player-plugin-gallery.md)

>[!NOTE]
> Plugin code dynamically changes items in the DOM during the lifetime of the viewer's player experience, it never makes permanent changes to the player's source code. This is where an understanding of your browser's developer tools comes in handy. For example, if you'd like to change the appearance of an element in the player you can find its HTML element by its class name and then add or change attributes from there. Here's a great resource on [changing HTML attributes.](http://www.w3schools.com/js/js_htmldom_html.asp)

### Integrated Plugins ###

 There are currently two plugins baked into AMP: the [time-tip](http://sr-test.azurewebsites.net/Tests/Plugin%20Gallery/plugins/timetip/example.html) and [hotkeys](http://sr-test.azurewebsites.net/Tests/Plugin%20Gallery/plugins/hotkeys/example.html). These plugins were originally developed to be modular plugins for the player but are now included into the player source code.

### Plugin Gallery ###

The [plugin gallery](https://aka.ms/ampplugins) has several plugins that the community has already contributed for features like time-line markers, zoom, analytics and more. The page provides accesses to the plugins and instructions on how to set it up as well as a demo that shows the plugin in action. If you create a cool plugin that you think should be included in our gallery, feel free to submit it so we can check it out.

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)
