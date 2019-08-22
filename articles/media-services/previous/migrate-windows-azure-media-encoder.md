---
title: Migrate from Windows Azure Media Encoder to Media Encoder Standard | Microsoft Docs
description: This topic discusses how to migrate from Azure Media Encoder to Media Encoder Standard.
services: media-services
documentationcenter: ''
author: juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/21/2019
ms.author: juliako

---
# Migrate from Windows Azure Media Encoder to Media Encoder Standard

> [!IMPORTANT]
> This article discusses the steps for migrating from the legacy Windows Azure Media Encoder media processor, which is being retired on Nov 30, 2019.

At the launch of Azure Media Services in June 2012, in order to encode source video files for delivery via streaming or other means, customers had access to a component called the Windows Azure Media Encoder (WAME) media processor. This component was last updated in 2014. Since then, there have been steady improvements to the encoding features of Azure Media Services. The Media Encoder Standard (MES) and Premium Workflow (MEPW) encoder capabilities provide significant improvements in terms of capability, robustness, reliability, price, and performance. Older applications that were built on top of WAME have been at a significant disadvantage. As a result, we are retiring the legacy component, WAME, on October 15, 2019. You will need to migrate your code to use the Media Encoder Standard (MES) component.   

When encoding files with WAME, customers typically used a named preset string such as *H264 Adaptive Bitrate MP4 Set 1080p*. In order to migrate, your code needs to be updated to use the **Media Encoder Standard** media processor instead of WAME, and one of the equivalent system presets like *H264 Multiple Bitrate 1080p*. 

## Migrating to Media Encoder Standard

Here is a typical C# code sample that uses the legacy component. 

```csharp
// Declare a new job. 
IJob job = _context.Jobs.Create("WAME Job"); 
// Get a media processor reference, and pass to it the name of the  
// processor to use for the specific task. 
IMediaProcessor processor = GetLatestMediaProcessorByName("Windows Azure Media Encoder"); 

// Create a task with the encoding details, using a string preset. 
// In this case " H264 Adaptive Bitrate MP4 Set 1080p" preset is used. 
ITask task = job.Tasks.AddNew("My encoding task", 
    processor, 
    "H264 Adaptive Bitrate MP4 Set 1080p", 
    TaskOptions.None); 
```

Here is the updated version 

```csharp
// Declare a new job. 
IJob job = _context.Jobs.Create("Media Encoder Standard Job"); 
// Get a media processor reference, and pass to it the name of the  
// processor to use for the specific task. 
IMediaProcessor processor = GetLatestMediaProcessorByName("Media Encoder Standard"); 

// Create a task with the encoding details, using a string preset. 
// In this case " H264 Multiple Bitrate 1080p" preset is used. 
ITask task = job.Tasks.AddNew("My encoding task", 
    processor, 
    "H264 Multiple Bitrate 1080p", 
    TaskOptions.None); 
```

### Advanced scenarios 

If you had created your own encoding preset for WAME using its schema, there is an equivalent schema for MES [documented here](media-services-mes-schema.md). If you have questions on how to map the older settings to the new encoder, please reach out to us via mailto:amshelp@microsoft.com  

## Known differences 

Media Encoder Standard is known to be more robust, reliable, preferment, and produces better quality output than the legacy WAME encoder. In addition,: 

* Media Encoder Standard produces output files with a different naming convention than WAME.
* Media Encoder Standard produces artifacts such as files containing the [metadata](media-services-input-metadata-schema.md) about the input file, and [metadata](media-services-output-metadata-schema.md) about the output file(s).
* As documented on the [pricing page](https://azure.microsoft.com/pricing/details/media-services/#encoding) (especially in the FAQ section), when you encode videos using Media Encoder Standard, you get billed based on the duration of the files produced as output. With WAME, you would be billed based on the sizes of the input video file(s) and output video file(s).

## Next steps

[Legacy components](legacy-components.md)