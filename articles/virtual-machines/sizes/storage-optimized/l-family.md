---
title: L family VM size series
description: Overview of the 'L' family and sub families of virtual machine sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/18/2024
ms.author: mattmcinnes
---

# 'L' family storage optimized VM size series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The 'L' family of VM size series are one of Azure's storage-optimized VM instances. They're designed for workloads that require high disk throughput and I/O, such as databases, big data applications, and data warehousing. Equipped with high disk throughput and large local disk storage capacities, L-series VMs support applications and services that benefit from low latency and high sequential read and write speeds. This makes them particularly well-suited for handling tasks like large-scale log processing, real-time big data analytics, and scenarios involving large databases that perform frequent disk operations, ensuring efficient performance for storage-heavy applications.

## Workloads and use cases

**Big Data Applications:** L-family VMs are perfect for big data applications that need to process, analyze, and manipulate large datasets stored directly on local disks, benefiting from the high I/O performance.

**Database Servers:** L-family VMs provide the necessary local disk performance for SQL Server, MySQL, PostgreSQL, and other database servers that benefit from fast access to disk storage.

**File Servers:** L-family VMs can be used effectively as file servers within a network, handling large files and serving them with high throughput, especially useful in environments with large media files.

**Video Editing and Rendering:** The high disk throughput and capacity of L-family VMs are beneficial for video editing and rendering tasks, where large video files are frequently read and written to disk.

## Series in family

### Lsv2-series
[!INCLUDE [lsv2-series-summary](./includes/lsv2-series-summary.md)]

[View the full Lsv2-series page](../../lsv2-series.md).

[!INCLUDE [lsv2-series-specs](./includes/lsv2-series-specs.md)]


### Lsv3-series
[!INCLUDE [lsv3-series-summary](./includes/lsv3-series-summary.md)]

[View the full Lsv3-series page](../../lsv3-series.md).

[!INCLUDE [lsv3-series-specs](./includes/lsv3-series-specs.md)]


### Lasv3-series
[!INCLUDE [lasv3-series-summary](./includes/lasv3-series-summary.md)]

[Vew the full Lasv3-series page](../../lasv3-series.md).

[!INCLUDE [lasv3-series-specs](./includes/lasv3-series-specs.md)]
