---
title: HX sub-family VM size series
description: Overview of the 'HX' sub-family of virtual machine sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/19/2024
ms.author: mattmcinnes
---

# 'HX' sub-family storage optimized VM size series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

The 'HX' family of VM size series are one of Azure's high-memory, high-performance computing (HPC) optimized VM instances. They're designed for memory-intensive workloads that require both large amounts of RAM and significant CPU performance, such as in-memory databases, big data analytics, and complex scientific simulations. Equipped with expansive memory and powerful CPUs, HX-series VMs provide the necessary resources to efficiently handle large datasets and perform rapid data processing. This makes them particularly well-suited for sectors like financial services, scientific research, and enterprise resource planning, where managing and analyzing large volumes of data in real-time is crucial for operational success and innovation.

## Workloads and use cases

**In-Memory Databases:** HX-series VMs are excellent for hosting in-memory databases like SAP HANA, which require extensive memory to maintain large datasets in RAM for ultra-fast processing and access.

**Big Data Analytics:** They can handle big data analytics applications that need to process vast amounts of data in memory to speed up analysis, which is critical for real-time decision-making.

**Genomic Research:** Genomics research often involves large-scale data analysis, where high memory capacity can significantly enhance performance by allowing more of the dataset to be held in memory, speeding up the analysis.

**Financial Simulations:** Financial institutions use HX-series VMs for high-frequency trading platforms and risk management simulations that require rapid processing of large data volumes to predict stock trends or calculate credit risks in real time.

**ERP Systems:** Large enterprise resource planning (ERP) systems benefit from the high memory and processing power of HX-series VMs to manage and process extensive enterprise data and support large numbers of concurrent users effectively.

## Series in family

### HB-series
[!INCLUDE [hx-series-summary](./includes/hx-series-summary.md)]

[View the full HX-series page](../../hx-series.md).

[!INCLUDE [hx-series-specs](./includes/hx-series-specs.md)]


[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]