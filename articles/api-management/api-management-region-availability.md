---
title: Azure API Management - Availability of v2 tiers and workspace gateways
description: Availability of API Management v2 tiers and workspace gateways in Azure regions. This information supplements product availability by region. 
services: api-management
author: dlepow
 
ms.service: azure-api-management
ms.topic: concept-article
ms.date: 04/24/2026
ms.author: danlep
ms.custom:
  - references_regions
  - build-2025
---

# Azure API Management - Availability of v2 tiers and workspace gateways

[!INCLUDE [api-management-availability-basicv2-standardv2-premium-premiumv2](../../includes/api-management-availability-basicv2-standardv2-premium-premiumv2.md)]

API Management [v2 tiers](v2-service-tiers-overview.md) and API Management [workspace gateways](workspaces-overview.md#workspace-gateway) are available in a subset of the regions where the classic tiers are available. For information about the availability of the API Management classic tiers, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).


## Supported regions for v2 tiers and workspace gateways

Information in the following table is updated regularly. Capacity availability in Azure regions may vary.

> [!IMPORTANT]
> **Temporary capacity limitations**
> - Creation of new Basic v2 and Standard v2 instances in **UK South** is currently unavailable due to capacity constraints. We're actively working to restore availability in this region. In the meantime, consider deploying to an alternative region such as **UK West** or **North Europe**. Existing instances in UK South are not affected.
> - Creation of new Premium v2 instances in **East US 2** is currently unavailable. Existing instances in East US 2 are not affected.

| Region | Basic v2 | Standard v2 | Premium v2 | Workspace gateway (Premium) | 
|-----|:---:|:---:|:---:|:---:|
| Australia Central | ✅ | ✅ | | |
| Australia East | ✅ | ✅ | ✅ | ✅ |
| Australia Southeast | ✅ | ✅ | | |
| Brazil South | ✅ | ✅ | |  |
| Canada Central  | ✅ | ✅ | ✅ |  |
| Central India  | ✅ | ✅ | |  |
| Central US  | ✅ | ✅ | ✅ |  |
| East Asia | ✅ | ✅ | | ✅ |
| East US  | ✅ | ✅ |  |  |
| East US 2 | ✅ | ✅ | ✅ ¹ | ✅ |
| France Central  | ✅ | ✅ | | ✅ |
| Germany West Central  | ✅ | ✅ | ✅ | ✅ |
| Italy North | ✅ | ✅ |  |  |
| Japan East | ✅ | ✅ | | ✅ |
| Korea Central | ✅ | ✅ | ✅ | | 
| North Central US | ✅ | ✅ |  | ✅ |
| North Europe | ✅ | ✅ |  | ✅ |
| Norway East | ✅ | ✅ | ✅ | ✅ |
| South Africa North | ✅ | ✅ | |  |
| South Central US | ✅ | ✅ |  |  |
| South India | ✅ | ✅ |  |  |
| Sweden Central | ✅ | ✅ | ✅ | |
| South India | ✅ | ✅ |  |  |
| Switzerland North | ✅ |✅ |  | |
| UAE North | ✅ | ✅ | |  |
| UK South | ✅ ¹ | ✅ ¹ | ✅ | ✅ |
| UK West | ✅  | ✅ | | |
| West Europe  | ✅ | ✅ | | ✅ |
| West US | ✅ | ✅ |  | ✅ |
| West US 2 | ✅ | ✅ |  | |
| West US 3 | | ✅ |  | |

¹ New instance creation temporarily unavailable. See the capacity limitation note above.

## Related content

Learn more about:

* [API Management pricing](https://aka.ms/apimpricing)
