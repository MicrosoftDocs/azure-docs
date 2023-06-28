---
title: Upgrade to the Azure Search .NET Management SDK
titleSuffix: Azure Cognitive Search
description: Upgrade to the Azure Search .NET Management SDK from previous versions. Learn about new features and the code changes necessary for migration.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.devlang: csharp
ms.custom: ignite-2022, devx-track-dotnet
ms.topic: conceptual
ms.date: 10/03/2022
---

# Upgrading versions of the Azure Search .NET Management SDK

This article explains how to migrate to successive versions of the Azure Search .NET Management SDK, used to provision or deprovision search services, adjust capacity, and manage API keys.

Management SDKs target a specific version of the Management REST API. For more information about concepts and operations, see [Search Management (REST)](/rest/api/searchmanagement/).

## Versions

Microsoft.Azure.Management.Search is now deprecated. We recommend [Azure.ResourceManager.Search](https://github.com/Azure/azure-sdk-for-net/blob/Azure.ResourceManager.Search_1.0.0/sdk/search/Azure.ResourceManager.Search/README.md) instead.

| SDK version | Corresponding REST API version | Feature addition or behavior change |
|-------------|--------------------------------|-------------------------------------|
| [1.0](https://www.nuget.org/packages/Azure.ResourceManager.Search/) | api-version=2020-08-01 | This is a new package from the Azure SDK team that implements approaches and standards that are common to resource management in Azure. There's no migration path. If you've used the previous client library for service administration in Azure Cognitive Search, you should redesign your solution to use the new `Azure.ResourceManager.Search` package. See the [readme](https://github.com/Azure/azure-sdk-for-net/blob/Azure.ResourceManager.Search_1.0.0/sdk/search/Azure.ResourceManager.Search/README.md) for links and next steps.|
| [3.0](https://www.nuget.org/packages/Microsoft.Azure.Management.Search/3.0.0) | api-version=2020-30-20 | Adds endpoint security (IP firewalls and integration with [Azure Private Link](../private-link/private-endpoint-overview.md)) |
| [2.0](https://www.nuget.org/packages/Microsoft.Azure.Management.Search/2.0.0) | api-version=2019-10-01 | Usability improvements. Breaking change on [List Query Keys](/rest/api/searchmanagement/2021-04-01-preview/query-keys/list-by-search-service) (GET is discontinued). |
| [1.0](https://www.nuget.org/packages/Microsoft.Azure.Management.Search/1.0.1) | api-version=2015-08-19  | First version |

## How to upgrade

1. Review the [client library changelist](https://github.com/Azure/azure-sdk-for-net/blob/Azure.ResourceManager.Search_1.0.0/sdk/search/Azure.ResourceManager.Search/CHANGELOG.md) for insight into the scope of changes.

1. In your application code, delete the reference to `Microsoft.Azure.Management.Search` and its dependencies.

1. Add a reference for `Azure.ResourceManager.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

1. Once NuGet has downloaded the new packages and their dependencies, replace the API calls.

<!-- | Old API | New API |
|---------|---------|
| [CreateOrUpdateWithHttpMessagesAsync Method](/dotnet/api/microsoft.azure.management.search.iservicesoperations.createorupdatewithhttpmessagesasync) | TBD  |
| [CheckNameAvailabilityWithHttpMessagesAsync Method](/dotnet/api/microsoft.azure.management.search.iservicesoperations.checknameavailabilitywithhttpmessagesasync)  | TBD |
| [IAdminKeysOperations.GetWithHttpMessagesAsync Method](/dotnet/api/microsoft.azure.management.search.iadminkeysoperations.getwithhttpmessagesasync) | TBD | -->

## Upgrade to 3.0

Version 3.0 adds private endpoint protection by restricting access to IP ranges, and by optionally integrating with Azure Private Link for search services that shouldn't be visible on the public internet.

### New APIs

| API | Category| Details |
|-----|--------|------------------|
| [NetworkRuleSet](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#networkruleset) | IP firewall | Restrict access to a service endpoint to a list of allowed IP addresses. See [Configure IP firewall](service-configure-firewall.md) for concepts and portal instructions. |
| [Shared Private Link Resource](/rest/api/searchmanagement/2021-04-01-preview/shared-private-link-resources) | Private Link | Create a shared private link resource to be used by a search service.  |
| [Private Endpoint Connections](/rest/api/searchmanagement/2021-04-01-preview/private-endpoint-connections) | Private Link | Establish and manage connections to a search service through private endpoint. See [Create a private endpoint](service-create-private-endpoint.md) for concepts and portal instructions.|
| [Private Link Resources](/rest/api/searchmanagement/2021-04-01-preview/private-link-resources) | Private Link | For a search service that has a private endpoint connection, get a list of all services used in the same virtual network. If your search solution includes indexers that pull from Azure data sources (such as Azure Storage, Azure Cosmos DB, Azure SQL), or uses Azure AI services or Key Vault, then all of those resources should have endpoints in the virtual network, and this API should return a list. |
| [PublicNetworkAccess](/rest/api/searchmanagement/2021-04-01-preview/services/create-or-update#publicnetworkaccess)| Private Link | This is a property on Create or Update Service requests. When disabled, private link is the only access modality. |

### Breaking changes

You can no longer use GET on a [List Query Keys](/rest/api/searchmanagement/2021-04-01-preview/query-keys/list-by-search-service) request. In previous releases you could use either GET or POST, in this release and in all releases moving forward, only POST is supported. 

## Upgrade to 2.0

Version 2 of the Azure Search .NET Management SDK is a minor upgrade, so changing your code should require only minimal effort. The changes to the SDK are strictly client-side changes to improve the usability of the SDK itself. These changes include the following:

* `Services.CreateOrUpdate` and its asynchronous versions now automatically poll the provisioning `SearchService` and don't return until service provisioning is complete. This saves you from having to write such polling code yourself.

* If you still want to poll service provisioning manually, you can use the new `Services.BeginCreateOrUpdate` method or one of its asynchronous versions.

* New methods `Services.Update` and its asynchronous versions have been added to the SDK. These methods use HTTP PATCH to support incremental updating of a service. For example, you can now scale a service by passing a `SearchService` instance to these methods that contains only the desired `partitionCount` and `replicaCount` properties. The old way of calling `Services.Get`, modifying the returned `SearchService`, and passing it to `Services.CreateOrUpdate` is still supported, but is no longer necessary. 

## Next steps

If you encounter problems, the best forum for posting questions is [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cognitive-search?tab=Newest). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to label your issue title with "[search]".
