---
title: Migrate from the EA Usage Details APIs
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the EA Usage Details APIs.
author: bandersmsft
ms.author: banders
ms.date: 11/17/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from EA Usage Details APIs

EA customers who were previously using the Enterprise Reporting APIs behind the *consumption.azure.com* endpoint to obtain usage details and marketplace charges need to migrate to new and improved solutions. Instructions are outlined below along with contract differences between the old API and the new solutions.

The dataset is referred to as *cost details* instead of *usage details*.

## New solutions generally available

The following table provides a summary of the migration destinations that are available along with a summary of what to consider when choosing which solution is best for you.

| Solution | Description | Considerations | Onboarding info |
| --- | --- | --- | --- |
| **Exports** | Recurring data dumps to storage on a schedule | - The most scalable solution for your workloads.<br> - Can be configured to use file partitioning for bigger datasets.<br> - Great for establishing and growing a cost dataset that can be integrated with your own queryable data stores.<br> -Requires access to a storage account that can hold the data. | - [Configure in Azure portal](../costs/tutorial-export-acm-data.md)<br>[Automate Export creation with the API](../costs/ingest-azure-usage-at-scale.md)<br> - [Export API Reference](/rest/api/cost-management/exports/create-or-update) |
| **Cost Details API** | On demand download | - Useful for small cost datasets.<br> - Useful for scenarios when Exports to Azure storage aren't feasible due to security or manageability concerns. | - [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md)<br> - [Cost Details](/rest/api/cost-management/generate-cost-details-report) API |

Generally we recommend using [Exports](../costs/tutorial-export-acm-data.md) if you have ongoing data ingestion needs and/or a large monthly cost details dataset. For more information, see [Ingest cost details data](automation-ingest-usage-details-overview.md). If you need additional information to help you make a decision for your workload, see [Choose a cost details solution](usage-details-best-practices.md).

### Assign permissions to an SPN to call the APIs

If you're looking to call either the Exports or Cost Details APIs programmatically, you'll need to configure a Service Principal with the correct permission. For more information, see [Assign permissions to ACM APIs](cost-management-api-permissions.md).

### Avoid the Microsoft Consumption Usage Details API

The [Consumption Usage Details API](/rest/api/consumption/usage-details/list) is another endpoint that currently supports EA customers. Don't migrate to this API. Migrate to either Exports or the Cost Details API, as outlined earlier in this document. The Consumption Usage Details API will be deprecated in the future and is located behind the endpoint below.

```http
GET https://management.azure.com/{scope}/providers/Microsoft.Consumption/usageDetails?api-version=2021-10-01
```

This API is a synchronous endpoint and will be unable to scale as both your spending and the size of your month over month cost dataset increases. If you're currently using the Consumption Usage Details API, we recommend migrating off of it to either Exports of the Cost Details API as soon as possible. A formal deprecation announcement will be made at a future date and a timeline for retirement will be provided. To learn more about migrating away from Consumption Usage Details, see [Migrate from Consumption Usage Details API](migrate-consumption-usage-details-api.md).

## Migration benefits

Our new solutions provide many benefits over the EA Reporting Usage Details APIs. Here's a summary:

- **Security and stability** - New solutions require Service Principal and/or user tokens in order to access data. They're more secure than the API keys that are used for authenticating to the EA Reporting APIs. Keys in these legacy APIs are valid for six months and can expose sensitive financial data if leaked. Additionally, if keys aren't renewed and integrated into workloads prior to their six month expiry data access is revoked. This breaks customer workloads.
- **Scalability** - The EA Reporting APIs aren't built to scale well as your Azure usage increases. The usage details dataset can get exceedingly large as you deploy more resources into the cloud. The new solutions are asynchronous and have extensive infrastructure enhancements behind them to ensure successful downloads for any size dataset.
- **Single dataset for all usage details** - Azure and Azure Marketplace usage details have been merged into one dataset in the new solutions. The single dataset reduces the number of APIs that you need to call to see all your charges.
- **Purchase amortization** - Customers who purchase Reservations can see an Amortized view of their costs using the new solutions.
- **Schema consistency** - Each solution that is available provides files with matching fields. It allows you to easily move between solutions based on your scenario.
- **Cost Allocation integration** - Enterprise Agreement and Microsoft Customer Agreement customers can use the new solution to view charges in relation to the cost allocation rules that they've configured. For more information about cost allocation, see [Allocate costs](../costs/allocate-costs.md).
- **Go forward improvements** - The new solutions are being actively developed moving forward. They'll receive all new features as they're released.

## Enterprise Usage APIs to migrate off

The table below summarizes the different APIs that you may be using today to ingest cost details data. If you're using one of the APIs below, you'll need to migrate to one of the new solutions outlined above. All APIs below are behind the *https://consumption.azure.com* endpoint.

