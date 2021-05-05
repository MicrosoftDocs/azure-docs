---
title: "Checklist: Performance best practices & guidelines"
description: Provides a quick checklist to review your best practices and guidelines to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
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
ms.date: 05/05/2021
ms.author: dplessMSFT
ms.custom: contperf-fy21q3
ms.reviewer: jroth
---
# Checklist: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides a quick checklist as a series of best practices and guidelines to optimize performance of your SQL Server on Azure Virtual Machines (VMs). 

For comprehensive details, see the other articles in this series: [VM size](performance-guidelines-best-practices-vm-size.md), [Storage](performance-guidelines-best-practices-storage.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md). 


## Overview

While running SQL Server on Azure Virtual Machines, continue using the same database performance tuning options that are applicable to SQL Server in on-premises server environments. However, the performance of a relational database in a public cloud depends on many factors, such as the size of a virtual machine, and the configuration of the data disks.

There is typically a trade-off between optimizing for costs and optimizing for performance. This performance best practices series is focused on getting the *best* performance for SQL Server on Azure Virtual Machines. If your workload is less demanding, you might not require every recommended optimization. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## VM Size

The following is a quick checklist of VM size best practices for running your SQL Server on Azure VM: 

- Use VM sizes with 4 or more vCPU like the [Standard_M8-4ms](../../../virtual-machines/m-series.md), the [E4ds_v4](../../../virtual-machines/edv4-edsv4-series.md#edv4-series), or the [DS12_v2](../../../virtual-machines/dv2-dsv2-series-memory.md#dsv2-series-11-15) or higher. 
- Use [memory optimized](../../../virtual-machines/sizes-memory.md) virtual machine sizes for the best performance of SQL Server workloads. 
- The [DSv2 11-15](../../../virtual-machines/dv2-dsv2-series-memory.md), [Edsv4](../../../virtual-machines/edv4-edsv4-series.md) series, the [M-](../../../virtual-machines/m-series.md), and the [Mv2-](../../../virtual-machines/mv2-series.md) series offer the optimal memory-to-vCore ratio required for OLTP workloads. Both M series VMs offer the highest memory-to-vCore ratio required for mission critical workloads and are also ideal for data warehouse workloads. 
- Consider a higher memory-to-vCore ratio for mission critical and data warehouse workloads. 
- Use the Azure Virtual Machine marketplace images as the SQL Server settings and storage options are configured for optimal SQL Server performance. 
- Collect the target workload's performance characteristics and use them to determine the appropriate VM size for your business.

To learn more, see the comprehensive [VM size best practices](performance-guidelines-best-practices-vm-size.md). 

## Storage

The following is a quick checklist of storage configuration best practices for running your SQL Server on Azure VM: 

- Monitor the application and [determine storage bandwidth and latency requirements](../../../virtual-machines/premium-storage-performance.md#counters-to-measure-application-performance-requirements) for SQL Server data, log, and tempdb files before choosing the disk type. 
- To optimize storage performance, plan for highest uncached IOPS available and use data caching as a performance feature for data reads while avoiding [virtual machine and disks capping/throttling](../../../virtual-machines/premium-storage-performance.md#throttling).
- Place data, log, and tempdb files on separate drives.
    - For the data drive, only use [premium P30 and P40 disks](../../../virtual-machines/disks-types.md#premium-ssd) to ensure the availability of cache support
    - For the log drive plan for capacity and test performance versus cost while evaluating the [premium P30 - P80 disks](../../../virtual-machines/disks-types.md#premium-ssd).
      - If submillisecond storage latency is required, use [Azure ultra disks](../../../virtual-machines/disks-types.md#ultra-disk) for the transaction log. 
      - For M-series virtual machine deployments consider [Write Accelerator](../../../virtual-machines/how-to-enable-write-accelerator.md) over using Azure ultra disks.
    - Place [tempdb](/sql/relational-databases/databases/tempdb-database) on the local ephemeral SSD `D:\` drive for most SQL Server workloads after choosing the optimal VM size. 
      - If the capacity of the local drive is not enough for tempdb, consider sizing up the VM. See [Data file caching policies](performance-guidelines-best-practices-storage.md#data-file-caching-policies) for more information.
- Stripe multiple Azure data disks using [Storage Spaces](/windows-server/storage/storage-spaces/overview) to increase I/O bandwidth up to the target virtual machine's IOPS and throughput limits.
- Set [host caching](../../../virtual-machines/disks-performance.md#virtual-machine-uncached-vs-cached-limits) to read-only for data file disks.
- Set [host caching](../../../virtual-machines/disks-performance.md#virtual-machine-uncached-vs-cached-limits) to none for log file disks.
    - Do not enable read/write caching on disks that contain SQL Server files. 
    - Always stop the SQL Server service before changing the cache settings of your disk.
- For development and test workloads consider using standard storage. It is not recommended to use Standard HDD/SDD for production workloads.
- [Credit-based Disk Bursting](../../../virtual-machines/disk-bursting.md#credit-based-bursting) (P1-P20) should only be considered for smaller dev/test workloads and departmental systems.
- Provision the storage account in the same region as the SQL Server VM. 
- Disable Azure geo-redundant storage (geo-replication) and use LRS (local redundant storage) on the storage account.
- Format your data disk to use 64 KB allocation unit size for all data files placed on a drive other than the temporary `D:\` drive (which has a default of 4 KB). SQL Server VMs deployed through Azure Marketplace come with data disks formatted with allocation unit size and interleave for the storage pool set to 64 KB. 

To learn more, see the comprehensive [Storage best practices](performance-guidelines-best-practices-storage.md). 

## SQL Server features

The following is a quick checklist of best practices for SQL Server configurations when running your SQL Server instances in a production setting:

- [Enable database page compression](https://docs.microsoft.com/en-us/sql/relational-databases/data-compression/data-compression?view=sql-server-ver15).
- [Enable backup compression](https://docs.microsoft.com/en-us/sql/relational-databases/backup-restore/backup-compression-sql-server?view=sql-server-ver15).
- Enable [instant file initialization](https://docs.microsoft.com/en-us/sql/relational-databases/databases/database-instant-file-initialization?view=sql-server-ver15) for data files.
- Limit [autogrowth](https://docs.microsoft.com/en-us/troubleshoot/sql/admin/considerations-autogrow-autoshrink#considerations-for-autogrow) of the database.
- Disable [autoshrink](https://docs.microsoft.com/en-us/troubleshoot/sql/admin/considerations-autogrow-autoshrink#considerations-for-auto_shrink) of the database.
- Disable autoclose of the database.
- Move all databases to data disks, including [system databases](https://docs.microsoft.com/en-us/sql/relational-databases/databases/move-system-databases?view=sql-server-ver15).
- Move SQL Server error log and trace file directories to data disks.
- Configure default backup and database file locations.
- Set max [SQL Server memory limit](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/server-memory-server-configuration-options?view=sql-server-ver15#use-) to leave enough memory for the Operating System. ([Leverage Memory\Available Bytes](https://docs.microsoft.com/en-us/sql/relational-databases/performance-monitor/monitor-memory-usage?view=sql-server-ver15) to monitor the operating system memory health).
- Enable [lock pages in memory](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/enable-the-lock-pages-in-memory-option-windows?view=sql-server-ver15).
- Enable [optimize for adhoc workloads](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/optimize-for-ad-hoc-workloads-server-configuration-option?view=sql-server-ver15) for OLTP heavy environments.
- Evaluate and apply the [latest cumulative updates](https://docs.microsoft.com/en-us/sql/database-engine/install-windows/latest-updates-for-microsoft-sql-server?view=sql-server-ver15) for the installed versions of SQL Server.
- Enable [Query Store](https://docs.microsoft.com/en-us/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store?view=sql-server-ver15) on all production SQL Server databases [following best practices](https://docs.microsoft.com/en-us/sql/relational-databases/performance/best-practice-with-the-query-store?view=sql-server-ver15).
- Enable [automatic tuning](https://docs.microsoft.com/en-us/sql/relational-databases/automatic-tuning/automatic-tuning?view=sql-server-ver15) on mission critical application databases.
- Be aware of the [performance improvements](https://docs.microsoft.com/en-us/sql/relational-databases/databases/tempdb-database?view=sql-server-ver15#performance-improvements-in-tempdb-for-sql-server) for tempdb in SQL Server 2016+.
- Increase tempdb default sizes to avoid auto growth.
- [Use the recommended number of files](https://docs.microsoft.com/en-US/troubleshoot/sql/performance/recommendations-reduce-allocation-contention#resolution), using multiple tempdb data files starting with 1 file per core, up to 8 files.
- Place tempdb on the ephemeral D:/ drive.
- Schedule SQL Server Agent jobs to run [DBCC CHECKDB](https://docs.microsoft.com/en-us/sql/t-sql/database-console-commands/dbcc-checkdb-transact-sql?view=sql-server-ver15#a-checking-both-the-current-and-another-database), [index reorganize](https://docs.microsoft.com/en-us/sql/relational-databases/indexes/reorganize-and-rebuild-indexes?view=sql-server-ver15#reorganize-an-index), [index rebuild](https://docs.microsoft.com/en-us/sql/relational-databases/indexes/reorganize-and-rebuild-indexes?view=sql-server-ver15#rebuild-an-index), and [update statistics](https://docs.microsoft.com/en-us/sql/t-sql/statements/update-statistics-transact-sql?view=sql-server-ver15#examples) jobs.
- Monitor and manage the health and size of the SQL Server [transaction log file](https://docs.microsoft.com/en-us/sql/relational-databases/logs/manage-the-size-of-the-transaction-log-file?view=sql-server-ver15#Recommendations).
- Take advantage of any new [SQL Server features](https://docs.microsoft.com/en-us/sql/sql-server/what-s-new-in-sql-server-ver15?view=sql-server-ver15) available for the version being used.
- Be aware of the differences in [supported features](https://docs.microsoft.com/en-us/sql/sql-server/editions-and-components-of-sql-server-version-15?view=sql-server-ver15) between the editions you are considering deploying.

## Azure features
The following is a quick checklist of best practices for Azure-specific guidance when running your SQL Server on Azure VM:

- Register with [the SQL IaaS Agent Extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-single-vm?tabs=bash%2Cazure-cli) to unlock a number of [feature benefits](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management?tabs=azure-powershell#feature-benefits).
- Leverage the [best backup and restore strategy](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/backup-restore#decision-matrix) for your SQL Server workload.
- Ensure [Accelerated Networking is enabled](https://docs.microsoft.com/en-us/azure/virtual-network/create-vm-accelerated-networking-cli#portal-creation) on the virtual machine.
- Leverage [Azure Security Center](https://docs.microsoft.com/en-us/azure/security-center/) to improve the overall security posture of your virtual machine deployment.
- Leverage [Azure Defender](https://docs.microsoft.com/en-us/azure/security-center/azure-defender), integrated with [Azure Security Center](https://azure.microsoft.com/en-us/services/security-center/), for specific [SQL Server VM coverage](https://docs.microsoft.com/en-us/azure/security-center/defender-for-sql-introduction) including [vulnerability assessments](https://docs.microsoft.com/en-us/azure/azure-sql/database/sql-vulnerability-assessment) and [advanced threat protection](https://docs.microsoft.com/en-us/azure/azure-sql/database/threat-detection-overview).
- Leverage [Azure Advisor](https://docs.microsoft.com/en-us/azure/advisor/advisor-overview) to address [performance](https://docs.microsoft.com/en-us/azure/advisor/advisor-performance-recommendations), [cost](https://docs.microsoft.com/en-us/azure/advisor/advisor-cost-recommendations), [reliability](https://docs.microsoft.com/en-us/azure/advisor/advisor-high-availability-recommendations), [operational excellence](https://docs.microsoft.com/en-us/azure/advisor/advisor-operational-excellence-recommendations), and [security recommendations](https://docs.microsoft.com/en-us/azure/advisor/advisor-security-recommendations).
- Leverage [Azure Monitor](https://docs.microsoft.com/en-us/azure/azure-monitor/vm/quick-monitor-azure-vm) to collect, analyze, and act on telemetry data from your SQL Server environment. This includes identifying infrastructure issues with [VM insights](https://docs.microsoft.com/en-us/azure/azure-monitor/vm/vminsights-overview) and monitoring data with [Log Analytics](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/log-query-overview) for deeper diagnostics.
- Enable [Auto-shutdown](https://docs.microsoft.com/en-us/azure/automation/automation-solution-vm-management) for development and test environments. 
- In the Azure portal, under [Disaster Recovery](https://docs.microsoft.com/en-us/azure/site-recovery/azure-to-azure-architecture) consider [Azure Site Recovery](https://docs.microsoft.com/en-us/azure/site-recovery/) to replicate virtual machines to another Azure region for business continuity and disaster recovery needs. Technologies such as [Distributed Availability Groups](https://docs.microsoft.com/en-us/sql/database-engine/availability-groups/windows/distributed-availability-groups?view=sql-server-ver15) and [Log Shipping](https://docs.microsoft.com/en-us/sql/database-engine/log-shipping/configure-log-shipping-sql-server?view=sql-server-ver15) can also be used to improve  recoverability capabilities.
- Use the Azure portal (Support + troubleshooting) to evaluate [Resource Health](https://docs.microsoft.com/en-us/azure/service-health/resource-health-overview) and history; submit new support requests when needed.

## Next steps

To learn more, see the other articles in this series:
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage](performance-guidelines-best-practices-storage.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
