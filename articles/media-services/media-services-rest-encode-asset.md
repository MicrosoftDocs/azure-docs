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
	ms.date="06/18/2015" 
	ms.author="juliako"/>


#How to encode an asset using Azure Media Encoder

This article is part of the [Media Services Video on Demand workflow](media-services-video-on-demand-workflow.md) series. 

##Overview
In order to deliver digital video over the internet you must compress the media. Digital video files are quite large and may be too big to deliver over the internet or for your customers’ devices to display properly. Encoding is the process of compressing video and audio so your customers can view your media.

Encoding jobs are one of the most common processing operations in Media Services. You create encoding jobs to convert media files from one encoding to another. When you encode, you can use the Media Services built-in Media Encoder. You can also use an encoder provided by a Media Services partner; third party encoders are available through the Azure Marketplace. You can specify the details of encoding tasks by using preset strings defined for your encoder, or by using preset configuration files. To see the types of presets that are available, see [Task Presets for Azure Media Services](https://msdn.microsoft.com/library/azure/dn619392.aspx). If you used a third party encoder, you should [validate your files](https://msdn.microsoft.com/library/azure/dn750842.aspx).

Each Job can have one or more Tasks depending on the type of processing that you want to accomplish. Through the REST API, you can create Jobs and their related Tasks in one of two ways: Tasks can be defined inline through the Tasks navigation property on Job entities, or through OData batch processing. The Media Services SDK uses batch processing; however, for the readability of the code examples in this topic, tasks are defined inline.  For information on batch processing, see [Open Data Protocol (OData) Batch Processing](http://www.odata.org/documentation/odata-version-3-0/batch-processing/). You can also find an example of batch processing in the [job](https://msdn.microsoft.com/library/azure/hh974289.aspx) topic.

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
	x-ms-version: 2.11
	Authorization: Bearer <token value>
	x-ms-client-request-id: 00000000-0000-0000-0000-000000000000
	Host: media.windows.net

	
	{"Name" : "NewTestJob", "InputMediaAssets" : [{"__metadata" : {"uri" : "https://media.windows.net/api/Assets('nb%3Acid%3AUUID%3Aaab7f15b-3136-4ddf-9962-e9ecb28fb9d2')"}}],  "Tasks" : [{"Configuration" : "H264 Broadband 720p", "MediaProcessorId" : "nb:mpid:UUID:70bdc2c3-ebf4-42a9-8542-5afc1e55d217",  "TaskBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody>"}]}

Response:
	
	HTTP/1.1 201 Created

	. . . 

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

The following example shows how to set the assetName attribute:

	{ "TaskBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset assetName=\"CustomOutputAssetName\">JobOutputAsset(0)</outputAsset></taskBody>"}



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

###Considerations

To enable task chaining:

- A job must have at least 2 tasks
- There must be at least one task whose input is output of another task in the job.


## Create a Job using a JobTemplate


When processing multiple Assets using a common set of Tasks, JobTemplates are useful to specify the default Task presets, order of Tasks, and so on.

The following example shows how to create a JobTemplate with a TaskTemplate defined inline. The TaskTemplate uses the Azure Media Encoder as the MediaProcessor to encode the Asset file; however, other MediaProcessors could be used as well. 


	POST https://media.windows.net/API/JobTemplates HTTP/1.1
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	x-ms-version: 2.11
	Authorization: Bearer <token value>
	Host: media.windows.net

	
	{"Name" : "NewJobTemplate25", "JobTemplateBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><jobTemplate><taskBody taskTemplateId=\"nb:ttid:UUID:071370A3-E63E-4E81-A099-AD66BCAC3789\"><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody></jobTemplate>", "TaskTemplates" : [{"Id" : "nb:ttid:UUID:071370A3-E63E-4E81-A099-AD66BCAC3789", "Configuration" : "H264 Smooth Streaming 720p", "MediaProcessorId" : "nb:mpid:UUID:2e7aa8f3-4961-4e0c-b4db-0e0439e524f5", "Name" : "SampleTaskTemplate2", "NumberofInputAssets" : 1, "NumberofOutputAssets" : 1}] }
 

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


##Controlling Media Service Encoder Output Filenames 

By default, the Azure Media Encoder creates output filenames by combining various attributes of the input asset and the encoding process. Each attribute is identified using a macro as discussed below.

The following is a complete list of the macros available for output file naming:
Audio Bitrate - the bitrate used when encoding the audio, specified in kbps

- Audio Codec the codec used for encoding audio, valid values are: AAC, WMA, and DDP
- Channel Count the number of audio channels encoded, valid values are: 1, 2, or 6
- Default extension – the default file extension 
- Language the BCP-47 language code representing the language used in the audio. This currently defaults to “und”. 
- Original File Name the name of the file uploaded into Azure Storage
- StreamId – the stream ID as defined by the streamID attribute of the <StreamInfo> element in the preset file 
- Video Codec the codec used for encoding, valid values are: H264 and VC1
- Video Bitrate the bitrate used when encoding the video, specified in kbps

These macros can be combine in any permutation to control the name of the files generated by the Media Services Encoder. For example, the default naming convention is:

	{Original File Name}_{Video Codec}{Video Bitrate}{Audio Codec}{Language}{Channel Count}{Audio Bitrate}.{Default Extension}

The file naming convention is specified using the DefaultMediaOutputFileName attribute of the [Preset](https://msdn.microsoft.com/library/azure/dn554334.aspx) element. For example:

	<Preset DefaultMediaOutputFileName="{Original file name}{StreamId}_LongOutputFileName{Bit Rate}{Video Codec}{Video Bitrate}{Audio Codec}{Audio Bitrate}{Language}{Channel Count}.{Default extension}"
	  Version="5.0">
	<MediaFile …>
	   <OutputFormat>
	      <MP4OutputFormat StreamCompatibility="Standard">
	         <VideoProfile>
	            <MainH264VideoProfile … >
	               <Streams  AutoSize="False"
	                         FreezeSort="False">
	                  <StreamInfo StreamId="1"
	                              Size="1280, 720">
	                     <Bitrate>
	                       <ConstantBitrate Bitrate="3400"
	                                        IsTwoPass="False"
	                                        BufferWindow="00:00:05" />
	                     </Bitrate>
	                   </StreamInfo>
	                  </Streams>
	               </MainH264VideoProfile>
	            </VideoProfile>
	         </MP4OutputFormat>
	   </OutputFormat>
	</MediaFile>

The encoder will insert underscores between each macro, for example, configuration above would result in a file name like: MyVideo_H264_4500kpbs_AAC_und_ch2_128kbps.mp4.

##Next Steps
Now that you know how to create a job to encode an assset, go to the [How To Check Job Progress with Media Services](media-services-rest-check-job-progress.md) topic.

[Azure Marketplace]: https://datamarket.azure.com/
[Encoder Preset]: http://msdn.microsoft.com/library/dn619392.aspx
[How to: Get a Media Processor Instance]:http://go.microsoft.com/fwlink/?LinkId=301732
[How to: Upload an Encrypted Asset]:http://go.microsoft.com/fwlink/?LinkId=301733
[How to: Deliver an Asset by Download]:http://go.microsoft.com/fwlink/?LinkId=301734
[How to Check Job Progress]:http://go.microsoft.com/fwlink/?LinkId=301737
[Task Preset for Azure Media Packager]:http://msdn.microsoft.com/library/windowsazure/hh973635.aspx
 