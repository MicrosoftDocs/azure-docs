---
title: Create an Azure Media Services Job input from an HTTPS URL | Microsoft Docs
description: This topic shows how to create a job input from an HTTP(s) URL.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 09/24/2018
ms.author: juliako
---

# Create a job input from an HTTPS URL

In Media Services v3, when you submit Jobs to process your videos, you have to tell Media Services where to find the input video. One of the options is to specify an HTTP(s) URL as a job input (as shown in this example). Note that currently, AMS v3 does not support chunked transfer encoding over HTTPS URLs. For a full example, see this [github sample](https://github.com/Azure-Samples/media-services-v3-dotnet-quickstarts/blob/master/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs).

## .NET sample

The following code shows how to create a job with an HTTPS URL input.

[!code-csharp[Main](../../../media-services-v3-dotnet-quickstarts/AMSV3Quickstarts/EncodeAndStreamFiles/Program.cs#SubmitJob)]

## Next steps

[Create a job input from a local file](job-input-from-local-file-how-to.md).
