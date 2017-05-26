---
title: API versions of Azure Search | Microsoft Docs
description: Version policy for Azure Search REST APIs and the client library in the .NET SDK.
services: search
documentationcenter: ''
author: brjohnstmsft
manager: pablocas
editor: ''

ms.assetid: 0458053a-164e-4682-a802-00097ecde981
ms.service: search
ms.devlang: dotnet
ms.workload: search
ms.topic: article
ms.tgt_pltfrm: na
ms.date: 01/11/2017
ms.author: brjohnst
---

# API versions in Azure Search
Azure Search rolls out feature updates regularly. Sometimes, but not always, these updates require us to publish a new version of our API to preserve backward compatibility. Publishing a new version allows you to control when and how you integrate search service updates in your code.

As a rule, we try to publish new versions only when necessary, since it can involve some effort to upgrade your code to use a new API version. We will only publish a new version if we need to change some aspect of the API in a way that breaks backward compatibility. This can happen because of fixes to existing features, or because of new features that change existing API surface area.

We follow the same rule for SDK updates. The Azure Search SDK follows the [semantic versioning](http://semver.org/) rules, which means that its version has three parts: major, minor, and build number (for example, 1.1.0). We will release a new major version of the SDK only in case of changes that break backward compatibility. For non-breaking feature updates, we will increment the minor version, and for bug fixes we will only increase the build version.

> [!NOTE]
> Your Azure Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you migrate your code to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you’re using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

## Snapshot of current versions
Below is a snapshot of the current versions of all programming interfaces to Azure Search.

| Interfaces | Most recent major version | Status |
| --- | --- | --- |
| [.NET SDK](https://aka.ms/search-sdk) |3.0 |Generally Available, released November 2016 |
| [.NET SDK Preview](https://aka.ms/search-sdk-preview) |2.0-preview |Preview, released August 2016 |
| [Service REST API](https://docs.microsoft.com/rest/api/searchservice/) |2016-09-01 |Generally Available |
| [Service REST API Preview](search-api-2015-02-28-preview.md) |2015-02-28-Preview |Preview |
| [.NET Management SDK](https://aka.ms/search-mgmt-sdk) |2015-08-19 |Generally Available |
| [Management REST API](https://docs.microsoft.com/rest/api/searchmanagement/) |2015-08-19 |Generally Available |

For the REST APIs, including the `api-version` on each call is required. This makes it easy to target a specific version, such as a preview API. The following example illustrates how the `api-version` parameter is specified:

    GET https://adventure-works.search.windows.net/indexes/bikes?api-version=2016-09-01

> [!NOTE]
> Although each request has an `api-version`, we recommend that you use the same version for all API requests. This is especially true when new API versions introduce attributes or operations that are not recognized by previous versions. Mixing API versions can have unintended consequences and should be avoided.
>
> The Service REST API and Management REST API are versioned independently of each other. Any similarity in version numbers is coincidental.

Generally available (or GA) APIs can be used in production and are subject to Azure service level agreements. Preview versions have experimental features that are not always migrated to a GA version. **We strongly advise against using preview APIs in production applications.**

## About Preview and Generally Available versions
Azure Search always pre-releases experimental features through the REST API first, then through prerelease versions of the .NET SDK.

Preview features are not guaranteed to be migrated to a GA release. Whereas features in a GA version are considered stable and unlikely to change with the exception of small backward-compatible fixes and enhancements, preview features are available for testing and experimentation, with the goal of gathering feedback on feature design and implementation.

However, because preview features are subject to change, we recommend against writing production code that takes a dependency on preview versions. If you are using an older preview version, we recommend migrating to the generally available (GA) version.

For the .NET SDK: Guidance for code migration can be found at [Upgrade the .NET SDK](search-dotnet-sdk-migration.md).

General availability means that Azure Search is now under the service level agreement (SLA). The SLA can be found at [Azure Search Service Level Agreements](https://azure.microsoft.com/support/legal/sla/search/v1_0/).
