---
title: Enterprise Agreement cost details file schema - version 2019-10-01
description: Learn about the data fields available in the Enterprise Agreement cost details file for version 2019-10-01.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 03/26/2024
ms.author: banders
---

# Enterprise Agreement cost details file schema - version 2019-10-01

> [!NOTE]
> This article applies to the Enterprise Agreement cost details file schema - version 2019-10-01. For other versions, see the [dataset schema index](schema-index.md).

This article lists the cost details (formerly known as usage details) fields found in cost details files. The cost details file is a data file that contains all of the cost details for the Azure services that were used.

## Cost details data file fields

Version: 2019-10-01

| Column |Fields|Description|
|---|------|------|
| 1 |DepartmentName|Name of the EA department or MCA invoice section.|
| 2 |AccountName|Display name of the EA enrollment account or pay-as-you-go billing account.|
| 3 |AccountOwnerId|Unique identifier for the EA enrollment account or pay-as-you-go billing account.|
| 4 |SubscriptionGuid|Unique identifier for the Azure subscription.|
| 5 |SubscriptionName|Name of the Azure subscription.|
| 6 |ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
| 7 |ResourceLocation|Datacenter location where the resource is running. See `Location`.|
| 8 |UsageDateTime|MISSING.|
| 9 |ProductName|Name of the product.|
| 10 |MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
| 11 |MeterSubcategory|Name of the meter subclassification category.|
| 12 |MeterId|The unique identifier for the meter.|
| 13 |MeterName|The name of the meter.|
| 14 |MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
| 15 |UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
| 16 |UsageQuantity|The number of units purchased or consumed.|
| 17 |ResourceRate|Blended unit price for the period. Blended prices average out any fluctuations in the unit price, like graduated tiering, which lowers the price as quantity increases over time.|
| 18 |PreTaxCost|MISSING.|
| 19 |CostCenter|The cost center defined for the subscription for tracking costs (only available in open billing periods for MCA accounts).|
| 20 |ConsumedService|Name of the service the charge is associated with.|
| 21 |ResourceType|MISSING.|
| 22 |InstanceId|MISSING.|
| 23 |Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md).|
| 24 |OfferId|Name of the offer purchased.|
| 25 |AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
| 26 |ServiceInfo1|Service-specific metadata.|
| 27 |ServiceInfo2|Legacy field with optional service-specific metadata.|
