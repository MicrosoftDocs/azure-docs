---
title: Transition from Consumption APIs to Cost Management APIs
description: Learn about transitioning from Consumption APIs to Cost Management APIs for enhanced capabilities and up-to-date functionality in managing Azure costs.
author: vikramdesai01
ms.author: vikdesai
ms.date: 06/26/2025
ms.topic: concept-article
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: vikdesai
#customer intent: As a billing administrator, I want learn about Consumption APIs getting replaced by Cost Management APIs so that I can plan replace them.
---

# Transition from Consumption APIs to Cost Management APIs

This article informs developers that use the [Consumption APIs](/rest/api/consumption) about important changes. There are newer [Microsoft Cost Management APIs](/rest/api/cost-management/) available that offer enhanced capabilities and have the most up-to-date functionality. We recommend that you transition from the Consumption APIs to the Cost Management APIs. The Consumption APIs are in maintenance mode and are on a path to deprecation.

> [!NOTE]
> These APIs differ from the [Enterprise Agreement (EA) reporting APIs](migrate-ea-reporting-arm-apis-overview.md) that are already retired.

## Replacement APIs

Here's a comparison of the APIs. The Cost Management APIs are the recommended replacement for the Consumption APIs. The Cost Management APIs are also the replacement for the [EA reporting APIs](migrate-ea-reporting-arm-apis-overview.md) that are already retired.

| **Use** | **Azure Enterprise Reporting APIs (retired)** | **Microsoft Consumption APIs** | **Microsoft Cost Management APIs (recommended)** |
| --- | --- | --- | --- |
| Authentication | API key provisioned in the Azure portal | Microsoft Entra authentication using user tokens or service principals. Service principals take the place of API keys. | Microsoft Entra authentication using user tokens or service principals. Service principals take the place of API keys. |
| Contract | EA  | EA and Microsoft Customer Agreement (MCA) | EA and MCA |
| Endpoint URI | `https://consumption.azure.com` | `https://management.azure.com` | `https://management.azure.com` |
| API Status | Deprecated | Usage Details API and Marketplaces API are planned for deprecation | Active |

The Cost Management APIs also support all of the latest functionality, such as Savings Plan.

## Consumption APIs deprecation status

The following Consumption APIs are planned for deprecation. We recommend that you avoid building your reporting pipelines using these APIs. You should migrate away from them as soon as possible.

| **API** | **Recommended** | **Deprecation Status** |
| --- | --- | --- |
| [Usage Details API](/rest/api/consumption/usage-details/list) | [Cost Details API](/rest/api/cost-management/generate-cost-details-report) or [Exports](../costs/tutorial-improved-exports.md) | Maintenance mode. Will be deprecated in the future. |
| [Marketplaces API](migrate-consumption-marketplaces-api.md) | [Cost Details API](/rest/api/cost-management/generate-cost-details-report) or [Exports](../costs/tutorial-improved-exports.md) | Maintenance mode. Will be deprecated in the future. | 

## Related content

- [Cost Management automation overview](automation-overview.md)
- [Migrate from Consumption Usage Details API](migrate-consumption-usage-details-api.md)
- [Migrate from Consumption Marketplaces API](migrate-consumption-marketplaces-api.md)
