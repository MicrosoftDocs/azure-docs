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
ms.date: 07/25/2024

---

# Azure AI Search feature availability across cloud regions

This article identifies the cloud regions in which Azure AI Search is available. It also lists which premium features are available in each region:

- [Semantic ranking](semantic-search-overview.md) depends on models hosted by Microsoft. These models are available in specific regions.
- [AI enrichment](cognitive-search-concept-intro.md) refer to skills and vectorizers that make internal calls to Azure AI and Azure OpenAI. AI enrichment requires that Azure AI Search coexist with an [Azure AI multi-service account](/azure/ai-services/multi-service-resource) in the same physical region. The following tables indicate whether Azure AI is offered in the same region as Azure AI Search.
- [Availability zones](search-reliability.md#availability-zone-support) are an Azure platform capability that divides a region's data centers into distinct physical location groups to provide high-availability, within the same region.

We recommend that you check [Azure AI Studio region availability](/azure/ai-studio/reference/region-support) and [Azure OpenAI model region availability](/azure/reliability/availability-zones-service-support#azure-regions-with-availability-zone-support) for the most current list of regions for those features. 

Also, if you're using Azure AI Vision 4.0 multimodal APIs for image vectorization, it's available on a more limited basis. [Check the Azure AI Vision region list for multimodal embeddings](/azure/ai-services/computer-vision/overview-image-analysis#region-availability) and be sure to create both your Azure AI multi-service account and Azure AI Search service in one of those supported regions.

> [!NOTE]
> Higher capacity partitions became available in selected regions starting in April 2024. A second wave of higher capacity partitions released in May 2024. If you're using an older search service, consider creating a new search service to benefit from more capacity at the same billing rate as before. For more information, see [Service limits](search-limits-quotas-capacity.md#service-limits)

## Azure Public regions

You can create an Azure AI Search resource in any of the following Azure public regions. Almost all of these regions support [higher capacity tiers](search-limits-quotas-capacity.md#service-limits). Exceptions are noted where they apply.

### Americas

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Brazil South​​ ​ | ✅ | ✅ | |
| Canada Central​​ | ✅ | ✅ | ✅ |
| Canada East​​ ​ |  | ✅ | |
| East US​ | ✅ | ✅ | ✅ |
| East US 2 ​ | ✅ | ✅ | ✅ |
| ​Central US​ ​ | ✅ | ✅ | ✅ |
| North Central US​ ​ | ✅ | ✅ | |
| South Central US​ ​ | ✅ | ✅ | ✅ |
| West US​ ​ | ✅ | ✅ | |
| West US 2​ ​ | ✅ | ✅ | ✅ |
| West US 3​ ​ | ✅ | ✅ |✅ |
| West Central US​ ​ | ✅ | ✅ | |

### Europe

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| North Europe​​ | ✅ | ✅ | ✅ |
| West Europe​​ <sup>1</sup>| ✅ | ✅ | ✅ |
| France Central​​ | ✅ | ✅ | ✅ |
| Germany West Central​ ​| ✅ |  | ✅ |
| Italy North​​ |  |  | ✅ |
| Norway East​​ | ✅ |  | ✅ |
| Poland Central​​ |  |  |  |
| Spain Central |  |  | ✅  |
| Sweden Central​​ | ✅ |  | ✅ |
| Switzerland North​ | ✅ | ✅ | ✅ |
| Switzerland West​ | ✅ | ✅ | ✅ |
| UK South​ | ✅ | ✅ | ✅ |
| UK West​ ​|  | ✅ | |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. Choose a different region if you want [higher capacity](search-limits-quotas-capacity.md#service-limits).

### Middle East

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Israel Central​ <sup>1</sup> |  |  | ✅  |
| Qatar Central​ <sup>1</sup> |  |  | ✅ |
| UAE North​​ | ✅ |  | ✅ |

<sup>1</sup> These regions run on older infrastructure that has lower capacity per partition at every tier. Choose a different region if you want [higher capacity](search-limits-quotas-capacity.md#service-limits).

### Africa

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| South Africa North​ | ✅ |  | ✅ |

### Asia Pacific

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Australia East​ ​ | ✅ | ✅ | ✅ |
| Australia Southeast​​​ |  | ✅ |  |
| East Asia​ | ✅ | ✅ | ✅ |
| Southeast Asia​ ​ ​ | ✅ | ✅ | ✅ |
| Central India| ✅ | ✅ | ✅ |
| Jio India West​ ​ | ✅ | ✅ |  |
| South India <sup>1</sup> |  | | ✅ |
| Japan East| ✅ | ✅ | ✅ |
| Japan West​ | ✅ | ✅ |  |
| Korea Central | ✅ | ✅ | ✅ |
| Korea South​ ​ |  | ✅ |  |

<sup>1</sup> These regions run on older infrastructure that has lower capacity per partition at every tier. Choose a different region if you want [higher capacity](search-limits-quotas-capacity.md#service-limits).


<!-- ### United States

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| East US​ | ✅ | ✅ | ✅ |
| East US 2 ​ | ✅ | ✅ | ✅ |
| ​Central US​ ​ | ✅ | ✅ | ✅ |
| North Central US​ ​ | ✅ | ✅ | |
| South Central US​ ​ | ✅ | ✅ | ✅ |
| West US​ ​ | ✅ | ✅ | |
| West US 2​ ​ | ✅ | ✅ | ✅ |
| West US 3​ ​ | ✅ | ✅ |✅ |
| West Central US​ ​ | ✅ | ✅ | |

### United Kingdom

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| UK South​ | ✅ | ✅ | ✅ |
| UK West​ ​|  | ✅ | |

### United Arab Emirates

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| UAE North​​ | ✅ |  | ✅ |

### Switzerland

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Switzerland North​ | ✅ | ✅ | ✅ |
| Switzerland West​ | ✅ | ✅ | ✅ |

### Sweden

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Sweden Central​​ | ✅ |  | ✅ |

### Spain

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Spain Central |  |  | ✅  |

### South Africa

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| South Africa North​ | ✅ |  | ✅ |

### Qatar

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Qatar Central​ <sup>1</sup> |  |  | ✅ |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### Poland

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Poland Central​​ |  |  |  |

### Norway

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Norway East​​ | ✅ |  | ✅ |

### Korea

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Korea Central | ✅ | ✅ | ✅ |
| Korea South​ ​ |  | ✅ |  |

### Japan

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Japan East| ✅ | ✅ | ✅ |
| Japan West​ | ✅ | ✅ |  |

### Italy

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Italy North​​ |  |  | ✅ |

### Israel

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Israel Central​ <sup>1</sup> |  |  | ✅  | 

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### India

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Central India| ✅ | ✅ | ✅ |
| Jio India West​ ​ | ✅ | ✅ |  |
| South India <sup>1</sup> |  | | ✅ |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### Germany

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Germany West Central​ ​| ✅ |  | ✅ |

### France

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| France Central​​ | ✅ | ✅ | ✅ |

### Europe

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| North Europe​​ | ✅ | ✅ | ✅ |
| West Europe​​ <sup>1</sup>| ✅ | ✅ | ✅ |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### Canary (US)

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Central US EUAP​ <sup>1</sup> | | ✅ | |
| East US 2 EUAP ​ | | ✅ | |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region.

### Canada

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Canada Central​​ | ✅ | ✅ | ✅ |
| Canada East​​ ​ |  | ✅ | | 

### Brazil

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Brazil South​​ ​ | ✅ | ✅ | |

### Asia Pacific

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| East Asia​ | ✅ | ✅ | ✅ |
| Southeast Asia​ ​ ​ | ✅ | ✅ | ✅ |

### Australia

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Australia East​ ​ | ✅ | ✅ | ✅ |
| Australia Southeast​​​ |  | ✅ |  | -->

## Azure Government regions

All of these regions support [higher capacity tiers](search-limits-quotas-capacity.md#service-limits). 

None of these regions support Azure [role-based access for data plane operations](search-security-rbac.md). You must use key-based authentication for indexing and query workloads.

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Arizona | ✅ | ✅  | |
| Texas |  |  |  |
| Virginia | ✅ | ✅  | ✅ |

## Azure operated by 21Vianet

You can install Azure AI Search in any of the following regions. If you need semantic ranking or AI enrichment, choose a region that provides the feature.

| Region | AI enrichment  | Semantic ranking | Availability zones |
|--|--|--|--|
| China East <sup>1</sup> |  |  |  |
| China East 2 <sup>1</sup> | ✅  | | |
| China East 3 |  |  |  |
| China North <sup>1</sup> |  |  | |
| China North 2 <sup>1</sup> |  |  | |
| China North 3 | | ✅ | ✅ |

<sup>1</sup> These regions run on older infrastructure that has lower capacity per partition at every tier. Choose a different region if you want [higher capacity](search-limits-quotas-capacity.md#service-limits).

<!-- ## Early Update Access Program (EUAP)

These regions

| Region | AI enrichment | Semantic ranking | Availability zones |
|--|--|--|--|
| Central US EUAP​ <sup>1</sup> | | ✅ | |
| East US 2 EUAP ​ | | ✅ | |

<sup>1</sup> This region runs on older infrastructure that has lower capacity per partition at every tier. You can't create a search service with [higher capacity](search-limits-quotas-capacity.md#service-limits) in this region. -->

## See also

- [Azure AI Studio region availability](/azure/ai-studio/reference/region-support)
- [Azure OpenAI model region availability](/azure/ai-services/openai/concepts/models#model-summary-table-and-region-availability)
- [Availability zone region availability](/azure/reliability/availability-zones-service-support#azure-regions-with-availability-zone-support)
- [Azure product by region page](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/?products=search)