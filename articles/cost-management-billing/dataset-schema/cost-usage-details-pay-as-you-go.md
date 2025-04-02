---
title: Pay-as-you-go cost and usage details file schema
description: Learn about the data fields available in the pay-as-you-go cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/24/2025
ms.author: banders
---

# Pay-as-you-go cost and usage details file schema

This article applies to the pay-as-you-go cost and usage details (usage only) file schema. Pay-as-you-go is also called Microsoft Online Services Program (MOSP) and Microsoft Online Subscription Agreement (MOSA).

The schema outlined here is applicable only to the 'Cost and Usage Details (Usage Only)' dataset and does not cover purchase information.

## Version 2019-11-01

| Column |Fields|Description|
|---|------|------|
| 1 |SubscriptionGuid|Unique identifier for the Azure subscription.|
| 2 |ResourceGroup|Name of the [resource group](../../azure-resource-manager/management/overview.md) the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 3 |ResourceLocation|The Azure region where the resource is deployed, also referred to as the datacenter location where the resource is running. For an example using Virtual Machines, see [What's the difference between MeterRegion and ResourceLocation](/azure/virtual-machines/vm-usage#what-is-the-difference-between-meter-region-and-resource-location).|
| 4 |UsageDateTime| The usage date of the charge in yyyy-mm-dd format. |
| 5 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 6 |MeterSubCategory|Name of the meter subclassification category. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 7 |MeterId|The unique identifier for the meter.|
| 8 |MeterName|The name of the meter. Purchases and Marketplace usage might be shown as blank or unassigned.|
| 9 |MeterRegion|The name of the Azure region associated with the meter. It generally aligns with the resource location, except for certain global meters that are shared across regions. In such cases, the meter region indicates the primary region of the meter. The meter is used to track the usage of specific services or resources, mainly for billing purposes. Each Azure service, resource, and region have its own billing meter ID that precisely reflects how its consumption and price are calculated.|
| 10 |UsageQuantity| The number of units used by the given product or service for a given day. |
| 11 |ResourceRate| The price for a given product or service that represents the actual rate that you end up paying per unit. |
| 12 |PreTaxCost| Cost of the charge before credits or taxes. You can compute `PreTaxCost` by multiplying `ResourceRate` with `UsageQuantity`. |
| 13 |ConsumedService|Name of the service the charge is associated with.|
| 14 |ResourceType|Type of resource instance. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 15 |InstanceId|Unique identifier of the [Azure Resource Manager](/rest/api/resources/resources) resource.|
| 16 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md). |
| 17 |OfferId|Name of the Azure offer, which is the type of Azure subscription that you have. For more information, see supported [Microsoft Azure offer details](https://azure.microsoft.com/support/legal/offer-details/).|
| 18 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 19 |ServiceInfo1|Service-specific metadata.|
| 20 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 21 |ServiceName| The service family that the service belongs to. |
| 22 |ServiceTier| Name of the service subclassification category. |
| 23 |Currency|See `BillingCurrency`.|
| 24 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
