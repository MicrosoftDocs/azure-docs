---
title: API version management for .NET and REST
titleSuffix: Azure Cognitive Search
description: Version policy for Azure Cognitive Search REST APIs and the client library in the .NET SDK.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
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

## Search Service REST API versions

This table provides the version history of current and previously released versions of the Search Service REST API. Documentation is published for the current stable and preview versions.

| API version | Status | Backward compatibility issue |
|-------------|--------|------------------------------|
| [2020-06-30](https://docs.microsoft.com/rest/api/searchservice/index)| Stable | Modifies relevance scoring |
| [2020-06-30-Preview](https://docs.microsoft.com/rest/api/searchservice/index-preview)| Preview | Preview version associated with stable version. |
| 2019-05-06 | Stable | Adds complex types. |
| 2019-05-06-Preview | Preview | Preview version associated with stable version. |
| 2017-11-11 | Stable  | Adds skillsets and AI enrichment. |
| 2017-11-11-Preview | Preview | Preview version associated with stable version. |
| 2016-09-01 |S table | Adds indexers|
| 2016-09-01-Preview | Preview | Preview version associated with stable version.|
| 2015-02-28 | Stable  | First generally available release.  |
| 2015-02-28-Preview | Preview | Preview version associated with stable version. |
| 2014-10-20-Preview | Preview | Second public preview. |
| 2014-07-31-Preview | Preview | First public preview. |

## Azure SDK for .NET

Package version history is available on NuGet.org. This table provides links to each package page.

| API version | Status | Description |
|-------------|--------|------------------------------|
| [Azure.Search.Documents 1.0.0-preview.4](https://www.nuget.org/packages/Azure.Search.Documents/1.0.0-preview.4) | Preview | New client library from Azure .NET SDK, released May 2020. Targets the REST 2020-06-30 API version|
| [Microsoft.Azure.Search 10.0](https://www.nuget.org/packages/Microsoft.Azure.Search/) | Generally Available, released May 2019. Targets the REST 2019-05-06 API version.|
| [Microsoft.Azure.Search 8.0-preview](https://www.nuget.org/packages/Microsoft.Azure.Search/8.0.0-preview) | Preview, released April 2019. Targets the REST 2019-05-06-Preview API version.|

<!-- ## Azure SDK for Java

Package version history is available on NuGet.org. This table provides links to each package page.

| API version | Status | Backward compatibility issue |
|-------------|--------|------------------------------|
TBD

## Azure SDK for Python

Package version history is available on NuGet.org. This table provides links to each package page.

| API version | Status | Backward compatibility issue |
|-------------|--------|------------------------------|
TBD

## Azure SDK for TypeScript

Package version history is available on NuGet.org. This table provides links to each package page.

| API version | Status | Backward compatibility issue |
|-------------|--------|------------------------------|
TBD -->

<!-- ## Snapshot of current versions

Below is a snapshot of the current versions of all programming interfaces to Azure Cognitive Search.

| Interfaces | Most recent major version | Status |
| --- | --- | --- |
| [Azure Search .NET SDK (Microsoft.Azure.Search)](https://docs.microsoft.com/dotnet/api/overview/azure/search) |10.0 |Generally Available, released May 2019 |
| [.NET SDK Preview](https://aka.ms/search-sdk-preview) |8.0-preview |Preview, released April 2019 |
| [Service REST API](https://docs.microsoft.com/rest/api/searchservice/) |2019-05-06 |Generally Available |
| [Service REST API 2019-05-06-Preview](search-api-preview.md) |2019-05-06-Preview |Preview |
| [.NET Management SDK](https://aka.ms/search-mgmt-sdk) |3.0 |Generally Available |
| [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/) |2020-03-13|Generally Available |

For the REST APIs, including the `api-version` on each call is required. Using `api-version` makes it easy to target a specific version, such as a preview API. The following example illustrates how the `api-version` parameter is specified:

    GET https://my-demo-app.search.windows.net/indexes/hotels?api-version=2019-05-06

> [!NOTE]
> Although each request has an `api-version`, we recommend that you use the same version for all API requests. This is especially true when new API versions introduce attributes or operations that are not recognized by previous versions. Mixing API versions can have unintended consequences and should be avoided.
>
> The Service REST API and Management REST API are versioned independently of each other. Any similarity in version numbers is coincidental.

Generally available (or GA) APIs can be used in production and are subject to Azure service level agreements. Preview versions have experimental features that are not always migrated to a GA version. **You are strongly advised to avoid using preview APIs in production applications.** -->

## Management REST API and SDK versions

| API version | Language | Date released | Status | Backward compatibility issue |
|-------------|----------|---------------|--------|------------------------------|
| [Management api-version=2020-03-13](https://docs.microsoft.com/rest/api/searchmanagement/) | REST | March 2020 | Generally Available | Major functional enhancements in endpoint protection. Adds private endpoint, private link, and network rules for new  services. |
| Management api-version=2019-10-01-Preview | REST | October 2019 | Preview  | This is still the most recent preview version, but there are no preview features in the management API at this time. All preview features have transitioned to general availability. |
| [Microsoft.Azure.Management.Search 3.0.0](https://docs.microsoft.com/dotnet/api/overview/azure/search/management?view=azure-dotnet) | .NET | March 2019 | Stable | Targets the REST api-version=2015-08-19. |
| [Python azure-mgmt-search 1.0](https://docs.microsoft.com/python/api/overview/azure/search?view=azure-python) | Python |  Stable | | Targets the REST api-version=2015-08-19. |
| [Java SearchManagementClient 1.35.0](https://docs.microsoft.com/java/api/overview/azure/search/management?view=azure-java-stable) | Java |  | Stable | Targets the REST api-version=2015-08-19.|
| Management api-version=2015-08-19  | REST | August 2019 | Stable| The first generally available version of the Management REST API. Provides service provisioning, scale up, and api-key management. |
| Management api-version=2015-08-19-Preview | REST | August 2019 | Preview| The first preview version of the Management REST API. |

## About discontinued versions

Upgrade existing search solutions to the latest version of the REST API by October 15, 2020. At that time, the following versions of the Azure Cognitive Search REST API will be retired and no longer supported: 

+ **2015-02-28**
+ **2015-02-28-Preview**
+ **2014-07-31-Preview**
+ **2014-10-20-Preview**

In addition, versions of the Azure Cognitive Search .NET SDK older than **3.0.0-rc** will also be retired since they target one of these REST API versions. 

After this date, applications that use any of the deprecated REST API or SDK versions will no longer work and must be upgraded. As with any change of this type, we are giving 12 months' notice, so you have adequate time to adjust. 

To continue using Azure Cognitive Search, please migrate existing code that targets the [REST API](search-api-migration.md) to [REST API version 2020-06-30](https://docs.microsoft.com/rest/api/searchservice/) or to a newer SDK by October 15, 2020.  If you have any questions about updating to the latest version, please send mail to azuresearch_contact@microsoft.com by May 15, 2020 to ensure you have enough time to update your code.

## About Preview and Generally Available versions

Azure Cognitive Search always pre-releases experimental features through the REST API first, then through prerelease versions of the .NET SDK.

Preview features are available for testing and experimentation, with the goal of gathering feedback on feature design and implementation. For this reason, preview features can change over time, possibly in ways that break backwards compatibility. This is in contrast to features in a GA version, which are stable and unlikely to change with the exception of small backward-compatible fixes and enhancements. Also, preview features do not always make it into a GA release.

For these reasons, we recommend against writing production code that takes a dependency on preview versions. If you're using an older preview version, we recommend migrating to the generally available (GA) version.

For the .NET SDK: Guidance for code migration can be found at [Upgrade the .NET SDK](search-dotnet-sdk-migration-version-9.md).

General availability means that Azure Cognitive Search is now under the service level agreement (SLA). The SLA can be found at [Azure Cognitive Search Service Level Agreements](https://azure.microsoft.com/support/legal/sla/search/v1_0/).
