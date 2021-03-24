---
title: Media Services v3 samples  
description: This article contains a list of all the samples available for Media Services v3 organized by method and SDK.  Samples include .NET, Node.JS, Python as well as REST with Postman and CLI. 
services: media-services
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: overview
ms.date: 03/24/2021
ms.author: inhenkel
---
# Media Services v3 samples

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article contains a list of all the samples available for Media Services organized by method and SDK.  Samples include .NET, Node.JS, Python as well as REST with Postman.

## REST Postman collection

The [REST Postman](https://github.com/Azure-Samples/media-services-v3-rest-postman) samples includes a Postman environment and collection for you to import into the Postman client.

## Samples by SDK

You'll find description and links to the samples you may be looking for in each of the tabs.

## [.NET](#tab/net/)

| Folder | Description |
|-------------|-------------|
| [VideoEncoding/EncodingWithMESPredefinedPreset](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/EncodingWithMESPredefinedPreset)|How to submit a job using a built-in preset and an HTTP URL input, publish output asset for streaming, and download results for verification.|
| [VideoEncoding/EncodingWithMESCustomPreset_H264](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/EncodingWithMESCustomPreset_H264)|How to submit a job using a custom H.264 encoding preset and an HTTP URL input, publish output asset for streaming, and download results for verification.|
| [VideoEncoding/EncodingWithMESCustomPreset_HEVC](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/EncodingWithMESCustomPreset_HEVC)|How to submit a job using a custom HEVC encoding preset and an HTTP URL input, publish output asset for streaming, and download results for verification.|
| [VideoEncoding/EncodingWithMESCustomStitchTwoAssets](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/EncodingWithMESCustomStitchTwoAssets)|How to submit a job using the JobInputSequence to stitch together 2 or more assets that may be clipped by start or end time. The resulting encoded file is a single video with all assets stitched together.  The sample will also  publish output asset for streaming and download results for verification.|
| [VideoEncoding/EncodingWithMESCustomPresetAndSprite](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/EncodingWithMESCustomPresetAndSprite)|How to submit a job using a custom preset with a thumbnail sprite and an HTTP URL input, publish output asset for streaming, and download results for verification.|
| [Live/LiveEventWithDVR](/Live/LiveEventWithDVR)|How to create a LiveEvent with a full archive up to 25 hours and an filter on the asset with 5 minutes DVR window. How to use a filter to create a locator for streaming.|
| [VideoAnalytics/VideoAnalyzer](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoAnalytics/VideoAnalyzer)|How to create a video analyzer transform, upload a video file to an input asset, submit a job with the transform and download the results for verification.|
| [AudioAnalytics/AudioAnalyzer](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/AudioAnalytics/AudioAnalyzer)|How to create a audio analyzer transform, upload a media file to an input asset, submit a job with the transform and download the results for verification.|
| [ContentProtection/BasicAESClearKey](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/BasicAESClearKey)|How to create a transform with built-in AdaptiveStreaming preset, submit a job, create a ContentKeyPolicy using a secret key, associate the ContentKeyPolicy with StreamingLocator, get a token and print a url for playback in Azure Media Player. When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content with AES-128 and Azure Media Player uses the token to decrypt.|
| [ContentProtection/BasicWidevine](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/BasicWidevine)|How to create a transform with built-in AdaptiveStreaming preset, submit a job, create a ContentKeyPolicy with Widevine configuration using a secret key, associate the ContentKeyPolicy with StreamingLocator, get a token and print a url for playback in a Widevine Player. When a user requests Widevine-protected content, the player application requests a license from the Media Services license service. If the player application is authorized, the Media Services license service issues a license to the player. A Widevine license contains the decryption key that can be used by the client player to decrypt and stream the content.|
| [ContentProtection/BasicPlayReady](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/BasicPlayReady)|How to create a transform with built-in AdaptiveStreaming preset, submit a job, create a ContentKeyPolicy with PlayReady configuration using a secret key, associate the ContentKeyPolicy with StreamingLocator, get a token and print a url for playback in a Azure Media Player. When a user requests PlayReady-protected content, the player application requests a license from the Media Services license service. If the player application is authorized, the Media Services license service issues a license to the player. A PlayReady license contains the decryption key that can be used by the client player to decrypt and stream the content.|
| [ContentProtection/OfflinePlayReadyAndWidevine](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/OfflinePlayReadyAndWidevine)|How to dynamically encrypt your content with PlayReady and Widevine DRM and play the content without requesting a license from license service. It shows how to create a transform with built-in AdaptiveStreaming preset, submit a job, create a ContentKeyPolicy with open restriction and PlayReady/Widevine persistent configuration, associate the ContentKeyPolicy with a StreamingLocator and print a url for playback.|
| [Streaming/AssetFilters](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/Streaming/AssetFilters)|How to create a transform with built-in AdaptiveStreaming preset, submit a job, create an asset-filter and an account-filter, associate the filters to streaming locators and print urls for playback.|
| [Streaming/StreamHLSAndDASH](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/Streaming/StreamHLSAndDASH)|How to create a transform with built-in AdaptiveStreaming preset, submit a job, publish output asset for HLS and DASH streaming.|
| [HighAvailabilityEncodingStreaming](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/HighAvailabilityEncodingStreaming/) | Guidance and best practices for a production system using on-demand encoding or analytics. Readers should start with the companion article [High Availability with Media Services and VOD](https://docs.microsoft.com/azure/media-services/latest/media-services-high-availability-encoding). There is a separate solution file provided for the [HighAvailabilityEncodingStreaming](/HighAvailabilityEncodingStreaming/Readme.md) sample. |

## [Node.JS](#tab/node/)

|Folder|Description|
|---|---|
|[HelloWorld-ListAssets](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/HelloWorld-ListAssets) |How to connect and list assets |
|[Live](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/Live)| How to do basic live streaming. **WARNING**, make sure to check that all resources are cleaned up and no longer billing in portal when using live.|
|[StreamFilesSample](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/StreamFilesSample)| How to upload a local file or encoding from a source URL, how to use storage SDK to download content, and how to stream to a player. |
|[StreamFilesWithDRMSample](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/StreamFilesWithDRMSample)| How to encode and stream using Widevine and PlayReady DRM |
|[VideoIndexerSample](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/VideoIndexerSample)| How to use the Video and Audio Analyzer presets to generate metadata and insights from a video or audio file. |

## [Python](#tab/python)

Currently, there is one Python sample, [Basic Encoding with Python](https://github.com/Azure-Samples/media-services-v3-python).

---
