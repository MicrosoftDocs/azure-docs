<properties
   pageTitle="API versions of Azure Search | Microsoft Azure | Search API"
   description="Version policy for Azure Search REST APIs and the client library in the .NET SDK."
   services="search"
   documentationCenter=""
   authors="brjohnstmsft"
   manager="pablocas"
   editor=""/>

<tags
   ms.service="search"
   ms.devlang="dotnet"
   ms.workload="search"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.date="05/23/2016"
   ms.author="brjohnst"/>

# API versions in Azure Search

Azure Search rolls out feature updates on a regular basis. Sometimes, but not always, these updates require us to publish a new version of our API in order to preserve backward compatibility. Publishing a new version allows you to control when and how you integrate search service updates in your code.

As a rule, we try to publish new versions only when necessary, since it can involve some effort to upgrade your code to use a new API version. We will only publish a new version if we need to change some aspect of the API in a way that breaks backward compatibility. This can happen because of fixes to existing features, or because of new features that change existing API surface area.

We follow the same rule for SDK updates. The Azure Search SDK follows the [semantic versioning](http://semver.org/) rules, which means that its version has three parts: major, minor, and build number (for example, 1.1.0). We will release a new major version of the SDK only in case of changes that break backward compatibility. For non-breaking feature updates, we will increment the minor version, and for bug fixes we will only increase the build version.

##Snapshot of current versions 

Below is a snapshot of the current versions of all programming interfaces to Azure Search. Roadmaps and other details can be found in subsequent sections of this document.

Interfaces|Most recent major version|Status
----------|-------------------------|------
[.NET SDK](https://msdn.microsoft.com/library/azure/dn951165.aspx)|1.1|Generally Available, released February 2016
[Service REST API](https://msdn.microsoft.com/library/azure/dn798935.aspx)|2015-02-28|Generally Available
[Service REST API Preview](search-api-2015-02-28-preview.md)|2015-02-28-Preview|Preview
[Management REST API](https://msdn.microsoft.com/library/azure/dn832684.aspx)|2015-08-19|Generally Available

For the REST APIs, including the `api-version` on each call is required. This makes it easy to target a specific version, such as a preview API. The following example illustrates how the `api-version` parameter is specified:

    GET https://adventure-works.search.windows.net/indexes/bikes?api-version=2015-02-28

> [AZURE.NOTE] Although each request has an `api-version`, we recommend that you use the same version for all API requests. This is especially true when new API versions introduce attributes or operations that are not recognized by previous versions. Mixing API versions can have unintended consequences and should be avoided.
> 
The Service REST API and Management REST API are versioned independently of each other. Any similarity in version numbers is co-incidental.

Generally available (or GA) APIs can be used in production and are subject to Azure service level agreements. Preview versions have experimental features that are not always migrated to a GA version. **We strongly advise against using preview APIs in production applications.**

##SDK version roadmap

Each version of the .NET SDK targets a particular version of the Service REST API. Features are rolled out in the REST API first, and then implemented in the SDK.

The .NET SDK is now generally available and work is already underway on the next version. The following table looks ahead to future versions of the SDK so that you have an idea of what’s coming up next.

.NET SDK version|REST API version|Features|ETA
----------------|----------------|--------|---
1.1|2015-02-28|Lucene query syntax|February 2016
2.x-preview|2015-02-28-Preview|Custom analyzers, Azure Blob indexer, Field mappings, ETags|Features will start shipping in Q1 2016
2.x|New GA API version|Same as 2.x-preview|Soon after 2.x-preview is complete

##About Preview and Generally Available versions

Azure Search always pre-releases experimental features through the REST API first, then through prerelease versions of the .NET SDK. A list of preview features can be found in [What’s New in Azure Search](search-latest-updates.md).

Preview features are not guaranteed to be migrated to a GA release. Whereas features in a GA version are considered stable and unlikely to change with the exception of small backward-compatible fixes and enhancements, preview features are available for testing and experimentation, with the goal of gathering feedback on feature design and implementation. 

However, because preview features are subject to change, we recommend against writing production code that takes a dependency on preview versions. If you are using an older preview version, we recommend migrating to the generally available (GA) version. 

For the .NET SDK: Guidance for code migration can be found at [Upgrade the .NET SDK](search-dotnet-sdk-migration.md).

General availability means that Azure Search is now under the service level agreement (SLA). The SLA can be found at [Azure Search Service Level Agreements](https://azure.microsoft.com/support/legal/sla/search/v1_0/).

