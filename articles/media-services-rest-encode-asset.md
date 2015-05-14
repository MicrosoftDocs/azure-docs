<properties 
	pageTitle="How to Encode an Asset using Azure Media Encoder" 
	description="Learn how to use the Azure Media Encoder to encode media content on Media Services. Code samples use REST API." 
	services="media-services" 
	documentationCenter="" 
	authors="Juliako" 
	manager="dwrede" 
	editor=""/>

<tags 
	ms.service="media-services" 
	ms.workload="media" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="02/10/2015" 
	ms.author="juliako"/>


#How to encode an asset using Azure Media Encoder

This article is part of the [Media Services Video on Demand workflow](media-services-video-on-demand-workflow.md) series. 

##Overview
In order to deliver digital video over the internet you must compress the media. Digital video files are quite large and may be too big to deliver over the internet or for your customers’ devices to display properly. Encoding is the process of compressing video and audio so your customers can view your media.

Encoding jobs are one of the most common processing operations in Media Services. You create encoding jobs to convert media files from one encoding to another. When you encode, you can use the Media Services built-in Media Encoder. You can also use an encoder provided by a Media Services partner; third party encoders are available through the Azure Marketplace. You can specify the details of encoding tasks by using preset strings defined for your encoder, or by using preset configuration files. To see the types of presets that are available, see [Task Presets for Azure Media Services](https://msdn.microsoft.com/library/azure/dn619392.aspx). If you used a third party encoder, you should [validate your files](https://msdn.microsoft.com/library/azure/dn750842.aspx).

It is recommended to always encode your mezzanine files into an adaptive bitrate MP4 set and then convert the set to the desired format using the [Dynamic Packaging](https://msdn.microsoft.com/library/azure/jj889436.aspx). To take advantage of dynamic packaging, you must first get at least one On-demand streaming unit for the streaming endpoint from which you plan to delivery your content. For more information, see [How to Scale Media Services](media-services-manage-origins.md#scale_streaming_endpoints).

If your output asset is storage encrypted, you must configure asset delivery policy. For more information see [Configuring asset delivery policy](media-services-rest-configure-asset-delivery-policy.md).

##Create a job with a single encoding task 

>[AZURE.NOTE] When working with the Media Services REST API, the following considerations apply:
>
>When accessing entities in Media Services, you must set specific header fields and values in your HTTP requests. For more information, see [Setup for Media Services REST API Development](media-services-rest-how-to-use.md).

>After successfully connecting to https://media.windows.net, you will receive a 301 redirect specifying another Media Services URI. You must make subsequent calls to the new URI as described in [Connecting to Media Services using REST API](media-services-rest-connect_programmatically.md). 


The following example shows you how to create and post a Job with one Task set to encode a video at a specific resolution and quality. When encoding with Azure Media Encoder, you can use task configuration presets specified [here](https://msdn.microsoft.com/library/azure/dn619389.aspx).
	
Request:

	POST https://media.windows.net/API/Jobs HTTP/1.1
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	x-ms-version: 2.8
	Authorization: Bearer http%3a%2f%2fschemas.xmlsoap.org%2fws%2f2005%2f05%2fidentity%2fclaims%2fnameidentifier=youraccountname&urn%3aSubscriptionId=zf84471d-b1ae-2233-aa09-010f0fc0cf5b&http%3a%2f%2fschemas.microsoft.com%2faccesscontrolservice%2f2010%2f07%2fclaims%2fidentityprovider=https%3a%2f%2fwamsprodglobal001acs.accesscontrol.windows.net%2f&Audience=urn%3aWindowsAzureMediaServices&ExpiresOn=1336802231&Issuer=https%3a%2f%2fwamsprodglobal001acs.accesscontrol.windows.net%2f&HMACSHA256=gR%2fNaIZgolFLxBOmfSECrp16Mp0Mti3KoePVjBUCzls%3d
	Host: media.windows.net
	Content-Length: 476
	
	{"Name" : "NewTestJob", "InputMediaAssets" : [{"__metadata" : {"uri" : "https://media.windows.net/api/Assets('nb%3Acid%3AUUID%3Aaab7f15b-3136-4ddf-9962-e9ecb28fb9d2')"}}],  "Tasks" : [{"Configuration" : "H264 Broadband 720p", "MediaProcessorId" : "nb:mpid:UUID:70bdc2c3-ebf4-42a9-8542-5afc1e55d217",  "TaskBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody>"}]}

Response:
	
	HTTP/1.1 201 Created
	Cache-Control: no-cache
	Content-Length: 1017
	Content-Type: application/json;odata=verbose;charset=utf-8
	Location: https://media.windows.net/api/Jobs('nb%3Ajid%3AUUID%3A40dc7bef-6bd9-2247-9f3d-d80bc257d715')
	Server: Microsoft-IIS/7.5
	x-ms-request-id: d2052a71-95b1-4a52-9420-ccca1202a5fb
	X-Content-Type-Options: nosniff
	DataServiceVersion: 1.0;
	X-AspNet-Version: 4.0.30319
	X-Powered-By: ASP.NET
	Date: Fri, 11 May 2012 21:32:40 GMT
	
	{"d":{"__metadata":{"id":"https://media.windows.net/api/Jobs('nb%3Ajid%3AUUID%3A40dc7bef-6bd9-2247-9f3d-d80bc257d715')","uri":"https://media.windows.net/api/Jobs('nb%3Ajid%3AUUID%3A40dc7bef-6bd9-2247-9f3d-d80bc257d715')","type":"Microsoft.Cloud.Media.Vod.Rest.Data.Models.Job"},"Tasks":{"__deferred":{"uri":"https://media.windows.net/api/Jobs('nb%3Ajid%3AUUID%3A40dc7bef-6bd9-2247-9f3d-d80bc257d715')/Tasks"}},"OutputMediaAssets":{"__deferred":{"uri":"https://media.windows.net/api/Jobs('nb%3Ajid%3AUUID%3A40dc7bef-6bd9-2247-9f3d-d80bc257d715')/OutputMediaAssets"}},"InputMediaAssets":{"__deferred":{"uri":"https://media.windows.net/api/Jobs('nb%3Ajid%3AUUID%3A40dc7bef-6bd9-2247-9f3d-d80bc257d715')/InputMediaAssets"}},"Id":"nb:jid:UUID:40dc7bef-6bd9-2247-9f3d-d80bc257d715","Name":"NewTestJob","Created":"\/Date(1336771959431)\/","LastModified":"\/Date(1336771959431)\/","EndTime":null,"Priority":0,"RunningDuration":0,"StartTime":null,"State":0,"TemplateId":null}}

##Create a job with chained tasks

In many application scenarios, developers want to create a series of processing tasks. In Media Services, you can create a series of chained tasks. Each task performs different processing steps and can use different media processors. The chained tasks can hand off an asset from one task to another, performing a linear sequence of tasks on the asset. However, the tasks performed in a job are not required to be in a sequence. When you create a chained task, the chained **ITask** objects are created in a single **IJob** object.

>[AZURE.NOTE] There is currently a limit of 30 tasks per job. If you need to chain more than 30 tasks, create more than one job to contain the tasks.


	POST https://media.windows.net/api/Jobs HTTP/1.1
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	x-ms-version: 2.8
	Authorization: Bearer http%3a%2f%2fschemas.xmlsoap.org%2fws%2f2005%2f05%2fidentity%2fclaims%2fnameidentifier=youraccountname&urn%3aSubscriptionId=zf84471d-b1ae-4e75-2233-010f0fc0cf5b&http%3a%2f%2fschemas.microsoft.com%2faccesscontrolservice%2f2010%2f07%2fclaims%2fidentityprovider=https%3a%2f%2fwamsprodglobal001acs.accesscontrol.windows.net%2f&Audience=urn%3aWindowsAzureMediaServices&ExpiresOn=1336802231&Issuer=https%3a%2f%2fwamsprodglobal001acs.accesscontrol.windows.net%2f&HMACSHA256=gR%2fNaIZgolFLxBOmfSECrp16Mp0Mti3KoePVjBUCzls%3d

	{  
	   "Name":"NewTestJob",
	   "InputMediaAssets":[  
	      {  
	         "__metadata":{  
	            "uri":"https://testrest.cloudapp.net/api/Assets('nb%3Acid%3AUUID%3A910ffdc1-2e25-4b17-8a42-61ffd4b8914c')"
	         }
	      }
	   ],
	   "Tasks":[  
	      {  
	         "Configuration":"H264 Adaptive Bitrate MP4 Set 720p",
	         "MediaProcessorId":"nb:mpid:UUID:2e7aa8f3-4961-4e0c-b4db-0e0439e524f5",
	         "TaskBody":"<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody>"
	      },
	      {  
	         "Configuration":"H264 Smooth Streaming 720p",
	         "MediaProcessorId":"nb:mpid:UUID:2e7aa8f3-4961-4e0c-b4db-0e0439e524f5",
	         "TaskBody":"<?xml version=\"1.0\" encoding=\"utf-16\"?><taskBody><inputAsset>JobOutputAsset(0)</inputAsset><outputAsset>JobOutputAsset(1)</outputAsset></taskBody>"
	      }
	   ]
	}


##Next Steps
Now that you know how to create a job to encode an assset, go to the [How To Check Job Progress with Media Services](media-services-rest-check-job-progress.md) topic.

[Azure Marketplace]: https://datamarket.azure.com/
[Encoder Preset]: http://msdn.microsoft.com/library/dn619392.aspx
[How to: Get a Media Processor Instance]:http://go.microsoft.com/fwlink/?LinkId=301732
[How to: Upload an Encrypted Asset]:http://go.microsoft.com/fwlink/?LinkId=301733
[How to: Deliver an Asset by Download]:http://go.microsoft.com/fwlink/?LinkId=301734
[How to Check Job Progress]:http://go.microsoft.com/fwlink/?LinkId=301737
[Task Preset for Azure Media Packager]:http://msdn.microsoft.com/library/windowsazure/hh973635.aspx
