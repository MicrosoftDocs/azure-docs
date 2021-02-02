---
title: API versions
titleSuffix: Azure Cognitive Search
description: Version policy for Azure Cognitive Search REST APIs and the client library in the .NET SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 11/05/2020
---

# API versions in Azure Cognitive Search

Azure Cognitive Search rolls out feature updates regularly. Sometimes, but not always, these updates require a new version of the API to preserve backward compatibility. Publishing a new version allows you to control when and how you integrate search service updates in your code.

As a rule, the Azure Cognitive Search team publishes new versions only when necessary, since it can involve some effort to upgrade your code to use a new API version. A new version is needed only if some aspect of the API has changed in a way that breaks backward compatibility. Such changes can happen because of fixes to existing features, or because of new features that change existing API surface area.

The same rule applies for SDK updates. The Azure Cognitive Search SDK follows the [semantic versioning](https://semver.org/) rules, which means that its version has three parts: major, minor, and build number (for example, 1.1.0). A new major version of the SDK is released only for changes that break backward compatibility. Non-breaking feature updates will increment the minor version, and bug fixes will only increase the build version.

> [!Important]
> The Azure SDKs for .NET, Java, Python and JavaScript are rolling out new client libraries for Azure Cognitive Search. Currently, none of the Azure SDK libraries fully support the most recent Search REST APIs (2020-06-30) or Management REST APIs (2020-03-13) but this will change over time. You can periodically check this page or the [What's New](whats-new.md) for announcements on functional enhancements.

<a name="unsupported-versions"></a>

## Unsupported versions

Upgrade existing search solutions to the latest version of the REST API by October 15, 2020. At that time, the following versions of the Azure Cognitive Search REST API will be retired and no longer supported:

+ **2015-02-28**
+ **2015-02-28-Preview**
+ **2014-07-31-Preview**
+ **2014-10-20-Preview**

In addition, versions of the Azure Cognitive Search .NET SDK older than [**3.0.0-rc**](https://www.nuget.org/packages/Microsoft.Azure.Search/3.0.0-rc) will also be retired since they target one of these REST API versions. 

After this date, applications that use any of the deprecated REST API or SDK versions will no longer work and must be upgraded. As with any change of this type, we are giving 12 months' notice, so you have adequate time to adjust.

To continue using Azure Cognitive Search, please migrate existing code that targets the [REST API](search-api-migration.md) to [REST API version 2020-06-30](/rest/api/searchservice/) or to a newer SDK by October 15, 2020.  If you have any questions about updating to the latest version, please send mail to azuresearch_contact@microsoft.com by May 15, 2020 to ensure you have enough time to update your code.

## REST APIs

An Azure Cognitive Search service instance supports several REST API versions, including the latest one. You can continue to use a version when it is no longer the latest one, but we recommend that you [migrate your code](search-api-migration.md) to use the newest version. When using the REST API, you must specify the API version in every request via the api-version parameter. When using the .NET SDK, the version of the SDK you're using determines the corresponding version of the REST API. If you are using an older SDK, you can continue to run that code with no changes even if the service is upgraded to support a newer API version.

The following table provides the version history of current and previously released versions of the Search Service REST API. Documentation is published only for the most recent stable and preview versions.

### Search Service APIs

Create and manage content on a search service.

| Version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   | Status | Description |
|-------------------------|--------|------------------------------|
| [Search 2020-06-30](/rest/api/searchservice/index)| Stable | Newest stable release of the Search REST APIs, with advancements in relevance scoring and generally availability for knowledge store.|
| [Search 2020-06-30-Preview](/rest/api/searchservice/index-preview)| Preview | Preview version associated with stable version. Includes multiple [preview features](search-api-preview.md). |
| Search 2019-05-06 | Stable  | Adds [complex types](search-howto-complex-data-types.md). |
| Search 2019-05-06-Preview | Preview | Preview version associated with stable version. |
| Search 2017-11-11 | Stable | Adds skillsets and [AI enrichment](cognitive-search-concept-intro.md). |
| Search 2017-11-11-Preview | Preview | Preview version associated with stable version. |
| Search 2016-09-01 |Stable | Adds [indexers](search-indexer-overview.md). |
| Search 2016-09-01-Preview | Preview | Preview version associated with stable version.|
| Search 2015-02-28 | Unsupported after 10-10-2020   | First generally available release.  |
| Search 2015-02-28-Preview | Unsupported after 10-10-2020  | Preview version associated with stable version. |
| Search 2014-10-20-Preview | Unsupported after 10-10-2020 | Second public preview. |
| Search 2014-07-31-Preview | Unsupported after 10-10-2020  | First public preview. |

### Management REST APIs

Create and configure a search service, and manage API keys.

| Version&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   | Status | Description |
|-------------------------|--------|------------------------------|
| [Management 2020-08-01](/rest/api/searchmanagement/) | Stable | Newest stable release of the Management REST APIs. Adds generally available shared private link resource support for all outbound-accessed resources except those noted in the preview version |
| [Management 2020-08-01-Preview](/rest/api/searchmanagement/index-preview) | Preview  | Currently in preview: shared private link resource support for Azure Functions and Azure Database for MySQL. |
| Management 2020-03-13  | Stable | Adds [private endpoint](service-create-private-endpoint.md) through private link, and [network IP rules](service-configure-firewall.md) for new  services. For more information, see this [swagger specification](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/search/resource-manager/Microsoft.Search/stable/2020-08-01). |
| Management 2019-10-01-Preview | Preview  | There were no preview features introduced in this list. This preview is functionally equivalent to 2020-03-13. For more information, see this [swagger specification](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/search/resource-manager/Microsoft.Search/preview/2019-10-01-preview). |
| Management 2015-08-19  | Stable | The first generally available version of the Management REST APIs. Provides service provisioning, scale up, and api-key management. For more information, see this [swagger specification](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/search/resource-manager/Microsoft.Search/stable/2015-08-19). |
| Management 2015-08-19-Preview  | Preview | The first preview version of the Management REST APIs. For more information, see this [swagger specification](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/search/resource-manager/Microsoft.Search/stable/2015-08-19). |

## Azure SDK for .NET

The following  table provides links to more recent SDK versions. 

| SDK version | Status | Description |
|-------------|--------|------------------------------|
| [Azure.Search.Documents 11](/dotnet/api/overview/azure/search.documents-readme) | Stable | New client library from Azure .NET SDK, released July 2020. Targets the Search REST api-version=2020-06-30 REST API but does not yet support, geo-filters. |
| [Microsoft.Azure.Search 10](https://www.nuget.org/packages/Microsoft.Azure.Search/) | Stable | Released May 2019. Targets the Search REST api-version=2019-05-06.|
| [Microsoft.Azure.Management.Search 4.0.0](/dotnet/api/overview/azure/search/management) | Stable | Targets the Management REST api-version=2020-08-01.  |
| Microsoft.Azure.Management.Search 3.0.0 | Stable | Targets the Management REST api-version=2015-08-19.  |

## Azure SDK for Java

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [Java azure-search-documents 11](https://newreleases.io/project/github/Azure/azure-sdk-for-java/release/azure-search-documents_11.1.0) | Stable | New client library from Azure .NET SDK, released July 2020. Targets the Search REST api-version=2019-05-06. |
| [Java Management Client 1.35.0](/java/api/overview/azure/search/management) | Stable | Targets the Management REST api-version=2015-08-19. |

## Azure SDK for JavaScript

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [JavaScript azure-search 11.0](https://azure.github.io/azure-sdk-for-node/azure-search/latest/) | Stable | New client library from Azure .NET SDK, released July 2020. Targets the Search REST api-version=2016-09-01. |
| [JavaScript azure-arm-search](https://azure.github.io/azure-sdk-for-node/azure-arm-search/latest/) | Stable | Targets the Management REST api-version=2015-08-19. |

## Azure SDK for Python

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [Python azure-search-documents 11.0](https://azuresdkdocs.blob.core.windows.net/$web/python/azure-search-documents/11.0.0/index.html) | Stable | New client library from Azure .NET SDK, released July 2020. Targets the Search REST api-version=2019-05-06. |
| [Python azure-mgmt-search 1.0](/python/api/overview/azure/search) | Stable | Targets the Management REST api-version=2015-08-19. |