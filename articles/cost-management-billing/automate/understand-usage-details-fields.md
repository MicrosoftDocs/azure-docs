---
title: Understand usage details fields
titleSuffix: Microsoft Cost Management
description: This article describes the fields in the usage data files.
author: bandersmsft
ms.author: banders
ms.date: 07/19/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: cost-management
ms.reviewer: adwise
---

# Understand cost details fields

This document describes the cost details (formerly known as usage details) fields found in files from using [Azure portal download](../understand/download-azure-daily-usage.md), [Exports](../costs/tutorial-export-acm-data.md) from Cost Management, or the [Cost Details](/rest/api/cost-management/generate-cost-details-report) API. For more information about cost details best practices, see [Choose a cost details solution](usage-details-best-practices.md).

## Migration to new cost details formats

If you're using an older cost details solution and want to migrate to Exports or the Cost Details API, read the following articles.

- [Migrate from Enterprise Usage Details APIs](migrate-ea-usage-details-api.md)
- [Migrate from EA to MCA APIs](../costs/migrate-cost-management-api.md)
- [Migrate from Consumption Usage Details API](migrate-consumption-usage-details-api.md)

## List of fields and descriptions

The following table describes the important terms used in the latest version of the cost details file. The list covers pay-as-you-go (also called Microsoft Online Services Program), Enterprise Agreement (EA), Microsoft Customer Agreement (MCA), and Microsoft Partner Agreement (MPA) accounts. 

