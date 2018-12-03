---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Transforms and Jobs in Azure Media Services | Microsoft Docs
description: When using Media Services, you need to create a Transform to describe the rules or specifications for processing your videos. This article gives an overview of what Transform is and how to use it. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 10/22/2018
ms.author: juliako
---

# Transforms and Jobs
 
Azure Media Services v3 introduces a new templated workflow resource for a recipe that you want to use to encode and/or analyze your videos, called [Transforms](https://docs.microsoft.com/rest/api/media/transforms). **Transforms** can be used to configure common tasks for encoding or analyzing videos. Each **Transform** describes a recipe, or a workflow of tasks for processing your video or audio files. 

A **Job** is the actual request to Azure Media Services to apply the **Transform** to a given input video or audio content. The **Job** specifies information such as the location of the input video, and the location for the output. You can specify the location of your input video using: HTTPs URLs, SAS URLs, or [Media Services Assets](https://docs.microsoft.com/rest/api/media/assets).  

## Typical workflow

1. Create a Transform 
2. Submit Jobs under that Transform 
3. List Transforms 
4. Delete a Transform, if you are not planning to use it in the future. 

Suppose you wanted to extract the first frame of all your videos as a thumbnail image – the steps you would take are: 

1. Define the recipe, or the rule for processing your videos - "use the first frame of the video as the thumbnail". 
2. For each video you would tell the service: 
    1. Where to find that video,  
    2. Where to write the output thumbnail image. 

A **Transform** helps you create the recipe once (Step 1), and submit Jobs using that recipe (Step 2).

## Transforms

You can create Transforms in your Media Services account using the v3 API directly, or using any of the published SDKs. The Media Services v3 API is driven by Azure Resource Manager, so you can also use Resource Manager templates to create and deploy Transforms in your Media Services account. Role-based access control can be used to lock down access to Transforms.

### Transform definition

The following table shows the Transform's properties and gives their definitions.

|Name|Description|
|---|---|
|Id|Fully qualified resource ID for the resource.|
|name|The name of the resource.|
|properties.created |The UTC date and time when the Transform was created, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.description |An optional verbose description of the Transform.|
|properties.lastModified |The UTC date and time when the Transform was last updated, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.outputs |An array of one or more TransformOutputs that the Transform should generate.|
|type|The type of the resource.|

For the full definition, see [Transforms](https://docs.microsoft.com/rest/api/media/transforms).

As explained above, a Transform helps you create a recipe or rule for processing your videos. A single Transform can apply more than one rule. For example, a Transform could specify that each video be encoded into an MP4 file at a given bitrate, and that a thumbnail image be generated from the first frame of the video. You would add one TransformOutput entry for each rule that you want to include in your Transform.

> [!NOTE]
> While the Transforms definition supports an Update operation, you should take care to make sure all in-progress Jobs complete before you make a modification. Typically, you would update an existing Transform to change the description, or modify the priorities of the underlying TransformOutputs. If you wanted to rewrite the recipe, then you would create a new Transform.

## Jobs

Once a Transform has been created, you can submit Jobs using Media Services APIs, or any of the published SDKs. The progress and state of jobs can be obtained by monitoring events with Event Grid. For more information, see [Monitor events using EventGrid](job-state-events-cli-how-to.md ).

### Jobs definition

The following table shows Jobs's properties and gives their definitions.

|Name|Description|
|---|---|
|id|Fully qualified resource ID for the resource.|
|name	|The name of the resource.|
|properties.correlationData	|Customer provided correlation data (immutable) that is returned as part of Job and JobOutput state change notifications. For more information, see [Event schemas](media-services-event-schemas.md)<br/><br/>The property can also be used for multi-tenant usage of Media Services. You can put tenant IDs in the jobs. |
|properties.created	|The UTC date and time when the Job was created, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.description	|Optional customer supplied description of the Job.|
|properties.input|The inputs for the Job.|
|properties.lastModified	|The UTC date and time when the Job was last updated, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.outputs|The outputs for the Job.|
|properties.priority	|Priority with which the job should be processed. Higher priority jobs are processed before lower priority jobs. If not set, the default is normal.|
|properties.state	|The current state of the job.|
|type	|The type of the resource.|

For the full definition, see [Jobs](https://docs.microsoft.com/rest/api/media/jobs).

> [!NOTE]
> While the Jobs definition supports an Update operation, the only properties that can be modified after the Job is submitted are the description, and the priority. Further, a change to the priority is effective only if the Job is still in a queued state. If the job has begun processing, or has finished, changing the priority has no effect.

### Pagination

Jobs pagination is supported in Media Services v3.

> [!TIP]
> You should always use the next link to enumerate the collection and not depend on a particular page size.

If a query response contains many items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. You cannot configure the page size. 

If Jobs are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded.) 

The following C# example shows how to enumerate through the jobs in the account.

```csharp            
List<string> jobsToDelete = new List<string>();
var pageOfJobs = client.Jobs.List(config.ResourceGroup, config.AccountName, "Encode");

bool exit;
do
{
    foreach (Job j in pageOfJobs)
    {
        jobsToDelete.Add(j.Name);
    }

    if (pageOfJobs.NextPageLink != null)
    {
        pageOfJobs = client.Jobs.ListNext(pageOfJobs.NextPageLink);
        exit = false;
    }
    else
    {
        exit = true;
    }
}
while (!exit);

```

For REST examples, see [Jobs - List](https://docs.microsoft.com/rest/api/media/jobs/list)


## Next steps

[Stream video files](stream-files-dotnet-quickstart.md)
