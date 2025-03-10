---
title: Migrate from Consumption Usage Details API
titleSuffix: Microsoft Cost Management
description: This article has information to help you migrate from the Consumption Usage Details API.
author: bandersmsft
ms.author: banders
ms.date: 01/07/2025
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: jojoh
---

# Migrate from Consumption Usage Details API

This article discusses migration away from the [Consumption Usage Details API](/rest/api/consumption/usage-details/list), which is planned for deprecation. The exact date of deprecation is still being determined. We recommend that you don't build your reporting pipelines using this API and migrate away from it as soon as possible.

The Enterprise Agreement (EA) reporting APIs, that use an API key for authentication and are accessed through the consumption.azure.com URI endpoint, are retired. EA customers using these APIs should migrate to the Cost Management [Cost Details](/rest/api/cost-management/generate-cost-details-report) API. These older EA reporting APIs are only available to customers with an Enterprise Agreement.

If you use the [Consumption Usage Details API](/rest/api/consumption/usage-details/list) we *recommend*, but don't require that you migrate to the Cost Management [Cost Details](/rest/api/cost-management/generate-cost-details-report) API.

Consumption and Cost Management APIs are available for both EA Microsoft Customer Agreement (MCA) customers. So, Azure Government customers that remain under an EA aren't negatively affected.

When you migrate from EA to MCA, we recommend that you move from the EA reporting Usage Details API to Cost Management Cost Details API and use Exports.

## Migration destinations

Read the [Choose a cost details solution](usage-details-best-practices.md) article before you choose which solution is right for your workload. Generally, we recommend [Exports](../costs/tutorial-export-acm-data.md) if you have ongoing data ingestion needs and or a large monthly usage details dataset. For more information, see [Ingest usage details data](automation-ingest-usage-details-overview.md).

If you have a smaller usage details dataset or a scenario that doesn't get met by Exports, consider using the [Cost Details](/rest/api/cost-management/generate-cost-details-report) report instead. For more information, see [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).

> [!NOTE]
> The [Cost Details](/rest/api/cost-management/generate-cost-details-report) report is only available for customers with an Enterprise Agreement or Microsoft Customer Agreement. If you have an MSDN, pay-as-you-go, or Visual Studio subscription, you can migrate to Exports or continue using the Consumption Usage Details API.

## Migration benefits

New solutions provide many benefits over the Consumption Usage Details API. Here's a summary:

- **Single dataset for all usage details** - Azure and Azure Marketplace usage details were merged into one dataset. It reduces the number of APIs that you need to call to get see all your charges.
- **Scalability** - The Marketplaces API is deprecated because it promotes a call pattern that isn't able to scale as your Azure usage increases. The usage details dataset can get large as you deploy more resources into the cloud. The Marketplaces API is a paginated synchronous API so it isn't optimized to effectively transfer large volumes of data over a network with high efficiency and reliability. Exports and the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API are asynchronous. They provide you with a CSV file that can be directly downloaded over the network.
- **API improvements** - Exports and the Cost Details API are the solutions that Azure supports moving forward. All new features are being integrated into them.
- **Schema consistency** - The [Cost Details](/rest/api/cost-management/generate-cost-details-report) report and [Exports](../costs/tutorial-export-acm-data.md) provide files with matching fields os you can move from one solution to the other, based on your scenario.
- **Cost Allocation integration** - Enterprise Agreement and Microsoft Customer Agreement customers using Exports or the Cost Details API can view charges in relation to the cost allocation rules that they configured. For more information about cost allocation, see [Allocate costs](../costs/allocate-costs.md).


## Field Differences

The following table summarizes the field differences between the Consumption Usage Details API and Exports/Cost Details API. Exports and the Cost Details API provide a CSV file download instead of the paginated JSON response that's provided by the Consumption API.

## Enterprise Agreement field mapping

Enterprise Agreement customers who are using the Consumption Usage Details API have usage details records of the kind `legacy`. All Enterprise Agreement customers have records of this kind due to the underlying billing system that's used for them. Here's an example legacy usage details record:

```json
{  

  "value": [  

      {  

          "id": "{id}", 

          "name": "{name}",  

          "type": "Microsoft.Consumption/usageDetails",  

          "kind": "legacy",  

          "tags": {  

               "env": "newcrp",  

               "dev": "tools"  

          },  

          "properties": {  

…... 

      } 

} 
```

