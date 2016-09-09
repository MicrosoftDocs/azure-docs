<properties
	pageTitle="Azure Media Services Analytics Overview | Microsoft Azure"
	description="Azure Media Services offers the public preview of Azure Media Analytics, a collection of speech and computer vision services at enterprise scale, compliance, security and global reach. Azure Media Analytics services are built using the core Azure Media Services platform components and hence are ready to handle media processing at scale on day one. "
	services="media-services"
	documentationCenter=""
	authors="juliako"
	manager="erikre"
	editor=""/>

<tags
	ms.service="media-services"
	ms.workload="media"
	ms.tgt_pltfrm="na"
	ms.devlang="dotnet"
	ms.topic="article"
	ms.date="06/27/2016"   
	ms.author="milanga;juliako;johndeu"/>

# Azure Media Services Analytics Overview

##Overview

More organizations and enterprises are embracing video as the preferred medium to train their employees, engage their customers and document business functions. Cloud computing makes it effective to store, stream and access these large media files, but as companies grow their video content library, they must have an equally effective means for extracting new insights from video in order to create more meaningful, personalized interactions with their audiences and take their business to the next level.

To address this growing need in the marketplace, Azure Media Services offers Media Analytics, a collection of speech and vision components (at enterprise scale, compliance, security and global reach) that make it easier for organizations and enterprises to derive actionable insights from their video files. Azure Media Analytics services are built using the core Azure Media Services platform components and hence are ready to handle media processing at scale on day one.

Azure Media Analytics enable developers to quickly get started with vision capabilities for video at limited scale and bring this advanced functionality into Bots and applications. Azure Media Analytics is built to be used by enterprise environments with the full scale, compliance, security and global reach required by large organizations.

The following diagram shows **Media Analytics** and other major parts of the Media Services platform. Note that, Media Analytics media processors produce MP4 files or JSON files. If a media processor produced an MP4 file, you can progressively download the file. If a media processor produced a JSON file, you can download the file from the Azure blob storage. 

![VoD workflow](./media/media-services-video-on-demand-workflow/media-services-video-on-demand.png)


## Azure Media Analytics services

- **Indexer** – Azure Media Indexer enables you to make content searchable, as well as generate closed captioning tracks. Azure Media Services released **Azure Media Indexer 2 Preview** with faster indexing and broader language support. Supported languages include English, Spanish, French, German, Italian, Chinese, Portuguese and Arabic. For detailed information and examples, see [Process videos with Azure Media Indexer 2](media-services-process-content-with-indexer2.md)
 
- **Hyperlapse** – Microsoft Hyperlapse is a result of over 20 years of computer vision research at Microsoft Research (MSR), combining video stabilization and time lapsing to create quick, consumable, beautiful videos from your long form content. Besides creating time lapses, you can also use Hyperlapse to create stable videos from shaky videos captured via cell phones and camcorders. For detailed information and examples, see [Hyperlapse Media Files with Azure Media Hyperlapse](media-services-hyperlapse-content.md)
 
- **Motion detection** – You can use this service to detect motion in a video with stationery backgrounds. This is ideal for customers who want to check for false positives on motion events detected by surveillance cameras on the surveillance video feeds. For detailed information and examples, see [Motion Detection for Azure Media Analytics](media-services-motion-detection.md).
 
- **Face detection and Face emotions** – Using this service, you can detect people’s faces and their emotions, including happiness, sadness, surprise, anger, contempt, fear, disgust and indifference/neutral. This has several useful industry applications, described below, including aggregating and analyzing reactions of people attending an event. For detailed information and examples, see [Face and Emotion Detection for Azure Media Analytics](media-services-face-and-emotion-detection.md).
 
- **Video summarization** – Video summarization can help you create summaries of long videos by automatically selecting interesting snippets from the source video. This is useful when you want to provide a quick overview of what to expect in a long video. For detailed information and examples, see [Use Azure Media Video Thumbnails to Create a Video Summarization](media-services-video-summarization.md)

- **Optical character recognition** - Azure Media Analytics OCR (optical character recognition) enables you to convert text content in video files into editable, searchable digital text. This allows you to automate the extraction of meaningful metadata from the video signal of your media.
 
 
## Common scenarios

Below are a couple of scenarios where Azure Media Analytics can help organizations and enterprises across industries glean new insights from video to create more personalized audience and employee engagements, as well as more effectively manage large volume of video content:

- **Call centers** – Even with the advent of social media, customer call centers still facilitate a large percentage of customer service transactions. Encoded in this audio data is a wealth of information about customers that can be analyzed to improve product roadmaps and also train call center employees to achieve higher customer satisfaction. By using Azure Media Indexer, customers are able to extract text and build a search index and dashboards to extract intelligence around most common complains, source of complains and other such relevant data.

- **User generated content moderation** – From news media outlets to police departments, many organizations have public facing portals where they accept UGC media, such as videos and images. The volume of content can spike due to unexpected events. In these scenarios, it is near impossible to conduct an effective manual review of the content for appropriateness. Customers can rely on the content moderation service to focus on the content that is appropriate.

- **Surveillance** -  With the growth of IP cameras, there is an explosion of surveillance videos. Manually reviewing surveillance video is time intensive and prone to human error. Azure Media Analytics provides several components such as motion detection, face detection, and Hyperlapse to make the process of reviewing, managing and creating derivatives easier.

## Media Services Analytics Media Processors 

This section lists all the Media Services Analytics Media Processors (MP) and shows how use .NET or REST to get a MP object.

### MP names


- Azure Media Indexer 2 Preview
- Azure Media Indexer
- Azure Media Hyperlapse
- Azure Media Face Detector
- Azure Media Motion Detector
- Azure Media Video Thumbnails
- Azure Media OCR

### .NET

The following function takes one of the specified MP names and return an MP object.

    static IMediaProcessor GetLatestMediaProcessorByName(string mediaProcessorName)
    {
        var processor = _context.MediaProcessors
            .Where(p => p.Name == mediaProcessorName)
            .ToList()
            .OrderBy(p => new Version(p.Version))
            .LastOrDefault();

        if (processor == null)
            throw new ArgumentException(string.Format("Unknown media processor",
                                                       mediaProcessorName));

        return processor;
    }


## REST

Request:

	GET https://media.windows.net/api/MediaProcessors()?$filter=Name%20eq%20'Azure%20Media%20OCR' HTTP/1.1
	DataServiceVersion: 1.0;NetFx
	MaxDataServiceVersion: 3.0;NetFx
	Accept: application/json
	Accept-Charset: UTF-8
	User-Agent: Microsoft ADO.NET Data Services
	Authorization: Bearer <token>
	x-ms-version: 2.12
	Host: media.windows.net
	
Response:
		
	. . .
	
	{  
	   "odata.metadata":"https://media.windows.net/api/$metadata#MediaProcessors",
	   "value":[  
	      {  
	         "Id":"nb:mpid:UUID:074c3899-d9fb-448f-9ae1-4ebcbe633056",
	         "Description":"Azure Media OCR",
	         "Name":"Azure Media OCR",
	         "Sku":"",
	         "Vendor":"Microsoft",
	         "Version":"1.1"
	      }
	   ]
	}

##Demos

[Azure Media Analytics demos](http://azuremedialabs.azurewebsites.net/demos/Analytics.html)

##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]

##Related articles

[Media Services Analytics announcement](https://azure.microsoft.com/blog/introducing-azure-media-analytics/)
  

<!-- Images -->

[overview]: ./media/media-services-video-on-demand-workflow/media-services-video-on-demand.png
