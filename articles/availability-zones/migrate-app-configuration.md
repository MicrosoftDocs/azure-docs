---
title: Migrate App Configuration to a region with availability zone support
description: Learn how to migrate Azure App Configuration to availability zone support.
author: maud-lv
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 08/10/2022
ms.author: malev
ms.custom: references_regions
---

# Migrate App Configuration to a region with availability zone support

Azure App Configuration supports Azure availability zones. This guide describes how to migrate an App Configuration store from non-availability zone support to a [region with availability zone support](../az-overview#azure-regions-with-availability-zones.md).

## Availability zone support in Azure App Configuration

Azure App Configuration supports Azure availability zones to protect your application and data from single datacenter failures. All availability zone-enabled regions have a minimum of three availability zones, and each availability zone is composed of one or more datacenters equipped with independent power, cooling, and networking infrastructure. For resiliency, this support in App Configuration is enabled for all customers at no extra cost.

Following are regions where App Configuration has enabled availability zone support.

| Americas         | Europe               | Africa | Asia Pacific   |
|------------------|----------------------|--------|----------------|
| Brazil South     | France Central       |        | Australia East |
| Canada Central   | Germany West Central |        | Central India  |
| Central US       | North Europe         |        | Japan East     |
| East US          | Norway East          |        | Korea Central  |
| East US 2        | UK South             |        | Southeast Asia |
| South Central US | West Europe          |        | East Asia      |
| West US 2        | Sweden Central       |        |                |
| West US 3        |                      |        |                |

For more information about availability zones, go to [Regions and Availability Zones in Azure.](../availability-zones/az-overview.md)

## App Configuration store migration

### Prerequisites

None

### Downtime requirements

None

### If App Configuration starts supporting availability zones in your region

If you created an App Configuration store in a region with no availability-zone support, and Azure App Configuration starts supporting availability zones in that region, you don't need to do anything to start benefiting from the availability zone support. Your store will benefit from the availability-zone support that has become available in the region.

### If App Configuration doesn’t support availability zones in your region

If App Configuration doesn't support availability zones in your region, you will need to move your App Configuration store to a region with availability-zone support.

App Configuration stores are region-specific and can't be moved across regions automatically. To migrate an App Configuration store to an Azure region with availability zone support, you must create a new App Configuration store in the target region, then move your content from the source store to the new target store.
The following steps walk you through the process of creating a new target store and exporting your current store to the new region.

1. Create a target configuration store in an [Azure region with availability zone](az-overview#azure-regions-with-availability-zones).
1. Transfer your configuration key-values using the [import](../azure-app-configuration/howto-import-export-data.md) option in your target configuration store.
1. Optionally, delete your source configuration store if you have no use for it.

For detailed instructions, go to [Move an App Configuration store to another region](../azure-app-configuration/howto-move-resource-between-regions.md).

## Next steps

> [!div class="nextstepaction"]
> [Resiliency and disaster recovery](../azure-app-configuration/concept-disaster-recovery.md)
