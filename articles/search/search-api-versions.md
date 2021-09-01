---
title: API versions
titleSuffix: Azure Cognitive Search
description: Version policy for Azure Cognitive Search REST APIs and the client library in the .NET SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.date: 07/19/2021
---

# API versions in Azure Cognitive Search

Azure Cognitive Search rolls out feature updates regularly. Sometimes, but not always, these updates require a new version of the API to preserve backward compatibility. Publishing a new version allows you to control when and how you integrate search service updates in your code.

As a rule, the Azure Cognitive Search team publishes new versions only when necessary, since it can involve some effort to upgrade your code to use a new API version. A new version is needed only if some aspect of the API has changed in a way that breaks backward compatibility. Such changes can happen because of fixes to existing features, or because of new features that change existing API surface area.

<a name="unsupported-versions"></a>

## Unsupported versions

Some API versions are no longer supported and will be rejected by a search service:

+ **2015-02-28**
+ **2015-02-28-Preview**
+ **2014-07-31-Preview**
+ **2014-10-20-Preview**

In addition, versions of the Azure Cognitive Search .NET SDK older than [**3.0.0-rc**](https://www.nuget.org/packages/Microsoft.Azure.Search/3.0.0-rc) will also be retired since they target one of these REST API versions.

Support for the above-listed versions was discontinued on October 15, 2020. If you have code that uses a discontinued version, you can [migrate existing code](search-api-migration.md) to a newer [REST API version](/rest/api/searchservice/) or to a newer Azure SDK.

## REST APIs

| REST API | Link |
|----------|------|
| Search Service (data plane) | [API versions](/rest/api/searchservice/search-service-api-versions) |
| Management (control plane) | [API versions](/rest/api/searchmanagement/management-api-versions) |

## Azure SDK for .NET

The following  table provides links to more recent SDK versions. 

| SDK version | Status | Description |
|-------------|--------|------------------------------|
| [Azure.Search.Documents 11](/dotnet/api/overview/azure/search.documents-readme) | Stable | New client library from Azure .NET SDK, initially released July 2020. |
| [Microsoft.Azure.Search 10](https://www.nuget.org/packages/Microsoft.Azure.Search/) | Stable | Released May 2019. This is the last version of the Microsoft.Azure.Search package. It is succeeded by Azure.Search.Documents. |
| [Microsoft.Azure.Management.Search 4.0.0](/dotnet/api/overview/azure/search/management) | Stable | Targets the Management REST api-version=2020-08-01.  |
| Microsoft.Azure.Management.Search 3.0.0 | Stable | Targets the Management REST api-version=2015-08-19.  |

## Azure SDK for Java

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [Java azure-search-documents 11](https://newreleases.io/project/github/Azure/azure-sdk-for-java/release/azure-search-documents_11.1.0) | Stable | New client library from Azure Java SDK, released July 2020. Targets the Search REST api-version=2019-05-06. |
| [Java Management Client 1.35.0](/java/api/overview/azure/search/management) | Stable | Targets the Management REST api-version=2015-08-19. |

## Azure SDK for JavaScript

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [JavaScript @azure/search-documents 11.0](https://www.npmjs.com/package/@azure/search-documents) | Stable | New client library from Azure JavaScript & TypesScript SDK, released July 2020. Targets the Search REST api-version=2016-09-01. |
| [JavaScript @azure/arm-search](https://www.npmjs.com/package/@azure/arm-search) | Stable | Targets the Management REST api-version=2015-08-19. |

## Azure SDK for Python

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [Python azure-search-documents 11.0](https://pypi.org/project/azure-search-documents/) | Stable | New client library from Azure Python SDK, released July 2020. Targets the Search REST api-version=2019-05-06. |
| [Python azure-mgmt-search 8.0](https://pypi.org/project/azure-mgmt-search/) | Stable | Targets the Management REST api-version=2015-08-19. |
