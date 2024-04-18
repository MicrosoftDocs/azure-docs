---
title: EC sub-family VM size series 
description: Overview of the 'EC' sub-family of virtual machine sizes
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 04/16/2024
ms.author: mattmcinnes
---

# 'EC' sub-family memory optimized VM size series

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

> [!NOTE]
> 'EC' family VMs are specialized for confidential computing scenarios. If your workload doesn't require confidential compute and you're looking for memory-optimized VMs with similar specs, consider the [the standard E-family size series](./e-family.md).

The 'EC' family of VM size series are one of Azure's security focused memory-optimized VM instances. They're designed for memory-intensive workloads, such as large databases, big data analytics, and enterprise applications that require significant amounts of RAM to maintain high performance. Equipped with high memory-to-core ratios, E-series VMs support applications and services that benefit from faster data access and more efficient data processing capabilities. This makes them particularly well-suited for scenarios involving in-memory databases and extensive data processing tasks where ample memory is crucial for optimal performance.

## Workloads and use cases

**Memory-Intensive Workloads:** Any workload that demands a large memory footprint to efficiently handle tasks, such as simulations, large-scale computations in scientific research, or financial risk modeling.

**Large Databases and SQL Servers:** They are ideal for hosting large relational databases like SQL Server and NoSQL databases that benefit from high memory capacities for improved performance in data processing and transaction handling.

**Enterprise Applications:** Suitable for resource-intensive enterprise applications, including large-scale ERP and CRM systems, where the availability of ample memory is crucial for managing complex transactions and user loads.

**Big Data Applications:** Effective for big data analytics applications that need to process vast amounts of data in memory to speed up analysis and insights generation.
In-Memory Computing: Such as in-memory databases (e.g., SAP HANA) that require large amounts of RAM to keep the entire dataset in memory, allowing for ultra-fast data processing and query responses.

**Data Warehousing:** Provides the necessary resources for data warehousing solutions that handle and analyze large datasets, improving query performance and reducing response times.

## Series in family

### Ecasv5 and Ecadsv5-series
[!INCLUDE [ecasv5-ecadsv5-series-summary](./includes/ecasv5-ecadsv5-series-summary.md)]

[View the full Ecasv5 and Ecadsv5-series page](../../ecasv5-ecadsv5-series.md).

[!INCLUDE [ecasv5-ecadsv5-series-specs](./includes/ecasv5-ecadsv5-series-specs.md)]


### Ecasccv5 and Ecadsccv5-series
[!INCLUDE [ecasccv5-ecadsccv5-series-summary](./includes/ecasccv5-ecadsccv5-series-summary.md)]

[View the full Ecasccv5 and Ecadsccv5-series page](../../ecasccv5-ecadsccv5-series.md).

[!INCLUDE [ecasccv5-ecadsccv5-series-specs](./includes/ecasccv5-ecadsccv5-series-specs.md)]


### Ecesv5 and Ecedsv5-series
[!INCLUDE [ecesv5-ecedsv5-series-summary](./includes/ecesv5-ecedsv5-series-summary.md)]

[View the full Ecesv5 and Ecedsv5-series page](../../ecesv5-ecedsv5-series.md).

[!INCLUDE [ecesv5-ecedsv5-series-specs](./includes/ecesv5-ecedsv5-series-specs.md)]


[!INCLUDE [sizes-footer](../includes/sizes-footer.md)]