MPA accounts have all MCA terms, in addition to the MPA terms, as described in the following table. To identify what account type you are, see [supported Microsoft Azure offers](../costs/understand-cost-mgt-data.md#supported-microsoft-azure-offers).

| Term | Account type | Description |
| --- | --- | --- |
| AccountName | EA, pay-as-you-go | Display name of the EA enrollment account or pay-as-you-go billing account. |
| AccountOwnerId¹ | EA, pay-as-you-go | Unique identifier for the EA enrollment account or pay-as-you-go billing account. |
| AdditionalInfo¹  | All | Service-specific metadata. For example, an image type for a virtual machine. |
| BenefitId¹ | EA, MCA | Unique identifier for the purchased savings plan instance. |
| BenefitName | EA, MCA | Unique identifier for the purchased savings plan instance. |
| BillingAccountId¹ | All | Unique identifier for the root billing account. |
| BillingAccountName | All | Name of the billing account. |
| BillingCurrency | All | Currency associated with the billing account. |
| BillingCurrencyCode | All | See BillingCurrency. |
| BillingPeriod | EA, pay-as-you-go | The billing period of the charge. |
| BillingPeriodEndDate | All | The end date of the billing period. |
| BillingPeriodStartDate | All | The start date of the billing period. |
| BillingProfileId¹ | All | Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account. |
| BillingProfileName | All | Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account. |
| ChargeType | All | Indicates whether the charge represents usage (**Usage**), a purchase (**Purchase**), or a refund (**Refund**). |
| ConsumedService | All | Name of the service the charge is associated with. |
| CostCenter¹ | EA, MCA | The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts). |
| Cost | EA, pay-as-you-go | See CostInBillingCurrency. |
| CostAllocationRuleName | EA, MCA | Name of the Cost Allocation rule that's applicable to the record. |
| CostInBillingCurrency | EA, MCA | Cost of the charge in the billing currency before credits or taxes. |
| CostInPricingCurrency | MCA | Cost of the charge in the pricing currency before credits or taxes. |
| Currency | EA, pay-as-you-go | See `BillingCurrency`. |
| CustomerName | MPA | Name of the Azure Active Directory tenant for the customer's subscription. |
| CustomerTenantId | MPA | Identifier of the Azure Active Directory tenant of the customer's subscription. |
| Date¹ | All | The usage or purchase date of the charge. |
| EffectivePrice | All | Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time. |
| ExchangeRateDate | MCA | Date the exchange rate was established. |
| ExchangeRatePricingToBilling | MCA | Exchange rate used to convert the cost in the pricing currency to the billing currency. |
| Frequency | All | Indicates whether a charge is expected to repeat. Charges can either happen once (**OneTime**), repeat on a monthly or yearly basis (**Recurring**), or be based on usage (**UsageBased**). |
| InvoiceId | pay-as-you-go, MCA | The unique document ID listed on the invoice PDF. |
| InvoiceSection | MCA | See `InvoiceSectionName`. |
| InvoiceSectionId¹ | EA, MCA | Unique identifier for the EA department or MCA invoice section. |
| InvoiceSectionName | EA, MCA | Name of the EA department or MCA invoice section. |
| IsAzureCreditEligible | All | Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`). |
| Location | MCA | Normalized location of the resource, if different resource locations are configured for the same regions. Purchases and Marketplace usage may be shown as blank or `unassigned`. |
| MeterCategory | All | Name of the classification category for the meter. For example, _Cloud services_ and _Networking_. |
| MeterId¹ | All | The unique identifier for the meter. |
| MeterName | All | The name of the meter. Purchases and Marketplace usage may be shown as blank or `unassigned`.|
| MeterRegion | All | Name of the datacenter location for services priced based on location. See Location. |
| MeterSubCategory | All | Name of the meter subclassification category. Purchases and Marketplace usage may be shown as blank or `unassigned`.|
| OfferId¹ | All | Name of the offer purchased. |
| pay-as-you-goPrice | All | Retail price for the resource. |
| PartnerEarnedCreditApplied | MPA | Indicates whether the partner earned credit has been applied. |
| PartnerEarnedCreditRate | MPA | Rate of discount applied if there's a partner earned credit (PEC), based on partner admin link access. |
| PartnerName | MPA | Name of the partner Azure Active Directory tenant. |
| PartnerTenantId | MPA | Identifier for the partner's Azure Active Directory tenant. |
| PartNumber¹ | EA, pay-as-you-go | Identifier used to get specific meter pricing. |
| PlanName | EA, pay-as-you-go | Marketplace plan name. |
| PreviousInvoiceId | MCA | Reference to an original invoice if the line item is a refund. |
| PricingCurrency | MCA | Currency used when rating based on negotiated prices. |
| PricingModel | All | Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`) |
| Product | All | Name of the product. |
| ProductId¹ | MCA | Unique identifier for the product. |
| ProductOrderId | All | Unique identifier for the product order. |
| ProductOrderName | All | Unique name for the product order. |
| Provider | All | Identifier for product category or Line of Business. For example, Azure, Microsoft 365, and AWS. |
| PublisherId | MCA | The ID of the publisher. It's only available after the invoice is generated. |
| PublisherName | All | Publisher for Marketplace services. |
| PublisherType | All | Supported values: **Microsoft**, **Azure**, **AWS**, **Marketplace**. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts. |
| Quantity | All | The number of units purchased or consumed. |
| ResellerName | MPA | The name of the reseller associated with the subscription. |
| ResellerMpnId | MPA | ID for the reseller associated with the subscription. |
| ReservationId¹ | EA, MCA | Unique identifier for the purchased reservation instance. |
| ReservationName | EA, MCA | Name of the purchased reservation instance. |
| ResourceGroup | All | Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group will be shown as null or empty, **Others**, or **Not applicable**. |
| ResourceId¹ | All | Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource. |
| ResourceLocation¹  | All | Datacenter location where the resource is running. See `Location`. |
| ResourceName | EA, pay-as-you-go | Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type will be shown as null/empty, **Others** , or **Not applicable**. |
| ResourceType | MCA | Type of resource instance. Not all charges come from deployed resources. Charges that don't have a resource type will be shown as null/empty, **Others** , or **Not applicable**. |
| RoundingAdjustment | EA, MCA | Rounding adjustment represents the quantization that occurs during cost calculation. When the calculated costs are converted to the invoiced total, small rounding errors can occur. The rounding errors are represented as `rounding adjustment` to ensure that the costs shown in Cost Management align to the invoice.   |
| ServiceFamily | MCA | Service family that the service belongs to. |
| ServiceInfo¹ | All | Service-specific metadata. |
| ServiceInfo2 | All | Legacy field with optional service-specific metadata. |
| ServicePeriodEndDate | MCA | The end date of the rating period that defined and locked pricing for the consumed or purchased service. |
| ServicePeriodStartDate | MCA | The start date of the rating period that defined and locked pricing for the consumed or purchased service. |
| SubscriptionId¹ | All | Unique identifier for the Azure subscription. |
| SubscriptionName | All | Name of the Azure subscription. |
| Tags¹ | All | Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](https://azure.microsoft.com/updates/organize-your-azure-resources-with-tags/). |
| Term | All | Displays the term for the validity of the offer. For example: In case of reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption. |
| UnitOfMeasure | All | The unit of measure for billing for the service. For example, compute services are billed per hour. |
| UnitPrice | EA, pay-as-you-go | The price per unit for the charge. |


¹ Fields used to build a unique ID for a single cost record. Every record in your cost details file should be considered unique. 

The cost details file itself doesn’t uniquely identify individual records with an ID. Instead, you can use fields in the file flagged with ¹ to create a unique ID yourself. 

Some fields might differ in casing and spacing between account types. Older versions of pay-as-you-go cost details files have separate sections for the statement and daily cost.

### List of terms from older APIs

The following table maps terms used in older APIs to the new terms. Refer to the above table for those descriptions.

Old term | New term
--- | ---
ConsumedQuantity | Quantity
IncludedQuantity | N/A
InstanceId | ResourceId
Rate | EffectivePrice
Unit | UnitOfMeasure
UsageDate | Date
UsageEnd | Date
UsageStart | Date

## Next steps

- Get an overview of how to [ingest cost data](automation-ingest-usage-details-overview.md).
- Learn more about [Choose a cost details solution](usage-details-best-practices.md).
- [Create and manage exported data](../costs/tutorial-export-acm-data.md) in the Azure portal with Exports.
- [Automate Export creation](../costs/ingest-azure-usage-at-scale.md) and ingestion at scale using the API.
- Learn how to [Get small cost datasets on demand](get-small-usage-datasets-on-demand.md).
