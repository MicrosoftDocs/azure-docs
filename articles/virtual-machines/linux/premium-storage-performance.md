---
title: 'Azure Premium Storage: Design for performance on Linux VMs | Microsoft Docs'
description: Design high-performance applications using Azure premium SSD managed disks. Premium Storage offers high-performance, low-latency disk support for I/O-intensive workloads running on Azure Virtual Machines.
author: roygara
ms.service: virtual-machines-linux
ms.topic: conceptual
ms.date: 06/27/2017
ms.author: rogarana
ms.subservice: disks
---
# Azure premium storage: design for high performance
[!INCLUDE [virtual-machines-common-premium-storage-introduction](../../../includes/virtual-machines-common-premium-storage-introduction.md)]

> [!NOTE]
> Sometimes, what appears to be a disk performance issue is actually a network bottleneck. In these situations, you should optimize your [network performance](../../virtual-network/virtual-network-optimize-network-bandwidth.md).
>
> If you are looking to benchmark your disk, see our article on [Benchmarking a disk](disks-benchmarks.md).
>
> If your VM supports accelerated networking, you should make sure it is enabled. If it is not enabled, you can enable it on already deployed VMs on both [Windows](../../virtual-network/create-vm-accelerated-networking-powershell.md#enable-accelerated-networking-on-existing-vms) and [Linux](../../virtual-network/create-vm-accelerated-networking-cli.md#enable-accelerated-networking-on-existing-vms).

Before you begin, if you are new to Premium Storage, first read the [Select an Azure disk type for IaaS VMs](disks-types.md) and [Scalability targets for premium page blob storage accounts](../../storage/blobs/scalability-targets-premium-page-blobs.md).


[!INCLUDE [virtual-machines-common-premium-storage-performance.md](../../../includes/virtual-machines-common-premium-storage-performance.md)]

If you are looking to benchmark your disk, see our article on [Benchmarking a disk](disks-benchmarks.md).

Learn more about the available disk types: [Select a disk type](disks-types.md)  

For SQL Server users, read articles on Performance Best Practices for SQL Server:

* [Performance Best Practices for SQL Server in Azure Virtual Machines](../../azure-sql/virtual-machines/windows/performance-guidelines-best-practices.md)
* [Azure Premium Storage provides highest performance for SQL Server in Azure VM](https://cloudblogs.microsoft.com/sqlserver/2015/04/23/azure-premium-storage-provides-highest-performance-for-sql-server-in-azure-vm/)
