---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Content Key Policies in Media Services - Azure | Microsoft Docs
description: This article gives an explanation of what Content Key Policies are, and how they are used by Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 12/20/2018
ms.author: juliako
ms.custom: seodec18

---

# Content Key Policies

You can use Azure Media Services to secure your media from the time it leaves your computer through storage, processing, and delivery. With Media Services, you can deliver your live and on-demand content encrypted dynamically with Advanced Encryption Standard (AES-128) or any of the three major digital rights management (DRM) systems: Microsoft PlayReady, Google Widevine, and Apple FairPlay. Media Services also provides a service for delivering AES keys and DRM (PlayReady, Widevine, and FairPlay) licenses to authorized clients.

In Azure Media Services v3, a [Content Key Policy](https://docs.microsoft.com/rest/api/media/contentkeypolicies) enables you to specify how the content key is delivered to end clients via the Media Services Key Delivery component. For more information, see [Content protection overview](content-protection-overview.md).

It is recommended that you reuse the same ContentKeyPolicy for all of your Assets. ContentKeyPolicies are updatable so if you want to do a key rotation then you can either add a new ContentKeyPolicyOption to the existing ContentKeyPolicy with a token restriction with the new keys. Or, you can update the primary verification key and the list of alternate verification keys in the existing policy and option. It can take up to 15 minutes for the Key Delivery caches to update and pick up the updated policy.

## ContentKeyPolicy definition

The following table shows the ContentKeyPolicy's properties and gives their definitions.

|Name|Description|
|---|---|
|id|Fully qualified resource ID for the resource.|
|name|The name of the resource.|
|properties.created	|The creation date of the Policy|
|properties.description	|A description for the Policy.|
|properties.lastModified|The last modified date of the Policy|
|properties.options	|The Key Policy options.|
|properties.policyId|The legacy Policy ID.|
|type|The type of the resource.|

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

The following table shows how these options may be applied to the ContentKeyPolicies properties: 

|Name|Filter|Order|
|---|---|---|
|id|||
|name|Eq, ne, ge, le, gt, lt|Ascending and descending|
|properties.created	|Eq, ne, ge, le,  gt, lt|Ascending and descending|
|properties.description	|Eq, ne, ge, le, gt, lt||
|properties.lastModified|Eq, ne, ge, le, gt, lt|Ascending and descending|
|properties.options	|||
|properties.policyId|Eq, ne||
|type|||

### Pagination

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 10.

> [!TIP]
> You should always use the next link to enumerate the collection and not depend on a particular page size.

If a query response contains many items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. You cannot configure the page size. 

If ContentKeyPolicies are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded.) 

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
