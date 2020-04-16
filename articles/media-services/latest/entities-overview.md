---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Filtering, ordering, and paging of Media Services entities
titleSuffix: Azure Media Services
description: Learn about filtering, ordering, and paging of Azure Media Services v3 entities. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 01/21/2020
ms.author: juliako
ms.custom: seodec18

---

# Filtering, ordering, and paging of Media Services entities

This topic discusses the OData query options and pagination support available when you're listing Azure Media Services v3 entities.

## Considerations

* Properties of entities that are of the `Datetime` type are always in UTC format.
* White space in the query string should be URL-encoded before you send a request.

## Comparison operators

You can use the following operators to compare a field to a constant value:

Equality operators:

- `eq`: Test whether a field is *equal to* a constant value.
- `ne`: Test whether a field is *not equal to* a constant value.

Range operators:

- `gt`: Test whether a field is *greater than* a constant value.
- `lt`: Test whether a field is *less than* a constant value.
- `ge`: Test whether a field is *greater than or equal to* a constant value.
- `le`: Test whether a field is *less than or equal to* a constant value.

## Filter

Use `$filter` to supply an OData filter parameter to find only the objects you're interested in.

The following REST example filters on the `alternateId` value of an asset:

```
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01&$filter=properties/alternateId%20eq%20'unique identifier'
```

The following C# example filters on the asset's created date:

```csharp
var odataQuery = new ODataQuery<Asset>("properties/created lt 2018-05-11T17:39:08.387Z");
var firstPage = await MediaServicesArmClient.Assets.ListAsync(CustomerResourceGroup, CustomerAccountName, odataQuery);
```

## Order by

Use `$orderby` to sort the returned objects by the specified parameter. For example:  

```
GET https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01$orderby=properties/created%20gt%202018-05-11T17:39:08.387Z
```

To sort the results in ascending or descending order, append either `asc` or `desc` to the field name, separated by a space. For example: `$orderby properties/created desc`.

## Skip token

If a query response contains many items, the service returns a `$skiptoken` (`@odata.nextLink`) value that you use to get the next page of results. Use it to page through the entire result set.

In Media Services v3, you can't configure the page size. The page size varies by the type of entity. Read the individual sections that follow for details.

If entities are created or deleted while you're paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that hasn't been downloaded).

> [!TIP]
> Always use `nextLink` to enumerate the collection and don't depend on a particular page size.
>
> The `nextLink` value will be present only if there's more than one page of entities.

Consider the following example of where `$skiptoken` is used. Make sure you replace *amstestaccount* with your account name and set the *api-version* value to the latest version.

If you request a list of assets like this:

```
GET  https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01 HTTP/1.1
x-ms-client-request-id: dd57fe5d-f3be-4724-8553-4ceb1dbe5aab
Content-Type: application/json; charset=utf-8
```

You'll get back a response similar to this one:

```
HTTP/1.1 200 OK

{
"value":[
{
"name":"Asset 0","id":"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/amstestaccount/assets/Asset 0","type":"Microsoft.Media/mediaservices/assets","properties":{
"assetId":"00000000-0000-0000-0000-000000000000","created":"2018-12-11T22:12:44.98Z","lastModified":"2018-12-11T22:15:48.003Z","container":"asset-00000000-0000-0000-0000-0000000000000","storageAccountName":"amsacctname","storageEncryptionFormat":"None"
}
},
// lots more assets
{
"name":"Asset 517","id":"/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/amstestaccount/assets/Asset 517","type":"Microsoft.Media/mediaservices/assets","properties":{
"assetId":"00000000-0000-0000-0000-000000000000","created":"2018-12-11T22:14:08.473Z","lastModified":"2018-12-11T22:19:29.657Z","container":"asset-00000000-0000-0000-0000-000000000000","storageAccountName":"amsacctname","storageEncryptionFormat":"None"
}
}
],"@odata.nextLink":"https:// management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01&$skiptoken=Asset+517"
}
```

You would then request the next page by sending a get request for:

```
https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01&$skiptoken=Asset+517
```

The following C# example shows how to enumerate through all streaming locators in the account.

