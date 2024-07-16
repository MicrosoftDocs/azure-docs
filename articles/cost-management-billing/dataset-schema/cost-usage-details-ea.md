---
title: Enterprise Agreement cost and usage details file schema
description: Learn about the data fields available in the Enterprise Agreement cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Enterprise Agreement cost and usage details file schema

This article applies to the Enterprise Agreement (EA) cost and usage details file schema. For other schema file versions, see the [dataset schema index](schema-index.md).

The following information lists the cost and usage details (formerly known as usage details) fields found in Enterprise Agreement cost and usage details files. The file contains contains all of the cost details and usage data for the Azure services that were used.

## Version 2023-12-01-preview

| Column |Fields|Description|
|---|------|------|
| 1 |InvoiceSectionName|Name of the EA department or MCA invoice section.|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |SubscriptionId|Unique identifier for the Azure subscription.|
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 8 |Date|The usage or purchase date of the charge.|
| 9 |ProductName|Name of the product.|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 11 |MeterSubCategory|Name of the meter subclassification category.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter.|
| 14 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |Quantity|The number of units purchased or consumed.|
| 17 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |CostInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceId|Unique identifier of the Azure Resource Manager resource.|
| 22 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 23 |OfferId|Name of the offer purchased.|
| 24 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 25 |ServiceInfo1|Service-specific metadata.|
| 26 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 27 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 28 |ReservationId|Unique identifier for the purchased reservation instance.|
| 29 |ReservationName|Name of the purchased reservation instance.|
| 30 |UnitPrice|The price per unit for the charge.|
| 31 |ProductOrderId|Unique identifier for the product order.|
| 32 |ProductOrderName|Unique name for the product order.|
| 33 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 34 |PublisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 35 |PublisherName|Publisher for Marketplace services.|
| 36 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 37 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 38 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
| 39 |AvailabilityZone|  .|
| 40 |BillingAccountId|Unique identifier for the root billing account.|
| 41 |BillingAccountName|Name of the billing account.|
| 42 |BillingCurrencyCode|Currency associated with the billing account.|
| 43 |BillingPeriodStartDate|The start date of the billing period.|
| 44 |BillingPeriodEndDate|The end date of the billing period.|
| 45 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 46 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 47 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 48 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 49 |PartNumber|Identifier used to get specific meter pricing.|
| 50 |PayGPrice|Retail price for the resource.|
| 51 |PlanName|Marketplace plan name.|
| 52 |ServiceFamily|Service family that the service belongs to.|
| 53 |CostAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|
| 54 |benefitId|  .|
| 55 |benefitName|  .|

## Version 2021-10-01

| Column |Fields|Description|
|--- |------|------|
| 1 |CostInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |ProductName|Name of the product.|
| 5 |ConsumedService|Name of the service the charge is associated with.|
| 6 |InvoiceSectionName|Name of the EA department or MCA invoice section.|
| 7 |SubscriptionId|Unique identifier for the Azure subscription.|
| 8 |SubscriptionName|Name of the Azure subscription.|
| 9 |Date|The usage or purchase date of the charge.|
| 10 |MeterId|The unique identifier for the meter.|
| 11 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 12 |MeterSubCategory|Name of the meter subclassification category.|
| 13 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 14 |MeterName|The name of the meter.|
| 15 |Quantity|The number of units purchased or consumed.|
| 16 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 17 |ResourceId|Unique identifier of the Azure Resource Manager resource.|
| 18 |ServiceInfo1|Service-specific metadata.|
| 19 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 20 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 21 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 22 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 23 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 24 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 25 |PartNumber|Identifier used to get specific meter pricing.|
| 26 |OfferId|Name of the offer purchased.|
| 27 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 28 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 29 |UnitPrice|The price per unit for the charge.|
| 30 |ReservationId|Unique identifier for the purchased reservation instance.|
| 31 |ReservationName|Name of the purchased reservation instance.|
| 32 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 33 |ProductOrderId|Unique identifier for the product order.|
| 34 |ProductOrderName|Unique name for the product order.|
| 35 |PlanName|Marketplace plan name.|
| 36 |PublisherName|Publisher for Marketplace services.|
| 37 |PublisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 38 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 39 |BillingAccountId|Unique identifier for the root billing account.|
| 40 |BillingAccountName|Name of the billing account.|
| 41 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 42 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 43 |BillingCurrencyCode|Currency associated with the billing account.|
| 44 |ServiceFamily|Service family that the service belongs to.|
| 45 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 46 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 47 |PayGPrice|Retail price for the resource.|
| 48 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
| 49 |BillingPeriodStartDate|The start date of the billing period.|
| 50 |BillingPeriodEndDate|The end date of the billing period.|
| 51 |AvailabilityZone|  .|
| 52 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 53 |CostAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|
| 54 |benefitId|  .|
| 55 |benefitName|  .|

