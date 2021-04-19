---
title: "VM size: Performance best practices & guidelines"
description: Provides VM size guidelines and best practices to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
services: virtual-machines-windows
documentationcenter: na
author: dplessMSFT
editor: ''
tags: azure-service-management
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/25/2021
ms.author: dpless
ms.reviewer: jroth
---
# VM size: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides VM size guidance a series of best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

There is typically a trade-off between optimizing for costs and optimizing for performance. This performance best practices series is focused on getting the *best* performance for SQL Server on Azure Virtual Machines. If your workload is less demanding, you might not require every recommended optimization. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.


## Checklist

Review the following checklist for a brief overview of the VM size best practices that the rest of the article covers in greater detail: 

- Use VM sizes with 4 or more vCPU like the [Standard_M8-4ms](/azure/virtual-machines/m-series), the [E4ds_v4](../../../virtual-machines/edv4-edsv4-series.md#edv4-series), or the [DS12_v2](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) or higher. 
- Use [memory optimized](../../../virtual-machines/sizes-memory.md) virtual machine sizes for the best performance of SQL Server workloads. 
- The [DSv2 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md), [Edsv4](../../../virtual-machines/edv4-edsv4-series.md) series, the [M-](/azure/virtual-machines/m-series), and the [Mv2-](../../../virtual-machines/mv2-series.md) series offer the optimal memory-to-vCore ratio required for OLTP workloads. Both M series VMs offer the highest memory-to-vCore ratio required for mission critical workloads and are also ideal for data warehouse workloads. 
- Consider a higher memory-to-vCore ratio for mission critical and data warehouse workloads. 
- Leverage the Azure Virtual Machine marketplace images as the SQL Server settings and storage options are configured for optimal SQL Server performance. 
- Collect the target workload's performance characteristics and use them to determine the appropriate VM size for your business.

To compare the VM size checklist with the others, see the comprehensive [Performance best practices checklist](performance-guidelines-best-practices-checklist.md). 

## Overview

When you are creating a SQL Server on Azure VM, carefully consider the type of workload necessary. If you are migrating an existing environment, [collect a performance baseline](performance-guidelines-best-practices-collect-baseline.md) to determine your SQL Server on Azure VM requirements. If this is a new VM, then create your new SQL Server VM based on your vendor requirements. 

If you are creating a new SQL Server VM with a new application built for the cloud, you can easily size your SQL Server VM as your data and usage requirements evolve.
Start the development environments with the lower-tier D-Series, B-Series, or Av2-series and grow your environment over time. 

Use the SQL Server VM marketplace images with the storage configuration in the portal. This will make it easier to properly create the storage pools necessary to get the size, IOPS, and throughput necessary for your workloads. It is important to choose SQL Server VMs that support premium storage and premium storage caching. See the [storage](performance-guidelines-best-practices-storage.md) article to learn more. 

The recommended minimum for a production OLTP environment is 4 vCore, 32 GB of memory, and a memory-to-vCore ratio of 8. For new environments, start with 4 vCore machines and scale to 8, 16, 32 vCores or more when your data and compute requirements change. For OLTP throughput, target SQL Server VMs that have 5000 IOPS for every vCore. 

SQL Server data warehouse and mission critical environments will often need to scale beyond the 8 memory-to-vCore ratio. For medium environments, you may want to choose a 16 memory-to-vCore ratio, and a 32 memory-to-vCore ratio for larger data warehouse environments. 

SQL Server data warehouse environments often benefit from the parallel processing of larger machines. For this reason, the M-series and the Mv2-series are strong options for larger data warehouse environments.

Use the vCPU and memory configuration from your source machine as a baseline for migrating a current on-premises SQL Server database to SQL Server on Azure VMs. Bring your core license to Azure to take advantage of the [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) and save on SQL Server licensing costs.

## Memory optimized

The [memory optimized virtual machine sizes](../../../virtual-machines/sizes-memory.md) are a primary target for SQL Server VMs and the recommended choice by Microsoft. The memory optimized virtual machines offer stronger memory-to-CPU ratios and medium-to-large cache options. 

### M, Mv2, and Mdsv2 series

The [M-series](/azure/virtual-machines/m-series) offers vCore counts and memory for some of the largest SQL Server workloads.  

The [Mv2-series](../../../virtual-machines/mv2-series.md) has the highest vCore counts and memory and is recommended for mission critical and data warehouse workloads. Mv2-series instances are memory optimized VM sizes providing unparalleled computational performance to support large in-memory databases and workloads with a high memory-to-CPU ratio that is perfect for relational database servers, large caches, and in-memory analytics.

The [Standard_M64ms](/azure/virtual-machines/m-series) has a 28 memory-to-vCore ratio for example.

[Mdsv2 Medium Memory series](../../..//virtual-machines/msv2-mdsv2-series.md) is a new M-series that is currently in [preview](https://aka.ms/Mv2MedMemoryPreview) that offers a range of M-series level Azure virtual machines with a midtier memory offering. These machines are well suited for SQL Server workloads with a minimum of 10 memory-to-vCore support up to 30.

Some of the features of the M and Mv2-series attractive for SQL Server performance include [premium storage](../../../virtual-machines/premium-storage-performance.md) and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching) support, [ultra-disk](../../../virtual-machines/disks-enable-ultra-ssd.md) support, and [write acceleration](../../../virtual-machines/how-to-enable-write-accelerator.md).

### Edsv4-series

The [Edsv4-series](../../../virtual-machines/edv4-edsv4-series.md) is designed for memory-intensive applications. These VMs have a large local storage SSD capacity, strong local disk IOPS, up to 504 GiB of RAM. There is a nearly consistent 8 GiB of memory per vCore across most of these virtual machines, which is ideal for standard SQL Server workloads. 

There is a new virtual machine in this group with the [Standard_E80ids_v4](../../../virtual-machines/edv4-edsv4-series.md) that offers 80 vCores, 504 GBs of memory, with a memory-to-vCore ratio of 6. This virtual machine is notable because it is [isolated](../../../virtual-machines/isolation.md) which means it is guaranteed to be the only virtual machine running on the host, and therefore is isolated from other customer workloads. This has a memory-to-vCore ratio that is lower than what is recommended for SQL Server, so it should only be used if isolation is required.

The Edsv4-series virtual machines support [premium storage](../../../virtual-machines/premium-storage-performance.md), and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

### DSv2-series 11-15

The [DSv2-series 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) has the same memory and disk configurations as the previous D-series. This series has a consistent memory-to-CPU ratio of 7 across all virtual machines. This is the smallest of the memory-optimized series and is a good low-cost option for entry-level SQL Server workloads.

The [DSv2-series 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) supports [premium storage](../../../virtual-machines/premium-storage-performance.md) and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching), which is strongly recommended for optimal performance.

