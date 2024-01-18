---
title: Enterprise Agreement cost details file schema - version 2020-01-01
description: Learn about the data fields available in the Enterprise Agreement cost details file for version 2020-01-01.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Enterprise Agreement cost details file schema - version 2020-01-01

> [!NOTE]
> This article applies to the Enterprise Agreement cost details file schema - version 2020-01-01. For other versions, see the [dataset schema index](schema-index.md).

This article lists the cost details (formerly known as usage details) fields found in cost details files by using [Azure portal download](../understand/download-azure-daily-usage.md), [Exports](../costs/tutorial-export-acm-data.md) from Cost Management, or the [Cost Details API](/rest/api/cost-management/generate-cost-details-report). The cost details file is a CSV file that contains all of the cost details for the Azure services that were used. For more information about cost details best practices, see [Choose a cost details solution](../automate/usage-details-best-practices.md).

## Cost details data file fields

|Fields|Description|
|------|------|
|InvoiceSectionName|MISSING.|
|AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
|AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
|SubscriptionId|MISSING.|
|SubscriptionName|Name of the Azure subscription.|
|ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
|ResourceLocation|Datacenter location where the resource is running. See `Location`.|
|Date|The usage or purchase date of the charge.|
|ProductName|MISSING.|
|MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|MeterSubCategory|Name of the meter subclassification category.|
|MeterId|The unique identifier for the meter.|
|MeterName|The name of the meter.|
|MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
|UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
|Quantity|The number of units purchased or consumed.|
|EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
|CostInBillingCurrency|MISSING.|
|CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
|ConsumedService|Name of the service the charge is associated with.|
|ResourceId|Unique identifier of the Azure Resource Manager resource.|
|Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
|OfferId|Name of the offer purchased.|
|AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|ServiceInfo1|Service-specific metadata.|
|ServiceInfo2|Legacy field with optional service-specific metadata.|
|ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
|ReservationId|Unique identifier for the purchased reservation instance.|
|ReservationName|Name of the purchased reservation instance.|
|UnitPrice|The price per unit for the charge.|
|ProductOrderId|Unique identifier for the product order.|
|ProductOrderName|Unique name for the product order.|
|Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
|PublisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
|PublisherName|Publisher for Marketplace services.|
|ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
|Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
|PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
|AvailabilityZone|MISSING.|
|BillingAccountId|Unique identifier for the root billing account.|
|BillingAccountName|Name of the billing account.|
|BillingCurrencyCode|MISSING.|
|BillingPeriodStartDate|The start date of the billing period.|
|BillingPeriodEndDate|The end date of the billing period.|
|BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
|InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
|IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
|PartNumber|Identifier used to get specific meter pricing.|
|PayGPrice|Retail price for the resource.|
|PlanName|Marketplace plan name.|
|ServiceFamily|Service family that the service belongs to.|
