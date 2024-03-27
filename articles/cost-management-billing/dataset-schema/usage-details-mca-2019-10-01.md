---
title: Microsoft Customer Agreement cost details file schema - version 2019-10-01
description: Learn about the data fields available in the Microsoft Customer Agreement cost details file for version 2019-10-01.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 03/26/2024
ms.author: banders
---

# Microsoft Customer Agreement cost details file schema - version 2019-10-01

> [!NOTE]
> This article applies to the Microsoft Customer Agreement cost details file schema - version 2019-10-01. For other versions, see the [dataset schema index](schema-index.md).

This article lists the cost details (formerly known as usage details) fields found in cost details files. The cost details file is a data file that contains all of the cost details for the Azure services that were used.

## Cost details data file fields

Version: 2019-10-01

|Column|Fields|Description|
|---|------|------|
| 1 |InvoiceID|The unique document ID listed on the invoice PDF.|
| 2 |PreviousInvoiceId|Reference to an original invoice if the line item is a refund.|
| 3 |BillingAccountId|Unique identifier for the root billing account.|
| 4 |BillingAccountName|Name of the billing account.|
| 5 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 6 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 7 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 8 |InvoiceSectionName|Name of the EA department or MCA invoice section.|
| 9 |ResellerName|The name of the reseller associated with the subscription.|
| 10 |ResellerMPNId|ID for the reseller associated with the subscription.|
| 11 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 12 |BillingPeriodEndDate|The end date of the billing period.|
| 13 |BillingPeriodStartDate|The start date of the billing period.|
| 14 |ServicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 15 |ServicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
| 16 |Date|The usage or purchase date of the charge.|
| 17 |ServiceFamily|Service family that the service belongs to.|
| 18 |ProductOrderId|Unique identifier for the product order.|
| 19 |ProductOrderName|Unique name for the product order.|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |MeterId|The unique identifier for the meter.|
| 22 |MeterName|The name of the meter.|
| 23 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 24 |MeterSubcategory|Name of the meter subclassification category.|
| 25 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 26 |ProductId|Unique identifier for the product.|
| 27 |Product|Name of the product.|
| 28 |SubscriptionGuid|Unique identifier for the Azure subscription.|
| 29 |SubscriptionName|Name of the Azure subscription.|
| 30 |PublisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 31 |PublisherId|The ID of the publisher. It's only available after the invoice is generated.|
| 32 |PublisherName|Publisher for Marketplace services.|
| 33 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 34 |InstanceName|Unique identifier of the Azure Resource Manager resource.|
| 35 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 36 |Location|Normalized location of the resource, if different resource locations are configured for the same regions.|
| 37 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 38 |Quantity|The number of units purchased or consumed.|
| 39 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 40 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 41 |BillingCurrencyCode|Currency associated with the billing account.|
| 42 |PricingCurrencyCode|Currency used when rating based on negotiated prices.|
| 43 |CostInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 44 |CostInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
| 45 |CostInUSD|MISSING.|
| 46 |PaygCostInBillingCurrency|MISSING.|
| 47 |PaygCostInUSD|MISSING.|
| 48 |ExchangeRate|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
| 49 |ExchangeRateDate|Date the exchange rate was established.|
| 50 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 51 |ServiceInfo1|Service-specific metadata.|
| 52 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 53 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 54 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 55 |MarketPrice|Retail price for the resource.|
| 56 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 57 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 58 |ReservationId|Unique identifier for the purchased reservation instance.|
| 59 |ReservationName|Name of the purchased reservation instance.|
| 60 |UnitPrice|The price per unit for the charge.|
