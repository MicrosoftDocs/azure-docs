---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Streaming Policies in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what Streaming Policies are, and how they are used by Azure Media Services.
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

# Streaming Policies

In Azure Media Services v3, Streaming Policies enable you to define streaming protocols and encryption options for your StreamingLocators. You can either specify the name of Streaming Policy you created or use one of the predefined Streaming Policies. The predefined Streaming Policies currently available are: 'Predefined_DownloadOnly', 'Predefined_ClearStreamingOnly', 'Predefined_DownloadAndClearStreaming', 'Predefined_ClearKey', 'Predefined_MultiDrmCencStreaming' and 'Predefined_MultiDrmStreaming'.

> [!IMPORTANT]
> When using a custom [StreamingPolicy](https://docs.microsoft.com/rest/api/media/streamingpolicies), you should design a limited set of such policies for your Media Service account, and re-use them for your StreamingLocators whenever the same encryption options and protocols are needed. Your Media Service account has a quota for the number of StreamingPolicy entries. You should not be creating a new StreamingPolicy for each StreamingLocator.

## StreamingPolicy definition

The following table shows the StreamingPolicy's properties and gives their definitions.

|Name|Description|
|---|---|
|id|Fully qualified resource ID for the resource.|
|name|The name of the resource.|
|properties.commonEncryptionCbcs|Configuration of CommonEncryptionCbcs|
|properties.commonEncryptionCenc|Configuration of CommonEncryptionCenc|
|properties.created	|Creation time of Streaming Policy|
|properties.defaultContentKeyPolicyName	|Default ContentKey used by current Streaming Policy|
|properties.envelopeEncryption	|Configuration of EnvelopeEncryption|
|properties.noEncryption|Configurations of NoEncryption|
|type|The type of the resource.|

For the full definition, see [Streaming Policies](https://docs.microsoft.com/rest/api/media/streamingpolicies).

## Filtering, ordering, paging

Media Services supports the following OData query options for Streaming Policies: 

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

The following table shows how these options may be applied to the StreamingPolicy properties: 

|Name|Filter|Order|
|---|---|---|
|id|||
|name|Eq, ne, ge, le, gt, lt|Ascending and descending|
|properties.commonEncryptionCbcs|||
|properties.commonEncryptionCenc|||
|properties.created	|Eq, ne, ge, le,  gt, lt|Ascending and descending|
|properties.defaultContentKeyPolicyName	|||
|properties.envelopeEncryption|||
|properties.noEncryption|||
|type|||

### Pagination

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 10.

> [!TIP]
> You should always use the next link to enumerate the collection and not depend on a particular page size.

If a query response contains many items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. You cannot configure the page size. 

If StreamingPolicy are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded.) 

The following C# example shows how to enumerate through all StreamingPolicies in the account.

```csharp
var firstPage = await MediaServicesArmClient.StreamingPolicies.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.StreamingPolicies.ListNextAsync(currentPage.NextPageLink);
}
```

For REST examples, see [Streaming Policies - List](https://docs.microsoft.com/rest/api/media/streamingpolicies/list)

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
