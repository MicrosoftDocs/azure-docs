<properties 
	pageTitle="How to Encode an Asset using  Media Encoder Standard" 
	description="Learn how to use the  Media Encoder Standard to encode media content on Media Services. Code samples use REST API." 
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
	ms.date="06/22/2016"
	ms.author="juliako"/>


#How to encode an asset using Media Encoder Standard


> [AZURE.SELECTOR]
- [.NET](media-services-dotnet-encode-asset.md)
- [REST](media-services-rest-encode-asset.md)
- [Portal](media-services-manage-content.md#encode)

##Overview
In order to deliver digital video over the internet you must compress the media. Digital video files are quite large and may be too big to deliver over the internet or for your customers’ devices to display properly. Encoding is the process of compressing video and audio so your customers can view your media.

Encoding jobs are one of the most common processing operations in Media Services. You create encoding jobs to convert media files from one encoding to another. When you encode, you can use the Media Services built-in encoder (Media Encoder Standard). You can also use an encoder provided by a Media Services partner; third party encoders are available through the Azure Marketplace. You can specify the details of encoding tasks by using preset strings defined for your encoder, or by using preset configuration files. To see the types of presets that are available, see [Task Presets for Media Encoder Standard](http://msdn.microsoft.com/library/mt269960). 

Each Job can have one or more Tasks depending on the type of processing that you want to accomplish. Through the REST API, you can create Jobs and their related Tasks in one of two ways: 

- Tasks can be defined inline through the Tasks navigation property on Job entities, or 
- through OData batch processing.
  

It is recommended to always encode your mezzanine files into an adaptive bitrate MP4 set and then convert the set to the desired format using the [Dynamic Packaging](media-services-dynamic-packaging-overview.md). To take advantage of dynamic packaging, you must first get at least one On-demand streaming unit for the streaming endpoint from which you plan to delivery your content. For more information, see [How to Scale Media Services](media-services-manage-origins.md#scale_streaming_endpoints).

If your output asset is storage encrypted, you must configure asset delivery policy. For more information see [Configuring asset delivery policy](media-services-rest-configure-asset-delivery-policy.md).


>[AZURE.NOTE]Before you start referencing media processors, verify that you have the correct media processor ID. For more information, see [Get Media Processors](media-services-rest-get-media-processor.md).

##Create a job with a single encoding task 

>[AZURE.NOTE] When working with the Media Services REST API, the following considerations apply:
>
>When accessing entities in Media Services, you must set specific header fields and values in your HTTP requests. For more information, see [Setup for Media Services REST API Development](media-services-rest-how-to-use.md).

>After successfully connecting to https://media.windows.net, you will receive a 301 redirect specifying another Media Services URI. You must make subsequent calls to the new URI as described in [Connecting to Media Services using REST API](media-services-rest-connect-programmatically.md). 
>
>When using JSON and specifying to use the **__metadata** keyword in the request (for example, to references a linked object) you MUST set the **Accept** header to [JSON Verbose format](http://www.odata.org/documentation/odata-version-3-0/json-verbose-format/): Accept: application/json;odata=verbose.

The following example shows you how to create and post a Job with one Task set to encode a video at a specific resolution and quality. When encoding with Media Encoder Standard, you can use task configuration presets specified [here](http://msdn.microsoft.com/library/mt269960).
	
Request:

	POST https://media.windows.net/API/Jobs HTTP/1.1
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	x-ms-version: 2.11
	Authorization: Bearer <token value>
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000
	Host: media.windows.net

	
	{"Name" : "NewTestJob", "InputMediaAssets" : [{"__metadata" : {"uri" : "https://media.windows.net/api/Assets('nb%3Acid%3AUUID%3Aaab7f15b-3136-4ddf-9962-e9ecb28fb9d2')"}}],  "Tasks" : [{"Configuration" : "H264 Multiple Bitrate 720p", "MediaProcessorId" : "nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",  "TaskBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody>"}]}

Response:
	
	HTTP/1.1 201 Created

	. . . 

###Set the output asset's name

The following example shows how to set the assetName attribute:

	{ "TaskBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset assetName=\"CustomOutputAssetName\">JobOutputAsset(0)</outputAsset></taskBody>"}

##Considerations

- TaskBody properties MUST use literal XML to define the number of input, or output assets that will be used by the Task. The Task topic contains the XML Schema Definition for the XML.
- In the TaskBody definition, each inner value for <inputAsset> and <outputAsset> must be set as JobInputAsset(value) or JobOutputAsset(value).
- A task can have multiple output assets. One JobOutputAsset(x) can only be used once as an output of a task in a job.
- You can specify JobInputAsset or JobOutputAsset as an input asset of a task.
- Tasks must not form a cycle.
- The value parameter that you pass to JobInputAsset or JobOutputAsset represents the index value for an Asset. The actual Assets are defined in the InputMediaAssets and OutputMediaAssets navigation properties on the Job entity definition. 
- Because Media Services is built on OData v3, the individual assets in InputMediaAssets and OutputMediaAssets navigation property collections are referenced through a "__metadata : uri" name-value pair.
- InputMediaAssets maps to one or more Assets you have created in Media Services. OutputMediaAssets are created by the system. They do not reference an existing asset.
- OutputMediaAssets can be named using the assetName attribute. If this attribute is not present, then the name of the OutputMediaAsset will be whatever the inner text value of the <outputAsset> element is with a suffix of either the Job Name value, or the Job Id value (in the case where the Name property isn't defined). For example, if you set a value for assetName to "Sample", then the OutputMediaAsset Name property would be set to "Sample". However, if you did not set a value for assetName, but did set the job name to "NewJob", then the OutputMediaAsset Name would be "JobOutputAsset(value)_NewJob". 


##Create a job with chained tasks

In many application scenarios, developers want to create a series of processing tasks. In Media Services, you can create a series of chained tasks. Each task performs different processing steps and can use different media processors. The chained tasks can hand off an asset from one task to another, performing a linear sequence of tasks on the asset. However, the tasks performed in a job are not required to be in a sequence. When you create a chained task, the chained **ITask** objects are created in a single **IJob** object.

>[AZURE.NOTE] There is currently a limit of 30 tasks per job. If you need to chain more than 30 tasks, create more than one job to contain the tasks.


	POST https://media.windows.net/api/Jobs HTTP/1.1
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	x-ms-version: 2.11
	Authorization: Bearer <token value>
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000

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
	         "MediaProcessorId":"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",
	         "TaskBody":"<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody>"
	      },
	      {  
	         "Configuration":"H264 Smooth Streaming 720p",
	         "MediaProcessorId":"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",
	         "TaskBody":"<?xml version=\"1.0\" encoding=\"utf-16\"?><taskBody><inputAsset>JobOutputAsset(0)</inputAsset><outputAsset>JobOutputAsset(1)</outputAsset></taskBody>"
	      }
	   ]
	}


###Considerations

To enable task chaining:

- A job must have at least 2 tasks
- There must be at least one task whose input is output of another task in the job.

## Use OData batch processing 

The following example shows how to use OData batch processing to create a job and tasks. For information on batch processing, see [Open Data Protocol (OData) Batch Processing](http://www.odata.org/documentation/odata-version-3-0/batch-processing/).
 
	POST https://media.windows.net/api/$batch HTTP/1.1
	DataServiceVersion: 1.0;NetFx
	MaxDataServiceVersion: 3.0;NetFx
	Content-Type: multipart/mixed; boundary=batch_a01a5ec4-ba0f-4536-84b5-66c5a5a6d34e
	Accept: multipart/mixed
	Accept-Charset: UTF-8
	Authorization: Bearer <token>
	x-ms-version: 2.11
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000
	Host: media.windows.net
	
	
	--batch_a01a5ec4-ba0f-4536-84b5-66c5a5a6d34e
	Content-Type: multipart/mixed; boundary=changeset_122fb0a4-cd80-4958-820f-346309967e4d
	
	--changeset_122fb0a4-cd80-4958-820f-346309967e4d
	Content-Type: application/http
	Content-Transfer-Encoding: binary
	
	POST https://media.windows.net/api/Jobs HTTP/1.1
	Content-ID: 1
	Content-Type: application/json
	Accept: application/json
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	Accept-Charset: UTF-8
	Authorization: Bearer <token>
	x-ms-version: 2.11
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000
	
	{"Name" : "NewTestJob", "InputMediaAssets@odata.bind":["https://media.windows.net/api/Assets('nb%3Acid%3AUUID%3A2a22445d-1500-80c6-4b34-f1e5190d33c6')"]}
	
	--changeset_122fb0a4-cd80-4958-820f-346309967e4d
	Content-Type: application/http
	Content-Transfer-Encoding: binary
	
	POST https://media.windows.net/api/$1/Tasks HTTP/1.1
	Content-ID: 2
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	Accept-Charset: UTF-8
	Authorization: Bearer <token>
	x-ms-version: 2.11
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000
	
	{  
	   "Configuration":"H264 Adaptive Bitrate MP4 Set 720p",
	   "MediaProcessorId":"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",
	   "TaskBody":"<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset assetName=\"Custom output name\">JobOutputAsset(0)</outputAsset></taskBody>"
	}

	--changeset_122fb0a4-cd80-4958-820f-346309967e4d--
	--batch_a01a5ec4-ba0f-4536-84b5-66c5a5a6d34e--
 


## Create a Job using a JobTemplate


When processing multiple Assets using a common set of Tasks, JobTemplates are useful to specify the default Task presets, order of Tasks, and so on.

The following example shows how to create a JobTemplate with a TaskTemplate defined inline. The TaskTemplate uses the Media Encoder Standard as the MediaProcessor to encode the Asset file; however, other MediaProcessors could be used as well. 


	POST https://media.windows.net/API/JobTemplates HTTP/1.1
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	x-ms-version: 2.11
	Authorization: Bearer <token value>
	Host: media.windows.net

	
	{"Name" : "NewJobTemplate25", "JobTemplateBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><jobTemplate><taskBody taskTemplateId=\"nb:ttid:UUID:071370A3-E63E-4E81-A099-AD66BCAC3789\"><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody></jobTemplate>", "TaskTemplates" : [{"Id" : "nb:ttid:UUID:071370A3-E63E-4E81-A099-AD66BCAC3789", "Configuration" : "H264 Smooth Streaming 720p", "MediaProcessorId" : "nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56", "Name" : "SampleTaskTemplate2", "NumberofInputAssets" : 1, "NumberofOutputAssets" : 1}] }
 

>[AZURE.NOTE]Unlike other Media Services entities, you must define a new GUID identifier for each TaskTemplate and place it in the taskTemplateId and Id property in your request body. The content identification scheme must follow the scheme described in Identify Azure Media Services Entities. Also, JobTemplates cannot be updated. Instead, you must create a new one with your updated changes.
 

If successful, the following response is returned:
	
	HTTP/1.1 201 Created
	
	. . .


The following example shows how to create a Job referencing a JobTemplate Id:

	POST https://media.windows.net/API/Jobs HTTP/1.1
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	x-ms-version: 2.11
	Authorization: Bearer <token value>
	Host: media.windows.net

	
	{"Name" : "NewTestJob", "InputMediaAssets" : [{"__metadata" : {"uri" : "https://media.windows.net/api/Assets('nb%3Acid%3AUUID%3A3f1fe4a2-68f5-4190-9557-cd45beccef92')"}}], "TemplateId" : "nb:jtid:UUID:15e6e5e6-ac85-084e-9dc2-db3645fbf0aa"}
	 

If successful, the following response is returned:
	
	HTTP/1.1 201 Created
	
	. . . 



##Media Services learning paths

[AZURE.INCLUDE [media-services-learning-paths-include](../../includes/media-services-learning-paths-include.md)]

##Provide feedback

[AZURE.INCLUDE [media-services-user-voice-include](../../includes/media-services-user-voice-include.md)]


##Next Steps
Now that you know how to create a job to encode an assset, go to the [How To Check Job Progress with Media Services](media-services-rest-check-job-progress.md) topic.


##See Also

[Get Media Processors](media-services-rest-get-media-processor.md)