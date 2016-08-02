<properties
	pageTitle="How to Scale Media Processing using the Azure Classic Portal"
	description="Learn how to scale Media Services by specifying the number of On-Demand Streaming Reserved Units and Encoding Reserved Units that you would like your account to be provisioned with."
	services="media-services"
	documentationCenter=""
	authors="juliako,milangada"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/23/2016"
	ms.author="juliako"/>


# How to Scale Media Processing using the Azure Classic Portal

## Achieve this task with other technologies

This page gives an overview of how to scale media processing and shows how to do it using the Azure Classic Portal. You also achieve this task with other technologies:

> [AZURE.SELECTOR]
- [.NET](media-services-dotnet-encoding-units.md)
- [Portal](media-services-portal-encoding-units.md)
- [REST](https://msdn.microsoft.com/library/azure/dn859236.aspx)
- [Java](https://github.com/southworkscom/azure-sdk-for-media-services-java-samples)
- [PHP](https://github.com/Azure/azure-sdk-for-php/tree/master/examples/MediaServices)

## Overview

A Media Services account is associated with a Reserved Unit Type which determines the speed with which your media processing tasks are processed. You can pick between the following reserved unit types: **S1**, **S2**, or **S3**. For example, the same encoding job runs faster when you use the **S2** reserved unit type compare to the **S1** type. For more information, see the [Reserved Unit Types](https://azure.microsoft.com/blog/high-speed-encoding-with-azure-media-services/).

In addition to specifying the reserved unit type, you can specify to provision your account with reserved units. The number of provisioned  reserved units determines the number of media tasks that can be processed concurrently in a given account. For example, if your account has 5 reserved units, then 5 media tasks will be running concurrently as long as there are tasks to be processed. The remaining tasks will wait in the queue and will get picked up for processing sequentially as soon as a running task finishes. If an account does not have any reserved units provisioned, then tasks will be picked up sequentially. In this case, the wait time between one task finishing and the next one starting will depend on the availability of resources in the system.

## Choosing between different reserved unit types

The following table helps you make decision when choosing between different encoding speeds. It also provides a few benchmark cases and provides SAS URLs that you can use to download videos on which you can perform your own tests:

|**S1**|**S2**|**S3**|
----------|------------|----------|------------
Intended use case| Single bitrate encoding. <br/>Files at SD or below resolutions, not time sensitive, low cost.|Single bitrate and multiple bitrate encoding.<br/>Normal usage for both SD and HD encoding. |Single bitrate and multiple bitrate encoding.<br/>Full HD and 4K resolution videos. Time sensitive, faster turnaround encoding. 
Benchmark|[Input file: 5 minutes long 640x360p at 29.97 frames/second](https://wamspartners.blob.core.windows.net/for-long-term-share/Whistler_5min_360p30.mp4?sr=c&si=AzureDotComReadOnly&sig=OY0TZ%2BP2jLK7vmcQsCTAWl33GIVCu67I02pgarkCTNw%3D).<br/><br/>Encoding to a single bitrate MP4 file, at the same resolution, takes approximately 11 minutes.|[Input file: 5 minute long 1280x720p at 29.97 frames/second](https://wamspartners.blob.core.windows.net/for-long-term-share/Whistler_5min_720p30.mp4?sr=c&si=AzureDotComReadOnly&sig=OY0TZ%2BP2jLK7vmcQsCTAWl33GIVCu67I02pgarkCTNw%3D)<br/><br/>Encoding with "H264 Single Bitrate 720p" preset will take approximately 5 minutes.<br/><br/>Encoding with "H264 Multiple Bitrate 720p" preset takes approximately 11.5 minutes.|[Input file: 5 minute long 1920x1080p at 29.97 frames/second](https://wamspartners.blob.core.windows.net/for-long-term-share/Whistler_5min_1080p30.mp4?sr=c&si=AzureDotComReadOnly&sig=OY0TZ%2BP2jLK7vmcQsCTAWl33GIVCu67I02pgarkCTNw%3D). <br/><br/>Encoding with "H264 Single Bitrate 1080p" preset takes approximately 2.7 minutes.<br/><br/>Encoding with "H264 Multiple Bitrate 1080p" preset takes approximately 5.7 minutes.

##Considerations

>[AZURE.IMPORTANT] The following considerations apply:

- Reserved Units work for parallelizing all media processing, including indexing jobs using Azure Media Indexer.  However, unlike encoding,  indexing jobs will not process faster with faster reserved units.

- If using the shared pool, i.e. without any reserved units, then your encode tasks will have the same performance as with S1 RUs. However, there is no upper bound to the time your Tasks can spend in queued state, and at any given time, at most one Task will be running.

- The following data centers do not offer the **S2** reserved unit type: Brazil South, India West, India Central, and India South.

- The following data centers do not offer the **S3** reserved unit type: Brazil South, India West, India Central.

- The highest number of units specified for the 24-hour period is used in calculating the cost.

## Change the reserved unit type

To change the reserved unit type and the number of reserved units, do the following:

1. In the [Azure Classic Portal](https://manage.windowsazure.com/), click **Media Services**. Then, click the name of the media service.

2. Select the **ENCODING** page.

	To change the **RESERVED UNIT TYPE**, press S1, S2, or S3.

	To change the number of reserved units for the selected reserved unit type, use the **ENCODING** slider.


	![Processors page](./media/media-services-portal-encoding-units/media-services-encoding-scale.png)

3. Press the SAVE button to save your changes.

	The new reserved units are allocated as soon as you press SAVE.
 

##Quotas and limitations

For information about quotas and limitations and how to open a support ticket, see [Quotas and limitations](media-services-quotas-and-limitations.md).



##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]