## General purpose

The [general purpose virtual machine sizes](../../../virtual-machines/sizes-general.md) are designed to provide balanced memory-to-vCore ratios for smaller entry level workloads such as development and test, web servers, and smaller database servers. 

Because of the smaller memory-to-vCore ratios with the general purpose virtual machines, it is important to carefully monitor memory-based performance counters to ensure SQL Server is able to get the buffer cache memory it needs. See [memory performance baseline](performance-guidelines-best-practices-collect-baseline.md#memory) for more information. 

Since the starting recommendation for production workloads is a memory-to-vCore ratio of 8, the minimum recommended configuration for a general purpose VM running SQL Server is 4 vCPU and 32 GB of memory. 

### Ddsv4 series

The [Ddsv4-series](../../../virtual-machines/ddv4-ddsv4-series.md) offers a fair combination of vCPU, memory, and temporary disk but with smaller memory-to-vCore support. 

The Ddsv4 VMs include lower latency and higher-speed local storage.

These machines are ideal for side-by-side SQL and app deployments that require fast access to temp storage and departmental relational databases. There is a standard memory-to-vCore ratio of 4 across all of the virtual machines in this series. 

For this reason, it is recommended to leverage the D8ds_v4 as the starter virtual machine in this series, which has 8 vCores and 32 GBs of memory. The largest machine is the D64ds_v4, which has 64 vCores and 256 GBs of memory.

The [Ddsv4-series](../../../virtual-machines/ddv4-ddsv4-series.md) virtual machines support [premium storage](../../../virtual-machines/premium-storage-performance.md) and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

> [!NOTE]
> The [Ddsv4-series](../../../virtual-machines/ddv4-ddsv4-series.md) does not have the memory-to-vCore ratio of 8 that is recommended for SQL Server workloads. As such, considering using these virtual machines for smaller application and development workloads only.

### B-series

The [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) virtual machine sizes are ideal for workloads that do not need consistent performance such as proof of concept and very small application and development servers. 

Most of the [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) virtual machine sizes have a memory-to-vCore ratio of 4. The largest of these machines is the [Standard_B20ms](../../../virtual-machines/sizes-b-series-burstable.md) with 20 vCores and 80 GB of memory.

This series is unique as the apps have the ability to **burst** during business hours with burstable credits varying based on machine size. 

When the credits are exhausted, the VM returns to the baseline machine performance.

The benefit of the B-series is the compute savings you could achieve compared to the other VM sizes in other series especially if you need the processing power sparingly throughout the day.

This series supports [premium storage](../../../virtual-machines/premium-storage-performance.md), but **does not support** [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

> [!NOTE] 
> The [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) does not have the memory-to-vCore ratio of 8 that is recommended for SQL Server workloads. As such, consider using these virtual machines for smaller applications, web servers, and development workloads only.

### Av2-series

The [Av2-series](../../../virtual-machines/av2-series.md) VMs are best suited for entry-level workloads like development and test, low traffic web servers, small to medium app databases, and proof-of-concepts.

Only the [Standard_A2m_v2](../../../virtual-machines/av2-series.md) (2 vCores and 16GBs of memory), [Standard_A4m_v2](../../../virtual-machines/av2-series.md) (4 vCores and 32GBs of memory), and the [Standard_A8m_v2](../../../virtual-machines/av2-series.md) (8 vCores and 64GBs of memory) have a good memory-to-vCore ratio of 8 for these top three virtual machines. 

These virtual machines are both good options for smaller development and test SQL Server machines. 

The 8 vCore [Standard_A8m_v2](../../../virtual-machines/av2-series.md) may also be a good option for small application and web servers.

> [!NOTE] 
> The Av2 series does not support premium storage and as such, is not recommended for production SQL Server workloads even with the virtual machines that have a memory-to-vCore ratio of 8.

## Storage optimized

The [storage optimized VM sizes](../../../virtual-machines/sizes-storage.md) are for specific use cases. These virtual machines are specifically designed with optimized disk throughput and IO. 

### Lsv2-series

The [Lsv2-series](../../../virtual-machines/lsv2-series.md) features high throughput, low latency, and local NVMe storage. The Lsv2-series VMs are optimized to use the local disk on the node attached directly to the VM rather than using durable data disks. 

These virtual machines are strong options for big data, data warehouse, reporting, and ETL workloads. The high throughput and IOPS of the local NVMe storage is a good use case for processing files that will be loaded into your database and other scenarios where the data can be recreated from the source system or other repositories such as Azure Blob storage or Azure Data Lake. [Lsv2-series](../../../virtual-machines/lsv2-series.md) VMs can also burst their disk performance for up to 30 minutes at a time.

These virtual machines size from 8 to 80 vCPU with 8 GiB of memory per vCPU and for every 8 vCPUs there is 1.92 TB of NVMe SSD. This means for the largest VM of this series, the [L80s_v2](../../../virtual-machines/lsv2-series.md), there is 80 vCPU and 640 BiB of memory with 10x1.92TB of NVMe storage.  There is a consistent memory-to-vCore ratio of 8 across all of these virtual machines.

The NVMe storage is ephemeral meaning that data will be lost on these disks if you deallocate your virtual machine, or if it's moved to a different host for service healing.

The Lsv2 and Ls series support [premium storage](../../../virtual-machines/premium-storage-performance.md), but not premium storage caching. The creation of a local cache to increase IOPs is not supported. 

> [!WARNING]
> Storing your data files on the ephemeral NVMe storage could result in data loss when the VM is deallocated. 

## Constrained vCores

High performing SQL Server workloads often need larger amounts of memory, I/O, and throughput without the higher vCore counts. 

Most OLTP workloads are application databases driven by large numbers of smaller transactions. With OLTP workloads, only a small amount of the data is read or modified, but the volumes of transactions driven by user counts are much higher. It is important to have the SQL Server memory available to cache plans, store recently accessed data for performance, and ensure physical reads can be read into memory quickly. 

These OLTP environments need higher amounts of memory, fast storage, and the I/O bandwidth necessary to perform optimally. 

In order to maintain this level of performance without the higher SQL Server licensing costs, Azure offers VM sizes with [constrained vCPU counts](../../../virtual-machines/constrained-vcpu.md). 

This helps control licensing costs by reducing the available vCores while maintaining the same memory, storage, and I/O bandwidth of the parent virtual machine.

The vCPU count can be constrained to one-half to one-quarter of the original VM size. Reducing the vCores available to the virtual machine will achieve higher memory-to-vCore ratios, but the compute cost will remain the same.

These new VM sizes have a suffix that specifies the number of active vCPUs to make them easier to identify. 

For example, the [M64-32ms](../../../virtual-machines/constrained-vcpu.md) requires licensing only 32 SQL Server vCores with the memory, I/O, and throughput of the [M64ms](/azure/virtual-machines/m-series) and the [M64-16ms](../../../virtual-machines/constrained-vcpu.md) requires licensing only 16 vCores.  Though while the [M64-16ms](../../../virtual-machines/constrained-vcpu.md) has a quarter of the SQL Server licensing cost of the M64ms, the compute cost of the virtual machine will be the same.

> [!NOTE] 
> - Medium to large data warehouse workloads may still benefit from [constrained vCore VMs](../../../virtual-machines/constrained-vcpu.md), but data warehouse workloads are commonly characterized by fewer users and processes addressing larger amounts of data through query plans that run in parallel. 
> - The compute cost, which includes operating system licensing, will remain the same as the parent virtual machine. 



## Next steps

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [Storage](performance-guidelines-best-practices-storage.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md). 
