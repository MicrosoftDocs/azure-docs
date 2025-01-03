---
title: Migrate from EA Marketplace Store Charge API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Marketplace Store Charge API.
author: bandersmsft
ms.author: banders
ms.date: 06/14/2024
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: maminn
---

# Migrate from EA Marketplace Store Charge API

EA customers who were previously using the Enterprise Reporting consumption.azure.com API to get their marketplace store charges need to migrate to a replacement Azure Resource Manager API. This article helps you migrate by using the following instructions. It also explains the contract differences between the old API and the new API.

> [!NOTE]
> All Azure Enterprise Reporting APIs are retired. You should [Migrate to Microsoft Cost Management APIs](migrate-ea-reporting-arm-apis-overview.md) as soon as possible.

Endpoints to migrate off:

|Endpoint|API Comments|
|---|---|
| `/v3/enrollments/{enrollmentNumber}/marketplacecharges` | • API method: GET <br><br> • Synchronous (non polling) <br><br> • Data format: JSON |
| `/v3/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/marketplacecharges` | • API method: GET <br><br> • Synchronous (non polling) <br><br>  • Data format: JSON |
| `/v3/enrollments/{enrollmentNumber}/marketplacechargesbycustomdate?startTime=2017-01-01&endTime=2017-01-10` | • API method: GET <br><br> • Synchronous (non polling) <br><br> • Data format: JSON |

## New solutions generally available

We merged Azure Marketplace and Azure usage records into a single cost details dataset.

The following table provides a summary of the migration destinations that are available along with a summary of what to consider when choosing which solution is best for you.

| Solution | Purpose | Considerations | Onboarding details |
| --- | --- | --- | --- |
| **Exports** | Recurring data dumps to storage on a schedule | • The most scalable solution for your workloads.  <br>• Can be configured to use file partitioning for bigger datasets.  <br>• Great for establishing and growing a cost dataset that can be integrated with your own queryable data stores.  <br>• Requires access to a storage account that can hold the data. | • [Configure in Azure portal](../costs/tutorial-export-acm-data.md)  <br>[Automate Export creation with the API](../costs/ingest-azure-usage-at-scale.md)  <br>• [Export API Reference](/rest/api/cost-management/exports/create-or-update) |
| **Cost Details API** | On demand download | • Useful for small cost datasets.  <br>• Useful for scenarios when Exports to Azure storage aren't feasible due to security or manageability concerns. | • [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md)  <br>• [Cost Details](/rest/api/cost-management/generate-cost-details-report) API |

We recommend using Exports if you have ongoing data ingestion needs or a large monthly cost details dataset. For more information, see [Ingest cost details data](automation-ingest-usage-details-overview.md). If you need additional information to help you make a decision for your workload, see [Choose a cost details solution](usage-details-best-practices.md).

## Assign permissions to a service principal to call the API

Before calling the API, you need to configure a service principal with the correct permission. You use the service principal to call the API. For more information, see [Assign permissions to Cost Management APIs](cost-management-api-permissions.md).

## Avoid the Microsoft Consumption Marketplaces API

The Consumption Marketplaces API is another endpoint that currently supports EA customers. Don't migrate to this API. Migrate to either Exports or the Cost Details API, as outlined earlier in this document. The Consumption Marketplaces API will be deprecated in the future.

## Field differences

The following table summarizes the field mapping needed to transition from the data provided by the Marketplaces API to Exports and the Cost Details API. Both of the solutions provide a CSV file download as opposed to the paginated JSON response that gets provided by the Consumption API.

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

## Related content

- Read the [Migrate from Azure Enterprise Reporting to Microsoft Cost Management APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.