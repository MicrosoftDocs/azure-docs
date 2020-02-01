---
title: How to Create a media processor using the Azure Media Services SDK for .NET| Microsoft Docs
description: Learn how to create a media processor component to encode, convert format, encrypt, or decrypt media content for Azure Media Services. Code samples are written in C# and use the Media Services SDK for .NET.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.assetid: dbf9496f-c6f0-42a7-aa36-70f89dcb8ea2
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/18/2019
ms.author: juliako

---
# How to: Get a Media Processor instance
> [!div class="op_single_selector"]
> * [.NET](media-services-get-media-processor.md)
> * [REST](media-services-rest-get-media-processor.md)
> 
> 

## Overview
In Media Services a media processor is a component that handles a specific processing task, such as encoding, format conversion, encrypting, or decrypting media content. You typically create a media processor when you are creating a task to encode, encrypt, or convert the format of media content.

## Azure media processors 

The following topic provides lists of media processors:

* [Encoding media processors](scenarios-and-availability.md#encoding-media-processors)
* [Analytics media processors](scenarios-and-availability.md#analytics-media-processors)

## Get Media Processor

The following method shows how to get a media processor instance. The code example assumes the use of a module-level variable named **_context** to reference the server context as described in the section [How to: Connect to Media Services Programmatically](media-services-use-aad-auth-to-access-ams-api.md).

    private static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
    {
        var processor = _context.MediaProcessors.Where(p => p.Name == mediaProcessorName).
        ToList().OrderBy(p => new Version(p.Version)).LastOrDefault();

        if (processor == null)
        throw new ArgumentException(string.Format("Unknown media processor", mediaProcessorName));

        return processor;
    }


## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Next Steps
Now that you know how to get a media processor instance, go to the [How to Encode an Asset](media-services-dotnet-encode-with-media-encoder-standard.md) topic which will show you how to use the Media Encoder Standard to encode an asset.

