---
title: Performance guidelines for SQL Server in Azure | Microsoft Docs
description: Provides guidelines for optimizing SQL Server performance in Microsoft Azure VMs.
services: virtual-machines-windows
documentationcenter: na
author: rothja
manager: craigg
editor: ''
tags: azure-service-management
ms.assetid: a0c85092-2113-4982-b73a-4e80160bac36
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 09/26/2018
ms.author: jroth

---
# Performance guidelines for SQL Server in Azure Virtual Machines

## Overview

This article provides guidance for optimizing SQL Server performance in Microsoft Azure Virtual Machine. While running SQL Server in Azure Virtual Machines, we recommend that you continue using the same database performance tuning options that are applicable to SQL Server in on-premises server environment. However, the performance of a relational database in a public cloud depends on many factors such as the size of a virtual machine, and the configuration of the data disks.

[SQL Server images provisioned in the Azure portal](quickstart-sql-vm-create-portal.md) follow general storage configuration best practices (for more information on how storage is configured, see [Storage configuration for SQL Server VMs](virtual-machines-windows-sql-server-storage-configuration.md)). After provisioning, consider applying other optimizations discussed in this article. Base your choices on your workload and verify through testing.

> [!TIP]
> There is typically a trade-off between optimizing for costs and optimizing for performance. This article is focused on getting the *best* performance for SQL Server on Azure VMs. If your workload is less demanding, you might not require every optimization listed below. Consider your performance needs, costs, and workload patterns as you evaluate these recommendations.

## Quick check list

The following is a quick check list for optimal performance of SQL Server on Azure Virtual Machines:

| Area | Optimizations |
| --- | --- |
| [VM size](#vm-size-guidance) |[DS3_v2](../sizes-general.md) or higher for SQL Enterprise edition.<br/><br/>[DS2_v2](../sizes-general.md) or higher for SQL Standard and Web editions. |
| [Storage](#storage-guidance) |Use [Premium Storage](../premium-storage.md). Standard storage is only recommended for dev/test.<br/><br/>Keep the [storage account](../../../storage/common/storage-create-storage-account.md) and SQL Server VM in the same region.<br/><br/>Disable Azure [geo-redundant storage](../../../storage/common/storage-redundancy.md) (geo-replication) on the storage account. |
| [Disks](#disks-guidance) |Use a minimum of 2 [P30 disks](../premium-storage.md#scalability-and-performance-targets) (1 for log files and 1 for data files including TempDB).<br/><br/>Avoid using operating system or temporary disks for database storage or logging.<br/><br/>Enable read caching on the disk(s) hosting the data files and TempDB data files.<br/><br/>Do not enable caching on disk(s) hosting the log file.<br/><br/>Important: Stop the SQL Server service when changing the cache settings for an Azure VM disk.<br/><br/>Stripe multiple Azure data disks to get increased IO throughput.<br/><br/>Format with documented allocation sizes. |
| [I/O](#io-guidance) |Enable database page compression.<br/><br/>Enable instant file initialization for data files.<br/><br/>Limit autogrowing on the database.<br/><br/>Disable autoshrink on the database.<br/><br/>Move all databases to data disks, including system databases.<br/><br/>Move SQL Server error log and trace file directories to data disks.<br/><br/>Setup default backup and database file locations.<br/><br/>Enable locked pages.<br/><br/>Apply SQL Server performance fixes. |
| [Feature-specific](#feature-specific-guidance) |Back up directly to blob storage. |

For more information on *how* and *why* to make these optimizations, please review the details and guidance provided in following sections.

## VM size guidance

For performance sensitive applications, it’s recommended that you use the following [virtual machines sizes](../sizes.md):

* **SQL Server Enterprise Edition**: DS3_v2 or higher
* **SQL Server Standard and Web Editions**: DS2_v2 or higher

[DSv2-series](../sizes-general.md#dsv2-series) VMs support premium storage, which is recommended for the best performance. The sizes recommended here are baselines, but the actual machine size you select depends on your workload demands. DSv2-series VMs are general-purpose VMs that are good for a variety of workloads, whereas other machines sizes are optimized for specific workload types. For example, the [M-series](../sizes-memory.md#m-series) offers the highest vCPU count and memory for the largest SQL Server workloads. The [GS-series](../sizes-memory.md#gs-series) and [DSv2-series 11-15](../sizes-memory.md#dsv2-series-11-15) are optimized for large memory requirements. Both of those series are also available in [constrained core sizes](../../windows/constrained-vcpu.md), which saves money for workloads with lower compute demands. The [Ls-series](../sizes-storage.md) machines are optimized for high disk throughput and IO. It is important to consider your specific SQL Server workload and apply this to your selection of a VM series and size.

## Storage guidance

DS-series (along with DSv2-series and GS-series) VMs support [Premium Storage](../premium-storage.md). Premium Storage is recommended for all production workloads.

> [!WARNING]
> Standard Storage has varying latencies and bandwidth and is only recommended for dev/test workloads. This includes the new Standard SSD storage. Production workloads should use Premium Storage.

In addition, we recommend that you create your Azure storage account in the same data center as your SQL Server virtual machines to reduce transfer delays. When creating a storage account, disable geo-replication as consistent write order across multiple disks is not guaranteed. Instead, consider configuring a SQL Server disaster recovery technology between two Azure data centers. For more information, see [High Availability and Disaster Recovery for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-high-availability-dr.md).

## Disks guidance

There are three main disk types on an Azure VM:

* **OS disk**: When you create an Azure Virtual Machine, the platform will attach at least one disk (labeled as the **C** drive) to the VM for your operating system disk. This disk is a VHD stored as a page blob in storage.
* **Temporary disk**: Azure virtual machines contain another disk called the temporary disk (labeled as the **D**: drive). This is a disk on the node that can be used for scratch space.
* **Data disks**: You can also attach additional disks to your virtual machine as data disks, and these will be stored in storage as page blobs.

The following sections describe recommendations for using these different disks.

### Operating system disk

An operating system disk is a VHD that you can boot and mount as a running version of an operating system and is labeled as **C** drive.

Default caching policy on the operating system disk is **Read/Write**. For performance sensitive applications, we recommend that you use data disks instead of the operating system disk. See the section on Data Disks below.

### Temporary disk

The temporary storage drive, labeled as the **D**: drive, is not persisted to Azure blob storage. Do not store your user database files or user transaction log files on the **D**: drive.

For D-series, Dv2-series, and G-series VMs, the temporary drive on these VMs is SSD-based. If your workload makes heavy use of TempDB (such as temporary objects or complex joins), storing TempDB on the **D** drive could result in higher TempDB throughput and lower TempDB latency. For an example scenario, see the TempDB discussion in the following blog post: [Storage Configuration Guidelines for SQL Server on Azure VM](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/09/25/storage-configuration-guidelines-for-sql-server-on-azure-vm/).

For VMs that support Premium Storage (DS-series, DSv2-series, and GS-series), we recommend storing TempDB on a disk that supports Premium Storage with read caching enabled. There is one exception to this recommendation; if your TempDB usage is write-intensive, you can achieve higher performance by storing TempDB on the local **D** drive, which is also SSD-based on these machine sizes.

### Data disks

* **Use data disks for data and log files**: If you are not using disk striping, use two Premium Storage [P30 disks](../premium-storage.md#scalability-and-performance-targets) where one disk contains the log file(s) and the other contains the data and TempDB file(s). Each Premium Storage disk provides a number of IOPs and bandwidth (MB/s) depending on its size, as described in the article, [Using Premium Storage for Disks](../premium-storage.md). If you are using a disk striping technique, such as Storage Spaces, you achieve optimal performance by having two pools, one for the log file(s) and the other for the data files. However, if you plan to use SQL Server Failover Cluster Instances (FCI), you must configure one pool.

   > [!TIP]
   > For test results on various disk and workload configurations, see the following blog post: [Storage Configuration Guidelines for SQL Server on Azure VM](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/09/25/storage-configuration-guidelines-for-sql-server-on-azure-vm/).

   > [!NOTE]
   > When you provision a SQL Server VM in the portal, you have the option of editing your storage configuration. Depending on your configuration, Azure configures one or more disks. Multiple disks are combined into a single storage pool with striping. Both the data and log files reside together in this configuration. For more information, see [Storage configuration for SQL Server VMs](virtual-machines-windows-sql-server-storage-configuration.md).

* **Disk Striping**: For more throughput, you can add additional data disks and use Disk Striping. To determine the number of data disks, you need to analyze the number of IOPS and bandwidth required for your log file(s), and for your data and TempDB file(s). Notice that different VM sizes have different limits on the number of IOPs and bandwidth supported, see the tables on IOPS per [VM size](../sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). Use the following guidelines:

  * For Windows 8/Windows Server 2012 or later, use [Storage Spaces](https://technet.microsoft.com/library/hh831739.aspx) with the following guidelines:

      1. Set the interleave (stripe size) to 64 KB (65536 bytes) for OLTP workloads and 256 KB (262144 bytes) for data warehousing workloads to avoid performance impact due to partition misalignment. This must be set with PowerShell.
      2. Set column count = number of physical disks. Use PowerShell when configuring more than 8 disks (not Server Manager UI). 

    For example, the following PowerShell creates a new storage pool with the interleave size to 64 KB and the number of columns to 2:

    ```powershell
    $PoolCount = Get-PhysicalDisk -CanPool $True
    $PhysicalDisks = Get-PhysicalDisk | Where-Object {$_.FriendlyName -like "*2" -or $_.FriendlyName -like "*3"}

    New-StoragePool -FriendlyName "DataFiles" -StorageSubsystemFriendlyName "Storage Spaces*" -PhysicalDisks $PhysicalDisks | New-VirtualDisk -FriendlyName "DataFiles" -Interleave 65536 -NumberOfColumns 2 -ResiliencySettingName simple –UseMaximumSize |Initialize-Disk -PartitionStyle GPT -PassThru |New-Partition -AssignDriveLetter -UseMaximumSize |Format-Volume -FileSystem NTFS -NewFileSystemLabel "DataDisks" -AllocationUnitSize 65536 -Confirm:$false 
    ```

  * For Windows 2008 R2 or earlier, you can use dynamic disks (OS striped volumes) and the stripe size is always 64 KB. Note that this option is deprecated as of Windows 8/Windows Server 2012. For information, see the support statement at [Virtual Disk Service is transitioning to Windows Storage Management API](https://msdn.microsoft.com/library/windows/desktop/hh848071.aspx).

  * If you are using [Storage Spaces Direct (S2D)](/windows-server/storage/storage-spaces/storage-spaces-direct-in-vm) with [SQL Server Failover Cluster Instances](virtual-machines-windows-portal-sql-create-failover-cluster.md), you must configure a single pool. Note that although different volumes can be created on that single pool, they will all share the same characteristics, such as the same caching policy.

  * Determine the number of disks associated with your storage pool based on your load expectations. Keep in mind that different VM sizes allow different numbers of attached data disks. For more information, see [Sizes for Virtual Machines](../sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

  * If you are not using Premium Storage (dev/test scenarios), the recommendation is to add the maximum number of data disks supported by your [VM size](../sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and use Disk Striping.

* **Caching policy**: Note the following recommendations for caching policy depending on your storage configuration.

  * If you are using separate disks for data and log files, enable read caching on the data disks hosting your data files and TempDB data files. This can result in a significant performance benefit. Do not enable caching on the disk holding the log file as this causes a minor decrease in performance.

  * If you are using disk striping in a single storage pool, most workloads will benefit from read caching. If you have separate storage pools for the log and data files, enable read caching only on the storage pool for the data files. In certain heavy write workloads, better performance might be achieved with no caching. This can only be determined through testing.

  * The previous recommendations apply to Premium Storage disks. If you are not using Premium Storage, do not enable any caching on any data disks.

  * For instructions on configuring disk caching, see the following articles. For the classic (ASM) deployment model see: [Set-AzureOSDisk](https://msdn.microsoft.com/library/azure/jj152847) and [Set-AzureDataDisk](https://msdn.microsoft.com/library/azure/jj152851.aspx). For the Azure Resource Manager deployment model see: [Set-AzureRMOSDisk](https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmosdisk?view=azurermps-4.4.1) and [Set-AzureRMVMDataDisk](https://docs.microsoft.com/powershell/module/azurerm.compute/set-azurermvmdatadisk?view=azurermps-4.4.1).

     > [!WARNING]
     > Stop the SQL Server service when changing the cache setting of Azure VM disks to avoid the possibility of any database corruption.

* **NTFS allocation unit size**: When formatting the data disk, it is recommended that you use a 64-KB allocation unit size for data and log files as well as TempDB.

* **Disk management best practices**: When removing a data disk or changing its cache type, stop the SQL Server service during the change. When the caching settings are changed on the OS disk, Azure stops the VM, changes the cache type, and restarts the VM. When the cache settings of a data disk are changed, the VM is not stopped, but the data disk is detached from the VM during the change and then reattached.

  > [!WARNING]
  > Failure to stop the SQL Server service during these operations can cause database corruption.

## I/O guidance

* The best results with Premium Storage are achieved when you parallelize your application and requests. Premium Storage is designed for scenarios where the IO queue depth is greater than 1, so you will see little or no performance gains for single-threaded serial requests (even if they are storage intensive). For example, this could impact the single-threaded test results of performance analysis tools, such as SQLIO.

* Consider using [database page compression](https://msdn.microsoft.com/library/cc280449.aspx) as it can help improve performance of I/O intensive workloads. However, the data compression might increase the CPU consumption on the database server.

* Consider enabling instant file initialization to reduce the time that is required for initial file allocation. To take advantage of instant file initialization, you grant the SQL Server (MSSQLSERVER) service account with SE_MANAGE_VOLUME_NAME and add it to the **Perform Volume Maintenance Tasks** security policy. If you are using a SQL Server platform image for Azure, the default service account (NT Service\MSSQLSERVER) isn’t added to the **Perform Volume Maintenance Tasks** security policy. In other words, instant file initialization is not enabled in a SQL Server Azure platform image. After adding the SQL Server service account to the **Perform Volume Maintenance Tasks** security policy, restart the SQL Server service. There could be security considerations for using this feature. For more information, see [Database File Initialization](https://msdn.microsoft.com/library/ms175935.aspx).

* **autogrow** is considered to be merely a contingency for unexpected growth. Do not manage your data and log growth on a day-to-day basis with autogrow. If autogrow is used, pre-grow the file using the Size switch.

* Make sure **autoshrink** is disabled to avoid unnecessary overhead that can negatively affect performance.

* Move all databases to data disks, including system databases. For more information, see [Move System Databases](https://msdn.microsoft.com/library/ms345408.aspx).

* Move SQL Server error log and trace file directories to data disks. This can be done in SQL Server Configuration Manager by right-clicking your SQL Server instance and selecting properties. The error log and trace file settings can be changed in the **Startup Parameters** tab. The Dump Directory is specified in the **Advanced** tab. The following screenshot shows where to look for the error log startup parameter.

    ![SQL ErrorLog Screenshot](./media/virtual-machines-windows-sql-performance/sql_server_error_log_location.png)

* Setup default backup and database file locations. Use the recommendations in this article, and make the changes in the Server properties window. For instructions, see [View or Change the Default Locations for Data and Log Files (SQL Server Management Studio)](https://msdn.microsoft.com/library/dd206993.aspx). The following screenshot demonstrates where to make these changes.

    ![SQL Data Log and Backup files](./media/virtual-machines-windows-sql-performance/sql_server_default_data_log_backup_locations.png)
* Enable locked pages to reduce IO and any paging activities. For more information, see [Enable the Lock Pages in Memory Option (Windows)](https://msdn.microsoft.com/library/ms190730.aspx).

* If you are running SQL Server 2012, install Service Pack 1 Cumulative Update 10. This update contains the fix for poor performance on I/O when you execute select into temporary table statement in SQL Server 2012. For information, see this [knowledge base article](http://support.microsoft.com/kb/2958012).

* Consider compressing any data files when transferring in/out of Azure.

## Feature-specific guidance

Some deployments may achieve additional performance benefits using more advanced configuration techniques. The following list highlights some SQL Server features that can help you to achieve better performance:

* **Backup to Azure storage**: When performing backups for SQL Server running in Azure virtual machines, you can use [SQL Server Backup to URL](https://msdn.microsoft.com/library/dn435916.aspx). This feature is available starting with SQL Server 2012 SP1 CU2 and recommended for backing up to the attached data disks. When you backup/restore to/from Azure storage, follow the recommendations provided at [SQL Server Backup to URL Best Practices and Troubleshooting and Restoring from Backups Stored in Azure Storage](https://msdn.microsoft.com/library/jj919149.aspx). You can also automate these backups using [Automated Backup for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-automated-backup.md).

    Prior to SQL Server 2012, you can use [SQL Server Backup to Azure Tool](https://www.microsoft.com/download/details.aspx?id=40740). This tool can help to increase backup throughput using multiple backup stripe targets.

* **SQL Server Data Files in Azure**: This new feature, [SQL Server Data Files in Azure](https://msdn.microsoft.com/library/dn385720.aspx), is available starting with SQL Server 2014. Running SQL Server with data files in Azure demonstrates comparable performance characteristics as using Azure data disks.

## Next Steps

For more information about storage and performance, see [Storage Configuration Guidelines for SQL Server on Azure VM](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/09/25/storage-configuration-guidelines-for-sql-server-on-azure-vm/)

For security best practices, see [Security Considerations for SQL Server in Azure Virtual Machines](virtual-machines-windows-sql-security.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](virtual-machines-windows-sql-server-iaas-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](virtual-machines-windows-sql-server-iaas-faq.md).
