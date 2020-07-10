---
title: Azure Media Player feature list
description: A feature reference for Azure Media Player.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: reference
ms.date: 04/20/2020
---

# Feature list #
Here is the list of tested features and unsupported features:

|                                         | TESTED | PARTIALLY TESTED | UNTESTED | UNSUPPORTED | NOTES                                                                                                                |
|:----------------------------------------|--------|------------------|----------|-------------|:---------------------------------------------------------------------------------------------------------------------|
| Playback                                |        |                  |          |             |                                                                                                                      |
| Basic On-Demand Playback                | X      |                  |          |             | Supports streams from Azure Media Services only                                                                      |
| Basic Live Playback                     | X      |                  |          |             | Supports streams from Azure Media Services only                                                                      |
| AES                                     | X      |                  |          |             | Supports Azure Media Services Key Delivery Service                                                                   |
| Multi-DRM                               |        | X                |          |             |                                                                                                                      |
| PlayReady                               | X      |                  |          |             | Supports Azure Media Services Key Delivery Service                                                                   |
| Widevine                                |        | X                |          |             | Supports Widevine PSSH boxes outlined in manifest                                                                    |
| FairPlay                                |        | X                |          |             | Supports Azure Media Services Key Delivery Service                                                                   |
| Techs                                   |        |                  |          |             |                                                                                                                      |
| MSE/EME (AzureHtml5JS)                  | X      |                  |          |             |                                                                                                                      |
| Flash Fallback (FlashSS)                | X      |                  |          |             | Not all features are available on this tech.                                                                         |
| Silverlight Fallback SilverlightSS      | X      |                  |          |             | Not all features are available on this tech.                                                                         |
| Native HLS Pass-through (Html5)         |        | X                |          |             | Not all features are available on this tech due to platform restrictions.                                            |
| Features                                |        |                  |          |             |                                                                                                                      |
| API Support                             | X      |                  |          |             | See known issues list                                                                                                |
| Basic UI                                | X      |                  |          |                                                                                                                                    |
| Initialization through JavaScript       | X      |                  |          |             |                                                                                                                      |
| Initialization through video tag        |        | X                |          |             |                                                                                                                      |
| Segment addressing - Time Based         | X      |                  |          |             |                                                                                                                      |
| Segment addressing - Index Based        |        |                  |          | X           |                                                                                                                      |
| Segment addressing - Byte Based         |        |                  |          | X           |                                                                                                                      |
| Azure Media Services URL rewriter       |        | X                |          |             |                                                                                                                      |
| Accessibility - Captions and Subtitles  |        | X                |          |             |  WebVTT supported for on demand, live CEA 708 partially tested                                                       |
| Accessibility - Hotkeys                 | X      |                  |          |             |                                                                                                                      |
| Accessibility - High Contrast           |        | X                |          |             |                                                                                                                      |
| Accessibility - Tab Focus               |        | X                |          |             |                                                                                                                      |
| Error Messaging                         |        | X                |          |             | Error messages are inconsistent across techs                                                                         |
| Event Triggering                        | X      |                  |          |             |                                                                                                                      |
| Diagnostics                             |        | X                |          |             | Diagnostic information is only available on the AzureHtml5JS tech and partially available on the SilverlightSS tech. |
| Customizable Tech Order                 |        | X                |          |             |                                                                                                                      |
| Heuristics - Basic                      | X      |                  |          |             |                                                                                                                      |
| Heuristics - Customization              |        |                  | X        |             | Customization is only available with the AzureHtml5JS tech.                                                          |
| Discontinuities                         | X      |                  |          |             |                                                                                                                      |
| Select Bitrate                          | X      |                  |          |             | This API is only available on the AzureHtml5JS and FlashSS techs.                                                    |
| Multi-Audio Stream                      |        | X                |          |             | Programmatic audio switch is supported on AzureHtml5JS and FlashSS techs, and is available through UI selection on AzureHtml5JS, FlashSS, and native Html5 (in Safari).  Most platforms require the same codec private data to switch audio streams (same codec, channel, sampling rate, etc.). |
| UI Localization                         |        | X                |          |             |                                                                                                                      |
| Multi-instance Playback                 |        |                  |          | X           | This scenario may work for some techs but is currently unsupported and untested. You may also get this to work using iframes |
| Ads Support                             |        | x                |          |             | AMP supports the insertion of pre- mid- and post-roll linear ads from VAST-compliant ad servers for VOD in the AzureHtml5JS tech |
| Analytics                               |        | X                |          |             | AMP provides the ability to listen to analytics and diagnostic events in order to send to an Analytics backend of your choice.  All events and properties are not available across techs due to platform limitations.                                                                            |
| Custom Skins                            |        |                  | X        |             | Turn setting controls to false in AMP and using your own HTML and CSS.           |
| Seek Bar Scrubbing                      |        |                  |          | X           |                                                                                                                      |
| Trick-Play                              |        |                  |          | X           |                                                                                                                      |
| Audio Only                              |        |                  |          | X           | May work in some techs for Adaptive Streaming but is currently not supported and does not work in AzureHtml5JS. Progressive MP3 playback can work with the HTML5 tech if the platform supports it.                                                                                                        |
| Video Only                              |        |                  |          | X           | May work in some techs for Adaptive Streaming but is currently not supported and does not work in AzureHtml5JS.      |
| Multi-period Presentation               |        |                  |          | X                                                                                                                                  |
| Multiple camera angles                  |        |                  |          | X           |                                                                                                                      |
| Playback Speed                          |        | X                |          |             | Playback speed is supported in most scenarios except the mobile case due to a partial bug in Chrome                 |

## Next steps ##
- [Azure Media Player Quickstart](azure-media-player-quickstart.md)