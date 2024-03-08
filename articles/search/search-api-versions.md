---
title: API versions
titleSuffix: Azure AI Search
description: Version policy for Azure AI Search REST APIs and the client library in the .NET SDK.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.custom:
  - devx-track-dotnet
  - devx-track-extended-java
  - devx-track-js
  - devx-track-python
  - ignite-2023
ms.topic: conceptual
ms.date: 01/10/2024
---

# API versions in Azure AI Search

Azure AI Search rolls out feature updates regularly. Sometimes, but not always, these updates require a new version of the API to preserve backward compatibility. Publishing a new version allows you to control when and how you integrate search service updates in your code.

As a rule, the REST APIs and libraries are versioned only when necessary, since it can involve some effort to upgrade your code to use a new API version. A new version is needed only if some aspect of the API has changed in a way that breaks backward compatibility. Such changes can happen because of fixes to existing features, or because of new features that change existing API surface area.

See [Azure SDK lifecycle and support policy](https://azure.github.io/azure-sdk/policies_support.html) for more information about the deprecation path.

<a name="unsupported-versions"></a>

## Unsupported versions

Some API versions are discontinued and will be rejected by a search service:

+ **2015-02-28**
+ **2015-02-28-Preview**
+ **2014-07-31-Preview**
+ **2014-10-20-Preview**

All SDKs are based on REST API versions. If a REST version is discontinued, SDK packages based on that version are also discontinued. All Azure AI Search .NET SDKs older than [**3.0.0-rc**](https://www.nuget.org/packages/Microsoft.Azure.Search/3.0.0-rc) are now obsolete. 

Support for the above-listed versions ended on October 15, 2020. If you have code that uses a discontinued version, you can [migrate existing code](search-api-migration.md) to a newer [REST API version](/rest/api/searchservice/) or to a newer Azure SDK.

## REST APIs

| REST API | Link |
|----------|------|
| Search Service (data plane) | See [API versions](/rest/api/searchservice/search-service-api-versions) in REST API reference |
| Management (control plane) | See [API versions](/rest/api/searchmanagement/management-api-versions) in REST API reference  |

## Azure SDK for .NET

The following  table provides links to more recent SDK versions. 

| SDK version | Status | Description |
|-------------|--------|------------------------------|
| [Azure.Search.Documents 11](/dotnet/api/overview/azure/search.documents-readme) | Active | New client library from the Azure .NET SDK team, initially released July 2020. See the [Change Log](https://github.com/Azure/azure-sdk-for-net/blob/Azure.Search.Documents_11.3.0/sdk/search/Azure.Search.Documents/CHANGELOG.md) for information about minor releases. |
| [Microsoft.Azure.Search 10](https://www.nuget.org/packages/Microsoft.Azure.Search/) | Retired | Released May 2019. This is the last version of the Microsoft.Azure.Search package and it's now deprecated. It's succeeded by Azure.Search.Documents. |
| [Microsoft.Azure.Management.Search 4.0.0](https://www.nuget.org/packages/Microsoft.Azure.Management.Search/4.0.0) | Active | Targets the Management REST api-version=2020-08-01. |
| [Microsoft.Azure.Management.Search 3.0.0](https://www.nuget.org/packages/Microsoft.Azure.Management.Search/3.0.0) | Retired | Targets the Management REST api-version=2015-08-19.  |

## Azure SDK for Java

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [Java azure-search-documents 11](/java/api/overview/azure/search-documents-readme) | Active | Use the `azure-search-documents` client library for data plane operations. |
| [Java Management Client 1.35.0](/java/api/overview/azure/search/management) | Active | Use the `azure-mgmt-search` client library for control plane operations. |

## Azure SDK for JavaScript

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [JavaScript @azure/search-documents 11.0](/javascript/api/overview/azure/search-documents-readme) | Active | Use the `@azure/search-documents` client library for data plane operations. |
| [JavaScript @azure/arm-search](https://www.npmjs.com/package/@azure/arm-search) | Active | Use the `@azure/arm-search` client library for control plane operations. |

## Azure SDK for Python

| SDK version | Status | Description  |
|-------------|--------|------------------------------|
| [Python azure-search-documents 11.0](/python/api/azure-search-documents) | Active | Use the `azure-search-documents` client library for data plane operations. |
| [Python azure-mgmt-search 8.0](https://pypi.org/project/azure-mgmt-search/) | Active | Use the `azure-mgmt-search` client library for control plane operations. |

## All Azure SDKs

If you are looking for beta client libraries and documentation, [this page](https://azure.github.io/azure-sdk/releases/latest/index.html) contains links to all of the Azure SDK library packages, code, and docs. 
