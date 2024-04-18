---
title: D family (memory-optimized) VM size series
description: Overview of the memory-optimized 'D' family and sub families of virtual machine sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/18/2024
ms.author: mattmcinnes
---

# 'D' family memory optimized VM size series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The 'D' family of VM size series are one of Azure's memory-optimized VM instances. They're designed for memory-intensive workloads, such as relational databases, medium to large caches, and in-memory analytics. Equipped with more memory than the general-purpose D-series, these VMs offer a higher memory-to-core ratio, making them ideal for applications that require rapid access to larger volumes of data with intensive processing needs. This configuration supports efficient transaction processing and complex query operations, providing the necessary resources to maintain high performance and responsiveness under load.

## Workloads and use cases

**Large Databases:** Ideal for running large relational and NoSQL databases that need to maintain large in-memory datasets for quick query responses and transaction processing.

**In-Memory Analytics:** Suitable for applications that perform real-time data analytics and need to process large data sets entirely in memory for faster analysis.

**Caching Solutions:** Efficient for caching scenarios where large volumes of data need to be stored in memory to provide rapid access and improve application performance, such as Redis or Memcached.

## Series in family

### Dv2-series
[!INCLUDE [dv2-dsv2-series-summary](./includes/dv2-dsv2-series-summary.md)]

[View the full Dv2 and Dsv2-series page](../../dv2-dsv2-series.md).

[!INCLUDE [dv2-dsv2-series-specs](./includes/dv2-dsv2-series-specs.md)]