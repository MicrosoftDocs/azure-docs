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

# Azure AI Search feature availability across clouds regions

This article identifies the cloud regions in which Azure AI Search is available. It also lists which premium features are available in each region:

- [Semantic ranking](semantic-search-overview.md) depends on models hosted by Microsoft. These models are available in specific regions.
- [Azure AI integration](cognitive-search-concept-intro.md) (skills and vectorizers) requires that Azure AI Search coexist with an [Azure AI multi-service account](/azure/ai-services/multi-service-resource) in the same region. The following tables indicate whether Azure AI is generally available in the same region as Azure AI Search.

We recommend that you [check Azure AI Studio region availability](/azure/ai-studio/reference/region-support) for an updated list of regions for that feature. 

Also, if you're using Azure AI Vision 4.0 multimodal APIs for image vectorization, it's available in a more limited set of regions. [Check the Azure AI Vision region list for multimodal embeddings](/azure/ai-services/computer-vision/overview-image-analysis#region-availability) and be sure to create both your Azure AI multi-service account and Azure AI Search service in one of those supported regions.

> [!NOTE]
> Higher capacity partitions became available in selected regions starting in April 2024. A second wave of higher capacity partitions released in May 2024. If you're using an older search service, consider creating a new search service to benefit from more capacity at the same billing rate as before. For more information, see [Service limits](search-limits-quotas-capacity.md#service-limits)

## Azure Public regions

You can create an Azure AI Search resource in any of the following Azure public regions. All of these regions support [higher capacity tiers](search-limits-quotas-capacity.md#service-limits).

### United States

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| East US​ | ✅ | ✅ |
| East US 2 ​ | ✅ | ✅ |
| East US 2 EUAP/PPE ​ | ✅ | ✅ |
| ​Central US​ ​ | ✅ | ✅ |
| North Central US​ ​ | ✅ | ✅ |
| South Central US​ ​ | ✅ | ✅ |
| West US​ ​ | ✅ | ✅ |
| West US 2​ ​ | ✅ | ✅ |
| West US 3​ ​ | ✅ | ✅ |
| West Central US​ ​ | ✅ | ✅ |

### United Kingdom

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| UK South​ | ✅ | ✅ |
| UK West​ ​| ✅ | ✅ |

### United Arab Emirates

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| UAE North​​ | ✅ | ✅ |

### Switzerland

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Switzerland West​ | ✅ | ✅ |

### Sweden

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Sweden Central​​ | ✅ | ✅ |

### South Africa

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| South Africa North​ | ✅ | ✅ |

### Poland

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Poland Central​​ | ✅ | ✅ |

### Norway

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Norway East​​ | ✅ | ✅ |

### Korea

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Korea Central | ✅ | ✅ |
| Korea South​ ​ | ✅ | ✅ |

### Japan

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Japan East| ✅ | ✅ |
| Japan West​ | ✅ | ✅ |

### Italy

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Italy North​​ | ✅ | ✅ |

### India

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Central India| ✅ | ✅ |
| Jio India West​ ​ | ✅ | ✅ |

### Germany

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Germany North ​| ✅ | ✅ |
| Germany West Central​ ​| ✅ | ✅ |

### France

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| France Central​​ | ✅ | ✅ |

### Europe

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| North Europe​​ | ✅ | ✅ |

### Canada

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Canada Central​​ | ✅ | ✅ |
| Canada East​​ ​ | ✅ | ✅ |

### Bazil

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Brazil South​​ ​ | ✅ | ✅ |

### Asia Pacific

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| East Asia​ | ✅ | ✅ |
| Southeast Asia​ ​ ​ | ✅ | ✅ |

### Australia

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Australia East​ ​ | ✅ | ✅ |
| Australia Southeast​​​ | ✅ | ✅ |

## Azure Government regions

All of these regions support [higher capacity tiers](search-limits-quotas-capacity.md#service-limits).

| Region | Azure AI integration | Semantic ranking |
|--|--|--|
| Arizona | ✅ |  |
| Texas |  |  |
| Virginia | ✅ |  |

## Azure operated by 21Vianet

You can install Azure AI Search in any of the following regions. If you need semantic ranking or Azure AI integration, choose a region that provides the feature.

| Region | Azure AI integration  | Semantic ranking |
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