```csharp
var firstPage = await MediaServicesArmClient.StreamingLocators.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.StreamingLocators.ListNextAsync(currentPage.NextPageLink);
}
```

## Using logical operators to combine query options

Media Services v3 supports **OR** and **AND** logical operators. 

The following REST example checks the job's state:

```
https://management.azure.com/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/qbtest/providers/Microsoft.Media/mediaServices/qbtest/transforms/VideoAnalyzerTransform/jobs?$filter=properties/state%20eq%20Microsoft.Media.JobState'Scheduled'%20or%20properties/state%20eq%20Microsoft.Media.JobState'Processing'&api-version=2018-07-01
```

You construct the same query in C# like this: 

```csharp
var odataQuery = new ODataQuery<Job>("properties/state eq Microsoft.Media.JobState'Scheduled' or properties/state eq Microsoft.Media.JobState'Processing'");
client.Jobs.List(config.ResourceGroup, config.AccountName, VideoAnalyzerTransformName, odataQuery);
```

## Filtering and ordering options of entities

The following table shows how you can apply the filtering and ordering options to different entities:

|Entity name|Property name|Filter|Order|
|---|---|---|---|
|[Assets](https://docs.microsoft.com/rest/api/media/assets/)|name|`eq`, `gt`, `lt`, `ge`, `le`|`asc` and `desc`|
||properties.alternateId |`eq`||
||properties.assetId |`eq`||
||properties.created| `eq`, `gt`, `lt`| `asc` and `desc`|
|[Content key policies](https://docs.microsoft.com/rest/api/media/contentkeypolicies)|name|`eq`, `ne`, `ge`, `le`, `gt`, `lt`|`asc` and `desc`|
||properties.created    |`eq`, `ne`, `ge`, `le`, `gt`, `lt`|`asc` and `desc`|
||properties.description    |`eq`, `ne`, `ge`, `le`, `gt`, `lt`||
||properties.lastModified|`eq`, `ne`, `ge`, `le`, `gt`, `lt`|`asc` and `desc`|
||properties.policyId|`eq`, `ne`||
|[Jobs](https://docs.microsoft.com/rest/api/media/jobs)| name  | `eq`            | `asc` and `desc`|
||properties.state        | `eq`, `ne`        |                         |
||properties.created      | `gt`, `ge`, `lt`, `le`| `asc` and `desc`|
||properties.lastModified | `gt`, `ge`, `lt`, `le` | `asc` and `desc`| 
|[Streaming locators](https://docs.microsoft.com/rest/api/media/streaminglocators)|name|`eq`, `ne`, `ge`, `le`, `gt`, `lt`|`asc` and `desc`|
||properties.created    |`eq`, `ne`, `ge`, `le`,  `gt`, `lt`|`asc` and `desc`|
||properties.endTime    |`eq`, `ne`, `ge`, `le`, `gt`, `lt`|`asc` and `desc`|
|[Streaming policies](https://docs.microsoft.com/rest/api/media/streamingpolicies)|name|`eq`, `ne`, `ge`, `le`, `gt`, `lt`|`asc` and `desc`|
||properties.created    |`eq`, `ne`, `ge`, `le`, `gt`, `lt`|`asc` and `desc`|
|[Transforms](https://docs.microsoft.com/rest/api/media/transforms)| name | `eq`            | `asc` and `desc`|
|| properties.created      | `gt`, `ge`, `lt`, `le`| `asc` and `desc`|
|| properties.lastModified | `gt`, `ge`, `lt`, `le`| `asc` and `desc`|

## Next steps

* [List Assets](https://docs.microsoft.com/rest/api/media/assets/list)
* [List Content Key Policies](https://docs.microsoft.com/rest/api/media/contentkeypolicies/list)
* [List Jobs](https://docs.microsoft.com/rest/api/media/jobs/list)
* [List Streaming Policies](https://docs.microsoft.com/rest/api/media/streamingpolicies/list)
* [List Streaming Locators](https://docs.microsoft.com/rest/api/media/streaminglocators/list)
* [Stream a file](stream-files-dotnet-quickstart.md)
* [Quotas and limits](limits-quotas-constraints.md)
