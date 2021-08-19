---
title: Media Services v3 samples  
description: This article contains a list of all the samples available for Media Services v3 organized by method and SDK.  Samples include .NET, Node.JS, Python and Java as well as REST with Postman.
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

This article contains a list of all the samples available for Media Services organized by method and SDK.  Samples include .NET, Node.JS (Typescript), Python and Java as well as REST with Postman.

## Samples by SDK

You'll find description and links to the samples you may be looking for in each of the tabs.

## [.NET](#tab/net/)

| Sample | Description |
|-------------|-------------|
| [Account/CreateAccount](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/Account/CreateAccount)|The sample shows how to create a Media Services account and set the primary storage account, in addition to advanced configuration settings including Key Delivery IP allowlist, Managed Identity, storage auth, and bring your own encryption key.|
| [VideoEncoding/Encoding_PredefinedPreset](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/Encoding_PredefinedPreset)|The sample shows how to submit a job using a built-in preset and an HTTP URL input, publish output asset for streaming, and download results for verification.|
| [VideoEncoding/Encoding_H264](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/Encoding_H264)|The sample shows how to submit a job using a custom H.264 encoding preset and an HTTP URL input, publish output asset for streaming, and download results for verification.|
| [VideoEncoding/Encoding_HEVC](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/Encoding_HEVC)|The sample shows how to submit a job using a custom HEVC encoding preset and an HTTP URL input, publish output asset for streaming, and download results for verification.|
| [VideoEncoding/Encoding_StitchTwoAssets](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/Encoding_StitchTwoAssets)|The sample shows how to submit a job using the JobInputSequence to stitch together 2 or more assets that may be clipped by start or end time. The resulting encoded file is a single video with all assets stitched together.  The sample will also  publish output asset for streaming and download results for verification.|
| [VideoEncoding/Encoding_SpriteThumbnail](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoEncoding/Encoding_SpriteThumbnail)|The sample shows how to submit a job using a custom preset with a thumbnail sprite and an HTTP URL input, publish output asset for streaming, and download results for verification.|
| [Live/LiveEventWithDVR](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/Live/LiveEventWithDVR)|This sample first shows how to create a LiveEvent with a full archive up to 25 hours and an filter on the asset with 5 minutes DVR window, then it shows how to use the filter to create a locator for streaming.|
| [VideoAnalytics/VideoAnalyzer](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/VideoAnalytics/VideoAnalyzer)|This sample illustrates how to create a video analyzer transform, upload a video file to an input asset, submit a job with the transform and download the results for verification.|
| [AudioAnalytics/AudioAnalyzer](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/AudioAnalytics/AudioAnalyzer)|This sample illustrates how to create a audio analyzer transform, upload a media file to an input asset, submit a job with the transform and download the results for verification.|
| [ContentProtection/BasicAESClearKey](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/BasicAESClearKey)|This sample demonstrates how to create a transform with built-in AdaptiveStreaming preset, submit a job, create a ContentKeyPolicy using a secret key, associate the ContentKeyPolicy with StreamingLocator, get a token and print a url for playback in Azure Media Player. When a stream is requested by a player, Media Services uses the specified key to dynamically encrypt your content with AES-128 and Azure Media Player uses the token to decrypt.|
| [ContentProtection/BasicWidevine](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/BasicWidevine)|This sample demonstrates how to create a transform with built-in AdaptiveStreaming preset, submit a job, create a ContentKeyPolicy with Widevine configuration using a secret key, associate the ContentKeyPolicy with StreamingLocator, get a token and print a url for playback in a Widevine Player. When a user requests Widevine-protected content, the player application requests a license from the Media Services license service. If the player application is authorized, the Media Services license service issues a license to the player. A Widevine license contains the decryption key that can be used by the client player to decrypt and stream the content.|
| [ContentProtection/BasicPlayReady](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/BasicPlayReady)|This sample demonstrates how to create a transform with built-in AdaptiveStreaming preset, submit a job, create a ContentKeyPolicy with PlayReady configuration using a secret key, associate the ContentKeyPolicy with StreamingLocator, get a token and print a url for playback in a Azure Media Player. When a user requests PlayReady-protected content, the player application requests a license from the Media Services license service. If the player application is authorized, the Media Services license service issues a license to the player. A PlayReady license contains the decryption key that can be used by the client player to decrypt and stream the content.|
| [ContentProtection/OfflinePlayReadyAndWidevine](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/ContentProtection/OfflinePlayReadyAndWidevine)|This sample demonstrates how to dynamically encrypt your content with PlayReady and Widevine DRM and play the content without requesting a license from license service. It shows how to create a transform with built-in AdaptiveStreaming preset, submit a job, create a ContentKeyPolicy with open restriction and PlayReady/Widevine persistent configuration, associate the ContentKeyPolicy with a StreamingLocator and print a url for playback.|
| [Streaming/AssetFilters](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/Streaming/AssetFilters)|This sample demonstrates how to create a transform with built-in AdaptiveStreaming preset, submit a job, create an asset-filter and an account-filter, associate the filters to streaming locators and print urls for playback.|
| [Streaming/StreamHLSAndDASH](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/Streaming/StreamHLSAndDASH)|This sample demonstrates how to create a transform with built-in AdaptiveStreaming preset, submit a job, publish output asset for HLS and DASH streaming.|
| [HighAvailabilityEncodingStreaming](https://github.com/Azure-Samples/media-services-v3-dotnet/tree/main/HighAvailabilityEncodingStreaming/) | This sample provides guidance and best practices for a production system using on-demand encoding or analytics. Readers should start with the companion article [High Availability with Media Services and VOD](architecture-high-availability-encoding-concept.md). There is a separate solution file provided for the [HighAvailabilityEncodingStreaming](https://github.com/Azure-Samples/media-services-v3-dotnet/blob/main/HighAvailabilityEncodingStreaming/README.md) sample. |

## [Node.JS](#tab/node/)

|Sample|Description|
|---|---|
|[Hello World - list assets](https://github.com/Azure-Samples/media-services-v3-node-tutorials/blob/main/AMSv3Samples/HelloWorld-ListAssets/list-assets.ts)|Basic example on how to connect and list assets |
|[Live streaming](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/Live/index.ts)| Basic live streaming example. **WARNING**, make sure to check that all resources are cleaned up and no longer billing in portal when using live|
|[Upload and stream HLS and DASH](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/StreamFilesSample/index.ts)| Basic example for uploading a local file or encoding from a source URL. Sample shows how to use storage SDK to download content, and shows how to stream to a player |
|[Upload and stream HLS and DASH with PlayReady and Widevine DRM](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/StreamFilesWithDRMSample/index.ts)| Demonstrates how to encode and stream using Widevine and PlayReady DRM |
|[Upload and use AI to index videos and audio](https://github.com/Azure-Samples/media-services-v3-node-tutorials/tree/main/AMSv3Samples/VideoIndexerSample/index.ts)| Example of using the Video and Audio Analyzer presets to generate metadata and insights from a video or audio file |

## [Python](#tab/python)

|Sample|Description|
|---|---|
|[Basic Encoding with Python](https://github.com/Azure-Samples/media-services-v3-python)| Basic example for uploading a local file or encoding from a source URL. Sample shows how to use storage SDK to download content, and shows how to stream to a player |
|[Face Redaction using events and functions](https://github.com/Azure-Samples/media-services-v3-python/tree/main/VideoAnalytics/FaceRedactorEventBased)| This is an example of an event-based approach that triggers an Azure Media Services Face Redactor job on a video as soon as it lands on an Azure Storage Account. It leverages Azure Media Services, Azure Function, Event Grid and Azure Storage for the solution. For the full description of the solution, see the [README.md](https://github.com/Azure-Samples/media-services-v3-python/blob/main/VideoAnalytics/FaceRedactorEventBased/README.md)|


## [Java](#tab/java)

|Sample|Description|
|---|---|
|[AudioAnalytics/AudioAnalyzer/](https://github.com/Azure-Samples/media-services-v3-java/tree/master/AudioAnalytics/AudioAnalyzer)|How to analyze audio in a media file. |
|Content Protection|
|ContentProtection||
|[BasicAESClearKey](https://github.com/Azure-Samples/media-services-v3-java/tree/master/ContentProtection/BasicAESClearKey)|How to dynamically encrypt your content with AES-128.|
|[BasicPlayReady](https://github.com/Azure-Samples/media-services-v3-java/tree/master/ContentProtection/BasicPlayReady)|How to dynamically encrypt your content with PlayReady DRM.|
|[BasicWidevine](https://github.com/Azure-Samples/media-services-v3-java/tree/master/ContentProtection/BasicWidevine)|How to dynamically encrypt your content with Widevine DRM.|
|[OfflineFairPlay](https://github.com/Azure-Samples/media-services-v3-java/tree/master/ContentProtection/OfflineFairPlay)|How to dynamically encrypt your content with FairPlay DRM and play the content without requesting a license from license service.|
|[OfflinePlayReadyAndWidevine](https://github.com/Azure-Samples/media-services-v3-java/tree/master/ContentProtection/OfflinePlayReadyAndWidevine)|How to dynamically encrypt your content with PlayReady and Widevine DRM and play the content without requesting a license from license service.|
|DynamicPackagingVODContent||
|[AssetFilters](https://github.com/Azure-Samples/media-services-v3-java/tree/master/DynamicPackagingVODContent/AssetFilters)|How to filter content using asset and account filters.|
|[StreamHLSAndDASH](https://github.com/Azure-Samples/media-services-v3-java/tree/master/DynamicPackagingVODContent/StreamHLSAndDASH)|How to dynamically package VOD content into HLS/DASH for streaming.|
|[LiveIngest/LiveEventWithDVR](https://github.com/Azure-Samples/media-services-v3-java/tree/master/LiveIngest/LiveEventWithDVR)|How to create a Live Event with a full archive up to 25 hours and a filter on the asset with 5 minutes DVR window and how to create a locator for streaming and use the filter.|
|[VideoAnalytics/VideoAnalyzer](https://github.com/Azure-Samples/media-services-v3-java/tree/master/VideoAnalytics/VideoAnalyzer)|How to create a Live Event with a full archive up to 25 hours and a filter on the asset with 5 minutes DVR window and how to create a locator for streaming and use the filter.|
|VideoEncoding||
|[EncodingWithMESCustomPreset](https://github.com/Azure-Samples/media-services-v3-java/tree/master/VideoEncoding/EncodingWithMESCustomPreset)|How to create a custom encoding Transform using the StandardEncoderPreset settings.|
|[EncodingWithMESPredefinedPreset](https://github.com/Azure-Samples/media-services-v3-java/tree/master/VideoEncoding/EncodingWithMESPredefinedPreset)|How to submit a job using a built-in preset and an HTTP URL input, publish output asset for streaming, and download results for verification.|

---

## REST Postman collection

The [REST Postman](https://github.com/Azure-Samples/media-services-v3-rest-postman) samples includes a Postman environment and collection for you to import into the Postman client. The Postman collection samples are recommended for getting familiar with the API structure and how it works with Azure Resource Management (ARM), as well as the structure of calls from the client SDKs. 

[!INCLUDE [warning-rest-api-retry-policy.md](./includes/warning-rest-api-retry-policy.md)]
