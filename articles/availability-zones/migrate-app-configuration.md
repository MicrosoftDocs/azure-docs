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

Azure App Configuration supports Azure availability zones. This guide describes how to migrate an App Configuration store from non-availability zone support to a region with availability zone support.

## Availability zone support in Azure App Configuration

Azure App Configuration supports Azure availability zones to protect your application and data from single datacenter failures. All availability zone-enabled regions have a minimum of three availability zones, and each availability zone is composed of one or more datacenters equipped with independent power, cooling, and networking infrastructure. All App Configuration stores in regions where App Configuration service supports availability zones, have the Availability zones enabled by default.

[!INCLUDE [Azure App Configuration availability zones table](../../includes/azure-app-configuration-availability-zones.md)]

For more information about availability zones, go to [Regions and Availability Zones in Azure.](../availability-zones/az-overview.md)

## App Configuration store migration

### If App Configuration starts supporting availability zones in your region

#### Prerequisites

None

#### Downtime requirements

None

#### Process

If you created an App Configuration store in a region where App Configuration didn't have availability zone support, and Azure App Configuration starts supporting availability zones in that region, you don't need to do anything to start benefiting from the availability zone support. Your store will benefit from the availability zone support that has become available for App Configuration stores in the region.

### If App Configuration doesn’t support availability zones in your region

#### Prerequisites

- An Azure subscription with the Owner or Contributor role to create a new App Configuration store
- An Owner, Contributor, or App Configuration Data Owner permissions on an App Configuration store to be migrated.

#### Downtime requirements

None

#### Process

If App Configuration doesn't support availability zones in your region, you will need to move your App Configuration store to a region with App Configuration availability zone support.

App Configuration stores are region-specific and can't be migrated across regions. To migrate a store to an Azure region where App Configuration has enabled availability zone support, you must create a new App Configuration store in the target region, then move your App Configuration data from the source store to the new target store.
The following steps walk you through the process of creating a new target store and importing the configuration data from your current store, to the newly created store.

1. Create a target configuration store in a [region where App Configuration has enabled availability zone support](#availability-zone-support-in-azure-app-configuration)
1. Transfer your configuration key-values using the [import](../azure-app-configuration/howto-import-export-data.md) option in your target configuration store.
1. Optionally, delete your source configuration store if you have no use for it.

For detailed instructions, go to [Move an App Configuration store to another region](../azure-app-configuration/howto-move-resource-between-regions.md).

## Next steps

> [!div class="nextstepaction"]
> [Resiliency and disaster recovery](../azure-app-configuration/concept-disaster-recovery.md)
