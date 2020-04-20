---
title: Benefits of using Azure NetApp Files with Oracle database | Microsoft Docs
description: Describes the technology and provides a performance comparison between Oracle Direct NFS and the traditional NFS client. Shows the advantages of using dNFS with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/20/2020
ms.author: b-juche
---
# Benefits of using Azure NetApp Files with Oracle database

Direct NFS makes it possible for Oracle to drive much higher performance than the operating system's own NFS driver. This article explains the technology and provides a performance comparison between Oracle Direct NFS (dNFS) and the traditional NFS client (Kernel NFS). It also shows the advantages and the ease of using dNFS with Azure NetApp Files.  

## How Oracle Direct NFS Works

Direct NFS bypasses the operating system’s buffer cache. Data is cached just once in the user space, eliminating the overhead of memory copies.  

The traditional NFS client uses a single network flow, as the following example shows: 

![Traditional NFS client using a single network flow](../media/azure-netapp-files/solutions-traditional-nfs-client-using-single-network-flow.png)

In contrast, Oracle Direct NFS (dNFS) improves performance by load-balancing network traffic across multiple network flows. This capability enables the Oracle database to dynamically establish a significant number of 650 distinct network connections, as shown in the example below:  

![Oracle Direct NFS improving performance](../media/azure-netapp-files/solutions-oracle-direct-nfs-performance-load-balancing.png)

The [Oracle FAQ for Direct NFS](http://www.orafaq.com/wiki/Direct_NFS) shows that dNFS is an optimized NFS client that provides faster and more scalable access to NFS storage located on NAS storage devices (accessible over TCP/IP). Direct NFS is built directly into the database kernel just like ASM, which is mainly used with DAS or SAN storage. Therefore, *the guideline is to use Direct NFS when implementing NAS storage and use ASM when implementing SAN storage.*

Oracle dNFS is the default option in Oracle 18c also the default for RAC.

dNFS is available starting with Oracle 11g. As shown below, by using dNFS, an Oracle database running on an Azure virtual machine can drive significantly more I/O than the native NFS client, which uses a single network flow.

![Oracle and Azure NetApp Files comparing dNFS and native NFS](../media/azure-netapp-files/solutions-oracle-azure-netapp-files-comparing-dnfs-native-nfs.png)

You can enable or disable dNFS by running two commands and restarting the database.

To enable:  
`cd $ORACLE_HOME/rdbms/lib ; make -f ins_rdbms.mk dnfs_on`

To disable:  
`cd $ORACLE_HOME/rdbms/lib ; make -f ins_rdbms.mk dnfs_off`

## Azure NetApp Files combined with Oracle Direct NFS

You can leverage the performance of dNFS with the Azure NetApp Files service. The service gives you total control over your application performance.  It can meet extremely demanding applications.  Combining the performance benefits of dNFS with the high-performance capabilities of Azure NetApp Files provides great advantage to your workloads.

## Next steps

- [Solution architectures using Azure NetApp Files](azure-netapp-files-solution-architectures.md)
- [Overview of Oracle Applications and solutions on Azure](https://docs.microsoft.com/azure/virtual-machines/workloads/oracle/oracle-overview)