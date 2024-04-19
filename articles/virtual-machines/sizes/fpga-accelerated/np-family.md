---
title: NP family VM size series
description: Overview of the 'NP' family and sub families of virtual machine sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/18/2024
ms.author: mattmcinnes
---

# 'NP' family storage optimized VM size series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The 'NP' family of VM size series are one of Azure's storage-optimized VM instances. They're designed for workloads that require high disk throughput and I/O, such as databases, big data applications, and data warehousing. Equipped with high disk throughput and large local disk storage capacities, L-series VMs support applications and services that benefit from low latency and high sequential read and write speeds. This makes them particularly well-suited for handling tasks like large-scale log processing, real-time big data analytics, and scenarios involving large databases that perform frequent disk operations, ensuring efficient performance for storage-heavy applications.

## Workloads and use cases

**Real-Time Data Processing:** NP-family VMs excel in environments where data needs to be processed in real time with minimal latency, such as in financial trading, real-time analytics, and network data processing.

**Custom AI and Machine Learning:** NP-family VMs are suitable for accelerating AI and machine learning inference tasks, where the FPGA can be programmed to execute specific algorithms sometimes faster than typical CPU or GPU-based solutions.

**Genomics and Life Sciences:** NP-family VMs can significantly speed up genomic sequencing tasks and other life sciences applications that benefit from custom hardware acceleration.

**Video Transcoding and Streaming:** FPGAs can be used to accelerate video processing tasks such as transcoding and real-time video streaming, optimizing performance and reducing processing times.

**Signal Processing:** NP-family VMs are ideal for applications in telecommunications and signal processing where rapid manipulation and analysis of signals are necessary.

**Database Acceleration:** NP-family VMs can enhance database operations, especially for custom search operations and large-scale database queries, by offloading these tasks to the FPGA.

## Series in family

### NP-series
[!INCLUDE [np-series-summary](./includes/np-series-summary.md)]

[View the full np-series page](../../np-series.md).

[!INCLUDE [np-series-specs](./includes/np-series-specs.md)]
