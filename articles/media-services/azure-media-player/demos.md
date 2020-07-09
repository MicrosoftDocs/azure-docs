---
title: Azure Media Player demos 
description: This page contains a listing of links to demos of the Azure Media Player.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: article
ms.date: 04/24/2020
---


# Azure Media Player demos

The following is a list of links to demos of the Azure Media Player. You can download all of the [Azure Media Player samples](https://github.com/Azure-Samples/azure-media-player-samples) from GitHub.

## Demo listing

| Sample name | Programmatic via JavaScript | Static via HTML5 video element | Description |
| ------------|----------------------------|-------------------------------------|--------------|
| Basic |
| Set Source | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_setsource.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_setsource.html) |Playback unprotected content.|
| Features |
| VOD Ad insertion - VAST | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_vast_ads_vod.html) | N/A | Insert pre- mid- and post- roll VAST ads into a VOD asset. |
| Playback Speed | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_playback_speed.html)| N/A | Enables viewers to control what speed they're watching their video at. |
| AMP Flush Skin | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_flush_skin.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_flush_skin.html) | Enables new AMP skin. **Note:** AMP flush is only supported in AMP versions 2.1.0+ |
| Captions and Subtitles | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_webvtt.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_webvtt.html) | Playback with WebVTT subtitles.
| Live CEA 708 Captions | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_live_captions.html) | N/A | Playback with live CEA 708 inbound captions with the captions left-aligned. |
| Streaming with Progressive Fallback | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_progressiveFallback.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_progressiveFallback.html) | Basic setup of adaptive playback with fallback for progressive if streaming not supported on platform. |
| Progressive Video MP4 | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_progressiveVideo.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_progressiveVideo.html) | Playback of progressive audio MP4. |
| Progressive Audio MP3 | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_progressiveAudio.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_progressiveAudio.html) | Playback of progressive audio MP3. |
| DD+ | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_dolbyDigitalPlus.html) | N/A | Playback of content with DD+ audio. |
| Options |
| Heuristic Profile | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_heuristicsProfile.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_heuristicsProfile.html) | Changing the heuristics profile |
| Localization | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_localization.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_localization.html) |
Setting localization |
| Audio Tracks Menu | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_multiAudio.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_multiAudio.html) |
Options to show how to display audio tracks menu on the default skin. |
| Hotkeys | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_hotKeys.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_hotKeys.html) | This sample shows how to configure which hotkeys are enabled in the player |
| Events, Logging and Diagnostics |
| Register Events | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_registerEvents.html) | N/A | Playback with event listeners. |
| Logging | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_logging.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_logging.html) | Turning on verbose logging to console. |
| Diagnostics | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_diagnostics.html) | N/A | Getting diagnostic data. This sample only works on some techs. |
| AES |
| AES no token | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_aes_notoken.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_aes_notoken.html) | Playback of AES content with no token. |
| AES token | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_aes_token.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_aes_token.html) | Playback of AES content with token. |
| AES HLS proxy simulation | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_aes_token_withHLSProxy.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_aes_token_withHLSProxy.html) | Playback of AES content with token, showing a proxy for HLS so that token can be used with iOS devices. |
| AES token force flash | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_aes_token_forceFlash.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_aes_token_forceFlash.html) | Playback of AES content with token, forcing the flashSS tech. |
| DRM |
| Multi-DRM with PlayReady, Widevine, and FairPlay | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_multiDRM_PlayReadyWidevineFairPlay_notoken.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_multiDRM_PlayReadyWidevineFairPlay_notoken.html) | Playback of DRM content with no token, with PlayReady, Widevine, and FairPlay headers. |
| PlayReady no token | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_playready_notoken.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_playready_notoken.html) | Playback of PlayReady content with no token. |
| PlayReady no token force Silverlight | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_playready_notoken_forceSilverlight.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_playready_notoken_forceSilverlight.html) | Playback of PlayReady content with no token, forcing silverlightSS tech. |
| PlayReady token | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_playready_token.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_playready_token.html) | Playback of PlayReady content with token. |
| PlayReady token force Silverlight | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_playready_token_forceSilverlight.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_playready_token_forceSilverlight.html) | Playback of PlayReady content with token, forcing silverlightSS tech. |
| Protocol and Tech |
| Change techOrder | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_techOrder.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_techOrder.html) | Changing the tech order |
| Force MPEG-DASH only in UrlRewriter | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_forceDash.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_forceDash.html) | Playback of unprotected content only using the DASH protocol. |
| Exclude MPEG-DASH in UrlRewriter | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_forceNoDash.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_forceNoDash.html) | Playback of unprotected content only using the Smooth and HLS protocols. |
| Multiple delivery policy | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_multipleDeliveryPolicy.html) | [Static](https://amp.azure.net/libs/amp/latest/samples/videotag_multipleDeliveryPolicy.html) | Setting the source with content that has multiple delivery policies from Azure Media Services |
| Programatically Select |
| Select text track | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_selectTextTrack.html) | N/A | Selecting a WebVTT track from the track list. |
| Select bitrate | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_selectBitrate.html) | N/A | Selecting a bitrate from the list of bitrates. This sample only works on some techs. |
| Select audio stream | [Dynamic](https://amp.azure.net/libs/amp/latest/samples/dynamic_selectAudioStream.html) | N/A | Selecting an Audio Stream from the list of available audio streams. This sample only works on some techs. |

## Next steps

<!---Some context for the following links goes here--->
- [Azure Media Player Quickstart](azure-media-player-quickstart.md)