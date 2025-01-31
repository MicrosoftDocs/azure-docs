---
title: Enterprise Agreement cost and usage details file schema
description: Learn about the data fields available in the Enterprise Agreement cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/24/2025
ms.author: banders
---

# Enterprise Agreement cost and usage details file schema

This article applies to the Enterprise Agreement (EA) cost and usage details file schema. For other schema file versions, see the [dataset schema index](schema-index.md).

The following information lists the cost and usage details (formerly known as usage details) fields found in Enterprise Agreement cost and usage details files. The file contains all of the cost details and usage data for the Azure services that were used.

## Version 2024-08-01

| Column |Fields|Description|
| -------- | -------- | -------- |
| 1 |InvoiceSectionName|Name of the EA department or MCA invoice section.|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|The email ID of the EA enrollment account owner.|
| 4 |SubscriptionId|Unique identifier for the Azure subscription.|
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
| 8 |Date|The usage or purchase date of the charge.|
| 9 |ProductName|Name of the product.|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 11 |MeterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 14 |MeterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |Quantity|The number of units used by the given product or service for a given day.|
| 17 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |CostInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
| 22 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 23 |OfferId|Name of the Azure offer, which is the type of Azure subscription that you have. For more information, see supported [Microsoft Azure offer details](https://azure.microsoft.com/support/legal/offer-details/).|
| 24 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 25 |ServiceInfo1|Service-specific metadata.|
| 26 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 27 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 28 |ReservationId|Unique identifier for the purchased reservation instance.|
| 29 |ReservationName|Name of the purchased reservation instance.|
| 30 |UnitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 31 |ProductOrderId|Unique identifier for the product order.|
| 32 |ProductOrderName|Unique name for the product order.|
| 33 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 34 |PublisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
| 35 |PublisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
| 36 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 37 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 38 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
| 39 |AvailabilityZone| Valid only for cost data obtained from the cross-cloud connector. The field displays the availability zone in which the AWS service is deployed.|
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
| 50 |PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 51 |PlanName|Marketplace plan name.|
| 52 |ServiceFamily|Service family that the service belongs to.|
| 53 |CostAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|
| 54 |benefitId|  Unique identifier for the purchased savings plan instance.|
| 55 |benefitName| Unique identifier for the purchased savings plan instance.|
|56|AccountId|Unique identifier for the EA enrollment account.|
|57|ResourceLocationNormalized|Standardized format of the Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. The normalized location is used to resolve inconsistencies in region names sent by different Azure Resource Providers (RPs).|

## Version 2023-12-01-preview

| Column |Fields|Description|
|---|------|------|
| 1 |InvoiceSectionName|Name of the EA department or MCA invoice section.|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |SubscriptionId|Unique identifier for the Azure subscription.|
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
| 8 |Date|The usage or purchase date of the charge.|
| 9 |ProductName|Name of the product.|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 11 |MeterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 14 |MeterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |Quantity|The number of units used by the given product or service for a given day.|
| 17 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |CostInBillingCurrency|Cost of the charge in the billing currency before credits or taxes.|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
| 22 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 23 |OfferId|Name of the Azure offer, which is the type of Azure subscription that you have. For more information, see supported [Microsoft Azure offer details](https://azure.microsoft.com/support/legal/offer-details/).|
| 24 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 25 |ServiceInfo1|Service-specific metadata.|
| 26 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 27 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 28 |ReservationId|Unique identifier for the purchased reservation instance.|
| 29 |ReservationName|Name of the purchased reservation instance.|
| 30 |UnitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 31 |ProductOrderId|Unique identifier for the product order.|
| 32 |ProductOrderName|Unique name for the product order.|
| 33 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 34 |PublisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
| 35 |PublisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
| 36 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 37 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 38 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
| 39 |AvailabilityZone|  Valid only for cost data obtained from the cross-cloud connector. The field displays the availability zone in which the AWS service is deployed.|
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
| 50 |PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 51 |PlanName|Marketplace plan name.|
| 52 |ServiceFamily|Service family that the service belongs to.|
| 53 |CostAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|
| 54 |benefitId|  Unique identifier for the purchased savings plan instance.|
| 55 |benefitName| Unique identifier for the purchased savings plan instance.|

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
| 11 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 12 |MeterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 13 |MeterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
| 14 |MeterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 15 |Quantity|The number of units used by the given product or service for a given day.|
| 16 |ResourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
| 17 |ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
| 18 |ServiceInfo1|Service-specific metadata.|
| 19 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 20 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 21 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 22 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 23 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 24 |ResourceGroup|Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 25 |PartNumber|Identifier used to get specific meter pricing.|
| 26 |OfferId|Name of the Azure offer, which is the type of Azure subscription that you have. For more information, see supported [Microsoft Azure offer details](https://azure.microsoft.com/support/legal/offer-details/).|
| 27 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 28 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 29 |UnitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 30 |ReservationId|Unique identifier for the purchased reservation instance.|
| 31 |ReservationName|Name of the purchased reservation instance.|
| 32 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 33 |ProductOrderId|Unique identifier for the product order.|
| 34 |ProductOrderName|Unique name for the product order.|
| 35 |PlanName|Marketplace plan name.|
| 36 |PublisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
| 37 |PublisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
| 38 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 39 |BillingAccountId|Unique identifier for the root billing account.|
| 40 |BillingAccountName|Name of the billing account.|
| 41 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 42 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 43 |BillingCurrencyCode|Currency associated with the billing account.|
| 44 |ServiceFamily|Service family that the service belongs to.|
| 45 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 46 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 47 |PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 48 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
| 49 |BillingPeriodStartDate|The start date of the billing period.|
| 50 |BillingPeriodEndDate|The end date of the billing period.|
| 51 |AvailabilityZone|  Valid only for cost data obtained from the cross-cloud connector. The field displays the availability zone in which the AWS service is deployed.|
| 52 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 53 |CostAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|
| 54 |benefitId| Unique identifier for the purchased savings plan instance.|
| 55 |benefitName| Unique identifier for the purchased savings plan instance.|

## Version 2021-01-01

| Column |Fields|Description|
|---|------|------|
| 1 |InvoiceSectionName| Name of the EA department or MCA invoice section.|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |SubscriptionId| Unique identifier for the Azure subscription.|
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
| 8 |Date|The usage or purchase date of the charge.|
| 9 |ProductName| Name of the product.|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 11 |MeterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 14 |MeterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |Quantity|The number of units used by the given product or service for a given day.|
| 17 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |CostInBillingCurrency|  Cost of the charge in the billing currency before credits or taxes.|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
| 22 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 23 |OfferId|Name of the Azure offer, which is the type of Azure subscription that you have. For more information, see supported [Microsoft Azure offer details](https://azure.microsoft.com/support/legal/offer-details/).|
| 24 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 25 |ServiceInfo1|Service-specific metadata.|
| 26 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 27 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 28 |ReservationId|Unique identifier for the purchased reservation instance.|
| 29 |ReservationName|Name of the purchased reservation instance.|
| 30 |UnitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 31 |ProductOrderId|Unique identifier for the product order.|
| 32 |ProductOrderName|Unique name for the product order.|
| 33 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 34 |PublisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
| 35 |PublisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
| 36 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 37 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 38 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
| 39 |AvailabilityZone| Valid only for cost data obtained from the cross-cloud connector. The field displays the availability zone in which the AWS service is deployed.|
| 40 |BillingAccountId|Unique identifier for the root billing account.|
| 41 |BillingAccountName|Name of the billing account.|
| 42 |BillingCurrencyCode| Currency associated with the billing account.|
| 43 |BillingPeriodStartDate|The start date of the billing period.|
| 44 |BillingPeriodEndDate|The end date of the billing period.|
| 45 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 46 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 47 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 48 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 49 |PartNumber|Identifier used to get specific meter pricing.|
| 50 |PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 51 |PlanName|Marketplace plan name.|
| 52 |ServiceFamily|Service family that the service belongs to.|
| 53 |CostAllocationRuleName|Name of the Cost Allocation rule that's applicable to the record.|

## Version 2020-01-01

| Column |Fields|Description|
|---|------|------|
| 1 |InvoiceSectionName| Name of the EA department or MCA invoice section.|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |SubscriptionId| Unique identifier for the Azure subscription. |
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
| 8 |Date|The usage or purchase date of the charge.|
| 9 |ProductName| Name of the product. |
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 11 |MeterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 14 |MeterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |Quantity|The number of units used by the given product or service for a given day.|
| 17 |EffectivePrice|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |CostInBillingCurrency|  Cost of the charge in the billing currency before credits or taxes.|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
| 22 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 23 |OfferId|Name of the Azure offer, which is the type of Azure subscription that you have. For more information, see supported [Microsoft Azure offer details](https://azure.microsoft.com/support/legal/offer-details/).|
| 24 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 25 |ServiceInfo1|Service-specific metadata.|
| 26 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 27 |ResourceName|Name of the resource. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 28 |ReservationId|Unique identifier for the purchased reservation instance.|
| 29 |ReservationName|Name of the purchased reservation instance.|
| 30 |UnitPrice|The price for a given product or service inclusive of any negotiated discount that you might have on top of the market price (PayG price column) for your contract. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
| 31 |ProductOrderId|Unique identifier for the product order.|
| 32 |ProductOrderName|Unique name for the product order.|
| 33 |Term|Displays the term for the validity of the offer. For example: For reserved instances, it displays 12 months as the Term. For one-time purchases or recurring purchases, Term is one month (SaaS, Marketplace Support). Not applicable for Azure consumption.|
| 34 |PublisherType|Supported values: `Microsoft`, `Azure`, `AWS`, `Marketplace`. For MCA accounts, the value can be `Microsoft` for first party charges and `Marketplace` for third party charges. For EA and pay-as-you-go accounts, the value is `Azure`.|
| 35 |PublisherName|The name of the publisher. For first-party services, the value should be listed as Microsoft or Microsoft Corporation.|
| 36 |ChargeType|Indicates whether the charge represents usage (Usage), a purchase (Purchase), or a refund (Refund).|
| 37 |Frequency|Indicates whether a charge is expected to repeat. Charges can either happen once (OneTime), repeat on a monthly or yearly basis (Recurring), or be based on usage (UsageBased).|
| 38 |PricingModel|Identifier that indicates how the meter is priced. (Values: `On Demand`, `Reservation`, `Spot`, and `SavingsPlan`)|
| 39 |AvailabilityZone| Valid only for cost data obtained from the cross-cloud connector. The field displays the availability zone in which the AWS service is deployed.|
| 40 |BillingAccountId|Unique identifier for the root billing account.|
| 41 |BillingAccountName|Name of the billing account.|
| 42 |BillingCurrencyCode| Currency associated with the billing account.|
| 43 |BillingPeriodStartDate|The start date of the billing period.|
| 44 |BillingPeriodEndDate|The end date of the billing period.|
| 45 |BillingProfileId|Unique identifier of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 46 |BillingProfileName|Name of the EA enrollment, pay-as-you-go subscription, MCA billing profile, or AWS consolidated account.|
| 47 |InvoiceSectionId|Unique identifier for the EA department or MCA invoice section.|
| 48 |IsAzureCreditEligible|Indicates if the charge is eligible to be paid for using Azure credits (Values: `True` or `False`).|
| 49 |PartNumber|Identifier used to get specific meter pricing.|
| 50 |PayGPrice|The market price, also referred to as retail or list price, for a given product or service. For more information, see [Pricing behavior in cost details](../automate/automation-ingest-usage-details-overview.md#pricing-behavior-in-cost-and-usage-details).|
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
| 6 |ResourceGroup|Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
| 8 |UsageDateTime| The usage date of the charge in yyyy-mm-dd format.|
| 9 |ProductName|Name of the product.|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 11 |MeterSubcategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 14 |MeterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |UsageQuantity|The number of units used by the given product or service for a given day.|
| 17 |ResourceRate|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |PreTaxCost| Cost of the charge before credits or taxes. You can compute `PreTaxCost` by multiplying `ResourceRate` with `UsageQuantity`.|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceType| Type of resource instance. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 22 |InstanceId| Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
| 23 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 24 |OfferId|Name of the Azure offer, which is the type of Azure subscription that you have. For more information, see supported [Microsoft Azure offer details](https://azure.microsoft.com/support/legal/offer-details/).|
| 25 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 26 |ServiceInfo1|Service-specific metadata.|
| 27 |ServiceInfo2|Legacy field with optional service-specific metadata.|
