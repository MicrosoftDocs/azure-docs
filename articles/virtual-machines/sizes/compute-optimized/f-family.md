---
title: F family VM size series
description: Overview of the 'F' family and sub families of virtual machine sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/18/2024
ms.author: mattmcinnes
---

# 'F' family compute optimized VM size series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The 'F' family of VM size series are one of Azure's compute-optimized VM instances. They're designed for workloads that require high CPU performance, such as batch processing, web servers, analytics, and gaming. Featuring a high CPU-to-memory ratio, F-series VMs are equipped with powerful processors to handle applications that demand more CPU capacity relative to memory. This makes them particularly effective for scenarios where fast and efficient processing is critical, allowing businesses to run their compute-bound applications efficiently and cost-effectively.

## Workloads and use cases

**Web Servers:** F-series VMs are excellent for hosting web servers and applications that require significant compute capability to handle web traffic efficiently without necessarily needing large amounts of memory.

**Batch Processing:** F-series VMs are ideal for batch jobs and other processing tasks that involve handling large volumes of data or tasks in a queue but are more CPU-intensive than memory-intensive.

**Application Servers:** Applications that require quick processing and do not have high memory demands can benefit from F-series VMs. These can include medium traffic application servers, back-end servers for enterprise applications, and other similar tasks.
Gaming Servers: Due to their high CPU performance, F-series VMs are also suitable for gaming servers where fast processing is critical for a good gaming experience.

**Analytics:** F-series VMs can be used for data analytics applications that require processing speed to crunch numbers and perform calculations more than they require a large amount of memory.

## Series in family

### Fsv2-series
[!INCLUDE [fsv2-series-summary](./includes/fsv2-series-summary.md)]

[View the full Fsv2-series page](../../fsv2-series.md).

[!INCLUDE [fsv2-series-specs](./includes/fsv2-series-specs.md)]


### Fasv6 and Falsv6-series
[!INCLUDE [fasv6-falsv6-series-summary](./includes/fasv6-falsv6-series-summary.md)]

[View the full Fasv6 and Falsv6-series page](../../fasv6-falsv6-series.md).

[!INCLUDE [fasv6-falsv6-series-specs](./includes/fasv6-falsv6-series-specs.md)]