---
title: "Collect baseline: Performance best practices & guidelines"
description: Provides steps to collect a performance baseline as guidelines to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
editor: ''
tags: azure-service-management
ms.assetid: a0c85092-2113-4982-b73a-4e80160bac36
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 03/25/2021
ms.author: mathoma
ms.reviewer: jroth
---
# Collect baseline: Performance best practices for SQL Server on Azure VM
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides information to collect a performance baseline as aa series of best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

There is typically a trade-off between optimizing for costs and optimizing for performance. This performance best practices series is focused on getting the *best* performance for SQL Server on Azure Virtual Machines. If your workload is less demanding, you might not require every recommended optimization. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## Overview

For a prescriptive approach, gather performance counters using PerfMon/LogMan and capture SQL Server wait statistics to better understand general pressures and potential bottlenecks of the source environment. 

Start by collecting the CPU, memory, [IOPS](../../../virtual-machines/premium-storage-performance.md#iops), [throughput](../../../virtual-machines/premium-storage-performance.md#throughput), and [latency](../../../virtual-machines/premium-storage-performance.md#latency) of the source workload at peak times following the [application performance checklist](../../../virtual-machines/premium-storage-performance.md#application-performance-requirements-checklist). 

Gather data during peak hours such as workloads during your typical business day, but also other high load processes such as end-of-day processing, and weekend ETL workloads. Consider scaling up your resources for atypically heavily workloads, such as end-of-quarter processing, and then scale done once the workload completes. 

Use the performance analysis to select the [VM Size](../../../virtual-machines/sizes-memory.md) that can scale to your workload's performance requirements.


## Storage

SQL Server performance depends heavily on the I/O subsystem and storage performance is measured by IOPS and throughput. Unless your database fits into physical memory, SQL Server constantly brings database pages in and out of the buffer pool. The data files for SQL Server should be treated differently. Access to log files is sequential except when a transaction needs to be rolled back where data files, including TempDB, are randomly accessed. If you have a slow I/O subsystem, your users may experience performance issues such as slow response times and tasks that do not complete due to time-outs. 

The Azure Marketplace virtual machines have log files on a physical disk that is separate from the data files by default. The TempDB data files count and size meet best practices and are targeted to the ephemeral D:/ drive.. 

The following PerfMon counters can help validate the IO throughput required by your SQL Server: 
* **\LogicalDisk\Disk Reads/Sec** (read and write IOPS)
* **\LogicalDisk\Disk Writes/Sec** (read and write IOPS) 
* **\LogicalDisk\Disk Bytes/Sec** (throughput requirements for the data, log, and TempDB files)

Using IOPS and throughput requirements at peak levels, evaluate VM sizes that match the capacity from your measurements. 

If your workload requires 20 K read IOPS and 10K write IOPS, you can either choose E16s_v3 (with up to 32 K cached and 25600 uncached IOPS) or M16_s (with up to 20 K cached and 10K uncached IOPS) with 2 P30 disks striped using Storage Spaces. 

Make sure to understand both throughput and IOPS requirements of the workload as VMs have different scale limits for IOPS and throughput.

## Memory

Track both external memory used by the OS as well as the memory used internally by SQL Server. Identifying pressure for either component will help size virtual machines and identify opportunities for tuning. 

The following PerfMon counters can help validate the memory health of a SQL Server virtual machine: 
* [\Memory\Available MBytes](/azure/monitoring/infrastructure-health/vmhealth-windows/winserver-memory-availmbytes)
* [\SQLServer:Memory Manager\Target Server Memory (KB)](/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
* [\SQLServer:Memory Manager\Total Server Memory (KB)](/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
* [\SQLServer:Buffer Manager\Lazy writes/sec](/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)
* [\SQLServer:Buffer Manager\Page life expectancy](/sql/relational-databases/performance-monitor/sql-server-buffer-manager-object)

## Compute

Compute in Azure is managed differently than on-premises. On-premises servers are built to last several years without an upgrade due to the management overhead and cost of acquiring new hardware. Virtualization mitigates some of these issues but applications are optimized to take the most advantage of the underlying hardware, meaning any significant change to resource consumption requires rebalancing the entire physical environment. 

This is not a challenge in Azure where a new virtual machine on a different series of hardware, and even in a different region, is easy to achieve. 

In Azure, you want to take advantage of as much of the virtual machines resources as possible, therefore, Azure virtual machines should be configured to keep the average CPU as high as possible without impacting the workload. 

The following PerfMon counters can help validate the compute health of a SQL Server virtual machine:
* **\Processor Information(_Total)\% Processor Time**
* **\Process(sqlservr)\% Processor Time**

> [!NOTE] 
> Ideally, try to aim for using 80% of your compute, with peaks above 90% but not reaching 100% for any sustained period of time. Fundamentally, you only want to provision the compute the application needs and then plan to scale up or down as the business requires. 


## Next steps

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage](performance-guidelines-best-practices-storage.md)


For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
