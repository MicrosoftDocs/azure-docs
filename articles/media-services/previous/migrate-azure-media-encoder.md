---
title: Migrate from Azure Media Encoder to Media Encoder Standard | Microsoft Docs
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
ms.date: 08/21/2019
ms.author: juliako

---
# Migrate from Azure Media Encoder to Media Encoder Standard

This article discusses the steps for migrating from the legacy Azure Media Encoder (AME) media processor (which is being retired) to the Media Encoder Standard media processor. For the retirement dates, see this [legacy components](legacy-components.md) topic.

When encoding files with AME, customers typically used a named preset string such as `H264 Adaptive Bitrate MP4 Set 1080p`. In order to migrate, your code needs to be updated to use the **Media Encoder Standard** media processor instead of AME, and one of the equivalent [system presets](media-services-mes-presets-overview.md) like `H264 Multiple Bitrate 1080p`. 

## Migrating to Media Encoder Standard

Here is a typical C# code sample that uses the legacy media processor. 

```csharp
// Declare a new job. 
IJob job = _context.Jobs.Create("AME Job"); 
// Get a media processor reference, and pass to it the name of the  
// processor to use for the specific task. 
IMediaProcessor processor = GetLatestMediaProcessorByName("Azure Media Encoder"); 

// Create a task with the encoding details, using a string preset. 
// In this case " H264 Adaptive Bitrate MP4 Set 1080p" preset is used. 
ITask task = job.Tasks.AddNew("My encoding task", 
    processor, 
    " H264 Adaptive Bitrate MP4 Set 1080p", 
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

If you had created your own encoding preset for AME using its schema, there is an [equivalent schema for Media Encoder Standard](media-services-mes-schema.md). If you have questions on how to map the older settings to the new encoder, please reach out to us via mailto:amshelp@microsoft.com  
## Known differences 

Media Encoder Standard is more robust, reliable, has better performance, and produces better quality output than the legacy AME encoder. In addition: 

* Media Encoder Standard produces output files with a different naming convention than AME.
* Media Encoder Standard produces artifacts such as files containing the [input file metadata](media-services-input-metadata-schema.md) and the [output file(s) metadata](media-services-output-metadata-schema.md).

## Next steps

* [Legacy components](legacy-components.md)
* [Pricing page](https://azure.microsoft.com/pricing/details/media-services/#encoding)
