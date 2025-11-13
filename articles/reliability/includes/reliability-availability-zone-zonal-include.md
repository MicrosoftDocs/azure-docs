---
title: Availability zone - note about zonal resources
description: Include file that describes when to use zonal resources, and important information about their resiliency.
author: anaharris-ms
ms.service: azure
ms.topic: include
ms.date: 10/21/2025
ms.author: anaharris
ms.custom: include file
---

> [!IMPORTANT]
> Pinning to a single availability zone is only recommended when [cross-zone latency](../availability-zones-overview.md#inter-zone-latency) is too high for your needs and after you verify that the latency doesn't meet your requirements. By itself, a zonal resource doesn't provide resiliency to an availability zone outage. To improve the resiliency of a zonal resource, you need to explicitly deploy separate resources into multiple availability zones and configure traffic routing and failover.
