---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Streaming Locators in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what Streaming Locators are, and how they are used by Azure Media Services.
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

# Streaming Locators

To provide your clients with a URL that they can use to play back encoded video or audio files, you need to create a [StreamingLocator](https://docs.microsoft.com/rest/api/media/streaminglocators) and build the streaming URLs. For more information, see [Stream a file](stream-files-dotnet-quickstart.md).

## StreamingLocator definition

The following table shows the StreamingLocator's properties and gives their definitions.

|Name|Description|
|---|---|
|id	|Fully qualified resource ID for the resource.|
|name	|The name of the resource.|
|properties.alternativeMediaId|Alternative Media ID of this Streaming Locator.|
|properties.assetName	|Asset name|
|properties.contentKeys	|The ContentKeys used by this Streaming Locator.|
|properties.created	|The creation time of the Streaming Locator.|
|properties.defaultContentKeyPolicyName|Name of the default ContentKeyPolicy used by this Streaming Locator.|
|properties.endTime	|The end time of the Streaming Locator.|
|properties.startTime|The start time of the Streaming Locator.|
|properties.streamingLocatorId|The StreamingLocatorId of the Streaming Locator.|
|properties.streamingPolicyName	|Name of the Streaming Policy used by this Streaming Locator. Either specify the name of Streaming Policy you created or use one of the predefined Streaming Policies. The predefined Streaming Policies available are: 'Predefined_DownloadOnly', 'Predefined_ClearStreamingOnly', 'Predefined_DownloadAndClearStreaming', 'Predefined_ClearKey', 'Predefined_MultiDrmCencStreaming' and 'Predefined_MultiDrmStreaming'|
|type|The type of the resource.|

For the full definition, see [Streaming Locators](https://docs.microsoft.com/rest/api/media/streaminglocators).

## Filtering, ordering, paging

Media Services supports the following OData query options for Streaming Locators: 

* $filter 
* $orderby 
* $top 
* $skiptoken 

Operator description:

* Eq = equal to
* Ne = not equal to
* Ge = Greater than or equal to
* Le = Less than or equal to
* Gt = Greater than
* Lt = Less than

### Filtering/ordering

The following table shows how these options may be applied to the StreamingLocator properties: 

|Name|Filter|Order|
|---|---|---|
|id	|||
|name|Eq, ne, ge, le, gt, lt|Ascending and descending|
|properties.alternativeMediaId	|||
|properties.assetName	|||
|properties.contentKeys	|||
|properties.created	|Eq, ne, ge, le,  gt, lt|Ascending and descending|
|properties.defaultContentKeyPolicyName	|||
|properties.endTime	|Eq, ne, ge, le, gt, lt|Ascending and descending|
|properties.startTime	|||
|properties.streamingLocatorId	|||
|properties.streamingPolicyName	|||
|type	|||

### Pagination

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 10.

> [!TIP]
> You should always use the next link to enumerate the collection and not depend on a particular page size.

If a query response contains many items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. You cannot configure the page size. 

If StreamingLocators are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded.) 

The following C# example shows how to enumerate through all StreamingLocators in the account.

```csharp
var firstPage = await MediaServicesArmClient.StreamingLocators.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.StreamingLocators.ListNextAsync(currentPage.NextPageLink);
}
```

For REST examples, see [Streaming Locators - List](https://docs.microsoft.com/rest/api/media/streaminglocators/list)

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
