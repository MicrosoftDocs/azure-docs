---
title: Task Presets for Media Encoder Standard (MES) | Microsoft Docs
description: The topic gives and overview of the service-defined sample presets for Media Encoder Standard (MES).
author: Juliako
manager: femila
editor: johndeu
services: media-services
documentationcenter: ''

ms.assetid: f243ed1c-ac9c-4300-a5f7-f092cf9853b9
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/19/2019
ms.author: juliako

---

# Sample Presets for Media Encoder Standard (MES)

**Media Encoder Standard** defines a set of pre-defined system encoding presets you can use when creating encoding jobs. It is recommended to use the "Adaptive Streaming" preset if you want to encode a video for streaming with Media Services. When you specify this preset, Media Encoder Standard will [auto-generate a bitrate ladder](media-services-autogen-bitrate-ladder-with-mes.md). 

### Creating Custom Presets from Samples
Media Services fully supports customizing all values in presets to meet your specific encoding needs and requirements. If you need to customize an encoding preset, you should start with one of the below system presets that are provided in this section as a template for your custom configuration. For explanations of what each element in these presets means, and the valid values for each element, see the [Media Encoder Standard schema](media-services-mes-schema.md) topic.  
  
> [!NOTE]
>  When using a preset for 4k encodes, you should get the `S3` reserved unit type. For more information, see [How to Scale Encoding](https://azure.microsoft.com/documentation/articles/media-services-portal-encoding-units).  

#### Video Rotation Default Setting in Presets:
When working with Media Encoder Standard, video rotation is enabled by default. If your video has been recorded on a mobile device in Portrait mode, then these presets will rotate them to Landscape mode prior to encoding.
 
## Available presets: 

 [H264 Multiple Bitrate 1080p Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-1080p-Audio-5.1.md) produces a set of 8 GOP-aligned MP4 files, ranging from 6000 kbps to 400 kbps, and AAC 5.1 audio.  
  
 [H264 Multiple Bitrate 1080p](media-services-mes-preset-H264-Multiple-Bitrate-1080p.md) produces a set of 8 GOP-aligned MP4 files, ranging from 6000 kbps to 400 kbps, and stereo AAC audio.  
  
 [H264 Multiple Bitrate 16x9 for iOS](media-services-mes-preset-H264-Multiple-Bitrate-16x9-for-iOS.md) produces a set of 8 GOP-aligned MP4 files, ranging from 8500 kbps to 200 kbps, and stereo AAC audio.  
  
 [H264 Multiple Bitrate 16x9 SD Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-16x9-SD-Audio-5.1.md) produces a set of 5 GOP-aligned MP4 files, ranging from 1900 kbps to 400 kbps, and AAC 5.1 audio.  
  
 [H264 Multiple Bitrate 16x9 SD](media-services-mes-preset-H264-Multiple-Bitrate-16x9-SD.md) produces a set of 5 GOP-aligned MP4 files, ranging from 1900 kbps to 400 kbps, and stereo AAC audio.  
  
 [H264 Multiple Bitrate 4K Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-4K-Audio-5.1.md) produces a set of 12 GOP-aligned MP4 files, ranging from 20000 kbps to 1000 kbps, and AAC 5.1 audio.  
  
 [H264 Multiple Bitrate 4K](media-services-mes-preset-H264-Multiple-Bitrate-4K.md) produces a set of 12 GOP-aligned MP4 files, ranging from 20000 kbps to 1000 kbps, and stereo AAC audio.  
  
 [H264 Multiple Bitrate 4x3 for iOS](media-services-mes-preset-H264-Multiple-Bitrate-4x3-for-iOS.md) produces a set of 8 GOP-aligned MP4 files, ranging from 8500 kbps to 200 kbps, and stereo AAC audio.  
  
 [H264 Multiple Bitrate 4x3 SD Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-4x3-SD-Audio-5.1.md) produces a set of 5 GOP-aligned MP4 files, ranging from 1600 kbps to 400 kbps, and AAC 5.1 audio.  
  
 [H264 Multiple Bitrate 4x3 SD](media-services-mes-preset-H264-Multiple-Bitrate-4x3-SD.md) produces a set of 5 GOP-aligned MP4 files, ranging from 1600 kbps to 400 kbps, and stereo AAC audio.  
  
 [H264 Multiple Bitrate 720p Audio 5.1](media-services-mes-preset-H264-Multiple-Bitrate-720p-Audio-5.1.md) produces a set of 6 GOP-aligned MP4 files, ranging from 3400 kbps to 400 kbps, and AAC 5.1 audio.  
  
 [H264 Multiple Bitrate 720p](media-services-mes-preset-H264-Multiple-Bitrate-720p.md) produces a set of 6 GOP-aligned MP4 files, ranging from 3400 kbps to 400 kbps, and stereo AAC audio.  
  
 [H264 Single Bitrate 1080p Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-1080p-Audio-5.1.md) produces a single MP4 file with a bitrate of 6750 kbps, and AAC 5.1 audio.  
  
 [H264 Single Bitrate 1080p](media-services-mes-preset-H264-Single-Bitrate-1080p.md) produces a single MP4 file with a bitrate of 6750 kbps, and stereo AAC audio.  
  
 [H264 Single Bitrate 4K Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-4K-Audio-5.1.md) produces a single MP4 file with a bitrate of 18000 kbps, and AAC 5.1 audio.  
  
 [H264 Single Bitrate 4K](media-services-mes-preset-H264-Single-Bitrate-4K.md) produces a single MP4 file with a bitrate of 18000 kbps, and stereo AAC audio.  
  
 [H264 Single Bitrate 4x3 SD Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-4x3-SD-Audio-5.1.md) produces a single MP4 file with a bitrate of 1800 kbps, and AAC 5.1 audio.  
  
 [H264 Single Bitrate 4x3 SD](media-services-mes-preset-H264-Single-Bitrate-4x3-SD.md) produces a single MP4 file with a bitrate of 1800 kbps, and stereo AAC audio.  
  
 [H264 Single Bitrate 16x9 SD Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-16x9-SD-Audio-5.1.md) produces a single MP4 file with a bitrate of 2200 kbps, and AAC 5.1 audio.  
  
 [H264 Single Bitrate 16x9 SD](media-services-mes-preset-H264-Single-Bitrate-16x9-SD.md) produces a single MP4 file with a bitrate of 2200 kbps, and stereo AAC audio.  
  
 [H264 Single Bitrate 720p Audio 5.1](media-services-mes-preset-H264-Single-Bitrate-720p-Audio-5.1.md) produces a single MP4 file with a bitrate of 4500 kbps, and AAC 5.1 audio.  
  
 [H264 Single Bitrate 720p for Android](media-services-mes-preset-H264-Single-Bitrate-720p-for-Android.md) preset produces a single MP4 file with a bitrate of 2000 kbps, and stereo AAC.  
  
 [H264 Single Bitrate 720p](media-services-mes-preset-H264-Single-Bitrate-720p.md) produces a single MP4 file with a bitrate of 4500 kbps, and stereo AAC audio.  
  
 [H264 Single Bitrate High Quality SD for Android](media-services-mes-preset-H264-Single-Bitrate-High-Quality-SD-for-Android.md) produces a single MP4 file with a bitrate of 500 kbps, and stereo AAC audio..  
  
 [H264 Single Bitrate Low Quality SD for Android](media-services-mes-preset-H264-Single-Bitrate-Low-Quality-SD-for-Android.md) produces a single MP4 file with a bitrate of 56 kbps, and stereo AAC audio.  
  
 For more information related to Media Services encoders, see [Encoding On-Demand with Azure Media Services](https://azure.microsoft.com/documentation/articles/media-services-encode-asset/).
