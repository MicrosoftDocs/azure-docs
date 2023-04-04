---
title: Migrate an Azure Cache for Redis instance to availability zone support 
description: Learn how to migrate an Azure Cache for Redis instance to availability zone support.
author: anaharris-ms
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 06/23/2022
ms.author: anaharris 
ms.reviewer: anaharris
ms.custom: references_regions, subject-reliability
---
 
# Migrate an Azure Cache for Redis instance to availability zone support

This guide describes how to migrate your Azure Cache for Redis instance from non-availability zone support to availability zone support.

Azure Cache for Redis supports zone redundancy in its Premium, Enterprise, and Enterprise Flash tiers. A zone-redundant cache runs on VMs spread across multiple availability zone to provide high resilience and availability.  

Currently, the only way to convert a resource from non-availability zone support to availability zone support is to redeploy your current cache.

## Prerequisites

To migrate to availability zone support, you must have an Azure Cache for Redis resource in either the Premium, Enterprise, or Enterprise Flash tiers.

## Downtime requirements

There are multiple ways to migrate data to a new cache. Many of them require some downtime.   

## Migration guidance: redeployment

### When to use redeployment

Azure Cache for Redis currently doesn’t allow adding availability zone support to an existing cache. The best way to convert a non-zone redundant cache to a zone redundant cache is to deploy a new cache using the availability zone configuration you need, and then migrate your data from the current cache to the new cache. 

### Redeployment considerations

Running multiple caches simultaneously as you convert your data to the new cache creates extra expenses.

### How to redeploy

1.  To create a new zone redundant cache that meets your requirements, follow the steps in [Enable zone redundancy for Azure Cache for Redis](../azure-cache-for-redis/cache-how-to-zone-redundancy.md). 

>[!TIP]
>To ease the migration process, it is recommended that you create the cache to use the same tier, SKU, and region as your current cache.

1. Migrate your data from the current cache to the new zone redundant cache. To learn the most common ways to migrate based on your requirements and constraints, see [Cache migration guide - Migration options](../azure-cache-for-redis/cache-migration-guide.md).

1. Configure your application to point to the new zone redundant cache

1. Delete your old cache

## Next Steps

Learn more about:

> [!div class="nextstepaction"]
> [Azure services and regions that support availability zones](availability-zones-service-support.md)