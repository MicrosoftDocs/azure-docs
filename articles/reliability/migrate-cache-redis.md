---
title: Migrate an Azure Cache for Redis instance to availability zone support 
description: Learn how to migrate an Azure Cache for Redis instance to availability zone support.
author: anaharris-ms
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 11/15/2024
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---
 
# Migrate an Azure Cache for Redis instance to availability zone support

This guide describes how to migrate your Azure Cache for Redis instance from non-availability zone support to availability zone support.

Azure Cache for Redis supports zone redundancy in its Standard, Premium, Enterprise, and Enterprise Flash tiers. A zone-redundant cache runs on VMs spread across multiple availability zone to provide high resilience and availability.  

> [!NOTE]
   > Converting an existing resource from non-availability zone support to availability zone support is in preview for standard & premium tier caches.

 > [!NOTE]
   > Zone redundancy isn't supported with geo-replication.

## Enabling Zone Redundancy for Enterprise, and Enterprise Flash tiers

Currently, the only way to convert an enterprise / enterprise flash resource from non-availability zone support to availability zone support is to redeploy your current cache.

### Prerequisites

To migrate to availability zone support, you must have an Azure Cache for Redis resource in either the Enterprise, or Enterprise Flash tiers.

### Downtime requirements

There are multiple ways to migrate data to a new cache. Many of them require some downtime.   

### Migration guidance: redeployment

#### When to use redeployment

Azure Cache for Redis currently doesn’t allow adding availability zone support to an existing enterprise / enterprise flash cache. The best way to convert a non-zone redundant cache to a zone redundant cache is to deploy a new cache using the availability zone configuration you need, and then migrate your data from the current cache to the new cache. 

#### Redeployment considerations

Running multiple caches simultaneously as you convert your data to the new cache creates extra expenses.

#### How to redeploy

1. To create a new zone redundant cache that meets your requirements, follow the steps in [Enable zone redundancy for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md). 

    >[!TIP]
    >To ease the migration process, it's recommended that you create the cache to use the same tier, SKU, and region as your current cache.

1. Migrate your data from the current cache to the new zone redundant cache. To learn the most common ways to migrate based on your requirements and constraints, see [Cache migration guide - Migration options](../azure-cache-for-redis/cache-migration-guide.md).

1. Configure your application to point to the new zone redundant cache

1. Delete your old cache

## Enabling Zone Redundancy for Standard and Premium tiers

Updating an existing Standard or Premium cache to use zone redundancy is supported in-place (Preview). Users can enable it by navigating to the **Advanced settings** on the Resource menu and selecting **Allocate Zones automatically** check-box followed by the save button.

Users can't disable zone redundancy once it's enabled.

:::image type="content" source="media/migrate-cache-redis/enable-zones-on-existing-cache.png" alt-text="Screenshot showing a red boxes around Advanced settings blade, (PREVIEW) Allocate zones automatically check-box, and Save button.":::

This update can also be done by passing `ZonalAllocationPolicy` as `Automatic` in the request body while updating the cache using REST API. For more information regarding the update process using REST API, see [Update - ZonalAllocationPolicy](/rest/api/redis/redis/update#zonalallocationpolicy).

Updating `ZonalAllocationPolicy to any other value than `Automatic` isn't supported.

  > [!IMPORTANT]
  > Automatic Zonal Allocation cannot be modified once enabled for a cache.

  > [!IMPORTANT]
  > Enabling Automatic Zonal Allocation for an existing cache (which is created with a different zonal allocation) is currently NOT supported for Geo Replicated caches or caches with VNet injection.

## Next Steps

Learn more about:

> [!div class="nextstepaction"]
> [Azure services that support availability zones](availability-zones-service-support.md)

> [!div class="nextstepaction"]
> [Azure regions that support availability zones](availability-zones-region-support.md)
