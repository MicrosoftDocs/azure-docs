---
title: Azure Media Player Playback Technology
description: Learn more about the playback technology used to play the video or audio. 
author: IngridAtMicrosoft
ms.author: inhenkel
ms.service: media-services
ms.topic: overview
ms.date: 04/20/2020
---

# Playback technology ("tech") #

Playback Technology refers to the specific browser or plugin technology used to play the video or audio.

- **azureHtml5JS**: utilizes MSE and EME standards in conjunction with the video element for plugin-less based playback of DASH content with support for AES-128 bit envelope encrypted content or DRM common encrypted content (via PlayReady and Widevine when the browser supports it) from Azure Media Services
- **flashSS**: utilizes flash player technology to play back Smooth content with support for AES-128 bit envelope decryption from Azure Media Services - requires Flash version of 11.4 or higher
- **html5FairPlayHLS**: utilizes Safari specific in browser-based playback technology via HLS with the video element. This tech is requires to play back FairPlay protected content from Azure Media Services and was added to the techOrder as of 10/19/16
- **silverlightSS**: utilizes silverlight technology to play back Smooth content with support for PlayReady protected content from Azure Media Services.
- **html5**: utilizes in browser-based playback technology with the video element.  When on an Apple iOS or Android device, this tech allows playback of HLS streams with some basic support for AES-128 bit envelope encryption or DRM content (via FairPlay when the browser supports it).

## Tech Order ##

In order to ensure that your asset is playable on a wide variety of devices, the following tech order is recommended and is the default if: `techOrder: ["azureHtml5JS", "flashSS", "html5FairPlayHLS","silverlightSS", "html5"]` and can be set directly on the `<video>` or programatically in the options:

`<video data-setup='{"techOrder": ["azureHtml5JS", "flashSS", "html5FairPlayHLS, "silverlightSS", "html5"]}`

or

```javascript
    amp("vid1", {
          techOrder: ["azureHtml5JS", "flashSS", "html5FairPlayHLS, "silverlightSS", "html5"]
    });
```

## Compatibility Matrix ##

Given the recommended tech order with streaming content from Azure Media Services, the following compatibility playback matrix is expected

| Browser        | OS                                                       | Expected Tech (Clear)  | Expected Tech (AES)  | Expected Tech (DRM)          |
|----------------|----------------------------------------------------------|------------------------|----------------------|------------------------------|
| EdgeIE 11      | Windows 10, Windows 8.1, Windows Phone 101               | azureHtml5JS           | azureHtml5JS         | azureHtml5JS (PlayReady)     |
| IE 11IE 9-101  | Windows 7, Windows Vista<sup>1</sup>                     | flashSS                | flashSS              | silverlightSS (PlayReady)    |
| IE 11          | Windows Phone 8.1                                        | azureHtml5JS           | azureHtml5JS         | not supported                |
| Edge           | Xbox One<sup>1</sup> (Nov 2015 update)                   | azureHtml5JS           | azureHtml5JS         | not supported                |
| Chrome 37+     | Windows 10, Windows 8.1, macOS X Yosemite<sup>1</sup>   | azureHtml5JS           | azureHtml5JS         | azureHtml5JS (Widevine)      |
| Firefox 47+    | Windows 10, Windows 8.1, macOS X Yosemite+<sup>1</sup>  | azureHtml5JS           | azureHtml5JS         | azureHtml5JS (Widevine)      |
| Firefox 42-46  | Windows 10, Windows 8.1, macOS X Yosemite+<sup>1</sup>  | azureHtml5JS           | azureHtml5JS         | silverlightSS (PlayReady)    |
| Firefox 35-41  | Windows 10, Windows 8.1                                  | flashSS                | flashSS              | silverlightSS (PlayReady)    |
| Safari         | iOS 6+                                                   | html5                  | html5 (no token)3    | not supported                |
| Safari 8+      | OS X Yosemite+                                           | azureHtml5JS           | azureHtml5JS         | html5FairPlayHLS (FairPlay)  |
| Safari 6       | OS X Mountain Lion<sup>1</sup>                           | flashSS                | flashSS              | silverlightSS (PlayReady)    |
| Chrome 37+     | Android 4.4.4+<sup>2</sup>                               | azureHtml5JS           | azureHtml5JS         | azureHtml5JS (Widevine)      |
| Chrome 37+     | Android 4.02                                             | html5                  | html5 (no token)<sup>3</sup>    | not supported                |
| Firefox 42+    | Android 5.0+<sup>2</sup>                                 | azureHtml5JS           | azureHtml5JS         | not supported                |
| IE 8           | Windows                                                  | not supported          | not supported        | not supported                |

<sup>1</sup> Configuration not supported or tested; listed as reference for completion.

<sup>2</sup> Successful playback on Android devices requires a combination of device capabilities, graphics support, codec rendering, OS support and more. Since Android is an open-source platform that allows phone manufacturers to change the Vanilla Android OS provided by Google, this cause some fragmentation in the Android space, and some devices may not be supported because of lack of features. Also, some Android devices do not have support for all codecs.  

<sup>3</sup> In the cases where there is no support for token, a proxy can be used to add this functionality. Check out this [blog](https://azure.microsoft.com/blog/2015/03/06/how-to-make-token-authorized-aes-encrypted-hls-stream-working-in-safari/) to learn more about this solution.

> [!NOTE]
> If the expected tech chosen requires a plugin be installed, like Flash, and that is not installed on the user's machine, AMP will continue to check the capabilities of the next tech, in conjunction with source types and protection info, in the tech list. For example, if attempting to view an unprotected on-demand stream in Safari 8 on OS X Yosemite, and both Flash and Silverlight are not installed, AMP will select the native Html5 tech for playback.<br/><br/>New browser technologies are emerging daily, and as such could affect this matrix.

## Next steps ##

- [Azure Media Player Quickstart](azure-media-player-quickstart.md)