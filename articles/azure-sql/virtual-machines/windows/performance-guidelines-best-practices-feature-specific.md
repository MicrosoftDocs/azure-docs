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

To learn more, see the other articles in this series: [Quick checklist](performance-guidelines-best-practices-checklist.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Storage, disks & IO](performance-guidelines-best-practices-storage-disks-io.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

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


## Next steps

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage, disks & IO](performance-guidelines-best-practices-storage-disks-io.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
