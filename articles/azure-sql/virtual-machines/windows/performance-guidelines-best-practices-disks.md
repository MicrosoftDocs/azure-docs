---
title: "Disks: Performance best practices & guidelines"
description: Disk, and IO best practices and guidelines to optimize the performance of your SQL Server on Azure Virtual Machine (VM).
services: virtual-machines-windows
documentationcenter: na
author: dplessMSFT
editor: ''
tags: azure-service-management
ms.assetid: a0c85092-2113-4982-b73a-4e80160bac36
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 02/03/2021
ms.author: dpless
ms.reviewer: mathoma
---
# Disks: Performance best practices for SQL Server on Azure VMs
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article provides disk guidance as part of a  series of best practices and guidelines to optimize performance for your SQL Server on Azure Virtual Machines (VMs).

To learn more, see the other articles in this series:   
[Quick checklist](performance-guidelines-best-practices-checklist.md), [Storage](performance-guidelines-best-practices-storage.md), [VM size](performance-guidelines-best-practices-vm-size.md), [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md), [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)


## Check list

- Monitor the application and determine storage latency requirements for SQL Server data, log, and tempdb files before choosing the disk type. Choose UltraDisks for latencies less than 1 ms, otherwise use Premium SSD. Provision different types of drives for the data and log files if the latency requirements vary. 
- Only use premium P30, P40, P50 disks for the data drive, and optimize for capacity on the log drive (P30 - P80).
- Optimize for highest uncached IOPS for best performance and leverage caching as a performance feature for data reads.
- Standard storage is only recommended for development and test purposes or for backup files and should not be used for production workloads.
- Bursting should be only considered for smaller departmental systems and dev/test workloads.
- Use Ultra Disks if less than 1-ms storage latencies are required for the transaction log and write acceleration is not an option. 


## Overview






## Next steps

To learn more, see the other articles in this series:
- [Quick checklist](performance-guidelines-best-practices-checklist.md)
- [VM size](performance-guidelines-best-practices-vm-size.md)
- [Storage](performance-guidelines-best-practices-storage.md)
- [Azure & SQL feature specific](performance-guidelines-best-practices-feature-specific.md)
- [Collect baseline](performance-guidelines-best-practices-collect-baseline.md)

For security best practices, see [Security considerations for SQL Server on Azure Virtual Machines](security-considerations-best-practices.md).

Review other SQL Server Virtual Machine articles at [SQL Server on Azure Virtual Machines Overview](sql-server-on-azure-vm-iaas-what-is-overview.md). If you have questions about SQL Server virtual machines, see the [Frequently Asked Questions](frequently-asked-questions-faq.md).