A full example legacy Usage Details record is shown at [Usage Details - List - REST API (Azure Consumption)](/rest/api/consumption/usage-details/list#billingaccountusagedetailslist-legacy)

The following table provides a mapping between the old and new fields. New properties are available in the CSV files produced by Exports and the Cost Details API. To learn more about the fields, see [Understand usage details fields](understand-usage-details-fields.md).

Bold property names are unchanged.

| **Old Property** | **New Property** |
| --- | --- |
| accountName | AccountName |
| **AccountOwnerId** | AccountOwnerId |
| additionalInfo | AdditionalInfo |
| **AvailabilityZone** | AvailabilityZone |
| billingAccountId | BillingAccountId |
| billingAccountName | BillingAccountName |
| billingCurrency | BillingCurrencyCode |
| billingPeriodEndDate | BillingPeriodEndDate |
| billingPeriodStartDate | BillingPeriodStartDate |
| billingProfileId | BillingProfileId |
| billingProfileName | BillingProfileName |
| chargeType | ChargeType |
| consumedService | ConsumedService |
| cost | CostInBillingCurrency |
| costCenter | CostCenter |
| date | Date |
| effectivePrice | EffectivePrice |
| frequency | Frequency |
| invoiceSection | InvoiceSectionName |
| **InvoiceSectionId** | InvoiceSectionId |
| isAzureCreditEligible | IsAzureCreditEligible |
| meterCategory | MeterCategory |
| meterId | MeterId |
| meterName | MeterName |
| **MeterRegion** | MeterRegion |
| meterSubCategory | MeterSubCategory |
| offerId | OfferId |
| partNumber | PartNumber |
| **PayGPrice** | PayGPrice |
| **PlanName** | PlanName |
| **PricingModel** | PricingModel |
| product | ProductName |
| **ProductOrderId** | ProductOrderId |
| **ProductOrderName** | ProductOrderName |
| **PublisherName** | PublisherName |
| **PublisherType** | PublisherType |
| quantity | Quantity |
| **ReservationId** | ReservationId |
| **ReservationName** | ReservationName |
| resourceGroup | ResourceGroup |
| resourceId | ResourceId |
| resourceLocation | ResourceLocation |
| resourceName | ResourceName |
| serviceFamily | ServiceFamily |
| **ServiceInfo1** | ServiceInfo1 |
| **ServiceInfo2** | ServiceInfo2 |
| subscriptionId | SubscriptionId |
| subscriptionName | SubscriptionName |
| **Tags** | Tags |
| **Term** | Term |
| unitOfMeasure | UnitOfMeasure |
| unitPrice | UnitPrice |
| **CostAllocationRuleName** | CostAllocationRuleName |

## Microsoft Customer Agreement field mapping

Microsoft Customer Agreement customers that use the Consumption Usage Details API have usage details records of the kind `modern`. All Microsoft Customer Agreement customers have records of this kind due to the underlying billing system that is used for them. Here's an example MCA usage details record:

```json
{  

  "value": [  

      {  

          "id": "{id}", 

          "name": "{name}",  

          "type": "Microsoft.Consumption/usageDetails",  

          "kind": "modern",  

          "tags": {  

               "env": "newcrp",  

               "dev": "tools"  

          },  

          "properties": {  

…... 

      } 

} 
```

A full example legacy Usage Details record is shown at [Usage Details - List - REST API (Azure Consumption)](/rest/api/consumption/usage-details/list#billingaccountusagedetailslist-modern)

A mapping between the old and new fields are shown in the following table. New properties are available in the CSV files produced by Exports and the Cost Details API. Fields that need a mapping due to differences across the solutions are shown in **bold text**.

For more information, see [Understand usage details fields](understand-usage-details-fields.md).

| **Old property** | **New property** |
| --- | --- |
| invoiceId | invoiceId |
| previousInvoiceId | previousInvoiceId |
| billingAccountId | billingAccountId |
| billingAccountName | billingAccountName |
| billingProfileId | billingProfileId |
| billingProfileName | billingProfileName |
| invoiceSectionId | invoiceSectionId |
| invoiceSectionName | invoiceSectionName |
| partnerTenantId | partnerTenantId |
| partnerName | partnerName |
| resellerName | resellerName |
| resellerMpnId | resellerMpnId |
| customerTenantId | customerTenantId |
| customerName | customerName |
| costCenter | costCenter |
| billingPeriodEndDate | billingPeriodEndDate |
| billingPeriodStartDate | billingPeriodStartDate |
| servicePeriodEndDate | servicePeriodEndDate |
| servicePeriodStartDate | servicePeriodStartDate |
| date | date |
| serviceFamily | serviceFamily |
| productOrderId | productOrderId |
| productOrderName | productOrderName |
| consumedService | consumedService |
| meterId | meterId |
| meterName| meterName |
| meterCategory | meterCategory |
| meterSubCategory | meterSubCategory |
| meterRegion | meterRegion |
| **productIdentifier** | **ProductId** |
| **product** | **ProductName** |
| **subscriptionGuid** | **SubscriptionId** |
| subscriptionName | subscriptionName |
| publisherType | publisherType |
| publisherId | publisherId |
| publisherName | publisherName |
| **resourceGroup** | **resourceGroupName** |
| instanceName | ResourceId |
| **resourceLocationNormalized** | **location** |
| **resourceLocation** | **location** |
| effectivePrice | effectivePrice |
| quantity | quantity |
| unitOfMeasure | unitOfMeasure |
| chargeType | chargeType |
| **billingCurrencyCode** | **billingCurrency** |
| **pricingCurrencyCode** | **pricingCurrency** |
| costInBillingCurrency | costInBillingCurrency |
| costInPricingCurrency | costInPricingCurrency |
| costInUsd | costInUsd |
| paygCostInBillingCurrency | paygCostInBillingCurrency |
| paygCostInUSD | paygCostInUsd |
| exchangeRatePricingToBilling | exchangeRatePricingToBilling |
| exchangeRateDate | exchangeRateDate |
| isAzureCreditEligible | isAzureCreditEligible |
| serviceInfo1 | serviceInfo1 |
| serviceInfo2 | serviceInfo2 |
| additionalInfo | additionalInfo |
| tags | tags |
| partnerEarnedCreditRate | partnerEarnedCreditRate |
| partnerEarnedCreditApplied | partnerEarnedCreditApplied |
| **marketPrice** | **PayGPrice** |
| frequency | frequency |
| term | term |
| reservationId | reservationId |
| reservationName | reservationName |
| pricingModel | pricingModel |
| unitPrice | unitPrice |
| exchangeRatePricingToBilling | exchangeRatePricingToBilling |

## Related content

- Learn more about Cost Management + Billing automation at [Cost Management automation overview](automation-overview.md).
