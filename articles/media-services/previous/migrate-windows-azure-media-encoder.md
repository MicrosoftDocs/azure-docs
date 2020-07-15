---
title: Migrate from Windows Azure Media Encoder to Media Encoder Standard | Microsoft Docs
description: This topic discusses how to migrate from Azure Media Encoder to the Media Encoder Standard media processor.
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
ms.date: 10/17/2019
ms.author: juliako

---
# Migrate from Windows Azure Media Encoder to Media Encoder Standard

This article discusses the steps for migrating from the legacy Windows Azure Media Encoder (WAME) media processor (which is being retired) to the Media Encoder Standard media processor. For the retirement dates, see this [legacy components](legacy-components.md) topic.

When encoding files with WAME, customers typically used a named preset string such as `H264 Adaptive Bitrate MP4 Set 1080p`. In order to migrate, your code needs to be updated to use the **Media Encoder Standard** media processor instead of WAME, and one of the equivalent [system presets](media-services-mes-presets-overview.md) like `H264 Multiple Bitrate 1080p`. 

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

Here is the updated version that uses Media Encoder Standard.

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

If you had created your own encoding preset for WAME using its schema, there is an [equivalent schema for Media Encoder Standard](media-services-mes-schema.md).

## Known differences 

Media Encoder Standard is more robust, reliable, has better performance, and produces better quality output than the legacy WAME encoder. In addition,: 

* Media Encoder Standard produces output files with a different naming convention than WAME.
* Media Encoder Standard produces artifacts such as files containing the [input file metadata](media-services-input-metadata-schema.md) and the [output file(s) metadata](media-services-output-metadata-schema.md).
* As documented on the [pricing page](https://azure.microsoft.com/pricing/details/media-services/#encoding) (especially in the FAQ section), when you encode videos using Media Encoder Standard, you get billed based on the duration of the files produced as output. With WAME, you would be billed based on the sizes of the input video file(s) and output video file(s).

## Need help?

You can open a support ticket by navigating to [New support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest)

## Next steps

* [Legacy components](legacy-components.md)
* [Pricing page](https://azure.microsoft.com/pricing/details/media-services/#encoding)
