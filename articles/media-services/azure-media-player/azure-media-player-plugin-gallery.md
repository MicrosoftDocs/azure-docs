---
title: Azure Media Player Plugin Gallery
description: This article contains a list of plugins available for Azure Media Player. 
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: overview
ms.date: 04/20/2020
---

# Azure Media Player Plugin Gallery #

## Plugins ##

| Plugin Name                         | Demo URL                    | Source Code                | Description    |
|-------------------------------------|-----------------------------|----------------------------|----------------|
| Additional Features                 | | | |
| **New!** AMP360Video                | [Demo](http://www.babylonjs.com/demos/amp360video/)                        | [GitHub](https://github.com/BabylonJS/Extensions/tree/master/Amp360Video)                     | The plugin lets you visualize 360 video in Amp either on your desktop or in VR compatible devices. The full documentation is available [here](https://doc\.babylonjs\.com/extensions/amp360video): |
|  Sprite Tip                         | [Demo](http://www.skymedia.tv/asset/sprite)                        | [GitHub](https://github.com/RickShahid/SpriteTip)                    | Azure Media Player (AMP) plugin for timeline rendering of a video thumbnail image sprite that is generated from Azure Media Services (AMS) Media Encoder Standard (MES). |
| Diagnostics Overlay                 | [Demo](https://openidconnectweb.azurewebsites.net/Diagnoverlay.html)                        | [GitHub](https://github.com/willzhan/diagnoverlay)                     | This plugin displays: All key parameters, stats of video, all events in the video playback lifecycle, and DRM protection info, such as key ID, license acquisition URLs, if protected.                                                                                                                                                                      |
| Frame rate and Timecode  calculator | No demo available | [GitHub](https://github.com/mconverti/media-services-javascript-azure-media-player-framerate-timecode-calculator-plugin)                     | This plugin calculates the frame rate of video based on the `tfhd`/`trun` MP4 boxes of the first MPEG-DASH video fragment, parses the time scale value from the MPEG-DASH client manifest, and also provides a way to generate the timecode for a given absolute time from the player (as well as provides the player absolute time given the timecode) |
| <strike>Playback Speed</strike>                      | [Demo](https://azure-samples.github.io/media-services-javascript-Azure-Media-Player-playback-rate-plugin/)                        | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-time-tip-plugin)                     | This plugin enables viewers to control what speed of the video. *Note, this functionality is automatically available in version AMP v2.0.0+ but disabled by default.* To learn how to enable it, check out our samples [here](https://github.com/Azure-Samples/azure-media-player-samples) |
| Hover Time Tip                      | [Demo](http://sr-test.azurewebsites.net/Tests/Plugin%20Gallery/plugins/timetip/example.html)                        | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-time-tip-plugin)                     | Displays a time tip over the progress bar on mouse hover for time accurate seeking. *Note: This plugin is already integrated into AMP* but if you're interested in seeing how it's programmed feel free to take a look.                                                                                                                 |
| Title Overlay                       | [Demo](https://azure-samples.github.io/media-services-javascript-azure-media-player-title-overlay-plugin)                        | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-title-overlay-plugin)                     | Overlays configurable video title over screen |
| Timeline Markers                    | [Demo](http://sr-test.azurewebsites.net/Tests/Plugin%20Gallery/plugins/timelinemarkers/example.html)                        | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-timeline-markers-plugin)                     | This plugin takes in an array of times and overlays tiny markers over the progress bar at those times. |
| Analytics                           | | | |
| Application Insights                | [Blog Post](https://azure.microsoft.com/blog/player-analytics-azure-media-player-plugin/)                   | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-application-insights-plugin)                     | Plugin that tracks your player metrics and ports it to Power BI for an intuitive graphical representation of your viewers' player experience. |
| Google Analytics                    | N/A                         | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-google-analytics-plugin)                     | Google Analytics plugin for Azure Media Player |
| Diagnostics                         | | | |
| Diagnostics Output                  | [Demo](http://sr-test.azurewebsites.net/Tests/Plugin%20Gallery/plugins/diagnosticslogger/example.html)                        | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-diagnostic-logger-plugin)                     | This plugin outputs an array of diagnostics from your player, to see it in action go to the demo link and open up your JavaScript console. |
| Ease of Access                      | | | |
| Zoom In                             | [Demo](http://sr-test.azurewebsites.net/Tests/Plugin%20Gallery/plugins/zoom/example.html)                        | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-zoom-plugin)                     | This plugin displays a drag-able  zoom-in scale on the players screen so viewers can zoom in on your content |
| Live Captions                       | [Azure Blog Post](https://azure.microsoft.com/blog/live-real-time-captions-with-azure-media-services-and-player/),[SubPly Post](http://www.subply.com/en/Products/AzureLiveCaptions.htm) | N/A | *See post for more info.* End to End workflow designed for live captioning built plugin for Azure Media Player, click on the left-most link to go to SubPly's site and learn more about the solution |
| Hot Keys                            | <strike>[Demo](http://sr-test.azurewebsites.net/Tests/Plugin%20Gallery/plugins/hotkeys/example.html)</strike>                        | <strike>[GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-hot-keys-plugin)</strike>                     | The hot keys plugin enables viewers to control various aspects of the player with generic plugin combinations like F for fullscreen, M for mute and arrow keys for progress bar control. *Note: This plugin has been already integrated into AMP but feel free to use it as a resource* |
| Social                              | | | |
| Share                               | [Demo](http://sr-test.azurewebsites.net/Tests/Plugin%20Gallery/plugins/share/example.html)                        | [GitHub](https://github.com/Azure-Samples/media-services-javascript-azure-media-player-social-share-plugin)                     | This plugin adds a share button to the player's control bar so that your viewers can share the video they're watching with their friends via Facebook, Twitter, or Linkedin. |

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)
