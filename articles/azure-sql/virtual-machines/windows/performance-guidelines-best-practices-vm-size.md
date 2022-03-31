---
title: "VM size: Performance best practices & guidelines"
description: Provides VM size guidelines and best practices to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
services: virtual-machines-windows
documentationcenter: na
author: bluefooted
editor: ''
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: performance
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 12/10/2021
ms.author: pamela
ms.reviewer: pamela
---

# VM size: Performance best practices for SQL Server on Azure VMs

[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides VM size guidance a series of best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

There is typically a trade-off between optimizing for costs and optimizing for performance. This performance best practices series is focused on getting the *best* performance for SQL Server on Azure Virtual Machines. If your workload is less demanding, you might not require every recommended optimization. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

For comprehensive details, see the other articles in this series: [Checklist](performance-guidelines-best-practices-checklist.md), [Storage](performance-guidelines-best-practices-storage.md), [Security](security-considerations-best-practices.md), [HADR configuration](hadr-cluster-best-practices.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md).

## Checklist

Review the following checklist for a brief overview of the VM size best practices that the rest of the article covers in greater detail:

- The new [Ebdsv5-series (Preview)](../../../virtual-machines/ebsv5-ebdsv5-series.md) provides the highest I/O throughput-to-vCore ratio in Azure along with a memory-to-vCore ratio of 8. This series is highly recommended for most production SQL Server workloads.
- Use VM sizes with 4 or more vCPUs like the [E4ds_v5](../../../virtual-machines/edv5-edsv5-series.md#edsv5-series) or higher.
- Use [memory optimized](../../../virtual-machines/sizes-memory.md) virtual machine sizes for the best performance of SQL Server workloads. 
- The [Edsv5](../../../virtual-machines/edv5-edsv5-series.md#edsv5-series) series, the [M-](../../../virtual-machines/m-series.md), and the [Mv2-](../../../virtual-machines/mv2-series.md) series offer the optimal memory-to-vCore ratio required for OLTP workloads. 
- The [Edsv5](../../../virtual-machines/edv5-edsv5-series.md#edsv5-series) series offers the best price-performance for SQL Server workloads on Azure VMs. Consider this series first for most SQL Server workloads.
- The M series VMs offer the highest memory-to-vCore ratio in Azure. Consider these VMs for mission critical and data warehouse workloads.
- Leverage Azure Marketplace images to deploy your SQL Server Virtual Machines as the SQL Server settings and storage options are configured for optimal performance. 
- Collect the target workload's performance characteristics and use them to determine the appropriate VM size for your business.
- Use the [Data Migration Assistant](https://www.microsoft.com/download/details.aspx?id=53595) [SKU recommendation](/sql/dma/dma-sku-recommend-sql-db) tool to find the right VM size for your existing SQL Server workload.

To compare the VM size checklist with the others, see the comprehensive [Performance best practices checklist](performance-guidelines-best-practices-checklist.md).

## Overview

When you are creating a SQL Server on Azure VM, carefully consider the type of workload necessary. If you are migrating an existing environment, [collect a performance baseline](performance-guidelines-best-practices-collect-baseline.md) to determine your SQL Server on Azure VM requirements. If this is a new VM, then create your new SQL Server VM based on your vendor requirements.

If you are creating a new SQL Server VM with a new application built for the cloud, you can easily size your SQL Server VM as your data and usage requirements evolve.
Start the development environments with the lower-tier D-Series, B-Series, or Av2-series and grow your environment over time.

Use the SQL Server VM marketplace images with the storage configuration in the portal. This will make it easier to properly create the storage pools necessary to get the size, IOPS, and throughput necessary for your workloads. It is important to choose SQL Server VMs that support premium storage and premium storage caching. See the [storage](performance-guidelines-best-practices-storage.md) article to learn more.

Use the SQL Server VM Azure Marketplace images with the storage configuration in the portal. This will make it easier to properly create the storage pools necessary to get the size, IOPS, and throughput required for your workloads. It is important to choose SQL Server VMs that support premium storage and premium storage caching. Currently, the [Ebdsv5-series](../../../virtual-machines/ebsv5-ebdsv5-series.md) provides the highest I/O throughput-to-vCore ratio available in Azure. If you do not know the I/O requirements for your SQL Server workload, this series is the one most likely to meet your needs. See the [storage](performance-guidelines-best-practices-storage.md) article to learn more. 

> [!NOTE]
> If you are interested in participating in the [Ebdsv5-series](../../../virtual-machines/ebsv5-ebdsv5-series.md) public preview, please sign up at [https://aka.ms/signupEbsv5Preview](https://aka.ms/signupEbsv5Preview).

SQL Server data warehouse and mission critical environments will often need to scale beyond the 8 memory-to-vCore ratio. For medium environments, you may want to choose a 16 memory-to-vCore ratio, and a 32 memory-to-vCore ratio for larger data warehouse environments.

SQL Server data warehouse environments often benefit from the parallel processing of larger machines. For this reason, the M-series and the Mv2-series are good options for larger data warehouse environments.

Use the vCPU and memory configuration from your source machine as a baseline for migrating a current on-premises SQL Server database to SQL Server on Azure VMs. If you have Software Assurance, take advantage of [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/) to bring your licenses to Azure and save on SQL Server licensing costs.

## Memory optimized

The [memory optimized virtual machine sizes](../../../virtual-machines/sizes-memory.md) are a primary target for SQL Server VMs and the recommended choice by Microsoft. The memory optimized virtual machines offer stronger memory-to-CPU ratios and medium-to-large cache options.

### Ebdsv5-series

The [Ebdsv5-series (Preview)](../../../virtual-machines/ebsv5-ebdsv5-series.md) is a new memory-optimized series of VMs that offer the highest remote storage throughput available in Azure. These VMs have a memory-to-vCore ratio of 8 which, together with the high I/O throughput, makes them ideal for SQL Server workloads. We strongly recommend the Ebdsv5-series VMs for most of your production SQL Server workloads. If you would like to participate in the public preview for this series, please sign up at [https://aka.ms/signupEbsv5Preview](https://aka.ms/signupEbsv5Preview).

This offering is currently in preview. 

### Edsv5-series

The [Edsv5-series](../../../virtual-machines/edv5-edsv5-series.md#edsv5-series) is designed for memory-intensive applications and is the VM series that Microsoft recommends for most SQL Server workloads. These VMs have a large local storage SSD capacity, up to 672 GiB of RAM, and the highest local and remote storage throughput currently available in Azure. There is a nearly consistent 8 GiB of memory per vCore across most of these virtual machines, which is ideal for most SQL Server workloads. These VMs offer the best price-performance for SQL Server workloads running on Azure virtual machines.

The largest virtual machine in this group is the [Standard_E104ids_v5](../../../virtual-machines/edv5-edsv5-series.md#edsv5-series) that offers 104 vCores and 672 GiBs of memory. This virtual machine is notable because it is [isolated](../../../virtual-machines/isolation.md) which means it is guaranteed to be the only virtual machine running on the host, and therefore is isolated from other customer workloads. This has a memory-to-vCore ratio that is lower than what is recommended for SQL Server, so it should only be used if isolation is required.

The Edsv5-series virtual machines support [premium storage](../../../virtual-machines/premium-storage-performance.md), and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

The [Edsv4-series](../../../virtual-machines/edv4-edsv4-series.md) is designed for memory-intensive applications. These VMs have a large local storage SSD capacity, high local and remote disk IOPS and throughput, up to 504 GiB of RAM. There is a nearly consistent 8 GiB of memory per vCore across most of these virtual machines, which is ideal for standard SQL Server workloads.

### M and Mv2 series

The [M-series](../../../virtual-machines/m-series.md) offers vCore counts and memory for some of the largest SQL Server workloads.  

The [Mv2-series](../../../virtual-machines/mv2-series.md) has the highest vCore counts and memory and is recommended for mission critical and data warehouse workloads. Mv2-series instances are memory optimized VM sizes providing unparalleled computational performance to support large in-memory databases and workloads with a high memory-to-CPU ratio that is perfect for relational database servers, large caches, and in-memory analytics.

Some of the features of the M and Mv2-series attractive for SQL Server performance include [premium storage](../../../virtual-machines/premium-storage-performance.md) and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching) support, [ultra-disk](../../../virtual-machines/disks-enable-ultra-ssd.md) support, and [write acceleration](../../../virtual-machines/how-to-enable-write-accelerator.md).

## General purpose

The [general purpose virtual machine sizes](../../../virtual-machines/sizes-general.md) are designed to provide balanced memory-to-vCore ratios for smaller entry level workloads such as development and test, web servers, and smaller database servers.

Because of the smaller memory-to-vCore ratios with the general purpose virtual machines, it is important to carefully monitor memory-based performance counters to ensure SQL Server is able to get the buffer cache memory it needs. See [memory performance baseline](performance-guidelines-best-practices-collect-baseline.md#memory) for more information.

Since the starting recommendation for production workloads is a memory-to-vCore ratio of 8, the minimum recommended configuration for a general purpose VM running SQL Server is 4 vCPU and 32 GiB of memory. 

### Ddsv5 series

The [Ddsv5-series](../../../virtual-machines/ddv5-ddsv5-series.md#ddsv5-series) offers a fair combination of vCPU, memory, and temporary disk but with smaller memory-to-vCore support. 

The Ddsv5 VMs include lower latency and higher-speed local storage.

These machines are ideal for side-by-side SQL and app deployments that require fast access to temp storage and departmental relational databases. There is a standard memory-to-vCore ratio of 4 across all of the virtual machines in this series.

For this reason, it is recommended to leverage the D8ds_v5 as the starter virtual machine in this series, which has 8 vCores and 32 GiBs of memory. The largest machine is the D96ds_v5, which has 96 vCores and 256 GiBs of memory.

The [Ddsv5-series](../../../virtual-machines/ddv5-ddsv5-series.md#ddsv5-series) virtual machines support [premium storage](../../../virtual-machines/premium-storage-performance.md) and [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

> [!NOTE]
> The [Ddsv5-series](../../../virtual-machines/ddv5-ddsv5-series.md#ddsv5-series) does not have the memory-to-vCore ratio of 8 that is recommended for SQL Server workloads. As such, consider using these virtual machines for small applications and development workloads only.

### B-series

The [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) virtual machine sizes are ideal for workloads that do not need consistent performance such as proof of concept and very small application and development servers.

Most of the [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) virtual machine sizes have a memory-to-vCore ratio of 4. The largest of these machines is the [Standard_B20ms](../../../virtual-machines/sizes-b-series-burstable.md) with 20 vCores and 80 GiB of memory.

This series is unique as the apps have the ability to **burst** during business hours with burstable credits varying based on machine size.

When the credits are exhausted, the VM returns to the baseline machine performance.

The benefit of the B-series is the compute savings you could achieve compared to the other VM sizes in other series especially if you need the processing power sparingly throughout the day.

This series supports [premium storage](../../../virtual-machines/premium-storage-performance.md), but **does not support** [premium storage caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

> [!NOTE]
> The [burstable B-series](../../../virtual-machines/sizes-b-series-burstable.md) does not have the memory-to-vCore ratio of 8 that is recommended for SQL Server workloads. As such, consider using these virtual machines for smaller applications, web servers, and development workloads only.

### Av2-series

The [Av2-series](../../../virtual-machines/av2-series.md) VMs are best suited for entry-level workloads like development and test, low traffic web servers, small to medium app databases, and proof-of-concepts.

Only the [Standard_A2m_v2](../../../virtual-machines/av2-series.md) (2 vCores and 16GiBs of memory), [Standard_A4m_v2](../../../virtual-machines/av2-series.md) (4 vCores and 32GiBs of memory), and the [Standard_A8m_v2](../../../virtual-machines/av2-series.md) (8 vCores and 64GiBs of memory) have a good memory-to-vCore ratio of 8 for these top three virtual machines. 

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

High performing SQL Server workloads often need larger amounts of memory, IOPS, and throughput without the higher vCore counts.

Most OLTP workloads are application databases driven by large numbers of smaller transactions. With OLTP workloads, only a small amount of the data is read or modified, but the volumes of transactions driven by user counts are much higher. It is important to have the SQL Server memory available to cache plans, store recently accessed data for performance, and ensure physical reads can be read into memory quickly.

These OLTP environments need higher amounts of memory, fast storage, and the I/O bandwidth necessary to perform optimally.

In order to maintain this level of performance without the higher SQL Server licensing costs, Azure offers VM sizes with [constrained vCPU counts](../../../virtual-machines/constrained-vcpu.md).

This helps control licensing costs by reducing the available vCores while maintaining the same memory, storage, and I/O bandwidth of the parent virtual machine.

The vCPU count can be constrained to one-half to one-quarter of the original VM size. Reducing the vCores available to the virtual machine will achieve higher memory-to-vCore ratios, but the compute cost will remain the same.

These new VM sizes have a suffix that specifies the number of active vCPUs to make them easier to identify.

For example, the [M64-32ms](../../../virtual-machines/constrained-vcpu.md) requires licensing only 32 SQL Server vCores with the memory, I/O, and throughput of the [M64ms](../../../virtual-machines/m-series.md) and the [M64-16ms](../../../virtual-machines/constrained-vcpu.md) requires licensing only 16 vCores.  Though while the [M64-16ms](../../../virtual-machines/constrained-vcpu.md) has a quarter of the SQL Server licensing cost of the M64ms, the compute cost of the virtual machine will be the same.

> [!NOTE]
>
> - Medium to large data warehouse workloads may still benefit from [constrained vCore VMs](../../../virtual-machines/constrained-vcpu.md), but data warehouse workloads are commonly characterized by fewer users and processes addressing larger amounts of data through query plans that run in parallel.
> - The compute cost, which includes operating system licensing, will remain the same as the parent virtual machine.

## Next steps

To learn more, see the other articles in this best practices series:

- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [Storage](performance-guidelines-best-practices-storage.md)
- [Security](security-considerations-best-practices.md)
- [HADR settings](hadr-cluster-best-practices.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.yml).
