---
title: "Checklist: Best practices & guidelines"
description: Provides a quick checklist to review your best practices and guidelines to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
services: virtual-machines-windows
documentationcenter: na
author: dplessMSFT
editor: ''
tags: azure-service-management
ms.service: virtual-machines-sql
ms.subservice: performance
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 06/01/2021
ms.author: dpless
ms.custom: contperf-fy21q3
ms.reviewer: jroth
---
# Checklist: Best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides a quick checklist as a series of best practices and guidelines to optimize performance of your SQL Server on Azure Virtual Machines (VMs). 

For comprehensive details, see the other articles in this series: [Checklist](performance-guidelines-best-practices-checklist.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Storage](performance-guidelines-best-practices-storage.md), [Security](security-considerations-best-practices.md), [HADR configuration](hadr-cluster-best-practices.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md). 


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
- Format your data disk to use 64-KB allocation unit size for all data files placed on a drive other than the temporary `D:\` drive (which has a default of 4 KB). SQL Server VMs deployed through Azure Marketplace come with data disks formatted with allocation unit size and interleave for the storage pool set to 64 KB. 


To learn more, see the comprehensive [Storage best practices](performance-guidelines-best-practices-storage.md). 

## SQL Server features

The following is a quick checklist of best practices for SQL Server configuration settings when running your SQL Server instances in an Azure virtual machine in production: 

- Enable [database page compression](/sql/relational-databases/data-compression/data-compression) where appropriate.
- Enable [backup compression](/sql/relational-databases/backup-restore/backup-compression-sql-server).
- Enable [instant file initialization](/sql/relational-databases/databases/database-instant-file-initialization) for data files.
- Limit [autogrowth](/troubleshoot/sql/admin/considerations-autogrow-autoshrink#considerations-for-autogrow) of the database.
- Disable [autoshrink](/troubleshoot/sql/admin/considerations-autogrow-autoshrink#considerations-for-auto_shrink) of the database.
- Disable autoclose of the database.
- Move all databases to data disks, including [system databases](/sql/relational-databases/databases/move-system-databases).
- Move SQL Server error log and trace file directories to data disks.
- Configure default backup and database file locations.
- Set max [SQL Server memory limit](/sql/database-engine/configure-windows/server-memory-server-configuration-options#use-) to leave enough memory for the Operating System. ([Leverage Memory\Available Bytes](/sql/relational-databases/performance-monitor/monitor-memory-usage) to monitor the operating system memory health).
- Enable [lock pages in memory](/sql/database-engine/configure-windows/enable-the-lock-pages-in-memory-option-windows).
- Enable [optimize for adhoc workloads](/sql/database-engine/configure-windows/optimize-for-ad-hoc-workloads-server-configuration-option) for OLTP heavy environments.
- Evaluate and apply the [latest cumulative updates](/sql/database-engine/install-windows/latest-updates-for-microsoft-sql-server) for the installed versions of SQL Server.
- Enable [Query Store](/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store) on all production SQL Server databases [following best practices](/sql/relational-databases/performance/best-practice-with-the-query-store).
- Enable [automatic tuning](/sql/relational-databases/automatic-tuning/automatic-tuning) on mission critical application databases.
- Ensure that all [tempdb best practices](/sql/relational-databases/databases/tempdb-database#optimizing-tempdb-performance-in-sql-server) are followed.
- Place tempdb on the ephemeral D:/ drive.
- [Use the recommended number of files](/troubleshoot/sql/performance/recommendations-reduce-allocation-contention#resolution), using multiple tempdb data files starting with one file per core, up to eight files.
- Schedule SQL Server Agent jobs to run [DBCC CHECKDB](/sql/t-sql/database-console-commands/dbcc-checkdb-transact-sql#a-checking-both-the-current-and-another-database), [index reorganize](/sql/relational-databases/indexes/reorganize-and-rebuild-indexes#reorganize-an-index), [index rebuild](/sql/relational-databases/indexes/reorganize-and-rebuild-indexes#rebuild-an-index), and [update statistics](/sql/t-sql/statements/update-statistics-transact-sql#examples) jobs.
- Monitor and manage the health and size of the SQL Server [transaction log file](/sql/relational-databases/logs/manage-the-size-of-the-transaction-log-file#Recommendations).
- Take advantage of any new [SQL Server features](/sql/sql-server/what-s-new-in-sql-server-ver15) available for the version being used.
- Be aware of the differences in [supported features](/sql/sql-server/editions-and-components-of-sql-server-version-15) between the editions you are considering deploying.

## Azure features

The following is a quick checklist of best practices for Azure-specific guidance when running your SQL Server on Azure VM:

- Register with [the SQL IaaS Agent Extension](sql-agent-extension-manually-register-single-vm.md) to unlock a number of [feature benefits](sql-server-iaas-agent-extension-automate-management.md#feature-benefits).
- Leverage the best [backup and restore strategy](backup-restore.md#decision-matrix) for your SQL Server workload.
- Ensure [Accelerated Networking is enabled](../../../virtual-network/create-vm-accelerated-networking-cli.md#portal-creation) on the virtual machine.
- Leverage [Azure Security Center](../../../security-center/index.yml) to improve the overall security posture of your virtual machine deployment.
- Leverage [Azure Defender](../../../security-center/azure-defender.md), integrated with [Azure Security Center](https://azure.microsoft.com/services/security-center/), for specific [SQL Server VM coverage](../../../security-center/defender-for-sql-introduction.md) including vulnerability assessments, and just-in-time access, which reduces the attack service while allowing legitimate users to access virtual machines when necessary. To learn more, see [vulnerability assessments](../../../security-center/defender-for-sql-on-machines-vulnerability-assessment.md), [enable vulnerability assessments for SQL Server VMs](../../../security-center/defender-for-sql-on-machines-vulnerability-assessment.md) and [just-in-time access](../../../security-center/just-in-time-explained.md). 
- Leverage [Azure Advisor](../../../advisor/advisor-overview.md) to address [performance](../../../advisor/advisor-performance-recommendations.md), [cost](../../../advisor/advisor-cost-recommendations.md), [reliability](../../../advisor/advisor-high-availability-recommendations.md), [operational excellence](../../../advisor/advisor-operational-excellence-recommendations.md), and [security recommendations](../../../advisor/advisor-security-recommendations.md).
- Leverage [Azure Monitor](../../../azure-monitor/vm/quick-monitor-azure-vm.md) to collect, analyze, and act on telemetry data from your SQL Server environment. This includes identifying infrastructure issues with [VM insights](../../../azure-monitor/vm/vminsights-overview.md) and monitoring data with [Log Analytics](../../../azure-monitor/logs/log-query-overview.md) for deeper diagnostics.
- Enable [Autoshutdown](../../../automation/automation-solution-vm-management.md) for development and test environments. 
- Implement a high availability and disaster recovery (HADR) solution that meets  your business continuity SLAs, see the [HADR options](business-continuity-high-availability-disaster-recovery-hadr-overview.md#deployment-architectures) options available for SQL Server on Azure VMs. 
- Use the Azure portal (support + troubleshooting) to evaluate [resource health](../../../service-health/resource-health-overview.md) and history; submit new support requests when needed.

## HADR configuration

High availability and disaster recovery (HADR) features, such as the [Always On availability group](availability-group-overview.md) and the [failover cluster instance](failover-cluster-instance-overview.md) rely on underlying [Windows Server Failover Cluster](hadr-windows-server-failover-cluster-overview.md) technology. Review the best practices for modifying your HADR settings to better support the cloud environment. 

For your Windows cluster, consider these best practices: 

* Change the cluster to less aggressive parameters to avoid unexpected outages from transient network failures or Azure platform maintenance. To learn more, see [heartbeat and threshold settings](hadr-cluster-best-practices.md#heartbeat-and-threshold). For Windows Server 2012 and later, use the following recommended values: 
   - **SameSubnetDelay**:  1 second
   - **SameSubnetThreshold**: 40 heartbeats
   - **CrossSubnetDelay**: 1 second
   - **CrossSubnetThreshold**:  40 heartbeats
* Place your VMs in an availability set or different availability zones.  To learn more, see [VM availability settings](hadr-cluster-best-practices.md#vm-availability-settings). 
* Use a single NIC per cluster node and a single subnet. 
* Configure cluster [quorum voting](hadr-cluster-best-practices.md#quorum-voting) to use 3 or more odd number of votes. Do not assign votes to DR regions. 
* Carefully monitor [resource limits](hadr-cluster-best-practices.md#resource-limits) to avoid unexpected restarts or failovers due to resource constraints.
   - Ensure your OS, drivers, and SQL Server are at the latest builds. 
   - Optimize performance for SQL Server on Azure VMs. Review the other sections in this article to learn more. 
   - Reduce or spread out workload to avoid resource limits. 
   - Move to a VM or disk that his higher limits to avoid constraints. 

For your SQL Server availability group or failover cluster instance, consider these best practices: 

* If you're experiencing frequent unexpected failures, follow the performance best practices outlined in the rest of this article. 
* If optimizing SQL Server VM performance does not resolve your unexpected failovers, consider [relaxing the monitoring](hadr-cluster-best-practices.md#relaxed-monitoring) for the availability group or failover cluster instance. However, doing so may not address the underlying source of the issue and could mask symptoms by reducing the likelihood of failure. You may still need to investigate and address the underlying root cause. For Windows Server 2012 or higher, use the following recommended values: 
   - **Lease timeout**: Use this equation to calculate the maximum lease time out value:   
    `Lease timeout < (2 * SameSubnetThreshold * SameSubnetDelay)`.    
    Start with 40 seconds. If you're using the relaxed `SameSubnetThreshold` and `SameSubnetDelay` values recommended previously, do not exceed 80 seconds for the lease timeout value.    
   - **Max failures in a specified period**: Set this value to 6. 
* When using the virtual network name (VNN) to connect to your HADR solution, specify `MultiSubnetFailover = true` in the connection string, even if your cluster only spans one subnet. 
   - If the client does not support `MultiSubnetFailover = True` you may need to set `RegisterAllProvidersIP = 0` and `HostRecordTTL = 300` to cache client credentials for shorter durations. However, doing so may cause additional queries to the DNS server. 
- To connect to your HADR solution using the distributed network name (DNN), consider the following:
   - You must use a client driver that supports `MultiSubnetFailover = True`, and this parameter must be in the connection string. 
   - Use a unique DNN port in the connection string when connecting to the DNN listener for an availability group. 
- Use a database mirroring connection string for a basic availability group to bypass the need for a load balancer or DNN. 
- Validate the sector size of your VHDs before deploying your high availability solution to avoid having misaligned I/Os. See [KB3009974](https://support.microsoft.com/topic/kb3009974-fix-slow-synchronization-when-disks-have-different-sector-sizes-for-primary-and-secondary-replica-log-files-in-sql-server-ag-and-logshipping-environments-ed181bf3-ce80-b6d0-f268-34135711043c) to learn more. 


To learn more, see the comprehensive [HADR best practices](hadr-cluster-best-practices.md). 


## Next steps

To learn more, see the other articles in this series:

- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage](performance-guidelines-best-practices-storage.md)
- [Security](security-considerations-best-practices.md)
- [HADR settings](hadr-cluster-best-practices.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.yml).
