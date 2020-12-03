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

To learn more, see the other articles in this series: [VM size](performance-guidelines-best-practices-vm-size.md), [Storage, disks & IO](performance-guidelines-best-practices-storage-disks-io.md), [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

## Overview

While running SQL Server on Azure Virtual Machines, we recommend that you continue using the same database performance tuning options that are applicable to SQL Server in on-premises server environments. However, the performance of a relational database in a public cloud depends on many factors such as the size of a virtual machine, and the configuration of the data disks.

[SQL Server images provisioned in the Azure portal](sql-vm-create-portal-quickstart.md) follow general storage [configuration best practices](storage-configuration.md). After provisioning, consider applying other optimizations discussed in this article. Base your choices on your workload and verify through testing.

> [!TIP]
> There is typically a trade-off between optimizing for costs and optimizing for performance. This article is focused on getting the *best* performance for SQL Server on Azure Virtual Machines. If your workload is less demanding, you might not require every optimization listed below. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## VM Size

## Storage, disks & IO

## Azure & SQL feature specific


## Quick checklist

The following is a quick checklist for optimal performance of SQL Server on Azure Virtual Machines:

| Area | Optimizations |
| --- | --- |
| [VM size](#vm-size-guidance) | - Use VM sizes with 4 or more vCPU like the [Standard_M8-4ms](/../../virtual-machines/m-series), the [E4ds_v4](../../../virtual-machines/edv4-edsv4-series.md#edv4-series), or the [DS12_v2](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) or higher. <br/><br/> - Use [memory optimized](../../../virtual-machines/sizes-memory.md) virtual machine sizes for the best performance of SQL Server workloads. <br/><br/> - The [DSv2 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md), [Edsv4](../../../virtual-machines/edv4-edsv4-series.md) series, the [M-](../../../virtual-machines/m-series.md), and the [Mv2-](../../../virtual-machines/mv2-series.md) series offer the optimal memory-to-vCore ratio required for OLTP workloads. Both M series VMs offer the highest memory-to-vCore ratio required for mission critical workloads and is also ideal for data warehouse workloads. <br/><br/> - A higher memory-to-vCore ratio may be required for mission critical and data warehouse workloads. <br/><br/> - Leverage the Azure Virtual Machine marketplace images as the SQL Server settings and storage options are configured for optimal SQL Server performance. <br/><br/> - Collect the target workload's performance characteristics and use them to determine the appropriate VM size for your business.|
| [Storage](#storage-guidance) | - For detailed testing of SQL Server performance on Azure Virtual Machines with TPC-E and TPC_C benchmarks, refer to the blog [Optimize OLTP performance](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794). <br/><br/> - Use [premium SSDs](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794) for the best price/performance advantages. Configure [Read only cache](../../../virtual-machines/premium-storage-performance.md#disk-caching) for data files and no cache for the log file. <br/><br/> - Use [Ultra Disks](../../../virtual-machines/disks-types.md#ultra-disk) if less than 1-ms storage latencies are required by the workload. See [migrate to ultra disk](storage-migrate-to-ultradisk.md) to learn more. <br/><br/> - Collect the storage latency requirements for SQL Server data, log, and Temp DB files by [monitoring the application](../../../virtual-machines/premium-storage-performance.md#application-performance-requirements-checklist) before choosing the disk type. If < 1-ms storage latencies are required, then use Ultra Disks, otherwise use premium SSD. If low latencies are only required for the log file and not for data files, then [provision the Ultra Disk](../../../virtual-machines/disks-enable-ultra-ssd.md) at required IOPS and throughput levels only for the log File. <br/><br/>  -  Standard storage is only recommended for development and test purposes or for backup files and should not be used for production workloads. <br/><br/> - Keep the [storage account](../../../storage/common/storage-account-create.md) and SQL Server VM in the same region.<br/><br/> - Disable Azure [geo-redundant storage](../../../storage/common/storage-redundancy.md) (geo-replication) on the storage account.  |
| [Disks](#disks-guidance) | - Use a minimum of 2 [premium SSD disks](../../../virtual-machines/disks-types.md#premium-ssd) (1 for log file and 1 for data files). <br/><br/> - For workloads requiring < 1-ms IO latencies, enable write accelerator for M series and consider using Ultra SSD disks for Es and DS series. <br/><br/> - Enable [read only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching) on the disk(s) hosting the data files.<br/><br/> - Add an additional 20% premium IOPS/throughput capacity than your workload requires when [configuring storage for SQL Server data, log, and TempDB files](storage-configuration.md) <br/><br/> - Avoid using operating system or temporary disks for database storage or logging.<br/><br/> - Do not enable caching on disk(s) hosting the log file.  **Important**: Stop the SQL Server service when changing the cache settings for an Azure Virtual Machines disk.<br/><br/> - Stripe multiple Azure data disks to get increased storage throughput.<br/><br/> - Format with documented allocation sizes. <br/><br/> - Place TempDB on the local SSD `D:\` drive for mission critical SQL Server workloads (after choosing correct VM size). If you create the VM from the Azure portal or Azure quickstart templates and [place Temp DB on the Local Disk](https://techcommunity.microsoft.com/t5/SQL-Server/Announcing-Performance-Optimized-Storage-Configuration-for-SQL/ba-p/891583), then you do not need any further action; for all other cases follow the steps in the blog for  [Using SSDs to store TempDB](https://cloudblogs.microsoft.com/sqlserver/2014/09/25/using-ssds-in-azure-vms-to-store-sql-server-TempDB-and-buffer-pool-extensions/) to prevent failures after restarts. If the capacity of the local drive is not enough for your Temp DB size, then place Temp DB on a storage pool [striped](../../../virtual-machines/premium-storage-performance.md) on premium SSD disks with [read-only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching). |
| [I/O](#io-guidance) |- Enable database page compression.<br/><br/> - Enable instant file initialization for data files.<br/><br/> - Limit autogrowth of the database.<br/><br/> - Disable autoshrink of the database.<br/><br/> - Move all databases to data disks, including system databases.<br/><br/> - Move SQL Server error log and trace file directories to data disks.<br/><br/> - Configure default backup and database file locations.<br/><br/> - [Enable locked pages in memory](/sql/database-engine/configure-windows/enable-the-lock-pages-in-memory-option-windows).<br/><br/> - Evaluate and apply the [latest cumulative updates](/sql/database-engine/install-windows/latest-updates-for-microsoft-sql-server) for the installed version of SQL Server. |
| [Feature-specific](#feature-specific-guidance) | - Back up directly to Azure Blob storage.<br/><br/>- Use [file snapshot backups](/sql/relational-databases/backup-restore/file-snapshot-backups-for-database-files-in-azure) for databases larger than 12 TB. <br/><br/>- Use multiple Temp DB files, 1 file per core, up to 8 files.<br/><br/>- Set max server memory at 90% or up to 50 GB left for the Operating System. <br/><br/>- Enable soft NUMA. |


## Next steps

To learn more, see the other articles in this series:
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage, disks & IO](performance-guidelines-best-practices-storage-disks-io.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
