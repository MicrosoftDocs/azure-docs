---
title: Understand how the reservation discount is applied to Azure Cache for Redis | Microsoft Docs
description: Learn how reservation discount is applied to Azure Cache for Redis instances.
author: flang-msft

ms.author: franlanglois
ms.service: cache
ms.topic: conceptual
ms.date: 11/17/2023

---

# How the reservation discount is applied to Azure Cache for Redis

After you buy an Azure Cache for Redis reserved capacity, the reservation discount is automatically applied to cache instances that match the attributes and quantity of the reservation. A reservation covers only the compute costs of your Azure Cache for Redis. You're charged for storage and networking at the normal rates. Reserved capacity is only available for [premium tier](../../azure-cache-for-redis/quickstart-create-redis.md) caches.

## How reservation discount is applied

A reservation discount is ***use-it-or-lose-it***. So, if you don't have matching resources for any hour, then you lose a reservation quantity for that hour. You can't carry forward unused reserved hours.

When you shut down a resource, the reservation discount automatically applies to another matching resource in the specified scope. If no matching resources are found in the specified scope, then the reserved hours are lost.

Stopped resources are billed and continue to use reservation hours. Deallocate or delete resources or scale-in other resources to use your available reservation hours with other workloads. 

## Discount applied to Azure Cache for Redis

The Azure Cache for Redis reserved capacity discount is applied to your caches on an hourly basis. The reservation that you buy is matched to the compute usage emitted by the running caches. When these caches don't run the full hour, the reservation is automatically applied to other caches matching the reservation attributes. The discount can apply to caches that are running concurrently. If you don't have caches that run for an entire hour that match the reservation attributes, you don't get the full benefit of the reservation discount for that hour.

The following examples show how the Azure Cache for Redis reserved capacity discount applies depending on the number of caches you've bought, and when they're running.

* **Example 1**: You buy an Azure Cache for Redis reserved capacity for a 6 GB cache. If you are running a 13 GB cache that matches the rest of the attributes of the reservation, you're charged the pay-as-you-go price for 7 GB of your Azure Cache for Redis compute usage and you get the reservation discount for one hour of 6 GB cache compute usage.

For the rest of these examples, assume that the Azure Cache for Redis reserved capacity you buy is for a 26 GB cache and the rest of the reservation attributes match the running cache.

* **Example 2**: You run two 13 GB caches for an hour. The 26 GB reservation discount is applied to the compute usage of both caches.

* **Example 3**: You run one 26 GB from 1 pm to 1:30 pm. You run another 26 GB cache from 1:30 to 2 pm. Both are covered by the reservation discount.

* **Example 4**: You run one 26 GB from 1 pm to 1:45 pm. You run another 26 GB cache from 1:30 to 2 pm. You're charged the pay-as-you-go price for the 15-minute overlap. The reservation discount applies to the compute usage for the rest of the time.

To understand and view the application of your Azure Reservations in billing usage reports, see [Understand Azure reservation usage](./understand-reserved-instance-usage-ea.md).

## Need help? Contact us
If you have questions or need help, [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).