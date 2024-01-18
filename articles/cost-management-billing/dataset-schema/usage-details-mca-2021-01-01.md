---
title: Microsoft Customer Agreement cost details file schema - version 2021-01-01
description: Learn about the data fields available in the Microsoft Customer Agreement cost details file for version 2021-01-01.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Microsoft Customer Agreement cost details file schema - version 2021-01-01

> [!NOTE]
> This article applies to the Microsoft Customer Agreement cost details file schema - version 2021-01-01. For other versions, see the [dataset schema index](schema-index.md).

This article lists the cost details (formerly known as usage details) fields found in cost details files by using [Azure portal download](../understand/download-azure-daily-usage.md), [Exports](../costs/tutorial-export-acm-data.md) from Cost Management, or the [Cost Details API](/rest/api/cost-management/generate-cost-details-report). The cost details file is a CSV file that contains all of the cost details for the Azure services that were used. For more information about cost details best practices, see [Choose a cost details solution](../automate/usage-details-best-practices.md).

## Cost details data file fields

|Fields|Description|
|------|------|
|invoiceId|The unique document ID listed on the invoice PDF.|
|previousInvoiceId|Reference to an original invoice if the line item is a refund.|
|billingAccountId|Unique identifier for the root billing account.|
|billingAccountName|Name of the billing account.|
|billingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|billingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|invoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
|invoiceSectionName|Name of the EA department or MCA invoice section.|
|resellerName|The name of the reseller associated with the subscription.|
|resellerMpnId|ID for the reseller associated with the subscription.|
|costCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|billingPeriodEndDate|The end date of the billing period.|
|billingPeriodStartDate|The start date of the billing period.|
|servicePeriodEndDate|The end date of the rating period that defined and locked pricing for the consumed or purchased service.|
|servicePeriodStartDate|The start date of the rating period that defined and locked pricing for the consumed or purchased service.|
|date|The usage or purchase date of the charge.|
|serviceFamily|Service family that the service belongs to.|
|productOrderId|Unique identifier for the product order.|
|productOrderName|Unique name for the product order.|
|consumedService|Name of the service the charge is associated with.|
|meterId|The unique identifier for the meter.|
|meterName|The name of the meter.|
|meterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|meterSubCategory|Name of the meter subclassification category.|
|meterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
|ProductId|Unique identifier for the product.|
|ProductName|Name of the product.|
|SubscriptionId|Unique identifier for the Azure subscription.|
|subscriptionName|Name of the Azure subscription.|
|publisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
|publisherId|The ID of the publisher. It's only available after the invoice is generated.|
|publisherName|Publisher for Marketplace services.|
|resourceGroupName|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
|ResourceId|Unique identifier of the Azure Resource Manager resource.|
|resourceLocation|Datacenter location where the resource is running. See `Location`.|
|location|Normalized location of the resource, if different resource locations are configured for the same regions.|
|effectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|quantity|The number of units purchased or consumed.|
|unitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|chargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|billingCurrency|Currency associated with the billing account.|
|pricingCurrency|Currency used when rating based on negotiated prices.|
|costInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
|costInPricingCurrency|Cost of the charge in the pricing currency before credits or taxes.|
|costInUsd|MISSING.|
|paygCostInBillingCurrency|MISSING.|
|paygCostInUsd|MISSING.|
|exchangeRatePricingToBilling|Exchange rate used to convert the cost in the pricing currency to the billing currency.|
|exchangeRateDate|Date the exchange rate was established.|
|isAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|serviceInfo1|Service-specific metadata.|
|serviceInfo2|Legacy field with optional service-specific metadata.|
|additionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|PayGPrice|Retail price for the resource.|
|frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|reservationId|Unique identifier for the purchased reservation instance.|
|reservationName|Name of the purchased reservation instance.|
|pricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
|unitPrice|The price per unit for the charge.|
|costAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|
