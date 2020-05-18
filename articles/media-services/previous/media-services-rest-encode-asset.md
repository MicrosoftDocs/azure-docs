---
title: How to encode an Azure asset by using Media Encoder Standard | Microsoft Docs
description: Learn how to use Media Encoder Standard to encode media content on Azure Media Services. Code samples use REST API.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.assetid: 2a7273c6-8a22-4f82-9bfe-4509ff32d4a4
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/20/2019
ms.author: juliako

---
# How to encode an asset by using Media Encoder Standard
> [!div class="op_single_selector"]
> * [.NET](media-services-dotnet-encode-with-media-encoder-standard.md)
> * [REST](media-services-rest-encode-asset.md)
> * [Portal](media-services-portal-encode.md)
>
>

## Overview

To deliver digital video over the Internet, you must compress the media. Digital video files are large and may be too large to deliver over the Internet, or for your customers’ devices to display properly. Encoding is the process of compressing video and audio so your customers can view your media.

Encoding jobs are one of the most common processing operations in Azure Media Services. You create encoding jobs to convert media files from one encoding to another. When you encode, you can use the Media Services built-in encoder (Media Encoder Standard). You can also use an encoder provided by a Media Services partner. Third-party encoders are available through the Azure Marketplace. You can specify the details of encoding tasks by using preset strings defined for your encoder, or by using preset configuration files. To see the types of presets that are available, see [Task Presets for Media Encoder Standard](https://msdn.microsoft.com/library/mt269960).

Each job can have one or more tasks depending on the type of processing that you want to accomplish. Through the REST API, you can create jobs and their related tasks in one of two ways:

* Tasks can be defined inline through the Tasks navigation property on Job entities.
* Use OData batch processing.

We recommend that you always encode your source files into an adaptive bitrate MP4 set, and then convert the set to the desired format by using [dynamic packaging](media-services-dynamic-packaging-overview.md).

If your output asset is storage encrypted, you must configure the asset delivery policy. For more information, see [Configuring asset delivery policy](media-services-rest-configure-asset-delivery-policy.md).

## Considerations

When accessing entities in Media Services, you must set specific header fields and values in your HTTP requests. For more information, see [Setup for Media Services REST API Development](media-services-rest-how-to-use.md).

Before you start referencing media processors, verify that you have the correct media processor ID. For more information, see [Get media processors](media-services-rest-get-media-processor.md).

## Connect to Media Services

For information on how to connect to the AMS API, see [Access the Azure Media Services API with Azure AD authentication](media-services-use-aad-auth-to-access-ams-api.md). 

## Create a job with a single encoding task

> [!NOTE]
> When you're working with the Media Services REST API, the following considerations apply:
>
> When accessing entities in Media Services, you must set specific header fields and values in your HTTP requests. For more information, see [Setup for Media Services REST API development](media-services-rest-how-to-use.md).
>
> When using JSON and specifying to use the **__metadata** keyword in the request (for example, to reference a linked object), you must set the **Accept** header to [JSON Verbose format](https://www.odata.org/documentation/odata-version-3-0/json-verbose-format/): Accept: application/json;odata=verbose.
>
>

The following example shows you how to create and post a job with one task set to encode a video at a specific resolution and quality. When you encode with Media Encoder Standard, you can use task configuration presets specified [here](https://msdn.microsoft.com/library/mt269960).

Request:

	POST https://media.windows.net/API/Jobs HTTP/1.1
	Content-Type: application/json;odata=verbose
	Accept: application/json;odata=verbose
	DataServiceVersion: 3.0
	MaxDataServiceVersion: 3.0
	x-ms-version: 2.19
        Authorization: Bearer <ENCODED JWT TOKEN> 
        x-ms-client-request-id: 00000000-0000-0000-0000-000000000000
        Host: media.windows.net

    {"Name" : "NewTestJob", "InputMediaAssets" : [{"__metadata" : {"uri" : "https://media.windows.net/api/Assets('nb%3Acid%3AUUID%3Aaab7f15b-3136-4ddf-9962-e9ecb28fb9d2')"}}],  "Tasks" : [{"Configuration" : "Adaptive Streaming", "MediaProcessorId" : "nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",  "TaskBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody>"}]}

Response:

    HTTP/1.1 201 Created

    . . .

### Set the output asset's name
The following example shows how to set the assetName attribute:

    { "TaskBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset assetName=\"CustomOutputAssetName\">JobOutputAsset(0)</outputAsset></taskBody>"}

## Considerations
* TaskBody properties must use literal XML to define the number of input, or output assets that are used by the task. The task article contains the XML Schema Definition for the XML.
* In the TaskBody definition, each inner value for `<inputAsset>` and `<outputAsset>` must be set as JobInputAsset(value) or JobOutputAsset(value).
* A task can have multiple output assets. One JobOutputAsset(x) can only be used once as an output of a task in a job.
* You can specify JobInputAsset or JobOutputAsset as an input asset of a task.
* Tasks must not form a cycle.
* The value parameter that you pass to JobInputAsset or JobOutputAsset represents the index value for an asset. The actual assets are defined in the InputMediaAssets and OutputMediaAssets navigation properties on the job entity definition.
* Because Media Services is built on OData v3, the individual assets in the InputMediaAssets and OutputMediaAssets navigation property collections are referenced through a "__metadata: uri" name-value pair.
* InputMediaAssets maps to one or more assets that you created in Media Services. OutputMediaAssets are created by the system. They don't reference an existing asset.
* OutputMediaAssets can be named by using the assetName attribute. If this attribute is not present, then the name of the OutputMediaAsset is whatever the inner text value of the `<outputAsset>` element is with a suffix of either the Job Name value, or the Job Id value (in the case where the Name property isn't defined). For example, if you set a value for assetName to "Sample," then the OutputMediaAsset Name property is set to "Sample." However, if you didn't set a value for assetName, but did set the job name to "NewJob," then the OutputMediaAsset Name would be "JobOutputAsset(value)_NewJob."

## Create a job with chained tasks
In many application scenarios, developers want to create a series of processing tasks. In Media Services, you can create a series of chained tasks. Each task performs different processing steps and can use different media processors. The chained tasks can hand off an asset from one task to another, performing a linear sequence of tasks on the asset. However, the tasks performed in a job are not required to be in a sequence. When you create a chained task, the chained **ITask** objects are created in a single **IJob** object.

> [!NOTE]
> There is currently a limit of 30 tasks per job. If you need to chain more than 30 tasks, create more than one job to contain the tasks.
>
>

    POST https://media.windows.net/api/Jobs HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
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


### Considerations
To enable task chaining:

* A job must have at least two tasks.
* There must be at least one task whose input is the output of another task in the job.

## Use OData batch processing
The following example shows how to use OData batch processing to create a job and tasks. For information on batch processing, see [Open Data Protocol (OData) Batch Processing](https://www.odata.org/documentation/odata-version-3-0/batch-processing/).

    POST https://media.windows.net/api/$batch HTTP/1.1
    DataServiceVersion: 1.0;NetFx
    MaxDataServiceVersion: 3.0;NetFx
    Content-Type: multipart/mixed; boundary=batch_a01a5ec4-ba0f-4536-84b5-66c5a5a6d34e
    Accept: multipart/mixed
    Accept-Charset: UTF-8
    Authorization: Bearer <ENCODED JWT TOKEN> 
    x-ms-version: 2.19
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
    Authorization: Bearer <ENCODED JWT TOKEN> 
    x-ms-version: 2.19
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
    Authorization: Bearer <ENCODED JWT TOKEN> 
    x-ms-version: 2.19
    x-ms-client-request-id: 00000000-0000-0000-0000-000000000000

    {  
       "Configuration":"H264 Adaptive Bitrate MP4 Set 720p",
       "MediaProcessorId":"nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56",
       "TaskBody":"<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset assetName=\"Custom output name\">JobOutputAsset(0)</outputAsset></taskBody>"
    }

    --changeset_122fb0a4-cd80-4958-820f-346309967e4d--
    --batch_a01a5ec4-ba0f-4536-84b5-66c5a5a6d34e--



## Create a job by using a JobTemplate
When you process multiple assets by using a common set of tasks, use a JobTemplate to specify the default task presets, or to set the order of tasks.

The following example shows how to create a JobTemplate with a TaskTemplate that is defined inline. The TaskTemplate uses the Media Encoder Standard as the MediaProcessor to encode the asset file. However, other MediaProcessors can be used as well.

    POST https://media.windows.net/API/JobTemplates HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
    Host: media.windows.net


    {"Name" : "NewJobTemplate25", "JobTemplateBody" : "<?xml version=\"1.0\" encoding=\"utf-8\"?><jobTemplate><taskBody taskTemplateId=\"nb:ttid:UUID:071370A3-E63E-4E81-A099-AD66BCAC3789\"><inputAsset>JobInputAsset(0)</inputAsset><outputAsset>JobOutputAsset(0)</outputAsset></taskBody></jobTemplate>", "TaskTemplates" : [{"Id" : "nb:ttid:UUID:071370A3-E63E-4E81-A099-AD66BCAC3789", "Configuration" : "H264 Smooth Streaming 720p", "MediaProcessorId" : "nb:mpid:UUID:ff4df607-d419-42f0-bc17-a481b1331e56", "Name" : "SampleTaskTemplate2", "NumberofInputAssets" : 1, "NumberofOutputAssets" : 1}] }


> [!NOTE]
> Unlike other Media Services entities, you must define a new GUID identifier for each TaskTemplate and place it in the taskTemplateId and Id property in your request body. The content identification scheme must follow the scheme described in Identify Azure Media Services Entities. Also, JobTemplates cannot be updated. Instead, you must create a new one with your updated changes.
>
>

If successful, the following response is returned:

    HTTP/1.1 201 Created

    . . .


The following example shows how to create a job that references a JobTemplate Id:

    POST https://media.windows.net/API/Jobs HTTP/1.1
    Content-Type: application/json;odata=verbose
    Accept: application/json;odata=verbose
    DataServiceVersion: 3.0
    MaxDataServiceVersion: 3.0
    x-ms-version: 2.19
    Authorization: Bearer <ENCODED JWT TOKEN> 
    Host: media.windows.net


    {"Name" : "NewTestJob", "InputMediaAssets" : [{"__metadata" : {"uri" : "https://media.windows.net/api/Assets('nb%3Acid%3AUUID%3A3f1fe4a2-68f5-4190-9557-cd45beccef92')"}}], "TemplateId" : "nb:jtid:UUID:15e6e5e6-ac85-084e-9dc2-db3645fbf0aa"}


If successful, the following response is returned:

    HTTP/1.1 201 Created

    . . .


## Advanced Encoding Features to explore
* [How to generate thumbnails](media-services-dotnet-generate-thumbnail-with-mes.md)
* [Generating thumbnails during encoding](media-services-dotnet-generate-thumbnail-with-mes.md#example-of-generating-a-thumbnail-while-encoding)
* [Crop videos during encoding](media-services-crop-video.md)
* [Customizing encoding presets](media-services-custom-mes-presets-with-dotnet.md)
* [Overlay or watermark a video with an image](media-services-advanced-encoding-with-mes.md#overlay)

## Media Services learning paths
[!INCLUDE [media-services-learning-paths-include](../../../includes/media-services-learning-paths-include.md)]

## Provide feedback
[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]

## Next steps
Now that you know how to create a job to encode an asset, see [How to check job progress with Media Services](media-services-rest-check-job-progress.md).

## See also
[Get Media Processors](media-services-rest-get-media-processor.md)
