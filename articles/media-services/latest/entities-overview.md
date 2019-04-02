---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Developing with v3 APIs - Azure | Microsoft Docs
description: This article discusses rules that apply to entities and APIs when developing with Media Services v3. 
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/30/2019
ms.author: juliako
ms.custom: seodec18

---

# Developing with Media Services v3 APIs

This article discusses rules that apply to entities and APIs when developing with Media Services v3.

## Naming conventions

Azure Media Services v3 resource names (for example, Assets, Jobs, Transforms) are subject to Azure Resource Manager naming constraints. In accordance with Azure Resource Manager, the resource names are always unique. Thus, you can use any unique identifier strings (for example, GUIDs) for your resource names. 

Media Services resource names cannot include: '<', '>', '%', '&', ':', '&#92;', '?', '/', '*', '+', '.', the single quote character, or any control characters. All other characters are allowed. The max length of a resource name is 260 characters. 

For more information about Azure Resource Manager naming, see: [Naming requirements](https://github.com/Azure/azure-resource-manager-rpc/blob/master/v1.0/resource-api-reference.md#arguments-for-crud-on-resource) and [Naming conventions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions).

## v3 API design principles

One of the key design principles of the v3 API is to make the API more secure. v3 APIs do not return secrets or credentials on a **Get** or **List** operation. The keys are always null, empty, or sanitized from the response. You need to call a separate action method to get secrets or credentials. Separate actions enable you to set different RBAC security permissions in case some APIs do retrieve/display  secrets while other APIs do not. For information on how to manager access using RBAC, see [Use RBAC to manage access](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-rest).

Examples of this include:

* Not returning ContentKey values in the Get of the StreamingLocator.
* Not returning the restriction keys in the Get of the ContentKeyPolicy.
* Not returning the query string part of the URL (to remove the signature) of Jobs' HTTP Input URLs.

See the [Get content key policy - .NET](get-content-key-policy-dotnet-howto.md) example.

## Long-running operations

The operations marked with `x-ms-long-running-operation` in the Azure Media Services [swagger files](https://github.com/Azure/azure-rest-api-specs/blob/master/specification/mediaservices/resource-manager/Microsoft.Media/stable/2018-07-01/streamingservice.json) are long running operations. 

For details about how to track asynchronous Azure operations, see [Async operations](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-async-operations#monitor-status-of-operation)

Media Services has the following long-running operations:

* Create LiveEvent
* Update LiveEvent
* Delete LiveEvent
* Start LiveEvent
* Stop LiveEvent
* Reset LiveEvent
* Create LiveOutput
* Delete LiveOutput
* Create StreamingEndpoint
* Update StreamingEndpoint
* Delete StreamingEndpoint
* Start StreamingEndpoint
* Stop StreamingEndpoint
* Scale StreamingEndpoint


## Filtering, ordering, paging of Media Services entities

Media Services supports the following OData query options for Media Services v3 entities: 

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

Properties of entities that are of the Datetime type are always in UTC format.

### Page results

If a query response contains many items, the service returns an "\@odata.nextLink" property to get the next page of results. This can be used to page through the entire result set. You cannot configure the page size. The page size varies by the type of entity, please read the individual sections that follow for details.

If entities are created or deleted while paging through the collection, the changes are reflected in the returned results (if those changes are in the part of the collection that has not been downloaded). 

> [!TIP]
> You should always use the next link to enumerate the collection and not depend on a particular page size.

### Assets

#### Filtering/ordering

The following table shows how the filtering and ordering options may be applied to the [Asset](https://docs.microsoft.com/rest/api/media/assets) properties: 

|Name|Filter|Order|
|---|---|---|
|id|||
|name|eq, gt, lt| ascending and descending|
|properties.alternateId |eq||
|properties.assetId |eq||
|properties.container |||
|properties.created| eq, gt, lt| ascending and descending|
|properties.description |||
|properties.lastModified |||
|properties.storageAccountName |||
|properties.storageEncryptionFormat | ||
|type|||

The following C# example filters on the created date:

```csharp
var odataQuery = new ODataQuery<Asset>("properties/created lt 2018-05-11T17:39:08.387Z");
var firstPage = await MediaServicesArmClient.Assets.ListAsync(CustomerResourceGroup, CustomerAccountName, odataQuery);
```

#### Pagination 

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 1000.

##### C# example

The following C# example shows how to enumerate through all the assets in the account.

```csharp
var firstPage = await MediaServicesArmClient.Assets.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.Assets.ListNextAsync(currentPage.NextPageLink);
}
```

##### REST example

Consider the following example of where $skiptoken is used. Make sure you replace *amstestaccount* with your account name and set the *api-version* value to the latest version.

If you request a list of Assets like this:

```
GET  https://management.azure.com/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01 HTTP/1.1
x-ms-client-request-id: dd57fe5d-f3be-4724-8553-4ceb1dbe5aab
Content-Type: application/json; charset=utf-8
```

You would get back a response similar to this:

```
HTTP/1.1 200 OK
 
{
"value":[
{
"name":"Asset 0","id":"/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/amstestaccount/assets/Asset 0","type":"Microsoft.Media/mediaservices/assets","properties":{
"assetId":"00000000-5a4f-470a-9d81-6037d7c23eff","created":"2018-12-11T22:12:44.98Z","lastModified":"2018-12-11T22:15:48.003Z","container":"asset-98d07299-5a4f-470a-9d81-6037d7c23eff","storageAccountName":"amsdevc1stoaccount11","storageEncryptionFormat":"None"
}
},
// lots more assets
{
"name":"Asset 517","id":"/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaservices/amstestaccount/assets/Asset 517","type":"Microsoft.Media/mediaservices/assets","properties":{
"assetId":"00000000-912e-447b-a1ed-0f723913b20d","created":"2018-12-11T22:14:08.473Z","lastModified":"2018-12-11T22:19:29.657Z","container":"asset-fd05a503-912e-447b-a1ed-0f723913b20d","storageAccountName":"amsdevc1stoaccount11","storageEncryptionFormat":"None"
}
}
],"@odata.nextLink":"https:// management.azure.com/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01&$skiptoken=Asset+517"
}
```

You would then request the next page by sending a get request for:

```
https://management.azure.com/subscriptions/00000000-3761-485c-81bb-c50b291ce214/resourceGroups/mediaresources/providers/Microsoft.Media/mediaServices/amstestaccount/assets?api-version=2018-07-01&$skiptoken=Asset+517
```

For more REST examples, see [Assets - List](https://docs.microsoft.com/rest/api/media/assets/list)

### Content Key Policies

#### Filtering/ordering

The following table shows how these options may be applied to the [Content Key Policies](https://docs.microsoft.com/rest/api/media/contentkeypolicies) properties: 

|Name|Filter|Order|
|---|---|---|
|id|||
|name|eq, ne, ge, le, gt, lt|ascending and descending|
|properties.created	|eq, ne, ge, le,  gt, lt|ascending and descending|
|properties.description	|eq, ne, ge, le, gt, lt||
|properties.lastModified|eq, ne, ge, le, gt, lt|ascending and descending|
|properties.options	|||
|properties.policyId|eq, ne||
|type|||

#### Pagination

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 10.

The following C# example shows how to enumerate through all **Content Key Policies** in the account.

```csharp
var firstPage = await MediaServicesArmClient.ContentKeyPolicies.ListAsync(CustomerResourceGroup, CustomerAccountName);

var currentPage = firstPage;
while (currentPage.NextPageLink != null)
{
    currentPage = await MediaServicesArmClient.ContentKeyPolicies.ListNextAsync(currentPage.NextPageLink);
}
```

For REST examples, see [Content Key Policies - List](https://docs.microsoft.com/rest/api/media/contentkeypolicies/list)

### Jobs

#### Filtering/ordering

The following table shows how these options may be applied to the [Jobs](https://docs.microsoft.com/rest/api/media/jobs) properties: 

| Name    | Filter                        | Order |
|---------|-------------------------------|-------|
| name                    | eq            | ascending and descending|
| properties.state        | eq, ne        |                         |
| properties.created      | gt, ge, lt, le| ascending and descending|
| properties.lastModified | gt, ge, lt, le | ascending and descending| 


#### Pagination

Jobs pagination is supported in Media Services v3.

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

### Streaming Locators

#### Filtering/ordering

The following table shows how these options may be applied to the StreamingLocator properties: 

|Name|Filter|Order|
|---|---|---|
|id	|||
|name|eq, ne, ge, le, gt, lt|ascending and descending|
|properties.alternativeMediaId	|||
|properties.assetName	|||
|properties.contentKeys	|||
|properties.created	|eq, ne, ge, le,  gt, lt|ascending and descending|
|properties.defaultContentKeyPolicyName	|||
|properties.endTime	|eq, ne, ge, le, gt, lt|ascending and descending|
|properties.startTime	|||
|properties.streamingLocatorId	|||
|properties.streamingPolicyName	|||
|type	|||

#### Pagination

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 10.

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

### Streaming Policies

#### Filtering/ordering

The following table shows how these options may be applied to the StreamingPolicy properties: 

|Name|Filter|Order|
|---|---|---|
|id|||
|name|eq, ne, ge, le, gt, lt|ascending and descending|
|properties.commonEncryptionCbcs|||
|properties.commonEncryptionCenc|||
|properties.created	|eq, ne, ge, le,  gt, lt|ascending and descending|
|properties.defaultContentKeyPolicyName	|||
|properties.envelopeEncryption|||
|properties.noEncryption|||
|type|||

#### Pagination

Pagination is supported for each of the four enabled sort orders. Currently, the page size is 10.

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


### Transform

#### Filtering/ordering

The following table shows how these options may be applied to the [Transforms](https://docs.microsoft.com/rest/api/media/transforms) properties: 

| Name    | Filter                        | Order |
|---------|-------------------------------|-------|
| name                    | eq            | ascending and descending|
| properties.created      | gt, ge, lt, le| ascending and descending|
| properties.lastModified | gt, ge, lt, le | ascending and descending|

## Next steps

[Stream a file](stream-files-dotnet-quickstart.md)
