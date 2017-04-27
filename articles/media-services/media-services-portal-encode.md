---
title: Encode an asset using Media Encoder Standard with the Azure portal | Microsoft Docs
description: This tutorial walks you through the steps of encoding an asset using Media Encoder Standard with the Azure portal.
services: media-services
documentationcenter: ''
author: Juliako
manager: erikre
editor: ''

ms.assetid: 107d9e9a-71e9-43e5-b17c-6e00983aceab
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/24/2016
ms.author: juliako

---
# Encode an asset using Media Encoder Standard with the Azure portal
> [!NOTE]
> To complete this tutorial, you need an Azure account. For details, see [Azure Free Trial](https://azure.microsoft.com/pricing/free-trial/). 
> 
> 

When working with Azure Media Services one of the most common scenarios is delivering adaptive bitrate streaming to your clients. Media Services supports the following adaptive bitrate streaming technologies: HTTP Live Streaming (HLS), Smooth Streaming, MPEG DASH. To prepare your videos for adaptive bitrate streaming, you need to encode your source video into multi-bitrate files. You should use the **Media Encoder Standard** encoder to encode your videos.  

Media Services also provides dynamic packaging which allows you to deliver your multi-bitrate MP4s in the following streaming formats: MPEG DASH, HLS, Smooth Streaming, without you having to re-package into these streaming formats. With dynamic packaging you only need to store and pay for the files in single storage format and Media Services will build and serve the appropriate response based on requests from a client.

To take advantage of dynamic packaging, you need to encode your source file into a set of multi-bitrate MP4 files (the encoding steps are demonstrated later in this section).

To scale media processing, see [this](media-services-portal-scale-media-processing.md) topic.

## Encode with the Azure portal
This section describes the steps you can take to encode your content with Media Encoder Standard.

1. In the [Azure portal](https://portal.azure.com/), select your Azure Media Services account.
2. In the **Settings** window, select **Assets**.  
3. In the **Assets** window, select the asset that you would like to encode.
4. Press the **Encode** button.
5. In the **Encode an asset** window, select the "Media Encoder Standard" processor and a preset. For example, if you know your input video has a resolution of 1920x1080 pixels, then you could use the "H264 Multiple Bitrate 1080p" preset. For more information about presets, see [this](media-services-mes-presets-overview.md) article – it is important to select the preset that is most appropriate for your input video. If you have a low resolution (640x360) video, then you should not be using the default "H264 Multiple Bitrate 1080p" preset.
   
   For easier management, you have an option of editing the name of the output asset, and the name of the job.
   
   ![Encode assets](./media/media-services-portal-vod-get-started/media-services-encode1.png)
6. Press **Create**.

## Next step
You can monitor encoding job progress with the Azure portal, as described in [this](media-services-portal-check-job-progress.md) article.  

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

