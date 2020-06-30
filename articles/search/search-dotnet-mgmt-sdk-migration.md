---
title: Upgrade to the Azure Search .NET Management SDK
titleSuffix: Azure Cognitive Search
description: Upgrade to the Azure Search .NET Management SDK from previous versions. Learn about new features and the code changes necessary for migration.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 07/01/2020
---

# Upgrading versions of the Azure Search .NET Management SDK

This article explains how to migrate to successive versions of the Azure Search .NET Management SDK, used to provision or deprovision search services, adjust capacity, and manage API keys.

Management SDKs target a specific version of the Management REST API. For more information about concepts and operations, see [Search Management (REST)](https://docs.microsoft.com/rest/api/searchmanagement/).

## Versions

| SDK version | Corresponding REST API version | Feature addition or behavior change |
|-------------|--------------------------------|-------------------------------------|
| [3.0](https://www.nuget.org/packages/Microsoft.Azure.Management.Search/3.0.0) | api-version=2020-30-20 | Adds endpoint protections           |
| [2.0](https://www.nuget.org/packages/Microsoft.Azure.Management.Search/2.0.0) | api-version=2019-10-01 | Usability improvements
| [1.0](https://www.nuget.org/packages/Microsoft.Azure.Management.Search/1.0.1) | api-version=2015-08-19  | First version                       |

## How to upgrade

1. Update your NuGet reference for `Microsoft.Azure.Management.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

1. Once NuGet has downloaded the new packages and their dependencies, rebuild your project. Depending on how your code is structured, it may rebuild successfully, in which case you are done.

1. If your build fails, it could be because you've implemented some of the SDK interfaces (for example, for the purposes of unit testing), which have changed. To resolve this, you'll need to implement the new methods such as `BeginCreateOrUpdateWithHttpMessagesAsync`.

1. After fixing any build errors, you can make changes to your application to take advantage of new functionality. 

## Upgrade to 3.0

Version 3.0 adds private endpoint protection by restricting access to IP ranges, and by optionally integrating with Azure Private Link for search services that should not be accessible to the public internet.

There are no breaking changes or behavior changes from the previous release, but upgrading is recommended if you want to use the new features:

* [Configure IP firewall](service-configure-firewall.md)

* [Create a private endpoint](service-create-private-endpoint.md)

## Upgrade to 2.0

Version 2 of the Azure Search .NET Management SDK is a minor upgrade, so changing your code should require only minimal effort.The changes to the SDK are strictly client-side changes to improve the usability of the SDK itself. These changes include the following:

* `Services.CreateOrUpdate` and its asynchronous versions now automatically poll the provisioning `SearchService` and do not return until service provisioning is complete. This saves you from having to write such polling code yourself.

* If you still want to poll service provisioning manually, you can use the new `Services.BeginCreateOrUpdate` method or one of its asynchronous versions.

* New methods `Services.Update` and its asynchronous versions have been added to the SDK. These methods use HTTP PATCH to support incremental updating of a service. For example, you can now scale a service by passing a `SearchService` instance to these methods that contains only the desired `partitionCount` and `replicaCount` properties. The old way of calling `Services.Get`, modifying the returned `SearchService`, and passing it to `Services.CreateOrUpdate` is still supported, but is no longer necessary. 

## Next steps

If you encounter problems, the best forum for posting questions is [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cognitive-search?tab=Newest). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to label your issue title with "[search]".
