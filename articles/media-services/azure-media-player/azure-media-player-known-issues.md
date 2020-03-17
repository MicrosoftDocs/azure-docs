---
title: Azure Media Player Known Issues
description: The current release has the following known issues.
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: reference
ms.date: 03/16/2020
---

# Known Issues #

The current release has the following known issues:

## Azure Media Player ##

- Incorrectly configured encoders may cause issues with playback
- Streams with timestamps greater than 2^53 may have playback issues.
  - Mitigation: Use 90 kHz video and 44.1 kHz audio timescales
- No autoplay on mobile devices without user interaction. This is blocked by the platform.
- Seeking near discontinuities may cause playback failure.
- Download of large presentations may cause UI to lockup.
- Cannot automatically playback same source again after presentation ended.
  - To replay a source after it has ended, it is required to set the source again.
- Empty manifests may cause issues with the player.
  - This issue can occur when starting a live stream and not enough chunks are found in the manifest.
- Playback position maybe outside UI seekbar.
- Event ordering is not consistent across all techs.
- Buffered property is not consistent across techs.
- nativeControlsForTouch must be false (default) to avoid "Object doesn't support property or method 'setControls'"
- Posters must now be absolute urls
- Minor aesthetic issues may occur in the UI when using high contrast mode of the device
- URLs containing "%" or "+" in the fully decoded string may have problems setting the source

## Ad insertion ##

- Ads may have issues being inserted (on demand or live) when an ad-blocker is installed in the browser
- Mobile devices may have issues playing back ads.

## AzureHtml5JS ##

- If in the DVR window of Live content, and content finishes, timeline will continue to grow until seek to the area or reaching the end of the presentation.
- Live presentations in Firefox with MSE enabled has some issues
- Assets that are audio or video only will not play back via the AzureHtml5JS tech.
  - If you'd like to play back assets without audio or video, you can do so by inserting blank audio or video using the [Azure Media Services Explorer tool](https://aka.ms/amse)
    - Instructions on how to insert silent audio can be found [here](https://azure.microsoft.com/documentation/articles/media-services-advanced-encoding-with-mes/#silent_audio)

## Flash ##

- AES content does not playback in Flash version 30.0.0.134 due to a bug in Adobe's caching logic. Adobe has fixed the issue and released it in 30.0.0.154
- Tech and http failures (such as 404 network timeouts), the player will take longer to recover than other techs.
- Click on video area with flashSS tech will not play/pause the player.
- Infinite spinner can occur when player is stuck in the case where end user has Flash installed but does not give permission to load on the site. Player thinks plugin is available (as it is installed) and thinks plugin is running the content as JavaScript code has been sent but the browser settings have blocked plugin from executing until user accepts prompt to allow plugin. This can occur in all browsers.  

## Silverlight ##

- Missing features
- Tech and http failures (such as 404 network timeouts), the player will take longer to recover than other techs.
- Safari and Firefox on Mac playback with Silverlight requires explicitly defining `"http://` or `https://` for the source.
- If an API is missing for this tech, it will generally return null.
- Infinite spinner can occur when player is stuck in the case where end user has Silverlight installed but does not give permission to load on the site. Player thinks plugin is available (as it is installed) and thinks plugin is running the content as JavaScript code has been sent but the browser settings have blocked plugin from executing until user accepts prompt to allow plugin. This can occur in all browsers.  

## Native HTML5 ##

- Html5 tech is only sending canplaythrough event for first set source.
- This tech only supports what the browser has implemented.  Some features may be missing in this tech.  
- If an API is missing for this tech, it will generally return null.
- There are issues with Captions and Subtitles on this tech. They may or may not be available or viewable on this tech.
- Having limited bandwidth in HLS/Html5 tech scenario results in audio playing without video.

### Microsoft ###

- IE8 playback does not currently work due to incompatibility with ECMAScript 5
- In IE and some versions of Edge, fullscreen cannot be entered by tabbing to the button and selecting it or using the F/f hotkey.

## Google ##

- Multiple encoding profiles in the same manifest has some playback issues in Chrome and is not recommended.
- Chrome cannot playback HE-AAC with AzureHtml5JS. Follow details on the [bug tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=534301).
- As of Chrome v58, widevine content must be loaded/played back via the https:// protocol otherwise playback will fail.

## Mozilla ##

- Audio stream switch requires audio streams to have the same codec private data when using AzureHtml5JS. Firefox platform requires this.

## Apple ##

- Safari on Mac often enables Power Saver mode by default with the setting "Stop plug-ins to save power", which blocks plugins like Flash and Silverlight when they believe it is not in favor to the user. This block does not block the plugin's existent, only capabilities. Given the default techOrder, this may cause issues when attempting to playback
  - Mitigation 1: If the video player is 'front and center' (within a 3000 x 3000 pixel boundary starting at the top left corner of the document) it should still play.
  - Mitigation 2: Change the techOrder for Safari to be ["azureHtml5JS", "html5"]. This mitigation has implication of not getting all the features that are available in the FlashSS tech.
- PlayReady content via Silverlight may have issues playing back in Safari.
- AES and restricted token content does not playback using iOS and older Android devices.
  - In order to achieve this scenario, a proxy must be added to your service.
- Default skin for iOS Phone shows through.
- iPhone playback always occurs in the native player fullscreen.
  - Features, including captions, may not persist in this non-inline playback.
- When live presentation ends, iOS devices will not properly end presentation.
- iOS does not allow for DVR capabilities.
- iOS audio stream switch can only be done though iOS native player UI and requires audio streams to have the same codec private data
- Older versions of Safari may potentially have issues playing back live streams.

## Older Android ##

- AES and restricted token content does not playback using iOS and older Android devices.
  - In order to achieve this scenario, a proxy must be added to your service.

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)