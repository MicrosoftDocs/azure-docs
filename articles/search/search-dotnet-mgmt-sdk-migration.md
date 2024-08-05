---
title: Upgrade management SDKs
titleSuffix: Azure AI Search
description: Learn about the management libraries and packages used for control plane operations in Azure AI Search.

manager: nitinme
author: bevloh
ms.author: beloh
ms.service: cognitive-search
ms.devlang: csharp
ms.custom:
  - devx-track-dotnet
  - ignite-2023
ms.topic: conceptual
ms.date: 07/22/2024
---

# Upgrade versions of the Azure Search .NET Management SDK

This article points you to libraries in the Azure SDK for .NET for managing a search service. These libraries provide the APIs used to create, configure, and delete search services. They also provide APIS used to adjust capacity, manage API keys, and configure network security.

Management SDKs target a specific version of the Management REST API. Release notes for each library indicate which REST API version is the target for each package. For more information about concepts and operations, see [Search Management (REST)](/rest/api/searchmanagement/).

## Versions

The following table lists the client libraries used to provision a search service.

| Namespace | Version| Status | Change log |
|-----------|--------|--------|------------|
| [Azure.ResourceManager.Search](/dotnet/api/overview/azure/resourcemanager.search-readme?view=azure-dotnet&preserve-view=true) | [Package versions](https://www.nuget.org/packages/Azure.ResourceManager.Search) | **Current** | [Change Lot](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.ResourceManager.Search/CHANGELOG.md) |
| [Microsoft.Azure.Management.Search](/dotnet/api/overview/azure/search/management/management-cognitivesearch(deprecated)?view=azure-dotnet&preserve-view=true) | [Package versions](https://www.nuget.org/packages/Microsoft.Azure.Management.Search#versions-body-tab) | **Deprecated** | [Release notes](https://www.nuget.org/packages/Microsoft.Azure.Management.Search#release-body-tab) |

## Checklist for upgrade

1. Review the [change log](https://github.com/Azure/azure-sdk-for-net/blob/main/sdk/search/Azure.ResourceManager.Search/CHANGELOG.md) for updates to the library.

1. In your application code, delete the reference to `Microsoft.Azure.Management.Search` and its dependencies.

1. Add a reference for `Azure.ResourceManager.Search` using either the NuGet Package Manager Console or by right-clicking on your project references and selecting "Manage NuGet Packages..." in Visual Studio.

1. Once NuGet has downloaded the new packages and their dependencies, replace the API calls.

## Next steps

If you encounter problems, the best forum for posting questions is [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-cognitive-search?tab=Newest). If you find a bug, you can file an issue in the [Azure .NET SDK GitHub repository](https://github.com/Azure/azure-sdk-for-net/issues). Make sure to label your issue title with *search*.
