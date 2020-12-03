---
title: "Feature specific: Performance best practices & guidance"
description: Provides SQL Server and Azure specific feature configuration guidelines to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
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
# Feature specific: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides SQL Server and Azure feature specific guidance a series of best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

To learn more, see the other articles in this series: [Quick checklist](performance-guidelines-best-practices-checklist.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Storage & disks](performance-guidelines-best-practices-storage-disks-io.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

## Overview

Some deployments may achieve additional performance benefits using more advanced configuration techniques. The following list highlights some SQL Server features that can help you to achieve better performance:

## Back up to Azure Storage
When performing backups for SQL Server running in Azure Virtual Machines, you can use [SQL Server Backup to URL](/sql/relational-databases/backup-restore/sql-server-backup-to-url). This feature is available starting with SQL Server 2012 SP1 CU2 and recommended for backing up to the attached data disks. When you backup/restore to/from Azure Storage, follow the recommendations provided at [SQL Server Backup to URL Best Practices and Troubleshooting and Restoring from Backups Stored in Azure Storage](/sql/relational-databases/backup-restore/sql-server-backup-to-url-best-practices-and-troubleshooting). You can also automate these backups using [Automated Backup for SQL Server on Azure Virtual Machines](../../../azure-sql/virtual-machines/windows/automated-backup-sql-2014.md).

Prior to SQL Server 2012, you can use [SQL Server Backup to Azure Tool](https://www.microsoft.com/download/details.aspx?id=40740). This tool can help to increase backup throughput using multiple backup stripe targets.

## SQL Server Data Files in Azure

This new feature, [SQL Server Data Files in Azure](/sql/relational-databases/databases/sql-server-data-files-in-microsoft-azure), is available starting with SQL Server 2014. Running SQL Server with data files in Azure demonstrates comparable performance characteristics as using Azure data disks.

## Failover cluster instance and Storage Spaces

If you are using Storage Spaces, when adding nodes to the cluster on the **Confirmation** page, clear the check box labeled **Add all eligible storage to the cluster**. 

![Uncheck eligible storage](./media/performance-guidelines-best-practices/uncheck-eligible-cluster-storage.png)

If you are using Storage Spaces and do not uncheck **Add all eligible storage to the cluster**, Windows detaches the virtual disks during the clustering process. As a result, they do not appear in Disk Manager or Explorer until the storage spaces are removed from the cluster and reattached using PowerShell. Storage Spaces groups multiple disks in to storage pools. For more information, see [Storage Spaces](/windows-server/storage/storage-spaces/overview).

## Multiple instances 

Consider the following best practices when deploying multiple SQL Server instances to a single virtual machine: 

- Set the max server memory for each SQL Server instance, ensuring there is memory left over for the operating system. Be sure to update the memory restrictions for the SQL Server instances if you change how much memory is allocated to the virtual machine. 
- Have separate LUNs for data, logs, and TempDB since they all have different workload patterns and you do not want them impacting each other. 
- Thoroughly test your environment under heavy production-like workloads to ensure it can handle peak workload capacity within your application SLAs. 

Signs of overloaded systems can include, but are not limited to, worker thread exhaustion, slow response times, and/or stalled dispatcher system memory. 


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
- [Storage, disks & IO](performance-guidelines-best-practices-storage-disks-io.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
