<properties 
	pageTitle="How to Create a Media Processor | Microsoft Azure" 
	description="Learn how to create a media processor component to encode, convert format, encrypt, or decrypt media content for Azure Media Services." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="06/22/2016" 
	ms.author="juliako"/>


#How to: Get a Media Processor Instance


> [AZURE.SELECTOR]
- [.NET](media-services-get-media-processor.md)
- [REST](media-services-rest-get-media-processor.md)

##Overview

In Media Services a media processor is a component that handles a specific processing task, such as encoding, format conversion, encrypting, or decrypting media content. You typically create a media processor when you are creating a task to encode, encrypt, or convert the format of media content.

The following table provides the name and description of each available media processor.

Media Processor Name|Description|More Information
---|---|---
Media Encoder Standard|Provides standard capabilities for on-demand encoding. |[Overview and Comparison of Azure On Demand Media Encoders](media-services-encode-asset.md)
Media Encoder Premium Workflow|Lets you run encoding tasks using Media Encoder Premium Workflow.|[Overview and Comparison of Azure On Demand Media Encoders](media-services-encode-asset.md)
Azure Media Indexer| Enables you to make media files and content searchable, as well as generate closed captioning tracks and keywords.|[Azure Media Indexer](media-services-index-content.md)
Azure Media Hyperlapse (preview)|Enables you to smooth out the "bumps" in your video with video stabilization. Also allows you to speed up your content into a consumable clip.|[Azure Media Hyperlapse](media-services-hyperlapse-content.md)
Azure Media Encoder|Depreciated
Storage Decryption| Depreciated|
Azure Media Packager|Depreciated|
Azure Media Encryptor|Depreciated|

##Get MediaProcessor

>[AZURE.NOTE] When working with the Media Services REST API, the following considerations apply:
>
>When accessing entities in Media Services, you must set specific header fields and values in your HTTP requests. For more information, see [Setup for Media Services REST API Development](media-services-rest-how-to-use.md).

>After successfully connecting to https://media.windows.net, you will receive a 301 redirect specifying another Media Services URI. You must make subsequent calls to the new URI as described in [Connecting to Media Services using REST API](media-services-rest-connect-programmatically.md). 


The following REST call shows how to get a media processor instance by name (in this case, **Media Encoder Standard**). 



	
Request:

	GET https://media.windows.net/api/MediaProcessors()?$filter=Name%20eq%20'Media%20Encoder%20Standard' HTTP/1.1
	DataServiceVersion: 1.0;NetFx
	MaxDataServiceVersion: 3.0;NetFx
	Accept: application/json
	Accept-Charset: UTF-8
	User-Agent: Microsoft ADO.NET Data Services
	Authorization: Bearer <token>
	x-ms-version: 2.11
	Host: media.windows.net
	
Response:
		
	. . .
	
	{  
	   "odata.metadata":"https://media.windows.net/api/$metadata#MediaProcessors",
	   "value":[  
	      {  
	         "Id":"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",
	         "Description":"Media Encoder Standard",
	         "Name":"Media Encoder Standard",
	         "Sku":"",
	         "Vendor":"Microsoft",
	         "Version":"1.1"
	      }
	   ]
	}


##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


##Next Steps

Now that you know how to get a media processor instance, go to the [How to Encode an Asset](media-services-rest-get-started.md) topic which will show you how to use the Media Encoder Standard to encode an asset.
