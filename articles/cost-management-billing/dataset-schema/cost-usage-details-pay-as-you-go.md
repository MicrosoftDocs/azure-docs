---
title: Pay-as-you-go cost and usage details file schema
description: Learn about the data fields available in the pay-as-you-go cost and usage details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 05/02/2024
ms.author: banders
---

# Pay-as-you-go cost and usage details file schema

This article applies to the pay-as-you-go cost and usage details file schema. Pay-as-you-go is also called Microsoft Online Services Program (MOSP) and Microsoft Online Subscription Agreement (MOSA).

The following information lists the cost and usage details (formerly known as usage details) fields found in the pay-as-you-go cost and usage details file. The file contains contains all of the cost details and usage data for the Azure services that were used.

## Version 2019-11-01

| Column |Fields|Description|
|---|------|------|
| 1 |SubscriptionGuid|Unique identifier for the Azure subscription.|
| 2 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 3 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 4 |UsageDateTime|  |
| 5 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 6 |MeterSubCategory|Name of the meter subclassification category.|
| 7 |MeterId|The unique identifier for the meter.|
| 8 |MeterName|The name of the meter.|
| 9 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 10 |UsageQuantity| |
| 11 |ResourceRate|  |
| 12 |PreTaxCost|  |
| 13 |ConsumedService|Name of the service the charge is associated with.|
| 14 |ResourceType|Type of resource instance. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`.|
| 15 |InstanceId|Unique identifier of the Azure Resource Manager resource.|
| 16 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md). |
| 17 |OfferId|Name of the offer purchased.|
| 18 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 19 |ServiceInfo1|Service-specific metadata.|
| 20 |ServiceInfo2|Legacy field with optional service-specific metadata.|
| 21 |ServiceName|  |
| 22 |ServiceTier|  |
| 23 |Currency|See `BillingCurrency`.|
| 24 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
