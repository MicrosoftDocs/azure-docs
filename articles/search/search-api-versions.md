---
title: API version management for .NET and REST
titleSuffix: Azure Cognitive Search
description: Version policy for Azure Cognitive Search REST APIs and the client library in the .NET SDK.

manager: nitinme
author: brjohnstmsft
ms.author: brjohnst
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/04/2019
---

# API versions in Azure Cognitive Search

Azure Cognitive Search rolls out feature updates regularly. Sometimes, but not always, these updates require a new version of the API to preserve backward compatibility. Publishing a new version allows you to control when and how you integrate search service updates in your code.

As a rule, the Azure Cognitive Search team publishes new versions only when necessary, since it can involve some effort to upgrade your code to use a new API version. A new version is needed only if some aspect of the API has changed in a way that breaks backward compatibility. Such changes can happen because of fixes to existing features, or because of new features that change existing API surface area.

The same rule applies for SDK updates. The Azure Cognitive Search SDK follows the [semantic versioning](https://semver.org/) rules, which means that its version has three parts: major, minor, and build number (for example, 1.1.0). A new major version of the SDK is released only for changes that break backward compatibility. Non-breaking feature updates will increment the minor version, and bug fixes will only increase the build version.

> [!NOTE]
> Your Azure Cognitive Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you’re using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

## Snapshot of current versions
Below is a snapshot of the current versions of all programming interfaces to Azure Cognitive Search.


| Interfaces | Most recent major version | Status |
| --- | --- | --- |
| [.NET SDK](https://aka.ms/search-sdk) |9.0 |Generally Available, released May 2019 |
| [.NET SDK Preview](https://aka.ms/search-sdk-preview) |8.0-preview |Preview, released April 2019 |
| [Service REST API](https://docs.microsoft.com/rest/api/searchservice/) |2019-05-06 |Generally Available |
| [Service REST API 2019-05-06-Preview](search-api-preview.md) |2019-05-06-Preview |Preview |
| [.NET Management SDK](https://aka.ms/search-mgmt-sdk) |3.0 |Generally Available |
| [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/) |2015-08-19 |Generally Available |

For the REST APIs, including the `api-version` on each call is required. Using `api-version` makes it easy to target a specific version, such as a preview API. The following example illustrates how the `api-version` parameter is specified:

    GET https://my-demo-app.search.windows.net/indexes/hotels?api-version=2019-05-06

> [!NOTE]
> Although each request has an `api-version`, we recommend that you use the same version for all API requests. This is especially true when new API versions introduce attributes or operations that are not recognized by previous versions. Mixing API versions can have unintended consequences and should be avoided.
>
> The Service REST API and Management REST API are versioned independently of each other. Any similarity in version numbers is coincidental.

Generally available (or GA) APIs can be used in production and are subject to Azure service level agreements. Preview versions have experimental features that are not always migrated to a GA version. **You are strongly advised to avoid using preview APIs in production applications.**

## Update to the latest version of the REST API by October 15, 2020
The following versions of the Azure Cognitive Search REST API will be retired and no longer supported as of October 15, 2020: **2014-07-31-Preview**, **2014-10-20-Preview**, **2015-02-28-Preview**, and **2015-02-28**. In addition, versions of the Azure Cognitive Search .Net SDK older than **3.0.0-rc** will also be retired since they target one of these REST API versions. After this date, applications that use any of the deprecated REST API or SDK versions will no longer work and must be upgraded. As with any change of this type, we are giving 12 months' notice, so you have adequate time to adjust.  To continue using Azure Cognitive Search, please migrate existing code that targets the [REST API](search-api-migration.md) to [REST API version 2019-05-06](https://docs.microsoft.com/rest/api/searchservice/) or newer or the .Net SDK to [version 3.0](search-dotnet-sdk-migration.md) or newer by October 15, 2020.  If you have any questions about updating to the latest version, please send mail to azuresearch_contact@microsoft.com by May 15, 2020 to ensure you have enough time to update your code.

## About Preview and Generally Available versions
Azure Cognitive Search always pre-releases experimental features through the REST API first, then through prerelease versions of the .NET SDK.

Preview features are available for testing and experimentation, with the goal of gathering feedback on feature design and implementation. For this reason, preview features can change over time, possibly in ways that break backwards compatibility. This is in contrast to features in a GA version, which are stable and unlikely to change with the exception of small backward-compatible fixes and enhancements. Also, preview features do not always make it into a GA release.

For these reasons, we recommend against writing production code that takes a dependency on preview versions. If you're using an older preview version, we recommend migrating to the generally available (GA) version.

For the .NET SDK: Guidance for code migration can be found at [Upgrade the .NET SDK](search-dotnet-sdk-migration-version-9.md).

General availability means that Azure Cognitive Search is now under the service level agreement (SLA). The SLA can be found at [Azure Cognitive Search Service Level Agreements](https://azure.microsoft.com/support/legal/sla/search/v1_0/).
