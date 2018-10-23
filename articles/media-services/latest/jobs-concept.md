---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Jobs in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what jobs are in Azure Media Services.
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

# Jobs

Azure Media Services v3 introduces a new templated workflow resource for a recipe that you want to use to encode and/or analyze your videos, called **Transforms**. **Transforms** can be used to configure common tasks for encoding or analyzing videos. Each **Transform** describes a simple workflow of tasks for processing your video or audio files. 

A **Job** is the actual request to Azure Media Services to apply the **Transform** (recipe) to a given input video or audio content. The **Job** specifies information like the location of the input video, and the location for the output. You can specify the location of your input video using: HTTP(s) URLs, SAS URLs, or a path to files located locally or in Azure Blob storage.

The progress and state of encoding and/or analyzing jobs can be obtained by monitoring events with Event Grid. For more information, see [Monitor events using CLI](job-state-events-cli-how-to.md ).

## Jobs definition

The following table shows Jobs's properties and gives their definitions.

|Name|Type|Description|
|---|---|---|
|id|string|Fully qualified resource ID for the resource.|
|name	|string|The name of the resource.|
|properties.correlationData	|object|Customer provided correlation data (immutable) that is returned as part of Job and JobOutput states in the Event Grid notification system.|
|properties.created	|string|The UTC date and time when the Job was created, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.description	|string|Optional customer supplied description of the Job.|
|properties.input|JobInput:<br/>JobInputClip<br/>JobInputs|The inputs for the Job.|
|properties.lastModified	|string|The UTC date and time when the Job was last updated, in 'YYYY-MM-DDThh:mm:ssZ' format.|
|properties.outputs|JobOutput[]:<br/>JobOutputAsset[]<br/>|The outputs for the Job.|
|properties.priority	|Priority|Priority with which the job should be processed. Higher priority jobs are processed before lower priority jobs. If not set, the default is normal.|
|properties.state	|JobState|The current state of the job.|
|type	|string|The type of the resource.|

For the full definition, see [Jobs](https://docs.microsoft.com/rest/api/media/jobs).

## Pagination

Jobs pagination is supported in Media Services v3.

> [!TIP]
> You should always use the next link to enumerate the collection and not depend on a particular page size.

If a query response contains many items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. You cannot configure the page size. 

If Jobs are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded.) 

The following C# example shows how to enumerate through all the assets in the account.

```csharp
var firstPage = await MediaServicesArmClient.Jobs.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.Jobs.ListNextAsync(currentPage.NextPageLink);
}
```

For REST examples, see [Jobs - List](https://docs.microsoft.com/rest/api/media/jobs/list)

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
