---
title: "Storage, disks & IO: Performance best practices for SQL Server on Azure VMs"
description: Provides guidelines for optimizing SQL Server performance in Microsoft Azure Virtual Machines.
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
ms.date: 11/09/2020
ms.author: mathoma
ms.reviewer: jroth
---
# Storage, disks & IO: Performance best practices for SQL Server on Azure Virtual Machines
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides storage, disks and IO guidance as a series of performance best practices and guideline for SQL Server on Azure VMs. 

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)


## Storage guidance

For detailed testing of SQL Server performance on Azure Virtual Machines with TPC-E and TPC-C benchmarks, refer to the blog [Optimize OLTP performance](https://techcommunity.microsoft.com/t5/SQL-Server/Optimize-OLTP-Performance-with-SQL-Server-on-Azure-VM/ba-p/916794). 

Azure blob cache with premium SSDs is recommended for all production workloads. 

> [!WARNING]
> Standard HDDs and SSDs have varying latencies and bandwidth and are only recommended for dev/test workloads. Production workloads should use premium SSDs.

In addition, we recommend that you create your Azure storage account in the same data center as your SQL Server virtual machines to reduce transfer delays. When creating a storage account, disable geo-replication as consistent write order across multiple disks is not guaranteed. Instead, consider configuring a SQL Server disaster recovery technology between two Azure data centers. For more information, see [High Availability and Disaster Recovery for SQL Server on Azure Virtual Machines](business-continuity-high-availability-disaster-recovery-hadr-overview.md).

## Disks guidance

There are three main disk types on Azure virtual machines:

* **OS disk**: When you create an Azure virtual machine, the platform will attach at least one disk (labeled as the **C** drive) to the VM for your operating system disk. This disk is a VHD stored as a page blob in storage.
* **Temporary disk**: Azure virtual machines contain another disk called the temporary disk (labeled as the **D**: drive). This is a disk on the node that can be used for scratch space.
* **Data disks**: You can also attach additional disks to your virtual machine as data disks, and these will be stored in storage as page blobs.

The following sections describe recommendations for using these different disks.

### Operating system disk

An operating system disk is a VHD that you can boot and mount as a running version of an operating system and is labeled as the **C** drive.

Default caching policy on the operating system disk is **Read/Write**. For performance sensitive applications, we recommend that you use data disks instead of the operating system disk. See the section on Data Disks below.

### Temporary disk

The temporary storage drive, labeled as the **D** drive, is not persisted to Azure Blob storage. Do not store your user database files or user transaction log files on the **D**: drive.

Place TempDB on the local SSD `D:\` drive for mission critical SQL Server workloads (after choosing correct VM size). If you create the VM from the Azure portal or Azure quickstart templates and [place Temp DB on the Local Disk](https://techcommunity.microsoft.com/t5/SQL-Server/Announcing-Performance-Optimized-Storage-Configuration-for-SQL/ba-p/891583), then you do not need any further action; for all other cases follow the steps in the blog for  [Using SSDs to store TempDB](https://cloudblogs.microsoft.com/sqlserver/2014/09/25/using-ssds-in-azure-vms-to-store-sql-server-TempDB-and-buffer-pool-extensions/) to prevent failures after restarts. If the capacity of the local drive is not enough for your Temp DB size, then place Temp DB on a storage pool [striped](../../../virtual-machines/premium-storage-performance.md) on premium SSD disks with [read-only caching](../../../virtual-machines/premium-storage-performance.md#disk-caching).

For VMs that support premium SSDs, you can also store TempDB on a disk that supports premium SSDs with read caching enabled.


### Data disks

* **Use premium SSD disks for data and log files**: If you are not using disk striping, use two premium SSD disks where one disk contains the log file and the other contains the data. Each premium SSD provides a number of IOPS and bandwidth (MB/s) depending on its size, as depicted in the article, [Select a disk type](../../../virtual-machines/disks-types.md). If you are using a disk striping technique, such as Storage Spaces, you achieve optimal performance by having two pools, one for the log file(s) and the other for the data files. However, if you plan to use SQL Server failover cluster instances (FCI), you must configure one pool, or utilize [premium file shares](failover-cluster-instance-premium-file-share-manually-configure.md) instead.

   > [!TIP]
   > - For test results on various disk and workload configurations, see the following blog post: [Storage Configuration Guidelines for SQL Server on Azure Virtual Machines](/archive/blogs/sqlserverstorageengine/storage-configuration-guidelines-for-sql-server-on-azure-vm).
   > - For mission critical performance for SQL Servers that need ~ 50,000 IOPS, consider replacing 10 -P30 disks with an Ultra SSD. For more information, see the following blog post: [Mission critical performance with Ultra SSD](https://azure.microsoft.com/blog/mission-critical-performance-with-ultra-ssd-for-sql-server-on-azure-vm/).

   > [!NOTE]
   > When you provision a SQL Server VM in the portal, you have the option of editing your storage configuration. Depending on your configuration, Azure configures one or more disks. Multiple disks are combined into a single storage pool with striping. Both the data and log files reside together in this configuration. For more information, see [Storage configuration for SQL Server VMs](storage-configuration.md).

* **Disk striping**: For more throughput, you can add additional data disks and use disk striping. To determine the number of data disks, you need to analyze the number of IOPS and bandwidth required for your log file(s), and for your data and TempDB file(s). Notice that different VM sizes have different limits on the number of IOPs and bandwidth supported, see the tables on IOPS per [VM size](../../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). Use the following guidelines:

  * For Windows 8/Windows Server 2012 or later, use [Storage Spaces](/previous-versions/windows/it-pro/windows-server-2012-R2-and-2012/hh831739(v=ws.11)) with the following guidelines:

      1. Set the interleave (stripe size) to 64 KB (65,536 bytes) for OLTP workloads and 256 KB (262,144 bytes) for data warehousing workloads to avoid performance impact due to partition misalignment. This must be set with PowerShell.
      2. Set column count = number of physical disks. Use PowerShell when configuring more than 8 disks (not Server Manager UI). 

    For example, the following PowerShell creates a new storage pool with the interleave size to 64 KB and the number of columns equal to the amount of physical disk in the storage pool:

    ```powershell
    $PhysicalDisks = Get-PhysicalDisk | Where-Object {$_.FriendlyName -like "*2" -or $_.FriendlyName -like "*3"}
    
    New-StoragePool -FriendlyName "DataFiles" -StorageSubsystemFriendlyName "Storage Spaces*" `
        -PhysicalDisks $PhysicalDisks | New- VirtualDisk -FriendlyName "DataFiles" `
        -Interleave 65536 -NumberOfColumns $PhysicalDisks .Count -ResiliencySettingName simple `
        –UseMaximumSize |Initialize-Disk -PartitionStyle GPT -PassThru |New-Partition -AssignDriveLetter `
        -UseMaximumSize |Format-Volume -FileSystem NTFS -NewFileSystemLabel "DataDisks" `
        -AllocationUnitSize 65536 -Confirm:$false 
    ```

  * For Windows 2008 R2 or earlier, you can use dynamic disks (OS striped volumes) and the stripe size is always 64 KB. This option is deprecated as of Windows 8/Windows Server 2012. For information, see the support statement at [Virtual Disk Service is transitioning to Windows Storage Management API](/windows/win32/w8cookbook/vds-is-transitioning-to-wmiv2-based-windows-storage-management-api).

  * If you are using [Storage Spaces Direct (S2D)](/windows-server/storage/storage-spaces/storage-spaces-direct-in-vm) with [SQL Server Failover Cluster Instances](failover-cluster-instance-storage-spaces-direct-manually-configure.md), you must configure a single pool. Although different volumes can be created on that single pool, they will all share the same characteristics, such as the same caching policy.

  * Determine the number of disks associated with your storage pool based on your load expectations. Keep in mind that different VM sizes allow different numbers of attached data disks. For more information, see [Sizes for virtual machines](../../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

  * If you are not using premium SSDs (dev/test scenarios), the recommendation is to add the maximum number of data disks supported by your [VM size](../../../virtual-machines/sizes.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) and use disk striping.

* **Caching policy**: Note the following recommendations for caching policy depending on your storage configuration.

  * If you are using separate disks for data and log files, enable read caching on the data disks hosting your data files and TempDB data files. This can result in a significant performance benefit. Do not enable caching on the disk holding the log file as this causes a minor decrease in performance.

  * If you are using disk striping in a single storage pool, most workloads will benefit from read caching. If you have separate storage pools for the log and data files, enable read caching only on the storage pool for the data files. In certain heavy write workloads, better performance might be achieved with no caching. This can only be determined through testing.

  * The previous recommendations apply to premium SSDs. If you are not using premium SSDs, do not enable any caching on any data disks.

  * For instructions on configuring disk caching, see the following articles. For the classic (ASM) deployment model see: [Set-AzureOSDisk](/previous-versions/azure/jj152847(v=azure.100)) and [Set-AzureDataDisk](/previous-versions/azure/jj152851(v=azure.100)). For the Azure Resource Manager deployment model, see: [Set-AzOSDisk](/powershell/module/az.compute/set-azvmosdisk) and [Set-AzVMDataDisk](/powershell/module/az.compute/set-azvmdatadisk).

     > [!WARNING]
     > Stop the SQL Server service when changing the cache setting of Azure Virtual Machines disks to avoid the possibility of any database corruption.

* **NTFS allocation unit size**: When formatting the data disk, it is recommended that you use a 64-KB allocation unit size for data and log files as well as TempDB. If TempDB is placed on the temporary disk (D:\ drive) the performance gained by leveraging this drive outweighs the need for a 64-KB allocation unit size. 

* **Disk management best practices**: When removing a data disk or changing its cache type, stop the SQL Server service during the change. When the caching settings are changed on the OS disk, Azure stops the VM, changes the cache type, and restarts the VM. When the cache settings of a data disk are changed, the VM is not stopped, but the data disk is detached from the VM during the change and then reattached.

  > [!WARNING]
  > Failure to stop the SQL Server service during these operations can cause database corruption.


## I/O guidance

* The best results with premium SSDs are achieved when you parallelize your application and requests. Premium SSDs are designed for scenarios where the IO queue depth is greater than 1, so you will see little or no performance gains for single-threaded serial requests (even if they are storage intensive). For example, this could impact the single-threaded test results of performance analysis tools, such as SQLIO.

* Consider using [database page compression](/sql/relational-databases/data-compression/data-compression) as it can help improve performance of I/O intensive workloads. However, the data compression might increase the CPU consumption on the database server.

* Consider enabling instant file initialization to reduce the time that is required for initial file allocation. To take advantage of instant file initialization, you grant the SQL Server (MSSQLSERVER) service account with SE_MANAGE_VOLUME_NAME and add it to the **Perform Volume Maintenance Tasks** security policy. If you are using a SQL Server platform image for Azure, the default service account (NT Service\MSSQLSERVER) isn’t added to the **Perform Volume Maintenance Tasks** security policy. In other words, instant file initialization is not enabled in a SQL Server Azure platform image. After adding the SQL Server service account to the **Perform Volume Maintenance Tasks** security policy, restart the SQL Server service. There could be security considerations for using this feature. For more information, see [Database File Initialization](/sql/relational-databases/databases/database-instant-file-initialization).

* Be aware that **autogrow** is considered to be merely a contingency for unexpected growth. Do not manage your data and log growth on a day-to-day basis with autogrow. If autogrow is used, pre-grow the file using the Size switch.

* Make sure **autoshrink** is disabled to avoid unnecessary overhead that can negatively affect performance.

* Move all databases to data disks, including system databases. For more information, see [Move System Databases](/sql/relational-databases/databases/move-system-databases).

* Move SQL Server error log and trace file directories to data disks. This can be done in SQL Server Configuration Manager by right-clicking your SQL Server instance and selecting properties. The error log and trace file settings can be changed in the **Startup Parameters** tab. The Dump Directory is specified in the **Advanced** tab. The following screenshot shows where to look for the error log startup parameter.

    ![SQL ErrorLog Screenshot](./media/performance-guidelines-best-practices/sql_server_error_log_location.png)

* Set up default backup and database file locations. Use the recommendations in this article, and make the changes in the Server properties window. For instructions, see [View or Change the Default Locations for Data and Log Files (SQL Server Management Studio)](/sql/database-engine/configure-windows/view-or-change-the-default-locations-for-data-and-log-files). The following screenshot demonstrates where to make these changes.

    ![SQL Data Log and Backup files](./media/performance-guidelines-best-practices/sql_server_default_data_log_backup_locations.png)
* Enable locked pages to reduce IO and any paging activities. For more information, see [Enable the Lock Pages in Memory Option (Windows)](/sql/database-engine/configure-windows/enable-the-lock-pages-in-memory-option-windows).

* If you are running SQL Server 2012, install Service Pack 1 Cumulative Update 10. This update contains the fix for poor performance on I/O when you execute select into temporary table statement in SQL Server 2012. For information, see this [knowledge base article](https://support.microsoft.com/kb/2958012).

* Consider compressing any data files when transferring in/out of Azure.

## Next steps

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
