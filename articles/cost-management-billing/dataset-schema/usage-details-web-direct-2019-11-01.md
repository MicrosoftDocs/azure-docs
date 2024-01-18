---
title: Web direct cost details file schema
description: Learn about the data fields available in the web direct cost details file.
author: bandersmsft
ms.reviewer: jojo
ms.service: cost-management-billing
ms.subservice: common
ms.topic: reference
ms.date: 01/18/2024
ms.author: banders
---

# Web direct cost details file schema

> [!NOTE]
> This article applies to the web direct cost details file schema. Web direct is also called pay-as-you-go (PAYG), Microsoft Online Services Program (MOSP), and Microsoft Online Subscription Agreement (MOSA). For other versions, see the [dataset schema index](schema-index.md).

This article lists the cost details (formerly known as usage details) fields found in cost details files by using [Azure portal download](../understand/download-azure-daily-usage.md), [Exports](../costs/tutorial-export-acm-data.md) from Cost Management, or the [Cost Details API](/rest/api/cost-management/generate-cost-details-report). The cost details file is a CSV file that contains all of the cost details for the Azure services that were used. For more information about cost details best practices, see [Choose a cost details solution](../automate/usage-details-best-practices.md).

## Cost details data file fields

|Fields|Description|
|------|------|
|SubscriptionGuid|Unique identifier for the Azure subscription.|
|ResourceGroup|Name of the resource group the resource is in. Not all charges come from resources deployed to resource groups. Charges that don't have a resource group are shown as null or empty, `Others`, or `Not applicable`.|
|ResourceLocation|Datacenter location where the resource is running. See `Location`.|
|UsageDateTime|MISSING.|
|MeterCategory|Name of the classification category for the meter. For example, `Cloud services` and `Networking`.|
|MeterSubCategory|Name of the meter subclassification category.|
|MeterId|The unique identifier for the meter.|
|MeterName|The name of the meter.|
|MeterRegion|Name of the datacenter location for services priced based on location. See `Location`.|
|UsageQuantity|MISSING.|
|ResourceRate|MISSING.|
|PreTaxCost|MISSING.|
|ConsumedService|Name of the service the charge is associated with.|
|ResourceType|Type of resource instance. Not all charges come from deployed resources. Charges that don't have a resource type are shown as null or empty, `Others` , or `Not applicable`..|
|InstanceId|Unique identifier of the Azure Resource Manager resource.|
|Tags|Tags assigned to the resource. Doesn't include resource group tags. Can be used to group or distribute costs for internal chargeback. For more information, see [Organize your Azure resources with tags](../../azure-resource-manager/management/tag-resources.md). |
|OfferId|Name of the offer purchased.|
|AdditionalInfo|Service-specific metadata. For example, an image type for a virtual machine.|
|ServiceInfo1|Service-specific metadata.|
|ServiceInfo2|Legacy field with optional service-specific metadata.|
|ServiceName|MISSING.|
|ServiceTier|MISSING.|
|Currency|See `BillingCurrency`.|
|UnitOfMeasure|The unit of measure for billing for the service. For example, compute services are billed per hour.|