## Version 2021-01-01

| Column |Fields|Description|
|---|------|------|
| 1 |InvoiceSectionName|  .|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |SubscriptionId|  .|
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 8 |Date|The usage or purchase date of the charge.|
| 9 |ProductName|  .|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 11 |MeterSubCategory|Name of the meter subclassification category.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter.|
| 14 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |Quantity|The number of units purchased or consumed.|
| 17 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |CostInBillingCurrency|  .|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceId|Unique identifier of the Azure Resource Manager resource.|
| 22 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 23 |OfferId|Name of the offer purchased.|
| 24 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 25 |ServiceInfo1|Service-specific metadata.|
| 26 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 27 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 28 |ReservationId|Unique identifier for the purchased reservation instance.|
| 29 |ReservationName|Name of the purchased reservation instance.|
| 30 |UnitPrice|The price per unit for the charge.|
| 31 |ProductOrderId|Unique identifier for the product order.|
| 32 |ProductOrderName|Unique name for the product order.|
| 33 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 34 |PublisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 35 |PublisherName|Publisher for Marketplace services.|
| 36 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 37 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 38 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
| 39 |AvailabilityZone|  .|
| 40 |BillingAccountId|Unique identifier for the root billing account.|
| 41 |BillingAccountName|Name of the billing account.|
| 42 |BillingCurrencyCode|  .|
| 43 |BillingPeriodStartDate|The start date of the billing period.|
| 44 |BillingPeriodEndDate|The end date of the billing period.|
| 45 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 46 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 47 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 48 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 49 |PartNumber|Identifier used to get specific meter pricing.|
| 50 |PayGPrice|Retail price for the resource.|
| 51 |PlanName|Marketplace plan name.|
| 52 |ServiceFamily|Service family that the service belongs to.|
| 53 |CostAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|

## Version 2020-01-01

| Column |Fields|Description|
|---|------|------|
| 1 |InvoiceSectionName|  .|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |SubscriptionId|  .|
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 8 |Date|The usage or purchase date of the charge.|
| 9 |ProductName|  .|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 11 |MeterSubCategory|Name of the meter subclassification category.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter.|
| 14 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |Quantity|The number of units purchased or consumed.|
| 17 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |CostInBillingCurrency|  .|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceId|Unique identifier of the Azure Resource Manager resource.|
| 22 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 23 |OfferId|Name of the offer purchased.|
| 24 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 25 |ServiceInfo1|Service-specific metadata.|
| 26 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 27 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 28 |ReservationId|Unique identifier for the purchased reservation instance.|
| 29 |ReservationName|Name of the purchased reservation instance.|
| 30 |UnitPrice|The price per unit for the charge.|
| 31 |ProductOrderId|Unique identifier for the product order.|
| 32 |ProductOrderName|Unique name for the product order.|
| 33 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 34 |PublisherType|Supported values:`Microsoft`, `Azure`, `AWS`, and `Marketplace`. Values are `Microsoft` for MCA accounts and `Azure` for EA and pay-as-you-go accounts.|
| 35 |PublisherName|Publisher for Marketplace services.|
| 36 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 37 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 38 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, and `Spot`)|
| 39 |AvailabilityZone|  .|
| 40 |BillingAccountId|Unique identifier for the root billing account.|
| 41 |BillingAccountName|Name of the billing account.|
| 42 |BillingCurrencyCode|  .|
| 43 |BillingPeriodStartDate|The start date of the billing period.|
| 44 |BillingPeriodEndDate|The end date of the billing period.|
| 45 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 46 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 47 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 48 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 49 |PartNumber|Identifier used to get specific meter pricing.|
| 50 |PayGPrice|Retail price for the resource.|
| 51 |PlanName|Marketplace plan name.|
| 52 |ServiceFamily|Service family that the service belongs to.|

## Version 2019-10-01

| Column |Fields|Description|
|---|------|------|
| 1 |DepartmentName|Name of the EA department or MCA invoice section.|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |SubscriptionGuid|Unique identifier for the Azure subscription.|
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 8 |UsageDateTime|  .|
| 9 |ProductName|Name of the product.|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 11 |MeterSubcategory|Name of the meter subclassification category.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter.|
| 14 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |UsageQuantity|The number of units purchased or consumed.|
| 17 |ResourceRate|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |PreTaxCost|  .|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceType|  .|
| 22 |InstanceId|  .|
| 23 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 24 |OfferId|Name of the offer purchased.|
| 25 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 26 |ServiceInfo1|Service-specific metadata.|
| 27 |ServiceInfo2|Legacy field with optional service-specific metadata.|