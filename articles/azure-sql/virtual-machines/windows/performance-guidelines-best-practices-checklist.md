---
title: "Checklist: Performance best practices & guidelines"
description: Provides a quick checklist to review your best practices and guidelines to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
editor: ''
tags: azure-service-management
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 11/09/2020
ms.author: mathoma
ms.reviewer: jroth
---
# Checklist: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides a quick checklist as a series of best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs). 

For greater details, see the other articles in this series: [VM size](performance-guidelines-best-practices-vm-size.md), [Storage](performance-guidelines-best-practices-storage-disks-io.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md). 

There is typically a trade-off between optimizing for costs and optimizing for performance. This performance best practices series is focused on getting the *best* performance for SQL Server on Azure Virtual Machines. If your workload is less demanding, you might not require every recommended optimization. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## Overview

While running SQL Server on Azure Virtual Machines, continue using the same database performance tuning options that are applicable to SQL Server in on-premises server environments. However, the performance of a relational database in a public cloud depends on many factors such as the size of a virtual machine, and the configuration of the data disks.

[SQL Server images provisioned in the Azure portal](sql-vm-create-portal-quickstart.md) follow general storage [configuration best practices](storage-configuration.md). After provisioning, consider applying other optimizations discussed in this article. Base your choices on your workload and verify through testing.


## Disks

- Use a minimum of 2 premium SSD disks (1 for log file and 1 for data files).
- Data, log, and tempdb files should be on separate drives.
- Leverage the SQL IaaS Agent extension experience in the Azure portal to assist with the storage configuration for your environment.
- Local ephemeral storage (D:\) should only be used for tempdb and other processing where the source data can be recreated in the event of a recycle of the virtual machine.
- Use premium SSDs for the best price/performance advantages.
- Use only premium P30, P40, P50 disks for the Data drive, and optimize focused on capacity for the Log drive (P30 - P80).
- Optimize for highest uncached IOPs for best performance and leverage caching as a performance feature for data reads.
- Standard storage is only recommended for development and test purposes or for backup files and should not be used for production workloads.
- Bursting should be only considered for smaller departmental systems and dev/test workloads
- Use Ultra Disks if less than 1-ms storage latencies are required for the transaction log and write acceleration is not an option. 

## VM Size

- Use VM sizes with 4 or more vCPU like the [Standard_M8-4ms](/../../virtual-machines/m-series), the [E4ds_v4](../../../virtual-machines/edv4-edsv4-series.md#edv4-series), or the [DS12_v2](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) or higher. 
- Use [memory optimized](../../../virtual-machines/sizes-memory.md) virtual machine sizes for the best performance of SQL Server workloads. <br/><br/> - The [DSv2 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md), [Edsv4](../../../virtual-machines/edv4-edsv4-series.md) series, the [M-](../../../virtual-machines/m-series.md), and the [Mv2-](../../../virtual-machines/mv2-series.md) series offer the optimal memory-to-vCore ratio required for OLTP workloads. Both M series VMs offer the highest memory-to-vCore ratio required for mission critical workloads and is also ideal for data warehouse workloads. 
- A higher memory-to-vCore ratio may be required for mission critical and data warehouse workloads. 
- Leverage the Azure Virtual Machine marketplace images as the SQL Server settings and storage options are configured for optimal SQL Server performance. 
- Collect the target workload's performance characteristics and use them to determine the appropriate VM size for your business.|

## Storage

- For detailed testing of SQL Server performance on Azure Virtual Machines with TPC-E and TPC_C benchmarks, refer to the blog Optimize OLTP performance.
- Collect the storage latency requirements for SQL Server data, log, and Tempdb files by monitoring the application before choosing the disk type. If < 1-ms storage latencies are required, then use Ultra Disks, otherwise use premium SSD. If low latencies are only required for the log file and not for data files, then provision the Ultra Disk at required IOPS and throughput levels only for the log File.
- Add an additional 20% premium IOPS/throughput capacity than your workload requires when configuring storage for SQL Server data, log, and Tempdb files
- Keep the storage account and SQL Server VM in the same region.
- Disable Azure geo-redundant storage (geo-replication) on the storage account.
- Configure Read only cache for data files and no cache for the log file
- For workloads requiring < 1-ms IO latencies, enable write accelerator for M series and consider using Ultra SSD disks for Es and DS series virtual machines.
- Enable read only caching only on the disk(s) hosting the data files.
- Stop the SQL Server service when changing the cache settings for an Azure Virtual Machines disk.
- Do not enable caching on disk(s) hosting the log file. 
- Stripe multiple Azure data disks using Storage Spaces to gain increased storage throughput up to the largest target virtual machine’s IOPs and throughput limits

If you enabled read-cache on your ephemeral drive, then consider moving tempdb to a separate drive to prevent overconsumption of the local Azure cache. 

If you want to prevent overconsumption of the local Azure cache, then move your tempdb to a separate drive, and enable read-cache. 


- Format with documented allocation sizes
- Place Tempdb on the local SSD D:\ drive for most SQL Server workloads after choosing correct VM size. If you create the VM from the Azure marketplace images, tempdb will already be targeted to leverage ephemeral disk following the best practices for tempdb.
  - 

> [!NOTE] 
>	If the capacity of the local drive is not enough for your tempdb size, then place tempdb on a storage pool striped on premium SSD disks with read-only caching.
>	
>Consider placing tempdb on a separate data drive and not on the ephemeral disk D:\ when read-caching is enabled to prevent overconsumption of the local Azure cache.



## Azure & SQL feature specific

- Enable database page compression.
- Enable instant file initialization for data files.
- Limit autogrowth of the database.<br/><br/> - Disable autoshrink of the database.
- Move all databases to data disks, including system databases.
- Move SQL Server error log and trace file directories to data disks.
- Configure default backup and database file locations.
- [Enable locked pages in memory](/sql/database-engine/configure-windows/enable-the-lock-pages-in-memory-option-windows).
- Evaluate and apply the [latest cumulative updates](/sql/database-engine/install-windows/latest-updates-for-microsoft-sql-server) for the installed version of SQL Server. |

- Back up directly to Azure Blob storage.
- Use [file snapshot backups](/sql/relational-databases/backup-restore/file-snapshot-backups-for-database-files-in-azure) for databases larger than 12 TB. 
- Use multiple Temp DB files, 1 file per core, up to 8 files.
- Set max server memory at 90% or up to 50 GB left for the Operating System.
- Enable soft NUMA. 




## Next steps

To learn more, see the other articles in this series:
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage, disks & IO](performance-guidelines-best-practices-storage-disks-io.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
