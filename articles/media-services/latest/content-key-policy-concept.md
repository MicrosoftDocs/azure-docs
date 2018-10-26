---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Content Key Policies in Azure Media Services | Microsoft Docs
description: This article gives an explanation of what Content Key Policies are, and how they are used by Azure Media Services.
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

# Content Key Policies

You can use Azure Media Services to secure your media from the time it leaves your computer through storage, processing, and delivery. With Media Services, you can deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients.

In Azure Media Services v3, Content Key Policies enable you to specify how the content key is delivered to end clients via the Media Services Key Delivery component. For more information, see [Content protection overview](content-protection-overview.md).

## ContentKeyPolicies definition

The following table shows the ContentKeyPolicy's properties and gives their definitions.

|Name|Description|
|---|---|
|id|Fully qualified resource ID for the resource.|
|name|The name of the resource.|
|properties.created	|The creation date of the Policy|
|properties.description	|A description for the Policy.|
|properties.lastModified|The last modified date of the Policy|
|properties.options	|The Key Policy options.|
|properties.policyId	|The legacy Policy ID.|
|type	|The type of the resource.|

For the full definition, see [Content Key Policies](https://docs.microsoft.com/rest/api/media/contentkeypolicies).

## Filtering, ordering, paging

Media Services supports the following OData query options for ContentKeyPolicies: 

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
|properties.created	|Eq, ne, ge, le,  gt, lt|Ascending and descending|
|properties.description	|Eq, ne, ge, le, gt, lt||
|properties.lastModified	|Eq, ne, ge, le, gt, lt|Ascending and descending|
|properties.options	|||
|properties.policyId	|Eq, ne||
|type	|||

### Pagination

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 10.

> [!TIP]
> You should always use the next link to enumerate the collection and not depend on a particular page size.

If a query response contains many items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. You cannot configure the page size. 

If StreamingPolicy are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded.) 

The following C# example shows how to enumerate through all ContentKeyPolicies in the account.

```csharp
var firstPage = await MediaServicesArmClient.ContentKeyPolicies.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.ContentKeyPolicies.ListNextAsync(currentPage.NextPageLink);
}
```

For REST examples, see [Content Key Policies - List](https://docs.microsoft.com/rest/api/media/contentkeypolicies/list)

## Next steps

[Use AES-128 dynamic encryption and the key delivery service](protect-with-aes128.md)

[Use DRM dynamic encryption and license delivery service](protect-with-drm.md)
