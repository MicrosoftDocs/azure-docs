---
title: Microsoft Customer Agreement cost details file schema - version 2019-10-01
description: Learn about the data fields available in the Microsoft Customer Agreement cost details file for version 2019-10-01.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Microsoft Customer Agreement cost details file schema - version 2019-10-01

> [!NOTE]
> This article applies to the Microsoft Customer Agreement cost details file schema - version 2019-10-01. For other versions, see the [dataset schema index](schema-index.md).

This article lists the cost details (formerly known as usage details) fields found in cost details files by using [Azure portal download](../understand/download-azure-daily-usage.md), [Exports](../costs/tutorial-export-acm-data.md) from Cost Management, or the [Cost Details API](/rest/api/cost-management/generate-cost-details-report). The cost details file is a CSV file that contains all of the cost details for the Azure services that were used. For more information about cost details best practices, see [Choose a cost details solution](../automate/usage-details-best-practices.md).

## Cost details data file fields

|Fields|Description|
|------|------|
|InvoiceID|The unique document ID listed on the invoice PDF.|
|PreviousInvoiceId|Reference to an original invoice if the line item is a refund.|
|BillingAccountId|Unique identifier for the root billing account.|
|BillingAccountName|Name of the billing account.|
|BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
|InvoiceSectionName|Name of the EA department or MCA invoice section.|
|ResellerName|The name of the reseller associated with the subscription.|
|ResellerMPNId|ID for the reseller associated with the subscription.|
|CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|BillingPeriodEndDate|The end date of the billing period.|
|BillingPeriodStartDate|The start date of the billing period.|
|ServicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|ServicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|Date|The usage or purchase date of the charge.|
|ServiceFamily|Service family that the service belongs to.|
|ProductOrderId|Unique identifier for the product order.|
|ProductOrderName|Unique name for the product order.|
|ConsumedService|Name of the service the charge is associated with.|
|MeterId|The unique identifier for the meter.|
|MeterName|The name of the meter.|
|MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|MeterSubcategory|Name of the meter subclassification category.|
|MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
|ProductId|Unique identifier for the product.|
|Product|Name of the product.|
|SubscriptionGuid|Unique identifier for the Azure subscription.|
|SubscriptionName|Name of the Azure subscription.|
|PublisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
|PublisherId|The ID of the publisher. It's only available after the invoice is generated.|
|PublisherName|Publisher for Marketplace services.|
|ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
|InstanceName|Unique identifier of the Azure Resource Manager resource.|
|ResourceLocation|Datacenter location where the resource is running. See `Location`.|
|Location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|Quantity|The number of units purchased or consumed.|
|UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|BillingCurrencyCode|Currency associated with the billing account.|
|PricingCurrencyCode|Currency used when rating based on negotiated prices.|
|CostInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|CostInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|CostInUSD|MISSING.|
|PaygCostInBillingCurrency|MISSING.|
|PaygCostInUSD|MISSING.|
|ExchangeRate|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|ExchangeRateDate|Date the exchange rate was established.|
|IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|ServiceInfo1|Service-specific metadata.|
|ServiceInfo2|Legacy field with optional service-specific metadata.|
|AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|MarketPrice|Retail price for the resource.|
|Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|ReservationId|Unique identifier for the purchased reservation instance.|
|ReservationName|Name of the purchased reservation instance.|
|UnitPrice|The price per unit for the charge.|
