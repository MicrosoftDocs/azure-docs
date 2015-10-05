<properties 
	pageTitle="Create Advanced Encoding Workflows with Workflow Designer" 
	description="Learn about how to create advanced encoding workflows with Workflow Designer." 
	services="media-services" 
	documentationCenter="" 
	authors="juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="09/07/2015"
	ms.author="juliako"/>


#Create Advanced Encoding Workflows with Workflow Designer

##Overview
The **Workflow Designer** is a standalone tool that is used to create workflows/graphs for encoding with **Media Encoder Premium Workflow**.

This tool can also be used to modify [existing workflows](media-services-workflow-designer.md#existing_workflows). 

>[AZURE.NOTE]To get a copy of the Workflow Designer tool, please contact mepd@microsoft.com.


Once a workflow file is created, it can be uploaded as an Asset, and then be used for encoding media files. For information on how to encode with **Media Encoder Premium Workflow** using **.NET**, see [Advanced encoding with Media Encoder Premium Workflow](media-services-encode-with-premium-workflow.md).

##<a id="existing_workflows"></a>Modify existing workflows

The default workflow files can be modified using the designer tool. You can get the default workflow files [here](https://github.com/Azure/azure-media-services-samples/tree/master/Encoding%20Presets/VoD/MediaEncoderPremiumWorkfows). The folder also contains the description of these files.

The following videos demonstrate how to use the designer.

###Day 1 – Getting Started

Day 1 video covers:

- Designer Overview
- Basic Workflows – “Hello World”
- Creating multiple output MP4 files for use with Azure Media Services streaming

> [AZURE.VIDEO azure-premium-encoder-workflow-designer-training-videos-day-1]

###Day 2

Day 2 video covers:

- Varying Source file scenarios – handling audio
- Workflows with advanced Logic
- Graph stages

> [AZURE.VIDEO azure-premium-encoder-workflow-designer-training-videos-day-2]

###Day 3

Day 3 video covers:

- Scripting inside of Workflows/Blueprints
- Restrictions with the current Encoder
- Q&A
 
> [AZURE.VIDEO azure-premium-encoder-workflow-designer-training-videos-day-3]



##Media Services learning paths

You can view AMS learning paths here:

- [AMS Live Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-live/)
- [AMS on Demand Streaming Workflow](http://azure.microsoft.com/documentation/learning-paths/media-services-streaming-on-demand/)


##See Also

[Azure Premium Encoder Workflow Designer Training Videos](http://johndeutscher.com/2015/07/06/azure-premium-encoder-workflow-designer-training-videos/)
