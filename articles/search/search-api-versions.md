---
title: API versions
titleSuffix: Azure Cognitive Search
description: Version policy for Azure Cognitive Search REST APIs and the client library in the .NET SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 06/30/2020
---

# API versions in Azure Cognitive Search

Azure Cognitive Search rolls out feature updates regularly. Sometimes, but not always, these updates require a new version of the API to preserve backward compatibility. Publishing a new version allows you to control when and how you integrate search service updates in your code.

As a rule, the Azure Cognitive Search team publishes new versions only when necessary, since it can involve some effort to upgrade your code to use a new API version. A new version is needed only if some aspect of the API has changed in a way that breaks backward compatibility. Such changes can happen because of fixes to existing features, or because of new features that change existing API surface area.

The same rule applies for SDK updates. The Azure Cognitive Search SDK follows the [semantic versioning](https://semver.org/) rules, which means that its version has three parts: major, minor, and build number (for example, 1.1.0). A new major version of the SDK is released only for changes that break backward compatibility. Non-breaking feature updates will increment the minor version, and bug fixes will only increase the build version.

> [!NOTE]
> An Azure Cognitive Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you're using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

## REST APIs

This table provides the version history of current and previously released versions of the Search Service REST API. Documentation is published for the current stable and preview versions.

| Version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   | Status | Backward compatibility issue |
|-------------|--------|------------------------------|
| [Management 2020-03-13](https://docs.microsoft.com/rest/api/searchmanagement/) | Generally Available | Newest stable release of the Management REST APIs, with  advancements in endpoint protection. Adds private endpoint, private link support, and network rules for new  services. |
| [Management 2019-10-01-Preview](https://docs.microsoft.com/rest/api/searchmanagement/index-2019-10-01-preview) | Preview  | Despite its version number, this is still the current preview version of the Management REST APIs. There are no preview features at this time. All preview features have recently transitioned to general availability. |
| Management 2015-08-19  | Stable| The first generally available version of the Management REST APIs. Provides service provisioning, scale up, and api-key management. |
| Management 2015-08-19-Preview | Preview| The first preview version of the Management REST APIs. |
| [Search 2020-06-30](https://docs.microsoft.com/rest/api/searchservice/index)| Stable | Newest stable release of the Search Search REST APIs, with advancements in relevance scoring. |
| [Search 2020-06-30-Preview](https://docs.microsoft.com/rest/api/searchservice/index-preview)| Preview | Preview version associated with stable version. |
| Search 2019-05-06 | Stable | Adds complex types. |
| Search 2019-05-06-Preview | Preview | Preview version associated with stable version. |
| Search 2017-11-11 | Stable  | Adds skillsets and AI enrichment. |
| Search 2017-11-11-Preview | Preview | Preview version associated with stable version. |
| Search 2016-09-01 |Stable | Adds indexers|
| Search 2016-09-01-Preview | Preview | Preview version associated with stable version.|
| Search 2015-02-28 | Stable  | First generally available release.  |
| Search 2015-02-28-Preview | Preview | Preview version associated with stable version. |
| Search 2014-10-20-Preview | Preview | Second public preview. |
| Search 2014-07-31-Preview | Preview | First public preview. |

## Azure SDK for .NET

Package version history is available on NuGet.org. This table provides links to each package page.

| SDK version | Status | Description |
|-------------|--------|------------------------------|
| [**Azure.Search.Documents 1.0.0-preview.4**](https://www.nuget.org/packages/Azure.Search.Documents/1.0.0-preview.4) | Preview | New client library from Azure .NET SDK, released May 2020. Targets the REST 2020-06-30 API version|
| [**Microsoft.Azure.Search 10.0**](https://www.nuget.org/packages/Microsoft.Azure.Search/) | Generally Available, released May 2019. Targets the REST 2019-05-06 API version.|
| [**Microsoft.Azure.Search 8.0-preview**](https://www.nuget.org/packages/Microsoft.Azure.Search/8.0.0-preview) | Preview, released April 2019. Targets the REST 2019-05-06-Preview API version.|
| [**Microsoft.Azure.Management.Search 3.0.0**](https://docs.microsoft.com/dotnet/api/overview/azure/search/management?view=azure-dotnet) | Stable | Targets the Management REST api-version=2015-08-19. |

## Azure SDK for Java

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [**Java SearchManagementClient 1.35.0**](https://docs.microsoft.com/java/api/overview/azure/search/management?view=azure-java-stable) | Stable | Targets the Management REST api-version=2015-08-19.|

## Azure SDK for Python

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [**Python azure-mgmt-search 1.0**](https://docs.microsoft.com/python/api/overview/azure/search?view=azure-python) | Stable | Targets the Management REST api-version=2015-08-19. |