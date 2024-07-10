---
title: Feature availability across clouds regions
titleSuffix: Azure AI Search
description: Shows supported regions and feature availability across regions for Azure AI Search.

manager: nitinme
author: HeidiSteen
ms.author: heidist
ms.service: cognitive-search
ms.topic: conceptual
ms.custom: references_regions
ms.date: 07/09/2024

---

# Azure AI Search feature availability across cloud regions

This article identifies the cloud regions in which Azure AI Search is available. It also lists which premium features are available in each region:

- [Semantic ranking](semantic-search-overview.md) depends on models hosted by Microsoft. These models are available in specific regions.
- [AI enrichment](cognitive-search-concept-intro.md) refer to skills and vectorizers that make internal calls to Azure AI and Azure OpenAI. AI enrichment requires that Azure AI Search coexist with an [Azure AI multi-service account](/azure/ai-services/multi-service-resource) in the same physical region. The following tables indicate whether Azure AI is offered in the same region as Azure AI Search.

We recommend that you [check Azure AI Studio region availability](/azure/ai-studio/reference/region-support) for an updated list of regions for that feature. 

Also, if you're using Azure AI Vision 4.0 multimodal APIs for image vectorization, it's available in a more limited set of regions. [Check the Azure AI Vision region list for multimodal embeddings](/azure/ai-services/computer-vision/overview-image-analysis#region-availability) and be sure to create both your Azure AI multi-service account and Azure AI Search service in one of those supported regions.

> [!NOTE]
> Higher capacity partitions became available in selected regions starting in April 2024. A second wave of higher capacity partitions released in May 2024. If you're using an older search service, consider creating a new search service to benefit from more capacity at the same billing rate as before. For more information, see [Service limits](search-limits-quotas-capacity.md#service-limits)

## Azure Public regions

You can create an Azure AI Search resource in any of the following Azure public regions. Almost all of these regions support [higher capacity tiers](search-limits-quotas-capacity.md#service-limits). Exceptions are noted where they apply.

### United States

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| East US​ | ✅ | ✅ |
| East US 2 ​ | ✅ | ✅ |
| ​Central US​ ​ | ✅ | ✅ |
| North Central US​ ​ | ✅ | ✅ |
| South Central US​ ​ | ✅ | ✅ |
| West US​ ​ | ✅ | ✅ |
| West US 2​ ​ | ✅ | ✅ |
| West US 3​ ​ | ✅ | ✅ |
| West Central US​ ​ | ✅ | ✅ |

### United Kingdom

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| UK South​ | ✅ | ✅ |
| UK West​ ​|  | ✅ |

### United Arab Emirates

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| UAE North​​ | ✅ |  |

### Switzerland

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Switzerland West​ | ✅ | ✅ |

### Sweden

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Sweden Central​​ | ✅ |  |
| Sweden North​ | ✅ | ✅ |

### South Africa

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| South Africa North​ | ✅ |  |

### Qatar

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Qatar Central​ <sup>1</sup> |  |  |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### Poland

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Poland Central​​ |  |  |

### Norway

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Norway East​​ | ✅ | |

### Korea

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Korea Central | ✅ | ✅ |
| Korea South​ ​ |  | ✅ |

### Japan

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Japan East| ✅ | ✅ |
| Japan West​ | ✅ | ✅ |

### Italy

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Italy North​​ |  |  |

### Israel

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Israel Central​ <sup>1</sup> |  |  |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### India

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Central India| ✅ | ✅ |
| Jio India West​ ​ | ✅ | ✅ |

### Germany

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Germany North ​|  |  |
| Germany West Central​ ​| ✅ |  |

### France

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| France Central​​ | ✅ | ✅ |

### Europe

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| North Europe​​ | ✅ | ✅ |
| West Europe​​ <sup>1</sup>| ✅ | ✅ |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### Canary (US)

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Central US EUAP​ <sup>1</sup> | | ✅ |
| East US 2 EUAP ​ | | ✅ |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### Canada

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Canada Central​​ | ✅ | ✅ |
| Canada East​​ ​ |  | ✅ |

### Bazil

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Brazil South​​ ​ | ✅ | ✅ |

### Asia Pacific

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| East Asia​ | ✅ | ✅ |
| Southeast Asia​ ​ ​ | ✅ | ✅ |

### Australia

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Australia East​ ​ | ✅ | ✅ |
| Australia Southeast​​​ |  | ✅ |

## Azure Government regions

All of these regions support [higher capacity tiers](search-limits-quotas-capacity.md#service-limits).

| Region | AI enrichment | Semantic ranking |
|--|--|--|
| Arizona | ✅ |  |
| Texas |  |  |
| Virginia | ✅ |  |

## Azure operated by 21Vianet

You can install Azure AI Search in any of the following regions. If you need semantic ranking or AI enrichment, choose a region that provides the feature.

| Region | AI enrichment  | Semantic ranking |
|--|--|--|
| China East |  |  |
| China East 2 | ✅  | |
| China East 3 <sup>1</sup>|  |  |
| China North |  |  |
| China North 2 |  |  |
| China North 3 <sup>1</sup>| | ✅ |

<sup>1</sup> These regions have more powerful infrastructure. Search services created in these regions have [more capacity at every tier](search-limits-quotas-capacity.md#service-limits) than services created in other regions.

## See also

[Azure product by region page](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=search)