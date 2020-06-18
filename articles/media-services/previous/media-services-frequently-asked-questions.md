---
title: Azure Media Services frequently asked questions
description: This article gives answers to the Frequently asked questions about Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---
# Media Services v2 frequently asked questions

This article addresses frequently asked questions raised by the Azure Media Services (AMS) user community.

## General AMS FAQs

Q: How do you stream to Apple iOS devices?

A: add "(format=m3u8-aapl)" path to the "/Manifest" portion of the URL to tell the streaming origin server to return back HLS content for consumption on Apple iOS native devices (for details, see [delivering content](media-services-deliver-content-overview.md)),

Q: How do you scale indexing?

A: The reserved units are the same for Encoding and Indexing tasks. Follow instructions on [How to Scale Encoding Reserved Units](media-services-scale-media-processing-overview.md). **Note** that Indexer performance is not affected by Reserved Unit Type.

Q: I uploaded, encoded, and published a video. What would be the reason the video does not play when I try to stream it?

A: One of the most common reasons is you do not have the streaming endpoint from which you are trying to play back in the **Running** state.  

Q: Can I do compositing on a live stream?

A: Compositing on live streams is currently not offered in Azure Media Services, so you would need to pre-compose on your computer.

Q: Can I use Azure CDN with Live Streaming?

A: Media Services supports integration with Azure CDN (for more information, see [How to Manage Streaming Endpoints in a Media Services Account](media-services-portal-manage-streaming-endpoints.md)).  You can use Live streaming with CDN. Azure Media Services provides Smooth Streaming, HLS and MPEG-DASH outputs. All these formats use HTTP for transferring data and get benefits of HTTP caching. In live streaming actual video/audio data is divided to fragments and this individual fragments get cached in CDN. Only data needs to be refreshed is the manifest data. CDN periodically refreshes manifest data.

Q: Does Azure Media services support storing images?

A: If you are just looking to store JPEG or PNG images, you should keep those in Azure Blob Storage. There is no benefit to putting them in your Media Services account unless you want to keep them associated with your Video or Audio Assets. Or if you might have a need to use the images as overlays in the video encoder.Media Encoder Standard supports overlaying images on top of videos, and that is what it lists JPEG and PNG as supported input formats. For more information, see [Creating Overlays](media-services-advanced-encoding-with-mes.md#overlay).

Q: How can I copy assets from one Media Services account to another?

A: To copy assets from one Media Services account to another using .NET, use [IAsset.Copy](https://github.com/Azure/azure-sdk-for-media-services-extensions/blob/dev/MediaServices.Client.Extensions/IAssetExtensions.cs#L354) extension method available in the [Azure Media Services .NET SDK Extensions](https://github.com/Azure/azure-sdk-for-media-services-extensions/) repository. For more information, see [this](https://social.msdn.microsoft.com/Forums/azure/28912d5d-6733-41c1-b27d-5d5dff2695ca/migrate-media-services-across-subscription?forum=MediaServices) forum thread.

Q: What are the supported characters for naming files when working with AMS?

A: Media Services uses the value of the IAssetFile.Name property when building URLs for the streaming content (for example, http://{AMSAccount}.origin.mediaservices.windows.net/{GUID}/{IAssetFile.Name}/streamingParameters.) For this reason, percent-encoding is not allowed. The value of the **Name** property cannot have any of the following [percent-encoding-reserved characters](https://en.wikipedia.org/wiki/Percent-encoding#Percent-encoding_reserved_characters): !*'();:@&=+$,/?%#[]". Also, there can only be one '.' for the file name extension.

Q: How to connect using REST?

A: For information on how to connect to the AMS API, see [Access the Azure Media Services API with Azure AD authentication](media-services-use-aad-auth-to-access-ams-api.md). 

Q: How can I rotate a video during the encoding process?

A: The [Media Encoder Standard](media-services-dotnet-encode-with-media-encoder-standard.md) supports rotation by angles of 90/180/270. The default behavior is "Auto", where it tries to detect the rotation metadata in the incoming MP4/MOV file and compensate for it. Include the following **Sources** element to one of the json presets defined [here](media-services-mes-presets-overview.md):

    "Version": 1.0,
    "Sources": [
    {
      "Streams": [],
      "Filters": {
        "Rotation": "90"
      }
    }
    ],
    "Codecs": [

    ...


## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]