| Endpoint | API Comments | 
| --- | ---|
| `/v3/enrollments/{enrollmentNumber}/usagedetails/download?billingPeriod={billingPeriod}` | - API method: GET<br> - Synchronous (non polling)<br> - Data format: CSV |
| `/v3/enrollments/{enrollmentNumber}/usagedetails/download?startTime=2017-01-01&endTime=2017-01-10` | - API method: GET <br> - Synchronous (non polling)<br> - Data format: CSV |
| `/v3/enrollments/{enrollmentNumber}/usagedetails` | - API method: GET<br> - Synchronous (non polling)<br> - Data format: JSON | 
| `/v3/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/usagedetails` | - API method: GET<br> - Synchronous (non polling)<br> - Data format: JSON |
| `/v3/enrollments/{enrollmentNumber}/usagedetailsbycustomdate?startTime=2017-01-01&endTime=2017-01-10` | - API method: GET<br> - Synchronous (non polling)<br> - Data format: JSON |
| `/v3/enrollments/{enrollmentNumber}/usagedetails/submit?billingPeriod={billingPeriod}` | - API method: POST<br> - Asynchronous (polling based)<br> - Data format: CSV |
| `/v3/enrollments/{enrollmentNumber}/usagedetails/submit?startTime=2017-04-01&endTime=2017-04-10` | - API method: POST<br> - Asynchronous (polling based)<br> - Data format: CSV |

## Enterprise Marketplace Store Charge APIs to migrate off

In addition to the usage details APIs outlined above, you'll need to migrate off the [Enterprise Marketplace Store Charge APIs](/rest/api/billing/enterprise/billing-enterprise-api-marketplace-storecharge). All Azure and Marketplace charges have been merged into a single file that is available through the new solutions. You can identify which charges are *Azure* versus *Marketplace* charges by using the `PublisherType` field that is available in the new dataset. The table below outlines the applicable APIs. All of the following APIs are behind the *https://consumption.azure.com* endpoint.

| Endpoint | API Comments | 
| --- | --- |
| `/v3/enrollments/{enrollmentNumber}/marketplacecharges` | - API method: GET<br> - Synchronous (non polling)<br> - Data format: JSON |
| `/v3/enrollments/{enrollmentNumber}/billingPeriods/{billingPeriod}/marketplacecharges` | - API method: GET<br> - Synchronous (non polling)<br> - Data format: JSON |
| `/v3/enrollments/{enrollmentNumber}/marketplacechargesbycustomdate?startTime=2017-01-01&endTime=2017-01-10` | - API method: GET<br> - Synchronous (non polling)<br> - Data format: JSON | 

## Data field mapping

The table below provides a summary of the old fields available in the solutions you're currently using along with the field to use in the new solutions.

| Old field | New field | Comments |
| --- | ---| --- |
| serviceName | MeterCategory |  |
| serviceTier | MeterSubCategory |  |
| location | ResourceLocation |  |
| chargesBilledSeparately | isAzureCreditEligible | The properties are opposites. If isAzureCreditEnabled is true, ChargesBilledSeparately would be false. |
| partNumber | PartNumber |  |
| resourceGuid | MeterId | Values vary. `resourceGuid` is a GUID value. `meterId` is a long number. |
| offerId | OfferId |  |
| cost | CostInBillingCurrency |  |
| accountId | AccountId |  |
| resourceLocationId |  | Not available. |
| consumedServiceId | ConsumedService | `consumedServiceId` only provides a number value. `ConsumedService` provides the name of the service. |
| departmentId | InvoiceSectionId |  |
| accountOwnerEmail | AccountOwnerId |  |
| accountName | AccountName |  |
| subscriptionId | SubscriptionId |  |
| subscriptionGuid | SubscriptionId |  |
| subscriptionName | SubscriptionName |  |
| date | Date |  |
| product | ProductName |  |
| meterId | MeterId |  |
| meterCategory | MeterCategory |  |
| meterSubCategory | MeterSubCategory |  |
| meterRegion | MeterRegion |  |
| meterName | MeterName |  |
| consumedQuantity | Quantity |  |
| resourceRate | EffectivePrice |  |
| resourceLocation | ResourceLocation |  |
| consumedService | ConsumedService |  |
| instanceId | ResourceId |  |
| serviceInfo1 | ServiceInfo1 |  |
| serviceInfo2 | ServiceInfo2 |  |
| additionalInfo | AdditionalInfo |  |
| tags | Tags |  |
| storeServiceIdentifier |  | Not available. |
| departmentName | InvoiceSectionName |  |
| costCenter | CostCenter |  |
| unitOfMeasure | UnitOfMeasure |  |
| resourceGroup | ResourceGroup |  |
| isRecurringCharge |  | Where applicable, use the Frequency and Term fields moving forward. |
| extendedCost | CostInBillingCurrency |  |
| planName | PlanName |  |
| publisherName | PublisherName |  |
| orderNumber |  | Not available. |
| usageStartDate | Date |  |
| usageEndDate | Date |  |

## Next steps

- Read the [Migrate from EA Reporting to Azure Resource Manager APIs overview](migrate-ea-reporting-arm-apis-overview.md) article.
