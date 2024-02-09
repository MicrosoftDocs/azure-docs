---
title: Migrate from Consumption Marketplaces API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the Consumption Marketplaces API.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from Consumption Marketplaces API

This article discusses migration away from the [Consumption Marketplaces API](/rest/api/consumption/marketplaces/list). The Consumption Marketplaces API is deprecated. The date that the API will be turned off is still being determined. We recommend that you migrate away from the API as soon as possible.

This article only applies to customers with an Enterprise Agreement or an MSDN, pay-as-you-go, or Visual Studio subscription.

## Migration destinations

We've merged Azure Marketplace and Azure usage records into a single usage details dataset. Read the [Choose a cost details solution](usage-details-best-practices.md) article before you choose the solution that's right for your workload. Generally, we recommend using [Exports](../costs/tutorial-export-acm-data.md) if you have ongoing data ingestion needs or a large monthly usage details dataset. For more information, see [Ingest usage details data](automation-ingest-usage-details-overview.md).

If you have a smaller usage details dataset or a scenario that isn't met by Exports, consider using the [Cost Details](/rest/api/cost-management/generate-cost-details-report) report instead. For more information, see [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).

> [!NOTE]
> The [Cost Details](/rest/api/cost-management/generate-cost-details-report) report is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you have an MSDN, pay-as-you-go, or Visual Studio subscription, you can migrate to Exports or continue using the Consumption Usage Details API.

## Migration benefits

New solutions provide many benefits over the Consumption Usage Details API. Here's a summary:

- **Single dataset for all usage details** - Azure and Azure Marketplace usage details were merged into one dataset. It reduces the number of APIs that you need to call to get see all your charges.
- **Scalability** - The Marketplaces API is deprecated because it promotes a call pattern that isn't able to scale as your Azure usage increases. The usage details dataset can get exceedingly large as you deploy more resources into the cloud. The Marketplaces API is a paginated synchronous API so it isn't optimized to effectively transfer large volumes of data over a network with high efficiency and reliability. Exports and the [Cost Details](/rest/api/cost-management/generate-cost-details-report) report are asynchronous. They provide you with a CSV file that can be directly downloaded over the network.
- **API improvements** - Exports and the Cost Details API are the solutions that Azure supports moving forward. All new features are being integrated into them.
- **Schema consistency** - The [Cost Details](/rest/api/cost-management/generate-cost-details-report) API and [Exports](../costs/tutorial-export-acm-data.md) process provide files with matching fields os you can move from one solution to the other, based on your scenario.
- **Cost Allocation integration** - Enterprise Agreement and Microsoft Customer Agreement customers using Exports or the Cost Details API can view charges in relation to the cost allocation rules that they've configured. For more information about cost allocation, see [Allocate costs](../costs/allocate-costs.md).

## Field differences

The following table summarizes the field mapping needed to transition from the data provided by the Marketplaces API to Exports and the Cost Details API. Both of the solutions provide a CSV file download as opposed to the paginated JSON response that's provided by the Consumption API.

Usage records can be identified as marketplace records in the combined dataset through the `PublisherType` field. Also, there are many new fields in the newer solutions that might be useful to you. For more information about available fields, see [Understand usage details fields](understand-usage-details-fields.md).

| **Old Property** | **New Property** | **Notes** |
| --- | --- | --- |
| | PublisherType | Used to identify a marketplace usage record |
| accountName | AccountName | |
| additionalProperties | AdditionalInfo |  |
| costCenter | CostCenter | |
| departmentName | BillingProfileName |  |
| billingPeriodId | | Use BillingPeriodStartDate / BillingPeriodEndDate |
| usageStart |  | Use Date |
| usageEnd |  | Use Date |
| instanceName | ResourceName |  |
| instanceId | ResourceId |  |
| currency | BillingCurrencyCode |  |
| consumedQuantity | Quantity |  |
| pretaxCost | CostInBillingCurrency |  |
| isEstimated |  | Not available |
| meterId | MeterId |  |
| offerName | OfferId |  |
| resourceGroup | ResourceGroup |  |
| orderNumber |  | Not available |
| publisherName | PublisherName |  |
| planName | PlanName |  |
| resourceRate | EffectivePrice |  |
| subscriptionGuid | SubscriptionId |  |
| subscriptionName | SubscriptionName |  |
| unitOfMeasure | UnitOfMeasure |  |
| isRecurringCharge |  | Where applicable, use the Frequency and Term fields moving forward. |

## Next steps

- Learn more about Cost Management automation at [Cost Management automation overview](automation-overview.md).
