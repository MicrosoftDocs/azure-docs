---
title: Migrate App Configuration to a region with availability zone support
description: Learn how to migrate Azure App Configuration to availability zone support.
author: maud-lv
ms.service: azure-app-configuration
ms.topic: conceptual
ms.date: 09/10/2022
ms.author: malev
ms.custom: references_regions, subject-reliability
---

# Migrate App Configuration to a region with availability zone support

Azure App Configuration supports Azure availability zones. This guide describes how to migrate an App Configuration store from non-availability zone support to a region with availability zone support.

## Availability zone support in Azure App Configuration

Azure App Configuration supports Azure availability zones to protect your application and data from single datacenter failures. All availability zone-enabled regions have a minimum of three availability zones, and each availability zone is composed of one or more datacenters equipped with independent power, cooling, and networking infrastructure. In regions where App Configuration supports availability zones, all stores have availability zones enabled by default.

[!INCLUDE [Azure App Configuration availability zones table](../../includes/azure-app-configuration-availability-zones.md)]

For more information about availability zones, go to [Regions and Availability Zones in Azure.](../reliability/availability-zones-overview.md)

## App Configuration store migration

### If App Configuration starts supporting availability zones in your region

#### Prerequisites

None

#### Downtime requirements

None

#### Process

If you created a store in a region where App Configuration didn't have availability zone support at the time and it started supporting it later, you don't need to do anything to start benefiting from the availability zone support. Your store will benefit from the availability zone support that has become available for App Configuration stores in the region.

### If App Configuration doesn’t support availability zones in your region

#### Prerequisites

- An Azure subscription with the Owner or Contributor role to create a new App Configuration store
- Owner, Contributor, or App Configuration Data Owner permissions on the App Configuration store with no availability zone support.

#### Downtime requirements

None

#### Process

If App Configuration doesn't support availability zones in your region, you'll need to move your App Configuration data from this store to another store in a region where App Configuration has availability zone support.

App Configuration stores are region-specific and can't be migrated across regions. To move a store to a region where App Configuration has availability zone support, you must create a new App Configuration store in the target region, then move your App Configuration data from the source store to the new target store.

The following steps walk you through the process of creating a new target store and using the import/export functionality to move the configuration data from your current store to the newly created store.

1. Create a target configuration store in a [region where App Configuration has availability zone support](#availability-zone-support-in-azure-app-configuration)
1. Transfer your configuration data using the [import function](../azure-app-configuration/howto-import-export-data.md) in your target configuration store.
1. Optionally, delete your source configuration store if you have no use for it.

## Next steps

> [!div class="nextstepaction"]
> [Resiliency and disaster recovery](../azure-app-configuration/concept-geo-replication.md)

> [!div class="nextstepaction"]
> [Building for reliability](/azure/architecture/framework/resiliency/app-design) in Azure.

> [!div class="nextstepaction"]
> [Azure services and regions that support availability zones](availability-zones-service-support.md)

